let addButton=document.getElementById("add");
let deleteButton=document.getElementById("delete");
let backButton=document.getElementById("back");
let simulationButton=document.getElementById("simulation");




let userData=null;
let pInfo=[];

const storedData =localStorage.getItem("userData");

    userData = JSON.parse(storedData);
    
    let algo=document.getElementById("algo");
    let algoSelected=userData.data.algo;
    let quanta=userData.data.q;
   if(quanta!="") algo.placeholder=algoSelected + ` (q=${quanta})`;else{algo.placeholder=algoSelected ;}


//console.log(userData);
let algoo=userData.data.algo;
  
if(userData.data.inputType=="random"){
      
      let i=5;
      while(i--){
          
        var tableBody = document.getElementById("tableBody");
        var newRow = tableBody.insertRow();
        var cell1 = newRow.insertCell(0);
        var cell2 = newRow.insertCell(1);
        var cell3 = newRow.insertCell(2);
        var cell4 = newRow.insertCell(3);
         
        var c1="p"+(4-i).toString();
        var c2= Math.floor((Math.random() * 10) + 0);;
        var c3= Math.floor((Math.random() * 20) + 1);;
        var c4=(algoo!="Priority")?"--": Math.floor((Math.random() * 10) + 1);
        cell1.textContent = c1;
        cell2.textContent = c2;
        cell3.textContent = c3;
        cell4.textContent = c4;

        c4=(algoo=="Round Robin")?quanta:(algoo=="Priority")?c4:"--";
        
        let obj={
            algo:algoo,
            pid:c1,
            at:c2,
            bt:c3,
            pr:c4
        }
        pInfo.push(obj);

      }
}

//console.log(algoo);
if(algoo=="SRTF" || algoo=="FCFS" || algoo=="SJF" || algoo=="Round Robin"){
      
    var pr = document.getElementById("prDiv");
    pr.style.display = "none";
    //console.log(algoo);
}


const handleAdd=()=>{
    
    var pid = document.getElementById("pid");
    var at = document.getElementById("at");
    var bt = document.getElementById("bt");
    var pr = document.getElementById("pr");
  
      if(pid.value=="" || at.value=="" || bt.value=="" || (algoo=="Priority" && pr.value=="")){alert('All fields are mandatory');return;}
         
      if(bt.value>20 && algoo=="Round Robin"){alert("Burst time should be in between 0-20 only");return;}
      for(let i=0;i<pInfo.length;i++){

        if(pInfo[i].pid==pid.value){
            alert("Process Id should be Unique");
            return;
        }
      }
   let obj={
       algo:algoo,
       pid:pid.value,
       at:at.value,
       bt:bt.value,
       pr:pr.value
   }
   if(obj.pr==""){obj.pr=quanta;}
   pInfo.push(obj);
   //console.log(pInfo);

   var tableBody = document.getElementById("tableBody");
   var newRow = tableBody.insertRow();
   var cell1 = newRow.insertCell(0);
   var cell2 = newRow.insertCell(1);
   var cell3 = newRow.insertCell(2);
   var cell4 = newRow.insertCell(3);

   cell1.textContent = pid.value;
   cell2.textContent = at.value;
   cell3.textContent = bt.value;
   cell4.textContent = (pr.value=="") ?"--":pr.value;

   pid.value="";at.value="";bt.value="";pr.value="";
    
}

const handleDelete=()=>{
     
    var table = document.getElementById("myTable");
    var lastRow = table.rows[table.rows.length - 1];
    
    if (table.rows.length > 1) {  
        table.deleteRow(table.rows.length - 1);
        pInfo.pop();
    }else{

        alert('no more rows to delete');
        return;
    }
}


const handleBack=()=>{
     
    window.location.href = "index.html"; 

}

const handleSimulation=()=>{
      
    if(pInfo.length==0){alert("Please Add Some Process");return;}
    if(pInfo.length>10){alert("Maximum 10 processes is allowed Please delete some Process");return;}
    const userData = { data: pInfo }; // Wrap the input data in an object
   localStorage.setItem("pInfo", JSON.stringify(userData)); // Stringify the object before storing
   window.location.href = "test.html"; // it will render a new html page
}


addButton.addEventListener("click",handleAdd);
deleteButton.addEventListener("click",handleDelete);
backButton.addEventListener("click",handleBack);
simulationButton.addEventListener("click",handleSimulation);

