
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
    const addBtns = document.querySelectorAll("#browse article p button");
    const story = document.getElementById("story");
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
            newItem.innerHTML = `<img src="images/${item.name}.png" class="${id}" alt="${item.name}">
            <p class="${id}">${item.name}<button class="addBtn ${id}">+</button></p>`;
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
                newItem.innerHTML = `<img src="images/${item.name}.png" class="${id}" alt="${item.name}">
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

    
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains(".addBtn")) {
            console.log("hello");
        }
        console.log("hello");
        const itemID = event.target.classList[1];
        console.log(itemID);
        const dbRef = db.ref('items/' + itemID);
        const newItem = {}; // make new item with the values of the item in the stock list of items
        dbRef.once("value", snap => {
            newItem["name"] = snap.val().name;
            newItem["seasonality"] = snap.val().seasonality;
            newItem["water"] = snap.val().water;
            newItem["nutrition"] = snap.val().nutrition;
        });
        db.ref('glist').push(newItem);
    });


    console.log("hello");
    






}());