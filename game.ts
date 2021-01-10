import { Morpion, MorpionSimple } from "./tictactoe.js";

/* ------------------------------ */
/* -----| HELPER FUNCTIONS |----- */
/* ------------------------------ */

function getElement(selector: string) {
  return document.querySelector(selector) as HTMLElement;
}

function hideEl(selector: string) {
  (document.querySelector(selector) as HTMLElement).classList.add("hidden");
}

function showEl(selector: string) {
  (document.querySelector(selector) as HTMLElement).classList.remove("hidden");
}

function sleep(time: number) {
  return new Promise<void>((resolve) =>
    setTimeout(() => {
      resolve();
    }, time)
  );
}

/* ----------------------------------------------------------------------------------- */

/* ------------------------------ */
/* -----------| GAME |----------- */
/* ------------------------------ */

/* ----------------------------------------------------------------------------------- */

function initGame(e: MouseEvent) {
  e.preventDefault();

  const mode = (document.querySelector('input[name="MODE"]:checked') as HTMLInputElement).value;
  const size = parseInt((document.querySelector("#size") as HTMLInputElement).value.trim());
  const player1 = (document.querySelector("#player1") as HTMLInputElement).value.trim();
  const player2 = (document.querySelector("#player2") as HTMLInputElement).value.trim();

  const validInput = player1.length > 0 && player2.length > 0 && player1 !== player2 && size >= 3 && size <= 8;

  if (!validInput) {
    alert("Veuillez saisir les information valides (champs non vides, noms de joueurs différents, taille entre 3 et 8)");
  } else {
    if (mode === "MODE_SIMPLE") {
      morpion = new MorpionSimple(size, player1, player2);
    }

    if (mode === "MODE_COMPLET") {
      morpion = new Morpion(size, player1, player2);
    }

    initCells(morpion.size, morpion.MODE);
    morpion.initGrid();
    updatePlayersInfo();

    initialized = true;
    hideEl(".inputs");
    showEl(".grid");
  }
}

/* ----------------------------------------------------------------------------------- */

async function initCells(size: number, mode: string) {
  const parent = getElement(".grid");
  const unit = "1fr "; // CSS unit for the same cell size

  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");

    cell.classList.add("grid-item", "hidden", mode); // Class with border color for chosen game mode
    cell.setAttribute("data-cell", i.toString()); // Set index for each cell

    parent.style.gridTemplateColumns = unit.repeat(size).trim(); // Set grid columns display

    if (size >= 7) {
      cell.classList.add("size50");
    } else if (size >= 5) {
      cell.classList.add("size75");
    } else {
      cell.classList.add("size100");
    }

    parent.appendChild(cell);
  }

  const cells = document.querySelectorAll(".grid-item");

  if (initialized) {
    for (let j = 0; j < cells.length; j++) {
      cells[j].classList.remove("hidden");
    }
  } else {
    for (let j = 0; j < cells.length; j++) {
      await sleep(50); // Wait for 50ms between every cell
      cells[j].classList.remove("hidden");
    }
  }

  // Different loop to prevent user from clicking too fast while the grid is being revealed
  cells.forEach((cell) => {
    cell.addEventListener("click", handleClick);
  });
}

/* ----------------------------------------------------------------------------------- */

function playAgain() {
  const winnerEl = getElement(".winner");

  if (morpion.tie) {
    winnerEl.innerHTML = "It's a tie!";
    showEl(".modal-box");
  } else {
    morpion.current_player === morpion.player1
      ? (winnerEl.innerHTML = `<span class="green">${morpion.current_player.name}</span> won!`)
      : (winnerEl.innerHTML = `<span class="red">${morpion.current_player.name}</span> won!`);
    showEl(".modal-box");
  }
}

/* ----------------------------------------------------------------------------------- */

function resetGame() {
  const parent = getElement(".grid");

  morpion.reset();
  parent.textContent = "";
  initCells(morpion.size, morpion.MODE);
  morpion.initGrid();

  hideEl(".modal-box");
}

/* ----------------------------------------------------------------------------------- */

function resetAll() {
  const parent = getElement(".grid");

  initialized = false;
  morpion.reset();
  parent.textContent = "";

  resetPlayersInfo();

  hideEl(".modal-box");
  hideEl(".grid");
  showEl(".inputs");
}

/* ----------------------------------------------------------------------------------- */

function updatePlayersInfo() {
  getElement(".player1").textContent = `[ ${morpion.player1.name} ]`;
  getElement(".player2").textContent = `[ ${morpion.player2.name} ]`;

  getElement(".player1-score").textContent = morpion.player1.score.toString();
  getElement(".player2-score").textContent = morpion.player2.score.toString();
}

/* ----------------------------------------------------------------------------------- */

function resetPlayersInfo() {
  getElement(".player1").textContent = "";
  getElement(".player2").textContent = "";

  getElement(".player1-score").textContent = "";
  getElement(".player2-score").textContent = "";
}

/* ----------------------------------------------------------------------------------- */

function handleClick(e: Event) {
  const target = e.target as HTMLDivElement;

  if (target.getAttribute("data-symbol") === null && !morpion.win) {
    target.setAttribute("data-symbol", morpion.nextMove());

    const cellIndex = parseInt(target.getAttribute("data-cell") as string);
    const cellSymbol = target.getAttribute("data-symbol") as string;

    morpion.grid[cellIndex] = cellSymbol;

    morpion.checkWin();
    updatePlayersInfo();

    if (morpion.win || morpion.tie) {
      playAgain();
    } else {
      morpion.nextPlayer();
    }
  }
}

/* ----------------------------------------------------------------------------------- */

getElement(".validate").addEventListener("click", initGame);
getElement(".again-yes").addEventListener("click", resetGame);
getElement(".again-no").addEventListener("click", resetAll);

let initialized = false;
let morpion: Morpion | MorpionSimple;
