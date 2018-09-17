import React, { Component } from 'react';
import Hls from 'hls.js';

export default class HLSSource extends Component {
  constructor(props, context) {
    super(props, context);
    this.hls = new Hls();
  }

  componentDidMount() {
    this.handleInit();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    return this.props.src !== prevProps.src;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot) {
      this.handleInit();
    }
  }

  componentWillUnmount() {
    // destroy hls video source
    if (this.hls) {
      this.hls.destroy();
    }
  }

  handelDestroy() {
    if (this.hls) {
      this.hls.destroy();
    }
  }

  handleInit = () => {
    // `src` is the property get from this component
    // `video` is the property insert from `Video` component
    // `video` is the html5 video element
    const { src, video } = this.props;
    // load hls video source base on hls.js
    if (Hls.isSupported()) {
      if (!src) return;
      this.hls.loadSource(src);
      this.hls.attachMedia(video);
      this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });
    }
  };

  render() {
    return <source src={this.props.src} type={this.props.type || 'application/x-mpegURL'} />;
  }
}
