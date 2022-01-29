import { Globals } from "./globals";

export const setCanvasSize = (w: number, h: number) => {
    Globals.getInstance().canvasScale = 1920 / h;
    Globals.getInstance().width = w * Globals.getInstance().canvasScale;
    Globals.getInstance().height = h * Globals.getInstance().canvasScale;
    Globals.getInstance().canvas.style.height = h + 'px';
    Globals.getInstance().canvas.style.width = w + 'px';
    Globals.getInstance().canvas.height = Globals.getInstance().height;
    Globals.getInstance().canvas.width = Globals.getInstance().width;
  }