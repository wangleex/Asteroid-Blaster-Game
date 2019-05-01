////  Page-scoped globals  ////

var asteroidTimeout;
var nukeInterval;

// Game State
var running = false;
var hasExploded = false;

var nukeReady = true;

var shipType = {
  'vanilla': true,
  'spiky': false,
  'alien': false
};

// Counters
var numberAsteroidsDestroyed = 0;
var spawnRate = {
    'middle': 1000,
    'min': 500,
    'max': 1500,
};
var numberLives = 2;

// Sounds
var sounds = {
  'rocketLaunching': {},
  'rocketAsteroidExplosion': {},
  'shipExplosion': {},
  'intro': new Audio('./audio/intro.mp3'),
  'gameOver': new Audio('./audio/gameOver.wav'),
  'nuke': new Audio('./audio/nuke.wav')
};

var MOVEMENT_KEYS_PRESSED = {};
var MOVEMENT_PER_INTERVAL = 5; // 1 pixel per 20ms


// Size Constants
var NUMBER_SHIPEXPLOSION_FILES = 1;
var NUMBER_ROCKETLAUNCHING_FILES = 6;
var NUMBER_ROCKET_ASTEROID_EXPLOSION_FILES = 3;
var MAX_ASTEROID_SIZE = 50;
var MIN_ASTEROID_SIZE = 15;
var ASTEROID_SPEED = 5;
var SHIELD_SPEED = 5;
var ROCKET_SPEED = 10;
var OBJECT_REFRESH_RATE = 50;  //ms
var SCORE_UNIT = 100;  // scoring is in 100-point units

// Size vars
var maxShipPosX, maxShipPosY;

// Global Window Handles (gwh__)
var gwhGame, gwhOver, gwhScore, gwhRate, gwhSplashScreen,explosion;

// Global Object Handles
var ship, curShieldGlobal;

var topThree = [];
var allGameObjects = {
  'asteroid': {
    'index': 1,
    'className': 'asteroid',
    'id': 'a',
    'size': 0,
    'imgName': 'asteroid.png',
    'speed': ASTEROID_SPEED,
    'intervals': {},
  },
  'rocket': {
    'index': 1,
    'className': 'rocket',
    'id': 'r',
    'imgName': 'rocket.png',
    'speed': ROCKET_SPEED,
    'intervals': {},
  },
  'shield': {
    'index': 1,
    'className': 'shield',
    'id': 'shield',
    'size': 50,
    'imgName': 'shield.png',
    'speed': SHIELD_SPEED,
    'spawnShield': false,
    'hasShield': false,
    'intervals': {},
  },
  'homingRocket': {
    'index': 1,
    'className': 'homingRocket',
    'id': 'homing',
    'size': 50,
    'imgName': 'homing.png',
    'speed': 5,
    'spawnHoming': false,
    'hasHoming': false,
    'intervals': {},
  }
};

/*
 * This is a handy little container trick: use objects as constants to collect
 * vals for easier (and more understandable) reference to later.
 */
var KEYS = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  shift: 16,
  spacebar: 32
};


////  Functional Code  ////

// Main
$(document).ready( function() {
  console.log("Ready!");

  initAudio(NUMBER_SHIPEXPLOSION_FILES, 'shipExplosion', 'shipExplosion', '.mp3');
  initAudio(NUMBER_ROCKETLAUNCHING_FILES, 'rocketLaunching', 'rocketLaunching', '.wav');
  initAudio(NUMBER_ROCKET_ASTEROID_EXPLOSION_FILES, 'rocketAsteroidExplosion', 'rocketAsteroidExplosion', '.mp3');
  

  // Listeners //
  $('#settingsButton').click(() => {
    toggleSettingsMenu();
  });

  $('#spawningRate').focusout(() => {
    let value = parseFloat($("#spawningRate").val());
    if(!(value >= 0.2 && value <= 4)) {
      alert("please enter a numerical value that ranges from 0.2 and 4");
    }
  });

  $('#vanilla').click(() => {
    $('.ship-avatar').attr('src', 'img/fighter.png');
    $('.life1').attr('src', 'img/fighter.png');
    $('.life2').attr('src', 'img/fighter.png');
    $('#chosenShip').html('Vanilla');
    $('#bonus').html('+ None');
    $('#weakness').html('- None');
    shipType = {
      'vanilla': true,
      'spiky': false,
      'alien': false
    };
  });

  $('#spike').click(() => {
    $('.ship-avatar').attr('src', 'img/spike.png');
    $('.life1').attr('src', 'img/spike.png');
    $('.life2').attr('src', 'img/spike.png');
    $('#chosenShip').html('Spiky');
    $('#bonus').html('+ 25% Longer Homing Rockets');
    $('#weakness').html('- 15% Longer Nuke Cooldown');
    shipType = {
      'vanilla': false,
      'spiky': true,
      'alien': false
    };
  });

  $('#alien').click(() => {
    $('.ship-avatar').attr('src', 'img/alien.png');
    $('.life1').attr('src', 'img/alien.png');
    $('.life2').attr('src', 'img/alien.png');
    $('#chosenShip').html('Alien');
    $('#bonus').html('+ 20% Faster Rockets');
    $('#weakness').html('- 20% Ship Speed');
    shipType = {
      'vanilla': false,
      'spiky': false,
      'alien': true
    };
  });

  $('#muteAudio').click(() => {
    $('#muteAudio').blur();
  });

  $('#nameButton').click(() => {
    updateLeaderboard();
    $('#nameButton').attr("disabled",true);
  });

  $('#update').click(() => {
    $('#spawningRate').blur();
    let value = parseFloat($("#spawningRate").val());

    if(!(value >= 0.2 && value <= 4)) {
      alert("please enter a numerical value that ranges from 0.2 and 4");
    }
    else {
      spawnRate.middle = value * 1000;
      spawnRate.min = (spawnRate.middle - spawnRate.middle * .5);
      spawnRate.max = (spawnRate.middle - spawnRate.middle * .5);
      toggleSettingsMenu();
    }
  });

  $('#start').click(() => {
    runGame();
  });

  $('#goBack').click(() => {
      if(!$('#muteAudio').is(':checked')) {
        sounds.intro.play();
      }
      running = false;
      hasExploded = false;
      curShieldGlobal = {};
      MOVEMENT_KEYS_PRESSED = {};

      allGameObjects['asteroid'].index = 1;

      allGameObjects['rocket'].index = 1;

      allGameObjects['shield'].index = 1;
      allGameObjects['shield'].spawnShield = false;
      allGameObjects['shield'].hasShield = false;

      allGameObjects['homingRocket'].index = 1;
      allGameObjects['homingRocket'].spawnHoming = false;
      allGameObjects['homingRocket'].hasHoming = false;

      numberAsteroidsDestroyed = 0;
      spawnRate = {
        middle: 1000,
        min: 500,
        max: 1500,
    };
      numberLives = 2;
      gwhScore.html("0");
      gwhRate.html("0%");
      $('#nameButton').attr("disabled",false);
      gwhOver.hide();
      gwhGame.show();
      $('.finalScore').remove();
      gwhSplashScreen.show();
      ship.show();
      resetShipPosition();
      $('#nukeInstruction').hide();
      $('#nuke').hide();
      $('#nukeCooldown').hide();
      if(shipType.spiky) {
        $('#time').html(23);
      }
      else {
        $('#time').html(20);
      }
      clearInterval(nukeInterval);
      $("#muteAudio").prop('checked', true);
      shipType = {
        vanilla: true,
        spiky: false,
        alien: false
      };
      $('.ship-avatar').attr('src', 'img/fighter.png');
      $('.life1').attr('src', 'img/fighter.png');
      $('.life2').attr('src', 'img/fighter.png');
      $('#chosenShip').html('Vanilla');
      $('#bonus').html('+ None');
      $('#weakness').html('- None');
      nukeReady = true;
  });


  //

  // Set global handles (now that the page is loaded)
  gwhGame = $('.game-window');
  gwhOver = $('.game-over');
  gwhScore = $('#score-box');
  gwhRate = $('#rate');
  gwhSplashScreen = $('.splashScreen');
  ship = $('#enterprise');  // set the global ship handle
  explosion = $('.explosion');

  // Set global positions
  maxShipPosX = gwhGame.width() - ship.width();
  maxShipPosY = gwhGame.height() - ship.height();

  $(window).keydown(keydownRouter);
  $(window).keyup(keyupRouter);
  //$(window).keydown(moveShip);
  //$(window).keydown(fireRocket);
  //$(window).keydown(createAsteroid);

  // Periodically check for collisions (instead of checking every position-update)
  setInterval( function() {
    checkCollisions();  // Remove elements if there are collisions
  }, 1);
});

function initAudio(endIndex, fileName, folderName, fileExstension) {
  for(let startingIndex = 1; startingIndex < endIndex + 1; ++startingIndex) {
    sounds[fileName][startingIndex] = new Audio('./audio/'+folderName+'/'+fileName+ ' (' + startingIndex + ')' + fileExstension );
  }
}

function updateLeaderboard() {
    let player = {};
  player.name = $("#name").val();
  player.score = parseInt($('#score-box').html());
  topThree.push(player);
  topThree.sort(function(a, b) {
    return b.score - a.score;
  });

  if(topThree.length > 3) {
    topThree.pop();
  }

  if($('.leaderboard ol li').length) {
    $('.leaderboard ol').remove();
  }

  $('#topThree').append("<ol type='1' id='scoreList'></ol>");
  topThree.forEach((player) => {
      $('#scoreList').append('<li>' + player.name + ":" + player.score + '</li>');
  });

  $('.leaderboard').show();
}

function generateRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function resetShipPosition() {
  ship.css('left', '');
  ship.css('top', '');
}

function runGame() {
  console.log("Using inteval from " + spawnRate.min / 1000 + " to " + spawnRate.max / 1000 + " seconds.");
  running = true;
  gwhSplashScreen.hide();
  $('.life1').show();
  $('.life2').show();
  $('#nukeInstruction').show();
  $('#nuke').show();

  if (!document.hidden) {
  (function loop() {
      let randomInterval = generateRandomNumber(spawnRate.min, spawnRate.max);
      console.log(randomInterval);
        spawnShipItem(allGameObjects['shield'], 'spawnShield', 10);
        spawnShipItem(allGameObjects['homingRocket'], 'spawnHoming', 18);
  
      asteroidTimeout = setTimeout(function() {
        allGameObjects['asteroid'].size = MIN_ASTEROID_SIZE + (Math.random() * (MAX_ASTEROID_SIZE - MIN_ASTEROID_SIZE));
        createGameObject(allGameObjects['asteroid']);
        loop();
      }, randomInterval);
  }());
}
}


function spawnShipItem(gameObject, spawnObject, modulus) {
  if(numberAsteroidsDestroyed != 0 && numberAsteroidsDestroyed % modulus == 0) {
    if(!gameObject[spawnObject]) {
        gameObject[spawnObject] = true;
        createGameObject(gameObject);
    }
  }
  else {
    gameObject[spawnObject] = false;
  }
}

function toggleSettingsMenu() {
  $("#settingsButton").blur();
  $("#settingsButton").html($("#settingsButton").html() == 'Open Setting Panel'
    ? 'Close Setting Panel'
    : 'Open Setting Panel');
  $(".settingsMenu").toggle();
}

function startNukeTimer(duration) {
  $('#nukeCooldown').show();
  nukeInterval = setInterval(function () {
    duration = duration-1;
    $('#time').html(duration);
    if(duration == 0) {
      clearInterval(nukeInterval);
      $('#nukeInstruction').show();
      $('#nuke').show();
      $('#nukeCooldown').hide();
      nukeReady = true;
    }
  },1000);
}

function launchNuke() {
  if(nukeReady) {
    if(!$('#muteAudio').is(':checked')) {
      sounds.nuke.play();
    }
    clearObjectsFromScreen(true);
    $('#nukeInstruction').hide();
    $('#nuke').hide();
    nukeReady = false;
    if(shipType.spiky) {
      $('#time').html(23);
      startNukeTimer(23);
    }
    else {
      $('#time').html(20);
      startNukeTimer(20);
    }
    $(".nukeExplosion").show();
    let randomHeight = generateRandomNumber(300,400);
    let randomWidth = generateRandomNumber(250,325);
    let randomGrowth = generateRandomNumber(750, 1250);
    $(".nukeExplosion").animate({height: randomHeight, width: randomWidth}, randomGrowth, fadeNukeOut);
  }
}

function fadeNukeOut() {
  let randomFade = generateRandomNumber(1500,2000);
  $(".nukeExplosion").fadeOut(randomFade,"swing",resetNukeExplosion);
}

function resetNukeExplosion () {
  $(".nukeExplosion").css("height", '');
  $(".nukeExplosion").css("width", '');
}

function keyupRouter(e) {
  switch (e.which) {
    case KEYS.left:
    case KEYS.right:
    case KEYS.up:
    case KEYS.down:
      MOVEMENT_KEYS_PRESSED[e.which] = false;
  }
}

function keydownRouter(e) {
  switch (e.which) {
  case KEYS.spacebar:
    if(running) {
      fireRocket(allGameObjects['rocket']);
    }
    break;
  case KEYS.shift:
  if(running) {
    launchNuke();
  }
    break;
  case KEYS.left:
  case KEYS.right:
  case KEYS.up:
  case KEYS.down:
    MOVEMENT_KEYS_PRESSED[e.which] = true;
    break;
  default:
    console.log("Invalid input!");
  }
}

function updateRate() {
  if(running && allGameObjects['rocket'].index != 1) {
    gwhRate.html(parseInt((numberAsteroidsDestroyed/(allGameObjects['rocket'].index  - 1)) * SCORE_UNIT) + "%");
  }
}

function moveExplosion() {
  if(hasExploded) {
    let shipPos = parseInt(ship.css('left')) - 57;
    explosion.css('left', shipPos);
    explosion.css('top', parseInt(ship.css('top')));
    explosion.show();
  }
}

function createAsteroidExplosion(destroyedAsteroid) {
  gwhGame.append("<img src='./img/asteroidExplosion.png' id='asteroidExplosion" + destroyedAsteroid[0].id + "'/>");
  let randomEndHeight = generateRandomNumber(50,125);
  let randomEndWidth = generateRandomNumber(50,125);
  let randomGrowth = generateRandomNumber(200, 400);
  $("#asteroidExplosion" + destroyedAsteroid[0].id).css({
    'height': '25px',
    'width': '25px',
    'position': 'absolute',
    'top': parseInt(destroyedAsteroid.css('top')) - (randomEndHeight - 25) / 4,
    'left': parseInt(destroyedAsteroid.css('left')) - (randomEndWidth - 25) / 4
  });
  $("#asteroidExplosion" + destroyedAsteroid[0].id).animate(
    {height: randomEndHeight, width: randomEndWidth }, 
    randomGrowth, 
    fadeAsteroidExplosionOut);
}

function fadeAsteroidExplosionOut() {
  let randomFade = generateRandomNumber(200, 600);
  $(this).fadeOut(randomFade,"swing", deleteAsteroidExplosion);
}

function deleteAsteroidExplosion() {
  $(this).remove();
}

function playRandomSound(endIndex, sound) {
  let randomIndex = Math.floor(Math.random() * (endIndex - 1)) + 1;  
  sound[randomIndex].cloneNode(true).play();
}

// Check for any collisions and remove the appropriate object if needed
function checkCollisions() {
  // First, check for rocket-asteroid checkCollisions
  /* NOTE: We dont use a global handle here because we need to refresh this
   * list of elements when we make the reference.
   */
  $('.rocket').each( function() {
    var curRocket = $(this);  // define a local handle for this rocket
    $('.asteroid').each( function() {
      var curAsteroid = $(this);  // define a local handle for this asteroid

      // For each rocket and asteroid, check for collisions
      if (isColliding(curRocket,curAsteroid)) {
        // If a rocket and asteroid collide, destroy both
        createAsteroidExplosion(curAsteroid);
        removeGameObject(curRocket, curRocket[0].id, allGameObjects['rocket'].intervals);
        removeGameObject(curAsteroid, curAsteroid[0].id, allGameObjects['asteroid'].intervals);
        
        if(!$('#muteAudio').is(':checked')) {
          playRandomSound(NUMBER_ROCKET_ASTEROID_EXPLOSION_FILES, sounds.rocketAsteroidExplosion);
        }
        
        ++numberAsteroidsDestroyed;
        // Score points for hitting an asteroid! Smaller asteroid --> higher score
        var points = Math.ceil(MAX_ASTEROID_SIZE-curAsteroid.width()) * SCORE_UNIT;
        // Update the visible score
        gwhScore.html(parseInt($('#score-box').html()) + points);
        updateRate();
      }
    });

    // For each rocket and shield, check for collisions
    $('.shield').each( function() {
      var curShield = $(this);
      // For each rocket and shield, check for collisions
        if(!allGameObjects['shield'].hasShield) {
          if (isColliding(curRocket,curShield)) {
            // If a rocket and shield collide, destroy both
              removeGameObject(curRocket, curRocket[0].id, allGameObjects['rocket'].intervals);
    
              removeGameObject(curShield, curShield[0].id, allGameObjects['shield'].intervals);
            }
        }
    });
  });

  // Next, check for asteroid-ship interactions
  $('.asteroid').each( function() {
    var curAsteroid = $(this);
    if (isColliding(curAsteroid, ship)) {

        if (allGameObjects['shield'].hasShield) {
            removeGameObject(curAsteroid, curAsteroid[0].id, allGameObjects['asteroid'].intervals);
            curShieldGlobal.remove();
            allGameObjects['shield'].hasShield = false;
            return;
        }
      allGameObjects['homingRocket'].hasHoming = false;
      clearObjectsFromScreen(false);
      $('#progressBar').hide();
      $('#homing').hide();
      $(".life" + numberLives).hide(); // remove one life
      if(!$('#muteAudio').is(':checked')) {
        playRandomSound(NUMBER_SHIPEXPLOSION_FILES, sounds.shipExplosion);
      }

      hasExploded = true;
      moveExplosion();
      setTimeout(function() {
          explosion.hide();
          hasExploded = false;
      }, 1000);

      if (!numberLives) {
        if(!$('#muteAudio').is(':checked')) {
          sounds.gameOver.play();
        }
        running = false;
        // Remove all game elements
        ship.hide();

        // Hide primary windows
        gwhGame.hide();

        // Show "Game Over" screen
        if($('#finalScore').length){
          $('#finalScore').remove();
        }
        $('#gameOverHeader').after('<div class="finalScore"> <h3> Your Score: ' + parseInt($('#score-box').html()) + '</h3><br><br></div>');
        gwhOver.show();
        clearTimeout(asteroidTimeout);
      }
      --numberLives;
    }
  });

  // Next, check for ship-shield collision if doesn't already have shield
  if(!allGameObjects['shield'].hasShield) {
    $('.shield').each( function() {
      if (isColliding($(this), ship)) {
        allGameObjects['shield'].hasShield = true;
        curShieldGlobal = $(this);
        clearInterval(allGameObjects['shield'].intervals[curShieldGlobal[0].id].interval);
        delete allGameObjects['shield'].intervals[curShieldGlobal[0].id];
        moveShield();
      }
    });
  }

  if(!allGameObjects['homingRocket'].hasHoming) {
    $('.homingRocket').each( function() {
      if (isColliding($(this), ship)) {
          allGameObjects['homingRocket'].hasHoming = true;
          $(this).remove();
          $('#progressBar').show();
          $('#homing').show();
          if(shipType.spiky) {
            progress(10, 10);
          }
          else {
            progress(8, 8);
          }
      }
    });
  }
}

function updateScoreFromNuke() {
  let extraPoints = 0;
  $('.asteroid').each( function() {
    let curAsteroid = $(this); 
    extraPoints += Math.ceil(MAX_ASTEROID_SIZE-curAsteroid.width()) * SCORE_UNIT;
  });
  // Update the visible score
  gwhScore.html(parseInt($('#score-box').html()) + extraPoints);
}

function clearObjectsFromScreen(isNuke) {
  if(isNuke) {
    updateScoreFromNuke();
  }
  $('.rocket').remove();  // remove all rockets
  $('.asteroid').remove();  // remove all asteroids
  $('.shield').remove();
  $('.homingRocket').remove();
  clearIntervalsFromObject(allGameObjects);
}

function progress(timeleft, timetotal) {
  var progressBarWidth = timeleft * $('#progressBar').width() / timetotal;
  $('#progressBar').find('div').animate({ width: progressBarWidth }, 500).html(timeleft%60);
  let timeout;
  if(timeleft > 0) {
      timeout = setTimeout(function() {
          progress(timeleft - 1, timetotal, $('#progressBar'));
      }, 1000);
  }
  else{
    clearTimeout(timeout);
    $('#progressBar').hide();
    $('#homing').hide();
    allGameObjects['homingRocket'].hasHoming = false;
  }
}

function clearIntervalsFromObject(gameObjects) {
  for (let object in gameObjects) {
      for (let id in object.intervals) {
          clearInterval(object.intervals[id]);
      }
      object.intervals = {};
  }
}

function moveShield() {
  if(allGameObjects['shield'].hasShield) {
    let shipPos = parseInt(ship.css('left')) + 17;
    curShieldGlobal.css('left', shipPos);
    curShieldGlobal.css('top', parseInt(ship.css('top')) + 10);
  }
}

// Check if two objects are colliding
function isColliding(o1, o2) {

    let object1 = {
        'x': parseInt(o1.css('left')),
        'width': o1.width(),
        'y': parseInt(o1.css('top')),
        'height': o1.height()
    };
    let object2 = {
        'x': parseInt(o2.css('left')),
        'width': o2.width(),
        'y': parseInt(o2.css('top')),
        'height': o2.height()
    };

    if (object1.x < object2.x + object2.width && object1.x + object1.width > object2.x &&
        object1.y < object2.y + object2.height && object1.y + object1.height > object2.y) {
        return true;
    }
    return false;
}


function removeGameObject(gameObject, gameObjectID, intervalToClear) {
    gameObject.remove();
    if(intervalToClear[gameObjectID] !== undefined) {
      clearInterval(intervalToClear[gameObjectID].interval);
    }

    delete intervalToClear[gameObjectID];
}

function createGameObject(gameObject) {
  let divStr = "<div id='" + gameObject.id + "-" + gameObject.index + "' class='" + gameObject.className + "'></div>";
  gwhGame.append(divStr);
  let id = gameObject.id + '-' +  gameObject.index;
  var curObject = $('#' + id);
  gameObject.index++;

  curObject.css('width', gameObject.size+"px");
  curObject.css('height', gameObject.size+"px");
  curObject.append("<img src='img/" +  gameObject.imgName + "' height='" +  gameObject.size + "'/>");
  let startingPosition = Math.random() * (gwhGame.width()- gameObject.size);

  curObject.css('left', startingPosition+"px");

  let interval =  setInterval( function() {
    curObject.css('top', parseInt(curObject.css('top'))+ gameObject.speed);
    // Check to see if the asteroid has left the game/viewing window
    if (parseInt(curObject.css('top'))-10 > (gwhGame.height() - curObject.height())) {
        removeGameObject(curObject, id, gameObject.intervals);

    }
  }, OBJECT_REFRESH_RATE);

    gameObject.intervals[id] = {
      'interval': interval,
      'targeted': false
    };
}

// Handle "fire" [rocket] events
function fireRocket(rocket) {
  console.log('Firing rocket...');
  if(!$('#muteAudio').is(':checked')) {
    playRandomSound(NUMBER_ROCKETLAUNCHING_FILES, sounds.rocketLaunching);
  }

  // NOTE: source - https://www.raspberrypi.org/learning/microbit-game-controller/images/missile.png
    let rocketDivStr = "<div id='" + rocket.id + "-" + rocket.index + "' class='" + rocket.className + "'><img src='img/" + rocket.imgName + "'/></div>";
  // Add the rocket to the screen
  gwhGame.append(rocketDivStr);
  // Create and rocket handle based on newest index
  let id = rocket.id + '-' +  rocket.index;
  var curRocket = $('#' + id);
    rocket.index++;

  // Set vertical position
  curRocket.css('top', ship.css('top'));
  // Set horizontal position
  var rxPos = parseInt(ship.css('left')) + (ship.width()/2);  // In order to center the rocket, shift by half the div size (recall: origin [0,0] is top-left of div)
  curRocket.css('left', rxPos+"px");


    let asteroidId = undefined;
    let targetedId;
    if (allGameObjects['homingRocket'].hasHoming) {
      for (let id in allGameObjects['asteroid'].intervals) {
          if (!allGameObjects['asteroid'].intervals[id].targeted) {
              allGameObjects['asteroid'].intervals[id].targeted = true;
              targetedId = id;
              asteroidId = $('#' + id);
              break;
          }
      }
    }
    
  // Create movement update handler
    let rocketInterval = setInterval(function () {
        if (allGameObjects['homingRocket'].hasHoming && asteroidId !== undefined && asteroidId.length 
        && allGameObjects['asteroid'].intervals[targetedId] !== undefined && 
        allGameObjects['asteroid'].intervals[targetedId].targeted) {
          if (parseInt(curRocket.css('left')) > parseInt(asteroidId.css('left'))) {
            curRocket.css('left', parseInt(curRocket.css('left')) - rocket.speed);
          }
          if (parseInt(curRocket.css('top')) > parseInt(asteroidId.css('top'))) {
            curRocket.css('top', parseInt(curRocket.css('top')) - rocket.speed);
          }
          if (parseInt(curRocket.css('left')) < parseInt(asteroidId.css('left'))) {
            curRocket.css('left', parseInt(curRocket.css('left')) + rocket.speed);
          }

          if (parseInt(curRocket.css('top')) < parseInt(asteroidId.css('top'))) {
                curRocket.css('top', parseInt(curRocket.css('top')) + rocket.speed);
            }
        }

        else {
            curRocket.css('top', parseInt(curRocket.css('top')) - rocket.speed);
        }

        // Check to see if the rocket has left the game/viewing window
        if ((parseInt(curRocket.css('top')) < curRocket.height()) ||
        parseInt(curRocket.css('top')) -10 > (gwhGame.height() - curRocket.height())) {
            removeGameObject(curRocket, id, rocket.intervals);
            updateRate();
        }
  }, (shipType.alien) ? 40 : OBJECT_REFRESH_RATE);
    rocket.intervals[id] = {
     'interval': rocketInterval,
     'targeted': false
    };
}

function calculateNewHorizontalPosition(oldPosition, left, right) {
  let newHorizontalPosition = parseInt(oldPosition,10);

  if(MOVEMENT_KEYS_PRESSED[left]) {
    newHorizontalPosition -= (shipType.alien) ? 4 : MOVEMENT_PER_INTERVAL;
  }
  if(MOVEMENT_KEYS_PRESSED[right]) {
    newHorizontalPosition += (shipType.alien) ? 4 : MOVEMENT_PER_INTERVAL;
  }

  if(newHorizontalPosition < 0) {
    newHorizontalPosition = 0;
  }
  else if(newHorizontalPosition > maxShipPosX) {
    newHorizontalPosition = maxShipPosX;
  }
  return newHorizontalPosition;
}

function calculateNewVerticalPosition(oldPosition, up, down) {
  let newVerticalPosition = parseInt(oldPosition,10);

  if(MOVEMENT_KEYS_PRESSED[up]) {
    newVerticalPosition -= (shipType.alien) ? 4 : MOVEMENT_PER_INTERVAL;
  }
  if(MOVEMENT_KEYS_PRESSED[down]) {
    newVerticalPosition += (shipType.alien) ? 4 : MOVEMENT_PER_INTERVAL;
  }

  if(newVerticalPosition < 0) {
    newVerticalPosition = 0;
  }
  else if(newVerticalPosition > maxShipPosY) {
    newVerticalPosition = maxShipPosY;
  }
  return newVerticalPosition;
}

  // Handle ship movement events
setInterval(function() {
    ship.css({
      left: function(index ,oldValue) {
          return calculateNewHorizontalPosition(oldValue, KEYS.left, KEYS.right);
      },
      top: function(index, oldValue) {
          return calculateNewVerticalPosition(oldValue, KEYS.up, KEYS.down);
      }
      
  });
  moveShield();
  moveExplosion();
}, 20);

