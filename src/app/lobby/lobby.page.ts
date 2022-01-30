import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.page.html',
  styleUrls: ['./lobby.page.scss'],
})
export class LobbyPage implements OnInit {

  username = '';

  user = {
    username: ''
  }

  constructor() {}

  ngOnInit() {
    this.username = localStorage.getItem('username');
  }
  
  setName() {
    this.username = this.user.username;
    if (this.username.length > 16) {
      this.username = this.username.substring(0, 16);
    }
    localStorage.setItem('username', this.username);
  }

}
