export const makeHTMLImageElements = (
  fileList: string[],
): HTMLImageElement[] => {
  const images: HTMLImageElement[] = [];

  for (let file of fileList) {
    const image = new Image();
    image.src = file;
    images.push(image);
  }

  return images;
};
