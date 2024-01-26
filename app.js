$(document).ready(function(){
    // Variables
    // #region

    // Array for gameData
    let gameData = {
        logs: 0, 
        stone: 0, 
        iron: 100, 
        pickaxes: 0,
        axes: 1,
        money: 1000,
        logsPlus: 1,
        stonePlus: 1,
        ironPlus: 1,
        autoLogPlus: 0,
        autoStonePlus: 0,
        autoIronPlus: 0,
        autoMinePrice: 200,
        autoChopperPrice: 100,
        autoMineStone: 100,
        pickaxePrice: 50,
        axePrice: 25 
    };
    

    // // Resources
    // var logs = 0;
    // var stone = 0;
    // var iron = 100;
    // // Items
    // var pickaxes = 0;
    // var axes = 1;
    // // Currency
    // var money = 1000;
    // // Counters
    // var logsPlus = 1;
    // var stonePlus = 1;
    // var ironPlus = 1;
    // var autoLogPlus = 0;
    // var autoStonePlus = 0;
    // var autoIronPlus = 0;
    // // Prices
    // var autoMinePrice = 200;
    // var autoChopperPrice = 100;
    // var autoMineStone = 100;
    // var pickaxePrice = 50;
    // var axePrice = 25;

    // Constants
    const logPrice = 1;
    const stonePrice = 2;
    const ironPrice = 5;
    const priceScalar = 1.5;
    var baseGameTime = 1000;

    // Game elements
    var autoMinerButton = document.getElementById("autoMine");
    var autoChopperButton = document.getElementById("autoChopper");
    var axeButton = document.getElementById("buyAxe");
    var pickaxeButton = document.getElementById("buyPickaxe");

    let savedData = [];


    

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
        if (gameData.pickaxes > 1) {
            gameData.stone += gameData.pickaxes;
            changeInventory();
        }else{
            stone += stonePlus;
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
        gameData.money += gameData.logPrice;
        changeInventory();
        changeMarket();
    })

    $("#sell10").click(function(){
        gameData.logs-=10;
        gameData.money += gameData.logPrice*10;
        changeInventory();
        changeMarket();
    })

    $("#sellAll").click(function(){
        gameData.money += gameData.logPrice*gameData.logs;
        gameData.logs = 0;
        changeInventory();
        changeMarket();
    })

    $("#sell1Stone").click(function(){
        gameData.stone--;
        gameData.money += gameData.stonePrice;
        changeInventory();
        changeMarket();
    })

    $("#sell10Stone").click(function(){
        gameData.stone-=10;
        gameData.money += gameData.stonePrice*10;
        changeInventory();
        changeMarket();
    })

    $("#sellAllStone").click(function(){
        gameData.money += gameData.stonePrice*gameData.stone;
        gameData.stone = 0;
        changeInventory();
        changeMarket();
    })

    $("#sell1Iron").click(function(){
        gameData.iron--;
        gameData.money += gameData.ironPrice;
        changeInventory();
        changeMarket();
    })

    $("#sell10Iron").click(function(){
        gameData.iron-=10;
        gameData.money += gameData.ironPrice*10;
        changeInventory();
        changeMarket();
    })

    $("#sellAllIron").click(function(){
        gameData.money += gameData.ironPrice*gameData.iron;
        gameData.iron = 0;
        changeInventory();
        changeMarket();
    })

    // #endregion

    // Upgrade buttons
    // #region
    $("#autoChopper").click(function(){
        gameData.money -= gameData.autoChopperPrice;
        gameData.autoLogPlus++;
        gameData.autoChopperPrice *= priceScalar;
        $("#autoChopper").html("Buy 1 Auto Chopper [$" + gameData.autoChopperPrice.toFixed(2) + "]");
        changeInventory();
        changeMarket();
        changeForge();
    })

    $("#autoMine").click(function(){
        gameData.money -= gameData.autoMinePrice;
        gameData.stone -= gameData.autoMineStone;
        gameData.autoStonePlus++;
        gameData.autoMinePrice *= priceScalar;
        gameData.autoMineStone *= priceScalar;
        $("#autoMine").html("Buy 1 Auto Miner [$" + gameData.autoMinePrice.toFixed(2) + "] [" + gameData.autoMineStone.toFixed(2) + "] stone");
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
        $("#buyPickaxe").html("Buy 1 Pickaxe [$" + gameData.pickaxePrice.toFixed(2) + "]");
        changeInventory();
        changeMarket();
    })

    $("#buyAxe").click(function(){
        gameData.money -= gameData.axePrice;
        gameData.axes++;
        gameData.axePrice *= 2;
        $("#buyAxe").html("Buy 1 Axe [$" + gameData.axePrice.toFixed(2) + "]");
        changeInventory();
        changeMarket();
    })

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
    function changeInventory(){
        $("#money").html("<img id='coin' src='graphics\\coin.png'> $" + gameData.money);
        
        if(gameData.axes > 1){
            $("#axes").html(gameData.axes.toFixed(0));
        }else{
            $("#axes").html("1");
        }

        if(gameData.autoLogPlus >= 1){
            $("#choppers").html("<img src='graphics\\chopper.png' alt='chopper image'> " + gameData.autoLogPlus);
            $("#choppers").css("visibility", "visible");
            $("#chopperLbl").css("visibility", "visible");
        }else{
            $("#choppers").css("visibility", "hidden");
            $("#chopperLbl").css("visibility", "hidden");
        }

        if(gameData.logs > 0){
            $("#logs").html(gameData.logs.toFixed(0));
        }else{
            $("#logs").html(gameData.logs.toFixed(0));
        }

        if(gameData.pickaxes > 0){
            $("#pickaxes").html(gameData.pickaxes.toFixed(0));
            $("#mineStone").css("visibility", "visible");
            $("#pickaxePic").css("visibility", "visible");
        }else{
            $("#pickaxes").html("");
            $("#mineStone").css("visibility", "hidden");
        }

        if(gameData.pickaxes >= 3){
            $("#mineIron").css("visibility", "visible");
        }else{
            $("#mineIron").css("visibility", "hidden");
        }

        if(gameData.autoStonePlus >= 1){
            $("#miners").html("<img src='graphics\\miner.png' alt='miner image'> " + gameData.autoStonePlus);
            $("#miner").css("visibility", "visible");
            $("#minerLbl").css("visibility", "visible");
        }else{
            $("#miner").css("visibility", "hidden");
            $("#minerLbl").css("visibility", "hidden");
        }

        if(gameData.stone > 0){
            $("#stone").html(gameData.stone.toFixed(0));
            $("#stonePic").css("visibility", "visible");
        }else{
            $("#stone").html("");
        }

        if(gameData.iron > 0){
            $("#iron").html(gameData.iron.toFixed(0));
            $("#ironPic").css("visibility", "visible");
        }else{
            $("#iron").html("");
        }

        if(gameData.iron >= 100){
            $("#visitForge").css("visibility", "visible");
        }
    }
    // #endregion

    // Function to update market screen to show correct buttons
    // #region
    function changeMarket(){
        // if(logs > 0){
        //     $("#sellAll").css("display", "block");
        // }else{
        //     $("#sellAll").css("display", "none");
        // }

        // if(logs >= 1){
        //     $("#sell1").css("display", "block");
        // }else{
        //     $("#sell1").css("display", "none");
        // }

        // if(logs >= 10){
        //     $("#sell10").css("display", "block");
        // }else{
        //     $("#sell10").css("display", "none");
        // }

        // if(stone > 0){
        //     $("#sellAllStone").css("display", "block");
        // }else{
        //     $("#sellAllStone").css("display", "none");
        // }

        // if(stone >= 1){
        //     $("#sell1Stone").css("display", "block");
        // }else{
        //     $("#sell1Stone").css("display", "none");
        // }

        // if(stone >= 10){
        //     $("#sell10Stone").css("display", "block");
        // }else{
        //     $("#sell10Stone").css("display", "none");
        // }

        // if(iron >= 1){
        //     $("#sell1Iron").css("display", "block");
        // }else{
        //     $("#sell1Iron").css("display", "none");
        // }

        // if(iron >= 10){
        //     $("#sell10Iron").css("display", "block");
        // }else{
        //     $("#sell10Iron").css("display", "none");
        // }
        
        // if(iron > 0){
        //     $("#sellAllIron").css("display", "block");
        // }else{
        //     $("#sellAllIron").css("display", "none");
        // }

        if(gameData.money >= gameData.autoChopperPrice){
            autoChopperButton.disabled = false;
        }else{
            autoChopperButton.disabled = true;
        }

        if(gameData.money >= gameData.pickaxePrice){
            pickaxeButton.disabled = false;
        }else{
            pickaxeButton.disabled = true;
        }

        if(gameData.money >= gameData.axePrice){
            axeButton.disabled = false;
        }else{
            axeButton.disabled = true;
        }

        if(gameData.pickaxes < 1){
            $("#autoMine").css("display", "none")
        }else{
            $("#autoMine").css("display", "block")
        }
        if(gameData.money >= gameData.autoMinePrice && gameData.stone >= gameData.autoMineStone){
            autoMinerButton.disabled = false;
        }else{
            autoMinerButton.disabled = true;
        }
    }
    // #endregion

    // Function to update Forge screen
    // #region
    function changeForge(){

    }
    // #endregion

    // Save and Load Game buttons
    // #region

    $("#saveBtn").click(function(){
        savedData = [
            gameData.logs, 
            gameData.stone, 
            gameData.iron, 
            gameData.pickaxes,
            gameData.axes,
            gameData.money, 
            gameData.logsPlus,
            gameData.stonePlus,
            gameData.ironPlus,
            gameData.autoLogPlus,
            gameData.autoStonePlus,
            gameData.autoIronPlus,
            gameData.autoMinePrice,
            gameData.autoChopperPrice,
            gameData.autoMineStone,
            gameData.pickaxePrice,
            gameData.axePrice
        ];    
        if (localStorage){
            localStorage.setItem("saveState", JSON.stringify(savedData));
            console.log("Save Data", savedData);
            alert("Game Saved Successfully!");
        }
    })
    
    $("#loadBtn").click(function(){
        gameData = savedData.map(loadGameData);
        console.log("Game Data", gameData);
        alert("Loaded Game Data");
    })

    function loadGameData(value){
        return parseFloat(value);
    }

    // Test for localStorage
    // #region

    if (localStorage){
        gameData = localStorage.getItem("saveState");
        console.log("Game Data", gameData);
        if (gameData) {
            gameData = JSON.parse(gameData);
        }
    }else{
        console.log("No local storage");
    }

    // #endregion

    // #endregion

    // Game Interval
    // #region
    setInterval(function(){
        gameData.logs += gameData.autoLogPlus;
        gameData.stone += gameData.autoStonePlus;
        changeInventory();
        changeMarket();
        changeForge();
        if (localStorage) {
            localStorage.setItem("saveData", JSON.stringify(savedData));
            console.log("Save Data", savedData)
        }
    }, baseGameTime);
    // #endregion
});