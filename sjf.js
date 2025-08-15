// This script implements the non-preemptive Shortest Job First (SJF) CPU scheduling algorithm.
// It is designed to be robust and handle edge cases like processes with 0 burst time.

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
    isCt: false,
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

let programExecuted = 0;
let timer = 0;
let gChart = [];
let totalWaitTime = 0;
let totalTurnaroundTime = 0;

// SJF scheduling logic.
const sjf = () => {
    while (programExecuted < size) {
        let mini = Infinity;
        let indx = -1;

        // Find the shortest job that has arrived and is not completed yet.
        for (let i = 0; i < size; i++) {
            if (process[i].at <= timer && process[i].isCt === false && process[i].bt < mini) {
                mini = process[i].bt;
                indx = i;
            }
        }

        if (indx === -1) {
            // CPU is idle, find the next arrival.
            let earliestAt = Infinity;
            for (let i = 0; i < size; i++) {
                if (process[i].isCt === false) {
                    earliestAt = Math.min(earliestAt, process[i].at);
                }
            }
            if (earliestAt === Infinity) break; // All processes are done.
            
            if (gChart.length === 0 || gChart[gChart.length - 1].pid !== "idle") {
                gChart.push({ pid: "idle", start: timer, end: earliestAt });
            } else {
                gChart[gChart.length - 1].end = earliestAt;
            }
            timer = earliestAt;
            continue;
        }

        let save = timer;
        let currentProcess = process[indx];
        timer += currentProcess.bt;

        currentProcess.ct = timer;
        currentProcess.tat = currentProcess.ct - currentProcess.at;
        currentProcess.wt = currentProcess.tat - currentProcess.bt;
        currentProcess.isCt = true;
        programExecuted++;

        gChart.push({
            pid: currentProcess.pid,
            start: save,
            end: currentProcess.ct,
            bt: currentProcess.bt,
            at: currentProcess.at,
            ct: currentProcess.ct,
            tat: currentProcess.tat,
            wt: currentProcess.wt,
        });

        totalWaitTime += currentProcess.wt;
        totalTurnaroundTime += currentProcess.tat;
    }
};
sjf();


// Create entries in the Gantt Chart DOM.
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
let processesCompletedInAnimation = new Set();


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

    // Update Live Status color for running process.
    let row = -1;
    for (let i = 0; i < size; i++) {
      if (table.rows[i + 1].cells[0].textContent === id) {
        row = i + 1;
        break;
      }
    }
    
    let pidCell = table2.rows[row + 1].cells[0];
    pidCell.style.backgroundColor = uniqueColors[mp.get(id) % 10];

    let statusBar = document.getElementById(id);
    
    // FIX: Handle burst time of 0 to prevent division by zero.
    let wide = (bt > 0) ? (((end - start) / bt) * 100) : 100;

    await new Promise((resolve) => setTimeout(resolve, 500));
    statusBar.style.width = wide + "%";
    
    // FIX: Display "100.00%" for processes with 0 burst time.
    statusBar.textContent = (bt > 0) ? (wide.toFixed(2) + "%") : "100.00%";
    statusBar.style.textAlign = "center";

    let remBurstCell = table2.rows[row + 1].cells[2];
    remBurstCell.textContent = 0;

    let responseCell = table2.rows[row + 1].cells[3];
    if (responseCell.textContent === "--") {
      responseCell.textContent = start - at;
    }

    // Update the final process table.
    const ct = table.rows[row].cells[4];
    const tat = table.rows[row].cells[5];
    const wt = table.rows[row].cells[6];

    ct.textContent = cTime;
    tat.textContent = tatTime;
    wt.textContent = wtTime;
    
    // Populate the Gantt chart in the DOM.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    let table3 = document.getElementById("table3");
    let c1 = table3.rows[0].cells[itr];
    c1.textContent = id;
    c1.style.backgroundColor = uniqueColors[mp.get(id) % 10];
    let c2 = table3.rows[1].cells[itr];
    c2.textContent = `${start}-${end}`;
  }

  // Final performance metric display.
  await new Promise((resolve) => setTimeout(resolve, 100));
  let avgWt = totalWaitTime / size;
  let avgTat = totalTurnaroundTime / size;
  let tatValue = document.getElementById("tatValue");
  tatValue.innerText = `${avgTat.toFixed(2)} ms`;

  let wtValue = document.getElementById("wtValue");
  wtValue.innerText = `${avgWt.toFixed(2)} ms`;

  // Display the final action buttons.
  document.getElementById("play-again-button").style.display = "block";
  document.getElementById("play-another").style.display = "block";
  
  // Reset PID cell colors for a clean final view.
  for (let i = 0; i < size; i++) {
    let pidCell = table2.rows[i + 2].cells[0];
    pidCell.style.backgroundColor = uniqueColors[i % 10];
  }
}
myAsyncFunction();
