import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private clientId = 'ba14f07453a045569d3f49c7ce5d1655';
  private clientSecret = 'b0c29bb8af44437ab39df1d88f08e0ed';
  private redirectUri = 'http://localhost:8100';  // Pastikan URI ini sesuai dengan yang terdaftar di Spotify Developer Dashboard
  private accessToken: string | null = null;

  constructor() {
    this.getAccessToken();
  }

  async getAccessToken() {
    const response = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`)
      }
    });
    this.accessToken = response.data.access_token;
  }

  async authorize() {
    window.location.href = `https://accounts.spotify.com/authorize?response_type=token&client_id=${this.clientId}&scope=user-read-private%20user-read-email&redirect_uri=${encodeURIComponent(this.redirectUri)}`;
  }

  async searchTracks(query: string) {
    if (!this.accessToken) await this.getAccessToken();
    const response = await axios.get(`https://api.spotify.com/v1/search`, {
      params: { q: query, type: 'track' },
      headers: { 'Authorization': `Bearer ${this.accessToken}` }
    });
    return response.data.tracks.items;
  }

  async getTrackDetails(id: string) {
    if (!this.accessToken) await this.getAccessToken();
    const response = await axios.get(`https://api.spotify.com/v1/tracks/${id}`, {
      headers: { 'Authorization': `Bearer ${this.accessToken}` }
    });
    return response.data;
  }

  async getNewReleases() {
    if (!this.accessToken) await this.getAccessToken();
    const response = await axios.get('https://api.spotify.com/v1/browse/new-releases', {
      headers: { 'Authorization': `Bearer ${this.accessToken}` }
    });
    return response.data.albums.items;
  }

  async getTrackLyrics(artist: string, track: string) {
    const response = await axios.get(`https://api.lyrics.ovh/v1/${artist}/${track}`);
    return response.data.lyrics;
  }

  setAccessToken(token: string) {
    this.accessToken = token;
  }
}
