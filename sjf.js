
let proInfo = null;
const storedDataa = localStorage.getItem("pInfo");
proInfo = JSON.parse(storedDataa);
proInfo = proInfo.data;

let size = proInfo.length;
let process = [];
for (let i = 0; i < size; i++) {
  const obj = {
    pid: proInfo[i].pid,
    at: Number(proInfo[i].at),
    bt: Number(proInfo[i].bt),
    ct: -1,
    tat: -1,
    wt: -1,
    inQ: false,
    isCt: false,
  };
  process.push(obj);
}

// uniqueColors = ["#FFB6C1", "#66CDAA", "#3CB371", "#FF7F50", "	#DC143C", "#708090","#C71585","#4B0082","#008B8B","	#BDB76B"];
const mp = new Map();
for (let i = 0; i < proInfo.length; i++) {
  mp.set(proInfo[i].pid, i);
}

for (let i = 0; i < size - 1; i++) {
  for (let j = 0; j < size - i - 1; j++) {
    if (process[j].at > process[j + 1].at) {
      let temp = process[j];
      process[j] = process[j + 1];
      process[j + 1] = temp;
    }
  }
}

let programExecuted = 0;
let timer = 0;
let gChart = [];

const sjf = () => {
  let mini = 999999;
  let indx = -1;
  for (let i = 0; i < size; i++) {
    if (
      process[i].at <= timer &&
      process[i].isCt == false &&
      process[i].bt < mini
    ) {
      mini = process[i].bt;
      indx = i;
    }
  }

  if (indx == -1) {
    let earliestAt = Infinity;
    for (let i = 0; i < size; i++) {
      if (process[i].isCt === false) {
        earliestAt = Math.min(earliestAt, process[i].at);
      }
    }

    for (let i = 0; i < size; i++) {
      if (process[i].isCt === false && process[i].at === earliestAt) {
        if (indx === -1 || process[i].bt < process[indx].bt) {
          indx = i;
        }
      }
    }

    let save = timer;
    timer = process[indx].at;

    gChart.push({
      pid: "idle",
      start: save,
      end: timer,
    });
  }

  let save = timer;
  timer += process[indx].bt;
  process[indx].ct = timer;
  process[indx].tat = process[indx].ct - process[indx].at;
  process[indx].wt = process[indx].tat - process[indx].bt;
  process[indx].isCt = true;
  programExecuted++;

  let obj = {
    pid: process[indx].pid,
    start: save,
    end: process[indx].ct,
    bt: process[indx].bt,
    at: process[indx].at,
    ct: process[indx].ct,
    tat: process[indx].tat,
    wt: process[indx].wt,
  };
  gChart.push(obj);
};

while (programExecuted != size) sjf();

let tableBody3 = document.getElementById("tableBody3");
var newRow = tableBody3.insertRow();
let gSize = gChart.length;
for (let i = 0; i < gSize; i++) {
  var cell = newRow.insertCell(i);
  cell.style.textAlign = "center";
}
newRow = tableBody3.insertRow();
for (let i = 0; i < gSize; i++) {
  var cell = newRow.insertCell(i);
  cell.id = "giantData";
  cell.style.textAlign = "center";
}

let wait = 0;
let tatime = 0;
let table = document.getElementById("myTable1");
let table2 = document.getElementById("myTable2");

async function myAsyncFunction() {
  for (let itr = 0; itr < gSize; itr++) {
    let id = gChart[itr].pid;
    let start = gChart[itr].start;
    let end = gChart[itr].end;
    let bt = gChart[itr].bt;
    let at = gChart[itr].at;
    let cTime = gChart[itr].end;
    let tatTime = gChart[itr].tat;
    let wtTime = gChart[itr].wt;
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (id === "idle") {
      let table3 = document.getElementById("table3");
      let c1 = table3.rows[0].cells[itr];
      c1.textContent = id;
      c1.style.backgroundColor = "#00CED1";
      let c2 = table3.rows[1].cells[itr];
      c2.textContent = `${start}-${end}`;
      continue;
    }

    for (let i = 0; i < size; i++) {
      let pidCell = table2.rows[i + 2].cells[0];
      if (id === table.rows[i + 1].cells[0].textContent) {
        pidCell.style.backgroundColor = uniqueColors[i % 10];
        continue;
      }
      pidCell.style.backgroundColor = "";
    }

    let row = -1;
    for (let i = 0; i < size; i++) {
      if (table.rows[i + 1].cells[0].textContent === id) {
        row = i + 1;
        break;
      }
    }

    let statusBar = document.getElementById(id);
    let wide = ((end - start) / bt) * 100;

    await new Promise((resolve) => setTimeout(resolve, 500));
    statusBar.style.width = wide + "%";
    statusBar.textContent = wide + "%";
    statusBar.style.textAlign = "center";

    let remBurstCell = table2.rows[row + 1].cells[2];
    remBurstCell.textContent = 0;

    let responseCell = table2.rows[row + 1].cells[3];
    if (responseCell.textContent == "--") {
      responseCell.textContent = start - at;
    }

    const ct = table.rows[row].cells[4];
    const tat = table.rows[row].cells[5];
    const wt = table.rows[row].cells[6];

    ct.textContent = cTime;
    tat.textContent = tatTime;
    wt.textContent = wtTime;

    wait += wtTime;
    tatime += tatTime;

    await new Promise((resolve) => setTimeout(resolve, 1000));
    let table3 = document.getElementById("table3");
    let c1 = table3.rows[0].cells[itr];
    c1.textContent = id;
    c1.style.backgroundColor = uniqueColors[mp.get(id) % 10];
    let c2 = table3.rows[1].cells[itr];
    c2.textContent = `${start}-${end}`;
  }

  let avgWt = wait / size;
  let avgTat = tatime / size;
  let tatValue = document.getElementById("tatValue");
  tatValue.innerText = `${avgTat.toFixed(2)} ms`;

  let wtValue = document.getElementById("wtValue");
  wtValue.innerText = `${avgWt.toFixed(2)} ms`;

  document.getElementById("play-again-button").style.display = "block";
  document.getElementById("play-another").style.display = "block";

  for (let i = 0; i < size; i++) {
    let pidCell = table2.rows[i + 2].cells[0];
    pidCell.style.backgroundColor = uniqueColors[i % 10];
  }
}

myAsyncFunction();
