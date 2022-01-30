import { Vector } from './types.dto';

export const getDistanceX = (p1: Vector, p2: Vector): number => {
  return Math.abs(p1.x - p2.x);
};

export const getDistanceY = (p1: Vector, p2: Vector): number => {
  return Math.abs(p1.y - p2.y);
};
