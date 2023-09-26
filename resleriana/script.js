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
  await askTime();
  clockTick();
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

var serverTime = {
  valid: false,
  date: "",
  time: 0,
};

function clockTick() {
  if (serverTime.valid) {
    serverTime.time += 1;
    updateTime();
  }
  setTimeout(clockTick, 1000);
}

async function askTime() {
  var xmlHttp = new XMLHttpRequest();

  xmlHttp.open("GET", "http://worldtimeapi.org/api/timezone/Japan", true);
  xmlHttp.onload = function () {
    if (xmlHttp.status == 200) {
      serverTime = datetimeToObj(JSON.parse(xmlHttp.responseText).datetime);
    }
  };

  xmlHttp.send(null);
}

function updateTime() {
  document.getElementById("current-time").innerHTML = `Date : ${
    serverTime.date
  } <br> Server Time : ${intToTime(serverTime.time).hours}:${
    intToTime(serverTime.time).minutes
  }:${intToTime(serverTime.time).seconds}`;

  document.getElementById("reset-countdown").innerHTML = `Reset : ${
    intToTime(86400 - serverTime.time).hours
  }:${intToTime(86400 - serverTime.time).minutes}:${
    intToTime(86400 - serverTime.time).seconds
  }`;

  var pieTime =
    serverTime.time < 43200 ? 43200 : serverTime.time < 64800 ? 64800 : 129600;
  document.getElementById("pie-countdown").innerHTML = `Next Pie : ${
    intToTime(pieTime - serverTime.time).hours
  }:${intToTime(pieTime - serverTime.time).minutes}:${
    intToTime(pieTime - serverTime.time).seconds
  }`;
}

function intToTime(integer) {
  var time = {
    hours: Math.floor(integer / 3600),
    minutes: Math.floor((integer % 3600) / 60),
    seconds: (integer % 3600) % 60,
  };
  return time;
}

function datetimeToObj(datetime) {
  var object = {
    valid: datetime ? true : false,
    date: datetime.split("T")[0],
    time:
      parseInt(datetime.split("T")[1].split(".")[0].split(":")[0]) * 3600 +
      parseInt(datetime.split("T")[1].split(".")[0].split(":")[1]) * 60 +
      parseInt(datetime.split("T")[1].split(".")[0].split(":")[2]),
  };
  return object;
}
