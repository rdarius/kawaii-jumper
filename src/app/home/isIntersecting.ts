import { Vector } from './types.dto';

export const IsIntersecting = (
  l1p1: Vector, // line 1 point 1
  l1p2: Vector, // line 1 point 2
  l2p1: Vector, // line 2 point 1
  l2p2: Vector, // line 2 point 2
): boolean => {
  const denominator =
    (l1p2.x - l1p1.x) * (l2p2.y - l2p1.y) -
    (l1p2.y - l1p1.y) * (l2p2.x - l2p1.x);
  const numerator1 =
    (l1p1.y - l2p1.y) * (l2p2.x - l2p1.x) -
    (l1p1.x - l2p1.x) * (l2p2.y - l2p1.y);
  const numerator2 =
    (l1p1.y - l2p1.y) * (l1p2.x - l1p1.x) -
    (l1p1.x - l2p1.x) * (l1p2.y - l1p1.y);

  if (denominator == 0) return numerator1 == 0 && numerator2 == 0;

  const r = numerator1 / denominator;
  const s = numerator2 / denominator;

  return r >= 0 && r <= 1 && s >= 0 && s <= 1;
};
