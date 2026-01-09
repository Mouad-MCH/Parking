/*---------------------*\
 * DATABASE
\ --------------------*/

// let car_data = [
//   { 
//     plateNumber: "123-ABC", 
//     type: "voiture", 
//     entryTime: "06/01/2026T08:00:00Z", 
//     exitTime: '06/01/2026T10:00:00Z', 
//     // slotNumber: 1
//   } 
// ]

// let park_data = [
//   { place: "A1", occupied: true  },

//   { place: "A2", occupied: false },

//   { place: "A3", occupied: false },

//   { place: "A4", occupied: false },

//   { place: "A5", occupied: false },

//   { place: "A6", occupied: false },

//   { place: "A7", occupied: false },

//   { place: "A8", occupied: false },

//   { place: "A9", occupied: true },

//   { place: "A10", occupied: false },

//   { place: "A11", occupied: false },

//   { place: "A12", occupied: false },

//   { place: "A13", occupied: false },

//   { place: "A14", occupied: false },

//   { place: "A15", occupied: false },

// ]

// setData("park_data", park_data)


/*---------------------*\
 * DOM variable
\ --------------------*/

const places = document.getElementById("sw");
const types = document.querySelectorAll(".types .type");

const record_btn = document.getElementById("add_car");
const plate_input = document.getElementById("plate");
const date_input = document.getElementById("date");

let quite_display = document.querySelector(".display");
let quite_info = document.querySelector(".display .info");
let quite_btn = document.querySelector(".quite_btn");

let history_info = document.querySelector(".history_info")

/*---------------------*\
 * variable
\ --------------------*/

let now = new Date().toISOString();
let [time] = now.split(".");

const [timePart, datePart] = time.split("T")




/*---------------------*\
 * FITCH API
\ --------------------*/

const url_park = "http://localhost:3000/park_data";
const url_car = "http://localhost:3000/car_data";

// GET data from API
async function fetchData(url) {
  const res = await fetch(url)
  let data = await res.json()
  return data
}

// SET Data TO API
const postData = async (data,url) => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
       "Content-Type": "application/json",
    },
    body : JSON.stringify(data)
  });
  
}

// UPDATE data ON API

const updateData = async (id,url,data) => {
  const res = await fetch(`${url}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
}

 let car_data = await fetchData(url_car) || [];
 let park_data = await fetchData(url_park) || [];

/*---------------------*\
 * Functions
\ --------------------*/




// Creat place element 

function creatPlaceElment() {
  park_data.forEach(el => {

    places.innerHTML +=`<div class="place" name="${el.place}">${el.place}</div>`;

  })

  car_data.forEach(el => {
    if(el.exitTime !== null) {

      let totalTime = calcTime(el.entryTime, el.exitTime);
      let prix = price(totalTime , el.type);

      let [date] = (el.entryTime).split('T');

             history_info.innerHTML += ` 
     
               <div class="item mb-5 w-full flex-bet p-2 ring ring-white rounded-lg shadow-sm cursor-pointer hover:shadow-amber-100">
                 <div class="flex justify-items-center gap-3">
     
                   <div class="car_img w-10 rounded-lg overflow-hidden p-1 bg-white">
                     <img src="public/sport-car.png" class="w-full" alt="">
                   </div>
     
                   <div class="car_info">
                     <h1 class="font-bold">${el.type}</h1>
                     <p class="text-[12px] text-gray-400">${el.plateNumber}</p>
                   </div>
                 </div>
     
                 <div>
                   <div class="font-bold">Time: <span class="text-button">${totalTime}</span></div>
                   <div class="font-bold">Date : <span class="text-button">${date}</span></div>
                 </div>
     
                 <div id="price" class="font-bold text-button">${prix} DH</div>
     
               </div>
         `
    }
  })
}

creatPlaceElment()

const places_child = document.querySelectorAll(".sw .place")

// function check place in parking

function checkPlace() {

  places_child.forEach(el => {
    el.addEventListener("click", () => {
      if(!isTrue(el.getAttribute("name"))) {
        el.classList.toggle("active")
        el.classList.toggle("T")
      }
    })
  })

}
checkPlace()

// function check types

function checkTypes() {
  types.forEach((el) => {
    el.addEventListener("click", () => {
      types.forEach(el => el.classList.remove("active"))
      el.classList.add('active')
    })
    
    
  })
}

checkTypes()

// function of add car in park

function addCarr() {
  park_data.forEach((el) => {
    if (el.occupied) {
      document.querySelector(`[name = ${el.place} ]`).innerHTML = `<img class="img_park" src="public/car_topview.svg" alt="">`;

      document.querySelector(`[name = ${el.place}]`).classList.add("active")
    }
  })
}

addCarr()

// function place isTrue

function isTrue(e) {
  const s = park_data.find(el => el.place === e);
  return s ? s.occupied : false;
}


function changeOccupied(e, is) {
  park_data.forEach(el => {
    if (el.place === e) {
      el.occupied = is;
      updateData(el.id, url_park, el)
    }
  })
}

// function get selecte place 

function getSelectedPlace() {
  const selected = document.querySelector(".place.active.T");
  return selected ? selected.getAttribute("name") : null;
}


// record button

record_btn.addEventListener("click", () => {

  let selecte = getSelectedPlace()

  if (plate_input.value == "" || date_input.value == "" || !selecte ||  isTrue(selecte) ) {
    alert("Error")
    return
  }

  let plateNumber = plate_input.value;

  let activeEl = [...types].find(el => el.classList.contains("active"))
  let type = activeEl ? activeEl.getAttribute("name") : null

  let entryTime = now.toLocaleString()
  let exitTime = null;
  let slotNumber;

  const place = document.querySelectorAll(".place");
  place.forEach(el => {
    if (el.classList.contains("active") && !isTrue(el.getAttribute("name"))) {
       slotNumber = el.getAttribute("name");
      changeOccupied(el.getAttribute("name"), true)
    }
  })

  car_data.push({ plateNumber, type, entryTime, exitTime, slotNumber})

   postData({ plateNumber, type, entryTime, exitTime, slotNumber},url_car)
  alert("😁")
})


// add json to localStorage or json file

function setData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// get Data from localStorage

function getData(name) {
 return JSON.parse(localStorage.getItem(name))
}


// function Quite

places.addEventListener("click", async (e) => {
  let element = e.target.parentElement;

  let x = await fetchData(url_car) || [];
  

  x.forEach(el => {
    if(element.getAttribute("name") === el.slotNumber) {
        let [date_entre, time_entry] =(el.entryTime).split('T');
        let date_quite = now.toLocaleString();
        let time_quite = calcTime(el.entry,date_quite);

        let prix = price(time_quite, el.type);     
      
      quite_info.innerHTML = `
          <div class="car_img w-10 rounded-lg overflow-hidden p-1 bg-white">
            <img src="public/sport-car.png" class="w-full" alt="">
          </div>

          <div>
            <h2 class="font-bold">${el.type}</h2>
            <p class="text-gray-400 text-[12px]">${el.plateNumber}</p>
          </div>

          <p>${time_entry}</p>`;

       quite_btn.addEventListener("click", () => {
    
     
         history_info.innerHTML += ` 
     
               <div class="item mb-5 w-full flex-bet p-2 ring ring-white rounded-lg shadow-sm cursor-pointer hover:shadow-amber-100">
                 <div class="flex justify-items-center gap-3">
     
                   <div class="car_img w-10 rounded-lg overflow-hidden p-1 bg-white">
                     <img src="public/sport-car.png" class="w-full" alt="">
                   </div>
     
                   <div class="car_info">
                     <h1 class="font-bold">${el.type}</h1>
                     <p class="text-[12px] text-gray-400">${el.plateNumber}</p>
                   </div>
                 </div>
     
                 <div>
                   <div class="font-bold">Time: <span class="text-button">${time_quite}</span></div>
                   <div class="font-bold">Date : <span class="text-button">${date_entre}</span></div>
                 </div>
     
                 <div id="price" class="font-bold text-button">${prix} DH</div>
     
               </div>
         `

     
         quite_info.children.remove;
     
         changeOccupied(element.getAttribute("name"), false);

         el.exitTime = date_quite;
         updateData(el.id, url_car, el)
     
     
       })


    }
  })


  
})


// calcule price total 

function price(time, type) {
  let total = 0;
  switch(type) {
    case "car": total = Number(time[0]) * 10
    break;
    case "motorcycle" : total = Number(time[0]) * 5
    break;
    case "camio": total = Number(time[0]) * 20
    break;
  }

  return total;
}

function calcTime(entryTime,exitTime) {
  // let [date,time1] = entryTime.split('T');
  // let [,time2] = exitTime.split('T');

  let entry = new Date(entryTime);
  let exit = new Date(exitTime);

  let deff = exit - entry;

  let s = Math.floor(deff / 1000)
  let hours = Math.floor(s / 3600);
  let minute = Math.floor((s % 3600) / 60);

  return `${hours}h:${minute}min`

}