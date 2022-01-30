import { getAngleBetweenTwoPoints } from "./getAngleBetweenTwoPoints";
import { getXFromAngle } from "./getXFromAngle";
import { getYFromAngle } from "./getYFromAngle";
import { Globals } from "./globals";
import { Players } from "./players";
import { Vector } from "./types.dto";

export const drawPointer = () => {
    const globals = Globals.getInstance();
    const players = Players.getInstance();
    if (!globals.socketId) return;
    if (!players.getMyself()) return;
    globals.context.strokeStyle = '#00ff0066';
    globals.context.lineWidth = 15;
    const angle = getAngleBetweenTwoPoints(
      {
        x:
          players.getMyself().getPosition().x +
          globals.playerSize.x / 2,
        y:
          players.getMyself().getPosition().y +
          globals.playerSize.y / 2,
      },
      globals.lastPointerPosition,
    );
    globals.context.beginPath();
    globals.context.moveTo(
      players.getMyself().getPosition().x + globals.playerSize.x / 2,
      players.getMyself().getPosition().y + globals.playerSize.y / 2,
    );
    globals.context.lineTo(
      players.getMyself().getPosition().x +
        globals.playerSize.x / 2 +
        getXFromAngle(angle) * players.getMyself().getJumpPower() * 50,
      players.getMyself().getPosition().y +
        globals.playerSize.y / 2 +
        getYFromAngle(angle) * players.getMyself().getJumpPower() * 50,
    );
    globals.context.stroke();
  }