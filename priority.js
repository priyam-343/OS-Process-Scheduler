let proInfo = null;
const storedDataa = localStorage.getItem("pInfo");
proInfo = JSON.parse(storedDataa);
proInfo = proInfo.data;

let process = [];
let size = proInfo.length;
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
    rbt: Number(proInfo[i].bt),
    pr: Number(proInfo[i].pr),
  };
  process.push(obj);
}

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

const priority = () => {
  let mini = Infinity;
  let indx = -1;

  for (let i = 0; i < size; i++) {
    if (
      process[i].at <= timer &&
      !process[i].isCompleted &&
      process[i].pr < mini
    ) {
      mini = process[i].pr;
      indx = i;
    }
  }

  if (indx === -1) {
    let earliestAt = Infinity;
    for (let i = 0; i < size; i++) {
      if (!process[i].isCompleted) {
        earliestAt = Math.min(earliestAt, process[i].at);
      }
    }

    for (let i = 0; i < size; i++) {
      if (!process[i].isCompleted && process[i].at === earliestAt) {
        if (indx === -1 || process[i].pr < process[indx].pr) {
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
  timer++;
  process[indx].rbt--;

  if (process[indx].rbt === 0) {
    process[indx].ct = timer;
    process[indx].tat = process[indx].ct - process[indx].at;
    process[indx].wt = process[indx].tat - process[indx].bt;
    process[indx].isCompleted = true;
    programExecuted++;
  }

  const last = gChart[gChart.length - 1];
  if (last && last.pid === process[indx].pid) {
    last.end = timer;
    if (process[indx].rbt === 0) {
      last.ct = process[indx].ct;
      last.tat = process[indx].tat;
      last.wt = process[indx].wt;
      last.rbt = 0;
    }
  } else {
    gChart.push({
      pid: process[indx].pid,
      start: save,
      end: timer,
      bt: process[indx].bt,
      at: process[indx].at,
      ct: process[indx].rbt === 0 ? process[indx].ct : -1,
      tat: process[indx].rbt === 0 ? process[indx].tat : -1,
      wt: process[indx].rbt === 0 ? process[indx].wt : -1,
      rbt: process[indx].rbt,
    });
  }
};

while (programExecuted !== size) priority();

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

let table = document.getElementById("myTable1");
let table2 = document.getElementById("myTable2");
let wait = 0;
let tatime = 0;

async function myAsyncFunction() {
  for (let i = 0; i < gSize; i++) {
    let id = gChart[i].pid;
    let start = gChart[i].start;
    let end = gChart[i].end;
    let rbt = gChart[i].rbt;
    let bt = gChart[i].bt;
    let at = gChart[i].at;
    let cTime = gChart[i].ct;
    let tatTime = gChart[i].tat;
    let wtTime = gChart[i].wt;
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (id == "idle") {
      let table3 = document.getElementById("table3");
      let c1 = table3.rows[0].cells[i];
      c1.textContent = id;
      c1.style.backgroundColor = "#00CED1";
      let c2 = table3.rows[1].cells[i];
      c2.textContent = start + "-" + end;
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
      const cellValue = table.rows[j + 1].cells[0].textContent;
      if (cellValue == id) {
        row = j + 1;
        break;
      }
    }

    let statusBar = document.getElementById(id);
    let wide = (((bt - rbt) / bt) * 100).toFixed(2);

    await new Promise((resolve) => setTimeout(resolve, 500));
    statusBar.style.width = wide + "%";
    statusBar.textContent = wide + "%";
    statusBar.textAlign = "center";

    let remBurstCell = table2.rows[row + 1].cells[2];
    remBurstCell.textContent = rbt;

    let responseCell = table2.rows[row + 1].cells[3];
    if (responseCell.textContent == "--") {
      responseCell.textContent = start - at;
    }

    const ct = table.rows[row].cells[4];
    const tat = table.rows[row].cells[5];
    const wt = table.rows[row].cells[6];

    if (Number(rbt) == 0) {
      ct.textContent = cTime;
      tat.textContent = tatTime;
      wt.textContent = wtTime;

      wait += wtTime;
      tatime += tatTime;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    let table3 = document.getElementById("table3");
    let c1 = table3.rows[0].cells[i];
    c1.textContent = id;
    c1.style.backgroundColor = uniqueColors[mp.get(id) % 10];
    let c2 = table3.rows[1].cells[i];
    c2.textContent = start + "-" + end;
  }

  let avgWt = wait / size;
  let avgTat = tatime / size;
  let tatValue = document.getElementById("tatValue");
  tatValue.innerText = `${avgTat.toFixed(2)} ms`;

  let wtValue = document.getElementById("wtValue");
  wtValue.innerText = avgWt.toFixed(2) + " ms";

  let playButton = document.getElementById("play-again-button");
  playButton.style.display = "block";

  let playAnother = document.getElementById("play-another");
  playAnother.style.display = "block";

  for (let i = 0; i < size; i++) {
    let pidCell = table2.rows[i + 2].cells[0];
    pidCell.style.backgroundColor = uniqueColors[i % 10];
  }
}

myAsyncFunction();
