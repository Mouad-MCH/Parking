/*---------------------*\
 * DATABASE
\ --------------------*/

let car_data = [
  { 
    plateNumber: "123-ABC", 
    type: "voiture", 
    entryTime: "06/01/2026T08:00:00Z", 
    exitTime: '06/01/2026T10:00:00Z', 
    slotNumber: 1
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

  { place: "A9", occupied: false },

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

/*---------------------*\
 * variable
\ --------------------*/





/*---------------------*\
 * FITCH API
\ --------------------*/


/*---------------------*\
 * Functions
\ --------------------*/




// Creat place element 

function creatPlaceElment() {
  park_data.forEach(el => {

    places.innerHTML +=`<div class="place">${el.place}</div>`;

  })
}

creatPlaceElment()

const places_child = document.querySelectorAll(".sw .place")

// function check place in parking

function checkPlace() {

  places_child.forEach(el => {
    el.addEventListener("click", () => {
      el.classList.toggle("active")
      
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
