import React, { PureComponent } from 'react';
import { Col, Row } from 'antd';
import Link from 'umi/link';

import styles from './ProcessHead.less';
import VideoPlay from '@/pages/BigPlatform/NewFireControl/section/NewVideoPlay';

const SPAN = 6;

export default class ProcessHead extends PureComponent {
  state = {
    videoList: [],
    videoVisible: false,
  };

  showVideo = (videoList) => {
    this.setState({ videoVisible: true, videoList });
  };

  hideVideo = () => {
    this.setState({ videoVisible: false });
  };

  render() {
    const {
      title,
      list,
      data: { id, processName, reactionType, rawList, middleList, finalList, videoList: vList },
      ...restProps
    } = this.props;
    const { videoVisible, videoList } = this.state;

    const [material, intermediate, product] = [rawList, middleList, finalList].map(list => {
      if (Array.isArray(list) && list.length)
        return list.map(({ chineName }) => chineName).join(',');
      return '-';
    });
    return (
      <div className={styles.container} {...restProps}>
        <div className={styles.innerContainer}>
          <h3 className={styles.title}>{title}</h3>
          <Row className={styles.row}>
            <Col span={SPAN}>
              <span className={styles.label}>生产工艺名称:</span>
              {processName}
            </Col>
            <Col span={SPAN}>
              <span className={styles.label}>反应类型:</span>
              {reactionType}
              {vList && vList.length ? <span className={styles.camera} onClick={e => this.showVideo(vList)} /> : null}
            </Col>
          </Row>
          <Row>
            <Col span={SPAN}>
              <span className={styles.label}>生产原料:</span>
              {material}
            </Col>
            <Col span={SPAN}>
              <span className={styles.label}>中间产品:</span>
              {intermediate}
            </Col>
            <Col span={SPAN}>
              <span className={styles.label}>最终产品:</span>
              {product}
              <Link className={styles.more} to={`/major-hazard-info/high-risk-process/detail/${id}`} target="_blank">更多信息</Link>
            </Col>
          </Row>
          <span className={styles.rect} />
          <VideoPlay
            showList={true}
            videoList={videoList}
            visible={videoVisible}
            keyId={videoList && videoList.length ? videoList[0].keyId : undefined}
            handleVideoClose={this.hideVideo}
            isTree={false}
          />
        </div>
      </div>
    );
  }
}
