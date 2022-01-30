import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Platform } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { MapTile } from '../../../../Kawaii-Jumper-server/src/mapTile';
import { makeHTMLAudioElements } from './makeHTMLAudioElements';
import { makeHTMLImageElements } from './makeHTMLImageObjects';
import { Players } from './players';
import { scaleScreen } from './scaleScreen';
import { Vector } from './types.dto';

export class Globals {
  public width: number = 0;
  public height: number = 0;
  public canvasScale: number = 0;
  public pageWidth: number = window.innerWidth;
  public pageHeight: number = window.innerHeight;
  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;
  public playerImages: HTMLImageElement[] = [];
  public platformImages: HTMLImageElement[] = [];
  public socket: Socket;
  public socketId: string;
  public colors: string[] = ['#FF63C8', '#79e7ff'];
  public sounds: HTMLAudioElement[] = [];
  public playerSize: Vector = { x: 50, y: 34 };
  public map: MapTile[] = [];
  public backgroudnImage: HTMLImageElement;
  public nativeAudio: NativeAudio;
  public platform: Platform;
  public collisionLogging: boolean = false;
  public mapBuilder: boolean = false;
  public lastPointerPosition: Vector = { x: 0, y: 0 };
  public builtMap: MapTile[] = [];
  public myLastPosition: Vector = { x: 0, y: 0 };
  public mapBuilderTile: number = 0;
  public canvasOffset: Vector = { x: 0, y: 0 };
  public keysDown: boolean[] = [];

  private readonly playerImageFiles: string[] = [
    '/assets/slime-1-left.png',
    '/assets/slime-1-right.png',
    '/assets/slime-2-left.png',
    '/assets/slime-2-right.png',
  ];
  private readonly platformImageFiles: string[] = [
    '/assets/platform-1.png',
    '/assets/platform-2.png',
  ];
  private readonly soundFiles: string[] = [
    '/assets/jump.wav',
    '/assets/land.wav',
  ];
  private static instance: Globals;

  private constructor() {
    this.setupImages();
    this.setupSounds();
  }

  private setupImages(): void {
    this.playerImages = makeHTMLImageElements(this.playerImageFiles);
    this.platformImages = makeHTMLImageElements(this.platformImageFiles);
    this.backgroudnImage = makeHTMLImageElements(['/assets/bg.png'])[0];
  }
  private setupSounds(): void {
    this.sounds = makeHTMLAudioElements(this.soundFiles);
  }

  public static getInstance(): Globals {
    if (!this.instance) {
      this.instance = new Globals();
    }
    return this.instance;
  }

  public setupCanvas() {
    this.canvas = document.getElementById('game') as HTMLCanvasElement;
    this.context = this.canvas.getContext('2d');
    scaleScreen();
  }
}
