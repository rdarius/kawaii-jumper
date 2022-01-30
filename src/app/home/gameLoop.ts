import { DeltaTime } from "./deltaTime";
import { drawMap } from "./drawMap";
import { drawPointer } from "./drawPointer";
import { Globals } from "./globals";
import { Players } from "./players";
import { updatePlayerPosition } from "./updatePlayerPosition";

export const gameLoop = () => {
    const globals = Globals.getInstance();
    const deltaTime = DeltaTime.getInstance();
    const players = Players.getInstance();
    globals.context.fillStyle = 'gray';
    globals.context.drawImage(
      globals.backgroudnImage,
      0,
      0,
      globals.width,
      globals.height,
    );

    drawMap(
      globals.map,
      globals.context,
      globals.platformImages,
    );
    if (globals.mapBuilder) {
      drawMap(globals.builtMap, globals.context, globals.platformImages);
    }

    deltaTime.updateDeltaTime();

    players.tick();
    players.draw();

    updatePlayerPosition();
    drawPointer();

    requestAnimationFrame(() => {
      gameLoop();
    });
  }