import { Globals } from './globals';
import { Vector } from './types.dto';

export class MySocket {
  private static instance: MySocket;
  private globals: Globals;

  private readonly debug = true;

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
    if (this.debug) console.log('socket >> takeYourIdAndLeaveMeAlone');
    this.globals.socket.on('takeYourIdAndLeaveMeAlone', callback);
    if (this.debug) console.log('socket << setMyUsername');
    this.globals.socket.emit('setMyUsername', localStorage.getItem('username'));
  }

  public onPlayerConnected(callback: CallableFunction): void {
    if (this.debug) console.log('socket >> connectedPlayers');
    this.globals.socket.on('connectedPlayers', callback);
  }

  public onNameChanged(callback: CallableFunction): void {
    if (this.debug) console.log('socket >> nameChanged');
    this.globals.socket.on('nameChanged', callback);
  }

  public onNewPlayerConnected(callback: CallableFunction): void {
    if (this.debug) console.log('socket >> newPlayer');
    this.globals.socket.on('newPlayer', callback);
  }

  public onPlayerDisconnected(callback: CallableFunction): void {
    if (this.debug) console.log('socket >> playerDisconnected');
    this.globals.socket.on('playerDisconnected', callback);
  }

  public onUpdatedPlayerPosition(callback: CallableFunction): void {
    if (this.debug) console.log('socket >> updatedPlayerPositions');
    this.globals.socket.on('updatedPlayerPositions', callback);
  }

  public onUpdatedPlayerColor(callback: CallableFunction): void {
    if (this.debug) console.log('socket >> updatedPlayerColor');
    this.globals.socket.on('updatedPlayerColor', callback);
  }

  public onUpdatedPlayerDirection(callback: CallableFunction): void {
    if (this.debug) console.log('socket >> updatedPlayerDirection');
    this.globals.socket.on('updatedPlayerDirection', callback);
  }

  public onMap(callback: CallableFunction): void {
    if (this.debug) console.log('socket >> takeTheMapAndBeQuiet');
    this.globals.socket.on('takeTheMapAndBeQuiet', callback);
  }

  public sendUpdatedColor(color: number): void {
    if (this.debug) console.log('socket << updatedColor');
    this.globals.socket.emit('updatedColor', color);
  }

  public sendUpdatedPosition(position: Vector): void {
    if (this.debug) console.log('socket << updatedPosition');
    this.globals.socket.emit('updatedPosition', position);
  }

  public sendUpdatedDirection(direction: number): void {
    if (this.debug) console.log('socket << updatedDirection');
    this.globals.socket.emit('updatedDirection', direction);
  }

}
