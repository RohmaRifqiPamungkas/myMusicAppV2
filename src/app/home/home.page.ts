// home.page.ts

import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../services/spotify.service';
import { FavoritesService } from '../services/favorites.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  newReleases: any[] = [];
  favoriteTracks: any[] = [];
  currentTrack: any = null;
  audio = new Audio();

  constructor(
    private spotifyService: SpotifyService,
    private favoritesService: FavoritesService
  ) { }

  async ngOnInit() {
    this.newReleases = await this.spotifyService.getNewReleases();
    this.favoritesService.favorites$.subscribe(favorites => {
      this.favoriteTracks = favorites;
    });
  }

  unFavorite(trackId: string) {
    this.favoritesService.removeFavorite(trackId);
  }

  playTrack(track: any) {
    if (this.currentTrack === track) {
      this.audio.pause();
      this.currentTrack = null;
    } else {
      if (this.currentTrack) {
        this.audio.pause();
      }
      this.currentTrack = track;
      this.audio.src = track.preview_url;
      this.audio.play();
    }
  }

  createPlaylist() {
    const playlistName = prompt('Enter playlist name:');
    if (playlistName) {
      this.favoritesService.createPlaylist(playlistName);
    }
  }
}
