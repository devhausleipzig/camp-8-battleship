import { PlayerShip, Ship, ShipType } from "./ship";
import { gridChars, makePositionFromId, shipNames } from "./utils";

export type Position = `${string}-${number}`;
type PossibleValue = "" | "hit" | "miss" | ShipType;
type GridState = Record<Position, PossibleValue>;

abstract class Grid {
  state: GridState = {};
  type: "player" | "computer";
  ships: Ship[] = [];
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

  set(position: Position, value: PossibleValue): void {
    this.state[position] = value;
  }

  get(position: Position): PossibleValue {
    return this.state[position];
  }

  isTaken(positions: Position[]): boolean {
    return positions.some((position) => this.get(position));
  }

  drawShip(positions: Position[], shipType: ShipType): void {
    positions.forEach((position) => {
      const square = this.squares.find(
        (sq) => sq.id === `${this.type}-${position}`
      );
      // const square = document.getElementById(`${this.type}-${position}`);
      square?.classList.add(shipType);
    });
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
    // Ship Listeners
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
      });
    });

    // Grid Listeners
    this.element.addEventListener("dragover", (event) =>
      event.preventDefault()
    );
    this.element.addEventListener("drop", (event) => {
      const target = event.target as HTMLElement;
      const position = makePositionFromId(target.id);
      if (this.selectedShip) {
        this.placeShip(this.selectedShip, this.selectedShipPart, position);
      }
    });
  }

  placeShip(ship: PlayerShip, shipPart: number, position: Position): void {
    const shipSquares: Position[] = [];
    const positionChar = position.split("-")[0];
    const positionNumber = parseInt(position.split("-")[1]);

    if (ship.isHorizontal) {
      for (let i = 0; i < ship.length; i++) {
        const number = positionNumber + i - shipPart;
        if (number > 10 || number < 1) {
          return;
        }
        shipSquares.push(`${positionChar}-${number}`);
      }
    } else {
      for (let i = 0; i < ship.length; i++) {
        const charIndex = gridChars.indexOf(positionChar);
        const char = gridChars[charIndex + i - shipPart];
        if (!char) {
          return;
        }
        shipSquares.push(`${char}-${positionNumber}`);
      }
    }

    const isTaken = this.isTaken(shipSquares);

    if (!isTaken) {
      shipSquares.forEach((square) => this.set(square, ship.type));
      this.drawShip(shipSquares, ship.type);
    }
  }
}

export class ComputerGrid extends Grid {
  constructor() {
    super("computer");
  }
}
