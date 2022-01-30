import { Component, OnDestroy, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Globals } from './globals';
import { Platform } from '@ionic/angular';
import { setupSocketListeners } from './setupSocketListeners';
import { gameLoop } from './gameLoop';
import { setListeners } from './listenerEvents';
import { Players } from './players';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  globals: Globals;
  players: Players;

  constructor(
    private readonly socket: Socket,
    private readonly nativeAudio: NativeAudio,
    private readonly platform: Platform,
  ) {
  }

  ionViewDidLeave() {
    this.globals.socket.removeAllListeners();
    this.globals.socket.disconnect();
  }
  
  ionViewWillEnter() {
    this.globals = Globals.getInstance();
    this.players = Players.getInstance();
    this.globals.socket = this.socket;
    setupSocketListeners();
  }

  ionViewDidEnter() {
    this.players.removeAllPlayers();
    this.globals.map = [];

    this.globals.nativeAudio = this.nativeAudio;
    this.globals.platform = this.platform;
    this.globals.setupCanvas();
    this.socket.connect();
    setListeners();
    gameLoop();
    
    this.nativeAudio.preloadSimple('jump', 'assets/jump.wav');
    this.nativeAudio.preloadSimple('land', 'assets/land.wav');
    this.globals.canvasOffset.y =
      (window.innerHeight - parseInt(this.globals.canvas.style.height)) / 2;
    this.globals.canvasOffset.x =
      (window.innerWidth - parseInt(this.globals.canvas.style.width)) / 2;
  }

}
