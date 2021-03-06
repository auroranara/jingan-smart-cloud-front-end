import React, { PureComponent } from 'react';
import { Player } from 'video-react';
import 'video-react/dist/video-react.css';

const offices = ['pptx', 'docx', 'xlsx', 'ppt', 'doc', 'xls'];
export default class Resource extends PureComponent {
  renderOffice = () => {
    const { src, extension, key, visible, styles } = this.props;
    return (
      <iframe
        title="office"
        visible={visible}
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${src}`}
        frameBorder="0"
        {...styles}
      >
        这是嵌入{' '}
        <a target="_blank" href="https://office.com">
          Microsoft Office
        </a>
        演示文稿，由
        <a target="_blank" href="https://office.com/webapps">
          Office Online
        </a>
        支持。
      </iframe>
    );
  };

  renderPdf = () => {
    const { src, key, styles } = this.props;
    return <embed src={src} {...styles} type="application/pdf" />;
  };

  renderVideo = () => {
    const { src, poster, key, fluid, styles } = this.props;
    return <Player fluid={fluid} playsInline poster={poster} src={src} {...styles} />;
  };

  render() {
    const { extension } = this.props;
    let result;
    if (extension === 'pdf') {
      result = this.renderPdf();
    } else if (offices.indexOf(extension) > -1) {
      result = this.renderOffice();
    } else if (extension === 'mp4' || extension === 'MP4') {
      result = this.renderVideo();
    }
    return <div>{result}</div>;
  }
}
