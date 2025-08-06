
let prInfo = null;
const storeddData = localStorage.getItem("pInfo");
prInfo = JSON.parse(storeddData);
let inpt = prInfo.data;

//Make a new Process array
let size = prInfo.data.length;
let process = [];
for (let i = 0; i < size; i++) {
  const obj = {
    pid: inpt[i].pid,
    at: Number(inpt[i].at),
    bt: Number(inpt[i].bt),
    ct: 0,
    tat: 0,
    wt: 0,
    rt: 0,
  };
  process.push(obj);
}

//Map the colors with the PID of process
// uniqueColors = ["#FFB6C1", "#66CDAA", "#3CB371", "#FF7F50", "\t#DC143C", "#708090","#C71585","#4B0082","#008B8B","\t#BDB76B"];
const mp = new Map();
for (let i = 0; i < size; i++) {
  mp.set(inpt[i].pid, i);
}

//Sort the Process array based on AT
for (let i = 0; i < size - 1; i++) {
  for (let j = 0; j < size - i - 1; j++) {
    if (process[j].at > process[j + 1].at) {
      const temp = process[j];
      process[j] = process[j + 1];
      process[j + 1] = temp;
    }
  }
}

//Filling Gantt Chart
let gChart = [];
let timer = 0;
timer = timer + process[0].at;
if (0 < process[0].at) {
  let obj = {
    pid: "idle",
    start: 0,
    end: process[0].at,
  };
  gChart.push(obj);
}

for (let i = 0; i < size; i++) {
  let save = timer;
  timer = timer + process[i].bt;
  process[i].ct = timer;
  process[i].tat = process[i].ct - process[i].at;
  process[i].wt = process[i].tat - process[i].bt;

  let obj2 = null;
  if (i + 1 < size && timer < process[i + 1].at) {
    obj2 = {
      pid: "idle",
      start: process[i].ct,
      end: process[i + 1].at,
    };
    timer = process[i + 1].at;
  }


  const obj = {
    pid: process[i].pid,
    tat: process[i].tat,
    start: save,
    end: process[i].ct,
    at: process[i].at,
    bt: process[i].bt,
    wt: process[i].wt,
  };

  gChart.push(obj);
  if (obj2 != null) gChart.push(obj2);
}

//Create Entries in the Gantt Chart
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

//Handle Animation
async function myAsyncFunction() {
  for (let i = 0; i < gSize; i++) {
    let id = gChart[i].pid;
    let start = gChart[i].start;
    let end = gChart[i].end;
    let bt = gChart[i].bt;
    let at = gChart[i].at;
    let cTime = gChart[i].end;
    let tatTime = gChart[i].tat;
    let wtTime = gChart[i].wt;
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (id == "idle") {
      let table3 = document.getElementById("table3");
      let c1 = table3.rows[0].cells[i];
      c1.textContent = id;
      c1.style.backgroundColor = "#00CED1";
      let c2 = table3.rows[1].cells[i];
      c2.textContent = `${start}-${end}`;
      continue;
    }

    for (let j = 0; j < size; j++) {
      let pidCell = table2.rows[j + 2].cells[0];
      if (id == table.rows[j + 1].cells[0].textContent) {
        pidCell.style.backgroundColor = uniqueColors[j % 10];
        continue;
      }
      pidCell.style.backgroundColor = "";
    }

    let row = -1;
    for (let j = 0; j < size; j++) {
      if (id == table.rows[j + 1].cells[0].textContent) {
        row = j + 1;
        break;
      }
    }

    let statusBar = document.getElementById(id);
    let wide = ((end - start) / bt) * 100;

    await new Promise((resolve) => setTimeout(resolve, 500));
    statusBar.style.width = wide + "%";
    statusBar.textContent = wide + "%";
    statusBar.textAlign = "center";

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
    let c1 = table3.rows[0].cells[i];
    c1.textContent = id;
    c1.style.backgroundColor = uniqueColors[mp.get(id) % 10];
    let c2 = table3.rows[1].cells[i];
    c2.textContent = `${start}-${end}`;
  }

  //Performance Metrics Calculations
  let avgWt = wait / size;
  let avgTat = tatime / size;
  await new Promise((resolve) => setTimeout(resolve, 100));
  let tatValue = document.getElementById("tatValue");
  tatValue.innerText = `${avgTat.toFixed(2)} ms`;

  let wtValue = document.getElementById("wtValue");
  wtValue.innerText = avgWt.toFixed(2) + " ms";

  let playButton = document.getElementById("play-again-button");
  playButton.style.display = "block";

  let playAnother = document.getElementById("play-another");
  playAnother.style.display = "block";

  for (let j = 0; j < size; j++) {
    let pidCell = table2.rows[j + 2].cells[0];
    pidCell.style.backgroundColor = uniqueColors[j % 10];
  }
}

myAsyncFunction();
