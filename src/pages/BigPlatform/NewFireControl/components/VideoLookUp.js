import React, { PureComponent } from 'react';
import { Button, Col, Icon, Input, message, Row, Tooltip } from 'antd';
import {findFirstVideo} from '@/utils/utils';

import styles from './VideoLookUp.less';
import cameraIcon from '../img/videoCamera.png';
import darkCameraIcon from '../img/videoCamera1.png';

// const list = [...Array(20).keys()].map(i => ({ id: i, name: `企业企业企业企业企业企业企业企业企业企业企业${i}` }));

const VIDEO_LOOK_UP = 'videoLookUp';
const LIGHT_COLOR = 'rgb(255, 255, 255)';
const DARK_COLOR = 'rgb(79, 103, 147)';

function TableCell(props) {
  const { index, name, onClick, isDark=false } = props;
  let company = name;
  if (name.length > 19)
    company = <Tooltip title={name} overlayClassName={styles.tooltip}>{name.slice(0, 20) + '...'}</Tooltip>;

  return (
    <div className={styles.tableCell} style={{ color: isDark ? DARK_COLOR : LIGHT_COLOR }}>
      <p>
        <span className={styles.index}>{index}</span>
        {company}
      </p>
      <span
        className={styles.camera}
        onClick={isDark ? null : onClick}
        style={{
          cursor: isDark ? 'auto' : 'pointer',
          backgroundImage: `url(${isDark ? darkCameraIcon : cameraIcon})`,
        }}
      />
    </div>
  );
}

export default class VideoLookUp extends PureComponent {
  state = { currentIndex: -1 };

  node = null;

  handleSearch = () => {
    const { fetchLookUpVideo } = this.props;
    fetchLookUpVideo && fetchLookUpVideo(this.node.input.value.trim());
  };

  handleVideoShow = (index, list) => {
    const { handleVideoShow, dispatch } = this.props;

    if (!list.length) {
      message.warn('当前企业没有可播放的视频');
      return;
    }

    this.setState({ currentIndex: index });
    dispatch({ type: 'bigFireControl/saveLookUpCamera', payload: list});
    handleVideoShow(findFirstVideo(list).id, true, VIDEO_LOOK_UP);
  };

  render() {
    const { showed, videoVisible, data: list=[] } = this.props;
    const { currentIndex } = this.state;

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
          {/* <table className={styles.table}>
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
          </table> */}
          {list.map(({ id, name, deviceAddressInfoList=[],deviceAddressInfoTreeList=[] }, index) => (
            <TableCell
              key={id}
              name={name}
              isDark={videoVisible && index === currentIndex ? true : false}
              // isDark={Math.random() > 0.5 ? true : false}
              index={index + 1}
              onClick={() => this.handleVideoShow(index, deviceAddressInfoTreeList)}
            />
            ))}
        </div>
      </div>
    );
  }
}
