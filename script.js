let maze = [];
let size = 5;
let isPaused = false;
let ratPosition;
let shortestPath = [];
let gameInProgress = false;

document
  .getElementById("generate-maze")
  .addEventListener("click", generateMaze);
document.getElementById("start").addEventListener("click", start);
document
  .getElementById("pause-resume")
  .addEventListener("click", togglePauseResume);
document.getElementById("reset").addEventListener("click", reset);

function generateMaze() {
  isPaused = true;
  gameInProgress = false;
  size = parseInt(document.getElementById("size").value);
  const mazeContainer = document.getElementById("maze-container");
  mazeContainer.innerHTML = "";

  mazeContainer.style.gridTemplateColumns = `repeat(${size}, 50px)`;
  mazeContainer.style.gridTemplateRows = `repeat(${size}, 50px)`;

  maze = Array(size)
    .fill()
    .map(() => Array(size).fill(0));

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.addEventListener("click", () => toggleWall(i, j));
      mazeContainer.appendChild(cell);
      if (i === 0 && j === 0) {
        cell.classList.add("source");
      } else if (i === size - 1 && j === size - 1) {
        cell.classList.add("destination");
      }
    }
  }

  document.getElementById("pause-resume").style.display = "none";
  document.getElementById("message").textContent = "";
}

function toggleWall(i, j) {
  if (gameInProgress) return;

  const cell = document.querySelector(
    `#maze-container div:nth-child(${i * size + j + 1})`
  );
  if (maze[i][j] === 0) {
    maze[i][j] = 1;
    cell.classList.add("wall");
  } else {
    maze[i][j] = 0;
    cell.classList.remove("wall");
  }
}

function start() {
  isPaused = false;
  gameInProgress = true;
  ratPosition = { x: 0, y: 0 };
  shortestPath = findShortestPath();

  if (shortestPath.length > 0) {
    renderRat();
    followPath();
    document.getElementById("pause-resume").textContent = "Pause";
    document.getElementById("pause-resume").style.display = "inline";
  } else {
    document.getElementById("message").textContent = "No path found!";
  }
}

function renderRat() {
  document.querySelectorAll(".rat").forEach((cell) => {
    cell.classList.remove("rat");
    cell.innerHTML = "";
  });

  const { x, y } = ratPosition;
  const cell = document.querySelector(
    `#maze-container div:nth-child(${x * size + y + 1})`
  );
  cell.classList.add("rat");
  cell.innerHTML = "&#128000;";
}

function followPath() {
  if (isPaused || shortestPath.length === 0) return;

  const nextPosition = shortestPath.shift();
  ratPosition = nextPosition;
  renderRat();

  if (ratPosition.x === size - 1 && ratPosition.y === size - 1) {
    showVictoryPopup();
    gameInProgress = false;
    return;
  }

  setTimeout(() => {
    followPath();
  }, 2000);
}

function findShortestPath() {
  const directions = [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 0, y: -1 },
  ];
  const queue = [{ x: 0, y: 0, path: [] }];
  const visited = Array(size)
    .fill()
    .map(() => Array(size).fill(false));
  visited[0][0] = true;

  while (queue.length > 0) {
    const current = queue.shift();
    const { x, y, path } = current;

    if (x === size - 1 && y === size - 1) {
      return [...path, { x, y }];
    }

    for (const direction of directions) {
      const newX = x + direction.x;
      const newY = y + direction.y;

      if (
        newX >= 0 &&
        newX < size &&
        newY >= 0 &&
        newY < size &&
        !visited[newX][newY] &&
        maze[newX][newY] === 0
      ) {
        visited[newX][newY] = true;
        queue.push({ x: newX, y: newY, path: [...path, { x, y }] });
      }
    }
  }

  return [];
}

function togglePauseResume() {
  if (isPaused) {
    isPaused = false;
    document.getElementById("pause-resume").textContent = "Pause";
    followPath();
  } else {
    isPaused = true;
    document.getElementById("pause-resume").textContent = "Resume";
  }
}

function reset() {
  isPaused = true;
  gameInProgress = false;
  document.getElementById("pause-resume").style.display = "none";
  generateMaze();
  document.getElementById("message").textContent = "";
  closeVictoryPopup();
}

function showVictoryPopup() {
  const modal = document.getElementById("victoryModal");
  modal.style.display = "block";

  const span = document.getElementsByClassName("close")[0];
  span.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}

function closeVictoryPopup() {
  const modal = document.getElementById("victoryModal");
  modal.style.display = "none";
}
