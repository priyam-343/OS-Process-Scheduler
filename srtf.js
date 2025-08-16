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
    originalIndex: i
  };
  process.push(obj);
}

const mp = new Map();
for (let i = 0; i < proInfo.length; i++) {
  mp.set(proInfo[i].pid, i);
}

process.sort((a, b) => a.at - b.at);

let gChart = [];
let totalCompleted = 0;
let currentTime = 0;
let totalWaitTime = 0;
let totalTurnaroundTime = 0;
let responseTimes = new Map();
let firstRun = new Set();
let allProcesses = [...process];

const srtf = () => {
    let timer = 0;
    let completedCount = 0;

    while (completedCount < size) {
        let minRbt = Infinity;
        let selectedProcess = null;

        for (const p of allProcesses) {
            if (!p.isCompleted && p.at <= timer && p.rbt < minRbt) {
                minRbt = p.rbt;
                selectedProcess = p;
            }
        }
        
        if (selectedProcess === null) {
            // CPU is idle, find the next arrival time
            const nextArrival = allProcesses.find(p => !p.isCompleted)?.at || Infinity;
            if (nextArrival !== Infinity) {
                const lastEntry = gChart[gChart.length - 1];
                if (lastEntry && lastEntry.pid === "idle") {
                    lastEntry.end = nextArrival;
                } else {
                    gChart.push({ pid: "idle", start: timer, end: nextArrival });
                }
                timer = nextArrival;
            } else {
                break; // All processes are done
            }
            continue;
        }

        // Handle a process with 0 burst time as a special, instantaneous case.
        if (selectedProcess.bt === 0 && !selectedProcess.isCompleted) {
             selectedProcess.isCompleted = true;
             selectedProcess.ct = timer;
             selectedProcess.tat = 0; // Turnaround time is 0 for 0 burst
             selectedProcess.wt = 0; // Waiting time is 0 for 0 burst
             selectedProcess.rbt = 0;

             totalWaitTime += 0;
             totalTurnaroundTime += 0;
             completedCount++;

             const lastEntry = gChart[gChart.length - 1];
             if (lastEntry && lastEntry.pid === selectedProcess.pid) {
                 lastEntry.end = timer;
             } else {
                 gChart.push({ pid: selectedProcess.pid, start: timer, end: timer });
             }

             // Handle first run for response time
             if (!firstRun.has(selectedProcess.pid)) {
                 responseTimes.set(selectedProcess.pid, timer - selectedProcess.at);
                 firstRun.add(selectedProcess.pid);
             }
             continue; // Continue to the next loop iteration without advancing the timer
        }

        // Handle first run for response time
        if (!firstRun.has(selectedProcess.pid)) {
            responseTimes.set(selectedProcess.pid, timer - selectedProcess.at);
            firstRun.add(selectedProcess.pid);
        }

        // Handle Gantt chart updates
        const lastEntry = gChart[gChart.length - 1];
        if (lastEntry && lastEntry.pid === selectedProcess.pid) {
            lastEntry.end++;
        } else {
            gChart.push({ pid: selectedProcess.pid, start: timer, end: timer + 1 });
        }
        
        // Decrease remaining burst time and advance timer
        selectedProcess.rbt--;
        timer++;
        
        if (selectedProcess.rbt === 0) {
            // Process has completed
            selectedProcess.isCompleted = true;
            selectedProcess.ct = timer;
            selectedProcess.tat = selectedProcess.ct - selectedProcess.at;
            selectedProcess.wt = selectedProcess.tat - selectedProcess.bt;

            totalWaitTime += selectedProcess.wt;
            totalTurnaroundTime += selectedProcess.tat;
            completedCount++;
        }
    }
};
srtf();

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
let processesCompletedInAnimation = new Set();

let completionTimes = new Map();
let turnaroundTimes = new Map();
let waitingTimes = new Map();

for (let i = 0; i < size; i++) {
    const p = process[i];
    completionTimes.set(p.pid, p.ct);
    turnaroundTimes.set(p.pid, p.tat);
    waitingTimes.set(p.pid, p.wt);
}

async function myAsyncFunction() {
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

    let originalIndex = mp.get(id);
    let originalProcess = process.find(p => p.pid === id);
    let bt = originalProcess.bt;
    
    let timeElapsedInGanttSegment = (end - start);
    let cumulativeTimeElapsed = 0;
    for(let j = 0; j <= i; j++){
      if(gChart[j].pid === id){
        cumulativeTimeElapsed += (gChart[j].end - gChart[j].start);
      }
    }
    let rbt = bt - cumulativeTimeElapsed;

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
    
    // FIX: Correctly calculate time elapsed in the current burst
    let wide = (bt > 0) ? ((cumulativeTimeElapsed / bt) * 100) : 100;
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    statusBar.style.width = wide + "%";
    statusBar.textContent = (bt > 0) ? (wide.toFixed(2) + "%") : "100.00%";
    statusBar.textAlign = "center";
    
    let remBurstCell = table2.rows[row + 1].cells[2];
    remBurstCell.textContent = rbt;

    let responseCell = table2.rows[row + 1].cells[3];
    if (responseCell.textContent === "--" && responseTimes.get(id) !== undefined) {
      responseCell.textContent = responseTimes.get(id);
    }
    
    const ct = table.rows[row].cells[4];
    const tat = table.rows[row].cells[5];
    const wt = table.rows[row].cells[6];
    
    if (rbt === 0 && !processesCompletedInAnimation.has(id)) {
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
