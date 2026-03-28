import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

export const getFFmpeg = async (): Promise<FFmpeg> => {
  if (ffmpeg) {
    return ffmpeg;
  }

  ffmpeg = new FFmpeg();

  // Load ffmpeg
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });

  return ffmpeg;
};

export const processVideo = async (
  file: File,
  command: string[],
  outputName: string,
  onProgress: (progress: number) => void,
  mimeType: string = 'video/mp4'
): Promise<Blob> => {
  const ff = await getFFmpeg();
  
  ff.on('progress', ({ progress }) => {
    onProgress(progress * 100);
  });

  const inputName = 'input' + file.name.substring(file.name.lastIndexOf('.'));
  await ff.writeFile(inputName, await fetchFile(file));

  // Replace placeholder in command with actual input name
  const finalCommand = command.map(c => c === '{input}' ? inputName : c);
  
  await ff.exec(finalCommand);

  const data = await ff.readFile(outputName);
  
  // Clean up
  await ff.deleteFile(inputName);
  await ff.deleteFile(outputName);
  
  return new Blob([new Uint8Array(data as Uint8Array)], { type: mimeType });
};
