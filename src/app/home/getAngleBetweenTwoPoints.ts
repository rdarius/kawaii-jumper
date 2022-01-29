import { Vector } from './types.dto';

export const getAngleBetweenTwoPoints = (p1: Vector, p2: Vector): number => {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
};
