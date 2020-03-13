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


    // water info: https://waterfootprint.org/media/downloads/Report47-WaterFootprintCrops-Vol1.pdf

    /************************ GROCERY LIST STUFF ************************/

    // variables
    var db = firebase.database();

    const clearBtn = document.getElementById("clear");
    const gList = document.querySelector("#glist ol");
    let searchBar = document.getElementById("search");
    const items1 = document.getElementById("items1");
    const items2 = document.getElementById("items2");
    let compare1 = null; // keeps track of first element being compared
    let compare2 = null; // keeps track of second element being compared

    // current charts 

    let currWaterChart = new Chart(document.getElementById("w"), {
        type: 'bar', // type of chart
        data : {
            labels: ["item 1", "item 2"],
            datasets: [{
                backgroundColor: ['#74BA3B', 'green'],
                data: [0,0]
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0,
                        suggestedMax: 9
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "water consumed (kg/L)"
                    }
                }],
                xAxes: [{
                    display: true
                }]
            },
            legend: {
                display: false
            }
        }
    });

    let currNutritionChart = new Chart( document.getElementById("n"), {
        type: 'horizontalBar',
        data: {
            labels: ['calories', 'iron', 'protein', 'fiber'],
            datasets: [
                {
                    // first item
                    backgroundColor: '#74BA3B',
                    label: "item 1",
                    data: [0,0,0,0]
                },
                {
                    // second item
                    backgroundColor: 'green',
                    label: "item 2",
                    data: [0,0,0,0]
                }
            ]
        },
        options: {
            scales : {
                xAxes: [{
                    ticks: {
                        suggestedMin: -10,
                        suggestedMax: 10
                    },
                    stacked: true,
                    scaleLabel: {
                        display: true,
                        labelString: "per cup"
                    }
                }],
                yAxes: [{
                    stacked: true
                }]
            },
            legend: {
                labels: {
                    boxWidth: 15,
                },
                fontFamily: 'Arial',
                align: 'center',
                text: ['h','e'],
            }
        }
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

        // console.log(itemName);
        var dbRef = db.ref('items').orderByChild('name');

        dbRef.on("child_added", function(snap) { 
            // check if any of the foods in items match the item to add
            if (snap.val().name == itemName) {

                const newItem = {}; // make new item with the values of the item in the stock list of items
                newItem["name"] = snap.val().name;
                newItem["seasonality"] = snap.val().seasonality;
                newItem["water"] = snap.val().water;
                newItem["nutrition"] = snap.val().nutrition;
                newItem["alternatives"] = snap.val().alternatives;

                db.ref('glist').push(newItem); // push the new item to the database
            }
        })
    }
    
    // listens for search submission
    document.addEventListener("submit", function(event){
        event.preventDefault();  
        addItem(searchBar.value.toLowerCase());
        searchBar.value = "";
    });
    
    // removes item from glist in the database and reloads the page
    function removeItem(itemID) {
        db.ref('glist/' + itemID).remove();
        window.location.reload(true);
    }
    
    // listens for a delete button being clicked, and deletes using the id of the button clicked (matches the id of the item in glist)
    // listens for go button
    // listens for click on list item
    document.addEventListener("click", function(event) {
        if (event.target.matches('.deleteBtn') ) {
            const itemID = event.target.getAttribute("id").slice(2);
            removeItem(itemID);
        }
        else if (event.target.matches("#go")) {
            addItem(searchBar.value.toLowerCase());
            searchBar.value = "";
        }
        else if (event.target.matches("li")) {

            // get item id in items
            const itemName = event.target.innerHTML.split("<")[0];
            
            var dbRef = db.ref('items').orderByChild('name');

            let itemID;
            dbRef.on("child_added", function(snap) { 
                if (snap.val().name == itemName) {
                    itemID = snap.key;
                }
            })

            // timeout to prevent issues with asynchronicity
            setTimeout(function(){
                console.log(itemID);
                // go to the item page, passing the item id in the url
                window.location.href = `item-page.html?item=${itemID}`;
            }, 100); 
        }

        // toggle arrow
        else if (event.target.matches(".arrowBtn")){

            if (event.target.matches(".open")) {
                event.target.style.transform = "rotate(-90deg)";
                // event.target.src = "images/closed.svg";
                event.target.setAttribute("class", "arrowBtn closed");
                event.target.parentElement.nextElementSibling.setAttribute("class", "collapsable hidden");
                
            }
            else if (event.target.matches(".closed")) {
                event.target.style.transform = "rotate(0deg)";
                // event.target.src = "images/open.svg";
                event.target.setAttribute("class", "arrowBtn open");
                event.target.parentElement.nextElementSibling.setAttribute("class", "collapsable");
            }

        }
    });

    // clear all button
    clearBtn.addEventListener('click', function(){
        let items = document.querySelectorAll("#glist ol li");
        for (let i = 0; i < items.length; i++) { // get the id of each list item and remove it
            const id = items[i].getAttribute("id"); 
            removeItem(id);
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
    });
    items2.addEventListener("change", function(event){
        event.preventDefault();
        if (event.target.value != "na") {
            displayCompareData(event.target.value, 2);
        }
        else {
            clearCompareData(2);
        }
        
    });

    // display the data for the specified item in the specified container
    function displayCompareData(itemID, compareNum) {
        const dbRef = db.ref('glist/' + itemID); // get the item reference
        // console.log(dbRef);
        dbRef.once("value", snap => {
            const item = snap.val();
            console.log(item);
            // set up variable to track items to compare
            if (compareNum == 1) { 
                compare1 = item; 
            } else { 
                compare2 = item; 
            }
            // display info
            displaySeasonality(item, document.getElementById(`s${compareNum}`));
            displayWater();
            displayNutrition();
        });
    }

    // clears all data for the item indicated by the number
    function clearCompareData(compareNum) {
        // clear item tracker and chart
        if (compareNum == 1) { 
            compare1 = null; 
        }
        else { 
            compare2 = null; 
        }
        // clear info containers
        document.getElementById(`s${compareNum}`).innerHTML = "";
        clearWater(compareNum);
        clearNutrition(compareNum);
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

    function displayWater() {

        if (compare1 != null && compare2 != null) {
            console.log(1);
            console.log(compare1.water)
            console.log(compare2.water)
            currWaterChart.data.datasets[0].data = [compare1.water, compare2.water];
            currWaterChart.data.labels = [`${compare1.name}`, `${compare2.name}`];
        }
        else if (compare1 != null) {
            console.log(2);
            console.log(compare1.water)
            currWaterChart.data.datasets[0].data = [compare1.water, 0];
            currWaterChart.data.labels = [`${compare1.name}`, "item 2"];
        }
        else if (compare2 != null) {
            console.log(3);
            console.log(compare2.water)
            currWaterChart.data.datasets[0].data = [0, compare2.water];
            currWaterChart.data.labels = ["item 1", `${compare2.name}`];
        }
        
        currWaterChart.update();
    }

    function clearWater(compareNum) {
        if (compareNum == 1) {
            if (compare2 != null) {
                currWaterChart.data.datasets[0].data = [0, compare2.water];
                currWaterChart.data.labels = [`item 1`, `${compare2.name}`];
            }
            else {
                currWaterChart.data.datasets[0].data = [0, 0];
                currWaterChart.data.labels = [`item 1`, `item 2`];
            }
            compare1 = null;
        }
        else if (compareNum == 2) {
            if (compare1 != null) {
                currWaterChart.data.datasets[0].data = [compare1.water, 0];
                currWaterChart.data.labels = [`${compare1.name}`, `item 2`];
            }
            else {
                currWaterChart.data.datasets[0].data = [0, 0];
                currWaterChart.data.labels = [`item 1`, `item 2`];
            }
            compare2 = null;
        }
        currWaterChart.update();
    }

    function displayNutrition() {
        document.getElementById("n");

        let dataArray1 = currNutritionChart.data.datasets[0].data;
        let dataArray2 = currNutritionChart.data.datasets[1].data;
        console.log(dataArray1, dataArray2);

        if (compare1 != null && compare2 != null) {

            dataArray1[0] = -(compare1.nutrition.cal);
            dataArray1[1] = -(compare1.nutrition.iron);
            dataArray1[2] = -(compare1.nutrition.protein);
            dataArray1[3] = -(compare1.nutrition.fiber);

            dataArray2[0] = compare2.nutrition.cal;
            dataArray2[1] = compare2.nutrition.iron;
            dataArray2[2] = compare2.nutrition.protein;
            dataArray2[3] = compare2.nutrition.fiber;

            currNutritionChart.data.datasets[0].label = compare1.name;
            currNutritionChart.data.datasets[1].label = compare2.name;

        }
        else if (compare1 != null) {

            dataArray1[0] = compare1.nutrition.cal;
            dataArray1[1] = compare1.nutrition.iron;
            dataArray1[2] = compare1.nutrition.protein;
            dataArray1[3] = compare1.nutrition.fiber;

            currNutritionChart.data.datasets[0].label = compare1.name;
        }
        else if (compare2 != null) {
            dataArray2[0] = compare2.nutrition.cal;
            dataArray2[1] = compare2.nutrition.iron;
            dataArray2[2] = compare2.nutrition.protein;
            dataArray2[3] = compare2.nutrition.fiber;

            currNutritionChart.data.datasets[1].label = compare2.name;
        }
        
        currNutritionChart.update();
    }

    function clearNutrition(compareNum) {
        if (compareNum == 1) {
            console.log("delete 1");
            console.log(currNutritionChart.data.datasets[0].data);
            currNutritionChart.data.datasets[0].data = [0,0,0,0];
            compare1 = null;
            console.log(currNutritionChart.data.datasets[0].data);
        }
        else if (compareNum == 2) {
            console.log("delete 2");
            currNutritionChart.data.datasets[1].data = [0,0,0,0];
            compare2 = null;
        }
        currNutritionChart.update();
    }



}());