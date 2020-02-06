


(function(){


    "use strict"

    const num_blanks = 14;
    var blanks = [];

    document.addEventListener("submit", function(event){
        event.preventDefault();
        for(let i = 0; i < num_blanks; i++) {
            blanks[i] = document.getElementById(`blank${i+1}`).value;
        }
        fillInBlanks(blanks);
        revealStory();
    });

    function fillInBlanks(blanks) {
        for(let i = 0; i < blanks.length; i++) {
            let blank = document.getElementById(`${i+1}`);
            blank.innerHTML = blanks[i];
        }
    }

    function revealStory() {
        document.getElementById("story").removeAttribute("class");
        document.getElementById("grade").removeAttribute("class");
        document.getElementById("grade").style.display = "initial"
        document.getElementById("instructions").setAttribute("class", "hidden");
        //document.querySelector("#story").style.background = "url(B-.gif) no-repeat";
        //document.querySelector("#story").style.backgroundSize = "contain";
        //document.querySelector("#story").style.backgroundPosition = "right";



    }


}());