/*
  config:

   container 6x6 px
    width = 16 containers
    height = 36 containers
*/

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions based on container size and count
let CONTAINER_SIZE = 24; // 6px x 6px containers
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

  // Add some natural variation to edges
  for (let y = 1; y < POND.height - 1; y++) {
    for (let x = 1; x < POND.width - 1; x++) {
      if (pondMap[y][x]) {
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

// Initialize pond shape
const pondShape = generatePondShape();

// Then initialize SAND and sandShape
const SAND = {
  x: Math.floor(Math.random() * (CONTAINER_WIDTH_COUNT - 8)),
  y: Math.floor(Math.random() * (CONTAINER_HEIGHT_COUNT - 8)),
  width: Math.floor(Math.random() * 5) + 4,
  height: Math.floor(Math.random() * 5) + 4,
};

const sandShape = generateSandShape();

// Add after generatePondShape function
function generateSandShape() {
  const sandMap = Array(SAND.height)
    .fill()
    .map(() => Array(SAND.width).fill(false));
  const centerX = Math.floor(SAND.width / 2);
  const centerY = Math.floor(SAND.height / 2);

  // Generate main sand shape
  for (let y = 0; y < SAND.height; y++) {
    for (let x = 0; x < SAND.width; x++) {
      // Distance from center
      const dx = (x - centerX) / SAND.width;
      const dy = (y - centerY) / SAND.height;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Random noise factor
      const noise = Math.random() * 0.3;

      // Create irregular shape with some randomness
      if (distance + noise < 0.5) {
        sandMap[y][x] = true;
      }
    }
  }

  // Add some natural variation to edges
  for (let y = 1; y < SAND.height - 1; y++) {
    for (let x = 1; x < SAND.width - 1; x++) {
      if (sandMap[y][x]) {
        if (Math.random() < 0.1) {
          const neighbors = [
            sandMap[y - 1][x],
            sandMap[y + 1][x],
            sandMap[y][x - 1],
            sandMap[y][x + 1],
          ];
          const sandNeighbors = neighbors.filter((n) => n).length;
          if (sandNeighbors <= 1) {
            sandMap[y][x] = false;
          }
        }
      }
    }
  }

  return sandMap;
}

// Add after other initializations but before any functions
let treePositions = new Set(); // Store tree positions

// Add after pondShape initialization
function isValidGolfPosition(x, y) {
  // Check if position is inside pond
  if (isInsidePond(x, y)) {
    return false;
  }

  // Check if position is inside sand
  if (isInsideSand(x, y)) {
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

// Add after isInsidePond function
function isInsideSand(x, y) {
  const localX = x - SAND.x;
  const localY = y - SAND.y;
  return (
    localX >= 0 &&
    localX < SAND.width &&
    localY >= 0 &&
    localY < SAND.height &&
    sandShape[localY][localX]
  );
}

// Wait for image to load before drawing
treeImage.onload = () => {
  setupCanvas();
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

  // Draw sand tiles with rounded corners
  ctx.fillStyle = "#FFE4B5"; // Light orange/sand color
  for (let y = 0; y < SAND.height; y++) {
    for (let x = 0; x < SAND.width; x++) {
      if (!sandShape[y][x]) continue;

      const posX = (SAND.x + x) * CONTAINER_SIZE;
      const posY = (SAND.y + y) * CONTAINER_SIZE;

      ctx.beginPath();
      const radius = 8;

      // Check adjacent tiles to determine which corners to round
      const hasTop = y > 0 && sandShape[y - 1][x];
      const hasBottom = y < SAND.height - 1 && sandShape[y + 1][x];
      const hasLeft = x > 0 && sandShape[y][x - 1];
      const hasRight = x < SAND.width - 1 && sandShape[y][x + 1];

      // Draw tile with appropriate rounded corners (same logic as pond)
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

      // Add sand texture dots
      ctx.fillStyle = "#FFE4B5"; // Darker sand color
      const dotCount = 6; // Number of dots per tile
      const dotSize = 1; // Size of dots
      const padding = CONTAINER_SIZE * 0.2; // Padding from edges

      // Add random dots
      for (let i = 0; i < dotCount; i++) {
        const dotX =
          posX + padding + Math.random() * (CONTAINER_SIZE - 2 * padding);
        const dotY =
          posY + padding + Math.random() * (CONTAINER_SIZE - 2 * padding);

        ctx.beginPath();
        ctx.arc(dotX, dotY, dotSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Reset fillStyle for next drawing operations
  ctx.fillStyle = "#FFE4B5";
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

  // Draw trees from stored positions with crisp rendering
  for (const pos of treePositions) {
    const [x, y] = pos.split(",").map(Number);
    const posX = x * CONTAINER_SIZE;
    const posY = y * CONTAINER_SIZE;

    // Draw tree slightly smaller than container
    const treeSize = CONTAINER_SIZE * 0.9;
    const offsetX = (CONTAINER_SIZE - treeSize) / 2;
    const offsetY = (CONTAINER_SIZE - treeSize) / 2;

    // Use crisp pixel values
    ctx.drawImage(
      treeImage,
      Math.round(posX + offsetX),
      Math.round(posY + offsetY),
      Math.round(treeSize),
      Math.round(treeSize)
    );
  }
}

// Add function to draw golf elements
function drawGolfElements() {
  // Draw hole (hollow circle with soft red color)
  const holeX = GOLF.hole.x * CONTAINER_SIZE + CONTAINER_SIZE / 2;
  const holeY = GOLF.hole.y * CONTAINER_SIZE + CONTAINER_SIZE / 2;

  // Draw outer ring with soft red color
  ctx.beginPath();
  ctx.strokeStyle = "#ff6b6b"; // Soft red color
  ctx.lineWidth = 3;
  ctx.arc(holeX, holeY, GOLF.hole.size / 2, 0, Math.PI * 2);
  ctx.stroke();

  // Draw inner shadow with reddish tint
  ctx.beginPath();
  ctx.fillStyle = "rgba(255, 107, 107, 0.2)"; // Semi-transparent soft red
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
let strokeCount = 0;

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

    // Calculate final position
    const finalX = GOLF.ball.x + dx * stepMultiplier;
    const finalY = GOLF.ball.y + dy * stepMultiplier;

    // Check if position is valid
    if (
      finalX >= 0 &&
      finalX < CONTAINER_WIDTH_COUNT &&
      finalY >= 0 &&
      finalY < CONTAINER_HEIGHT_COUNT
    ) {
      // Check if final position is valid (not in pond or tree)
      const isValidFinal = isValidGolfPosition(finalX, finalY);
      // Check if final position is in sand
      const isInSand = isInsideSand(finalX, finalY);

      // For sand tiles, we'll use one less movement point
      const effectiveDistance = isInSand ? stepMultiplier + 1 : stepMultiplier;

      if (isValidFinal && effectiveDistance <= diceValue) {
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
  }

  // Redraw with highlights
  drawContainers();
  addRandomTrees();

  // Add highlights with different colors for sand
  for (const pos of highlightedPositions) {
    const [x, y] = pos.split(",").map(Number);
    if (isInsideSand(x, y)) {
      ctx.fillStyle = "rgba(255, 165, 0, 0.3)"; // Semi-transparent orange for sand
    } else {
      ctx.fillStyle = "rgba(255, 255, 0, 0.3)"; // Semi-transparent yellow for normal
    }
    ctx.fillRect(
      x * CONTAINER_SIZE,
      y * CONTAINER_SIZE,
      CONTAINER_SIZE,
      CONTAINER_SIZE
    );
  }

  drawGolfElements();

  // After checking all possible moves, check if any are valid
  checkForValidMoves();
}

// Add this function after highlightPossibleMoves
function checkForValidMoves() {
  // If no highlighted positions after calculating moves
  if (highlightedPositions.size === 0 && currentDiceValue > 0) {
    // Add shake class
    diceResult.classList.add("shake");

    // Remove shake class after animation completes
    setTimeout(() => {
      diceResult.classList.remove("shake");

      // Reset dice after a short delay
      setTimeout(() => {
        currentDiceValue = 0;
        diceResult.textContent = "?";
        diceButton.disabled = false;
        movesRemaining = 0;
        document.getElementById("movesLeft").textContent = movesRemaining;
      }, 300);
    }, 500);

    return false;
  }
  return true;
}

// Modify dice roll handler
diceButton.addEventListener("click", () => {
  diceButton.disabled = true;
  highlightedPositions.clear();
  diceResult.classList.remove("shake"); // Reset shake class

  let rolls = 0;
  const maxRolls = 10;
  const rollInterval = setInterval(() => {
    const rollValue = Math.floor(Math.random() * 6) + 1;
    diceResult.textContent = rollValue;
    rolls++;

    if (rolls >= maxRolls) {
      clearInterval(rollInterval);
      currentDiceValue = rollValue;
      movesRemaining = rollValue;
      document.getElementById("movesLeft").textContent = movesRemaining;
      highlightPossibleMoves(); // This will now check for valid moves
    }
  }, 100);
});

// Add after other initializations
const golfHitSound = new Audio("sounds/golf-hit.mp3");

// Modify the click handler where movement starts
canvas.addEventListener("click", (event) => {
  if (movesRemaining <= 0) return;

  const rect = canvas.getBoundingClientRect();

  // Calculate the scaling factor between displayed size and actual canvas size
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  // Calculate click position relative to the canvas
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Convert to container coordinates
  const clickX = Math.floor(
    (x * scaleX) / (CONTAINER_SIZE * (window.devicePixelRatio || 1))
  );
  const clickY = Math.floor(
    (y * scaleY) / (CONTAINER_SIZE * (window.devicePixelRatio || 1))
  );

  // Check if clicked position is highlighted
  if (highlightedPositions.has(`${clickX},${clickY}`)) {
    // Play golf hit sound
    golfHitSound.currentTime = 0;
    golfHitSound
      .play()
      .catch((error) => console.log("Error playing sound:", error));

    // Store initial position for line drawing
    const startX = GOLF.ball.x * CONTAINER_SIZE + CONTAINER_SIZE / 2;
    const startY = GOLF.ball.y * CONTAINER_SIZE + CONTAINER_SIZE / 2;
    const endX = clickX * CONTAINER_SIZE + CONTAINER_SIZE / 2;
    const endY = clickY * CONTAINER_SIZE + CONTAINER_SIZE / 2;

    // Calculate movement path for history
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
    const ANIMATION_DURATION = 1200; // Increased from 500 to 800ms for smoother movement
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const rawProgress = getAnimationProgress(elapsed, ANIMATION_DURATION);
      const progress = easeInOutQuad(rawProgress);

      // Clear and redraw
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawContainers();
      addRandomTrees();

      // Draw historical paths
      for (const move of moveHistory) {
        drawHistoricalPath(move);
      }

      // Draw the hole first (so ball appears on top)
      const holeX = GOLF.hole.x * CONTAINER_SIZE + CONTAINER_SIZE / 2;
      const holeY = GOLF.hole.y * CONTAINER_SIZE + CONTAINER_SIZE / 2;

      ctx.beginPath();
      ctx.strokeStyle = "#ff6b6b";
      ctx.lineWidth = 3;
      ctx.arc(holeX, holeY, GOLF.hole.size / 2, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.fillStyle = "rgba(255, 107, 107, 0.2)";
      ctx.arc(holeX, holeY, GOLF.hole.size / 2 - 2, 0, Math.PI * 2);
      ctx.fill();

      // Draw current movement path with smoother line
      ctx.beginPath();
      ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(startX, startY);
      ctx.lineTo(lerp(startX, endX, progress), lerp(startY, endY, progress));
      ctx.stroke();

      // Draw ball at interpolated position
      const currentX = lerp(startX, endX, progress);
      const currentY = lerp(startY, endY, progress);

      ctx.beginPath();
      ctx.fillStyle = "#000000";
      ctx.shadowBlur = 1;
      ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
      ctx.arc(currentX, currentY, GOLF.ball.size / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Color the path based on movement type
      const isMoveDiagonal = Math.abs(dx) === Math.abs(dy);
      ctx.fillStyle = isMoveDiagonal
        ? "rgba(255, 0, 0, 0.2)"
        : "rgba(0, 255, 0, 0.2)";

      // Draw colored squares for the path
      for (const step of moveSteps) {
        ctx.fillRect(
          step.x * CONTAINER_SIZE,
          step.y * CONTAINER_SIZE,
          CONTAINER_SIZE,
          CONTAINER_SIZE
        );
      }

      if (rawProgress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Update final ball position
        GOLF.ball.x = clickX;
        GOLF.ball.y = clickY;

        // Update stroke count
        strokeCount++;
        document.getElementById("movesLeft").textContent = strokeCount;

        // Check if game is complete
        const gameComplete = checkGameComplete(clickX, clickY);

        if (!gameComplete) {
          // Only continue game if not complete
          movesRemaining--;
          highlightedPositions.clear();
          currentDiceValue = 0;
          diceButton.disabled = false;
        } else {
          // Disable dice button if game complete
          diceButton.disabled = true;
        }

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
          drawHistoricalPath(move);
        }

        drawGolfElements();
      }
    };

    // Start animation
    animate();
  }
});

// Add helper function for linear interpolation
function lerp(start, end, progress) {
  return start + (end - start) * progress;
}

// Add helper function to draw historical paths
function drawHistoricalPath(move) {
  // Draw faded ball at move start
  ctx.beginPath();
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.arc(move.startX, move.startY, GOLF.ball.size / 2, 0, Math.PI * 2);
  ctx.fill();

  // Draw movement path with greenish tint
  ctx.beginPath();
  ctx.strokeStyle = "rgba(76, 175, 80, 0.3)"; // Light green stroke
  ctx.lineWidth = 2;
  ctx.moveTo(move.startX, move.startY);

  // Draw path line
  const endX = move.endX;
  const endY = move.endY;
  ctx.lineTo(endX, endY);
  ctx.stroke();

  // Draw rounded greenish squares for each step
  ctx.fillStyle = "rgba(76, 175, 80, 0.15)"; // Light green fill

  for (const step of move.steps) {
    const x = step.x * CONTAINER_SIZE;
    const y = step.y * CONTAINER_SIZE;
    const size = CONTAINER_SIZE;
    const radius = 4; // Corner radius

    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + size - radius, y);
    ctx.quadraticCurveTo(x + size, y, x + size, y + radius);
    ctx.lineTo(x + size, y + size - radius);
    ctx.quadraticCurveTo(x + size, y + size, x + size - radius, y + size);
    ctx.lineTo(x + radius, y + size);
    ctx.quadraticCurveTo(x, y + size, x, y + size - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
  }
}

// Add after other helper functions
function easeInOutQuad(t) {
  // Custom easing function that combines cubic and quadratic easing
  if (t < 0.5) {
    // Smooth acceleration in first half
    return 4 * t * t * t;
  } else {
    // Gradual deceleration in second half
    const p = 2 * t - 2;
    return 0.5 * p * p * p + 1;
  }
}

// Add this function to help with smoother animation timing
function getAnimationProgress(elapsed, duration) {
  return Math.min(elapsed / duration, 1);
}

// Add this near the beginning of your file with other DOM element selections
const refreshButton = document.getElementById("refreshButton");

// Add this with your other event listeners
refreshButton.addEventListener("click", () => {
  initializeGame();
  diceButton.disabled = false;
  diceResult.textContent = "?";
});

// Add this function after other initializations but before event listeners
function initializeGame() {
  // Reset game state variables
  currentDiceValue = 0;
  movesRemaining = 0;
  moveHistory = [];
  highlightedPositions.clear();
  treePositions.clear();

  // Generate new pond position and shape
  POND.x = Math.floor(Math.random() * (CONTAINER_WIDTH_COUNT - 14));
  POND.y = Math.floor(Math.random() * (CONTAINER_HEIGHT_COUNT - 14));
  POND.width = Math.floor(Math.random() * 9) + 6;

  do {
    POND.height = Math.floor(Math.random() * 9) + 6;
  } while (POND.height === POND.width);

  // Generate new pond shape
  const newPondShape = generatePondShape();
  Object.assign(pondShape, newPondShape);

  // Find new valid positions for ball and hole
  do {
    GOLF.ball.x = Math.floor(Math.random() * (CONTAINER_WIDTH_COUNT - 4));
    GOLF.ball.y = Math.floor(Math.random() * (CONTAINER_HEIGHT_COUNT - 4));
  } while (!isValidGolfPosition(GOLF.ball.x, GOLF.ball.y));

  do {
    GOLF.hole.x = Math.floor(Math.random() * (CONTAINER_WIDTH_COUNT - 4));
    GOLF.hole.y = Math.floor(Math.random() * (CONTAINER_HEIGHT_COUNT - 4));
  } while (
    !isValidGolfPosition(GOLF.hole.x, GOLF.hole.y) ||
    Math.abs(GOLF.ball.x - GOLF.hole.x) < 5 ||
    Math.abs(GOLF.ball.y - GOLF.hole.y) < 5
  );

  // Generate new sand position
  SAND.x = Math.floor(Math.random() * (CONTAINER_WIDTH_COUNT - 8));
  SAND.y = Math.floor(Math.random() * (CONTAINER_HEIGHT_COUNT - 8));
  SAND.width = Math.floor(Math.random() * 5) + 4;
  SAND.height = Math.floor(Math.random() * 5) + 4;

  // Generate new sand shape
  const newSandShape = generateSandShape();
  Object.assign(sandShape, newSandShape);

  // Redraw everything
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawContainers();
  addRandomTrees();
  drawGolfElements();

  // Reset stroke count
  strokeCount = 0;
  document.getElementById("movesLeft").textContent = strokeCount;
}

// Modify the setupCanvas function
function setupCanvas() {
  // Get the container width
  const container = canvas.parentElement;
  const containerWidth = container.clientWidth - 40; // Account for padding

  // Get device pixel ratio
  const dpr = window.devicePixelRatio || 1;

  // Calculate the best size that maintains aspect ratio
  const aspectRatio = CONTAINER_HEIGHT_COUNT / CONTAINER_WIDTH_COUNT;

  // Set canvas size based on container width
  const baseSize = Math.min(containerWidth / CONTAINER_WIDTH_COUNT, 24);

  // Update container size
  CONTAINER_SIZE = baseSize;

  // Set canvas dimensions accounting for device pixel ratio
  const logicalWidth = CONTAINER_SIZE * CONTAINER_WIDTH_COUNT;
  const logicalHeight = CONTAINER_SIZE * CONTAINER_HEIGHT_COUNT;

  // Set the canvas size in CSS pixels
  canvas.style.width = `${logicalWidth}px`;
  canvas.style.height = `${logicalHeight}px`;

  // Scale the canvas for high DPI displays
  canvas.width = Math.floor(logicalWidth * dpr);
  canvas.height = Math.floor(logicalHeight * dpr);

  // Reset the context state
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  // Scale the context to handle the device pixel ratio
  ctx.scale(dpr, dpr);

  // Enable image smoothing for better quality
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Store the current scale for click handling
  canvas.currentScale = dpr;

  // Redraw everything
  drawContainers();
  addRandomTrees();
  drawGolfElements();
}

// Add resize handler
window.addEventListener("resize", debounce(setupCanvas, 250));

// Add debounce function to prevent too many resize events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Call setupCanvas instead of direct dimension setting
setupCanvas();

// Add near the top with other DOM element selections
const menuButton = document.getElementById("menuButton");
const menuOverlay = document.getElementById("menuOverlay");
const sideMenu = document.getElementById("sideMenu");
const closeMenu = document.getElementById("closeMenu");

// Add menu event listeners
menuButton.addEventListener("click", () => {
  menuOverlay.classList.add("active");
  sideMenu.classList.add("active");
});

closeMenu.addEventListener("click", closeMenuFunction);
menuOverlay.addEventListener("click", closeMenuFunction);

function closeMenuFunction() {
  menuOverlay.classList.remove("active");
  sideMenu.classList.remove("active");
}

// Add keyboard event listener for Escape key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuOverlay.classList.contains("active")) {
    closeMenuFunction();
  }
});

// Add after other initializations
function showGameCompletePopup() {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "1000";

  const popup = document.createElement("div");
  popup.style.backgroundColor = "white";
  popup.style.padding = "2rem";
  popup.style.borderRadius = "1rem";
  popup.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
  popup.style.textAlign = "center";

  const message = document.createElement("h2");
  message.textContent = `Hole in ${strokeCount} strokes!`;
  message.style.marginBottom = "1rem";
  message.style.color = "#333";

  const playAgainButton = document.createElement("button");
  playAgainButton.textContent = "Play Again";
  playAgainButton.style.padding = "0.5rem 1rem";
  playAgainButton.style.fontSize = "1rem";
  playAgainButton.style.backgroundColor = "#4CAF50";
  playAgainButton.style.color = "white";
  playAgainButton.style.border = "none";
  playAgainButton.style.borderRadius = "0.5rem";
  playAgainButton.style.cursor = "pointer";
  playAgainButton.style.marginTop = "1rem";

  playAgainButton.addEventListener("click", () => {
    document.body.removeChild(overlay);
    initializeGame();
    diceButton.disabled = false;
    diceResult.textContent = "?";
    strokeCount = 0;
    document.getElementById("movesLeft").textContent = strokeCount;
  });

  popup.appendChild(message);
  popup.appendChild(playAgainButton);
  overlay.appendChild(popup);
  document.body.appendChild(overlay);
}

// Add function to check if ball has reached hole
function checkGameComplete(ballX, ballY) {
  if (ballX === GOLF.hole.x && ballY === GOLF.hole.y) {
    setTimeout(() => {
      showGameCompletePopup();
    }, 500); // Show popup after animation completes
    return true;
  }
  return false;
}

// Add after other popup-related functions
function showRulesPopup() {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "1000";

  const popup = document.createElement("div");
  popup.style.backgroundColor = "white";
  popup.style.padding = "2rem";
  popup.style.borderRadius = "1rem";
  popup.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
  popup.style.maxWidth = "80%";
  popup.style.maxHeight = "80vh";
  popup.style.overflowY = "auto";

  const title = document.createElement("h2");
  title.textContent = "How to Play";
  title.style.marginBottom = "1.5rem";
  title.style.color = "#333";
  title.style.borderBottom = "2px solid #eee";
  title.style.paddingBottom = "0.5rem";

  const rulesList = document.createElement("div");
  rulesList.style.textAlign = "left";
  rulesList.style.lineHeight = "1.6";

  const rules = [
    {
      title: "Objective",
      text: "Get the black ball into the hole in as few strokes as possible.",
    },
    {
      title: "Controls",
      text: "1. Roll the dice to determine how far you can move\n2. Click on a highlighted square to move the ball",
    },
    {
      title: "Movement",
      text: "• Move straight or diagonally up to the dice value\n• Path must be clear of obstacles",
    },
    {
      title: "Obstacles",
      text: "🌲 Trees: Cannot move through or land on trees\n💧 Water: Cannot move through or land on water\n🏖️ Sand: Requires one extra movement point to land on",
    },
    {
      title: "Scoring",
      text: "Each dice roll counts as one stroke. Try to complete the hole in as few strokes as possible!",
    },
  ];

  rules.forEach((rule) => {
    const ruleSection = document.createElement("div");
    ruleSection.style.marginBottom = "1.5rem";

    const ruleTitle = document.createElement("h3");
    ruleTitle.textContent = rule.title;
    ruleTitle.style.color = "#444";
    ruleTitle.style.marginBottom = "0.5rem";

    const ruleText = document.createElement("p");
    ruleText.style.color = "#666";
    ruleText.style.whiteSpace = "pre-line";
    ruleText.textContent = rule.text;

    ruleSection.appendChild(ruleTitle);
    ruleSection.appendChild(ruleText);
    rulesList.appendChild(ruleSection);
  });

  const closeButton = document.createElement("button");
  closeButton.textContent = "Got it!";
  closeButton.style.padding = "0.5rem 1rem";
  closeButton.style.fontSize = "1rem";
  closeButton.style.backgroundColor = "#4CAF50";
  closeButton.style.color = "white";
  closeButton.style.border = "none";
  closeButton.style.borderRadius = "0.5rem";
  closeButton.style.cursor = "pointer";
  closeButton.style.marginTop = "1rem";

  closeButton.addEventListener("click", () => {
    document.body.removeChild(overlay);
    closeMenuFunction(); // Close the menu when rules are closed
  });

  popup.appendChild(title);
  popup.appendChild(rulesList);
  popup.appendChild(closeButton);
  overlay.appendChild(popup);
  document.body.appendChild(overlay);
}

// Modify the event listener addition to check for element existence
const howToPlayButton = document.getElementById("howToPlay");
if (howToPlayButton) {
  howToPlayButton.addEventListener("click", showRulesPopup);
}
