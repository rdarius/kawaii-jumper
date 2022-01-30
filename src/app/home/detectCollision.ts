import { getDistanceX, getDistanceY } from "./getDistance";
import { Globals } from "./globals";
import { IsIntersecting } from "./isIntersecting";
import { Players } from "./players";
import { Vector } from "./types.dto";

export const detectCollisions = () => {
    const players = Players.getInstance();
    const player = players.getMyself();
    const globals = Globals.getInstance();

    /* WIN CONDITION */
    if (player.getPosition().y < 160) {
      alert('Congratulations, you raeched the top!');
    }

    for (let block of globals.map) {
      if (block.color !== player.getColor()) continue;

      const playerWidth = globals.playerSize.x;
      const playerHeight = globals.playerSize.y;
      const myPosition = player.getPosition();

      const playerTopLeft: Vector = myPosition;
      const playerTopRight: Vector = {
        x: myPosition.x + playerWidth,
        y: myPosition.y,
      };
      const playerBottomLeft: Vector = {
        x: myPosition.x,
        y: myPosition.y + playerHeight,
      };
      const playerBottomRight: Vector = {
        x: myPosition.x + playerWidth,
        y: myPosition.y + playerHeight,
      };

      const blockTopLeft: Vector = { x: block.x, y: block.y };
      const blockTopRight: Vector = { x: block.x + block.w, y: block.y };
      const blockBottomLeft: Vector = { x: block.x, y: block.y + block.h };
      const blockBottomRight: Vector = {
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
        const dx = getDistanceX(playerBottomRight, blockTopLeft);
        const dy = getDistanceY(playerBottomRight, blockTopLeft);
        if (globals.collisionLogging)
          console.log('collision on top left corner of platform');

        return dx < dy
          ? player.touchRight(blockTopLeft.x)
          : player.touchBottom(blockTopLeft.y);
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
        const dx = getDistanceX(playerTopRight, blockBottomLeft);
        const dy = getDistanceY(playerTopRight, blockBottomLeft);
        if (globals.collisionLogging)
          console.log('collision on bottom left corner of platform');

        return dx < dy
          ? player.touchRight(blockBottomLeft.x)
          : player.touchTop(blockBottomLeft.y);
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
        const dx = getDistanceX(playerBottomLeft, blockTopRight);
        const dy = getDistanceY(playerBottomLeft, blockTopRight);
        if (globals.collisionLogging)
          console.log('collision on top right corner of platform');

        return dx < dy
          ? player.touchLeft(blockTopRight.x)
          : player.touchBottom(blockTopRight.y);
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
        const dx = getDistanceX(playerTopLeft, blockBottomRight);
        const dy = getDistanceY(playerTopLeft, blockBottomRight);
        if (globals.collisionLogging)
          console.log('collision on bottom right corner of platform');

        return dx < dy
          ? player.touchLeft(blockBottomRight.x)
          : player.touchTop(blockBottomRight.y);
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
        if (globals.collisionLogging)
          console.log(
            'collision on left side of platform (platform bigger than player)',
          );
        return player.touchRight(blockBottomLeft.x);
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
        if (globals.collisionLogging)
          console.log(
            'collision on right side of platform (platform bigger than player)',
          );
        return player.touchLeft(blockBottomRight.x);
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
        if (globals.collisionLogging)
          console.log(
            'collision on bottom side of platform (platform bigger than player)',
          );
        return player.touchTop(blockBottomLeft.y);
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
        if (globals.collisionLogging)
          console.log(
            'collision on top side of platform (platform bigger than player)',
          );
        return player.touchBottom(blockTopLeft.y);
      }

      if (
        IsIntersecting(
          playerTopLeft,
          playerBottomLeft,
          blockTopLeft,
          blockTopRight,
        )
      ) {
        if (globals.collisionLogging)
          console.log(
            'collision on right side of platform (platform smaller than player)',
          );
        return player.touchLeft(blockTopRight.x);
      }

      if (
        IsIntersecting(
          playerTopRight,
          playerBottomRight,
          blockTopLeft,
          blockTopRight,
        )
      ) {
        if (globals.collisionLogging)
          console.log(
            'collision on left side of platform (platform smaller than player)',
          );
        return player.touchRight(blockTopLeft.x);
      }

      if (
        IsIntersecting(
          playerTopLeft,
          playerTopRight,
          blockTopLeft,
          blockBottomLeft,
        )
      ) {
        if (globals.collisionLogging)
          console.log(
            'collision on bottom side of platform (platform smaller than player)',
          );
        return player.touchTop(blockBottomLeft.y);
      }

      if (
        IsIntersecting(
          playerBottomLeft,
          playerBottomRight,
          blockTopLeft,
          blockBottomLeft,
        )
      ) {
        if (globals.collisionLogging)
          console.log(
            'collision on top side of platform (platform smaller than player)',
          );
        return player.touchBottom(blockTopLeft.y);
      }
    }

    /* MAP BOUNDS */
    if (
      player.getPosition().y >
      globals.height - globals.playerSize.y
    ) {
      player.touchBottom(globals.height);
      if (globals.collisionLogging)
        console.log('collision on the ground');
    }

    if (player.getPosition().x < 0) {
      player.touchLeft(0);
      if (globals.collisionLogging)
        console.log('collision on left wall');
    }

    if (
      player.getPosition().x >
      globals.width - globals.playerSize.x
    ) {
      player.touchRight(globals.width);
      if (globals.collisionLogging)
        console.log('collision on right wall');
    }
  }