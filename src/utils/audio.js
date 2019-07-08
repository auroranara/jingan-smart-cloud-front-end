const DEFAULT_SRC = 'http://data.jingan-china.cn/5a03005e74406.mp3';

export default class BigScreenAudio {
  constructor(src=DEFAULT_SRC) {
    const audio = this.audio = new Audio();
    audio.src = src;
  }

  play() {
    const audio = this.audio;
    audio.currentTime = 0;
    audio.play();
  }
}
