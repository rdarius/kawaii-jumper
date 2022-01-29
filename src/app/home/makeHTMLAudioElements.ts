export const makeHTMLAudioElements = (
  fileList: string[],
): HTMLAudioElement[] => {
  const sounds: HTMLAudioElement[] = [];

  for (let file of fileList) {
    sounds.push(new Audio(file));
  }

  return sounds;
};
