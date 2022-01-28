import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  pageHeight = window.innerHeight;
  pageWidth = window.innerWidth;

  constructor() {
  }

  ngOnInit(): void {
    this.canvas = document.getElementById('game') as HTMLCanvasElement;
    this.context = this.canvas.getContext('2d');
    this.scaleScreen();
    this.gameLoop();
  }

  gameLoop() {

    this.drawPlayer();

    requestAnimationFrame(() => {this.gameLoop();});
  }

  drawPlayer() {
    this.context.fillStyle = 'white';
    this.context.fillRect(50, 50, 50, 50);
  }


  setCanvasSize(w: number, h: number) {
    this.canvas.style.height = h + 'px';
    this.canvas.style.width = w + 'px';
    this.canvas.height = h;
    this.canvas.width = w;
  }

  scaleScreen() {
    const scaleX = this.pageWidth / 9;
    const scaleY = this.pageHeight / 16;
    if (scaleX > scaleY) { // width is longer, calculate based on height
      return this.setCanvasSize(this.pageHeight / 16 * 9, this.pageHeight);
    }
    this.setCanvasSize(this.pageWidth, this.pageWidth / 9 * 16) // height is longer, calculate based on width
  }

}
