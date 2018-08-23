var currentEntry = '0';     // Stores the currently displayed value
var previousEntry = '0';    // Stores the previous value, prior to calculating
var log = "";               // Stores all operations done
var inOperation = false;    // Helper value to check if operation key was pressed

/// <summary> Adds pressed key to currentEntry, and handles edge cases with zeros and decimals. </summary>
$(".number-button").click(function() {
  var num = $(this).html();

  inOperation = false;
  if (currentEntry === '0' && num !== ".") {
    currentEntry = num;
  } else if (num === "." && currentEntry.includes(".")) {
    return;
  } else {
    currentEntry += num;
  }    
  updateDisplay(currentEntry);
});

/// <summary> Adds current entry and pressed operation key to log for later calculation. </summary>
function operation(op) {
  if (inOperation) {
    if (previousEntry == '0') {
      return;
    } else {
      currentEntry = previousEntry;
      previousEntry = '0';
    }
  }

  inOperation = true;
  log += currentEntry + op;
  updateDisplay(op);
  currentEntry = '0';
}

/// <summary> Calculates entries stored in log. </summary>
function equals () {
  if (inOperation) {
    return;
  }
  inOperation = true;
  log += currentEntry;
  var total = eval(log);
  total = Number(Math.round(total+'e'+3)+'e-'+3);
  updateDisplay(total);
  currentEntry = '0';
  previousEntry = total;
  log = "";
}

/// <summary> Clear currentEntry </summary>
function clearEntry() {
  inOperation = false;
  currentEntry = '0';
  updateDisplay(currentEntry);
}

/// <summary> Clear everything </summary>
function clearAll() {
  inOperation = false;
  currentEntry = '0';
  previousEntry = '0';
  log = "";
  updateDisplay(currentEntry);
}

/// <summary> Helper function that updates display. </summary>
function updateDisplay(output) {
  document.getElementById('output').innerHTML = output;
  document.getElementById('log').innerHTML = log;

  if (output.length > 10) {
    throwError("Output digit limit met");
  }

  if (log.length > 30) {
    throwError("Log digit limit met");
  }
}

/// <summary> Helper function that updates display with error message. </summary>
function throwError (message) {
  log = message;
  updateDisplay("error");
  inOperation = false;
  currentEntry = '0';
  previousEntry = '0';
  log = '';
}

/// <summary> Easter egg function: Fades screen if solar panels are covered. </summary>
$(".solar").mouseenter(function(){
  $("#output, #log").addClass("covered");
});

/// <summary> Easter egg function: Restores screen once solar panels are uncovered. </summary>
$(".solar").mouseleave(function() {
  $("#output, #log").removeClass("covered");
});

var pressingOnScreen = false; // Helper function used to see if button is being pressed

/// <summary> Easter egg function: Kicks off screen pressed event. </summary>
function ScreenPressed(event) {
  pressingOnScreen = true;
  var xPos = event.pageX - $(".screen-border").offset().left;
  var yPos = event.pageY - $(".screen-border").offset().top;
  var random = Math.random() * 15;
  var command = "radial-gradient(70px at " + xPos + "px "+yPos+"px, #262220 "+random+"%, #3b423f "+ (20 + random) +"%, #3d372c "+ (40 + random) +"%, #514844 "+ (60 + random) +"%, #605c53 80%)";
  $(".screen-border").css({"background": command,"cursor":"pointer"});
}

/// <summary> Easter egg function: Updates display if screen is being pressed. </summary>
$(".screen-border").mousemove(function(event) {
  if (pressingOnScreen) {
    ScreenPressed(event);
  }
}).mousedown(ScreenPressed);

/// <summary> Easter egg function: clears screen pressed event if mouse is release or out of bounds. </summary>
function ReleaseScreen() {
  pressingOnScreen = false;
  $(".screen-border").css({"background":"#605c53","cursor":"default"}); 
}

$(".screen-border").mouseleave(ReleaseScreen).mouseup(ReleaseScreen);