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
  // Initialize Firebase
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




  function clearRecentCalcs() {
    $("#recent-calculations").empty(); 
    //Firebase watcher
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
  clearRecentCalcs();

  $(".operator").on("click", function() {
    //Check if firstNumber has already been selected or if ran calculation already
    if (!firstNumber || isCalculated) {
      return false;
    }

    isOperatorChosen = true;

    //Store operator
    operator = $(this).val();

    //Set HTML text of #operator to the text of what was clicked
    $("#operator").text($(this).text());
  });
  $(".equal").on("click", function() {
    if (isCalculated) {
      return false;
    }

    //Can't write more numbers on Result after calculations
    isCalculated = true;

    firstNumber = parseInt(firstNumber);
    secondNumber = parseInt(secondNumber);

    //Based on the operator that was chosen.
    //Then run the operation and set the HTML text of the result
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

    // clearRecentCalcs();
    isCalculated = true;
  });
     


  
  $(".clear").on("click", function() {
    initializeCalculator();
  });

  //Initial state (reset)
  initializeCalculator();