import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import { Row, Col } from 'antd';
import DrawerContainer from '@/pages/BigPlatform/NewUnitFireControl/components/DrawerContainer';
import Wave from '@/jingan-components/Wave';
import styles from './StorageDrawer.less';
import { CardItem } from '../components/Components';
import storage from '../imgs/storage.png';
import iconAlarm from '@/assets/icon-alarm.png';

const creatNum = (num, m) => {
  return (Array(m).join(0) + num).slice(-m);
};
const list = [
  {
    store: '无水乙醇',
    type: '第3.2类 中闪点易燃液体',
    acture: '2t',
    max: '16t',
    contain: '16t',
    nowCotain: '5t',
    pressure: '0.1MPa',
    nowPressure: '0.15MPa',
  },
  {
    store: '无水乙醇',
    type: '第3.2类 中闪点易燃液体',
    acture: '10t',
    max: '16t',
    contain: '16t',
    nowCotain: '5t',
    pressure: '0.1MPa',
    nowPressure: '0.07MPa',
  },
  {
    store: '丙酮',
    type: '第3.1类  低闪点易燃液体',
    acture: '8t',
    max: '16t',
    contain: '16t',
    nowCotain: '5t',
    pressure: '0.1MPa',
    nowPressure: '0.08MPa',
  },
  {
    store: '二甲苯',
    type: '第3.3类  高闪点易燃液体',
    acture: '8t',
    max: '18t',
    contain: '16t',
    nowCotain: '5t',
    pressure: '0.1MPa',
    nowPressure: '0.07MPa',
  },
  {
    store: '乙酸乙酯',
    type: '第3.2类 中闪点易燃液体',
    acture: '8t',
    max: '18t',
    contain: '16t',
    nowCotain: '2t',
    pressure: '0.1MPa',
    nowPressure: '0.05MPa',
  },
  {
    store: '乙腈',
    type: '第3类 易燃液体，有毒品',
    acture: '10t',
    max: '16t',
    contain: '16t',
    nowCotain: '2t',
    pressure: '0.1MPa',
    nowPressure: '0.08MPa',
  },
  {
    store: '甲醇',
    type: '第3.2类 中闪点一级易燃液体，有毒品',
    acture: '10t',
    max: '16t',
    contain: '16t',
    nowCotain: '5t',
    pressure: '0.1MPa',
    nowPressure: '0.07MPa',
  },
  {
    store: 'N,N二甲基甲酰胺',
    type: '第3.3类  高闪点易燃液体',
    acture: '12t',
    max: '20t',
    contain: '16t',
    nowCotain: '5t',
    pressure: '0.1MPa',
    nowPressure: '0.07MPa',
  },
  {
    store: '乙腈',
    type: '第3类 易燃液体，有毒品',
    acture: '10t',
    max: '16t',
    contain: '16t',
    nowCotain: '5t',
    pressure: '0.1MPa',
    nowPressure: '0.07MPa',
  },
  {
    store: '二氯甲烷',
    type: '第6.1类  毒害品',
    acture: '10t',
    max: '30t',
    contain: '16t',
    nowCotain: '5t',
    pressure: '0.1MPa',
    nowPressure: '0.07MPa',
  },
  {
    store: '无水乙醇',
    type: '第3.2类 中闪点易燃液体',
    acture: '10t',
    max: '16t',
    contain: '16t',
    nowCotain: '5t',
    pressure: '0.1MPa',
    nowPressure: '0.07MPa',
  },
].map((item, index) => ({
  ...item,
  name: `${index + 1}号罐`,
  number: creatNum(index + 1, 4),
  icon: (
    <Wave
      frontStyle={{ height: '12.5%', color: 'rgba(178, 237, 255, 0.8)' }}
      backStyle={{ height: '12.5%', color: 'rgba(178, 237, 255, 0.3)' }}
    />
  ),
  type: '拱顶式',
}));
const fields = [
  {
    value: 'name',
    render: val => {
      return <span style={{ fontSize: 16 }}>{val}</span>;
    },
  },
  { label: '位号', value: 'number' },
  { label: '存储物质', value: 'store' },
  { label: '储罐结构', value: 'type' },
  {
    value: 'max',
    render: (val, row) => {
      const { contain, nowCotain } = row;
      return (
        <Row gutter={10}>
          <Col span={12}>
            <span className={styles.label}>设计储量：</span>
            {contain}
          </Col>
          <Col span={12}>
            <span className={styles.label}>实时储量：</span>
            {nowCotain}
          </Col>
        </Row>
      );
    },
  },
  {
    value: 'max',
    render: (val, row) => {
      const { pressure, nowPressure } = row;
      return (
        <Row gutter={10}>
          <Col span={12}>
            <span className={styles.label}>设计压力：</span>
            {pressure}
          </Col>
          <Col span={12}>
            <span className={styles.label}>实时压力：</span>
            {nowPressure}
          </Col>
        </Row>
      );
    },
  },
];

export default class DangerSourceInfoDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClickDetail = () => {
    const { setDrawerVisible } = this.props;
    setDrawerVisible('dangerSourceLvl');
  };

  render() {
    const { visible, onClose, setDrawerVisible } = this.props;
    // const {} = this.state;

    return (
      <DrawerContainer
        title={`储罐监测(${list.length})`}
        visible={visible}
        onClose={onClose}
        width={535}
        destroyOnClose={true}
        zIndex={1222}
        left={
          <div className={styles.container}>
            {list.map((item, index) => (
              <CardItem
                key={index}
                data={item}
                fields={fields}
                extraBtn={
                  <Fragment>
                    {index === 0 && (
                      <div
                        className={styles.alarm}
                        style={{
                          background: `url(${iconAlarm}) center center / 100% auto no-repeat`,
                        }}
                      />
                    )}
                    {/* <div className={styles.name}>
                      {index + 1}
                      号罐
                    </div> */}
                  </Fragment>
                }
                onClick={() => setDrawerVisible('tankMonitor')}
              />
            ))}
          </div>
        }
      />
    );
  }
}
