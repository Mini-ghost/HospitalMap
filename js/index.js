var Key = "1lshg7wIpbOx9SMeV325oZDhEx1zLJcpsZwVOmEDATBM"
var hospitalAPI = "https://spreadsheets.google.com/feeds/list/"+ Key +"/1/public/values?alt=json"

var District = []

var AppData = {
  hospitalData: [],
  District: [],
  OptionSelect: "選擇行政區"
}

var vm = new Vue({
  el: "#app",
  data: AppData,
  methods: {
    optionClick: function(){
      $(".optionBox").toggleClass("opt-hide")
    },
    optionSelect: function(res){
      this.OptionSelect = res
      $(".select").text(res)
      $(".optionBox").toggleClass("opt-hide")
    }
  },
})

// function createSelect(){
//   var selElmnt =  document.getElementById("selectBox")

//   var sel = document.createElement("div")
//   sel.setAttribute("class", "select")
//   sel.setAttribute("onclick", "vm.optionClick()") 
//   sel.innerHTML = vm.OptionSelect
//   selElmnt.appendChild(sel)
  
//   var opts = document.createElement("div")
//   opts.setAttribute("class", "optionBox opt-hide")
//   selElmnt.appendChild(opts)
  
//   vm.District.forEach((obj,index)=>{
//     var opt = document.createElement("div")
//     opt.setAttribute("class", "option")
//     opt.setAttribute("onclick", "vm.optionSelect('"+ obj +"')")
//     opt.innerHTML = obj
//     opts.appendChild(opt)
//   })
// }

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
    vm.hospitalData.forEach((obj,index)=>{
      if(vm.District.indexOf(obj.district) == -1){
        vm.District.push(obj.district)
      }
    })
    // createSelect();
  },
  error: function(){
  }
})