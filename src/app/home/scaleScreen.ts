import { Globals } from "./globals";
import { setCanvasSize } from "./setCanvasSize";

export const scaleScreen = () => {
    const scaleX = Globals.getInstance().pageWidth / 9;
    const scaleY = Globals.getInstance().pageHeight / 16;
    if (scaleX > scaleY) { // width is longer, calculate based on height
      return setCanvasSize((Globals.getInstance().pageHeight / 16) * 9, Globals.getInstance().pageHeight);
    }
    setCanvasSize(Globals.getInstance().pageWidth, (Globals.getInstance().pageWidth / 9) * 16); // height is longer, calculate based on width
  }