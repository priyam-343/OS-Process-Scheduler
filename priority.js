// This script implements the Preemptive Priority CPU scheduling algorithm.
// The simulation is run per time unit.

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
    isCompleted: false,
    rbt: Number(proInfo[i].bt),
    pr: Number(proInfo[i].pr),
    firstRun: true,
  };
  process.push(obj);
}

// A map to quickly get the original index for a process ID.
const mp = new Map();
for (let i = 0; i < proInfo.length; i++) {
  mp.set(proInfo[i].pid, i);
}

// Sort the processes by arrival time initially.
process.sort((a, b) => a.at - b.at);

let gChart = [];
let totalCompleted = 0;
let currentTime = 0;
let totalWaitTime = 0;
let totalTurnaroundTime = 0;

// Priority scheduling logic.
const priority = () => {
  let runningProcess = null;
  
  while (totalCompleted < size) {
    let minPriority = Infinity;
    let nextProcess = null;

    // Find the next process to run based on Priority criteria.
    for (let i = 0; i < size; i++) {
      if (!process[i].isCompleted && process[i].at <= currentTime && process[i].pr < minPriority) {
        minPriority = process[i].pr;
        nextProcess = process[i];
      }
    }
    
    // Handle preemption.
    if (nextProcess && runningProcess !== nextProcess) {
      runningProcess = nextProcess;
    }
    
    // Handle idle time.
    if (!runningProcess) {
      if (gChart.length === 0 || gChart[gChart.length - 1].pid !== "idle") {
        gChart.push({ pid: "idle", start: currentTime, end: currentTime });
      }
      gChart[gChart.length - 1].end++;
      currentTime++;
      continue;
    }

    // Handle running process.
    let lastGanttEntry = gChart[gChart.length - 1];
    
    // Handle a process with 0 burst time as a special, instantaneous case.
    if (runningProcess.bt === 0) {
      runningProcess.isCompleted = true;
      runningProcess.ct = currentTime;
      runningProcess.tat = runningProcess.ct - runningProcess.at;
      runningProcess.wt = runningProcess.tat - runningProcess.bt;

      if (lastGanttEntry && lastGanttEntry.pid === runningProcess.pid) {
          lastGanttEntry.end = currentTime;
      } else {
          gChart.push({ pid: runningProcess.pid, start: currentTime, end: currentTime });
      }
      totalWaitTime += runningProcess.wt;
      totalTurnaroundTime += runningProcess.tat;
      totalCompleted++;
      runningProcess = null;
      continue;
    }
    
    if (lastGanttEntry && lastGanttEntry.pid === runningProcess.pid) {
      lastGanttEntry.end++;
    } else {
      gChart.push({ pid: runningProcess.pid, start: currentTime, end: currentTime + 1 });
    }
    
    // Decrease remaining burst time and check for completion.
    runningProcess.rbt--;
    currentTime++;
    
    if (runningProcess.rbt === 0) {
      // Process has completed.
      runningProcess.isCompleted = true;
      runningProcess.ct = currentTime;
      runningProcess.tat = runningProcess.ct - runningProcess.at;
      runningProcess.wt = runningProcess.tat - runningProcess.bt;

      totalWaitTime += runningProcess.wt;
      totalTurnaroundTime += runningProcess.tat;
      totalCompleted++;
      runningProcess = null;
    }
  }
};
priority();

// Set up the DOM for animation.
let tableBody3 = document.getElementById("tableBody3");
let newRowHeader = tableBody3.insertRow();
let gSize = gChart.length;
for (let i = 0; i < gSize; i++) {
  let cell = newRowHeader.insertCell(i);
  cell.style.textAlign = "center";
}
let newRowData = tableBody3.insertRow();
for (let i = 0; i < gSize; i++) {
  let cell = newRowData.insertCell(i);
  cell.id = "giantData";
  cell.style.textAlign = "center";
}

let table = document.getElementById("myTable1");
let table2 = document.getElementById("myTable2");
let completionTimes = new Map();
let turnaroundTimes = new Map();
let waitingTimes = new Map();
let responseTimes = new Map();
let firstRun = new Set();


// Calculate all metrics before animation for consistency.
for (let i = 0; i < size; i++) {
    const p = process[i];
    completionTimes.set(p.pid, p.ct);
    turnaroundTimes.set(p.pid, p.tat);
    waitingTimes.set(p.pid, p.wt);
    // Find the first start time for response time
    for (const entry of gChart) {
        if (entry.pid === p.pid && !firstRun.has(p.pid)) {
            responseTimes.set(p.pid, entry.start - p.at);
            firstRun.add(p.pid);
        }
    }
}
firstRun.clear();


// Handle Animation
async function myAsyncFunction() {
  let completedInAnimation = new Set();

  for (let i = 0; i < gSize; i++) {
    let id = gChart[i].pid;
    let start = gChart[i].start;
    let end = gChart[i].end;
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    if (id === "idle") {
      let table3 = document.getElementById("table3");
      let c1 = table3.rows[0].cells[i];
      c1.textContent = id;
      c1.style.backgroundColor = "#00CED1";
      let c2 = table3.rows[1].cells[i];
      c2.textContent = `${start}-${end}`;
      continue;
    }

    // Find the original process data using the map.
    let originalIndex = mp.get(id);
    let originalProcess = process[originalIndex];
    let bt = originalProcess.bt;
    let rbt = originalProcess.rbt;

    for (let j = 0; j < size; j++) {
      let pidCell = table2.rows[j + 2].cells[0];
      if (id === table.rows[j + 1].cells[0].textContent) {
        pidCell.style.backgroundColor = uniqueColors[j % 10];
      } else {
        pidCell.style.backgroundColor = "";
      }
    }

    let row = -1;
    for (let j = 0; j < size; j++) {
      if (table.rows[j + 1].cells[0].textContent === id) {
        row = j + 1;
        break;
      }
    }
    
    let statusBar = document.getElementById(id);
    
    let timeElapsed = (bt - originalProcess.rbt);
    let wide = (bt > 0) ? ((timeElapsed / bt) * 100) : 100;
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    statusBar.style.width = wide + "%";
    statusBar.textContent = (bt > 0) ? (wide.toFixed(2) + "%") : "100.00%";
    statusBar.textAlign = "center";

    let remBurstCell = table2.rows[row + 1].cells[2];
    remBurstCell.textContent = originalProcess.rbt;

    let responseCell = table2.rows[row + 1].cells[3];
    if (responseCell.textContent === "--" && responseTimes.get(id) !== undefined) {
      responseCell.textContent = responseTimes.get(id);
    }
    
    const ct = table.rows[row].cells[4];
    const tat = table.rows[row].cells[5];
    const wt = table.rows[row].cells[6];
    
    if (originalProcess.rbt === 0 && !completedInAnimation.has(id)) {
      ct.textContent = completionTimes.get(id);
      tat.textContent = turnaroundTimes.get(id);
      wt.textContent = waitingTimes.get(id);
      completedInAnimation.add(id);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    let table3 = document.getElementById("table3");
    let c1 = table3.rows[0].cells[i];
    c1.textContent = id;
    c1.style.backgroundColor = uniqueColors[mp.get(id) % 10];
    let c2 = table3.rows[1].cells[i];
    c2.textContent = `${start}-${end}`;
  }

  await new Promise((resolve) => setTimeout(resolve, 100));
  let avgWt = totalWaitTime / size;
  let avgTat = totalTurnaroundTime / size;

  let tatValue = document.getElementById("tatValue");
  tatValue.innerText = `${avgTat.toFixed(2)} ms`;

  let wtValue = document.getElementById("wtValue");
  wtValue.innerText = `${avgWt.toFixed(2)} ms`;

  document.getElementById("play-again-button").style.display = "block";
  document.getElementById("play-another").style.display = "block";

  for (let j = 0; j < size; j++) {
    let pidCell = table2.rows[j + 2].cells[0];
    pidCell.style.backgroundColor = uniqueColors[mp.get(process[j].pid) % 10];
  }
}

myAsyncFunction();
