
(function(){

    "use strict"

    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyAWK5BZdEqshV4_BF2Nd4Onx-eZQ2srqyk",
        authDomain: "studio4-57c6a.firebaseapp.com",
        databaseURL: "https://studio4-57c6a.firebaseio.com",
        projectId: "studio4-57c6a",
        storageBucket: "studio4-57c6a.appspot.com",
        messagingSenderId: "621978312122",
        appId: "1:621978312122:web:619ca581022b75a1201183"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    /************* variables **************/

    var db = firebase.database();

    const story = document.querySelector("#story div");
    const browse = document.getElementById("browse");
    const search = document.getElementById("mainsearch");


    /************* functions **************/

    $("#closeinfo").click(function(){
        $("#story").slideUp(500);
    })


    // fill the browse elements
    function displayItems() {
        const dbRef = db.ref('items').orderByChild('name');
        dbRef.on('child_added', function(snap){
            const item = snap.val();
            const id = snap.key;

            const newItem = document.createElement("article");
            newItem.setAttribute("class", id);
            newItem.innerHTML = `<img src="images/${item.name}.svg" class="${id}" alt="${item.name}">
            <p class="${id}">${item.name}<button class="addBtn ${id}"><img src="images/add.svg" alt="add button"></button></p>`;
            browse.append(newItem);
        });
    }
    displayItems();


    // display one item only (instead of all items in browse section)
    function showOneItem(itemName) {

        // clear everything but the search stuff
        const dontDeleteThis = browse.children[0];
        browse.innerHTML = "";
        browse.append(dontDeleteThis);

        var dbRef = db.ref('items').orderByChild('name');

        let found = false;

        dbRef.on("child_added", function(snap) { 
            // check if any of the foods in items match the item to add
            if (snap.val().name == itemName) {

                found = true;

                const item = snap.val();
                const id = snap.key;
    
                const newItem = document.createElement("article");
                newItem.setAttribute("class", id);
                newItem.innerHTML = `<img src="images/${item.name}.svg" class="${id}" alt="${item.name}">
                <p class="${id}">${item.name}<button class="addBtn ${id}"><img src="images/add.svg" alt="add button"></button></p>`;
                browse.append(newItem);
                
            }
        });

        if (!found) {
            const newItem = document.createElement("p");
            newItem.innerHTML = `item not found`;
                browse.append(newItem);
        }
    }

    // search function
    document.addEventListener('submit', function(event){
        event.preventDefault();
        if (search.value != "") {
            name = search.value.toLowerCase();
            showOneItem(name);
        }
        else {
            // clear items
            const dontDeleteThis = browse.children[0];
            browse.innerHTML = "";
            browse.append(dontDeleteThis);
            
            displayItems();
        }
        search.value = "";
    });

    // click button functionality
    document.addEventListener('click', function(event) {

        // add button
        if (event.target.matches(".addBtn img")) {
            const itemID = event.target.parentElement.classList[1];
            const dbRef = db.ref('items/' + itemID);
            const newItem = {}; // make new item with the values of the item in the stock list of items
            dbRef.once("value", snap => {
                newItem["name"] = snap.val().name;
                newItem["seasonality"] = snap.val().seasonality;
                newItem["water"] = snap.val().water;
                newItem["nutrition"] = snap.val().nutrition;
                newItem["alternatives"] = snap.val().alternatives;
            });
            db.ref('glist').push(newItem);
            addItemPopUp(newItem.name);
        }
        else if (event.target.matches("#browse article") ||
                event.target.matches("#browse article img") || 
                event.target.matches("#browse article p") ) {
            // go to the item page, passing the item id in the url
            window.location.href = `item-page.html?item=${event.target.className}`;
        }
        
    });


    // scroll animations for information

    let offset = window.pageYOffset;
    let sectionTops = [];
    let sectionBottoms = [];
    // initialize tops and bottoms
    for (let i = 1; i < story.children.length; i++) {
        sectionTops[i-1] = story.children[i].getBoundingClientRect().top + offset;
        sectionBottoms[i-1] = story.children[i].getBoundingClientRect().bottom + offset;
    }

    window.addEventListener('scroll', function() {

        let pageBottom = window.pageYOffset + this.window.innerHeight; // current pos

        if (pageBottom > sectionTops[0] && pageBottom < sectionBottoms[0]) {
            slidePs(0, pageBottom);
        }
        else if (pageBottom > sectionTops[1] && pageBottom < sectionBottoms[1]) {
            slidePs(1, pageBottom);
        }
        else if (pageBottom > sectionTops[2] && pageBottom < sectionBottoms[2]) {
            slidePs(2, pageBottom);
            
        }
        else if (pageBottom > sectionTops[3] && pageBottom < sectionBottoms[3]) {
            slidePs(3, pageBottom);
        }
        else if (pageBottom > sectionTops[4] && pageBottom < sectionBottoms[4]) {
            slidePs(4, pageBottom);
        }

    });

    // slides the p in the section onto the screen at the correct scroll location
    function slidePs(sectionNum, pageBottom) {

        let sectionHeight = sectionBottoms[sectionNum] - sectionTops[sectionNum];
        const sectionPs = story.children[sectionNum+1].children[1].children;
        let pHeight = sectionHeight / sectionPs.length;

        for (let i = 0; i < sectionPs.length; i++) {
            
            if (pageBottom > (sectionTops[sectionNum] + pHeight*i) 
                && pageBottom > (sectionBottoms[sectionNum] - pHeight*(sectionPs.length - i) )) {
                sectionPs[i].setAttribute("class", "slideable slidein");
            }
        }
    }



    // makes a popup to notify user that the item has been added

    function addItemPopUp(itemName) {

        // create the popup element
        const popup = document.createElement("aside");
        popup.setAttribute("id", "popup");
        popup.innerHTML = `<p>${itemName} has been added to your grocery list</p>`
        popup.setAttribute("class", "popup");

        // append to body
        document.querySelector("body").append(popup);

        // fade out, then remove
        setTimeout(function(){
            popup.style.opacity = "0";
        }, 1000);
        setTimeout(function(){
            document.querySelector("body").removeChild(popup);
        }, 2000);

    }




}());