
window.onload = () => {
  

    // Gets currently selected code
    const getCode  = () =>{
        var leftVal = document.getElementById("left")
        var rightVal = document.getElementById("right")
        leftVal = leftVal.value;
        rightVal = rightVal.value;
        return `${leftVal}2${rightVal}`
    }


    var request = new XMLHttpRequest();

    // What to with the request
    request.onreadystatechange = () => {
        // console.log(XMLHttpRequest.DONE,request.status)
        if (request.readyState === XMLHttpRequest.DONE) {
            // console.log("inside")
            if (request.status === 200){
                if (!request.responseText.includes("<!DOCTYPE html>")){
                    var rightTextArea = document.getElementById("textAreaRight")
                    rightTextArea.value = request.responseText.replace(","," ")
                }
            } else { 
                alert('Error'); }
        }
    }
    // Send url path to server
    // const url = "http://localhost:3000";
    
    
    function eventListnerOnTextChange(){
        var leftTextArea = document.getElementById("textAreaLeft")
        var silderLeft = document.getElementById("left")
        var sliderRight = document.getElementById("right")
        const addToRight = () => {
            var text = document.getElementById("textAreaLeft").value;
            const url = `/translate/${getCode()}/,${text}`
            request.open('GET', url);
            request.send();
        }
        sliderRight.addEventListener('input', addToRight);
        silderLeft.addEventListener('input', addToRight);
        leftTextArea.addEventListener('input', addToRight);
        const url = 'http://localhost:3000/'
        request.open('GET', url);
        request.send();

    }
    eventListnerOnTextChange();
   
    
}