
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

    const xBtn = document.getElementById("closeinfo");
    // const addBtns = document.querySelectorAll("#browse article p button");
    const story = document.querySelector("#story div");
    const browse = document.getElementById("browse");
    const search = document.getElementById("mainsearch");


    /************* functions **************/

    // close the story information
   /*  xBtn.addEventListener('click', function(){
        story.className = "collapsable";
        story.className += " collapsed";
        setTimeout(function(){
            story.className += " hidden";
        }, 1000);
        
    }); */

    $("#closeinfo").click(function(){
        $("#story").slideUp(750);
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
                <p class="${id}">${item.name}<button class="${id}">+</button></p>`;
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

        console.log(event);
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
            alert(`${newItem.name} has been added to your grocery list`);
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
    console.log(offset);
    let sectionTops = [];
    let sectionBottoms = [];
    // initialize tops and bottoms
    for (let i = 1; i < story.children.length; i++) {
        sectionTops[i-1] = story.children[i].getBoundingClientRect().top + offset;
        sectionBottoms[i-1] = story.children[i].getBoundingClientRect().bottom + offset;
    }
    // console.log(sectionTops);
    // console.log(sectionBottoms);

    window.addEventListener('scroll', function() {

        let pageBottom = window.pageYOffset + this.window.innerHeight; // current pos
        // this.console.log(pageBottom);

        if (pageBottom > sectionTops[0] && pageBottom < sectionBottoms[0]) {
            // this.console.log(0);

            let sectionHeight = sectionBottoms[0] - sectionTops[0];
            const sectionPs = story.children[0+1].children[1].children;
            let pHeight = sectionHeight / sectionPs.length;

            for (let i = 0; i < sectionPs.length; i++) {
                
                if (pageBottom > (sectionTops[0] + pHeight*i) 
                    && pageBottom > (sectionBottoms[0] - pHeight*(sectionPs.length - i) )) {
                    sectionPs[i].setAttribute("class", "slideable slidein");
                    this.console.log(sectionPs[i]);
                }
            }
            
        }
        else if (pageBottom > sectionTops[1] && pageBottom < sectionBottoms[1]) {
            this.console.log(1);
            let sectionHeight = sectionBottoms[1] - sectionTops[1];
            const sectionPs = story.children[0+2].children[1].children;
            let pHeight = sectionHeight / sectionPs.length;

            for (let i = 0; i < sectionPs.length; i++) {
                if (pageBottom > (sectionTops[1] + pHeight*i) 
                    /* && pageTop > (sectionBottoms[0] - pHeight*(sectionPs.length - i) )*/) {
                    sectionPs[i].setAttribute("class", "slideable slidein");
                    this.console.log(sectionPs[i]);
                }
            }
        }
        else if (pageBottom > sectionTops[2] && pageBottom < sectionBottoms[2]) {
            this.console.log(2);
            // let sectionHeight = sectionBottoms[2] - sectionTops[2];
            slidePs(2, pageBottom);
            
        }
        else if (pageBottom > sectionTops[3] && pageBottom < sectionBottoms[3]) {
            this.console.log(3);
            // let sectionHeight = sectionBottoms[3] - sectionTops[3];
            slidePs(3, pageBottom);
        }
        else if (pageBottom > sectionTops[4] && pageBottom < sectionBottoms[4]) {
            this.console.log(4);
            // let sectionHeight = sectionBottoms[4] - sectionTops[4];
            slidePs(4, pageBottom);
        }

    });

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










}());