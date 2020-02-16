(function(){
    "use strict"

    const images = ["images/helmet.jpg", "images/sketchpad.jpg", "images/tupperware.jpg"];
    const names = ["helmet", "notepad", "tupperware"];
    const descrips = [
        "I bike with a helmet because I don't trust in the biking abilities of others. It doesn't usually fit in my backpack but whatever.",
        "I use a small sketchpad as a notebook. It mostly has lots of lists and plans, and it keeps me organized and sane.",
        "I'm on campus all day from 9am to 6pm if not longer, so I bring my lunch in a tupperware container."
    ]
    
    const imgs = document.querySelectorAll("#content img");
    
    var text = document.querySelector("article");

    let rotateCounter = 0;

    function getXPos(el) {
        var rect = el.getBoundingClientRect();
        return rect.left;
    }

    function rotateRight() {
        // update counter
        rotateCounter = rotateCounter - 1;
        if (rotateCounter < 0) {
            rotateCounter = imgs.length - 1;
        }

        // swap image sources
        for (let i=0; i<imgs.length; i++) {
            transRight(i);
            imgs[i].style.alt = names[(1 + rotateCounter) % images.length];
        }

        // correct name and description
        text.querySelector("h2").innerHTML = names[(1 + rotateCounter) % images.length];
        text.querySelector("p").innerHTML = descrips[(1 + rotateCounter) % images.length];
        
    }
    function rotateLeft() {
        // updateCounter
        rotateCounter = (rotateCounter + 1) % imgs.length;
        
        // move images
        for (let i=0; i < imgs.length; i++) {
            transLeft(i);
            imgs[i].style.alt = names[(1 + rotateCounter) % images.length];
        }

        // correct name and description
        text.querySelector("h2").innerHTML = names[(1 + rotateCounter) % images.length];
        text.querySelector("p").innerHTML = descrips[(1 + rotateCounter) % images.length];

    }

    document.addEventListener("keydown", function(e){
        e.preventDefault();
        const key = e.which;
        // left or down arrow
        if (e.which == 37 || e.which == 40) {
            rotateLeft();
        }
        // right or up arrow
        else if (e.which == 38 || e.which == 39) {
            rotateRight();
        }
    });


    // rotate right on  click on element
    imgs[0].addEventListener("click", function(){
        rotateRight();
    });

    // rotate left on  click on element
    imgs[2].addEventListener("click", function(){
        rotateLeft();
    });


    let touchStartPos = 0;
    let touchEndPos = 0;
    // rotate right on swipe on element
    imgs[1].addEventListener("touchstart", function(event){
        touchStartPos = event.touches[0].clientX;
    });

    // rotate left on swipe on element
    imgs[1].addEventListener("touchend", function(event){
        touchEndPos = event.changedTouches[0].clientX;
        if (touchStartPos < touchEndPos) {
            rotateRight();
        }
        if (touchStartPos > touchEndPos) {
            rotateLeft();
        }
    });

    // shift left transition management 
    // move images to get transition
    // swap img src too
    function transLeft(i) {

        if (i == 0) {

            const newPos = getXPos(imgs[2]);
            const currPos = getXPos(imgs[0])
            
            if (window.innerWidth < 700) {
                imgs[i].style.left = -400 + "px";
            }
            else {
                imgs[i].style.left = (newPos - currPos) + "px";
            }
            imgs[i].style.transition = "all 0.5s";
            
        }
        else {

            const xpos2 = getXPos(imgs[i-1]);
            const xpos1 = getXPos(imgs[i]);
            const shift = xpos2 - xpos1;
            
            imgs[i].style.transition = "all 0.5s";
            imgs[i].style.left = shift + "px";

            
        }

        // actually moves the image sources
        // waits for the animation to finish first
        setTimeout(function(){
                imgs[i].style.transition = "none"; 
                imgs[i].src = images[(i + rotateCounter) % images.length];
                imgs[i].style.left = "0px";
                
        }, 500);

    }

    // shift right transition management 
    // move images to get transition
    // swap img src too
    function transRight(i) {

        if (i === 2) {
            
            const newPos = getXPos(imgs[0]);
            const currPos = getXPos(imgs[2]);
            
            if (window.innerWidth < 700) {
                imgs[i].style.left = 900 + "px";
            }
            else {
                imgs[i].style.left = (newPos - currPos) + "px";
            }
            imgs[i].style.transition = "all 0.5s";
            
        }
        else {

            const xpos2 = getXPos(imgs[i+1]);
            const xpos1 = getXPos(imgs[i]);
            const shift = xpos2 - xpos1;
            
            imgs[i].style.transition = "all 0.5s";
            imgs[i].style.left = shift + "px";

            
        }
        setTimeout(function(){
                imgs[i].style.transition = "none"; 
                imgs[i].src = images[(i + rotateCounter) % images.length];
                imgs[i].style.left = "0px";
                
        }, 500);
    }

    // inverts colors on select change
    document.querySelector("select").addEventListener('change', function(){
        let body = document.querySelector("body");
        let h1 = document.querySelector("h1");
        let h2 = document.querySelector("h2");
        let imgs = document.querySelectorAll("img");
        if (document.querySelector("select").value == "original") {
            body.style.backgroundColor = "rgb(103, 243, 234)";
            h1.style.color = "#2EC4B6";
            h2.style.color = "#2EC4B6";
            imgs[0].style.borderColor = "#2EC4B6";
            imgs[1].style.borderColor = "#FF9F1C";
            imgs[2].style.borderColor = "#2EC4B6";
        }
        else if (document.querySelector("select").value == "inverted") {
            body.style.backgroundColor = "#FFBF69";
            h1.style.color = "#FF9F1C";
            h2.style.color = "#FF9F1C";
            imgs[0].style.borderColor = "#FF9F1C";
            imgs[1].style.borderColor = "#2EC4B6";
            imgs[2].style.borderColor = "#FF9F1C";
        }
    });


}())