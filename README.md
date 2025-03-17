# Threes Game

A simple implementation of the popular Threes sliding tile puzzle game using HTML, CSS, and JavaScript.

## How to Play

1. Open `index.html` in your web browser.
2. Use the arrow keys (or swipe on mobile) to move all tiles in one direction.
3. When a 1 and a 2 tile collide, they combine to form a 3.
4. When two matching tiles of 3 or higher collide, they combine to form a tile with double the value.
5. After each move, a new tile (1, 2, or 3) appears on the board.
6. The game ends when the board is full and no more moves are possible.
7. Try to reach the highest score possible!

## Game Rules

- Tiles can only be combined in specific ways:
  - 1 + 2 = 3
  - 3 + 3 = 6
  - 6 + 6 = 12
  - And so on...
- The score increases by the value of each new tile created from a combination.
- The game is over when the board is full and no more moves are possible.

## Controls

- **Desktop**: Use the arrow keys (Up, Down, Left, Right) to move tiles.
- **Mobile**: Swipe in the desired direction to move tiles.
- Click the "Try again" button to restart the game when it's over.

## Features

- Responsive design that works on both desktop and mobile devices.
- Smooth animations for tile movements.
- Score tracking.
- Game over detection.

Enjoy the game! 