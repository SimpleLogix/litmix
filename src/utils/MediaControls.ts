export class MediaControls {
    constructor(private media: HTMLMediaElement) { }

    play() {
        this.media.play();
    }

    pause() {
        this.media.pause();
    }

    setSource(url: string) {
        this.media.src = url;
        this.media.load(); 
      }

    on(event: string, callback: Function) {
        this.media.addEventListener(event, () => callback());
    }
    
}