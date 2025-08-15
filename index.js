let startButton=document.getElementById("start");
let algoSelected=document.getElementById("algos");

var val1,val2,val3;
const handleStart=async ()=>{
    var dropdown1 = document.getElementById("algos");
    var dropdown2 = document.getElementById("inputs");
    var dropdown3 = document.getElementById("timeQuanta");
    
    val1 = dropdown1.value;
    val2=dropdown2.value;
    val3=dropdown3.value;
          
    if(val1 === "" || val2 === "" || (val1 === "Round Robin" && val3 === "")){
        alert("All fields are mandatory");
        return;
    }
   
    const userInput = {
        algo: val1,
        inputType: val2,
        q: val3
    };

    const userData = { data: userInput };
    await localStorage.setItem("userData", JSON.stringify(userData));
    window.location.href = "input.html";
}

const handleAlgoChange = () => {
  const algoSelected = document.getElementById("algos");
  const timeQuantaGroup = document.getElementById("timeQuantaGroup"); // Get the parent div

  if (algoSelected.value === "Round Robin") {
    // Show the parent div by removing the 'time-quanta-hidden' class
    timeQuantaGroup.classList.remove("time-quanta-hidden");
  } else {
    // Hide the parent div by adding the 'time-quanta-hidden' class
    timeQuantaGroup.classList.add("time-quanta-hidden");
  }
};

// Add a listener to handle the initial state of the page
window.addEventListener('DOMContentLoaded', () => {
    const timeQuantaGroup = document.getElementById("timeQuantaGroup");
    // Ensure the element is hidden on page load
    timeQuantaGroup.classList.add("time-quanta-hidden");
});

algoSelected.addEventListener("change", handleAlgoChange);
startButton.addEventListener("click", handleStart);
