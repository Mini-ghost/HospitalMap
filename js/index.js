(function($,Vue){
  const Key = "1B1eNzcuoSqxskYxoHynO3EOj49Pchjg_8RkyjjcQIMo"
  const hospitalAPI = "https://spreadsheets.google.com/feeds/list/"+ Key +"/1/public/values?alt=json"

  const vetSelect = {
    type: false,
    data: {}
  }


  const vm = new Vue({
    el: "#app",
    data: {
      vetData: [],
      District: [
        {name: "中區", id: "400"},
        {name: "東區", id: "401"},
        {name: "南區", id: "402"}, 
        {name: "西區", id: "403"}, 
        {name: "北區", id: "404"}, 
        {name: "北屯區", id: "406"},
        {name: "西屯區", id: "407"},
        {name: "南屯區", id: "408"},
        {name: "太平區", id: "411"},
        {name: "大里區", id: "412"},
        {name: "霧峰區", id: "413"},
        {name: "烏日區", id: "414"},
        {name: "豐原區", id: "420"},
        {name: "后里區", id: "421"},
        {name: "石岡區", id: "422"},
        {name: "東勢區", id: "423"},
        {name: "和平區", id: "424"},
        {name: "新社區", id: "426"},
        {name: "潭子區", id: "427"},
        {name: "大雅區", id: "428"},
        {name: "神岡區", id: "429"},
        {name: "大肚區", id: "432"},
        {name: "沙鹿區", id: "433"},
        {name: "龍井區", id: "434"},
        {name: "梧棲區", id: "435"},
        {name: "清水區", id: "436"},
        {name: "大甲區", id: "437"},
        {name: "外埔區", id: "438"},
        {name: "大安區", id: "439"},
      ],
      Pets: [
        {name: "貓貓", value: "貓", id: "cat"},
        {name: "狗狗", value: "狗", id: "dog"},
        {name: "小老鼠", value: "鼠", id: "mouse"},
        {name: "兔子", value: "兔", id: "rabbit"},
        {name: "蜜袋鼯", value: "蜜袋鼯", id: "honeyBag"},
        {name: "小鳥", value: "鳥", id: "bird"},
        {name: "爬蟲類", value: "爬蟲類", id: "reptile"}
      ],
      timeData: "",
      districtFilter: "全部",
      PetFilter: "全部",
      isOpenFilter: "全部",
      position: [],
      vetSelect: vetSelect,
      pageNum: 1,
      dataPrePage: 12
    },
    async mounted(){
      this.position = await this.getPositioning()
      this.getTime()

      $.ajax({
        url: hospitalAPI,
        method: "get",
        success: this.successHandler
      })
    },
    methods: {
      // ajax success
      successHandler(res){
        console.log(res.feed.entry)
        this.vetData = res.feed.entry.map((obj)=>({
          name: obj.gsx$醫院名稱.$t,
          phone: obj.gsx$電話號碼.$t,
          time: obj.gsx$營業日.$t,
          detialTime: [
            obj.gsx$週一看診時間.$t,
            obj.gsx$週二看診時間.$t,
            obj.gsx$週三看診時間.$t,
            obj.gsx$週四看診時間.$t,
            obj.gsx$週五看診時間.$t,
            obj.gsx$週六看診時間.$t,
            obj.gsx$週日看診時間.$t
          ],
          // detialTime: obj.gsx$詳細看診時間.$t.replace(/[\u4e00-\u9fa5]{3}\s*/g,"").split("\n"),
          web: obj.gsx$網站網址.$t,
          facebook: obj.gsx$粉絲專頁網址.$t,
          address: obj.gsx$地址.$t,
          positioning: obj.gsx$座標.$t.split(","),
          district: obj.gsx$地區.$t,
          // scale: obj.gsx$醫院規模.$t,
          _24hr: obj.gsx$是否為24h.$t !== "否",
          pet: obj.gsx$適用寵物類型.$t.split(", "),
          service: obj.gsx$服務類別.$t.split(", "),
          outward: obj.gsx$外觀照片網址.$t,
        }))


        this.vetData.forEach((obj)=>{

          obj.todayRange = obj.detialTime[this.timeData]

          if(obj.todayRange !== undefined){
            obj.todayRange = obj.todayRange.split(", ")
            obj.isOpen = this.isOpen(obj.todayRange)
          }
  
          var x, y, distance
          x = this.position[0] - obj.positioning[0]
          y = this.position[1] - obj.positioning[1]
          distance = Math.sqrt(Math.pow(x,2) + Math.pow(y,2))
          
          obj.nearest = distance
        })
      },

      // 控制 select 開合
      selectShow(){
        let element , open
        element = document.getElementsByClassName("optionBox")[0]
        element.classList.toggle("opt-hide")
        open = document.getElementsByClassName("select")[0]
        open.classList.toggle("active")
      },

      // 取得使用者載入時間
      getTime(){
        let week = new Date().getDay()-1;
        if(week === -1){week = 6}
        this.timeData = week
      },

      // 取得使用者定位
      getPositioning(){
        return new Promise((resolve)=>{
          navigator.geolocation.watchPosition((res) => {
            var latitude, longitude
            latitude = res.coords.latitude
            longitude = res.coords.longitude
            resolve ([latitude,longitude])
            // this.position = [latitude,longitude]
            // this.canPosition = true
          }, () => {resolve ([])}) //this.canPosition = false
        })
      },

      // 比對醫院是否營業中
      isOpen(res){
        let arry, starTime, endTime
        let hrs, min, now
        let Comparison = []
    
        res.forEach((obj)=>{
          if(obj !== undefined){
            arry = obj.split("–")
            starTime = arry[0]
            endTime =  arry[1]
    
            hrs = new Date().getHours();
            min = new Date().getMinutes();
            if(hrs < 10){hrs = "0"+hrs}
            if(min < 10){min = "0"+min}
        
            now = hrs+":"+min
    
            if( now > starTime && now < endTime){Comparison.push(true)}
            else{Comparison.push(false)}
          }
        })
        var ans = Comparison.some((obj)=>{return obj === true})

        return ans? true : false
      },

      // Googole Map
      // detailMap(){
      //   var mapData = this.vetSelect.data
      //   var map = new google.maps.Map(document.querySelector('#map'),{
      //     center: {lat: Number(mapData.positioning[0]) ,lng: Number(mapData.positioning[1])},
      //     zoom: 18,
      //   })
    
      //   var marker = new google.maps.Marker({
      //     position: {lat: Number(mapData.positioning[0]) ,lng: Number(mapData.positioning[1])},
      //     map: map,
      //     title: mapData.name
      //   })
      // },

      // scrollBar
      scrollBar(){
        $('.detailBox').niceScroll({
          cursorcolor: '#F78500'
        })
      },

      // 下拉式選待開合控制
      selectClick(){this.selectShow()},
      optionClick(res){
        this.districtFilter = res
        this.selectShow()
      },
      // fiter 寵物類型選擇
      petSelect(res){this.PetFilter = res},

      // 是否營業中選擇
      isOpenSlect(res){this.isOpenFilter = res},

      // 詳細模式
      detail(res){
 
        this.vetSelect.data = res
        this.vetSelect.type = true
        this.detailMap()

        $("body").addClass("scrollbar-none")
        $('.detailBox').getNiceScroll().resize()
      },

      // 離開詳細模式
      closeDetail(){
        this.vetSelect.type = false
        $("body").removeClass("scrollbar-none")
        $('.detailBox').scrollTop(0)
      },

      // 分頁選擇
      pageSelect(obj){
        this.pageNum = obj
        $("html,body").animate({
          scrollTop: $(".vetContent").offset().top
        },600);
      }
    },
    computed: {
      // 篩選器
      filterData(){
        let District, Pet, isOpen ,filterArry
        District = this.districtFilter
        Pet = this.PetFilter
        isOpen = this.isOpenFilter
        filterArry = this.vetData
        
        if(District != "全部"){
          filterArry = filterArry.filter((obj)=>{return obj.district == District})
        }
        if(Pet != "全部"){
          filterArry = filterArry.filter((obj)=>{
            return obj.pet.indexOf(Pet) != -1
          })
        }
        if(isOpen != "全部"){
          filterArry = filterArry.filter((obj)=>{return obj.isOpen === isOpen})
        }
        this.pageNum = 1
        return filterArry.sort((a,b)=>{return a.nearest - b.nearest})
      },

      // 分頁
      dataPrePage(){return this.dataPrePage},
      pageNum(){return this.pageNum},
      totalPage(){return Math.ceil(this.filterData.length / this.dataPrePage)},

      // 是否可以定位
      canPosition(){return (this.position.length > 0)? true:false}

    }
  })

})($,Vue)