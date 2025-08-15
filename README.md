OS Process Scheduler

An interactive web application designed to visualize and simulate various CPU scheduling algorithms. This tool provides a clear, step-by-step animation of how processes are handled by a CPU, complete with a dynamic Gantt chart and key performance metrics. It's built as a learning aid for students and developers to understand core operating system concepts.

Features
Scheduling Algorithms: Supports a range of common algorithms to demonstrate different scheduling policies.

First-Come, First-Served (FCFS)

Shortest Job First (SJF)

Shortest Remaining Time First (SRTF)

Round Robin (RR)

Priority (Preemptive)

Interactive Simulation:

Animate the execution of each process time slice by time slice.

Dynamic Live Status table shows the progress of each process in real-time.

Visual representation of the Gantt chart as the simulation progresses.

Data Input:

Add processes manually with custom Arrival Time, Burst Time, and Priority.

Use a random input generator for quick simulation setup.

Performance Metrics:

Automatically calculates and displays the Average Turnaround Time and Average Waiting Time upon completion.

The code is robustly designed to handle edge cases, including processes with a zero burst time, ensuring accurate metrics.

Technology Stack
Frontend:

HTML5 (for page structure)

CSS3 (for styling, animations, and responsive design)

JavaScript (ES6+) for all simulation logic and DOM manipulation

Libraries & Tools:

Font Awesome for icons

localStorage for seamless data transfer between pages

How to Use:

Clone the repository:

git clone https://github.com/priyam-343/OS-Process-Scheduler.git


Navigate to the project directory:

cd OS-Process-Scheduler


Open the application:

Open the index.html file in any modern web browser.

Configure: On the main page, select a scheduling algorithm, an input type, and a time quanta (if applicable).

Add Processes: On the input page, add your processes manually or use the random generator.

Start Simulation: Click the "Start Simulation" button to watch the algorithm in action.

Developed by Priyam Kumar.