import { Injectable, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Socket, SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { NativeAudio } from '@ionic-native/native-audio/ngx';


@Injectable()
export class SocketOne extends Socket {
  constructor() {
    super({ url: 'https://ggj2022-s1.rapalis.lt', options: {} });
  }
}

@Injectable()
export class SocketTwo extends Socket {
  constructor() {
    super({ url: 'https://ggj2022-s2.rapalis.lt', options: {} });
  }
}

@Injectable()
export class SocketThree extends Socket {
  constructor() {
    super({ url: 'https://ggj2022-s3.rapalis.lt', options: {} });
  }
}

@Injectable()
export class SocketFour extends Socket {
  constructor() {
    super({ url: 'https://ggj2022-s4.rapalis.lt', options: {} });
  }
}

@Injectable()
export class SocketFive extends Socket {
  constructor() {
    super({ url: 'https://ggj2022-s5.rapalis.lt', options: {} });
  }
}

@Injectable()
export class SocketSix extends Socket {
  constructor() {
    super({ url: 'https://ggj2022-s6.rapalis.lt', options: {} });
  }
}

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    RouterModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    NativeAudio,
    SocketOne,
    SocketTwo,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
