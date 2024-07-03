import { Component, OnInit } from '@angular/core';
import { SpotifyService } from './services/spotify.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit() {
    this.handleAuthToken();
  }

  handleAuthToken() {
    const hash = window.location.hash.substring(1).split('&').reduce((initial, item) => {
      if (item) {
        const parts = item.split('=');
        initial[parts[0]] = decodeURIComponent(parts[1]);
      }
      return initial;
    }, {} as any);

    if (hash.access_token) {
      this.spotifyService.setAccessToken(hash.access_token);
      window.history.pushState({}, document.title, window.location.pathname); // Menghapus hash dari URL
    } else {
      this.spotifyService.authorize();
    }
  }
}
