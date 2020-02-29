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

    var db = firebase.database();
    const gList = document.querySelector("#glist ol");
    let searchBar = document.getElementById("search");


    function displayList() {
        const dbRef = db.ref('glist').orderByChild('name');
        dbRef.on("child_added", function(snap){
            const items = snap.val();
            const ids = snap.key;

            const newListItem = document.createElement("li");
            newListItem.setAttribute("id", `${ids}`);
            newListItem.innerHTML = `${items.name}<button class="deleteBtn" id="r-${ids}">remove</button>`;
            gList.append(newListItem);
        });
    }
    displayList();

    function addItem(itemName) {

        console.log(itemName);
        var dbRef = db.ref('items').orderByChild('name');

        dbRef.on("child_added", function(snap) { 
            if (snap.val().name == itemName) {
                // console.log("1" + snap.val().name + snap.val().seasonality + snap.val().water + snap.val().nutrition);
                const newItem = {};
                newItem["name"] = snap.val().name;
                newItem["seasonality"] = snap.val().seasonality;
                newItem["water"] = snap.val().water;
                newItem["nutrition"] = snap.val().nutrition;
                db.ref('glist').push(newItem);
            }
        })
    }
    
    document.addEventListener("submit", function(event){
        event.preventDefault();        
        addItem(searchBar.value);
        searchBar.value = "";
    });
    
    function removeItem(itemID) {
        // console.log(itemID);
        db.ref('glist/' + itemID).remove();
        window.location.reload(true);
    }
    
    document.addEventListener("click", function(event) {
        if (event.target.matches('.deleteBtn') ) {
            const itemID = event.target.getAttribute("id").slice(2);
            removeItem(itemID);
        }
    });

}());