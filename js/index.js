var Key = "1KvTCKEUPkwf6Usl4gPGgPw5iksE6DErYnHs2zxsY2i0"
var hospitalAPI = "https://spreadsheets.google.com/feeds/list/"+ Key +"/1/public/values?alt=json"

var District = [
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
]

var Pets = [
  {name: "貓貓", value: "貓", id: "cat"},
  {name: "狗狗", value: "狗", id: "dog"},
  {name: "小老鼠", value: "鼠", id: "mouse"},
  {name: "兔子", value: "兔", id: "rabbit"},
  {name: "蜜袋鼯", value: "蜜袋鼯", id: "honeyBag"},
  {name: "小鳥", value: "鳥", id: "bird"},
  {name: "爬蟲類", value: "爬蟲類", id: "reptile"}
]

var AppData = {
  vetData: [],
  nearestData: [],
  District: District,
  Pets: Pets,
  timeData: "",
  districtFilter: "全部",
  PetFilter: "全部",
  isOpenFilter: "全部",
  position: [],
}

var vm = new Vue({
  el: "#app",
  data: AppData,
  methods: {
    optionClick: function(){
      SelectShow()
    },
    optionSelect: function(res){
      vm.districtFilter = res
      SelectShow()
    },
    petSelect: function(res){
      this.PetFilter = res
    },
    isOpenSlect: function(res){
      this.isOpenFilter = res
    },
    filter: function(res){
      this.filterData = this.vetData.filter((obj)=>{
        return obj.district == res
      })
      if(res == "全部"){
        this.filterData = this.vetData
      }
    }
  },
  computed: {
    filterData: function(){
      var District, Pet, isOpen ,filterArry
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
      
      return filterArry.sort((a,b)=>{return a.nearest - b.nearest})
    },
  }
})

Time() // 載入時間資料
Positioning() // 載入使用者定位

// 載入 API
$.ajax({
  url: hospitalAPI,
  method: "get",
  success: function(res){
    vm.vetData = res.feed.entry.map((obj)=>({
      name: obj.gsx$醫院名稱.$t,
      time: obj.gsx$營業日.$t,
      detialTime: obj.gsx$詳細看診時間.$t.replace(/[\u4e00-\u9fa5]{3}\s*/g,"").split("\n"),
      web: obj.gsx$網站連結.$t,
      facebook: obj.gsx$粉絲專頁連結.$t,
      address: obj.gsx$地址.$t,
      positioning: obj.gsx$地址座標.$t.split(","),
      district: obj.gsx$所在地區.$t,
      scale: obj.gsx$醫院規模.$t,
      _24hr: obj.gsx$是否為24h.$t !== "否",
      pet: obj.gsx$適用寵物類型.$t.split(", "),
      service: obj.gsx$服務類別.$t.split(", "),
      outward: obj.gsx$外觀照片網址.$t,
    }))
    vm.vetData.forEach((obj)=>{
      obj.todayRangr = obj.detialTime[vm.timeData]
      if(obj.todayRangr != undefined){
        obj.todayRangr = obj.todayRangr.split(", ")
        obj.isOpen = isOpen(obj.todayRangr)
      }

      var x, y, distance
      x = vm.position[0] - obj.positioning[0]
      y = vm.position[1] - obj.positioning[1]
      distance = Math.sqrt(Math.pow(x,2) + Math.pow(y,2))
      
      obj.nearest = distance
    })
  },
  error: function(){
  }
})

// 控制 select 開合
function SelectShow(){
  var element , open
  element = document.getElementsByClassName("optionBox")[0]
  element.classList.toggle("opt-hide")
  open = document.getElementsByClassName("select")[0]
  open.classList.toggle("active")
}

// 時間函數
function Time(){
  var week = new Date().getDay()-1;
  if(week == -1){week = 6}
  vm.timeData = week
}

// 比對醫院是否營業中
function isOpen(res){
  var arry, starTime, endTime
  var hrs, min, now
  var Comparison = []
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
      if( now > starTime && now < endTime){
        Comparison.push(true)
      }else{
        Comparison.push(false)
      }
    }
  })
  var ans = Comparison.some((obj3)=>{
    return obj3 == true
  })
  return ans? true : false
}

// 使用者定位
function Positioning(){
  function success(res){
    var latitude, longitude
    latitude = res.coords.latitude
    longitude = res.coords.longitude
    vm.position = [latitude,longitude]
  }
  function error(){}
  navigator.geolocation.watchPosition(success, error)
}