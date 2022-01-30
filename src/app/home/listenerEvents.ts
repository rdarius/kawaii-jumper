import { Globals } from './globals';
import { MySocket } from './mySocket';
import { Players } from './players';
import { Vector } from './types.dto';

export const touchEndListener = ($event): void => {
  const globals = Globals.getInstance();
  if (!$event.changedTouches.length) return;
  clickEvent({
    x: $event.changedTouches[0].pageX - globals.canvasOffset.x,
    y: $event.changedTouches[0].pageY - globals.canvasOffset.y,
  });
};

export const clickEndListener = ($event): void => {
  if ($event.button !== 0) return;
  clickEvent({ x: $event.offsetX, y: $event.offsetY });
};

export const clickEvent = (position: Vector) => {
  const globals = Globals.getInstance();
  const players = Players.getInstance();
  const mySocket = MySocket.getInstance();
  if (!players.getMyself()) return;
  if (!players.getMyself().isGrounded()) return;
  const player = players.getMyself();

  player.swapColor();
  player.setGrounded(false);
  player.jump(position);

  mySocket.sendUpdatedColor(player.getColor());
  mySocket.sendUpdatedDirection(player.getDirection());
  if (globals.platform.is('cordova')) {
    globals.nativeAudio.play('jump').then(console.log, console.error);
  } else {
    globals.sounds[0].play();
  }
};

export const mapClickListenerEnd = ($event) => {
  if ($event.button !== 0) return;
  const globals = Globals.getInstance();
  globals.builtMap.push({
    color: globals.mapBuilderTile,
    x: Math.floor($event.offsetX * globals.canvasScale),
    y: Math.floor($event.offsetY * globals.canvasScale),
    w: 130,
    h: 30,
  });
  console.log(globals.builtMap);
};

export const touchMoveListener = ($event: TouchEvent): void => {
  const globals = Globals.getInstance();
  if (!$event.touches.length) return;
  globals.lastPointerPosition = {
    x: ($event.touches[0].pageX - globals.canvasOffset.x) * globals.canvasScale,
    y: ($event.touches[0].pageY - globals.canvasOffset.y) * globals.canvasScale,
  };
};

export const moveListener = ($event): void => {
  const globals = Globals.getInstance();
  if (!globals.socketId) return;
  globals.lastPointerPosition = {
    x: $event.offsetX * globals.canvasScale,
    y: $event.offsetY * globals.canvasScale,
  };
};

export const keyListener = ($event, state) => {
  const globals = Globals.getInstance();
  globals.keysDown[$event.keyCode] = state;
  switch ($event.keyCode) {
    case 49:
      globals.mapBuilderTile = 0;
      break;
    case 50:
      globals.mapBuilderTile = 1;
      break;
  }
};

export const setListeners = () => {
  const globals = Globals.getInstance();
  window.addEventListener('keydown', (e) => keyListener(e, true));
  window.addEventListener('keyup', (e) => keyListener(e, false));
  globals.canvas.addEventListener('mouseup', (e) =>
    globals.mapBuilder ? mapClickListenerEnd(e) : clickEndListener(e),
  );
  globals.canvas.addEventListener('touchend', (e) => touchEndListener(e));
  globals.canvas.addEventListener('mousemove', (e) => moveListener(e));
  globals.canvas.addEventListener('touchmove', (e) => touchMoveListener(e));
};
