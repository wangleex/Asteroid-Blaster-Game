Basic Functionalities:
	1. Accuracy Counter:
		For this one, I created a global object counter called numberAsteroidsDestroyed then each time 
		an asteroid gets destroyed and when a rocket leaves the game window then I just called a function call updateRate(). Inside updateRate(),
		I calculate the rate by dividing the total number of asteroids destroyed by how many rockets have been fired. This rate then gets updated 
		on the HTML.
	
	2. Settings Panel: 
		Inside the HTML I first set up the "Open Setting Panel". Then, inside my javascript code I have a listener for
		when the button gets clicked. When the button gets clicked, I check what the current text on the button is and I change it to the other one.
		For example, if the current text is "Close Setting Panel" then it changes to "Open Setting Panel". Once the panel is opened, the update and 
		mute button both get shown as well as the spawn rate via static HTML. Similiar to the rain sample shown in lecture, I read in the spawn rate
		from the text with .val() after the update button gets clicked. When the update buttons gets clicked, I again check the current text on the 
		settings panel button and change it to the other one. 
	
	3. Spawning Asteroid:
		I first created some global integers to store the input from the asteroid spawning rate text. In order to calculate the random interval,
		I did the following calculation: Math.random() * (max - min) + min where max would be +50% of the spawningRate while min is -50% of the 
		spawningRate. To make the asteroids spawn automatically using this random interval, I created a function with setTimeout() inside of it. 
		The function setTimeout() makes a call to createAsteroid() to generate the asteroids on the screen. Then, setTimeout() calls the outer function
		after the random interval amount of time, which is how I get the asteroids to spawn automatically. I printed out the random Interval in the
		console for each asteroid spawned. Once the game ends, I clear out the setTimeout().
	
	4. Splash Screen:
		Inside the html, I have all the instructions needed as well as the life icons. The life icons don't display by default.
		When the user clicks start Div blaster button, I hide the contents of the splash screen and then show the life icons. When the game is done and the user
		clicks the go back button, then I unhide the splash screeen and do the same process agin. The way I know whether the game is running or not is that
		I have global boolean state variable that keeps track of the game state. Whenever the user clicks go back from the game screen or when they are on the splash screen,
		I will check the game state via the boolean variable. 

	5. Game over screen
		The html for the game over screen is hidden by default. When the game ends, I show the game over screen and hide the game window. The "go back" button has
		a click handler for whenever the user clicks on it. When they do click on it, I hide the gameOver screen the show the splash screen. To initialize the
		game status, I reset the ship and its position by calling ship.css('top','') and ship.css('left','') which resets to the original position. I reset the score,
		but just setting the html for the scroe to 0 and I set the html for the rate to 0%. In addition, I reset the global asteroids destroyed counter and the asteroid
		and rocket indices. I also reset the spawning rate to the default of 1 and I mute the audio by default. 
	
	6. Sound effects for rocket launching, ship-asteroid collision, game over, and splash screen song
		I added sound effects by following the example in class with the gong noises. I created an object with 
		the properties being the audio objects. Then whenver I need to play one of the audio clips, I just do something like
		sounds.explosion.play() if the muted checkbox is not checked. As one of the bonus functionalities I added different sounds
		for rocket launching, ship-asteroid collision, and rocket-asteroid collision, but that is explained later. I also made the sound clips
		overlap one another if the user fires a lot of rockets and once or destroys many asteroids simultaneously, which is also explained later.
		For the muted checkbox, I added a "checked" attribute to the HTML to have it checked by default. Before playing an audio clip, I check
		if the muted checkbox is checked by calling is(':checked') on the div id. 
	
	7. Visual effects for ship-asteroid collision
		I used the given ship-asteroid explosion image for this. To make the visual effect disappear after one second,
		I used setTimeout(). More specifically, I gave setTimeout() a timeout of 1 second and inside setTimeout I hid the explosion.
		This is how I implemented the delay. To have the explosion move on top of the ship, I just set the explosion css to the top and
		left position of the ship whenver the user moves their ship. For example, if the user moves the ship to left then the explosion
		just gets set to the new ship's left position. 
	
	8. Shield
		To get the shield to spawn just like asteroids, I refactored the given code so that both asteroids and shields call
		a generic function for creating objects. This made life a lot easier for me, instead of having duplicate code for shields and
		asteroids. After refactoring, I just call that function whenever I need to create a shield. I check when to create a shield
		by checking the global numberAsteroidsDestroyed variable mentioned previously. To get the shield to be destroyed when it impacts
		a rocket, I just added a check inside checkCollisions() for any shield and rocket collisions(). If they do colllide, I just remove the 
		shield and rocket similiar to rocket-asteroid collision. If the user does pick up the shield and gets hit by an asteroid, I check if the 
		ship has a shield and if it does I just do nothing but I still remove the asteroid. To get the shield to move where ever the ship
		moves, I just set the shield position equal to the ship's position. That way, when the ship moves the shield
		will automatically move with it.
	
Bonus Functionalities:
	1.  (BONUS - 10pts ) ​​Continuous smooth movement for the ship. 
		I used 5px per 20ms instead of 1px per 20ms because it felt too slow for me. To implement this,I first added a global object to keep 
		track of arrow key press called MOVEMENT_KEYS_PRESSED. This object contains the key number like 37 for left and whether it's currently
		being held down. Inside the keydownRouter(e) function I then had to change things. Instead of calling moveShip() whenever the user 
		presses the arrow keys, I just set that movement key number to true like MOVEMENT_KEYS_PRESSED[e.which] = true. That way, I know
		when the an arrow key is currently held down. To catch when the user releases one of the movement keys, I set up a 
		window listener for keyup events, similiar to the window listener for keydown events. Whenever there's a keyup event, I
		call a function which sets that movement key's value to false. This means the movement key isn't currently down. 
		
		Once I got this MOVEMENT_KEYS_PRESSED global object set up to detect which movement keys are currently being pressed down, I then
		set up the actual algorithm for movement. First, I created a setInterval() function and inside there I set the ship.css top and left positions.
		I did this by taking the old position and subtracting 5 pixels if the up button is pressed or adding 5 pixels if the down arrow is pressed. This
		is similiar to the left and right keys. I check the bounds as well and set the position appropriately. Lastly, I set the new position which then
		gets set on the css. For the setInterval, I used every 20 ms as stated in the spec but I change by 5 pixels instead of 1. 
		
	(BONUS - 10pts ) ​​	
	2. Sounds play on top of each other
		As mentioned earlier, I made it so sounds will play on top of each other if needed. For example, if the user destroys many asteroids at once then the 
		explosion sounds will play on top of each other. Also, if the user fires many rockets at once each rocket's audio will still play.
		In this way, the sounds will still play independent on the user's performance
		
		The implementation for this was using a function called cloneNode which will clone the audio when needed. I used this function for the rocket launching and 
		rocket-asteroid collisions since most of the time they need to overlap. 
		
	3. Scoreboard that you can keep track of TOP 3 player’s name.
		As an overview, this feature includes a name entry field on the game over screen. There's also a button to submit your name, which then shows up on the right 
		of the screen near the score. The button gets grayed out when you submit so you can't submit multiple times on the screen. If you want to submit another name,
		you would need to hit the go back button then play again until the game ends. 
		
		To implement this, I first created a global array called topThreePlayers. I also added a onclick handler for the submit button. When the user clicks submit, I grab
		whatever is in the text entry then store the name in the topThreePlayers as an object where the key is the name and the value is score. Thus, I have an array of 
		objects. I add the name everytime the user submits. However, once there are already three names and the user submits again then I have to sort the array and pop off 
		the lowest score. I clear out the previous scoreboard then rebuild it using the new sorted array with 3 names which is sorted by score descending. I use an ordered list
		in the HTML and map number 1 to the first element in the array, number 2 to the second element etc. I repeat this process of sorting and poping off the lowest score
		when there are three player name entries.
		
	4. An Item that turns rockets to homing missiles for a period of time
		As a summary, the homing missle drops for every 18 asteroids destroyed. The homing missle can't be destroyed by a rocket unlike the shield. When the user picks it up,
		their rockets becoming homing rockets so it locks on to asteroids automatically. As a user interface enchancement, there's a bar near the bottom of the screen which
		tracks how much longer the user has the homing rocket. By default, the homing rocket lasts for 8 seconds. However, the homing rocket will end prematurely if the ship
		collides with an asteroid. 
		
		This homing missle item acts similiar to the shield and asteroid when it spawns. It drops at the same rate as the asteroid and shield. When the user picks up the homing 
		missile, the user now has the homing missle. I implemented the progress bar using the css animate property with setTimeout(). Inside setTimeout(), I kept a counter 
		to see how many seconds are left and when there are 0 seconds left I removed the timeout. To get the bar to move, I shrunk the width each second. When there are 0 seconds left
		I just hide the bar. 
		
		To get the missle to have the homing effect, I first kept an object with the ids of all the asteroids currently on the screen. Then, inside fireRocket(), I would loop through
		the object and see which asteroids haven't been targeted yet with a boolean. If there's an asteroid that hasn't been targeted yet, then that becomes the target for the homing 
		rocket. I get the asteroids' left and top position and I check if the homing rocket is to the left, to the top, to the right, or to the left of the asteroid. I move 
		by just subtracting or adding the rocket's speed, just like with a normal rocket. For instance, if the current homing rocket is to the left of the asteroid then I just add
		by the rocket's speed. All of these checks and position movement are done in the setInterval similar to just a normal rocket. In the case where there's no asteroids to be targeted
		by the homing rocket then the ship just fires a normal rocket straight up. I know if there's no asteroids to be targeted when the object containing all the asteroids as mentioned 
		earlier has all false values. 
		
	5. Polyphony of rocket launching sound
		For this, I first grabbed a bunch of audio files online and loaded them into a sounds object. The sounds object contains the index of the audio file and the acutal audio object.
		Each time a rocket gets fired, I generate a random number between 1 and the number of rocket launching files. Then, I index into the sounds object with this random index and that sound
		gets played. I repeat this process each time a rocket gets fired. 
		
	6. Polyphony of asteroid-rocket collision sound and explosion visual effect
		For the polyphony of sounds, I did the exact same process as for the polyphony of rocket launching sounds. For the explosion visual effect, I used the css animate and fadeOut. When a 
		rocket and asteroid collide, I use jQuery to add the explosion image where the asteroid was. This explosion image by default has a 25px size. Then, for the animation part to 
		make it grow bigger I use $(div).animate with a random height and random width. The height and width can be from 50 to 125px. Thus, it grows from 25px to random height and width
		to add variety. On top of that, the growing time is random from 200 to 400 ms. That way, the explosion effects are more random and interesting. Conveniently, the $.animate function
		has a parameter for a callback when the animation is done. Therefore, when the animation is finished I call that callback function to get the image to fade out. For fade out, I used a
		random number between 200ms to 600ms so it fades out at different times. I used the $.fadeOut() function for this one. The $.fadeOut() has a parameter for a callback function as well.
		When the image fades out completely, the callback function gets called which removes the explosion image from the screen. This entire process gets repeated for each asteroid to rocket
		collision.
		
	7. Polyphony of asteroid-ship explosion sound
		I implemented this the same way as the other two with polphonic sounds. I added this to provide more variety and flavor to the game.
	
	8. Pausing game when the browser tab is not active.
		I implemented this by using document.hidden. If document.hidden is true then the browser tab is not active and if it's false then it is active. Thus, when it returns true
		then I don't spawn any objects and the ship doesn't move.
		
	9. 	Secondary Weapon that clear all Asteroids at the same time (with animation)
		First, I added the html for the instructions, cooldown, and secondary weapon(nuke) icon. When the user presses the nuke key, I implemented a timer using setInterval to indicate how much
		time is remaining until they can use the nuke again. Inside the setInterval, I just have a counter counting down after each interval. When the counter reaches 0 seconds, I halt the setInterval()
		function and I hide the cooldown. Then, I show the nuke icon. The audio for the nuke was implemented similiarly to the explosion sounds. I kept an object of sounds with the nuke sound inside the object
		then just call .play() when needed. For the explosion, I implemented like the asteroid-rocket explosion. First, the nuke explosion image starts off at a width and height of 50 pixels. When the 
		user launches a nuke, I call $.animate using a random width, height, and growth time. This way, the explosion effect is different each time. Once the animation is done, it calls a callback function
		to have the image fade out. Again, the fade out function uses a random fade out time to add variety and randomness. Once it's done fading out, then I just hide the explosion image. The nuke clears out all
		objects including shields, asteroids, and homing missiles. The score gets updated appropriately based on how many asteroids were destroyed in the nuke. The rate however doesn't get changed. 

	10. Multiple choices of ships each with their own strength and weakness
		As an overview, there are a total of 3 ships. The first is just the normal one with the normal image and nothing is different. The other two each have one strength and one weakness. They 
		also have a different look to them. Also, the life icons on the top right correspond to the currently chosen ship. The ship selection is on the splash screen. The user just clicks on the 
		ship they want and then it displays the currently selected ship and its associated strength and weakness. When the game ends, and the user click on the go back button then the default 
		selection is the normal vanilla ship. The normal ship is always the default. The multiple choices of ships provided replayibility and variety to the game. It makes things more interesting
		and there can be strategies involved choosing which ship to use to get the highest score possible.
		
		For the implementation, I first added the html for the ship selection box and the images for the 3 ships. I also added in the text that displays the ship's strenghth and weakness. Then, whenever
		the user clicks on a ship's icon, it triggers a click handler. The click handler changes the ship's image as well as the text on the screen like the name of the ship and 
		the current selection. I also change a variable indicating which ship is currently selected. Then, once the user clicks start then the currently selected ship gets used. Each ships is different
		so I will explain the implementation for each individually.
			- Vanilla / original ship. There is nothing different with this ship from the orignal. This is always the default selection. 
			
			- Spiky ship. This one has the +25% Longer Homing Rockets but -15% Longer Nuke Cooldown. For this, I had an if statement check whether the current ship is the spiky ship inside the timer for
			the homing rockets and nuke cooldown. If the currently ship is the spiky ship, then I changed the setTimeout() for the nuke cooldown to be longer and the setTimeout() for the homing
			rockets to be longer. The longer homing rockets change gets reflected in the bar at the bottom when you have a homing rocket. 
			
			- Alien Ship. This one has the +20% Faster Rockets but -20% Ship Speed. To change the rocket speed, I changed the setInterval time inside fireRocket() to be shorted by 20%. Also, to change
			the ship speed, I changed how much the ship moves every time an arrow key gets presseed. For instance, instead of moving 5 px at a time per interval the ship now moves 4 px per interval.
			
	11. (BONUS - 2pts) Evaluate the updates (i.e., check if the value iswithin the range) when the input box loses focus.
		To implement this, I used $.focusOut on the text entry for spawning rate. When the input box loses focus like when clicking outside, I grab whatever is in the input box and then check it's value
		using the .val() function. 
		
	
Audio and Images Used in the code
	https://www.audioblocks.com/stock-audio/rocket-missile-whoosh.html
	https://freesound.org/people/Robinhood76/packs/6417/
	https://soundscrate.com/explosions-bangs.html
	https://www.freesoundeffects.com/free-sounds/explosion-10070/
	https://www.audioblocks.com/royalty-free-audio/explosion-sound-effects
	http://soundbible.com/tags-explosion.html
	https://www.google.com/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwj_1NykkZ7eAhVqhOAKHbDoBFYQjRx6BAgBEAU&url=https%3A%2F%2Fru.pngtree.com%2Ffreepng%2Fexplosions_1668069.html&psig=AOvVaw39K0BeKKiBg1vFFK9lj_92&ust=1540438098935111
	https://www.google.com/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwjApPmNkZ7eAhWwdN8KHT4xDqkQjRx6BAgBEAU&url=https%3A%2F%2Fwww.freeiconspng.com%2Fimg%2F45942&psig=AOvVaw3VKhSN_dfOtM-MHgkqgBSg&ust=1540438057736407
	https://opengameart.org/sites/default/files/spiked%20ship%203.PNG
	https://www.google.com/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwiw5a77kJ7eAhXPmuAKHRPJBL8QjRx6BAgBEAU&url=https%3A%2F%2Fark.gamepedia.com%2FRocket_Homing_Missile_(Scorched_Earth)&psig=AOvVaw0xxkG21KJ0iFZ2Fjk1P2Le&ust=1540438021040535
	https://www.google.com/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwiXvrDvkJ7eAhXlnuAKHXPfDjkQjRx6BAgBEAU&url=https%3A%2F%2Fmelbournechapter.net%2Fexplore%2Fnuke-clipart-tnt-bomb%2F&psig=AOvVaw2eL5nHs9YgFEJrDjCAudsR&ust=1540437992948956
	https://www.google.com/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwja2u3akJ7eAhXhUN8KHTyuAFkQjRx6BAgBEAU&url=https%3A%2F%2Fwww.clipartmax.com%2Fmiddle%2Fm2H7H7G6H7A0b1G6_drawn-spaceship-sprite-top-down-spaceship-png%2F&psig=AOvVaw0MHg7yJZUKjC64HtQ95r2E&ust=1540437938764308

