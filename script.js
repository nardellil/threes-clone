document.addEventListener('DOMContentLoaded', () => {
    // Game constants
    const GRID_SIZE = 4;
    const CELL_SIZE = 106.25;
    const CELL_GAP = 15;
    const GRID_PADDING = 15;

    // Game variables
    let grid = [];
    let score = 0;
    let gameOver = false;
    let nextTile = null;
    let mergedTiles = []; // Array per tenere traccia dei tile che sono stati fusi
    let movedTiles = []; // Array per tenere traccia dei tile che sono stati spostati

    // DOM elements
    const gameContainer = document.querySelector('.game-container');
    const tileContainer = document.querySelector('.tile-container');
    const scoreElement = document.getElementById('score');
    const gameMessage = document.querySelector('.game-message');
    const retryButton = document.querySelector('.retry-button');

    // Initialize the game
    function initGame() {
        grid = createGrid();
        score = 0;
        gameOver = false;
        scoreElement.textContent = score;
        
        // Clear the tile container
        tileContainer.innerHTML = '';
        
        // Hide game over message
        gameMessage.classList.remove('game-over');
        gameMessage.querySelector('p').textContent = '';
        
        // Add initial tiles
        addRandomTile();
        addRandomTile();
        
        // Generate the next tile
        generateNextTile();
    }

    // Create an empty grid
    function createGrid() {
        const grid = [];
        for (let i = 0; i < GRID_SIZE; i++) {
            const row = [];
            for (let j = 0; j < GRID_SIZE; j++) {
                row.push(null);
            }
            grid.push(row);
        }
        return grid;
    }

    // Create a tile element
    function createTileElement(row, col, value, isNew = false, isMerged = false) {
        const tile = document.createElement('div');
        tile.classList.add('tile', `tile-${value}`);
        
        // Aggiungi classi per le animazioni
        if (isNew) {
            tile.classList.add('tile-new');
        }
        if (isMerged) {
            tile.classList.add('tile-merged');
        }
        
        tile.textContent = value;
        
        // Imposta la posizione usando le variabili CSS per grid
        tile.style.setProperty('--grid-row', row + 1);
        tile.style.setProperty('--grid-column', col + 1);
        
        tileContainer.appendChild(tile);
        return tile;
    }

    // Add a random tile to the grid
    function addRandomTile() {
        const emptyCells = [];
        
        // Find all empty cells
        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                if (grid[i][j] === null) {
                    emptyCells.push({ row: i, col: j });
                }
            }
        }
        
        // If there are no empty cells, return
        if (emptyCells.length === 0) return;
        
        // Choose a random empty cell
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        
        // Determine the value of the new tile (1 or 2)
        const value = Math.random() < 0.5 ? 1 : 2;
        
        // Add the tile to the grid
        grid[randomCell.row][randomCell.col] = value;
        
        // Create the tile element with the "new" animation
        createTileElement(randomCell.row, randomCell.col, value, true);
    }

    // Generate the next tile (1, 2, or 3)
    function generateNextTile() {
        const values = [1, 2, 3];
        nextTile = values[Math.floor(Math.random() * values.length)];
    }

    // Update the grid and UI after a move
    function updateGrid() {
        // Clear the tile container
        tileContainer.innerHTML = '';
        
        // Create tile elements for each cell
        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                if (grid[i][j] !== null) {
                    // Check if this tile was merged in the last move
                    const isMerged = mergedTiles.some(tile => 
                        tile.row === i && tile.col === j
                    );
                    
                    // Check if this tile was moved in the last move
                    const isMoved = movedTiles.some(tile => 
                        tile.row === i && tile.col === j
                    );
                    
                    const tile = createTileElement(i, j, grid[i][j], false, isMerged);
                    
                    if (isMoved && !isMerged) {
                        tile.classList.add('tile-moved');
                    }
                }
            }
        }
        
        // Reset merged and moved tiles arrays
        mergedTiles = [];
        movedTiles = [];
        
        // Update the score
        scoreElement.textContent = score;
        
        // Check if the game is over
        if (isGameOver()) {
            gameOver = true;
            gameMessage.classList.add('game-over');
            gameMessage.querySelector('p').textContent = 'Game Over!';
        }
    }

    // Check if the game is over
    function isGameOver() {
        // Check if there are any empty cells
        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                if (grid[i][j] === null) {
                    return false;
                }
            }
        }
        
        // Check if there are any possible moves
        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE - 1; j++) {
                // Check horizontal moves
                if (canCombine(grid[i][j], grid[i][j + 1])) {
                    return false;
                }
            }
        }
        
        for (let i = 0; i < GRID_SIZE - 1; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                // Check vertical moves
                if (canCombine(grid[i][j], grid[i + 1][j])) {
                    return false;
                }
            }
        }
        
        return true;
    }

    // Check if two tiles can be combined
    function canCombine(a, b) {
        if (a === null || b === null) return false;
        
        // 1 and 2 can combine to make 3
        if ((a === 1 && b === 2) || (a === 2 && b === 1)) {
            return true;
        }
        
        // Same values of 3 or higher can combine
        if (a >= 3 && b >= 3 && a === b) {
            return true;
        }
        
        return false;
    }

    // Combine two tiles
    function combineTiles(value1, value2, row, col) {
        if ((value1 === 1 && value2 === 2) || (value1 === 2 && value2 === 1)) {
            // Aggiungi il tile alla lista dei tile fusi
            mergedTiles.push({ row, col });
            return 3;
        }
        
        if (value1 >= 3 && value2 >= 3 && value1 === value2) {
            // Aggiungi il tile alla lista dei tile fusi
            mergedTiles.push({ row, col });
            return value1 * 2;
        }
        
        return null;
    }

    // Move tiles in a direction
    function moveTiles(direction) {
        if (gameOver) return false;
        
        let moved = false;
        
        switch (direction) {
            case 'up':
                moved = moveUp();
                break;
            case 'right':
                moved = moveRight();
                break;
            case 'down':
                moved = moveDown();
                break;
            case 'left':
                moved = moveLeft();
                break;
        }
        
        if (moved) {
            // Aggiorna la griglia con un leggero ritardo per permettere alle animazioni di essere visibili
            updateGrid();
            
            // Aggiungi un nuovo tile dopo un breve ritardo
            setTimeout(() => {
                addRandomTile();
                generateNextTile();
            }, 150);
        }
        
        return moved;
    }

    // Mostra l'animazione dell'aumento del punteggio
    function showScoreAddition(value) {
        const addition = document.createElement('div');
        addition.classList.add('score-addition');
        addition.textContent = '+' + value;
        
        scoreElement.parentNode.appendChild(addition);
        
        // Rimuovi l'elemento dopo l'animazione
        setTimeout(() => {
            addition.remove();
        }, 800);
    }

    // Move tiles up
    function moveUp() {
        let moved = false;
        let scoreAdded = 0;
        
        for (let j = 0; j < GRID_SIZE; j++) {
            for (let i = 1; i < GRID_SIZE; i++) {
                if (grid[i][j] !== null) {
                    // Limita lo spostamento a una sola posizione
                    let row = i;
                    let newRow = row - 1;
                    
                    // Se la cella sopra è vuota, sposta
                    if (grid[newRow][j] === null) {
                        grid[newRow][j] = grid[row][j];
                        grid[row][j] = null;
                        // Aggiungi alla lista dei tile mossi
                        movedTiles.push({ row: newRow, col: j });
                        moved = true;
                    } 
                    // Se le celle possono essere combinate, combinale
                    else if (canCombine(grid[row][j], grid[newRow][j])) {
                        const newValue = combineTiles(grid[row][j], grid[newRow][j], newRow, j);
                        grid[newRow][j] = newValue;
                        grid[row][j] = null;
                        score += newValue;
                        scoreAdded += newValue;
                        moved = true;
                    }
                }
            }
        }
        
        if (scoreAdded > 0) {
            showScoreAddition(scoreAdded);
        }
        
        return moved;
    }

    // Move tiles right
    function moveRight() {
        let moved = false;
        let scoreAdded = 0;
        
        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = GRID_SIZE - 2; j >= 0; j--) {
                if (grid[i][j] !== null) {
                    // Limita lo spostamento a una sola posizione
                    let col = j;
                    let newCol = col + 1;
                    
                    // Se la cella a destra è vuota, sposta
                    if (grid[i][newCol] === null) {
                        grid[i][newCol] = grid[i][col];
                        grid[i][col] = null;
                        // Aggiungi alla lista dei tile mossi
                        movedTiles.push({ row: i, col: newCol });
                        moved = true;
                    } 
                    // Se le celle possono essere combinate, combinale
                    else if (canCombine(grid[i][col], grid[i][newCol])) {
                        const newValue = combineTiles(grid[i][col], grid[i][newCol], i, newCol);
                        grid[i][newCol] = newValue;
                        grid[i][col] = null;
                        score += newValue;
                        scoreAdded += newValue;
                        moved = true;
                    }
                }
            }
        }
        
        if (scoreAdded > 0) {
            showScoreAddition(scoreAdded);
        }
        
        return moved;
    }

    // Move tiles down
    function moveDown() {
        let moved = false;
        let scoreAdded = 0;
        
        for (let j = 0; j < GRID_SIZE; j++) {
            for (let i = GRID_SIZE - 2; i >= 0; i--) {
                if (grid[i][j] !== null) {
                    // Limita lo spostamento a una sola posizione
                    let row = i;
                    let newRow = row + 1;
                    
                    // Se la cella sotto è vuota, sposta
                    if (grid[newRow][j] === null) {
                        grid[newRow][j] = grid[row][j];
                        grid[row][j] = null;
                        // Aggiungi alla lista dei tile mossi
                        movedTiles.push({ row: newRow, col: j });
                        moved = true;
                    } 
                    // Se le celle possono essere combinate, combinale
                    else if (canCombine(grid[row][j], grid[newRow][j])) {
                        const newValue = combineTiles(grid[row][j], grid[newRow][j], newRow, j);
                        grid[newRow][j] = newValue;
                        grid[row][j] = null;
                        score += newValue;
                        scoreAdded += newValue;
                        moved = true;
                    }
                }
            }
        }
        
        if (scoreAdded > 0) {
            showScoreAddition(scoreAdded);
        }
        
        return moved;
    }

    // Move tiles left
    function moveLeft() {
        let moved = false;
        let scoreAdded = 0;
        
        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 1; j < GRID_SIZE; j++) {
                if (grid[i][j] !== null) {
                    // Limita lo spostamento a una sola posizione
                    let col = j;
                    let newCol = col - 1;
                    
                    // Se la cella a sinistra è vuota, sposta
                    if (grid[i][newCol] === null) {
                        grid[i][newCol] = grid[i][col];
                        grid[i][col] = null;
                        // Aggiungi alla lista dei tile mossi
                        movedTiles.push({ row: i, col: newCol });
                        moved = true;
                    } 
                    // Se le celle possono essere combinate, combinale
                    else if (canCombine(grid[i][col], grid[i][newCol])) {
                        const newValue = combineTiles(grid[i][col], grid[i][newCol], i, newCol);
                        grid[i][newCol] = newValue;
                        grid[i][col] = null;
                        score += newValue;
                        scoreAdded += newValue;
                        moved = true;
                    }
                }
            }
        }
        
        if (scoreAdded > 0) {
            showScoreAddition(scoreAdded);
        }
        
        return moved;
    }

    // Handle keyboard events
    function handleKeyDown(event) {
        if (gameOver) return;
        
        switch (event.key) {
            case 'ArrowUp':
                event.preventDefault();
                moveTiles('up');
                break;
            case 'ArrowRight':
                event.preventDefault();
                moveTiles('right');
                break;
            case 'ArrowDown':
                event.preventDefault();
                moveTiles('down');
                break;
            case 'ArrowLeft':
                event.preventDefault();
                moveTiles('left');
                break;
        }
    }

    // Handle touch events for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    function handleTouchStart(event) {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    }

    function handleTouchMove(event) {
        event.preventDefault();
    }

    function handleTouchEnd(event) {
        if (gameOver) return;
        
        touchEndX = event.changedTouches[0].clientX;
        touchEndY = event.changedTouches[0].clientY;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // Determine the direction of the swipe
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (deltaX > 20) {
                moveTiles('right');
            } else if (deltaX < -20) {
                moveTiles('left');
            }
        } else {
            // Vertical swipe
            if (deltaY > 20) {
                moveTiles('down');
            } else if (deltaY < -20) {
                moveTiles('up');
            }
        }
    }

    // Event listeners
    document.addEventListener('keydown', handleKeyDown);
    gameContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
    gameContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
    gameContainer.addEventListener('touchend', handleTouchEnd);
    retryButton.addEventListener('click', initGame);

    // Start the game
    initGame();
}); 