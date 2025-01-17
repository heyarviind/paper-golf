/*
  config:

   container 6x6 px
    width = 16 containers
    height = 36 containers
*/

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions based on container size and count
const CONTAINER_SIZE = 24; // 6px x 6px containers
const CONTAINER_WIDTH_COUNT = 16;
const CONTAINER_HEIGHT_COUNT = 26;

// Calculate total canvas dimensions
canvas.width = CONTAINER_SIZE * CONTAINER_WIDTH_COUNT; // 96px
canvas.height = CONTAINER_SIZE * CONTAINER_HEIGHT_COUNT; // 216px

// Create and load tree image
const treeImage = new Image();
treeImage.src = "icons/tree.svg";

// Add after canvas dimensions setup and before image loading
const POND = {
  x: Math.floor(Math.random() * (CONTAINER_WIDTH_COUNT - 14)), // Random start X
  y: Math.floor(Math.random() * (CONTAINER_HEIGHT_COUNT - 14)), // Random start Y
  width: Math.floor(Math.random() * 9) + 6, // Random width between 6-14
  height: 0, // Will be set to ensure different from width
};

// Ensure height is different from width
do {
  POND.height = Math.floor(Math.random() * 9) + 6; // Random height between 6-14
} while (POND.height === POND.width);

// Add after POND initialization
const pondShape = generatePondShape();

// Add after other initializations but before any functions
let treePositions = new Set(); // Store tree positions

// Add after pondShape initialization
function isValidGolfPosition(x, y) {
  // Check if position is inside pond
  if (isInsidePond(x, y)) {
    return false;
  }

  // Check if position has a tree
  if (treePositions.has(`${x},${y}`)) {
    return false;
  }

  return true;
}

// Modify GOLF initialization to use valid positions
const GOLF = {
  // Starting point (black ball)
  ball: {
    x: 0,
    y: 0,
    size: CONTAINER_SIZE * 0.8,
  },
  // Ending point (hole)
  hole: {
    x: 0,
    y: 0,
    size: CONTAINER_SIZE * 0.9,
  },
};

// Find valid position for ball
do {
  GOLF.ball.x = Math.floor(Math.random() * (CONTAINER_WIDTH_COUNT - 4));
  GOLF.ball.y = Math.floor(Math.random() * (CONTAINER_HEIGHT_COUNT - 4));
} while (!isValidGolfPosition(GOLF.ball.x, GOLF.ball.y));

// Find valid position for hole
do {
  GOLF.hole.x = Math.floor(Math.random() * (CONTAINER_WIDTH_COUNT - 4));
  GOLF.hole.y = Math.floor(Math.random() * (CONTAINER_HEIGHT_COUNT - 4));
} while (
  !isValidGolfPosition(GOLF.hole.x, GOLF.hole.y) || // Check for pond and trees
  Math.abs(GOLF.ball.x - GOLF.hole.x) < 5 || // Check distance from ball
  Math.abs(GOLF.ball.y - GOLF.hole.y) < 5
);

// Function to check if a position is inside the pond
function isInsidePond(x, y) {
  const localX = x - POND.x;
  const localY = y - POND.y;
  return (
    localX >= 0 &&
    localX < POND.width &&
    localY >= 0 &&
    localY < POND.height &&
    pondShape[localY][localX]
  );
}

// Wait for image to load before drawing
treeImage.onload = () => {
  drawContainers();
  addRandomTrees();
  drawGolfElements();
};

// Function to draw containers with gray dots
function drawContainers() {
  // First draw all dots
  for (let y = 0; y < CONTAINER_HEIGHT_COUNT; y++) {
    for (let x = 0; x < CONTAINER_WIDTH_COUNT; x++) {
      const posX = x * CONTAINER_SIZE;
      const posY = y * CONTAINER_SIZE;

      // Draw dot in center of container
      ctx.beginPath();
      ctx.fillStyle = "#808080";
      ctx.arc(
        posX + CONTAINER_SIZE / 2,
        posY + CONTAINER_SIZE / 2,
        1,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }

  // Then draw pond tiles with rounded corners
  ctx.fillStyle = "#90f0ff";

  for (let y = 0; y < POND.height; y++) {
    for (let x = 0; x < POND.width; x++) {
      if (!pondShape[y][x]) continue;

      const posX = (POND.x + x) * CONTAINER_SIZE;
      const posY = (POND.y + y) * CONTAINER_SIZE;

      ctx.beginPath();
      const radius = 8; // Smaller radius for individual tiles

      // Check adjacent tiles to determine which corners to round
      const hasTop = y > 0 && pondShape[y - 1][x];
      const hasBottom = y < POND.height - 1 && pondShape[y + 1][x];
      const hasLeft = x > 0 && pondShape[y][x - 1];
      const hasRight = x < POND.width - 1 && pondShape[y][x + 1];

      // Draw tile with appropriate rounded corners
      ctx.moveTo(posX + radius, posY);

      // Top right
      if (!hasTop && !hasRight) {
        ctx.lineTo(posX + CONTAINER_SIZE - radius, posY);
        ctx.arcTo(
          posX + CONTAINER_SIZE,
          posY,
          posX + CONTAINER_SIZE,
          posY + radius,
          radius
        );
      } else {
        ctx.lineTo(posX + CONTAINER_SIZE, posY);
      }

      // Bottom right
      if (!hasBottom && !hasRight) {
        ctx.lineTo(posX + CONTAINER_SIZE, posY + CONTAINER_SIZE - radius);
        ctx.arcTo(
          posX + CONTAINER_SIZE,
          posY + CONTAINER_SIZE,
          posX + CONTAINER_SIZE - radius,
          posY + CONTAINER_SIZE,
          radius
        );
      } else {
        ctx.lineTo(posX + CONTAINER_SIZE, posY + CONTAINER_SIZE);
      }

      // Bottom left
      if (!hasBottom && !hasLeft) {
        ctx.lineTo(posX + radius, posY + CONTAINER_SIZE);
        ctx.arcTo(
          posX,
          posY + CONTAINER_SIZE,
          posX,
          posY + CONTAINER_SIZE - radius,
          radius
        );
      } else {
        ctx.lineTo(posX, posY + CONTAINER_SIZE);
      }

      // Top left
      if (!hasTop && !hasLeft) {
        ctx.lineTo(posX, posY + radius);
        ctx.arcTo(posX, posY, posX + radius, posY, radius);
      } else {
        ctx.lineTo(posX, posY);
      }

      ctx.closePath();
      ctx.fill();
    }
  }
}

// Modify addRandomTrees to store positions
function addRandomTrees() {
  const TREE_PROBABILITY = 0.1;

  // Only generate trees once
  if (treePositions.size === 0) {
    for (let y = 0; y < CONTAINER_HEIGHT_COUNT; y++) {
      for (let x = 0; x < CONTAINER_WIDTH_COUNT; x++) {
        // Skip if position is inside pond
        if (isInsidePond(x, y)) continue;

        if (Math.random() < TREE_PROBABILITY) {
          treePositions.add(`${x},${y}`);
        }
      }
    }
  }

  // Draw trees from stored positions
  for (const pos of treePositions) {
    const [x, y] = pos.split(",").map(Number);
    const posX = x * CONTAINER_SIZE;
    const posY = y * CONTAINER_SIZE;

    // Draw tree slightly smaller than container
    const treeSize = CONTAINER_SIZE * 0.9;
    const offsetX = (CONTAINER_SIZE - treeSize) / 2;
    const offsetY = (CONTAINER_SIZE - treeSize) / 2;

    ctx.drawImage(
      treeImage,
      posX + offsetX,
      posY + offsetY,
      treeSize,
      treeSize
    );
  }
}

// Add after POND definition
function generatePondShape() {
  const pondMap = Array(POND.height)
    .fill()
    .map(() => Array(POND.width).fill(false));
  const centerX = Math.floor(POND.width / 2);
  const centerY = Math.floor(POND.height / 2);

  // Generate main pond shape
  for (let y = 0; y < POND.height; y++) {
    for (let x = 0; x < POND.width; x++) {
      // Distance from center
      const dx = (x - centerX) / POND.width;
      const dy = (y - centerY) / POND.height;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Random noise factor
      const noise = Math.random() * 0.3;

      // Create irregular shape with some randomness
      if (distance + noise < 0.5) {
        pondMap[y][x] = true;
      }
    }
  }

  // Possibly add a connected secondary pond
  if (Math.random() < 0.5) {
    // 50% chance for second pond
    const secondaryX = centerX + (Math.random() > 0.5 ? 2 : -2); // Offset from main pond
    const secondaryY = centerY + (Math.random() > 0.5 ? 2 : -2);

    // Create connecting path and secondary pond
    for (let y = 0; y < POND.height; y++) {
      for (let x = 0; x < POND.width; x++) {
        // Distance from secondary center
        const dx = (x - secondaryX) / (POND.width * 0.7); // Smaller radius
        const dy = (y - secondaryY) / (POND.height * 0.7);
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Random noise factor
        const noise = Math.random() * 0.2;

        // Add to existing pond
        if (distance + noise < 0.4) {
          pondMap[y][x] = true;
        }
      }
    }

    // Ensure connection between ponds
    const pathX = Math.min(centerX, secondaryX);
    const pathWidth = Math.abs(centerX - secondaryX);
    const pathY = Math.min(centerY, secondaryY);
    const pathHeight = Math.abs(centerY - secondaryY);

    for (let y = pathY; y <= pathY + pathHeight; y++) {
      for (let x = pathX; x <= pathX + pathWidth; x++) {
        if (y >= 0 && y < POND.height && x >= 0 && x < POND.width) {
          pondMap[y][x] = true;
        }
      }
    }
  }

  // Add some natural variation to edges
  for (let y = 1; y < POND.height - 1; y++) {
    for (let x = 1; x < POND.width - 1; x++) {
      if (pondMap[y][x]) {
        // Randomly smooth or roughen edges
        if (Math.random() < 0.1) {
          const neighbors = [
            pondMap[y - 1][x],
            pondMap[y + 1][x],
            pondMap[y][x - 1],
            pondMap[y][x + 1],
          ];
          const waterNeighbors = neighbors.filter((n) => n).length;
          if (waterNeighbors <= 1) {
            pondMap[y][x] = false;
          }
        }
      }
    }
  }

  return pondMap;
}

// Add function to draw golf elements
function drawGolfElements() {
  // Draw hole (hollow circle)
  const holeX = GOLF.hole.x * CONTAINER_SIZE + CONTAINER_SIZE / 2;
  const holeY = GOLF.hole.y * CONTAINER_SIZE + CONTAINER_SIZE / 2;

  ctx.beginPath();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 3;
  ctx.arc(holeX, holeY, GOLF.hole.size / 2, 0, Math.PI * 2);
  ctx.stroke();

  // Draw inner shadow for hole
  ctx.beginPath();
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.arc(holeX, holeY, GOLF.hole.size / 2 - 2, 0, Math.PI * 2);
  ctx.fill();

  // Draw ball (filled black circle)
  ctx.beginPath();
  ctx.fillStyle = "#000000";
  ctx.arc(
    GOLF.ball.x * CONTAINER_SIZE + CONTAINER_SIZE / 2,
    GOLF.ball.y * CONTAINER_SIZE + CONTAINER_SIZE / 2,
    GOLF.ball.size / 2,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

// Add after other initializations
const diceButton = document.getElementById("diceButton");
const diceResult = document.getElementById("diceResult");
let currentDiceValue = 0;
let movesRemaining = 0;
let highlightedPositions = new Set(); // Store possible move positions
let moveHistory = []; // Store all previous moves

// Function to highlight possible moves
function highlightPossibleMoves() {
  const diceValue = currentDiceValue;
  highlightedPositions.clear();

  // Define all 8 possible directions
  const directions = [
    { dx: 1, dy: 0 }, // right
    { dx: -1, dy: 0 }, // left
    { dx: 0, dy: 1 }, // down
    { dx: 0, dy: -1 }, // up
    { dx: 1, dy: 1 }, // diagonal down-right
    { dx: 1, dy: -1 }, // diagonal up-right
    { dx: -1, dy: 1 }, // diagonal down-left
    { dx: -1, dy: -1 }, // diagonal up-left
  ];

  // Try each direction
  for (const { dx, dy } of directions) {
    // For diagonal moves, we need to move the same number in both x and y
    const stepMultiplier =
      Math.abs(dx) + Math.abs(dy) === 2 ? diceValue : diceValue;

    // Calculate final position using full dice value
    const finalX = GOLF.ball.x + dx * stepMultiplier;
    const finalY = GOLF.ball.y + dy * stepMultiplier;

    // Check if position is valid
    if (
      finalX >= 0 &&
      finalX < CONTAINER_WIDTH_COUNT &&
      finalY >= 0 &&
      finalY < CONTAINER_HEIGHT_COUNT &&
      isValidGolfPosition(finalX, finalY)
    ) {
      // Check if path is clear
      let pathIsClear = true;
      for (let step = 1; step < stepMultiplier; step++) {
        const checkX = GOLF.ball.x + dx * step;
        const checkY = GOLF.ball.y + dy * step;
        if (!isValidGolfPosition(checkX, checkY)) {
          pathIsClear = false;
          break;
        }
      }

      if (pathIsClear) {
        highlightedPositions.add(`${finalX},${finalY}`);
      }
    }
  }

  // Redraw with highlights
  drawContainers();
  addRandomTrees();
  // Add highlights
  ctx.fillStyle = "rgba(255, 255, 0, 0.3)"; // Semi-transparent yellow
  for (const pos of highlightedPositions) {
    const [x, y] = pos.split(",").map(Number);
    ctx.fillRect(
      x * CONTAINER_SIZE,
      y * CONTAINER_SIZE,
      CONTAINER_SIZE,
      CONTAINER_SIZE
    );
  }
  drawGolfElements();
}

// Modify dice roll handler
diceButton.addEventListener("click", () => {
  diceButton.disabled = true;
  highlightedPositions.clear(); // Clear old highlights

  let rolls = 0;
  const maxRolls = 10;
  const rollInterval = setInterval(() => {
    const rollValue = Math.floor(Math.random() * 6) + 1;
    diceResult.textContent = rollValue;
    rolls++;

    if (rolls >= maxRolls) {
      clearInterval(rollInterval);
      diceButton.disabled = false;
      currentDiceValue = rollValue;
      movesRemaining = rollValue;
      document.getElementById("movesLeft").textContent = movesRemaining;
      highlightPossibleMoves(); // Add highlights after roll
    }
  }, 100);
});

// Add after other initializations
const golfHitSound = new Audio("sounds/golf-hit.mp3");

// Modify the click handler where movement starts
canvas.addEventListener("click", (event) => {
  if (movesRemaining <= 0) return;

  const rect = canvas.getBoundingClientRect();
  const clickX = Math.floor((event.clientX - rect.left) / CONTAINER_SIZE);
  const clickY = Math.floor((event.clientY - rect.top) / CONTAINER_SIZE);

  // Check if clicked position is highlighted
  if (highlightedPositions.has(`${clickX},${clickY}`)) {
    // Play golf hit sound
    golfHitSound.currentTime = 0; // Reset sound to start
    golfHitSound
      .play()
      .catch((error) => console.log("Error playing sound:", error));

    // Store initial position for line drawing
    const startX = GOLF.ball.x * CONTAINER_SIZE + CONTAINER_SIZE / 2;
    const startY = GOLF.ball.y * CONTAINER_SIZE + CONTAINER_SIZE / 2;
    const endX = clickX * CONTAINER_SIZE + CONTAINER_SIZE / 2;
    const endY = clickY * CONTAINER_SIZE + CONTAINER_SIZE / 2;

    // Calculate movement path
    const dx = clickX - GOLF.ball.x;
    const dy = clickY - GOLF.ball.y;
    const moveSteps = [];

    // Determine if movement is straight, diagonal, or combination
    if (Math.abs(dx) === Math.abs(dy)) {
      // Pure diagonal movement
      const steps = Math.abs(dx);
      const stepX = dx / steps;
      const stepY = dy / steps;

      for (let i = 1; i <= steps; i++) {
        moveSteps.push({
          x: GOLF.ball.x + stepX * i,
          y: GOLF.ball.y + stepY * i,
          type: "diagonal",
        });
      }
    } else if (Math.abs(dx) === 0 || Math.abs(dy) === 0) {
      // Pure straight movement
      const steps = Math.max(Math.abs(dx), Math.abs(dy));
      const stepX = dx / steps;
      const stepY = dy / steps;

      for (let i = 1; i <= steps; i++) {
        moveSteps.push({
          x: GOLF.ball.x + stepX * i,
          y: GOLF.ball.y + stepY * i,
          type: "straight",
        });
      }
    } else {
      // Combination of straight and diagonal
      const straightSteps = Math.abs(Math.abs(dx) - Math.abs(dy));
      const diagonalSteps = Math.min(Math.abs(dx), Math.abs(dy));

      // First do diagonal moves
      const diagStepX = dx > 0 ? 1 : -1;
      const diagStepY = dy > 0 ? 1 : -1;

      for (let i = 1; i <= diagonalSteps; i++) {
        moveSteps.push({
          x: GOLF.ball.x + diagStepX * i,
          y: GOLF.ball.y + diagStepY * i,
          type: "diagonal",
        });
      }

      // Then do straight moves
      if (Math.abs(dx) > Math.abs(dy)) {
        const remainingX = dx - diagonalSteps * diagStepX;
        const stepX = remainingX > 0 ? 1 : -1;
        for (let i = 1; i <= straightSteps; i++) {
          moveSteps.push({
            x: GOLF.ball.x + diagonalSteps * diagStepX + stepX * i,
            y: GOLF.ball.y + diagonalSteps * diagStepY,
            type: "straight",
          });
        }
      } else {
        const remainingY = dy - diagonalSteps * diagStepY;
        const stepY = remainingY > 0 ? 1 : -1;
        for (let i = 1; i <= straightSteps; i++) {
          moveSteps.push({
            x: GOLF.ball.x + diagonalSteps * diagStepX,
            y: GOLF.ball.y + diagonalSteps * diagStepY + stepY * i,
            type: "straight",
          });
        }
      }
    }

    // Animate the movement
    let stepIndex = 0;
    const animateMove = () => {
      if (stepIndex < moveSteps.length) {
        // Clear and redraw
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawContainers();
        addRandomTrees();

        // Draw path up to current position
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
        ctx.lineWidth = 2;
        ctx.moveTo(startX, startY);

        for (let i = 0; i <= stepIndex; i++) {
          const step = moveSteps[i];
          ctx.lineTo(
            step.x * CONTAINER_SIZE + CONTAINER_SIZE / 2,
            step.y * CONTAINER_SIZE + CONTAINER_SIZE / 2
          );
        }
        ctx.stroke();

        // Update ball position
        GOLF.ball.x = moveSteps[stepIndex].x;
        GOLF.ball.y = moveSteps[stepIndex].y;
        drawGolfElements();

        // Show move type
        const moveType = moveSteps[stepIndex].type;
        ctx.fillStyle =
          moveType === "diagonal"
            ? "rgba(255, 0, 0, 0.3)"
            : "rgba(0, 255, 0, 0.3)";
        ctx.fillRect(
          GOLF.ball.x * CONTAINER_SIZE,
          GOLF.ball.y * CONTAINER_SIZE,
          CONTAINER_SIZE,
          CONTAINER_SIZE
        );

        stepIndex++;
        requestAnimationFrame(animateMove);
      } else {
        // Final cleanup
        movesRemaining--;
        document.getElementById("movesLeft").textContent = movesRemaining;
        highlightedPositions.clear();
        currentDiceValue = 0;

        // Store this move in history
        moveHistory.push({
          startX,
          startY,
          endX,
          endY,
          steps: moveSteps,
        });

        // Final redraw
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawContainers();
        addRandomTrees();

        // Draw all historical paths
        for (const move of moveHistory) {
          // Draw faded ball at move start
          ctx.beginPath();
          ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
          ctx.arc(move.startX, move.startY, GOLF.ball.size / 2, 0, Math.PI * 2);
          ctx.fill();

          // Draw movement path
          ctx.beginPath();
          ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
          ctx.lineWidth = 2;
          ctx.moveTo(move.startX, move.startY);

          // Draw each step with its color
          for (let i = 0; i < move.steps.length; i++) {
            const step = move.steps[i];
            const nextX = step.x * CONTAINER_SIZE + CONTAINER_SIZE / 2;
            const nextY = step.y * CONTAINER_SIZE + CONTAINER_SIZE / 2;

            // Draw step line
            ctx.lineTo(nextX, nextY);
            ctx.stroke();

            // Draw step marker
            ctx.fillStyle =
              step.type === "diagonal"
                ? "rgba(255, 0, 0, 0.2)"
                : "rgba(0, 255, 0, 0.2)";
            ctx.fillRect(
              step.x * CONTAINER_SIZE,
              step.y * CONTAINER_SIZE,
              CONTAINER_SIZE,
              CONTAINER_SIZE
            );

            // Start new path segment
            ctx.beginPath();
            ctx.moveTo(nextX, nextY);
          }
        }

        drawGolfElements();
      }
    };

    // Start animation
    animateMove();
  }
});
