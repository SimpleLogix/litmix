export class MediaControls {
    element: HTMLMediaElement;
    private isLoading: boolean = false;

    constructor(private media: HTMLMediaElement) {
        this.element = media;
        this.media.addEventListener('loadeddata', () => {
            this.isLoading = false;
        });
        this.media.addEventListener('error', () => {
            this.isLoading = false;
        });
        this.media.addEventListener('abort', () => {
            this.isLoading = false;
        });
    }

    play() {
        this.media.play();
    }

    pause() {
        this.media.pause();
    }

    setSource(url: string) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.media.src = url;
        this.media.load();
    }

    getTime() {
        return this.media.currentTime;
    }

    on(event: string, callback: Function) {
        this.media.addEventListener(event, () => callback());
    }

}