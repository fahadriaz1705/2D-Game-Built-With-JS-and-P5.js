# Jolly the Bear

## Overview
Jolly the Bear is a 2D platformer game I developed using JavaScript and the p5.js library, which simplifies drawing graphics and handling animations. The game features a player-controlled character, Jolly the Bear, who navigates through a vibrant environment, collecting cherries while avoiding bees and their stingers.

## Technical Details
- **p5.js:** This library is utilized for rendering graphics, handling user input, and managing game loops. Key methods from p5.js include:
  - `createCanvas()`: Sets up the game canvas for rendering.
  - `draw()`: Continuously updates the game frame.
  - `loadSound()`: Preloads sound assets for use in the game.
  - `ellipse()`, `rect()`, `arc()`: Used for drawing the game character and environment elements.

## Game Mechanics
- **Character Movement:** Jolly's movements are controlled using keyboard events, specifically the left and right arrow keys for horizontal movement and the space bar for jumping.
- **Collision Detection:** The game checks for collisions between Jolly and various objects (like cherries and bees) to determine game events such as collecting items or losing lives.
- **Sound Effects:** Multiple sound effects are integrated, enhancing gameplay dynamics through audio feedback. Sounds are triggered based on player actions such as jumping and collecting cherries.
- **Game Objectives:** Players must feed Jolly by collecting cherries while avoiding bees. The game ends when Jolly either reaches the flagpole or runs out of lives.
