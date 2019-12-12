import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import DrawerContainer from '@/pages/BigPlatform/NewUnitFireControl/components/DrawerContainer';
// import styles from './MonitorDrawer.less';
import { CardItem } from '../components/Components';

const list = [
  {
    code: '133555',
    name: '氯',
    type: '放热反应',
    acture: '光气化反应釜/光气储运单元',
    store: '氯气气柜（1号楼1车间）',
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
    render: () => {
      return (
        <div>
          {/* 工艺危险特点： */}
          {/* <br /> */}
          1）光气未剧毒气体，在储运、使用过程中发生泄漏后，易造成大面积污染、中毒事故；
          <br />
          2）反应介质具有燃爆危险性；
          <br />
          3）副产品氯化氢具有腐蚀性，易造成设备和管线泄漏，使人员发生中毒事故。
        </div>
      );
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
