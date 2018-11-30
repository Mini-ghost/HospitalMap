var Key = "1KvTCKEUPkwf6Usl4gPGgPw5iksE6DErYnHs2zxsY2i0"
var hospitalAPI = "https://spreadsheets.google.com/feeds/list/"+ Key +"/1/public/values?alt=json"

var District = []

var AppData = {
  hospitalData: [],
  District: [],
  filterData: [],
  OptionSelect: "全部"
}

var vm = new Vue({
  el: "#app",
  data: AppData,
  methods: {
    optionClick: function(){
      var element , open
      SelectShow()
    },
    optionSelect: function(res){
      vm.OptionSelect = res
      SelectShow()
    },
    filter: function(res){
      this.filterData = this.hospitalData.filter((obj)=>{
        return obj.district == res
      })
      if(res == "全部"){
        this.filterData = this.hospitalData
      }
    }
  },
})

// 控制 select 開合
function SelectShow(){
  var element , open
  element = document.getElementsByClassName("optionBox")[0]
  element.classList.toggle("opt-hide")
  open = document.getElementsByClassName("select")[0]
  open.classList.toggle("active")
}

$.ajax({
  url: hospitalAPI,
  method: "get",
  success: function(res){
    vm.hospitalData = res.feed.entry.map((obj)=>({
      name: obj.gsx$醫院名稱.$t,
      time: obj.gsx$營業日.$t,
      web: obj.gsx$網站連結.$t,
      facebook: obj.gsx$粉絲專頁連結.$t,
      address: obj.gsx$地址.$t,
      positioning: obj.gsx$地址座標.$t.split(","),
      district: obj.gsx$所在地區.$t,
      scale: obj.gsx$醫院規模.$t,
      allDay: obj.gsx$是否為24h.$t,
      pet: obj.gsx$適用寵物類型.$t.split(", "),
      service: obj.gsx$服務類別.$t.split(", "),
      outward: obj.gsx$外觀照片網址.$t
    }))
    vm.filterData = vm.hospitalData
    vm.hospitalData.forEach((obj,index)=>{
      if(vm.District.indexOf(obj.district) == -1){
        vm.District.push(obj.district)
      }
    })
  },
  error: function(){
  }
})