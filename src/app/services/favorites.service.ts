import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private _favorites = new BehaviorSubject<any[]>([]);
  favorites$ = this._favorites.asObservable();

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.create();
    const storedFavorites = await this.storage.get('favorites');
    this._favorites.next(storedFavorites || []);
  }

  get favorites() {
    return this._favorites.getValue();
  }

  async addFavorite(track: any) {
    const currentFavorites = this._favorites.getValue();
    currentFavorites.push(track);
    this._favorites.next(currentFavorites);
    await this.storage.set('favorites', currentFavorites);
  }

  async removeFavorite(trackId: string) {
    const currentFavorites = this._favorites.getValue();
    const updatedFavorites = currentFavorites.filter(t => t.id !== trackId);
    this._favorites.next(updatedFavorites);
    await this.storage.set('favorites', updatedFavorites);
  }

  isFavorite(trackId: string): boolean {
    return this.favorites.some(track => track.id === trackId);
  }

  async createPlaylist(playlistName: string) {
    const currentFavorites = this._favorites.getValue();
    // Simpan logika untuk membuat playlist di sini
    const newPlaylist = {
      id: Date.now().toString(), // Contoh pembuatan ID playlist
      name: playlistName,
      tracks: currentFavorites.map(track => track.id) // Contoh menggunakan ID lagu dari favorit
    };
    // Simpan playlist ke storage atau lakukan operasi sesuai kebutuhan
    await this.storage.set('playlist_' + newPlaylist.id, newPlaylist);
    console.log('Playlist created:', newPlaylist);
  }
}
