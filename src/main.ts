import "./style.css";
import { PlayerGrid, ComputerGrid } from "./grid";
import { makePositionFromId } from "./utils";
const startButton = document.getElementById("start") as HTMLElement;
const rotateButton = document.getElementById("rotate") as HTMLElement;
const randomizeButton = document.getElementById("random") as HTMLElement;
const message = document.getElementById("message") as HTMLElement;

let playerTurn = 1;
let computerTurn = 1;

const playerGrid = new PlayerGrid();
const computerGrid = new ComputerGrid();

playerGrid.createBoard();
computerGrid.createBoard();

rotateButton.addEventListener("click", () => {
  playerGrid.shipsToBePlaced.forEach((ship) => ship.rotate());
});

randomizeButton.addEventListener("click", () => {
  playerGrid.randomizeShips();
  randomizeButton.remove();
});

playerGrid.addListeners();

computerGrid.ships.forEach((ship) => {
  computerGrid.generateShipPlacement(ship);
});

startButton.addEventListener("click", () => {
  if (playerGrid.shipsToBePlaced.length > 0) {
    message.innerHTML =
      "You need to place all of your ships to start the game!";
    return;
  }
  message.innerHTML = "Game has started";

  computerGrid.element.addEventListener("click", fire);
});

function fire(event: Event) {
  const square = event.target as HTMLElement;
  const position = makePositionFromId(square.id);
  const squareValue = computerGrid.get(position);

  if (playerTurn !== computerTurn) {
    return;
  }

  if (squareValue === "hit" || squareValue === "miss") {
    message.innerHTML = "You already fired at this square, pick another one!";
    return;
  }

  if (!playerGrid.ships.length || !computerGrid.ships.length) {
    message.innerHTML = "Game over!";
    return;
  }

  console.log(squareValue);

  computerGrid.takeShot(square);
  playerTurn += 1;

  setTimeout(() => {
    const randomSquare = playerGrid.randomFire();
    playerGrid.takeShot(randomSquare);
    computerTurn += 1;
  }, Math.random() * (1500 - 500) + 500);
}
