import React, { PureComponent } from 'react';
import noData from '../imgs/noData.png';

export default class NoData extends PureComponent {
  render() {
    const { msg, ...restProps } = this.props;
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'center',
          color: '#4f6793',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        {...restProps}
      >
        <img
          src={noData}
          style={{ width: '36%', height: 'auto', marginTop: '-150px' }}
          alt="noData"
        />
        <div style={{ marginTop: '15px' }}>{msg || '暂无数据'}</div>
      </div>
    );
  }
}
