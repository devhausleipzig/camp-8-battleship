import { PlayerShip, ShipType } from "./ship";
import { gridChars, shipNames } from "./utils";

export type Position = `${string}-${number}`;
type PossibleValue = "" | "hit" | "miss" | ShipType;
type GridState = Record<Position, PossibleValue>;

abstract class Grid {
  state: GridState = {};
  type: "player" | "computer";
  element: HTMLElement;
  squares: HTMLElement[] = [];

  constructor(type: "player" | "computer") {
    this.type = type;

    // Create the Grid State
    for (let i = 0; i < gridChars.length; i++) {
      for (let j = 1; j <= 10; j++) {
        const position: Position = `${gridChars[i]}-${j}`;
        this.state[position] = "";
      }
    }

    this.element = document.createElement("div");
    this.element.classList.add("grid");
    this.element.id = this.type === "player" ? "player-grid" : "computer-grid";
    const container = document.querySelector(".grid-container") as HTMLElement;
    container.appendChild(this.element);
  }

  createBoard(): void {
    // iterate over the state object
    for (const key in this.state) {
      // create a square(div)
      const square = document.createElement("div");
      // give the square an id -> e.g. player-a-1 computer-b-2
      square.id = `${this.type}-${key}`;
      // append the squares to the grid
      this.element.appendChild(square);
      // add the squares also to the squares field
      this.squares.push(square);
    }
  }
}

export class PlayerGrid extends Grid {
  shipsToBePlaced: PlayerShip[] = [];
  selectedShipPart: number = 0;
  selectedShip: PlayerShip | null = null;
  // shipsToBePlaced: PlayerShip[];
  constructor() {
    super("player");
    shipNames.forEach((shipName) =>
      this.shipsToBePlaced.push(new PlayerShip(shipName))
    );
    // this.shipsToBePlaced = shipNames.map(
    //   (shipName) => new PlayerShip(shipName)
    // );
  }

  addListeners(): void {
    this.shipsToBePlaced.forEach((ship) => {
      ship.element.draggable = true;
      ship.element.addEventListener("mousedown", (event) => {
        const target = event.target as HTMLElement;
        this.selectedShipPart = parseInt(target.id.split("-")[1]);
        // get the id from the target
        // const id = target.id;
        // exxtract the number from it
        // const numberString = id.split("-")[1];
        // convert it to a number type
        // const number = parseInt(numberString);
      });

      ship.element.addEventListener("dragstart", () => {
        this.selectedShip = ship;
        console.log(this.selectedShip);
      });
    });
  }
}

export class ComputerGrid extends Grid {
  constructor() {
    super("computer");
  }
}
