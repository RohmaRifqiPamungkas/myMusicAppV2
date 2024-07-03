// playlist.component.ts

import { Component, OnInit } from '@angular/core';
import { PlaylistService } from '../services/playlist.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit {
  playlists: any[] = [];
  newPlaylistName: string = '';

  constructor(private playlistService: PlaylistService) { }

  ngOnInit() {
    this.playlists = this.playlistService.getPlaylists();
  }

  createPlaylist() {
    if (this.newPlaylistName.trim() !== '') {
      this.playlistService.createPlaylist(this.newPlaylistName);
      this.newPlaylistName = '';
    }
  }
}
