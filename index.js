let startButton=document.getElementById("start");
let algoSelected=document.getElementById("algos");

var val1,val2,val3;
const handleStart=async ()=>{

     var dropdown1 = document.getElementById("algos");
    var dropdown2 = document.getElementById("inputs");
    var dropdown3 = document.getElementById("timeQuanta");
  //  console.log(dropdown2);
    val1 = dropdown1.value;
    val2=dropdown2.value;
    val3=dropdown3.value;
          
 
    
   if(val1=="" || val2=="" || (val1=="Round Robin" && val3=="")){alert("all fields are mandatory");return;}
   
   const userInput = {
    algo: val1,
    inputType:val2,
    q:val3
    
};

   const userData = { data: userInput }; // Wrap the input data in an object
  await localStorage.setItem("userData", JSON.stringify(userData)); // Stringify the object before storing
   window.location.href = "input.html"; // it will render a new html page
}
const handleAlgoChange = () => {
  const algoSelected = document.getElementById("algos");
  const timeQuantaSelect = document.getElementById("timeQuanta");
  const timeQuantaLabel = document.getElementById("timeQuantaLabel");

  if (algoSelected.value === "Round Robin") {
    timeQuantaSelect.hidden = false;
    timeQuantaLabel.style.display = "block";
  } else {
    timeQuantaSelect.hidden = true;
    timeQuantaLabel.style.display = "none";
  }
};

algoSelected.addEventListener("change",handleAlgoChange);
startButton.addEventListener("click",handleStart);



//export default dataToTransfer;
