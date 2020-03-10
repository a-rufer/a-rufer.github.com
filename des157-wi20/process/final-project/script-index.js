
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


    /************* functions **************/

    // close the story information
    xBtn.addEventListener('click', function(){
        story.className = "collapsable";
        story.className += " collapsed";
        setTimeout(function(){
            story.className += " hidden";
        }, 1000);
        
    });


    // fill the browse elements
    function displayItems() {
        const dbRef = db.ref('items').orderByChild('name');
        dbRef.on('child_added', function(snap){
            const item = snap.val();
            const id = snap.key;

            const newItem = document.createElement("article");
            newItem.setAttribute("class", id);
            newItem.innerHTML = `<img src="images/${item.name}.png" class="${id}" alt="${item.name}">
            <p class="${id}">${item.name}<button class="${id}">+</button></p>`;
            browse.append(newItem);
        });
    }





}());