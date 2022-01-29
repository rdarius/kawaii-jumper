import { Vector } from './types.dto';

export const applyGravity = (
  currentVelocity: Vector,
  deltaTime: number,
): Vector => {
  currentVelocity.y += 0.003 * deltaTime;
  currentVelocity.y = currentVelocity.y > 0.9 ? 0.9 : currentVelocity.y;
  return { ...currentVelocity };
};
