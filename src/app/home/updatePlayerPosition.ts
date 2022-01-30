import { detectCollisions } from './detectCollision';
import { Globals } from './globals';
import { MySocket } from './mySocket';
import { Players } from './players';

export const updatePlayerPosition = () => {
  const players = Players.getInstance();
  const globals = Globals.getInstance();
  const mySocket = MySocket.getInstance();
  if (!players.getMyself()) return;
  detectCollisions();
  if (
    players.getMyself().getPosition().x !== globals.myLastPosition.x ||
    players.getMyself().getPosition().y !== globals.myLastPosition.y
  ) {
    mySocket.sendUpdatedPosition(players.getMyself().getPosition());
    globals.myLastPosition = { ...players.getMyself().getPosition() };
  }
};
