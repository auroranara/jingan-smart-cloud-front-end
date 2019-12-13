import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import DrawerContainer from '@/pages/BigPlatform/NewUnitFireControl/components/DrawerContainer';
// import styles from './MonitorDrawer.less';
import { CardItem } from '../components/Components';

const list = [
  {
    code: '133555',
    name: '光气及光气化工艺',
    type: '放热反应',
    acture: '光气化反应釜/光气储运单元',
    store: (
      <div>
        {/* 工艺危险特点： */}
        {/* <br /> */}
        1）光气未剧毒气体，在储运、使用过程中发生泄漏后，易造成大面积污染、中毒事故；
        <br />
        2）反应介质具有燃爆危险性；
        <br />
        3）副产品氯化氢具有腐蚀性，易造成设备和管线泄漏，使人员发生中毒事故。
      </div>
    ),
  },
  {
    code: '138156',
    name: '氯化工艺',
    type: '放热反应',
    acture: '氯化反应釜、氯气储运单元',
    store: (
      <div>
        1）氯化反应是一个放热过程，尤其在较高温度下进行氯化，反应更为剧烈，速度快，放热量较大；
        <br />
        2）所用的原料大多具有燃爆危险性；
        <br />
        3）常用的氯化剂氯气本身为剧毒化学品，氧化性强，储存压力较高，多数氯化工艺采用液氯生产，是先气化再氯化，一旦泄露，危险性较大；
        <br />
        4）氯气中的杂质，如水、氢气、氧气、三氯化氮等，在使用中易发生危险，特别是三氯化氮积累后，容易引发爆炸危险；
        <br />
        5）生成的氯化氮气体遇水后腐蚀性强；
        <br />
        6）氯化反应尾气可能形成爆炸性混合物。
      </div>
    ),
  },
];
const fields = [
  { label: '统一编码', value: 'code' },
  { label: '生产工艺名称', value: 'name' },
  { label: '反应类型', value: 'type' },
  { label: '重点监管单元', value: 'acture' },
  {
    label: '工艺危险特点',
    value: 'store',
    render: val => {
      return val;
      //   return (
      //     <div>
      //       {/* 工艺危险特点： */}
      //       {/* <br /> */}
      //       1）光气未剧毒气体，在储运、使用过程中发生泄漏后，易造成大面积污染、中毒事故；
      //       <br />
      //       2）反应介质具有燃爆危险性；
      //       <br />
      //       3）副产品氯化氢具有腐蚀性，易造成设备和管线泄漏，使人员发生中毒事故。
      //     </div>
      //   );
    },
  },
];

export default class TechnologyDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { visible, onClose } = this.props;
    const {} = this.state;
    return (
      <DrawerContainer
        title="重点监管危险化工工艺"
        visible={visible}
        onClose={onClose}
        width={535}
        destroyOnClose={true}
        zIndex={1222}
        left={
          <div>
            {list.map((item, index) => (
              <CardItem key={index} data={item} fields={fields} />
            ))}
          </div>
        }
      />
    );
  }
}
