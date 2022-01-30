import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { Socket } from 'ngx-socket-io';
import { SocketFour } from '../app.module';

@NgModule({
  imports: [CommonModule, IonicModule, HomePageRoutingModule],
  declarations: [HomePage],
  providers: [{provide: Socket, useClass: SocketFour}]
})
export class HomePageModule4 {}

