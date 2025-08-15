// This script implements the Round Robin (RR) CPU scheduling algorithm.
// This is a preemptive algorithm based on a time quantum.

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
    rbt: Number(proInfo[i].bt),
    ct: -1,
    tat: -1,
    wt: -1,
    isCompleted: false,
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
let totalWaitTime = 0;
let totalTurnaroundTime = 0;
let tQuanta = Number(proInfo[0].pr);
let responseTimes = new Map();


// Round Robin scheduling logic.
const roundRobin = () => {
    let timer = 0;
    let completedCount = 0;
    let queue = [];
    let processData = [...process];
    
    // Handle processes with AT 0 and BT 0 as special, instant cases.
    let instantProcesses = processData.filter(p => p.at === 0 && p.bt === 0);
    for (const p of instantProcesses) {
        p.isCompleted = true;
        p.ct = 0;
        p.tat = 0;
        p.wt = 0;
        totalWaitTime += 0;
        totalTurnaroundTime += 0;
        completedCount++;
        gChart.push({ pid: p.pid, start: 0, end: 0 });
        responseTimes.set(p.pid, 0);
    }
    
    // Filter out the instant processes from the main data for scheduling.
    processData = processData.filter(p => !(p.at === 0 && p.bt === 0));
    
    // Sort again in case instant processes changed order
    processData.sort((a, b) => a.at - b.at);

    while (completedCount < size) {
        // Add new arrivals to the ready queue.
        for (const p of processData) {
            if (p.at <= timer && !p.isCompleted && !queue.includes(p)) {
                queue.push(p);
            }
        }
        
        if (queue.length === 0) {
            const nextArrival = processData.find(p => !p.isCompleted)?.at || Infinity;
            if (nextArrival !== Infinity) {
                const lastEntry = gChart[gChart.length - 1];
                if (lastEntry && lastEntry.pid === "idle") {
                    lastEntry.end = nextArrival;
                } else {
                    gChart.push({ pid: "idle", start: timer, end: nextArrival });
                }
                timer = nextArrival;
            } else {
                break;
            }
            continue;
        }

        let currentProcess = queue.shift();
        
        // Handle first run for response time.
        if (currentProcess.firstRun) {
            responseTimes.set(currentProcess.pid, timer - currentProcess.at);
            currentProcess.firstRun = false;
        }

        let timeToRun = Math.min(currentProcess.rbt, tQuanta);
        
        // Update Gantt chart.
        const lastGanttEntry = gChart[gChart.length - 1];
        if (lastGanttEntry && lastGanttEntry.pid === currentProcess.pid) {
            lastGanttEntry.end += timeToRun;
        } else {
            gChart.push({ pid: currentProcess.pid, start: timer, end: timer + timeToRun });
        }

        timer += timeToRun;
        currentProcess.rbt -= timeToRun;
        
        // Add new arrivals during this time slice.
        for (const p of processData) {
            if (p.at > timer - timeToRun && p.at <= timer && !p.isCompleted && !queue.includes(p)) {
                queue.push(p);
            }
        }
        
        if (currentProcess.rbt === 0) {
            // Process completed.
            currentProcess.isCompleted = true;
            currentProcess.ct = timer;
            currentProcess.tat = currentProcess.ct - currentProcess.at;
            currentProcess.wt = currentProcess.tat - currentProcess.bt;

            totalWaitTime += currentProcess.wt;
            totalTurnaroundTime += currentProcess.tat;
            completedCount++;
        } else {
            // Process not completed, add back to the end of the queue.
            queue.push(currentProcess);
        }
    }
};
roundRobin();


// Set up the DOM for animation.
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

let table = document.getElementById("myTable1");
let table2 = document.getElementById("myTable2");
let completionTimes = new Map();
let turnaroundTimes = new Map();
let waitingTimes = new Map();
let processesCompletedInAnimation = new Set();


// Calculate all metrics before animation for consistency.
for (let i = 0; i < size; i++) {
    const p = process[i];
    completionTimes.set(p.pid, p.ct);
    turnaroundTimes.set(p.pid, p.tat);
    waitingTimes.set(p.pid, p.wt);
}

// Handle Animation
async function myAsyncFunction() {
  let timeElapsedPerProcess = new Map();
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

    let originalProcess = process.find(p => p.pid === id);
    let bt = originalProcess.bt;
    
    if (!timeElapsedPerProcess.has(id)) {
        timeElapsedPerProcess.set(id, 0);
    }
    timeElapsedPerProcess.set(id, timeElapsedPerProcess.get(id) + (end - start));

    for (let j = 0; j < size; j++) {
      let pidCell = table2.rows[j + 2].cells[0];
      if (id === table.rows[j + 1].cells[0].textContent) {
        pidCell.style.backgroundColor = uniqueColors[mp.get(id) % 10];
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
    
    let wide = (bt > 0) ? ((timeElapsedPerProcess.get(id) / bt) * 100) : 100;
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    statusBar.style.width = wide + "%";
    statusBar.textContent = (bt > 0) ? (wide.toFixed(2) + "%") : "100.00%";
    statusBar.textAlign = "center";

    let remBurstCell = table2.rows[row + 1].cells[2];
    remBurstCell.textContent = bt - timeElapsedPerProcess.get(id);

    let responseCell = table2.rows[row + 1].cells[3];
    if (responseCell.textContent === "--" && responseTimes.get(id) !== undefined) {
      responseCell.textContent = responseTimes.get(id);
    }
    
    const ct = table.rows[row].cells[4];
    const tat = table.rows[row].cells[5];
    const wt = table.rows[row].cells[6];
    
    if (bt - timeElapsedPerProcess.get(id) === 0 && !processesCompletedInAnimation.has(id)) {
      ct.textContent = completionTimes.get(id);
      tat.textContent = turnaroundTimes.get(id);
      wt.textContent = waitingTimes.get(id);
      processesCompletedInAnimation.add(id);
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
