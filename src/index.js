import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render( < App / > , document.getElementById('root')); {
    /*
   // If you want your app to work offline and load faster, you can change
   // unregister() to register() below. Note this comes with some pitfalls.
   // Learn more about service workers: https://bit.ly/CRA-PWA
   serviceWorker.unregister();
 
   // Modify this code below to enable javascript to communitcate with the smart contract:
 
   // JavaScriptCode from to modify from DareCoin start here */
    function genSalt() {
        var array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        return array[0].toString(16);
    }

    /* global $ */
    var url = "https://api.coinmarketcap.com/v1/ticker/ethereum/";
    var makerDAOReaderABI = "https://raw.githubusercontent.com/makerdao/feeds/master/src/abi/readable.json";
    //var makerDAOAddress = "0x729D19f657BD0614b4985Cf1D82531c67569197B"; // on ethereum mainnet
    var makerDAOAddress = "0xE39451e34f8FB108a8F6d4cA6C68dd38f37d26E3"; // on rinkeby
    var dareCoinABI = "https://raw.githubusercontent.com/Barrytech/prescript-playground/master/build/contracts/Darecoin.json";

    var globalValue;
    var salt = genSalt();
    var oldPrice;
    var oldTime;

    function getTimeFromSeconds(timeInSecs) {
        // API returns in seconds, but Date needs milliseconds
        // so we multiply by 1000 to get todays date as a string
        return new Date(timeInSecs * 1000).toDateString();
    }

    //// below I am writing empty Javascript function to modify and tailer into our need.

    // update number of voters as admin add them
    function UpdateVoters() {

    }

    // Update vote counts as participants vote
    function UpdateVotes() {

    }

    // Update winner as more votes comes in and calculated in real time
    function UpdateWinner() {

    }

    // jquery function managing user interaction
    function OnceVoterClick() {

    }

    // Record the state of the election
    function ElectionState() {
        // states are Commit and Reveal
    }

    // Commit Vote to smart contract
    function CommitToArbiter() {

    }

    function updatePrice() {
        $.ajax(url).done(function(res) {

            // inside the function ^
            var price = res[0].price_usd;
            var change = res[0].percent_change_1h;
            var daychange = res[0].percent_change_24h;
            var weekchange = res[0].percent_change_7d;

            var dateAsString = getTimeFromSeconds(res[0].last_updated);

            $("#price").html("<strong>" + "$ " + price + "</strong>");
            $("#change").html("<strong>" + change + " %" + "</strong>");
            $("#day").html("<strong>" + daychange + " %" + "</strong>");
            $("#week").html("<strong>" + weekchange + " %" + "</strong>");
            $("#moment").html("<strong>" + dateAsString + "</strong>");

        });

        // update every 5s
        setTimeout(updatePrice, 5000);



        function updateBalance() {
            if (web3.eth.accounts.length < 1) {
                console.log("You don't have an account yet");
                // TODO: update the DOM to tell the user that they need an account
                $('#bal').html("You don't have an account yet!");
            } else {
                var myAccount = web3.eth.accounts[0];
                web3.eth.getBalance(myAccount, function(err, balance) {
                    $('#bal').html('Balance: ' + web3.fromWei(balance, 'ether') + " ETH");
                });
            }
            // update every 5s
            setTimeout(updateBalance, 5000);
        }

        function updateMakerDAOPrice() {
            if (web3.eth.accounts.length < 1) {
                console.log("You don't have an account yet");
            } else {
                var myAccount = web3.eth.accounts[0];
                $.ajax(makerDAOReaderABI, { dataType: 'json' }).done(function(abi) {
                    var makerDAO = web3.eth.contract(abi).at(makerDAOAddress); // create functions from the ABI
                    makerDAO.read.call({ from: myAccount }, function(error, ethResult) { // 'peek' is now a function!
                        var price = web3.fromWei(web3.toDecimal(ethResult), 'ether');

                        // TODO: insert this to the DOM
                        if (oldPrice != price) {
                            var theNow = new Date(window.Date.now());
                            console.log("New price!: " + price + " at " + theNow.toGMTString());
                        }
                        oldPrice = price;
                        $("#mkprice").html(" <strong>" + "$" + price + "</strong>");
                    });
                });
                // update very 10s
                setTimeout(updateMakerDAOPrice, 10000);




                function updateGameState() {
                    if (web3.eth.accounts.length < 1) {
                        console.log("You don't have an account yet");
                    } else {
                        var myAccount = web3.eth.accounts[0];
                        $.ajax(dareCoinABI, { dataType: 'json' }).done(function(abi) {

                            var dareCoinAddress = abi.networks["4"].address;
                            var dareCoin = web3.eth.contract(abi.abi).at(dareCoinAddress); // create functions from the ABI
                            dareCoin.getGameState.call({ from: myAccount }, function(error, gameState) { // 'peek' is now a function!

                                // COMMIT_STATE = 0, REVEAL_STATE = 1, PAYOUT_STATE = 2
                                console.log("The gameState is: " + gameState);

                                if (gameState == 0) {
                                    $("#voted").css("background-color", "#9E2424");

                                    $("#voted").attr("disabled", true);
                                } else if (gameState == 1) {
                                    $("#statecommit").css("background-color", "#E3E1E3");
                                    $("#statereveal").css("background-color", "#9E2424");
                                    $("#statepayouts").css("background-color", "white");
                                    $("#voted").attr("disabled", true);
                                    $("#payout").attr("disabled", true);
                                } else if (gameState == 2) {
                                    $("#statecommit").css("background-color", "#E3E1E3");
                                    $("#statereveal").css("background-color", "#E3E1E3");
                                    $("#statepayouts").css("background-color", "#9E2424");
                                    $(".bet").attr("disabled", true);
                                    $("#reveal").attr("disabled", true);
                                    $("#payout").attr("disabled", false);
                                }

                            });
                            //this function read who is the winner from the smart contract ---To modify
                            dareCoin.getNumberOfWinners.call({ from: myAccount }, function(error, numWinners) {
                                for (var i = 0; i < numWinners; i++) {
                                    dareCoin.getLastWinners.call(i, { from: myAccount }, function(error, lastWinner) { // 'peek' is now a function!
                                        // COMMIT_STATE = 0, REVEAL_STATE = 1, PAYOUT_STATE = 2
                                        console.log("Winner " + i + " is: " + lastWinner);
                                    });
                                }
                            });

                            // update very 10s
                            setTimeout(updateGameState, 10000);


                            function commitToDareCoin(value) {

                                globalValue = value;

                                // calculate a bytes32 to pass into `commit()`
                                var hashCommit = new String(web3.sha3("" + value + salt));

                                console.log("value: " + value);
                                console.log("salt: " + salt);
                                console.log("hashCommit: " + hashCommit);

                                //send to smartcontract for verification
                                if (web3.eth.accounts.length < 1) {
                                    console.log("You don't have an account yet");
                                } else {
                                    var myAccount = web3.eth.accounts[0];
                                    $.ajax(dareCoinABI, { dataType: 'json' }).done(function(abi) {
                                        var dareCoinAddress = abi.networks["4"].address;
                                        var dareCoin = web3.eth.contract(abi.abi).at(dareCoinAddress); // create functions from the ABI
                                        dareCoin.commit.sendTransaction(hashCommit.valueOf(), { from: myAccount, value: 10000000000000000, gas: 555555 }, function(error, ethResult) {
                                            // handle the result of the transaction here
                                            console.log("txHash: " + ethResult);
                                            // disable the commit button
                                            $(".bet").attr("disabled", true);
                                            // TODO: consider waiting for transaction result to come back here,
                                            // before enabling the reveal button
                                            $("#reveal").attr("disabled", false);

                                        });
                                    });
                                }
                            }

                            function payout() {

                                //send to smartcontract for verification
                                if (web3.eth.accounts.length < 1) {
                                    console.log("You don't have an account yet");
                                } else {
                                    var myAccount = web3.eth.accounts[0];
                                    $.ajax(dareCoinABI, { dataType: 'json' }).done(function(abi) {
                                        var dareCoinAddress = abi.networks["4"].address;
                                        console.log("The address is: " + dareCoinAddress);
                                        var dareCoin = web3.eth.contract(abi.abi).at(dareCoinAddress); // create functions from the ABI
                                        dareCoin.payout.sendTransaction({ from: myAccount, value: 0, gas: 555555 }, function(error, ethResult) {
                                            //handle the result of the transaction here
                                            // manipulate the DOM here accordingly
                                            console.log("we pressed payout");
                                        });
                                    });
                                }
                            }

                            function resetGame() {

                                //send to smartcontract for verification
                                if (web3.eth.accounts.length < 1) {
                                    console.log("You don't have an account yet");
                                } else {
                                    var myAccount = web3.eth.accounts[0];
                                    $.ajax(dareCoinABI, { dataType: 'json' }).done(function(abi) {
                                        var dareCoinAddress = abi.networks["4"].address;
                                        console.log("The address is: " + dareCoinAddress);
                                        var dareCoin = web3.eth.contract(abi.abi).at(dareCoinAddress); // create functions from the ABI
                                        // dareCoin.owner.call(0, {from: myAccount}, function(error, owner){
                                        //   if owner == web3.eth.accounts[0];
                                        // }
                                        dareCoin.resetGame.sendTransaction({ from: myAccount, value: 0, gas: 555555 }, function(error, ethResult) {
                                            //handle the result of the transaction here

                                            console.log("we pressed reset");

                                        });
                                    });
                                }
                            }

                            function revealToDareCoin(value) {

                                var theValue = "" + value;
                                var theSalt = salt;

                                //send to smartcontract for verification
                                if (web3.eth.accounts.length < 1) {
                                    console.log("You don't have an account yet");
                                } else {
                                    var myAccount = web3.eth.accounts[0];
                                    $.ajax(dareCoinABI, { dataType: 'json' }).done(function(abi) {
                                        var dareCoinAddress = abi.networks["4"].address;
                                        console.log("The address is: " + dareCoinAddress);
                                        var dareCoin = web3.eth.contract(abi.abi).at(dareCoinAddress); // create functions from the ABI

                                        console.log("TODO: implement revealToDareCoin..");
                                        console.log("theValue: " + theValue);
                                        console.log("theSalt: " + theSalt);

                                        dareCoin.reveal.sendTransaction(theValue, theSalt, { from: myAccount, value: 0, gas: 555555 }, function(error, ethResult) {
                                            //handle the result of the transaction here
                                            console.log(error, ethResult);
                                            console.log("we pressed reveal");
                                            $("#played").html(" <h2>Thank you for your bet. <br> We have received you reveal <br> and are processing it</h2>");
                                            // manipulate the DOM here accordingly
                                        })
                                    })
                                }
                            }

                            // { /* //Function connected to smart contract\ */ }

                            function OnceClicked() {
                                $("#reveal").attr("disabled", true);

                                $("#betUp").on('click', function() {
                                    commitToDareCoin(1);
                                })

                                $("#betNoChange").on('click', function() {
                                    commitToDareCoin(2);
                                })

                                $("#betDown").on('click', function() {
                                    commitToDareCoin(0);
                                })

                                $("#reveal").on('click', function() {
                                    revealToDareCoin(globalValue);
                                })
                                $("#reset").on('click', function() {
                                    resetGame();
                                })

                                $("#payout").on('click', function() {
                                    payout();
                                })

                            };

                            // { /* // this gets calloed when the webpage has loaded */ }

                            $('document').ready(function() {
                                UpdateVoters();
                                UpdateVotes();
                                UpdateWinner();
                                CommitToArbiter();
                                ElectionState();
                                OnceClicked();
                            });


                        });