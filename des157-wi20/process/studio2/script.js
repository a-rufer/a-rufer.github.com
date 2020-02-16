(function(){
    "use strict"

    const images = ["images/helmet.jpg", "images/sketchpad.jpg", "images/tupperware.jpg"];
    const names = ["helmet", "notepad", "tupperware"];
    const descrips = [
        "I bike with a helmet because I have zero trust in the biking abilities of others. It doesn't usually fit in my backpack but whatever.",
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
            rotateLeft();
        }
        if (touchStartPos > touchEndPos) {
            rotateRight();
        }
    });

    // shift left transition management 
    // move images to get transition
    // swap img src too
    function transLeft(i) {

        if (i === 0) {

            const newPos = getXPos(imgs[2]);
            const currPos = getXPos(imgs[0])

            imgs[i].style.transition = "all 0.5s";

            imgs[i].style.left = (newPos - currPos)+ "px";
            
        }
        else {

            const xpos2 = getXPos(imgs[i-1]);
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

    // shift right transition management 
    // move images to get transition
    // swap img src too
    function transRight(i) {

        if (i === 2) {
            
            const newPos = getXPos(imgs[0]);
            const currPos = getXPos(imgs[2]);

            imgs[i].style.transition = "all 0.5s";

            imgs[i].style.left = (newPos - currPos) + "px";
            
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
}())