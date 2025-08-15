// This script implements the First-Come, First-Served (FCFS) CPU scheduling algorithm.
// It is designed to be robust and handle edge cases like processes with 0 burst time.

let prInfo = null;
const storeddData = localStorage.getItem("pInfo");
prInfo = JSON.parse(storeddData);
let inpt = prInfo.data;

// Make a new Process array, ensuring all values are correctly parsed as numbers.
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

// Map the colors with the PID of each process for animation.
const mp = new Map();
for (let i = 0; i < size; i++) {
  mp.set(inpt[i].pid, i);
}

// Sort the Process array based on Arrival Time (AT) for FCFS logic.
process.sort((a, b) => a.at - b.at);

// The Gantt chart holds the timeline of process execution.
let gChart = [];
let timer = 0;
let totalWaitTime = 0;
let totalTurnaroundTime = 0;

// Handle potential initial idle time before the first process arrives.
if (process.length > 0 && process[0].at > 0) {
  gChart.push({
    pid: "idle",
    start: 0,
    end: process[0].at,
  });
  timer = process[0].at;
} else if (process.length > 0) {
    timer = process[0].at;
}

// Run the FCFS scheduling logic.
for (let i = 0; i < size; i++) {
  let currentProcess = process[i];
  let save = timer;

  // Handle idle time between processes.
  if (timer < currentProcess.at) {
    gChart.push({
      pid: "idle",
      start: timer,
      end: currentProcess.at,
    });
    timer = currentProcess.at;
    save = timer; // Update save to the new timer value.
  }
  
  timer += currentProcess.bt;
  currentProcess.ct = timer;
  currentProcess.tat = currentProcess.ct - currentProcess.at;
  currentProcess.wt = currentProcess.tat - currentProcess.bt;

  gChart.push({
    pid: currentProcess.pid,
    tat: currentProcess.tat,
    start: save,
    end: currentProcess.ct,
    at: currentProcess.at,
    bt: currentProcess.bt,
    wt: currentProcess.wt,
  });

  totalWaitTime += currentProcess.wt;
  totalTurnaroundTime += currentProcess.tat;
}

// Create entries in the Gantt Chart DOM.
let tableBody3 = document.getElementById("table3");
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

// Get DOM elements for performance metrics and tables.
let table = document.getElementById("myTable1");
let table2 = document.getElementById("myTable2");

// Handle Animation
async function myAsyncFunction() {
  for (let i = 0; i < gSize; i++) {
    let id = gChart[i].pid;
    let start = gChart[i].start;
    let end = gChart[i].end;
    let bt = gChart[i].bt;
    let at = gChart[i].at;
    let tatTime = gChart[i].tat;
    let wtTime = gChart[i].wt;
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
    
    // Animate the progress bar for the current process.
    let row = -1;
    for (let j = 0; j < size; j++) {
      if (id === table.rows[j + 1].cells[0].textContent) {
        row = j + 1;
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

    // Update the live status table.
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
    ct.textContent = end;
    tat.textContent = tatTime;
    wt.textContent = wtTime;
    
    // Populate the Gantt chart in the DOM.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    let table3 = document.getElementById("table3");
    let c1 = table3.rows[0].cells[i];
    c1.textContent = id;
    c1.style.backgroundColor = uniqueColors[mp.get(id) % 10];
    let c2 = table3.rows[1].cells[i];
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
  for (let j = 0; j < size; j++) {
    let pidCell = table2.rows[j + 2].cells[0];
    pidCell.style.backgroundColor = uniqueColors[j % 10];
  }
}
myAsyncFunction();
