const DEFAULT_SRC = 'http://data.jingan-china.cn/5a03005e74406.mp3';

/* const audio = new BigScreenAudio(src);
   audio.play(); // 播放
   audio.toggleMute(); // play播放时，切换是否静音
*/
export default class BigScreenAudio {
  constructor(src=DEFAULT_SRC) {
    const audio = this.audio = new Audio();
    audio.src = src;
    this.mute = false;
  }

  play() {
    if (this.mute)
      return;

    const audio = this.audio;
    audio.currentTime = 0;
    audio.play();
  }

  toggleMute() {
    this.mute = !this.mute;
  }
}
