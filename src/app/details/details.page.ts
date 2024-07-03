import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyService } from '../services/spotify.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  trackId: string = '';
  track: any; // Atau gunakan tipe yang sesuai dengan respons API Spotify
  audio = new Audio();
  isPlaying = false;
  duration = 0;
  currentTime = 0;
  lyrics: string = '';

  constructor(private route: ActivatedRoute, private spotifyService: SpotifyService) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.trackId = id;
      this.loadTrackDetails();
    } else {
      console.error('No track ID found in route parameters');
    }
  }

  async loadTrackDetails() {
    try {
      const track = await this.spotifyService.getTrackDetails(this.trackId);
      if (track) {
        this.track = track; // Memasukkan detail trek ke properti track
        this.audio.src = this.track.preview_url;
        this.audio.ontimeupdate = () => {
          this.currentTime = this.audio.currentTime;
        };
        this.audio.onloadedmetadata = () => {
          this.duration = this.audio.duration;
        };
        this.audio.onended = () => {
          this.isPlaying = false;
        };
      } else {
        console.error('Track not found');
      }
    } catch (error) {
      console.error('Error loading track details', error);
    }
  }

  playPause() {
    if (this.isPlaying) {
      this.audio.pause();
    } else {
      this.audio.play();
    }
    this.isPlaying = !this.isPlaying;
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  onRangeChange(event: any) {
    this.audio.currentTime = event.detail.value;
  }

  async showLyrics() {
    try {
      // Memanggil metode getTrackLyrics dengan nama artis dan judul lagu dari track yang sedang dimuat
      this.lyrics = await this.spotifyService.getTrackLyrics(this.track.artists[0].name, this.track.name);
    } catch (error) {
      console.error('Error fetching lyrics', error);
    }
  }

  shareTrack() {
    if (navigator.share) {
      navigator.share({
        title: `${this.track.name} by ${this.track.artists[0].name}`,
        text: `Check out this track on Spotify!`,
        url: this.track.external_urls.spotify,
      }).then(() => {
        console.log('Successfully shared');
      }).catch((error) => {
        console.error('Error sharing', error);
      });
    } else {
      console.log('Sharing not supported');
      // Fallback for browsers that do not support Web Share API
      // You can implement a custom share dialog or show an alert here
    }
  }
}
