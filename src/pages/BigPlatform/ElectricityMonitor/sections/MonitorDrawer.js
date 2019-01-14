import React, { Fragment, PureComponent } from 'react';

import {
  DrawerContainer,
  DrawerSection,
  OvSelect,
} from '@/pages/BigPlatform/NewFireControl/components/Components';
import VideoPlay from '@/pages/BigPlatform/NewFireControl/section/VideoPlay';
import { DotItem, Gauge } from '../components/Components';
import styles from './MonitorDrawer.less';
import locationIcon from '../imgs/location.png';
import personIcon from '../imgs/person.png';
import cameraIcon from '../imgs/camera.png';

const TYPE = 'monitor';
const LABELS = ['正常', '告警', '预警', '失联'];
const COLORS = ['55,164,96', '248,51,41', '255,180,0', '159,159,159'];
const CHART_LABELS = ['A相温度', 'B相温度', 'C相温度', '零线温度', '漏电电流'];
const OPTIONS = ['全部', '正常', '告警', '预警', '失联'].map((d, i) => ({ value: i, desc: d }));
const RANGES = [[0, 150], [0, 150], [0, 150], [0, 150], [0, 1500]];
const UNITS = ['℃', '℃', '℃', '℃', 'mA'];

const VIDEO_STYLE = {
  width: '90%',
  marginLeft: '-43%',
};

export default class MonitorDrawer extends PureComponent {
  state={ videoVisible: false };

  handleClose = () => {
    const { handleDrawerVisibleChange } = this.props;
    handleDrawerVisibleChange(TYPE);
    // this.setState({ searchValue: '', grahp: 0, selected: 0 });
  };

  handleSelectChange = i => {
    // this.setState({ selected: i });
  };

  handleClickCamera = () => {
    this.setState({ videoVisible: true });
  };

  handleVideoClose = () => {
    this.setState({ videoVisible: false });
  };

  render() {
    const { visible, selected=0, data } = this.props;
    const { videoVisible } = this.state;

    const left = (
      <Fragment>
        <div className={styles.info}>
          <p className={styles.name}>无锡市新吴区机械制造有限公司</p>
          <p><span className={styles.location} style={{ backgroundImage: `url(${locationIcon})` }} />无锡市新吴区汉江路</p>
          <p><span className={styles.person} style={{ backgroundImage: `url(${personIcon})` }} />王长江 13888888888</p>
          <p className={styles.dots}>
            {[0, 0, 0, 0].map((n, i) => (
              <DotItem key={i} title={LABELS[i]} color={`rgb(${COLORS[i]})`} quantity={n} />
            ))}
          </p>
        </div>
        <div className={styles.select}>
          <OvSelect cssType={2} options={OPTIONS} value={selected} handleChange={this.handleSelectChange} />
        </div>
        <DrawerSection title="实时监测数据" style={{ position: 'relative' }}>
          <span
            className={styles.camera}
            style={{ backgroundImage: `url(${cameraIcon})` }}
            onClick={e => this.handleClickCamera()}
          />
          <div className={styles.gauges}>
            {CHART_LABELS.map((label, i) => (
              <Gauge title={label} value={0} range={RANGES[i]} unit={UNITS[i]} />
            ))}
          </div>
        </DrawerSection>
        <DrawerSection title="监测趋势图" >
          charts
        </DrawerSection>
        <VideoPlay
          showList={false}
          videoList={[]}
          visible={videoVisible}
          keyId={''}
          style={VIDEO_STYLE}
          handleVideoClose={this.handleVideoClose}
        />
      </Fragment>
    );

    return (
      <DrawerContainer
        title="报警信息"
        width={700}
        visible={visible}
        left={left}
        placement="right"
        rowStyle={{ height: 'calc(100% - 70px)' }}
        onClose={this.handleClose}
      />
    );
  }
}
