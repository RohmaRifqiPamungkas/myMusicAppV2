import { Component } from '@angular/core';
import { SpotifyService } from '../services/spotify.service';
import { FavoritesService } from '../services/favorites.service';
import { PlaylistService } from '../services/playlist.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage {
  query: string = '';
  searchResults: any[] = [];

  constructor(
    private spotifyService: SpotifyService,
    private favoritesService: FavoritesService,
    private playlistService: PlaylistService,
    private router: Router
  ) {}

  async search() {
    if (this.query.trim()) {
      this.searchResults = await this.spotifyService.searchTracks(this.query);
    }
  }

  async addFavorite(track: any) {
    await this.favoritesService.addFavorite(track);
  }

  async removeFavorite(trackId: string) {
    await this.favoritesService.removeFavorite(trackId);
  }

  isFavorite(trackId: string): boolean {
    return this.favoritesService.isFavorite(trackId);
  }

  async addToPlaylist(track: any) {
    // You can implement your playlist adding logic here
    // For example:
    const playlists = await this.playlistService.getPlaylists();
    // Assuming you have a method createPlaylist(name) in PlaylistService
    if (playlists.length === 0) {
      const playlistName = 'My Playlist'; // Replace with your desired playlist name logic
      await this.playlistService.createPlaylist(playlistName);
    }
    // Add the track to the selected playlist logic goes here
    // Example:
    // await this.playlistService.addTrackToPlaylist(track, selectedPlaylistId);
    // Redirect to details page after adding to playlist
    this.router.navigate(['/details', track.id]);
  }
}
