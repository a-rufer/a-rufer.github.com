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

    let arrowBtns = document.querySelectorAll(".arrowBtn");


    /************* initializing page to display correct info **************/

    // get item id from url
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const itemID = urlParams.get('item'); // item id 

    // get database reference using that id
    const dbRef = db.ref('items/' + itemID);

    let itemImg = document.querySelector("#item .itemimg");
    let itemName= document.querySelector("#item .itemname"); // selected item
    let alternativesNames = document.querySelectorAll("#alternatives .itemname"); // alternatives names
    let alternativesImgs = document.querySelectorAll("#alternatives img"); // alternatives images

    const seasonalitySection = document.getElementById("seasonality");
    const waterSection = document.getElementById("water");
    const nutritionSection = document.getElementById("nutrition");


    // set up item info 
    dbRef.once('value', snap => {

        // item info
        const item = snap.val();
        itemName.innerHTML = `${item.name}<button class="addBtn ${itemID}">+</button>`;
        itemImg.alt = item.name;
        itemImg.src = `images/${item.name}.svg`;

        // alternatives info

    });


    function displayData(itemID) {
        dbRef.once("value", snap => {
            const item = snap.val();
            // console.log(item);
            // display info
            displaySeasonality(item);
            displayWater(item);
            displayNutrition(item);
        });
    }

    displayData();


    function displaySeasonality(item) {
        // console.log(item);
        const seasonalityInfo = item.seasonality;
        const container = document.getElementById("s");

        // clear previous content
        container.innerHTML = ""; 

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

        // check seasonality
        const date = new Date();
        const month = date.getMonth();
        if (seasonalityInfo[month] == 1) {
            document.getElementById("inseason").innerHTML = "yes";
        }
        else {
            document.getElementById("inseason").innerHTML = "no";
        }

    }


    let currWaterChart = new Chart(document.getElementById("w"), {
        type: 'bar', // type of chart
        data : {
            labels: ["item 1"],
            datasets: [{
                backgroundColor: ['#74BA3B', 'green'],
                data: [0]
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
    
    function displayWater(item) {

        currWaterChart.data.datasets[0].data = [item.water];
        currWaterChart.data.labels = [`${item.name}`];
        
        currWaterChart.update();
    }

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
                }
            ]
        },
        options: {
            scales : {
                xAxes: [{
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 10
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "per cup"
                    }
                }],
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

    function displayNutrition(item) {

        let dataArray1 = currNutritionChart.data.datasets[0].data;

        dataArray1[0] = item.nutrition.cal;
        dataArray1[1] = item.nutrition.iron;
        dataArray1[2] = item.nutrition.protein;
        dataArray1[3] = item.nutrition.fiber;
        currNutritionChart.data.datasets[0].label = item.name;

        currNutritionChart.update();
    }


    // click button functionality
    document.addEventListener('click', function(event) {

        // add button
        if (event.target.classList[0] == "addBtn") {
            const newItem = {}; // make new item with the values of the item in the stock list of items
            dbRef.once("value", snap => {
                const item = snap.val();
                newItem["name"] = item.name;
                newItem["seasonality"] = item.seasonality;
                newItem["water"] = item.water;
                newItem["nutrition"] = item.nutrition;
            });

            // timer bc of JS asynchronicity making it add undefined things
            setTimeout(function(){
                db.ref('glist').push(newItem);
                alert(`${newItem.name} has been added to your grocery list`);
                console.log(newItem.name);
                console.log("hello3");
            }, 90);
            
        }
        // clicking on alternatives
        else if (event.target.matches("#alternatives article") ||
                event.target.matches("#alternatives article img") || 
                event.target.matches("#alternatives article p") ) {
            // go to the item page, passing the item id in the url
            window.location.href = `item-page.html?item=${event.target.className}`;
        }
        // toggle arrow
        else if (event.target.matches(".arrowBtn")){

            if (event.target.matches(".open")) {
                event.target.src = "images/closed.svg";
                event.target.setAttribute("class", "arrowBtn closed");
                event.target.parentElement.nextElementSibling.setAttribute("class", "collapsable hidden");
            }
            else if (event.target.matches(".closed")) {
                event.target.src = "images/open.svg";
                event.target.setAttribute("class", "arrowBtn open");
                event.target.parentElement.nextElementSibling.setAttribute("class", "collapsable");
            }

        }

        
    });

    





}())