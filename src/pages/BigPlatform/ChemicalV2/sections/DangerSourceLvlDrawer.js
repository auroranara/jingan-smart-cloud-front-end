import React, { PureComponent, Fragment } from 'react';
import { Icon } from 'antd';
import moment from 'moment';
import DrawerContainer from '@/pages/BigPlatform/NewUnitFireControl/components/DrawerContainer';
import styles from './DangerSourceLvlDrawer.less';
import { CardItem } from '../components/Components';
// import storage from '../imgs/storage.png';

const basicList = [
  {
    code: '156487941654',
    name: '危险品液体原料储罐区',
    level: '四级',
    RValue: 8,
    location: '东厂区1号楼',
    time: '2019.01.01',
    man: '李磊 13056177523',
    number: '30(α=1.0)',
  },
];
const basicFields = [
  {
    label: '重大危险源等级',
    value: 'level',
  },
  { label: 'R值', value: 'RValue' },
  { label: '周围500米内常住人口数量', value: 'number' },
];

const list = [
  {
    store: '无水乙醇',
    type: '第3.2类 中闪点易燃液体（β=1）',
    acture: '22t',
    max: '500t',
  },
  {
    store: '丙酮',
    type: '第3.1类  低闪点易燃液体（β=2）',
    acture: '8t',
    max: '500t',
  },
  {
    store: '二甲苯',
    type: '第3.3类  高闪点易燃液体（β=2）',
    acture: '8t',
    max: '5000t',
  },
  {
    store: '乙酸乙酯',
    type: '第3.2类 中闪点易燃液体（β=1.5）',
    acture: '8t',
    max: '500t',
  },
  {
    store: '乙腈',
    type: '第3类 易燃液体，有毒品（β=2）',
    acture: '20t',
    max: '100t',
  },
  {
    store: '甲醇',
    type: '第3.2类 中闪点一级易燃液体，有毒品（β=2）',
    acture: '10t',
    max: '500t',
  },
  {
    store: 'N,N二甲基甲酰胺',
    type: '第3.3类  高闪点易燃液体（β=1.5）',
    acture: '12t',
    max: '50t',
  },
  {
    store: '二氯甲烷',
    type: '第6.1类  毒害品（β=2）',
    acture: '8t',
    max: '10t',
  },
];
const fields = [
  { label: '存储物质', value: 'store' },
  { label: '危险性类别', value: 'type' },
  { label: '实时储量(q)', value: 'acture' },
  { label: '临界量(Q)', value: 'max' },
];

export default class DangerSourceLvlDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClickDetail = () => {
    const { setDrawerVisible } = this.props;
    setDrawerVisible('');
  };

  render() {
    const { visible, onClose } = this.props;
    // const {} = this.state;

    return (
      <DrawerContainer
        title="重大危险源等级影响因素"
        visible={visible}
        onClose={onClose}
        width={535}
        destroyOnClose={true}
        zIndex={1422}
        left={
          <div className={styles.container}>
            <div className={styles.rlvl}>
              <span className={styles.label}>R值：</span>
              {3}
              <span className={styles.question}>
                <Icon type="question-circle" />
              </span>
            </div>
            <div className={styles.subTitle}>
              <span className={styles.circle} />
              <span className={styles.label}>周围500米内常住人口数量：</span>
              {`30(α=1.0)`}
            </div>
            <div className={styles.subTitle} style={{ marginBottom: '8px' }}>
              <span className={styles.circle} />
              <span className={styles.label}>重大危险源存储物质</span>
            </div>

            {/* {basicList.map((item, index) => (
              <CardItem key={index} data={item} fields={basicFields} />
            ))} */}
            {/* <div className={styles.title}>
              <span className={styles.rect} />
              重大危险源存储物质
            </div> */}
            {list.map((item, index) => (
              <CardItem key={index} data={item} fields={fields} />
            ))}
          </div>
        }
      />
    );
  }
}
