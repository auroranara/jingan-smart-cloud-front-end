import React, { Component } from 'react';
import { Upload } from 'antd';
import { connect } from 'dva';

@connect(({ common }) => ({
  common,
}))
export default class CustomUpload extends Component {


  render() {
    const {
      value,
      onChange,
    } = this.props;

    return (
      <div>123</div>
    );
  }
}
