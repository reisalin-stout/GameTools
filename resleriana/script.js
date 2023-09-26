var database;

async function getDatabase() {
  fetch("./data/database.json")
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      database = json.data;
      tableLoad();
    })
    .catch((err) => {
      document.getElementById("error-text").innerHTML =
        "error: [" + err + "]<br>Please contact me on Discord at .reisalin.";
      document.getElementById("error-text").classList().add("visible");
    });
}

function tableLoad() {
  var div = document.getElementById("character-selector-container");
  for (var e = 0; e < database.length; e++) {
    var character = document.createElement("div");
    character.setAttribute("class", "character-select");
    var elem =
      "<img class='chara-icon' src='./images/icon_" +
      database[e].name +
      ".jpg'/>";
    character.innerHTML = elem;
    div.appendChild(character);
  }
}

function openPage(address) {
  console.log(address);
  document.getElementById(address).classList.remove("hidden");
  document.getElementById(address).classList.add("active");
}

//Main function
async function main() {
  await getDatabase();
  await askTime(setTime);
}

//Event Listeners
document.addEventListener("DOMContentLoaded", function () {
  resizeTable();
  main();
});

function resizeTable() {
  var r = document.querySelector(":root");
  r.style.setProperty("--page-width", window.innerWidth + "px");
}

window.addEventListener("resize", resizeTable);

function setTime(time) {
  console.log(time.hour, time.minute, time.seconds);
  document.getElementById("current-time").innerHTML =
    time.hour + ":" + time.minute + ":" + time.seconds;
}

async function askTime(callback) {
  var xmlHttp = new XMLHttpRequest();

  xmlHttp.open(
    "GET",
    "https://www.timeapi.io/api/Time/current/zone?timeZone=Japan",
    true
  );
  xmlHttp.onload = function () {
    if (xmlHttp.status == 200) {
      callback(xmlHttp.responseText);
    }
  };

  xmlHttp.send(null);
}
