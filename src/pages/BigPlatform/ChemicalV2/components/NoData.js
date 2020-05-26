import React, { PureComponent } from 'react';
// import noData from '@/pages/BigPlatform/NewUnitFireControl/imgs/noData.png';

const noData = 'http://data.jingan-china.cn/v2/chem/screen/noData.png';
export default class NoData extends PureComponent {
  render() {
    const { msg, style, ...restProps } = this.props;
    return (
      <div
        style={{
          height: '400px',
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'center',
          color: '#4f6793',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          ...style,
        }}
        {...restProps}
      >
        <img src={noData} style={{ width: '30%', height: 'auto' }} alt="noData" />
        <div style={{ marginTop: '15px' }}>{msg || '暂无数据'}</div>
      </div>
    );
  }
}
