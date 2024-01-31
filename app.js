/* 
 * Copyright (c) 2024 Alexander Poth, All rights reserved.
 */
$(document).ready(function(){

    // Variables
    // #region

    // Array for gameData
    let gameData = {
        logs: 0, 
        stone: 0, 
        iron: 0, 
        pickaxes: 0,
        axes: 1,
        money: 0,
        logsPlus: 1,
        ironPlus: 1,
        choppers: 0,
        miners: 0,
        autoIronPlus: 0,
        autoMinePrice: 200,
        autoChopperPrice: 100,
        autoMineStone: 100,
        pickaxePrice: 50,
        axePrice: 25,
        ironIngot: 0
    };

    // Load data from local storage
    if (localStorage.getItem("gameData")) {
        let loadedData = JSON.parse(localStorage.getItem("gameData"));

        // Check for null values
        if (loadedData !== null) {
            gameData = loadedData;
        } else {
            console.error("Loaded data is null");
            alert("Error: Loaded data is null");
        }
    }

    // Constants
    const logPrice = 1;
    const stonePrice = 2;
    const ironPrice = 5;
    const priceScalar = 1.5;
    var baseGameTime = 1000;


    // Game elements
    // #region
    var autoMinerButton = document.getElementById("autoMine");
    var autoChopperButton = document.getElementById("autoChopper");
    var axeButton = document.getElementById("buyAxe");
    var pickaxeButton = document.getElementById("buyPickaxe");
    var sell1Button = document.getElementById("sell1");
    var sell10Button = document.getElementById("sell10");
    var sellAllButton = document.getElementById("sellAll");
    var sellStoneRate = document.getElementById("sellStoneRate");
    var sell1StoneButton = document.getElementById("sell1Stone");
    var sell10StoneButton = document.getElementById("sell10Stone");
    var sellAllStoneButton = document.getElementById("sellAllStone");
    var sellIronRate = document.getElementById("sellIronRate");
    var sell1IronButton = document.getElementById("sell1Iron");
    var sell10IronButton = document.getElementById("sell10Iron");
    var sellAllIronButton = document.getElementById("sellAllIron");
    // #endregion

    // Action buttons
    // #region
    $("#chop").click(function(){
        if (gameData.axes >= 2) {
            gameData.logs += gameData.axes;
            changeInventory();
            changeMarket();
        }else{
            gameData.logs += gameData.logsPlus;
            changeInventory();
            changeMarket();
        }
    })

    $("#mineStone").click(function(){
        if (gameData.pickaxes >= 1) {
            gameData.stone += gameData.pickaxes;
            changeInventory();
        }else{
            gameData.stone ++;
            changeInventory();
        }
    })

    $("#mineIron").click(function(){
        if (gameData.pickaxes >= 3) {
            gameData.iron += gameData.pickaxes / 3;
            changeInventory();
        }else{
            gameData.iron += gameData.ironPlus;
            changeInventory();
        }
    })

    // #endregion

    // Sell Buttons
    // #region
    $("#sell1").click(function(){
        gameData.logs--;
        gameData.money += logPrice;
        changeInventory();
        changeMarket();
    })

    $("#sell10").click(function(){
        gameData.logs-=10;
        gameData.money += logPrice*10;
        changeInventory();
        changeMarket();
    })

    $("#sellAll").click(function(){
        gameData.money += logPrice*gameData.logs;
        gameData.logs = 0;
        changeInventory();
        changeMarket();
    })

    $("#sell1Stone").click(function(){
        gameData.stone--;
        gameData.money += stonePrice;
        changeInventory();
        changeMarket();
    })

    $("#sell10Stone").click(function(){
        gameData.stone-=10;
        gameData.money += stonePrice*10;
        changeInventory();
        changeMarket();
    })

    $("#sellAllStone").click(function(){
        gameData.money += stonePrice*gameData.stone;
        gameData.stone = 0;
        changeInventory();
        changeMarket();
    })

    $("#sell1Iron").click(function(){
        gameData.iron--;
        gameData.money += ironPrice;
        changeInventory();
        changeMarket();
    })

    $("#sell10Iron").click(function(){
        gameData.iron-=10;
        gameData.money += ironPrice*10;
        changeInventory();
        changeMarket();
    })

    $("#sellAllIron").click(function(){
        gameData.money += ironPrice*gameData.iron;
        gameData.iron = 0;
        changeInventory();
        changeMarket();
    })

    // #endregion

    // Upgrade buttons
    // #region
    $("#autoChopper").click(function(){
        gameData.money -= gameData.autoChopperPrice;
        gameData.choppers++;
        gameData.autoChopperPrice *= priceScalar;
        changeInventory();
        changeMarket();
        changeForge();
    })

    $("#autoMine").click(function(){
        gameData.money -= gameData.autoMinePrice;
        gameData.stone -= gameData.autoMineStone;
        gameData.miners++;
        gameData.autoMinePrice *= priceScalar;
        gameData.autoMineStone *= priceScalar;
        changeInventory();
        changeMarket();
        changeForge();
    })

    // #endregion

    // Item Buttons
    // #region
    $("#buyPickaxe").click(function(){
        gameData.money -= gameData.pickaxePrice;
        gameData.pickaxes++;
        gameData.pickaxePrice *= priceScalar;
        changeInventory();
        changeMarket();
    })

    $("#buyAxe").click(function(){
        gameData.money -= gameData.axePrice;
        gameData.axes++;
        gameData.axePrice *= 2;
        changeInventory();
        changeMarket();
    })

    // #endregion

    // Forge buttons
    // #region

    $("#ironIngotBtn").click(function(){
        if (gameData.iron <= 0) {
            alert("You don't have any iron ore in your inventory");
        } else {
            gameData.ironIngot++;
            gameData.iron--;
        }
        changeForge();
        changeInventory();
        changeMarket();
    });


    // #endregion

    // Change Screen Buttons
    // #region
    $("#visit").click(function(){
        if($(".marketplace").css("display") === "none"){
            $(".marketplace").css("display", "flex");
            $(".forgeDiv").css("display", "none");
        }else{
            $(".marketplace").css("display", "none");
        }
        changeMarket();
    })

    $("#visitForge").click(function(){
        if($(".forgeDiv").css("display") === "none"){
            $(".forgeDiv").css("display", "flex");
            $(".marketplace").css("display", "none");
        }else{
            $(".forgeDiv").css("display", "none");
        }
        changeForge();
    })
   
    // #endregion

    // Function to show inventory and current resources
    // #region
    function changeInventory() {
        const visibilityOptions = {
            visible: 'visible',
            hidden: 'hidden'
        };
    
        $("#money").html(`<img id='coin' src='graphics\\coin.png'> $${gameData.money.toFixed(2)}`);
        $("#axes").html(Math.max(gameData.axes, 1).toFixed(0));
    
        setVisibility("#chopperLbl", gameData.choppers >= 1);
        displayElement("#choppers", gameData.choppers >= 1);
    
        $("#logs").html(gameData.logs.toFixed(0));
    
        if (gameData.pickaxes > 0) {
            $("#pickaxes").html(gameData.pickaxes.toFixed(0));
            setVisibility("#mineStone", "visible");
            setVisibility("#pickaxePic, #stonePic, #stone, #stoneSellRate, #sell1Stone, #sell10Stone, #sellAllStone", "visible");
        }
    
        if (gameData.pickaxes >= 3) {
            setVisibility("#ironPic, #iron, #mineIron, #ironSellRate, #sell1Iron, #sell10Iron, #sellAllIron", "visible");
        }
    
        setVisibility("#miners, #minerLbl", gameData.miners >= 1);
        displayElement("#miners", gameData.miners >= 1);
    
        $("#stone").html(Math.max(gameData.stone, 0).toFixed(0));
        $("#iron").html(Math.max(gameData.iron, 0).toFixed(0));
    
        if (gameData.iron >= 1) {
            $("#visitForge").css("visibility", "visible");
        }

        if (gameData.ironIngot >= 1) {
            $("#ironIngotPic").css("visibility", "visible");
            $("#ironIngot").css("visibility", "visible");
            $("#ironIngot").html(Math.max(gameData.ironIngot, 0).toFixed(0));
        }
    
        // Function to set visibility of elements
        function setVisibility(selectors, condition) {
            const selectorArray = selectors.split(", ");
            selectorArray.forEach(selector => {
                $(selector).css("visibility", condition ? visibilityOptions.visible : visibilityOptions.hidden);
            });
        }
    
        // Function to display elements
        function displayElement(selector, condition) {
            $(selector).html(condition ? `<img src='graphics\\${selector.slice(1)}.png' alt='${selector.slice(1)} image'> ${gameData[selector.slice(1)]}` : "");
        }
    }
    // #endregion

    // Function to update market screen to show correct buttons
    // #region
    function changeMarket(){
        // Array to update sell button prices
        $("#buyAxe").html("Buy 1 Axe [$" + gameData.axePrice.toFixed(2) + "]");
        $("#buyPickaxe").html("Buy 1 Pickaxe [$" + gameData.pickaxePrice.toFixed(2) + "]");
        $("#autoChopper").html("Buy 1 Auto Chopper [$" + gameData.autoChopperPrice.toFixed(2) + "]");
        $("#autoMine").html("Buy 1 Auto Miner [$" + gameData.autoMinePrice.toFixed(2) + "] [" + gameData.autoMineStone.toFixed(2) + "] stone");

        // Array for resource buttons
        const resourceButtons = [
            { resource: "logs", buttons: [sell1Button, sell10Button, sellAllButton] },
            { resource: "stone", buttons: [sell1StoneButton, sell10StoneButton, sellAllStoneButton] },
            { resource: "iron", buttons: [sell1IronButton, sell10IronButton, sellAllIronButton] }
        ];

        // Determine which sell buttons are enabled based on current inventory
        for (const { resource, buttons } of resourceButtons) {
            buttons[0].disabled = gameData[resource] >= 1 ? false : true;
            buttons[1].disabled = gameData[resource] >= 10 ? false : true;
            buttons[2].disabled = gameData[resource] > 0 ? false : true;
        }
    
        // Array for item buttons
        const itemButtons = [
            { button: autoChopperButton, price: gameData.autoChopperPrice },
            { button: pickaxeButton, price: gameData.pickaxePrice },
            { button: axeButton, price: gameData.axePrice }
        ];
    
        // Determine which item buttons are enabled based on current inventory
        for (const { button, price } of itemButtons) {
            button.disabled = gameData.money >= price ? false : true;
        }
    
        // Check and set display for autoMine button
        autoMineButtonDisplay();
        autoMinerButton.disabled = gameData.money >= gameData.autoMinePrice && gameData.stone >= gameData.autoMineStone ? false : true;
    }

    // Function for showing and hiding the autoMine button
    function autoMineButtonDisplay() {
        $("#autoMine").css("display", gameData.pickaxes < 1 ? "none" : "block");
    }
    // #endregion

    // Function to update Forge screen
    // #region
    function changeForge(){

    }
    // #endregion

    // Save/Load and Reset Game buttons
    // #region

    $("#saveBtn").click(function(){
        // Call saveGameData function
        saveGameData();
    });
    
    // $("#loadBtn").click(function(){
    //     // Check if there is saved data
    //     if (localStorage.getItem("gameData")) {
    //         // Parse the saved data from localStorage
    //         let loadedData = JSON.parse(localStorage.getItem("gameData"));

    //         // Log success
    //         console.log("Loaded Game Data", gameData);
    //         alert("Loaded Game Data");
    //     } else {
    //         // Log an error if there is no saved data
    //         console.error("No saved data found");
    //         alert("No saved data found");
    //     }
    // });

    // Let player reset their game if they wish to
    
    
    $("#resetBtn").click(function(){
        let text;
        if (confirm("Are you sure you want to reset your game?") == true){
            text = "Yes";
            gameData = {
                logs: 0, 
                stone: 0, 
                iron: 0, 
                pickaxes: 0,
                axes: 1,
                money: 0,
                logsPlus: 1,
                ironPlus: 1,
                choppers: 0,
                miners: 0,
                autoIronPlus: 0,
                autoMinePrice: 200,
                autoChopperPrice: 100,
                autoMineStone: 100,
                pickaxePrice: 50,
                axePrice: 25,
                ironIngot: 0
            };
            console.log("Game Reset Successful!");
            saveGameData();
            changeInventory();
            changeMarket();
            location.reload();
        }else {
            text = "No";
        }
    });

    // save game data function
    function saveGameData(){
        if (localStorage){
            localStorage.setItem("gameData", JSON.stringify(gameData));
            console.log("Game Data Saved", gameData);
            alert("Game Saved Successfully!");
        }
    };

    // #endregion

    // Game Interval
    // #region
    setInterval(function(){
        gameData.logs += gameData.choppers;
        gameData.stone += gameData.miners;
        changeInventory();
        changeMarket();
        changeForge();
        // if (localStorage) {
        //     localStorage.setItem("gameData", JSON.stringify(gameData));
        //     console.log("Game Data", gameData)
        // }
    }, baseGameTime);
    // #endregion
});