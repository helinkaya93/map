import { detectType, setStorage, detectIcon } from "./helpers.js";
// title top in asaide
var mydate = new Date();

var year = mydate.getFullYear();

var month = mydate.getMonth();

var myday = mydate.getDate();

var day = mydate.getDay();

var dayarray = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
var montharray = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
var today = dayarray[day] + " " + myday + " " + montharray[month] + " " + year;
document.getElementById("date").innerHTML = today;

function title() {
  document.querySelector(".total_item").innerHTML =
    document.querySelectorAll(".item").length;
}
title();

// input add to item

function addInput() {
  document.querySelector(".add_btn").addEventListener("click", function () {
    if (document.querySelector(".add_description").value == "") {
      alert("Please enter a description");
    } else {
      var input = document.querySelector(".add_description").value;
      handleSubmit(input);

      if (document.querySelector(".add_description").value !== "") {
        clearField();
        title();
      }
    }
  });
}
addInput();

// click enter button to add description
function inputCrtl() {
  document
    .querySelector(".add_description")
    .addEventListener("keydown", function (e) {
      if (e.keyCode === 13) {
        var input = document.querySelector(".add_description").value;
        handleSubmit(input);

        // e.preventDefault();
        if (document.querySelector(".add_description").value !== "")
          clearField();
        title();
      }
    });
  document.querySelector(".container").addEventListener("click", function (e) {
    clearField();
  });
}
inputCrtl();

function clearField() {
  document.querySelector(".add_description").value = "";
  document.querySelector(".add_description").focus();
}

//! arrivals from html
const form = document.querySelector(".add_description");
const list = document.getElementById("list");

//! event handlers for form and list
form.addEventListener("submit", handleSubmit);
list.addEventListener("click", handleClick);

//! global values
var map;
var notes = JSON.parse(localStorage.getItem("notes")) || [];
var coords = [];
var layerGroup = [];

//! user loction learning
navigator.geolocation.getCurrentPosition(
  loadMap,
  console.log("user donot accept")
);

// map click
let zoomed, marker, circle;
function onMapClick(e) {
  document.querySelector(".add").style.display = "flex";
  console.log(e);
  coords = [e.latlng.lat, e.latlng.lng];
  icon(e.latlng.lat, e.latlng.lng);
}

function icon(x, y) {
  let lat = x;
  let lng = y;
  // let accuracy = e.coords.accuracy;
  if (marker) {
    console.log(4545);
    map.removeLayer(marker);
    map.removeLayer(circle);
  }
  marker = L.marker([lat, lng]).addTo(map);
  circle = L.circle([lat, lng]).addTo(map);
  if (!zoomed) {
    zoomed = map.fitBounds(circle.getBounds());
  }
  map.setView([lat, lng]);
}

//! printing on-screen map based on user's location
function loadMap(e) {
  // installs the map
  map = L.map("map").setView([e.coords.latitude, e.coords.longitude], 14);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 16,
    attribution: "© OpenStreetMap",
  }).addTo(map);

  // click on map add  x y
  layerGroup = L.layerGroup().addTo(map);

  // local'den noteları listeleme
  console.log(typeof notes);
  renderNoteList(notes);

  // it will work when there is an idea on the map
  map.on("click", onMapClick);
}

// works on submite form
function handleSubmit(task) {
  // e.preventDefault();
  document.querySelector(".add").style.display = "none";
  const desc = task;
  console.log(desc);
  // const date = e.target[1].value;
  // const status = e.target[2].value;

  // note add datas
  notes.push({
    id: new Date().getTime(),
    desc,
    coords,
  });

  // local storege change
  setStorage(notes);

  // liste note
  console.log(notes);
  renderNoteList(notes);

  // form.style.display = "none";
}

// create item
function renderNoteList(items) {
  // localStorage.clear();
  // clean note
  list.innerHTML = "";
  // localStorage.removeItem(notes);
  // clean
  layerGroup.clearLayers();
  console.log(items);

  console.log(typeof items);
  // creat any item
  items.forEach((item) => {
    // add id to the data
    // list.dataset.id = item.id;

    // background random
    var gradients = [
      "linear-gradient(to bottom, rgba(255,190,11, 1) 0%, rgba(255,190,11, 0.8) 100%)",
      "linear-gradient(to bottom, rgba(251, 86, 7, 1) 0%, rgba(251, 86, 7, 0.8) 100%)",
      "linear-gradient(to bottom, rgba(255,0,110, 1) 0%, rgba(255,0,110, 0.8) 100%)",
      "linear-gradient(to bottom, rgba(131, 56, 236, 1) 0%, rgba(131, 56, 236, 0.8) 100%)",
      "linear-gradient(to bottom, rgba(58,134,255, 1) 0%, rgba(58,134,255, 0.8) 100%)",
    ];
    var random_gradient =
      gradients[Math.floor(Math.random() * gradients.length)];
    var html = ` <div class="item" style="%style%" data-id="${item.id}" >
    <div class="item-description" id="desc" >${item.desc}</div>
    <div class="item-delet">
    
    <span class="material-symbols-outlined  item_go_btn" id="walk">
          directions_walk
        </span>
       
     
        
        <span class="material-symbols-outlined item_delet_btn" id="delete" >
          delete
        </span>
     
    </div>
  </div> `;
    var newHtml = html.replace("%style%", "background:" + random_gradient);
    list.insertAdjacentHTML("beforeend", newHtml);

    // renderMarker(item);
  });
}

// delet and walk buttons
function handleClick(e) {
  const id = e.target.parentElement.parentElement.dataset.id;
  console.log(id);

  if (e.target.className === "material-symbols-outlined item_delet_btn") {
    // donot know id donot delet

    notes = notes.filter((note) => note.id != id);

    setStorage(notes);
    document.querySelector(".total_item").innerHTML = notes.length;
    // update screen
    renderNoteList(notes);
  }

  if (e.target.className === "material-symbols-outlined  item_go_btn") {
    const note = notes.find((note) => note.id == id);

    map.flyTo(note.coords);
    icon(note.coords[0], note.coords[1]);
  }
}
