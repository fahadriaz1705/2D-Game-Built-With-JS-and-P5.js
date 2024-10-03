/*

The Game Project: Jolly the Bear
Game Instructions:
Left Right Arrow Key to move.
Space to Jump.
Jolly is HUNGRY. Go feed him those cherries, but be careful watchout for the bees and their stingers. 
They dont like Jolly taking their fruits. Feed Jolly and reach the Flag!......oh and one more thing Jolly cannot swim.
*/

//variables

var tree;
var cloud;                                     // Objects for trees, clouds, canyon and cherry
var canyon;
var collectable;

var gameChar_x;
var gameChar_y;                             // Characters X Pos and Y Pos variables
var groundPosY;

var isPlummeting;
var isLeft;                                 //Boolean variables for character movement and states
var isRight;
var isFalling;

var trees_x;
var clouds_x;                               //Arrays for trees clouds and mountains
var clouds_y;
var mountains_x;
var collectables;
var flagpole;

var cameraPosX;                             //Variables for game functions such as Game Score, Lives and scrolling
var game_score;
var lives;
var enemies;

var jumpSound;
var eatSound;                               //Variables for Sounds
var ouchSound;
var numnumSound;
var gameOverSound;
var backgroundSound;
var winSound;
var beeSound;

var platforms;                          //Variable for Platforms

function preload()
{
    soundFormats('mp3','wav');
    
    //Jump Sound
    jumpSound = loadSound('assets/jump1.wav');          //Loads the Jump sound from assets folder
    jumpSound.setVolume(0.1);
    //Eating Sound
    eatSound = loadSound('assets/eating.wav');          //Loads the Eating sound from assets folder
    eatSound.setVolume(0.1);
    //Ouch Sound
    ouchSound = loadSound('assets/ouch.mp3');           //Loads the Falling down canyon sound from assets folder
    ouchSound.setVolume(0.1);
    //GameOverSound
    gameOverSound = loadSound('assets/Failure 1.wav');      //Loads the Game Over/Loosing sound from assets folder
    gameOverSound.setVolume(0.1);
    //background sound
    backgroundSound = loadSound('assets/background.wav')        //Loads the background music from assets folder
    backgroundSound.setVolume(0.0009);
    // win sound
    winSound = loadSound('assets/Win.wav')                  //Loads the Level Complete/Win sound from assets folder
    winSound.setVolume(0.5);
    //Bee Buzzing Sound
    beeSound = loadSound('assets/BeeBuzz.wav')              //Loads the Bee Buzzing sound from the assets folder
    beeSound.setVolume(0.9);
    
}

function setup()
{
	createCanvas(1024, 576);
    groundPosY = 432;
    lives = 3;              //Lives variable initialization
    startGame();            //Function call to a function created below with all the variable initializations 

}

function draw()
{
    endGameSound();                         //Function call to Game over function created below
    backgroundSound.loop();               //Loop command used with background music sound so it plays in a loop in the background
    
	cameraPosX = gameChar_x - width/2;      //Side Scrolling
    //Sky Color
    background(135,206,250);  
    
    //green ground
	noStroke();
	fill(234, 197, 127);
	rect(0, 432, 1024, 144);
    fill(70, 124, 57)
    rect(0,432,1024,30);
    
    push();                                         // push everything that follows onto the stack! 
    translate(-cameraPosX, 0);      

	                                                   ////MOUNTAINS FUNCTION CALL////
    ////Mountains Function///
    drawMountains();
                                                        ////CLOUDS FUNCTION CALL////
    //Cloud Function
    drawClouds();


	                                                       ////TREE FUNCTION CALL///
    ///Tree Function///
    drawTrees();
    
    //Sign Board
    fill(152, 99, 59);
    rect(-180,groundPosY - 100,80,40);
    triangle(-100,groundPosY - 100,-100,groundPosY - 60, -70,groundPosY - 80);
    fill(111, 67, 42);
    rect(-142,groundPosY - 60,20,60);
    fill(222, 184, 134);
    text("That Way",-165,groundPosY - 75);
    
    // Platforms
    for(var i = 0; i < platforms.length; i++)
        {
            platforms[i].draw();                            //Platofrms draw code
        }
    
	                                                       ////CANYON FUNCTION CALL WITH FOR LOOP TO CREATE MULTIPLE CANYONS/////
    for(var i = 0; i< canyons.length; i++)
        {
        drawCanyon(canyons[i]);
            
        }
    for(var i = 0; i< canyons.length; i++)              //Canyon function checks distance between character and canyon
        {
            checkCanyon(canyons[i]);
        }
                                                            ///Cherries FUNCTION CALL WITH FOR LOOP TO CREATE MULTIPLE CHERRIES///
    //Collectable Function
        for(var i = 0; i < collectables.length ; i++)
        {
            if(collectables[i].isFound == false){
            
            drawCollectable(collectables[i]);
            checkCollectable(collectables[i]);
            }

        }
    
      renderFlagpole();                     ///FLAGPOLE DRAWING FUNCTION///
      
        if(lives < 1)                           ///CONDITIONALS TO STOP GAME WHEN LIVE BELOW 1 OR CHARACTER REACHES FLAGPOLE//
        {
            
            fill(0);
            rect(gameChar_x - 600,0,width + 100,height);
            fill(255,165,0);
            textSize(30);
            text("Game Over Press A to Continue", gameChar_x - 250,height/2);
            ouchSound.stop();
            backgroundSound.stop();
            jumpSound.stop();
            return;
        }

    if(flagpole.isReached == true)                  //Displays Level complete text when flapole reached
        {

            strokeWeight(5);
            fill(255,165,0);
            textSize(30);
            text("Level Complete. Press A to continue",gameChar_x - 200,height/2);
            return;
        }
    for(var i = 0; i < enemies.length; i++)         //Checks if character comes in contact with enemies and if true decrements lives
        {
            enemies[i].draw();
            var isContact = enemies[i].checkContact(gameChar_x,gameChar_y);            
            if(isContact)
                {
                    if(lives > 0)
                        {
                            lives -= 1;
                            beeSound.play();
                            ouchSound.play();
                            startGame();
                            break;
                        }
                }
        }
    
                                                ///////////////GAME CHARACTER THE BEAR/////////////
    gameChar_y = max(gameChar_y, 300);
                                                                ////Movement Code////
    if(isLeft == true)
    {
        gameChar_x -=6;
    }                                           //Used If statements alongside Booleans to create Conditions, If these conditions are met                                                   then gamechar_x and gamechar_y are incremented/decremented. The Boolean state changes in                                                                            the keyPressed function below at line 613
    if(isRight == true)
    {
        gameChar_x +=6;
    }
    if(gameChar_y < groundPosY)                 //Added a Gravity effect by this condition, when bear's Y pos is lower than groundPosY when                                                     it jumps its automatically brought down by decrementing its Y value, same time is                                                       Plummeting is changed to True to prevent double Jump. As it is must for isPlummeting to                                                                                 be false for the character to jump 
    {
        var isContact = false;
        for(var i = 0; i < platforms.length; i++)
            {
                if(platforms[i].checkContact(gameChar_x,gameChar_y))
                    {
                        isContact = true;           //Checks if player comes in contact with a platform, if True next line breaks
                        break;
                    }
            }
        if(isContact == false)
            {
                isFalling = true;
                gameChar_y +=5;
                isPlummeting = true;
            }

    }
    else
    {
        isFalling = false;             //isPlummeting and isFalling is turned to false with else so the characters jumping                                                                                          face disappears when it hits the ground
        isPlummeting = false;
        
    }
    
    if(flagpole.isReached == false)            //Function call to check if character reached the flagpole, used conditional to ensure                                                                           function is only called when isReached is false
        {
             checkFlagpole();
        }
    

            checkPlayerDie();                   //Function call to check if character y pos greater than height, if so live is decremented
    
                                                        /////CHARACTER EMOTIONS ///////
    
	if(isLeft && isFalling)
	{
		// jumping-left code
//LEGS
    noStroke();
    fill(228,139,5);        //Legs Color
    ellipse(gameChar_x - 10,     //X coord left Leg
            gameChar_y - 20,    //y coord left leg
            10,             //width
            25);            //length
    
    ellipse(gameChar_x + 10,     //x coord right leg
            gameChar_y - 20,    //y coord right leg
            10,             //width
            25);            //length
     
    //torso
    fill(255,165,0);            //Outer Torso Color
    ellipse(gameChar_x,             //Outer Torso X
            gameChar_y - 32,             //Outer Torso Y
            40,                 //Outer Torso Width
            40);                //Outer Torso Length
    
    fill(255,228,181);          //Inner Torso Color
    strokeWeight(1);
    stroke(255,255,255);
    ellipse(gameChar_x - 5,             //Inner Torso X
            gameChar_y - 30,         //Inner Torso Y
            25,                 //Inner Torso Width 
            20);                //Inner Torso Length
   //Arm
    fill(228,139,5);
    ellipse(gameChar_x + 4 ,        //Right Arms X
            gameChar_y - 32,             //Right Arms Y
            10,                 //Right Arms Width
            25);                //Right Arms Length
   
    //head
    fill(255,165,0);            //Head Color
    strokeWeight(1);
    stroke(255,228,181);
    
    ellipse(gameChar_x,             //Head X
            gameChar_y - 50,        //Head Y
            47,                 //Head Width
            34);                //Head Length
   //Ear
    fill(228,139,5);        //Ear Color
    
    ellipse(gameChar_x + 4 ,        //Left Ear X
            gameChar_y - 57,        //Left Ear Y        
            9,                 //Left Ear Width
            12);                 //Left Ear Length
    //Eye
    noStroke();
    fill(0,0,0);                //Eyes Color
    arc(gameChar_x - 10,gameChar_y - 42,5,12, 0, PI + QUARTER_PI, CHORD);  // Smile
   
    ellipse(gameChar_x - 10,         //Right Eye X
            gameChar_y - 50,        //Right Eye Y
            6,                  //Right Eye Width
            5)                  //Right Eye Length


	}
	else if(isRight && isFalling)
	{
		// jumping-right code
//legs
    noStroke();
    fill(228,139,5);        //Legs Color
    ellipse(gameChar_x - 10,     //X coord left Leg
            gameChar_y - 20,    //y coord left leg
            10,             //width
            25);            //length
    
    ellipse(gameChar_x + 10,     //x coord right leg
            gameChar_y - 20,    //y coord right leg
            10,             //width
            25);            //length
     
    //torso
    fill(255,165,0);            //Outer Torso Color
    ellipse(gameChar_x,             //Outer Torso X
            gameChar_y - 32,             //Outer Torso Y
            40,                 //Outer Torso Width
            40);                //Outer Torso Length
    
    fill(255,228,181);          //Inner Torso Color
    strokeWeight(1);
    stroke(255,255,255);
    ellipse(gameChar_x + 5,             //Inner Torso X
            gameChar_y - 30,         //Inner Torso Y
            25,                 //Inner Torso Width 
            20);                //Inner Torso Length
   //Arm
    fill(228,139,5);
    ellipse(gameChar_x - 4 ,        //Right Arms X
            gameChar_y - 32,             //Right Arms Y
            10,                 //Right Arms Width
            25);                //Right Arms Length
   
    //head
    fill(255,165,0);            //Head Color
    strokeWeight(1);
    stroke(255,228,181);
    
    ellipse(gameChar_x,             //Head X
            gameChar_y - 50,        //Head Y
            47,                 //Head Width
            34);                //Head Length
   //Ear
    fill(228,139,5);        //Ear Color
    
    ellipse(gameChar_x - 4 ,        //Left Ear X
            gameChar_y - 57,        //Left Ear Y        
            9,                 //Left Ear Width
            12);                 //Left Ear Length
    //Eye
    noStroke();
    fill(0,0,0);                //Eyes Color
    arc(gameChar_x+10,gameChar_y - 42,5,12, 0, PI + QUARTER_PI, CHORD);  // Smile
   
    ellipse(gameChar_x + 10,         //Right Eye X
            gameChar_y - 50,        //Right Eye Y
            6,                  //Right Eye Width
            5)                  //Right Eye Length

	}
	else if(isLeft)
	{
		// walking left code
     //LEGS
        noStroke();
        fill(228,139,5);        //Legs Color
        ellipse(gameChar_x - 2,     //X coord left Leg
                gameChar_y - 20,    //y coord left leg
                10,             //width
                33);            //length

        ellipse(gameChar_x +2,     //x coord right leg
                gameChar_y - 20,    //y coord right leg
                10,             //width
                33);            //length

        //torso
        fill(255,165,0);            //Outer Torso Color
        ellipse(gameChar_x,             //Outer Torso X
                gameChar_y - 32,             //Outer Torso Y
                40,                 //Outer Torso Width
                40);                //Outer Torso Length

        fill(255,228,181);          //Inner Torso Color
        strokeWeight(1);
        stroke(255,255,255);
        ellipse(gameChar_x - 5,             //Inner Torso X
                gameChar_y - 30,         //Inner Torso Y
                25,                 //Inner Torso Width 
                20);                //Inner Torso Length
       //Arm
        fill(228,139,5);
        ellipse(gameChar_x ,        //Right Arms X
                gameChar_y - 32,             //Right Arms Y
                10,                 //Right Arms Width
                30);                //Right Arms Length

        //head
        fill(255,165,0);            //Head Color
        strokeWeight(1);
        stroke(255,228,181);

        ellipse(gameChar_x,             //Head X
                gameChar_y - 50,        //Head Y
                47,                 //Head Width
                34);                //Head Length
       //Ear
        fill(228,139,5);        //Ear Color

        ellipse(gameChar_x + 4 ,        //Left Ear X
                gameChar_y - 57,        //Left Ear Y        
                9,                 //Left Ear Width
                12);                 //Left Ear Length
        //Eye
        noStroke();
        fill(0,0,0);                //Eyes Color
        arc(gameChar_x - 10,gameChar_y - 42,12,12, 0, PI + QUARTER_PI, CHORD);  // Smile

        ellipse(gameChar_x - 10,         //Right Eye X
                gameChar_y - 50,        //Right Eye Y
                5,                  //Right Eye Width
                4)                  //Right Eye Length
	}
	else if(isRight)
	{
		// walking right code
        //legs
        noStroke();
        fill(228,139,5);        //Legs Color
        ellipse(gameChar_x - 2,     //X coord left Leg
                gameChar_y - 20,    //y coord left leg
                10,             //width
                33);            //length

        ellipse(gameChar_x +2,     //x coord right leg
                gameChar_y - 20,    //y coord right leg
                10,             //width
                33);            //length

        //torso
        fill(255,165,0);            //Outer Torso Color
        ellipse(gameChar_x,             //Outer Torso X
                gameChar_y - 32,             //Outer Torso Y
                40,                 //Outer Torso Width
                40);                //Outer Torso Length

        fill(255,228,181);          //Inner Torso Color
        strokeWeight(1);
        stroke(255,255,255);
        ellipse(gameChar_x + 5,             //Inner Torso X
                gameChar_y - 30,         //Inner Torso Y
                25,                 //Inner Torso Width 
                20);                //Inner Torso Length
       //Arm
        fill(228,139,5);
        ellipse(gameChar_x ,        //Right Arms X
                gameChar_y - 32,             //Right Arms Y
                10,                 //Right Arms Width
                30);                //Right Arms Length

        //head
        fill(255,165,0);            //Head Color
        strokeWeight(1);
        stroke(255,228,181);

        ellipse(gameChar_x,             //Head X
                gameChar_y - 50,        //Head Y
                47,                 //Head Width
                34);                //Head Length
       //Ear
        fill(228,139,5);        //Ear Color

        ellipse(gameChar_x - 4 ,        //Left Ear X
                gameChar_y - 57,        //Left Ear Y        
                9,                 //Left Ear Width
                12);                 //Left Ear Length
        //Eye
        noStroke();
        fill(0,0,0);                //Eyes Color
        arc(gameChar_x+10,gameChar_y - 42,12,12, 0, PI + QUARTER_PI, CHORD);  // Smile

        ellipse(gameChar_x + 10,         //Right Eye X
                gameChar_y - 50,        //Right Eye Y
                5,                  //Right Eye Width
                4)                  //Right Eye Length
	}
	else if(isFalling || isPlummeting)
	{
		// jumping facing forwards code
        //legs
    noStroke();
    fill(228,139,5);        //Legs Color
    ellipse(gameChar_x - 10,     //X coord left Leg
            gameChar_y - 25,    //y coord left leg
            10,             //width
            33);            //length
    
    ellipse(gameChar_x + 10,     //x coord right leg
            gameChar_y - 25,    //y coord right leg
            10,             //width
            33);            //length
    //arms
    fill(228,139,5);             //Arms Color
    ellipse(gameChar_x - 11,        //Lefts Arns X Coord
            gameChar_y - 35,             //Left Arms Y Coord
            30,                 //Left Arms Width
            10);                //Left Arns Length
   
    ellipse(gameChar_x + 11,        //Right Arms X
            gameChar_y - 35,             //Right Arms Y
            30,                 //Right Arms Width
            10);                //Right Arms Length
    
    //torso
    fill(255,165,0);            //Outer Torso Color
    ellipse(gameChar_x,             //Outer Torso X
            gameChar_y - 32,             //Outer Torso Y
            40,                 //Outer Torso Width
            40);                //Outer Torso Length
    
    fill(255,228,181);          //Inner Torso Color
    strokeWeight(1);
    stroke(255,255,255);
    ellipse(gameChar_x,             //Inner Torso X
            gameChar_y - 30,         //Inner Torso Y
            25,                 //Inner Torso Width 
            20);                //Inner Torso Length
     //ears
    fill(228,139,5);        //Ear Color
    
    ellipse(gameChar_x - 22,        //Left Ear X
            gameChar_y - 57,        //Left Ear Y        
            10,                 //Left Ear Width
            9);                 //Left Ear Length
    
    ellipse(gameChar_x + 22,        //Right Ear X          
            gameChar_y - 57,        //Right Ear Y
            10,                 //Right Ear Width
            9);                 //Right Ear Length
    //head
    fill(255,165,0);            //Head Color
    strokeWeight(1);
    stroke(255,228,181);
    
    ellipse(gameChar_x,             //Head X
            gameChar_y - 50,        //Head Y
            47,                 //Head Width
            34);                //Head Length
    //eyes
    noStroke();
    fill(0,0,0);                //Eyes Color
    arc(gameChar_x,gameChar_y - 42,5,12, 0, PI + QUARTER_PI, CHORD);  // Smile
    ellipse(gameChar_x - 6,         //Left Eye X
            gameChar_y - 50,        //Left Eye Y
            5,                  //Left Eye Width
            4);                 //Left Eye Length
   
    ellipse(gameChar_x + 6,         //Right Eye X
            gameChar_y - 50,        //Right Eye Y
            5,                  //Right Eye Width
            4)                  //Right Eye Length

	}
	else
	{
		// standing front facing code
        //legs
        noStroke();
        fill(228,139,5);        //Legs Color
        ellipse(gameChar_x - 7,     //X coord left Leg
                gameChar_y - 20,    //y coord left leg
                10,             //width
                33);            //length

        ellipse(gameChar_x + 7,     //x coord right leg
                gameChar_y - 20,    //y coord right leg
                10,             //width
                33);            //length
        //arms
        fill(228,139,5);             //Arms Color
        ellipse(gameChar_x - 11,        //Lefts Arns X Coord
                gameChar_y - 32,             //Left Arms Y Coord
                30,                 //Left Arms Width
                10);                //Left Arns Length

        ellipse(gameChar_x + 11,        //Right Arms X
                gameChar_y - 32,             //Right Arms Y
                30,                 //Right Arms Width
                10);                //Right Arms Length

        //torso
        fill(255,165,0);            //Outer Torso Color
        ellipse(gameChar_x,             //Outer Torso X
                gameChar_y - 32,             //Outer Torso Y
                40,                 //Outer Torso Width
                40);                //Outer Torso Length

        fill(255,228,181);          //Inner Torso Color
        strokeWeight(1);
        stroke(255,255,255);
        ellipse(gameChar_x,             //Inner Torso X
                gameChar_y - 30,         //Inner Torso Y
                25,                 //Inner Torso Width 
                20);                //Inner Torso Length
         //ears
        fill(228,139,5);        //Ear Color

        ellipse(gameChar_x - 22,        //Left Ear X
                gameChar_y - 57,        //Left Ear Y        
                10,                 //Left Ear Width
                9);                 //Left Ear Length

        ellipse(gameChar_x + 22,        //Right Ear X          
                gameChar_y - 57,        //Right Ear Y
                10,                 //Right Ear Width
                9);                 //Right Ear Length
        //head
        fill(255,165,0);            //Head Color
        strokeWeight(1);
        stroke(255,228,181);

        ellipse(gameChar_x,             //Head X
                gameChar_y - 50,        //Head Y
                47,                 //Head Width
                34);                //Head Length
        //eyes
        noStroke();
        fill(0,0,0);                //Eyes Color
        arc(gameChar_x,gameChar_y - 42,12,12, 0, PI + QUARTER_PI, CHORD);  // Smile
        ellipse(gameChar_x - 6,         //Left Eye X
                gameChar_y - 50,        //Left Eye Y
                5,                  //Left Eye Width
                4);                 //Left Eye Length

        ellipse(gameChar_x + 6,         //Right Eye X
                gameChar_y - 50,        //Right Eye Y
                5,                  //Right Eye Width
                4)                  //Right Eye Length
	}
    pop();

                                                ////SCORE COUNTER DISPLAY////
    fill(0,0,0);
    textSize(15);
    textStyle(BOLD);
    text("Score:" + game_score, 20,65);
    
                ////Lives counter using For with nested IFs


    text("Lives:", 20, 35)
    for(var i = 0; i < lives; i ++)
        {
            strokeWeight(1);
            stroke(1);
            fill(128,128,0);
            rect(92 + i * 40,15,3,10);
            fill(255,69,0);
            ellipse(90 + i * 40,30,20,17);
            ellipse(99 + i * 40,30,20,17);
        }

}


                                                    ////JUMP & MOVEMENT CODE////

function keyPressed(){
    console.log(keyCode);
    if(keyCode == 32 && isPlummeting == false)  //space bar    //isPlummeting must be false alongside space bar, because when the character                                                                 is in the air isPlummeting is true, so this conditio forces the character                                                                                      to only jump when its on the ground, 
                                                                                    //hence preventing double jump in the air
        {
        gameChar_y -= 150;
        jumpSound.play();
        }
    if(keyCode == 39)   //right arrow key           //When movement keys are pressed the Boolean values change from False to true, which are                                    used earlier in the code as conditions to increment/decrement gamechar_x,gamechar_y values
        {
            isRight = true;
        }
    if(keyCode == 37)  //left arrow key
        {
            isLeft = true;
        }

    }
function keyReleased(){                                 //When the keys are released the booleans are restored back to false, this causes the                                                                               character to stop moving when the key is released
    console.log(keyCode);

        if(keyCode == 39) //right arrow key
        {
            isRight = false;
        }
        if(keyCode == 37) //left arrow key
        {
            isLeft = false;
        }
}

function drawClouds()
{
    for(var i = 0; i < clouds_x.length; i++){    //For Loop used with Arrays to display multiple Clouds, used an Array for Y pos aswell so                                                                              they dont appear in straight line
    
    fill(255);
    ellipse(clouds_x[i],clouds_y[i],100,80);
    ellipse(clouds_x[i] - 60,clouds_y[i],80,50);
    ellipse(clouds_x[i] + 40,clouds_y[i],80,50);

    }
}
function drawMountains()
{
    for(var i=0; i<mountains_x.length; i++){            //For Loop used with Arrays to display multiple mountains
    fill(119,136,153);
    triangle(170 + mountains_x[i],432,470 + mountains_x[i],230,420 + mountains_x[i],432);
    fill(119,136,153,200);
    triangle(420 + mountains_x[i],432,470 + mountains_x[i],230,600 + mountains_x[i],432)
    triangle(650 + mountains_x[i],432,650 + mountains_x[i],160,900 + mountains_x[i],432);
    fill(119,136,153);
    triangle(650 + mountains_x[i],432,650 + mountains_x[i],160,450 + mountains_x[i],432)
    }

}
function drawTrees()
{
    for(var i = 0; i < trees_x.length; i++ ){           ////For Loop used with Arrays to display multiple trees
    
        fill(102,51,0);
        rect(trees_x[i],360,tree.size *30,75);
        ellipse(trees_x[i] + 15,433,30,20)
        fill(255,182,193);
        ellipse(trees_x[i],350,tree.size *150,tree.size *50);
        ellipse(trees_x[i] +20,320,tree.size *80,tree.size *50);
        fill(255,182,193);
        ellipse(trees_x[i] + 25,350,tree.size *120,tree.size *60);
        fill(102,51,0,100);                         //Used alpha value with an ellipse to create a shadow for the trees
        ellipse(trees_x[i] + 15, 444,70,30);
        }

    
}
function drawCollectable(t_collectable)
{
                                        //When Character is close isFound boolean becomes True hence disappearing the collectable
                                                    //When isFound is false the collectable is visible
   if (t_collectable.isFound == false)
        {
            strokeWeight(1);
            stroke(1);
            fill(128,128,0);
            rect(t_collectable.pos_X + 3,t_collectable.pos_Y - 14,t_collectable.size * 3,t_collectable.size * 10);
            fill(255,69,0);
            ellipse(t_collectable.pos_X,t_collectable.pos_Y,t_collectable.size * 20,t_collectable.size * 17);
            ellipse(t_collectable.pos_X + 9,t_collectable.pos_Y,t_collectable.size * 20,t_collectable.size * 17);

        }

}
function drawCanyon(t_canyon)
{
    fill(135,206,250);                          //Canyon drawing function
    rect(t_canyon.pos_X,431,t_canyon.width,150);
    fill(65,105,225);
    ellipse(t_canyon.pos_X + 29, 520,60, 24);
    ellipse(t_canyon.pos_X + 80, 520,60, 24);
    ellipse(t_canyon.pos_X + 131, 520,60, 24);
    rect(t_canyon.pos_X,520,t_canyon.width,70);
    
}
function checkCollectable(t_collectable)            //Function checks collectable distance between character
{
    if(dist(gameChar_x,gameChar_y,t_collectable.pos_X ,t_collectable.pos_Y) < 40)
    {
        t_collectable.isFound = true;                       //Used DIST to determine distance between character and collectable
        game_score += 1;
        eatSound.play();
    }       
}
function checkCanyon(t_canyon)                  //Functin checks distance between the character and the canyon
{
        if(gameChar_x > (t_canyon.pos_X + 25) && gameChar_x < (t_canyon.pos_X + t_canyon.width - 25) && gameChar_y > groundPosY)
        {
            isPlummeting = true;                           //Added 25 into Canyon's X Pos and Subtracted 25 from Width so the bear falls a                                                                                          bit off the edge 
                                                                //When the condition is met IsPlummeting becomes true Which is later used in a condition to 
                                                                        //freeze the character, by turning isRight and isLeft false.
            gameChar_y = height;
            ouchSound.play();
        }
    if(isPlummeting == true && gameChar_y == height){
        isRight = false;
        isLeft = false;
    }
}

function renderFlagpole()       //Function changes the state of the flagpole, If it is reached then the flag is raised if not its lowered
{
    push();
    strokeWeight(10);
    stroke(100);
    line(flagpole.x_pos,groundPosY,flagpole.x_pos, groundPosY - 200);
    pop();
    if(flagpole.isReached == true)          
        {
    fill(255,255,255);
    rect(flagpole.x_pos,groundPosY - 200, 50, 50);
    strokeWeight(1);
    stroke(1);
    fill(128,128,0);
    rect(flagpole.x_pos + 25,groundPosY - 185,3,10)
    fill(255,69,0);
    ellipse(flagpole.x_pos + 20,groundPosY - 170,20,17)
    ellipse(flagpole.x_pos + 30,groundPosY - 170,20,17)

        }
    else if(flagpole.isReached == false)
        {
    fill(255,255,255);
    rect(flagpole.x_pos,groundPosY - 50, 50, 50);
    fill(128,128,0);
    strokeWeight(1);
    stroke(1);
    rect(flagpole.x_pos + 25,groundPosY - 43,3,10)
    fill(255,69,0);
    ellipse(flagpole.x_pos + 20,groundPosY - 30,20,17)
    ellipse(flagpole.x_pos + 30,groundPosY - 30,20,17)
        }
}

function checkFlagpole()        //Function checks distance between character and flagpole to change value of isReached Boolean used in the                                                                          renderFlagpole function
{
    if(abs(dist(gameChar_x,gameChar_y,flagpole.x_pos,groundPosY) < 40))
        {
            flagpole.isReached = true;
            winSound.play();
            backgroundSound.stop();
        }
}

function checkPlayerDie()               //Checks if character has fallen down the canyon if so then decrements a live
{
    if (gameChar_y > height - 10)
    {
        lives -= 1;
        console.log("player dead");
        
        if (lives > 0)                  //If there ae still lives remaining a function call is made to the setup/startGame function which                                                                                 restarts the game
        {
            startGame();
        }
    }
}

function endGameSound()
{
    if(lives == 0 && isPlummeting == true)
        {
            backgroundSound.stop();             //Function checks live counter, when lives are 0 it stops the background music and plays the                                                                            Game Over sound
            gameOverSound.play();
            gameOverSound.noLoop();

        }
}
function createPlatforms(x,y,length)            //Platform Function
{
    var p ={
        x:x,
        y:y,
        length: length,
        draw: function()
        {
            strokeWeight(2);
            stroke(1);
            fill(173, 67, 12);
            rect(this.x,this.y - 10,this.length/2,30);
            fill(231, 90, 16);
            rect(this.x + this.length/2,this.y - 10,this.length/2,30);
            noStroke();
            
                    
            
        },
        checkContact : function(gc_x,gc_y)          //checks if game character comes close to the platforms 
        {
            if(gc_x > this.x && gc_x < this.x + this.length){
                
                var d = this.y - gc_y;
                if(d >= 0 && d < 5)
                    {
                        return true;
                    }
    }
                return false;
        }
    }
        return p;
}
function Enemy(x,y,range)               //Function renders and also controls functionality of the enemies
{
    this.x = x;
    this.y = y;
    this.range = range;
    
    this.currentX = x;
    this.inc = 1;
    
    this.update = function()                //This function controls the movement of the enemies 
    {
        this.currentX += this.inc;
        if(this.currentX >= this.x + this.range)        //if the enemy exeeds the range then this.inc decrements 
            {
                this.inc = -1;
            }
        else if(this.currentX < this.x)
            {
                this.inc = 1;
            }
    }
    this.draw = function()                  //draw code of the enemy/bee
    {
        if(this.inc == -1)
            {
        this.update();
        fill(107,71,1);
        triangle(this.currentX + 10, this.y + 2, this.currentX + 10, this.y - 2, this.currentX + 20,this.y); //stinger
        fill(249,201,1);
        ellipse(this.currentX,this.y,30,20); //body
        fill(152,91,16);
        rect(this.currentX - 2,this.y - 12,4,21);
        fill(255);
        ellipse(this.currentX - 2,this.y - 12,10,15); //wing
        ellipse(this.currentX + 4,this.y - 12,10,13);  //wing
        fill(0);
        ellipse(this.currentX - 8,this.y,4,4); //eye
            }
        
        else if(this.inc == 1)
            {
                this.update();
                fill(107,71,1);
                triangle(this.currentX - 10, this.y + 2, this.currentX - 10, this.y - 2, this.currentX - 20,this.y); //stinger
                fill(249,201,1);
                ellipse(this.currentX,this.y,30,20); //body
                fill(152,91,16);
                rect(this.currentX - 2,this.y - 12,4,21);
                fill(255);
                ellipse(this.currentX + 2,this.y - 12,10,15); //wing
                ellipse(this.currentX - 4,this.y - 12,10,13);  //wing
                fill(0);
                ellipse(this.currentX + 8,this.y,4,4); //eye
            }

    }
    this.checkContact = function(gc_x,gc_y)         //similar to the platform check function, this function checks distance between character                                                                                       and enemy
    {
        var d = dist(gc_x,gc_y,this.currentX,this.y);
        if(d < 30)
            {
                return true;
            }
        return false;
    }
}
function startGame()            //Function with all the variable initialiations created to restart game after character dies
{
    tree = {pos_X: 850, size: 1.0};
    cloud = {pos_X: 200, pos_Y: 130, color:90};
    flagpole = {isReached : false, x_pos: 3500};
    
    trees_x = [350,850,1200,1700,2300,2700,3500];
    clouds_x = [0,200,600,900,1300,1700,2200,2900,3500];
    clouds_y = [130, 170, 150,130, 170, 150,170,130];
    mountains_x = [0,1000,2000];
    
    collectables = [{pos_X: 550, pos_Y: 300, size: 1.0, isFound : false},{pos_X: 750, pos_Y: 410, size: 1.0, isFound : false},{pos_X: 1200, pos_Y: 410, size: 1.0, isFound : false},{pos_X: 1560, pos_Y: 300, size: 1.0, isFound : false},{pos_X: 2100, pos_Y: 300, size: 1.0, isFound : false},{pos_X: 2000, pos_Y: 300, size: 1.0, isFound : false},{pos_X: 2400, pos_Y: 410, size: 1.0, isFound : false},{pos_X: 2900, pos_Y: 410, size: 1.0, isFound : false},{pos_X: 3100, pos_Y: 300, size: 1.0, isFound : false}];
    
    canyons = [{pos_X: 10, width: 160},{pos_X: 1000, width: 160},{pos_X: 1900, width: 270},{pos_X: 3000, width: 360}]
    
    platforms = [];
    platforms.push(createPlatforms(500,groundPosY - 100,150));
    platforms.push(createPlatforms(1500,groundPosY - 100,150));
    platforms.push(createPlatforms(1920,groundPosY - 100,250));
    platforms.push(createPlatforms(3293,groundPosY - 20,40));
    platforms.push(createPlatforms(3000,groundPosY - 100,200));
    
    cameraPosX = 0;
   
    gameChar_x = 300;
    gameChar_y = 440;
    game_score = 0;
    isPlummeting = false;
    isLeft = false;
    isRight = false;
    isFalling = false;
    isStuck = false;
    isJumping = false;
    
    enemies = [];
    enemies.push(new Enemy(700,groundPosY - 20,300));
    enemies.push(new Enemy(1600,groundPosY - 20,300));
    enemies.push(new Enemy(2200,groundPosY - 20,100));
    enemies.push(new Enemy(2500,groundPosY - 20,300));
}