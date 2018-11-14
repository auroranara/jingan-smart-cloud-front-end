import React, { Component, Fragment } from 'react';
import { Button, Card, Dropdown, Menu, Icon, Table } from 'antd';

const src =
  'http://data.jingan-china.cn/%E4%BD%A0%E5%8F%AF%E8%83%BD%E4%B8%8D%E7%9F%A5%E9%81%93%E7%9A%84X%E6%88%98%E8%AD%A62.pptx';
export default class Demo extends Component {
  renderIframe = () => {
    return (
      <iframe
        title="111"
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${src}`}
        width="1026px"
        height="793px"
        frameborder="0"
      >
        这是嵌入{' '}
        <a target="_blank" href="https://office.com">
          Microsoft Office
        </a>{' '}
        演示文稿，由{' '}
        <a target="_blank" href="https://office.com/webapps">
          Office Online
        </a>{' '}
        支持。
      </iframe>
    );
  };

  render() {
    return <div>{this.renderIframe()}</div>;
  }
}
