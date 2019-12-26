import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import DrawerContainer from '@/pages/BigPlatform/NewUnitFireControl/components/DrawerContainer';
// import styles from './MonitorDrawer.less';
import { CardItem } from '../components/Components';

const list = [
  {
    name: '氯',
    cas: '7782-50-5',
    type: '急性毒性物质',
    acture: '6t',
    store: '氯气气柜（1号楼1车间）',
  },
  {
    name: '氨',
    cas: '7664-41-7',
    type: '有毒气体',
    acture: '6t',
    store: '液氨储罐（1号楼1车间）',
  },
  {
    name: '硫化氢',
    cas: '7783-06-4',
    type: '易燃气体',
    acture: '10t',
    store: '硫化氢气柜（1号楼1车间）',
  },
];
const fields = [
  { label: '化学品名称', value: 'name' },
  { label: 'CAS号', value: 'cas' },
  { label: '危险性类别', value: 'type' },
  { label: '实际存储量', value: 'acture' },
  { label: '存储场所', value: 'store' },
];

export default class ChemicalDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClick = () => {
    const { setDrawerVisible } = this.props;
    setDrawerVisible('chemicalDetail');
  };

  render() {
    const { visible, onClose } = this.props;
    // const {} = this.state;
    return (
      <DrawerContainer
        title="重点监管危险化学品"
        visible={visible}
        onClose={onClose}
        width={535}
        destroyOnClose={true}
        zIndex={1222}
        left={
          <div>
            {list.map((item, index) => (
              <CardItem
                key={index}
                data={item}
                fields={fields}
                onClick={() => this.handleClick()}
              />
            ))}
          </div>
        }
      />
    );
  }
}
