import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';

import { Position } from '../../../../Kawaii-Jumper-server/src/position';
import {
  PlayerDTO,
  PlayerDTOList,
  PlayerList,
  StringNumber,
  StringVector,
  Vector,
} from './types.dto';

import { MapTile } from '../../../../Kawaii-Jumper-server/src/mapTile';
import { getXFromAngle } from './getXFromAngle';
import { getAngleBetweenTwoPoints } from './getAngleBetweenTwoPoints';
import { getYFromAngle } from './getYFromAngle';
import { applyGravity } from './applyGravity';
import { IsIntersecting } from './isIntersecting';
import { drawMap } from './drawMap';

import { Globals } from './globals';
import { Players } from './players';
import { MySocket } from './mySocket';
import { DeltaTime } from './deltaTime';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  globals: Globals;
  players: Players;
  mySocket: MySocket;
  deltaTime: DeltaTime;

  myLastPosition: Position = { x: 0, y: 0 };

  jumpPower = Date.now();

  lastPointerPosition: Position = { x: 0, y: 0 };

  keysDown: { [key: number]: boolean } = {};

  mapBuilder = false;

  builtMap: MapTile[] = [];

  constructor(private socket: Socket) {
    this.globals = Globals.getInstance();
    this.players = Players.getInstance();
    this.deltaTime = DeltaTime.getInstance();
    this.globals.socket = socket;
    this.mySocket = MySocket.getInstance();
    this.globals.pageHeight = window.innerHeight;
    this.globals.pageWidth = window.innerWidth;

    this.setupSocketListeners();
  }

  ngOnInit(): void {
    this.globals.setupCanvas();
    this.setListeners();
    this.gameLoop();
  }

  setupSocketListeners() {
    this.mySocket.onId((id: string) => (this.globals.socketId = id));
    this.mySocket.onMap((map: MapTile[]) => (this.globals.map = map));
    this.mySocket.onPlayerConnected((players: PlayerDTOList) =>
      this.players.addMultiplaPlayers(players),
    );
    this.mySocket.onNewPlayerConnected((player: PlayerDTO) =>
      this.players.addPlayer(player),
    );
    this.mySocket.onPlayerDisconnected((id: string) =>
      this.players.removePlayer(id),
    );
    this.mySocket.onUpdatedPlayerColor((playersColor: StringNumber) =>
      this.players.updatePlayerColor(playersColor),
    );
    this.mySocket.onUpdatedPlayerPosition((playersPosition: StringVector) =>
      this.players.updatePlayerPosition(playersPosition),
    );
    this.mySocket.onUpdatedPlayerDirection((playersDirection: StringNumber) =>
      this.players.updatePlayerDirection(playersDirection),
    );
  }

  getJumpPower(): number {
    let power = Date.now() - this.jumpPower;
    return Math.abs(getXFromAngle(power / 1000) * 1.4);
  }

  getJumpDirection(x: number, y: number) {
    return getAngleBetweenTwoPoints(
      {
        x:
          this.players.getMyself().getPosition().x +
          this.globals.playerSize.x / 2,
        y:
          this.players.getMyself().getPosition().y +
          this.globals.playerSize.y / 2,
      },
      {
        x: x * this.globals.canvasScale,
        y: y * this.globals.canvasScale,
      },
    );
  }

  clickEndListener($event): Position {
    console.log('click');
    if (!this.players.getMyself()) return;
    console.log('I found myself');
    if (!this.players.getMyself().isGrounded()) return;
    console.log('I am grounded');

    this.players.getMyself().swapColor();
    this.socket.emit('updatedColor', this.players.getMyself().getColor());
    this.players.getMyself().setGrounded(false);
    const angle = this.getJumpDirection($event.offsetX, $event.offsetY);
    this.players.getMyself().jump(angle, this.getJumpPower());

    this.socket.emit(
      'updatedDirection',
      this.players.getMyself().getDirection(),
    );
    this.globals.sounds[0].play();
    return this.players.getMyself().getMovingVelocity();
  }

  mapClickListenerEnd($event) {
    this.builtMap.push({
      color: 0,
      x: $event.offsetX * this.globals.canvasScale,
      y: $event.offsetY * this.globals.canvasScale,
      w: 130,
      h: 30,
    });
    console.log(this.builtMap);
  }

  moveListener($event): void {
    if (!this.globals.socketId) return;
    this.lastPointerPosition = {
      x: $event.offsetX * this.globals.canvasScale,
      y: $event.offsetY * this.globals.canvasScale,
    };
  }

  setListeners() {
    window.addEventListener('keydown', (e) => this.keyListener(e, true));
    window.addEventListener('keyup', (e) => this.keyListener(e, false));
    window.addEventListener('mouseup', (e) => this.mapBuilder ? this.mapClickListenerEnd(e) : this.clickEndListener(e));
    window.addEventListener('touchend', (e) => this.clickEndListener(e));
    window.addEventListener('mousemove', (e) => this.moveListener(e));
  }

  keyListener($event, state) {
    this.keysDown[$event.keyCode] = state;
  }

  detectCollisions() {
    const player = this.players.getMyself();
    for (let block of this.globals.map) {
      if (block.color !== this.players.getMyself().getColor()) continue;

      const playerWidth = this.globals.playerSize.x;
      const playerHeight = this.globals.playerSize.y;
      const myPosition = player.getPosition();

      const playerTopLeft: Position = myPosition;
      const playerTopRight: Position = {
        x: myPosition.x + playerWidth,
        y: myPosition.y,
      };
      const playerBottomLeft: Position = {
        x: myPosition.x,
        y: myPosition.y + playerHeight,
      };
      const playerBottomRight: Position = {
        x: myPosition.x + playerWidth,
        y: myPosition.y + playerHeight,
      };

      const blockTopLeft: Position = { x: block.x, y: block.y };
      const blockTopRight: Position = { x: block.x + block.w, y: block.y };
      const blockBottomLeft: Position = { x: block.x, y: block.y + block.h };
      const blockBottomRight: Position = {
        x: block.x + block.w,
        y: block.y + block.h,
      };

      if (
        IsIntersecting(
          playerTopRight,
          playerBottomRight,
          blockTopLeft,
          blockTopRight,
        ) &&
        IsIntersecting(
          playerBottomLeft,
          playerBottomRight,
          blockTopLeft,
          blockBottomLeft,
        )
      ) {
        const dx = this.getDistanceX(playerBottomRight, blockTopLeft);
        const dy = this.getDistanceY(playerBottomRight, blockTopLeft);
        console.log('collision on top left corner of platform');

        return dx < dy
          ? this.players.getMyself().touchRight(blockTopLeft.x)
          : this.players.getMyself().touchBottom(blockTopLeft.y);
      }

      if (
        IsIntersecting(
          playerTopRight,
          playerBottomRight,
          blockBottomLeft,
          blockBottomRight,
        ) &&
        IsIntersecting(
          playerTopLeft,
          playerTopRight,
          blockTopLeft,
          blockBottomLeft,
        )
      ) {
        const dx = this.getDistanceX(playerTopRight, blockBottomLeft);
        const dy = this.getDistanceY(playerTopRight, blockBottomLeft);
        console.log('collision on bottom left corner of platform');

        return dx < dy
          ? this.players.getMyself().touchRight(blockBottomLeft.x)
          : this.players.getMyself().touchTop(blockBottomLeft.y);
      }

      if (
        IsIntersecting(
          playerTopLeft,
          playerBottomLeft,
          blockTopLeft,
          blockTopRight,
        ) &&
        IsIntersecting(
          playerBottomLeft,
          playerBottomRight,
          blockTopRight,
          blockBottomRight,
        )
      ) {
        const dx = this.getDistanceX(playerBottomLeft, blockTopRight);
        const dy = this.getDistanceY(playerBottomLeft, blockTopRight);
        console.log('collision on top right corner of platform');

        return dx < dy
          ? this.players.getMyself().touchLeft(blockTopRight.x)
          : this.players.getMyself().touchBottom(blockTopRight.y);
      }

      if (
        IsIntersecting(
          playerTopLeft,
          playerBottomLeft,
          blockBottomLeft,
          blockBottomRight,
        ) &&
        IsIntersecting(
          playerTopLeft,
          playerTopRight,
          blockTopRight,
          blockBottomRight,
        )
      ) {
        const dx = this.getDistanceX(playerTopLeft, blockBottomRight);
        const dy = this.getDistanceY(playerTopLeft, blockBottomRight);
        console.log('collision on bottom right corner of platform');

        return dx < dy
          ? this.players.getMyself().touchLeft(blockBottomRight.x)
          : this.players.getMyself().touchTop(blockBottomRight.y);
      }

      if (
        IsIntersecting(
          playerTopLeft,
          playerTopRight,
          blockTopLeft,
          blockBottomLeft,
        ) &&
        IsIntersecting(
          playerBottomLeft,
          playerBottomRight,
          blockTopLeft,
          blockBottomLeft,
        )
      ) {
        console.log(
          'collision on left side of platform (platform bigger than player)',
        );
        return this.players.getMyself().touchRight(blockBottomLeft.x);
      }

      if (
        IsIntersecting(
          playerTopLeft,
          playerTopRight,
          blockTopRight,
          blockBottomRight,
        ) &&
        IsIntersecting(
          playerBottomLeft,
          playerBottomRight,
          blockTopRight,
          blockBottomRight,
        )
      ) {
        console.log(
          'collision on right side of platform (platform bigger than player)',
        );
        return this.players.getMyself().touchLeft(blockBottomRight.x);
      }

      if (
        IsIntersecting(
          playerTopLeft,
          playerBottomLeft,
          blockBottomLeft,
          blockBottomRight,
        ) &&
        IsIntersecting(
          playerTopRight,
          playerBottomRight,
          blockBottomLeft,
          blockBottomRight,
        )
      ) {
        console.log(
          'collision on bottom side of platform (platform bigger than player)',
        );
        return this.players.getMyself().touchTop(blockBottomLeft.y);
      }

      if (
        IsIntersecting(
          playerTopLeft,
          playerBottomLeft,
          blockTopLeft,
          blockTopRight,
        ) &&
        IsIntersecting(
          playerTopRight,
          playerBottomRight,
          blockTopLeft,
          blockTopRight,
        )
      ) {
        console.log(
          'collision on top side of platform (platform bigger than player)',
        );
        return this.players.getMyself().touchBottom(blockTopLeft.y);
      }

      if (
        IsIntersecting(
          playerTopLeft,
          playerBottomLeft,
          blockTopLeft,
          blockTopRight,
        )
      ) {
        console.log(
          'collision on right side of platform (platform smaller than player)',
        );
        return this.players.getMyself().touchLeft(blockTopRight.x);
      }

      if (
        IsIntersecting(
          playerTopRight,
          playerBottomRight,
          blockTopLeft,
          blockTopRight,
        )
      ) {
        console.log(
          'collision on left side of platform (platform smaller than player)',
        );
        return this.players.getMyself().touchRight(blockTopLeft.x);
      }

      if (
        IsIntersecting(
          playerTopLeft,
          playerTopRight,
          blockTopLeft,
          blockBottomLeft,
        )
      ) {
        console.log(
          'collision on bottom side of platform (platform smaller than player)',
        );
        return this.players.getMyself().touchTop(blockBottomLeft.y);
      }

      if (
        IsIntersecting(
          playerBottomLeft,
          playerBottomRight,
          blockTopLeft,
          blockBottomLeft,
        )
      ) {
        console.log(
          'collision on top side of platform (platform smaller than player)',
        );
        return this.players.getMyself().touchBottom(blockTopLeft.y);
      }
    }

    /* MAP BOUNDS */
    if (
      this.players.getMyself().getPosition().y >
      this.globals.height - this.globals.playerSize.y
    ) {
      this.players.getMyself().touchBottom(this.globals.height);
    }

    if (this.players.getMyself().getPosition().x < 0) {
      this.players.getMyself().touchLeft(0);
    }

    if (
      this.players.getMyself().getPosition().x >
      this.globals.width - this.globals.playerSize.x
    ) {
      this.players.getMyself().touchRight(this.globals.width);
    }
  }

  updatePlayerPosition() {
    if (!this.players.getMyself()) return;
    this.detectCollisions();
    if (
      this.players.getMyself().getPosition().x !== this.myLastPosition.x ||
      this.players.getMyself().getPosition().y !== this.myLastPosition.y
    ) {
      this.socket.emit(
        'updatedPosition',
        this.players.getMyself().getPosition(),
      );
      this.myLastPosition = { ...this.players.getMyself().getPosition() };
    }
  }

  getDistanceX(p1: Position, p2: Position): number {
    return Math.abs(p1.x - p2.x);
  }

  getDistanceY(p1: Position, p2: Position): number {
    return Math.abs(p1.y - p2.y);
  }

  drawPointer() {
    if (!this.globals.socketId) return;
    this.globals.context.strokeStyle = '#00ff0066';
    this.globals.context.lineWidth = 5;
    const angle = getAngleBetweenTwoPoints(
      {
        x:
          this.players.getMyself().getPosition().x +
          this.globals.playerSize.x / 2,
        y:
          this.players.getMyself().getPosition().y +
          this.globals.playerSize.y / 2,
      },
      this.lastPointerPosition,
    );
    this.globals.context.beginPath();
    this.globals.context.moveTo(
      this.players.getMyself().getPosition().x + this.globals.playerSize.x / 2,
      this.players.getMyself().getPosition().y + this.globals.playerSize.y / 2,
    );
    this.globals.context.lineTo(
      this.players.getMyself().getPosition().x +
        this.globals.playerSize.x / 2 +
        getXFromAngle(angle) * this.getJumpPower() * 50,
      this.players.getMyself().getPosition().y +
        this.globals.playerSize.y / 2 +
        getYFromAngle(angle) * this.getJumpPower() * 50,
    );
    this.globals.context.stroke();
  }

  gameLoop() {
    this.globals.context.fillStyle = 'gray';
    this.globals.context.drawImage(
      this.globals.backgroudnImage,
      0,
      0,
      this.globals.width,
      this.globals.height,
    );

    drawMap(
      this.globals.map,
      this.globals.context,
      this.globals.platformImages,
    );
    if (this.mapBuilder) {
      drawMap(
        this.builtMap,
        this.globals.context,
        this.globals.platformImages,
      );
    }

    this.deltaTime.updateDeltaTime();

    this.players.tick();
    this.players.draw();

    this.updatePlayerPosition();
    this.drawPointer();

    requestAnimationFrame(() => {
      this.gameLoop();
    });
  }
}
