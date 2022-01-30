import { MapTile } from './mapTile';

export const drawMap = (
  mapTiles: MapTile[],
  context: CanvasRenderingContext2D,
  images: HTMLImageElement[],
) => {
  for (let tile of mapTiles) {
    context.drawImage(images[tile.color], tile.x, tile.y, tile.w, tile.h);
  }
};
