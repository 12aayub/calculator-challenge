$(document).ready(function() {
// Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDycl7QDN7yFuOTYuFcaoJSvB1lEAgiKnw",
    authDomain: "calculator-challenge-240ba.firebaseapp.com",
    databaseURL: "https://calculator-challenge-240ba.firebaseio.com",
    projectId: "calculator-challenge-240ba",
    storageBucket: "calculator-challenge-240ba.appspot.com",
    messagingSenderId: "1051426126380",
    appId: "1:1051426126380:web:e07a8d370613b83b"
  };
  //Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  var dataRef = firebase.database();

  //Initial variables
  var firstNumber = 0;
  var secondNumber = 0;
  var operator = "";
  var result = 0;
  var isOperatorChosen = false;
  var isCalculated = false;

  //Reset calculator function
  function initializeCalculator() {
    firstNumber = "";
    secondNumber = "";
    operator = "";
    isOperatorChosen = false;
    isCalculated = false;

    $("#first-number, #second-number, #operator, #result").empty();
  }

  //Display and change to number when clicked
  $(".number").on("click", function() {
    if (isCalculated) {
      initializeCalculator();
    }

    if (isOperatorChosen) {
      secondNumber += $(this).val();
      $("#second-number").text(secondNumber);
    } else {
      firstNumber += $(this).val();
      $("#first-number").text(firstNumber);
    }
  });

  //Display recent calculations, limits to 10 results on Firebase and HTML
  function displayRecentCalcs() {
    $("#recent-calculations").empty(); 

    //Watcher function
    dataRef.ref().orderByChild("dateAdded").limitToLast(10).on("child_added", function(snapshot) { 
      if($("#recent-calculations").children().length < 10) {
        $("#recent-calculations").prepend(
          "<p>" + snapshot.val().firstNumber + " " + snapshot.val().operator + " " + snapshot.val().secondNumber + " = " + snapshot.val().result + "</p>"
          )
      }
      else 
      $("#recent-calculations").children().last().remove();
        $("#recent-calculations").prepend(
          "<p>" + snapshot.val().firstNumber + " " + snapshot.val().operator + " " + snapshot.val().secondNumber + " = " + snapshot.val().result + "</p>"
          );
    });
  }
  displayRecentCalcs();

  //Display and change to operator when clicked
  $(".operator").on("click", function() {
    if (!firstNumber || isCalculated) {
      return false;
    }

    isOperatorChosen = true;

    operator = $(this).val();

    $("#operator").text($(this).text());
  });


  //Calculation, display, and pushing result into Firebase
  $(".equal").on("click", function() {
    if (isCalculated) {
      return false;
    }

    isCalculated = true;

    firstNumber = parseInt(firstNumber);
    secondNumber = parseInt(secondNumber);

    if (operator === "plus") {
      result = firstNumber + secondNumber;
      operator = "+";
    } else if (operator === "minus") {
      result = firstNumber - secondNumber;
      operator = "-"
    } else if (operator === "times") {
      result = firstNumber * secondNumber;
      operator = "×";
    } else if (operator === "divide") {
      result = firstNumber / secondNumber;
      operator = "÷";
    } else if (operator === "power") {
      result = Math.pow(firstNumber, secondNumber);
      operator = "^";
    }

    if(result !== Infinity) {
        dataRef.ref().push({
          firstNumber: firstNumber,
          operator: operator,
          secondNumber: secondNumber,
          result: result,
        });
      $("#result").text(result);
    }
    else {
      $("#result").text("Can't divide by 0!")
    };

    isCalculated = true;
  });
     


  //Resets state after Clear clicked
  $(".clear").on("click", function() {
    initializeCalculator();
  });

  //Initial state (reset)
  initializeCalculator();
});