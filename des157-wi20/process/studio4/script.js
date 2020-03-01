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


    // variables
    var db = firebase.database();

    const gList = document.querySelector("#glist ol");
    let searchBar = document.getElementById("search");
    const items1 = document.getElementById("items1");
    const items2 = document.getElementById("items2");
    let compare1; // keeps track of first element being compared
    let compare2; // keeps track of second element being compared
    // keep track of current chart 
    let currWaterChart = new Chart(document.getElementById("w"), {
        type: 'bar', // type of chart
        data : {
            labels: ["item 1", "item 2"],
            datasets: [{
                backgroundColor: ['green'],
                barPercentage: 0.5,
                barThickness: 'flex',
                data: [0,0]
            }]
        },
        options: {}
    });


    // display grocery list from database and update select options
    function displayList() {
        const dbRef = db.ref('glist').orderByChild('name');
        dbRef.on("child_added", function(snap){
            const items = snap.val();
            const ids = snap.key;

            // adds new item to the grocery list
            const newListItem = document.createElement("li");
            newListItem.setAttribute("id", `${ids}`);
            newListItem.innerHTML = `${items.name}<button class="deleteBtn" id="r-${ids}">x</button>`;
            gList.append(newListItem);

            // adds new option to the selects
            const newOption = document.createElement("option");
            newOption.setAttribute("value", ids);
            newOption.innerHTML = items.name;
            items1.append(newOption);
            const newOption2 = newOption.cloneNode(true);
            items2.append(newOption2);
        });
    }
    displayList();

    // add item itemName to list, checking if it is a valid item
    function addItem(itemName) {

        console.log(itemName);
        var dbRef = db.ref('items').orderByChild('name');

        dbRef.on("child_added", function(snap) { 
            // check if any of the foods in items match the item to add
            if (snap.val().name == itemName) {

                const newItem = {}; // make new item with the values of the item in the stock list of items
                newItem["name"] = snap.val().name;
                newItem["seasonality"] = snap.val().seasonality;
                newItem["water"] = snap.val().water;
                newItem["nutrition"] = snap.val().nutrition;

                db.ref('glist').push(newItem); // push the new item to the database
            }
        })
    }
    
    // listens for search submission
    document.addEventListener("submit", function(event){
        event.preventDefault();        
        addItem(searchBar.value);
        searchBar.value = "";
    });
    
    // removes item from glist in the database and reloads the page
    function removeItem(itemID) {
        db.ref('glist/' + itemID).remove();
        window.location.reload(true);
    }
    
    // listens for a delete button being clicked, and deletes using the id of the button clicked (matches the id of the item in glist)
    document.addEventListener("click", function(event) {
        if (event.target.matches('.deleteBtn') ) {
            const itemID = event.target.getAttribute("id").slice(2);
            removeItem(itemID);
        }
    });

    // add event listeners for changes in selects
    items1.addEventListener("change", function(event){
        event.preventDefault();
        if (event.target.value != "na") {
            displayCompareData(event.target.value, 1);
        }
        else {
            clearCompareData(1);
        }
        // console.log(event.target.value);
    });
    items2.addEventListener("change", function(event){
        event.preventDefault();
        if (event.target.value != "na") {
            displayCompareData(event.target.value, 2);
        }
        else {
            clearCompareData(2);
        }
        
        // console.log(event.target.value);
    });

    // display the data for the specified item in the specified container
    function displayCompareData(itemID, compareNum) {
        const dbRef = db.ref('glist/' + itemID); // get the item reference
        // console.log(dbRef);
        dbRef.once("value", snap => {
            const item = snap.val();
            console.log(item);
            // set up variable to track items to compare
            if (compareNum == 1) { compare1 = item; }
            else { compare2 = item; }
            // display info
            displaySeasonality(item, document.getElementById(`s${compareNum}`));
            displayWater(compareNum);
            displayNutrition(item, document.getElementById(`n${compareNum}`));
        });
    }

    function clearCompareData(compareNum) {
        // clear item tracker
        if (compareNum == 1) { compare1 = null; }
        else { compare2 = null; }
        // clear info containers
        document.getElementById(`s${compareNum}`).innerHTML = "";
        // document.getElementById(`w${compareNum}`).innerHTML = "";
        // document.getElementById(`n${compareNum}`).innerHTML = "";
    }

    function displaySeasonality(item, container) {
        const seasonalityInfo = item.seasonality;
        // clear previous content
        container.innerHTML = ""; 
        // make and append label
        const label = document.createElement("p");
        label.innerHTML = `${item.name}`;
        container.append(label);
        // make and append month dots
        const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]
        for (let i = 0; i < seasonalityInfo.length; i++) {
            const monthDot = document.createElement("span");
            if (seasonalityInfo[i]) {
                monthDot.setAttribute("class", "available dot");
            }
            else {
                monthDot.setAttribute("class", "notAvailable dot");
            }
            monthDot.innerHTML = `${monthNames[i]}`;
            container.append(monthDot);
        }
    }

    function displayWater(compareNum) {
        var canvas = document.getElementById("w");
        canvas.setAttribute("class", "unhidden"); // unhide it

        if (compare1 && compare2) {
            console.log(1);
            currWaterChart.data.datasets.data = [compare1.water, compare2.water];
            currWaterChart.data.labels = [`${compare1.name} gallons consumed`, `${compare2.name} gallons consumed`];
        }
        else if (compare1) {
            console.log(2);
            console.log(compare1.water)
            // currWaterChart.data.xdatasets.data.unshift(compare1.water);
            currWaterChart.data.datasets.data = [compare1.water, 0];
            console.log(currWaterChart.data.datasets.data);
            currWaterChart.data.labels = [`${compare1.name} gallons consumed`];
        }
        else if (compare2) {
            console.log(3);
            currWaterChart.data.datasets.data = [0, compare2.water];
            currWaterChart.data.labels = [`${compare2.name} gallons consumed`];
        }
        
        currWaterChart.update();
    }

    function displayNutrition(item, canvas) {
        console.log(item);
    }





}());