let proInfo = null;
const storedDataa = localStorage.getItem("pInfo");
proInfo = JSON.parse(storedDataa);
proInfo = proInfo.data;

let process = [];
let size = proInfo.length;
for (let i = 0; i < size; i++) {
  const obj = {
    pid: i + 1,
    pidd: proInfo[i].pid,
    at: Number(proInfo[i].at),
    bt: Number(proInfo[i].bt),
    rbt: Number(proInfo[i].bt),
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
const gChart = [];
const tQuanta = Number(proInfo[0].pr);
const readyQueue = [];

const checkForNewArrivals = () => {
  for (let i = 0; i < size; i++) {
    if (!process[i].inQ && !process[i].isCt && process[i].at <= timer) {
      process[i].inQ = true;
      readyQueue.push({ indx: i, inTime: timer, pid: process[i].pidd });
    }
  }
};

const updateQueue = () => {
  const { indx: i, inTime, pid } = readyQueue.shift();

  const proc = process[i];
  const obj = {
    pid,
    start: timer,
    end: 0,
    rbt: 0,
    bt: proc.bt,
    at: proc.at,
    ct: 0,
    tat: 0,
    wt: 0,
  };

  if (proc.rbt <= tQuanta) {
    timer += proc.rbt;
    proc.rbt = 0;
    proc.ct = timer;
    proc.tat = proc.ct - proc.at;
    proc.wt = proc.tat - proc.bt;
    proc.isCt = true;
    programExecuted++;

    obj.end = timer;
    obj.ct = proc.ct;
    obj.tat = proc.tat;
    obj.wt = proc.wt;

    checkForNewArrivals();
  } else {
    proc.rbt -= tQuanta;
    timer += tQuanta;

    obj.end = timer;
    obj.rbt = proc.rbt;

    checkForNewArrivals();
    readyQueue.push({ indx: i, inTime: timer, pid: proc.pidd });
  }

  gChart.push(obj);
};

const roundRobin = () => {
  for (let i = 0; i < size; i++) {
    if (!process[i].inQ && !process[i].isCt) {
      timer = process[i].at;

      if (gChart.length === 0 && timer > 0) {
        gChart.push({ pid: "idle", start: 0, end: timer });
      } else if (gChart.length !== 0 && gChart[gChart.length - 1].end < timer) {
        gChart.push({
          pid: "idle",
          start: gChart[gChart.length - 1].end,
          end: timer,
        });
      }

      process[i].inQ = true;
      readyQueue.push({ indx: i, inTime: timer, pid: process[i].pidd });
      break;
    }
  }

  while (readyQueue.length > 0) {
    updateQueue();
  }
};

while (programExecuted < size) {
  roundRobin();
}

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

    for (let i = 0; i < size; i++) {
      let pidCell = table2.rows[i + 2].cells[0];
      if (id == table.rows[i + 1].cells[0].textContent) {
        pidCell.style.backgroundColor = uniqueColors[i % 10];
        continue;
      }
      pidCell.style.backgroundColor = "";
    }
    
    let row = -1;
    for (let i = 0; i < size; i++) {
      if (id == table.rows[i + 1].cells[0].textContent) {
        row = i + 1;
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
    c2.textContent = `${start}-${end}`;
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
