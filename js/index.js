(function ($, Vue) {
    var vm = new Vue({
        el: '#app',
        data () {
            return {
                // ajax 原始
                ajaxData: new Array,
    
                // 調整過後
                vetData: new Array,

                lightBoxData: new Object,

                // 區域資料
                districts: [
                    { name: "中區", id: "400" }, { name: "東區", id: "401" },
                    { name: "南區", id: "402" }, { name: "西區", id: "403" }, 
                    { name: "北區", id: "404" }, { name: "北屯區", id: "406" },
                    { name: "西屯區", id: "407" }, { name: "南屯區", id: "408" },
                    { name: "太平區", id: "411" }, { name: "大里區", id: "412" },
                    { name: "霧峰區", id: "413" }, { name: "烏日區", id: "414" },
                    { name: "豐原區", id: "420" }, { name: "后里區", id: "421" },
                    { name: "石岡區", id: "422" }, { name: "東勢區", id: "423" },
                    { name: "和平區", id: "424" }, { name: "新社區", id: "426" },
                    { name: "潭子區", id: "427" }, { name: "大雅區", id: "428" },
                    { name: "神岡區", id: "429" }, { name: "大肚區", id: "432" },
                    { name: "沙鹿區", id: "433" }, { name: "龍井區", id: "434" },
                    { name: "梧棲區", id: "435" }, { name: "清水區", id: "436" },
                    { name: "大甲區", id: "437" }, { name: "外埔區", id: "438" },
                    { name: "大安區", id: "439" }
                ],
    
                // 動物分類
                pets: [
                    { name: "貓貓", value: "貓", id: "cat" },
                    { name: "狗狗", value: "狗", id: "dog" },
                    { name: "小老鼠", value: "鼠", id: "mouse" },
                    { name: "兔子", value: "兔", id: "rabbit" },
                    { name: "蜜袋鼯", value: "蜜袋鼯", id: "honeyBag" },
                    { name: "小鳥", value: "鳥", id: "bird" },
                    { name: "爬蟲類", value: "爬蟲類", id: "reptile" }
                ],

                weekArray: ['一', '二', '三', '四', '五', '六', '日'],

                pageDataQuantity: 12,
                pageDataNow: 1,

                lightBoxType: false,
                bodyType: false,
                navType: false,

                districtText: '地區選擇',
                districtFilter: '',
                petFilter: '',
                isOpenFilter: ''
                
            }
        },
        async mounted() {

            var key = '1B1eNzcuoSqxskYxoHynO3EOj49Pchjg_8RkyjjcQIMo',
                url = `https://spreadsheets.google.com/feeds/list/${key}/1/public/values?alt=json`
            
            this.position = await this.getPositioning()
            this.getTodayDay()
            this.$html = $('html')
            
            $.ajax({
                url: url,
                method: 'get',
                success: this.ajaxSuccessHandler
            })  
            window.addEventListener('keyup',this.closeLightBoxHandler)
        },
        methods: {
            // AJAX 載入
            ajaxSuccessHandler(res) {
                this.ajaxData = res
                this.vetData = res.feed.entry.map(obj => ({
                    name: obj.gsx$醫院名稱.$t,
                    phone: obj.gsx$電話號碼.$t,
                    time: obj.gsx$營業日.$t,
                    detailTime: [
                        obj.gsx$週一看診時間.$t,
                        obj.gsx$週二看診時間.$t,
                        obj.gsx$週三看診時間.$t,
                        obj.gsx$週四看診時間.$t,
                        obj.gsx$週五看診時間.$t,
                        obj.gsx$週六看診時間.$t,
                        obj.gsx$週日看診時間.$t
                    ],
                    web: obj.gsx$網站網址.$t,
                    facebook: obj.gsx$粉絲專頁網址.$t,
                    positioning: obj.gsx$座標.$t.split(","),
                    district: obj.gsx$地區.$t,
                    address: obj.gsx$地址.$t,
                    is24hr: obj.gsx$是否為24h.$t !== "否",
                    pet: obj.gsx$適用寵物類型.$t.split(", "),
                    service: obj.gsx$服務類別.$t.split(", "),
                    outward: obj.gsx$外觀照片網址.$t,
                }))

                this.vetData.forEach(obj => {
                    var x, y, distance 

                    obj.todayData = obj.detailTime[this.today]
                    obj.todayData = obj.todayData.split(", ")
                    obj.isOpen = this.isOpenHandler(obj.todayData)

                    x = this.position[0] - obj.positioning[0]
                    y = this.position[1] - obj.positioning[1]
                    distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
                    
                    obj.distance = distance
                })

                this.vetData.sort((a, b) => { return a.distance - b.distance })

            },
            // 取得使用者定位
            getPositioning() {
                return new Promise(resolve => {
                    navigator.geolocation.watchPosition(res => {
                        var latitude = res.coords.latitude,
                            longitude = res.coords.longitude
                        resolve([latitude, longitude])
                    }, () => { resolve([]) }
                    )
                })
            },
            getTodayDay() {
                var week = new Date().getDay() - 1;
                if (week === -1) week = 6
                this.today = week
            },
            isOpenHandler(data) {

                var comparison = new Array
                var date = new Date()
                var timeArray, starTime, endTime
                var hh = date.getHours(), mm = date.getMinutes(), now

                data.forEach(obj => {
                    if (obj !== undefined && obj !== '休息') {
                        timeArray = obj.split("–")
                        starTime = timeArray[0]
                        endTime = timeArray[1]
                        if (hh < 10) hh = '0' + hh
                        if (mm < 10) mm = '0' + mm
                        now = `${hh}:${mm}`
                        if (now > starTime && now < endTime) comparison.push(true)
                        else comparison.push(false)
                    }
                    else {
                        comparison.push(false)
                    }
                })
                return comparison.some(obj => { return obj === true })

            },
            closeLightBoxHandler(e) {
                if (!this.bodyType) return
                if (e.keyCode === 27 || e.type === 'click') {
                    this.lightBoxType = false
                    this.lightBoxData = new Object
                    this.bodyLockHandler()
                }
            },
            lightBoxHandler(data) {
                this.lightBoxType = true
                this.lightBoxData = data
                this.bodyLockHandler()
            },
            pageSelectHandler(data) {
                this.pageDataNow = data
                this.$html.animate({
                    scrollTop: $('section').offset().top
                }, 500)
            },
            bodyLockHandler() {
                var body = document.body;
                var html = document.documentElement;
                var distance = -(html.scrollTop + body.scrollTop)
                var bodyTop = bodyTop = Math.abs(parseFloat(body.style.top))
                if (this.bodyType) {
                    this.bodyType = false
                    body.removeAttribute('style')
                    html.scrollTop = body.scrollTop = bodyTop
                    return
                }
                this.bodyType = true
                body.style.width =  `calc(100% - ${this.scrollBarWidth}px)`
                body.style.top = distance + 'px'
                body.style.position = 'fixed'
            },
            selectHandler(e) {
                var dom = e.currentTarget
                var group = dom.querySelector('.select__group')
                var $group = $(group)
                $group.slideToggle(500)
            },
            optionHandler(e, data) {
                var dom = e.currentTarget
                var group = dom.parentNode
                var $group = $(group)
                this.districtText = this.districtFilter = data
                $group.slideUp(500)
            },
            // 打開導覽列
            openNavHandler() {
                this.navType = !this.navType
                this.bodyLockHandler()
            },
            // 篩選
            patFilerHandler(data) {
                this.petFilter = data
                this.pageDataNow = 1                
            },
            isOpenFilterHandler(data) {
                this.isOpenFilter = data
            }
        },
        computed: {
            filterData() {
                let district, pet, isOpen, filterArry 
                district = this.districtFilter
                pet = this.petFilter
                isOpen = this.isOpenFilter
                filterArry = this.vetData
                if (district) filterArry = filterArry.filter(obj => { return obj.district === district })
                if (pet) filterArry = filterArry.filter(obj => { return obj.pet.indexOf(pet) !== -1 })
                if (isOpen) filterArry = filterArry.filter(obj => { return obj.isOpen === isOpen })
                return filterArry
            },
            pageTotal() {
                return Math.ceil(this.filterData.length / this.pageDataQuantity)
            },
            pageContentData() {
                var array = new Array
                var x = this.pageDataQuantity,
                    y = this.pageDataNow
                this.filterData.forEach((obj, i) => {
                    if (i >= x * (y - 1) && i < x * y) { array.push(obj) }
                })
                return array
            },
            scrollBarWidth() {
                return window.innerWidth - document.documentElement.clientWidth;
            },
        }
    
    })

    Vue.component('lightBox', {
        template: '#lightBox',
        // prop: [lightBoxData]
    })

})($, Vue)





