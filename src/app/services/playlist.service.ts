// playlist.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  playlists: any[] = [];

  constructor() { }

  createPlaylist(name: string) {
    const newPlaylist = {
      id: this.generateId(),
      name: name,
      tracks: []
    };
    this.playlists.push(newPlaylist);
  }

  getPlaylists() {
    return this.playlists;
  }

  private generateId(): string {
    // Function to generate a unique ID for playlist (can use UUID or custom logic)
    return Math.random().toString(36).substr(2, 9);
  }
}
