
let pInfo=null;
const storedData =localStorage.getItem("pInfo");
pInfo = JSON.parse(storedData);

//console.log(pInfo.data);


      
       let algoo=pInfo.data[0].algo;//console.log(pInfo.data,"ku")
       var script = document.createElement('script');
       document.body.appendChild(script);
       let algoInfo=document.getElementById("algoInfo");

       if(algoo=="FCFS"){
        script.src = 'fcfs.js';
        algoInfo.innerText="FCFS";
       }
       if(algoo=="SJF"){
        script.src = 'sjf.js';
        algoInfo.innerText="SJF";
       }
       if(algoo=="SRTF"){
        script.src = 'srtf.js';
        algoInfo.innerText="SRTF";
       }
       if(algoo=="Round Robin"){
        script.src = 'roundrobin.js';
        algoInfo.innerText=`Round Robin q=(${pInfo.data[0].pr})`;
       }
       if(algoo=="Priority"){
        script.src = 'priority.js';
        algoInfo.innerText="Priority(premp.)";
       }
      
       



    let n=pInfo.data.length;let i=0;
    const uniqueColors = ["#FFB6C1", "#66CDAA", "#3CB371", "#FF7F50", "	#DC143C", "#708090","#C71585","#4B0082","#008B8B","	#BDB76B"];
    while(i<n){
        
      var tableBody = document.getElementById("tableBody");
      var newRow = tableBody.insertRow();
      var cell1 = newRow.insertCell(0); cell1.classList.add('pid'); cell1.style.backgroundColor=uniqueColors[i%10];
      var cell2 = newRow.insertCell(1);
      var cell3 = newRow.insertCell(2);
      var cell4 = newRow.insertCell(3);
      var cell5 = newRow.insertCell(4);
      var cell6 = newRow.insertCell(5);
      var cell7 = newRow.insertCell(6);
       
      var c1=pInfo.data[i].pid;
      var c2= pInfo.data[i].at;
      var c3= pInfo.data[i].bt;
      var c4=(algoo!="Priority")?"--": pInfo.data[i].pr;//console.log(algoo,"ju")
      cell1.textContent = c1;
      cell2.textContent = c2;
      cell3.textContent = c3;
      cell4.textContent = c4;
      cell5.textContent = "--";
      cell6.textContent = "--";
      cell7.textContent = "--";
    i++;
   }
   i=0;
   n=pInfo.data.length;
   while(i<n){
        
    var tableBody = document.getElementById("tableBody2");
    var newRow = tableBody.insertRow();
    var cell1 = newRow.insertCell(0); //cell1.classList.add('pid'); cell1.style.backgroundColor=uniqueColors[i%10];
    var cell2 = newRow.insertCell(1);
    var newDiv = document.createElement('div');
    newDiv.className = 'bg';
    let wide=Math.floor(Math.random() * (100 - 20 + 1)) + 20;
    wide=wide+"%";
    // newDiv.style.width = wide;
    // newDiv.textContent = wide;
    newDiv.id=pInfo.data[i].pid;
    cell2.appendChild(newDiv);
    // cell2.textContent="100%";
    var cell3 = newRow.insertCell(2);
    var cell4=newRow.insertCell(3);

    var c1=pInfo.data[i].pid;
    var c3= pInfo.data[i].bt;
    var c4="--";
    cell1.textContent = c1;
    cell3.textContent = c3;
    cell4.textContent = c4;
  i++;
 }



 let playButton=document.getElementById("play-again-button");
 let playAnother=document.getElementById("play-another");

 const handlePlayButton=()=>{
     
  window.location.href = "test.html"; 
 }
 const handlePlayAnother=()=>{
     
  window.location.href = "index.html"; 
 }
 playButton.addEventListener("click",handlePlayButton);
 playAnother.addEventListener("click",handlePlayAnother);

