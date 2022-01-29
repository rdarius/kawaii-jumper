import { Globals } from './globals';

export class MySocket {
  private static instance: MySocket;
  private globals: Globals;

  private constructor() {
    this.globals = Globals.getInstance();
  }

  public static getInstance(): MySocket {
    if (!this.instance) {
      this.instance = new MySocket();
    }
    return this.instance;
  }

  public onId(callback: CallableFunction): void {
    this.globals.socket.on('takeYourIdAndLeaveMeAlone', callback);
  }

  public onPlayerConnected(callback: CallableFunction): void {
    this.globals.socket.on('connectedPlayers', callback);
  }

  public onNewPlayerConnected(callback: CallableFunction): void {
    this.globals.socket.on('newPlayer', callback);
  }

  public onPlayerDisconnected(callback: CallableFunction): void {
    this.globals.socket.on('playerDisconnected', callback);
  }

  public onUpdatedPlayerPosition(callback: CallableFunction): void {
    this.globals.socket.on('updatedPlayerPositions', callback);
  }

  public onUpdatedPlayerColor(callback: CallableFunction): void {
    this.globals.socket.on('updatedPlayerColor', callback);
  }

  public onUpdatedPlayerDirection(callback: CallableFunction): void {
    this.globals.socket.on('updatedPlayerDirection', callback);
  }

  public onMap(callback: CallableFunction): void {
    this.globals.socket.on('takeTheMapAndBeQuiet', callback);
  }
}
