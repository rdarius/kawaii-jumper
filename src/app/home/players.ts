import { applyGravity } from './applyGravity';
import { Globals } from './globals';
import { Player } from './player';
import {
  PlayerDTO,
  PlayerDTOList,
  PlayerList,
  StringNumber,
  StringVector,
  Vector,
} from './types.dto';

export class Players {
  private globals: Globals;
  private players: PlayerList = {};
  private static instance: Players;

  private constructor() {
    this.globals = Globals.getInstance();
  }

  public static getInstance(): Players {
    if (!this.instance) {
      this.instance = new Players();
    }
    return this.instance;
  }

  public tick(): void {
    for (let id of this.getPlayerIds()) {
      if (this.getPlayer(id).isGrounded()) {
        continue;
      }
      this.getPlayer(id).applyGravity();
      this.getPlayer(id).move();
    }
  }

  public resetVelocity(id: string): void {
    this.getPlayer(id).resetVelocity();
  }

  public resetMyVelocity(): void {
    this.resetVelocity(this.globals.socketId);
  }

  public getPlayerIds(): string[] {
    return Object.keys(this.players);
  }

  public getPlayer(id: string): Player {
    return this.players[id];
  }

  public addMultiplaPlayers(players: PlayerDTOList): void {
    for (let player of Object.keys(players)) {
      this.addPlayer(players[player]);
    }
  }

  public addPlayer(player: PlayerDTO): Players {
    this.players[player.id] = new Player(player.id, player);
    return this;
  }

  public removePlayer(id: string): Players {
    delete this.players[id];
    return this;
  }

  public updatePlayerPosition(playersPosition: StringVector): void {
    for (let id of Object.keys(playersPosition)) {
      this.getPlayer(id).updatePosition(playersPosition[id]);
    }
  }

  public updatePlayerDirection(playersDirection: StringNumber): void {
    for (let id of Object.keys(playersDirection)) {
      this.getPlayer(id).updateDirection(playersDirection[id]);
    }
  }

  public updatePlayerColor(playersColor: { [key: string]: number }): void {
    for (let id of Object.keys(playersColor)) {
      this.getPlayer(id).updateColor(playersColor[id]);
    }
  }

  public getMyself(): Player {
    return this.getPlayer(Globals.getInstance().socketId);
  }

  public draw(): void {
    for (let id of this.getPlayerIds()) {
      this.players[id].draw();
    }
  }
}
