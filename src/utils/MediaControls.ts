export class MediaPlayer {
    constructor(private media: HTMLMediaElement) { }

    play() {
        this.media.play();
    }

    pause() {
        this.media.pause();
    }
}