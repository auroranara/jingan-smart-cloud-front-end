import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import DrawerContainer from '@/pages/BigPlatform/NewUnitFireControl/components/DrawerContainer';
import styles from './DangerSourceInfoDrawer.less';
import { CardItem } from '../components/Components';
import storage from '../imgs/storage.png';

const basicList = [
  {
    code: '156487941654',
    name: '危险品液体原料储罐区',
    level: '四级',
    RValue: 8,
    location: '东厂区1号楼',
    // time: '2019.01.01',
    man: '李磊 13056177523',
  },
];

const creatNum = (num, m) => {
  return (Array(m).join(0) + num).slice(-m);
};
const list = [
  {
    store: '无水乙醇',
    type: '第3.2类 中闪点易燃液体',
    acture: '5t',
    max: '16t',
  },
  {
    store: '无水乙醇',
    type: '第3.2类 中闪点易燃液体',
    acture: '10t',
    max: '16t',
  },
  {
    store: '丙酮',
    type: '第3.1类  低闪点易燃液体',
    acture: '8t',
    max: '16t',
  },
  {
    store: '二甲苯',
    type: '第3.3类  高闪点易燃液体',
    acture: '8t',
    max: '18t',
  },
  {
    store: '乙酸乙酯',
    type: '第3.2类 中闪点易燃液体',
    acture: '8t',
    max: '18t',
  },
  {
    store: '乙腈',
    type: '第3类 易燃液体，有毒品',
    acture: '10t',
    max: '16t',
  },
  {
    store: '甲醇',
    type: '第3.2类 中闪点一级易燃液体，有毒品',
    acture: '10t',
    max: '16t',
  },
  {
    store: 'N,N二甲基甲酰胺',
    type: '第3.3类  高闪点易燃液体',
    acture: '12t',
    max: '20t',
  },
  {
    store: '乙腈',
    type: '第3类 易燃液体，有毒品',
    acture: '10t',
    max: '16t',
  },
  {
    store: '二氯甲烷',
    type: '第6.1类  毒害品',
    acture: '10t',
    max: '30t',
  },
  {
    store: '无水乙醇',
    type: '第3.2类 中闪点易燃液体',
    acture: '10t',
    max: '16t',
  },
].map((item, index) => ({
  ...item,
  name: `${index + 1}号储罐`,
  number: creatNum(index + 1, 4),
  icon: storage,
}));
const fields = [
  { label: '储罐', value: 'name' },
  { label: '位号', value: 'number' },
  { label: '存储物质', value: 'store' },
  { label: '危险性类别', value: 'type' },
  { label: '设计储量', value: 'max' },
  { label: '实际储量', value: 'acture' },
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
    const {} = this.state;
    const basicFields = [
      { label: '统一编码', value: 'code' },
      { label: '重大危险源名称', value: 'name' },
      {
        label: '重大危险源等级',
        value: 'level',
        extra: (
          <span className={styles.detail} onClick={this.handleClickDetail}>
            查看详情>>
          </span>
        ),
      },
      { label: 'R值', value: 'RValue' },
      { label: '区域位置', value: 'location' },
      // { label: '备案时间', value: 'time' },
      { label: '责任人', value: 'man' },
    ];

    return (
      <DrawerContainer
        // title="重大危险源监测"
        visible={visible}
        onClose={onClose}
        width={535}
        destroyOnClose={true}
        zIndex={1322}
        left={
          <div className={styles.container}>
            <div className={styles.title} style={{ marginTop: 0 }}>
              基本信息：
            </div>
            {basicList.map((item, index) => (
              <CardItem key={index} data={item} fields={basicFields} />
            ))}
            <div className={styles.title}>防护要求：</div>
            <div className={styles.content}>
              必须戴防护手套，必须戴防毒面具，必须穿防护服，必须戴防护眼镜
            </div>
            <div className={styles.title}>安全措施：</div>
            <div className={styles.content}>
              严格按照规定穿戴劳动保护，定期进行巡查，发现泄露及时处理。作业时严格遵守安全操作过程，保持设备通风良好。
            </div>
            <div className={styles.title}>存储情况：</div>
            {list.map((item, index) => (
              <CardItem
                key={index}
                data={item}
                fields={fields}
                extraBtn={
                  <Fragment>
                    <div className={styles.more} onClick={() => setDrawerVisible('tankmonitor')}>
                      更多监测参数>
                    </div>
                    <div className={styles.name}>
                      {index + 1}
                      号罐
                    </div>
                  </Fragment>
                }
              />
            ))}
          </div>
        }
      />
    );
  }
}
