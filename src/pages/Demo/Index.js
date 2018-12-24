import React, { Component, Fragment } from 'react';
import { Button, Card, Dropdown, Menu, Icon, Table } from 'antd';
import Resource from '@/components/Resource';

export default class Demo extends Component {
  state = {
    numPages: null,
    pageNumber: 1,
    pdfSrc: 'http://data.jingan-china.cn/%E6%BC%94%E7%A4%BA%E6%96%87%E6%A1%A3.pdf',
    pptSrc:
      'http://data.jingan-china.cn/%E4%BD%A0%E5%8F%AF%E8%83%BD%E4%B8%8D%E7%9F%A5%E9%81%93%E7%9A%84X%E6%88%98%E8%AD%A62.pptx',
    styles: {
      width: 1026,
      height: '100vh',
    },
  };

  render() {
    const { pdfSrc, pptSrc, styles } = this.state;
    return (
      <div>
        <Resource src={pdfSrc} styles={styles} extension="pdf" />
        <Resource src={pptSrc} styles={styles} extension="pptx" />
      </div>
    );
  }
}
