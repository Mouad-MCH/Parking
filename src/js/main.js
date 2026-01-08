/*---------------------*\
 * DATABASE
\ --------------------*/

let car_data = [
  { 
    plateNumber: "123-ABC", 
    type: "voiture", 
    entryTime: "06/01/2026T08:00:00Z", 
    exitTime: '06/01/2026T10:00:00Z', 
    // slotNumber: 1
  } 
]

let park_data = [
  { place: "A1", occupied: true  },

  { place: "A2", occupied: false },

  { place: "A3", occupied: false },

  { place: "A4", occupied: false },

  { place: "A5", occupied: false },

  { place: "A6", occupied: false },

  { place: "A7", occupied: false },

  { place: "A8", occupied: false },

  { place: "A9", occupied: true },

  { place: "A10", occupied: false },

  { place: "A11", occupied: false },

  { place: "A12", occupied: false },

  { place: "A13", occupied: false },

  { place: "A14", occupied: false },

  { place: "A15", occupied: false },

]


/*---------------------*\
 * DOM variable
\ --------------------*/

const places = document.getElementById("sw");
const types = document.querySelectorAll(".types .type");

const record_btn = document.getElementById("add_car");
const plate_input = document.getElementById("plate");
const date_input = document.getElementById("date");

/*---------------------*\
 * variable
\ --------------------*/

let time = new Date().toISOString();



/*---------------------*\
 * FITCH API
\ --------------------*/


/*---------------------*\
 * Functions
\ --------------------*/




// Creat place element 

function creatPlaceElment() {
  park_data.forEach(el => {

    places.innerHTML +=`<div class="place" name="${el.place}">${el.place}</div>`;

  })
}

creatPlaceElment()

const places_child = document.querySelectorAll(".sw .place")

// function check place in parking

function checkPlace() {

  places_child.forEach(el => {
    el.addEventListener("click", () => {
      el.classList.toggle("active")
      return el.place
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
  park_data.forEach(el => {
    if(el.place === e) {
      return el.occupied;
    }
  })
}

function changeOccupied(e, is) {
  park_data.forEach(el => {
    if (el.place === e) {
      el.occupied = is;
    }
  })
}

// record button

record_btn.addEventListener("click", () => {
  if (plate_input.value == "" || date_input.value == "" ||  isTrue(checkPlace()) ) {
    alert("Error")
    return
  }

  let plateNumber = plate_input.value;
  let activeEl = [...types].find(el => el.classList.contains("active"))
  let type = activeEl ? activeEl.getAttribute("name") : null

  let entryTime = time.toLocaleString()
  let exitTime = null

  car_data.push({ plateNumber, type, entryTime, exitTime })
  const place = document.querySelectorAll(".place");
  place.forEach(el => {
    if (el.classList.contains("active")) {
      changeOccupied(el.getAttribute("name"), true)
    }
  })
  alert("😁")
  console.log(car_data)
  console.log(park_data)
})

// let activeEl = types.find(el => el.classList.contains("active"))
// let type = activeEl ? activeEl.getAttribute("name") : null

// console.log(type)

console.log(car_data)

// add json to localStorage or json file

