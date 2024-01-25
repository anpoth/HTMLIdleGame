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

    // Prices
    var autoMinePrice = 200;
    var autoChopperPrice = 100;
    var autoMineStone = 100;
    var pickaxePrice = 50;
    var axePrice = 25;
    var logPrice = 1;
    var stonePrice = 2;
    var ironPrice = 5;
    var priceScalar = 1.5;

    var baseGameTime = 1000;

    // Game elements
    var autoMinerButton = document.getElementById("autoMine");
    var autoChopperButton = document.getElementById("autoChopper");
    var axeButton = document.getElementById("buyAxe");
    var pickaxeButton = document.getElementById("buyPickaxe");

    let savedData = [];
    let loadData = [];
    

    // #endregion

    // Action buttons
    // #region
    $("#chop").click(function(){
        if (axes >= 2) {
            logs += axes;
            changeInventory();
            changeMarket();
        }else{
            logs += logsPlus;
            changeInventory();
            changeMarket();
        }
    })

    $("#mineStone").click(function(){
        if (pickaxes > 1) {
            stone += pickaxes;
            changeInventory();
        }else{
            stone += stonePlus;
            changeInventory();
        }
    })

    $("#mineIron").click(function(){
        if (pickaxes >= 3) {
            iron += pickaxes / 3;
            changeInventory();
        }else{
            iron += ironPlus;
            changeInventory();
        }
    })

    // #endregion

    // Sell Buttons
    // #region
    $("#sell1").click(function(){
        logs--;
        money += logPrice;
        changeInventory();
        changeMarket();
    })

    $("#sell10").click(function(){
        logs-=10;
        money += logPrice*10;
        changeInventory();
        changeMarket();
    })

    $("#sellAll").click(function(){
        money += logPrice*logs;
        logs = 0;
        changeInventory();
        changeMarket();
    })

    $("#sell1Stone").click(function(){
        stone--;
        money += stonePrice;
        changeInventory();
        changeMarket();
    })

    $("#sell10Stone").click(function(){
        stone-=10;
        money += stonePrice*10;
        changeInventory();
        changeMarket();
    })

    $("#sellAllStone").click(function(){
        money += stonePrice*stone;
        stone = 0;
        changeInventory();
        changeMarket();
    })

    $("#sell1Iron").click(function(){
        iron--;
        money += ironPrice;
        changeInventory();
        changeMarket();
    })

    $("#sell10Iron").click(function(){
        iron-=10;
        money += ironPrice*10;
        changeInventory();
        changeMarket();
    })

    $("#sellAllIron").click(function(){
        money += ironPrice*iron;
        iron = 0;
        changeInventory();
        changeMarket();
    })

    // #endregion

    // Upgrade buttons
    // #region
    $("#autoChopper").click(function(){
        money -= autoChopperPrice;
        autoLogPlus++;
        autoChopperPrice *= priceScalar;
        $("#autoChopper").html("Buy 1 Auto Chopper [$" + autoChopperPrice.toFixed(2) + "]");
        changeInventory();
        changeMarket();
        changeForge();
    })

    $("#autoMine").click(function(){
        money -= autoMinePrice;
        stone -= autoMineStone;
        autoStonePlus++;
        autoMinePrice *= priceScalar;
        autoMineStone *= priceScalar;
        $("#autoMine").html("Buy 1 Auto Miner [$" + autoMinePrice.toFixed(2) + "] [" + autoMineStone.toFixed(2) + "] stone");
        changeInventory();
        changeMarket();
        changeForge();
    })

    // #endregion

    // Item Buttons
    // #region
    $("#buyPickaxe").click(function(){
        money -= pickaxePrice;
        pickaxes++;
        pickaxePrice *= priceScalar;
        $("#buyPickaxe").html("Buy 1 Pickaxe [$" + pickaxePrice.toFixed(2) + "]");
        changeInventory();
        changeMarket();
    })

    $("#buyAxe").click(function(){
        money -= axePrice;
        axes++;
        axePrice *= 2;
        $("#buyAxe").html("Buy 1 Axe [$" + axePrice.toFixed(2) + "]");
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
        $("#money").html("<img id='coin' src='graphics\\coin.png'> $" + money.toFixed(2));
        
        if(axes > 1){
            $("#axes").html(axes.toFixed(0));
        }else{
            $("#axes").html("1");
        }

        if(autoLogPlus >= 1){
            $("#choppers").html("<img src='graphics\\chopper.png' alt='chopper image'> " + autoLogPlus);
            $("#choppers").css("visibility", "visible");
            $("#chopperLbl").css("visibility", "visible");
        }else{
            $("#choppers").css("visibility", "hidden");
            $("#chopperLbl").css("visibility", "hidden");
        }

        if(logs > 0){
            $("#logs").html(logs.toFixed(0));
        }else{
            $("#logs").html(logs.toFixed(0));
        }

        if(pickaxes > 0){
            $("#pickaxes").html(pickaxes.toFixed(0));
            $("#mineStone").css("visibility", "visible");
            $("#pickaxePic").css("visibility", "visible");
        }else{
            $("#pickaxes").html("");
            $("#mineStone").css("visibility", "hidden");
        }

        if(pickaxes >= 3){
            $("#mineIron").css("visibility", "visible");
        }else{
            $("#mineIron").css("visibility", "hidden");
        }

        if(autoStonePlus >= 1){
            $("#miners").html("<img src='graphics\\miner.png' alt='miner image'> " + autoStonePlus);
            $("#miner").css("visibility", "visible");
            $("#minerLbl").css("visibility", "visible");
        }else{
            $("#miner").css("visibility", "hidden");
            $("#minerLbl").css("visibility", "hidden");
        }

        if(stone > 0){
            $("#stone").html(stone.toFixed(0));
            $("#stonePic").css("visibility", "visible");
        }else{
            $("#stone").html("");
        }

        if(iron > 0){
            $("#iron").html(iron.toFixed(0));
            $("#ironPic").css("visibility", "visible");
        }else{
            $("#iron").html("");
        }

        if(iron >= 100){
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

        if(money >= autoChopperPrice){
            autoChopperButton.disabled = false;
        }else{
            autoChopperButton.disabled = true;
        }

        if(money >= pickaxePrice){
            pickaxeButton.disabled = false;
        }else{
            pickaxeButton.disabled = true;
        }

        if(money >= axePrice){
            axeButton.disabled = false;
        }else{
            axeButton.disabled = true;
        }

        if(pickaxes < 1){
            $("#autoMine").css("display", "none")
        }else{
            $("#autoMine").css("display", "block")
        }
        if(money >= autoMinePrice && stone >= autoMineStone){
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
            logs, 
            stone, 
            iron, 
            pickaxes,
            axes,
            money,   
            logsPlus, 
            stonePlus, 
            ironPlus,
            autoLogPlus, 
            autoStonePlus,
            autoIronPlus
        ];    
        if (localStorage){
            localStorage.setItem("saveState", JSON.stringify(savedData));
            console.log(savedData);
            alert("Game Saved Successfully!");
        }
    })
    
    $("#loadBtn").click(function(){
        loadData = savedData.map(loadGameData);
        console.log(loadData);
        alert("Loaded Game Data");
    })

    function loadGameData(value){
        return value;
    }

    // Test for localStorage
    // #region

    if (localStorage){
        gameData = localStorage.getItem("saveState");
        console.log(gameData);
        if (gameData) {
            loadData = JSON.parse(gameData);
        }
    }else{
        console.log("No local storage");
    }

    // #endregion

    // #endregion

    // Game Interval
    // #region
    setInterval(function(){
        logs += autoLogPlus;
        stone += autoStonePlus;
        changeInventory();
        changeMarket();
        changeForge();
        if (localStorage) {
            localStorage.setItem("saveData", JSON.stringify(savedData));
            console.log(savedData)
        }
    }, baseGameTime);
    // #endregion
});