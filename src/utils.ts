import { Position } from "./grid";
import { ShipType } from "./ship";

export const gridChars = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

export const shipNames: ShipType[] = [
  "destroyer",
  "submarine",
  "cruiser",
  "battleship",
  "carrier",
];

export function makePositionFromId(id: string): Position {
  // Input -> player-g-8
  // Output -> g-8
  const [_, char, number] = id.split("-");
  // const [char, number] = id.split("-").slice(1);
  return `${char}-${parseInt(number)}`;
}
