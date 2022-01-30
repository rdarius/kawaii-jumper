import { applyGravity } from './applyGravity';
import { DeltaTime } from './deltaTime';
import { getAngleBetweenTwoPoints } from './getAngleBetweenTwoPoints';
import { getXFromAngle } from './getXFromAngle';
import { getYFromAngle } from './getYFromAngle';
import { Globals } from './globals';
import { PlayerDTO, Vector } from './types.dto';

export class Player {
  private readonly globals: Globals;
  private readonly deltaTime: DeltaTime;
  private id: string;
  private position: Vector;
  private name: string;
  private movingVelocity: Vector;
  private color: number;
  private direction: number;
  private grounded: boolean;

  public constructor(id: string, data: PlayerDTO) {
    this.globals = Globals.getInstance();
    this.deltaTime = DeltaTime.getInstance();
    this.id = id;
    this.position = data.position;
    this.name = data.name;
    this.movingVelocity = data.movingVelocity;
    this.color = data.color;
    this.direction = data.direction;
    this.grounded = true;
  }

  public applyGravity() {
    this.movingVelocity = {
      ...applyGravity(this.movingVelocity, this.deltaTime.getDeltaTime()),
    };
    console.log(this.movingVelocity);
  }

  public resetVelocity() {
    this.movingVelocity = { x: 0, y: 0 };
  }

  public updatePosition(position: Vector): void {
    this.position = { ...position };
  }

  public updateDirection(direction: number): void {
    this.direction = direction;
  }

  public updateColor(color: number): void {
    this.color = color;
  }

  public getId(): string {
    return this.id;
  }

  public getPosition(): Vector {
    return { ...this.position };
  }

  public getName(): string {
    if (this.isMyself() && localStorage.getItem('username')) {
      return localStorage.getItem('username');
    }
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  } 

  public getColor(): number {
    return this.color;
  }

  public getDirection(): number {
    return this.direction;
  }

  public isGrounded(): boolean {
    return this.grounded;
  }

  public setGrounded(grounded: boolean): void {
    this.grounded = grounded;
  }

  public getMovingVelocity(): Vector {
    return { ...this.movingVelocity };
  }

  public swapColor(): void {
    this.color = this.color === 0 ? 1 : 0;
  }

  public getJumpPower(): number {
    return Math.abs(getXFromAngle(Date.now() / 1000) * 1.4);
  }

  private _getJumpDirection(x: number, y: number) {
    return getAngleBetweenTwoPoints(
      {
        x: this.position.x + this.globals.playerSize.x / 2,
        y: this.position.y + this.globals.playerSize.y / 2,
      },
      {
        x: x * this.globals.canvasScale,
        y: y * this.globals.canvasScale,
      },
    );
  }

  public jump(click: Vector): void {
    const jumpPower = this.getJumpPower();
    const angle = this._getJumpDirection(click.x, click.y);
    this.movingVelocity.x = getXFromAngle(angle) * jumpPower;
    this.movingVelocity.y = getYFromAngle(angle) * jumpPower;
    this.direction = this.movingVelocity.x > 0 ? 1 : 0;
    console.log(this.movingVelocity, this.direction);
  }

  public move(): void {
    this.position.x += this.movingVelocity.x * this.deltaTime.getDeltaTime();
    this.position.y += this.movingVelocity.y * this.deltaTime.getDeltaTime();
  }

  public touchBottom(resetPoint: number) {
    this.position.y = resetPoint - this.globals.playerSize.y - 1;
    this.grounded = true;
    if (this.isMyself()) {
      if(this.globals.platform.is('cordova')) {
        this.globals.nativeAudio.play('land').then(console.log, console.error);
      } else {
        this.globals.sounds[1].play();
      }
    }
    this.resetVelocity();
  }

  public touchTop(resetPoint: number) {
    this.position.y = resetPoint + 1;
    this.resetVelocity();
  }

  public touchLeft(resetPoint: number) {
    this.position.x = resetPoint + 1;
    this.resetVelocity();
  }

  public touchRight(resetPoint: number) {
    this.position.x = resetPoint - this.globals.playerSize.x - 1;
    this.resetVelocity();
  }

  public isMyself(): boolean {
    return this.id === this.globals.socketId;
  }

  public draw() {
    this.globals.context.drawImage(
      this.globals.playerImages[this.color * 2 + this.direction],
      this.position.x,
      this.position.y,
      this.globals.playerSize.x,
      this.globals.playerSize.y,
    );
    this.globals.context.fillStyle = 'black';
    this.globals.context.textAlign = 'center';
    this.globals.context.font = '25px Arial';
    this.globals.context.fillText(
      this.getName(),
      this.position.x + this.globals.playerSize.x / 2,
      this.position.y - 30,
    );
  }
}
