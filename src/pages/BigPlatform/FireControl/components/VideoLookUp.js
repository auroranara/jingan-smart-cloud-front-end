import React, { PureComponent } from 'react';
import { Button, Col, Icon, Input, Row } from 'antd';

import styles from './VideoLookUp.less';

// const list = [...Array(20).keys()].map(i => ({ id: i, name: `企业${i}` }));

const VIDEO_LOOK_UP = 'videoLookUp';

export default class VideoLookUp extends PureComponent {
  node = null;

  handleSearch = () => {
    const { fetchLookUpVideo } = this.props;
    fetchLookUpVideo && fetchLookUpVideo(this.node.input.value.trim());
  };

  handleVideoShow = (list) => {
    const { handleVideoShow, dispatch } = this.props;

    if (!list.length)
      return;

    dispatch({ type: 'bigFireControl/saveLookUpCamera', payload: list});
    handleVideoShow(list[0].keyId, true, VIDEO_LOOK_UP);
  };

  render() {
    // const { showed } = this.props;
    const { showed, data: list=[] } = this.props;

    return (
      <div style={{ display: showed ? 'block' : 'none', color: '#FFF' }} className={styles.container}>
        <Row gutter={6} style={{ marginBottom: 20 }}>
          <Col span={18}>
            <Input
              onPressEnter={this.handleSearch}
              ref={node => { this.node = node; }}
              placeholder="请输入单位名称"
              style={{ background: 'rgba(9,103,211,0.2)', border: 'none', color: '#FFF' }}
            />
          </Col>
          <Col span={6}>
            <Button
              onClick={this.handleSearch}
              style={{ background: 'rgba(9,103,211,0.5)', border: 'none', color: '#FFF', width: '100%' }}
            >
              查询
            </Button>
          </Col>
        </Row>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <tbody>
              {list.map(({ id, name, deviceAddressInfoList=[] }, index) => (
                <tr key={id}>
                  <td>{index + 1}</td>
                  <td>{name}</td>
                  <td>
                    <Icon type="video-camera" onClick={() => this.handleVideoShow(deviceAddressInfoList)} style={{ cursor: 'pointer' }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
