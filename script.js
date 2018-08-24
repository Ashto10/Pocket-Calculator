'use strict';

var currentEntry = '0';     /** Stores the currently displayed value */
var previousEntry = '0';    /** Stores the previous value, prior to calculating */
var log = "";               /** Stores all operations done */
var inOperation = false;    /** Helper value to check if operation key was pressed */

/**
* Adds pressed key to currentEntry, and handles edge cases with zeros and decimals.
* 
* @param {jQuery} el - Element that's calling the function.
*/
function enterDigit(el) {
  inOperation = false;
  var num = el.html()[0];

  if (currentEntry === '0' && num !== ".") {
    currentEntry = num;
  } else if (num === "." && currentEntry.includes(".")) {
    return;
  } else {
    currentEntry += num;
  }    
  updateDisplay(currentEntry);
}

/**
* Adds current entry and pressed operation key to log for later calculation.
* 
* @param {jQuery} el - Element that's calling the function.
*/
function operation(el) {
  var op = "";

  switch(el.attr('id')) {
    case 'add':
      op = "+";
      break;
    case 'subtract':
      op = "-";
      break;
    case 'multiply':
      op = "*";
      break;
    case 'divide':
      op = "/";
      break;
    case 'equals':
      return equals();
    default:
      return;
                      }

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

/**
* Calculates entries stored in log.
*/
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

/**
* Clears display and entered values, depending on which button is pressed.
* 
* @param {jQuery} el - Element that's calling the function.
*/
function clear(el) {
  inOperation = false;
  currentEntry = '0';

  if(el.attr('id') === "clearAll") {
    previousEntry = '0';
    log = "";
  }
  updateDisplay(currentEntry);
}

/**
* Helper function that updates display.
*/
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

/**
* Helper function used for displaying and handling errors.
*/
function throwError (message) {
  log = message;
  updateDisplay("error");
  inOperation = false;
  currentEntry = '0';
  previousEntry = '0';
  log = '';
}

/**
* Easter egg: Fades display if mouse is covering solar panels.
*/
$(".solar").mouseenter(function(){
  $("#output, #log").addClass("covered");
});

/**
* Easter egg: Restores display once mouse is no longer covering solar panels.
*/
$(".solar").mouseleave(function() {
  $("#output, #log").removeClass("covered");
});

var pressingOnScreen = false; // Helper function used to see if button is being pressed

/**
* Easter egg: Starts "screen pressed" animation when display is clicked.
*/
function ScreenPressed(event) {
  pressingOnScreen = true;
  var xPos = event.pageX - $(".screen").offset().left;
  var yPos = event.pageY - $(".screen").offset().top;
  var random = Math.random() * 15;
  var command = "radial-gradient(farthest-corner at " + xPos + "px "+yPos+"px, #262220 "+random+"%, #3b423f "+ (20 + random) +"%, #3d372c "+ (40 + random) +"%, #514844 "+ (60 + random) +"%, #605c53 80%)";
  $(".screen").css({"background": command});
}

/**
* Easter egg: Restores screen to normal when user stops clicking display and "screen pressed" animation finishes.
*/
function ReleaseScreen() {
  pressingOnScreen = false;
  $(".screen").css({"background":"#605c53","cursor":"default"}); 
}


$(function() {
  $(".screen").mousemove(function(event) {
    // Continue firing event in order to update mouse position
    if (pressingOnScreen) {
      ScreenPressed(event);
    }})
    .mousedown(ScreenPressed)
    .mouseleave(ReleaseScreen)
    .mouseup(ReleaseScreen);

  $(".key-num").click(function() {
    enterDigit($(this));
  });

  $(".key-op").click(function() {
    operation($(this));
  });

  $(".key-red").click(function() {
    clear($(this));
  });
}());