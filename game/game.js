// Kevin Pickett
// Global variables
// Canvas area for text
var textCanvas;
// Drawing environment for text canvas
var textContext;

// Canvas area for rocket
var gameCanvas;
// Drawing environment for rocket
var gameContext;

// Adjust as needed
var fontSize = 20;
// Y-Position where to draw rocket message (if needed) in text canvas
var rocketMessagePosition = fontSize;
// Y-coordinates of Rocket height message
var heightTextPosition = rocketMessagePosition + fontSize + 10;
// Y-coordinates of Rocket velocity message
var velocityTextPosition = heightTextPosition + fontSize + 10;
// Y-coordinates of Rocket fuel message
var fuelTextPosition = velocityTextPosition + fontSize + 10;
// X-coordinate of the messages
var messageX = 0;

// Time interval in milliseconds for animation, set as desired
var deltaTimeInterval = 100;

// Is the engine burning?
var burning = false;

// Initialize Rocket Size
var rocketSize = 5;

// Game class
var game;
// Has the game been initialized?
var initialized = false;
// Used to change height var on canvas.
var speed = 0;
// Used for decided to burn or not burn
var down = true;
// Starting height
var alt = 100;
// If you have landed
var end = false;
// count of fuel in rocket
var fuel = 100;


// You add this function, and change this context, it is passed
// the height of the rocket.
function drawLander(height) {
  // The y-coordinate goes from 0 to canvas.height, so need to reverse for
  // the rocket appearing to go down.
  var ycoord = gameCanvas.height - height;
  var rocketSize = 5;
  // Rocket is a square, draw it. You should draw a nice rocket.
  gameContext.fillRect(gameCanvas.width/2, height-rocketSize, rocketSize, rocketSize);
}

// Draw where to land
function drawSurface(planet, ctx) {
  ctx.rect(0,300,300, planet.ground);
  ctx.stroke();
  ctx.fillStyle= planet.pColor;
  ctx.fillRect(0,300, 300, planet.ground);
}

// Display a message
function message(text, ycoord) {
  textContext.clearRect(messageX, ycoord - fontSize, textCanvas.width, fontSize + 10);
  textContext.strokeText(text, 0, ycoord);
}

// The Planet class models a Planet, which has a gravity and
// a ground height.
function Planet(gravity, ground) {
    this.gravity = gravity;
    this.ground = ground;
    this.pColor = 'blue';
    this.getGravity = (function() { return this.gravity; });
    this.getGround = (function() { return this.ground; });
}

// The Rocket class models a Rocket, which has a current height
// above a planet, amount of fuel left, current velocity, and
// engine strength
function Rocket(velocity, height, fuel, engine, planet) {
  this.height = height;
  this.nextHeight = function(deltaTime) { }
  this.nextVelocity = function(burnRate, deltaTime) { }
  this.reportHeight = function() { }
  this.reportVelocity = function() { }
  this.reportFuel = function() { }
  this.toString = function() {
    return "HEIGHT " + this.height + " Velocity " + this.velocity
               + " FUEL " + this.amountFuel;
  }
  // from your code
  this.drawRocket = function(sCtx) {
    var rock = sCtx.fillRect(128, alt, 10, 10);
  }
  // from your code
  this.reachedSurface = function() { }
  this.landed = function(safeVelocity) { }
  // From your code
  this.move = function(burnRate, deltaTime) {
    var br = burnRate;
    if (this .amountFuel < (br * deltaTime)) {
      br = this.amountFuel / deltaTime;
      this.amountFuel = 0.0;
      }
    else {
      this.amountFuel = this.amountFuel - br * deltaTime;
    }
   this.nextHeight(deltaTime);
   this.nextVelocity(br, deltaTime);
  }

}

// The Game class models a Game, the safeVelocity is the
// velocity within which the rocket can land.  The crashVelocity
// is the Velocity in which the rocket is blasted to smithereens.
function Game(rocket, safeVelocity, crashVelocity) {
  this.rocket = rocket;
  this.deltaTime = deltaTimeInterval / 1000;

  // Rocket explodes if reached surface going faster than this
  this.tooFast = crashVelocity;

// Message if lander crashes
  this.crashedMessage = "Crashed and Burned Sucker!\n";
  this.explodedMessage = "Blasted to Smithereens!\n";
  this.landedMessage = "Landed Safely! One small step for man, one giant leap for mankind\n";

// Safe landing velocity must be between 0 and this number
  this.safeVelocity = safeVelocity;

  this.strategy = function() { }

// Receives a canvas and has all of the game logic.
// Went with a method to repaint the canvas each time with the object.
// I delete it and repaint it with its new location each time
  this.play = function(gCtx) {
    // Decide which way to fall
      if(down) {
        noburn();
      } else {
        burn();
      }
      // Repaint
      gCtx.clearRect(128, 0, 10, 299);
      alt = alt + speed;
      gCtx.fillRect(128, alt, 10, 10);
      // You have landed
      if(alt > 290) {
        finalSpeed = speed.toFixed(2);
        speed = 0;
        end = true;
        gCtx.fillRect(128, 290, 10, 10);
        // Give message based on result
        if(finalSpeed < 1.5) {
          alert("You have won! Your landing speed was: " + finalSpeed);
        } else {
          alert("You have lost, you crashed because your landing speed was: " + finalSpeed);
        }
        window.location = "../scores.html";
      }
      alti = alt
      document.getElementById("speedLabel").innerHTML = "Speed: " + speed.toFixed(2) + " --- Fuel: " + fuel;
    }
  }

// Functions to turn the engines on/off
function burn() {
  if(fuel > 0) {
    speed = speed - .3;
    fuel = fuel - 2;
  }
}
// Change the speed to make falling faster
function noburn() {
  speed = speed + .2;
}

// Change the speed to fall slower
function burnOn() {
  down = false;
}

// Set the boolean to change which burn function is called
function burnOff() {
  down = true;
}

function restart() {
  location.reload();
}

// Main function to start the game
function gameStart() {
  if (!initialized) {
    gameCanvas = document.getElementById('gameCanvas');
    gameContext = gameCanvas.getContext("2d");
    //gameContext.clearRect(0,0,textCanvas.width, textCanvas.height);

    // Create a few objects
    var pluto = new Planet(0.5, 200.0);
    var myRocket = new Rocket(0.0, alt, 100.0, 1.0, pluto);
    myRocket.drawRocket(gameContext);
    drawSurface(pluto, gameContext);
    game = new Game(myRocket, -4.0, -10.0);
    initialized = true;
  }

  // Start the game
  if(!end) {
    game.play(gameContext);
  }
  return false;
}

// Animate
setInterval(gameStart, deltaTimeInterval);
