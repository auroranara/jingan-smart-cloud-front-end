import React, { PureComponent } from 'react';

const offices = ['pptx', 'docx', 'xlsx', 'ppt', 'doc', 'xls'];
export default class Resource extends PureComponent {
  renderOffice = () => {
    const { src, extension, key, styles } = this.props;
    return (
      <iframe
        title="office"
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${src}`}
        frameborder="0"
        style={styles}
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
    const { src, extension, key, styles } = this.props;
    return <embed src={src} style={styles} type="application/pdf" />;
  };

  render() {
    const { extension } = this.props;
    let result;
    if (extension === 'pdf') {
      result = this.renderPdf();
    } else if (offices.indexOf(extension) > -1) {
      result = this.renderOffice();
    }
    return <div>{result}</div>;
  }
}
