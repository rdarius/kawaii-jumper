import { Position } from '../../../../Kawaii-Jumper-server/src/position';
import { Player } from './player';

export type PlayerDTO = {
  id: string;
  position: Position;
  name: string;
  movingVelocity: Position;
  color: number;
  direction: number;
};

export type PlayerList = { [key: string]: Player };
export type PlayerDTOList = { [key: string]: PlayerDTO };

export type Vector = { x: number; y: number };

export type StringString = { [key: string]: string };
export type StringNumber = { [key: string]: number };
export type StringVector = { [key: string]: Vector };
export type StringBoolean = { [key: string]: boolean };
