import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import DrawerContainer from '@/pages/BigPlatform/NewUnitFireControl/components/DrawerContainer';
// import styles from './MonitorDrawer.less';
import { CardItem } from '../components/Components';

const list = [
  {
    code: '156487941654',
    name: '危险品液体原料储罐区',
    level: '四级',
    location: '东厂区1号楼',
    time: '2019.01.01',
    man: '李磊 13056177523',
  },
  {
    code: '151444441321',
    name: '氯乙烷生产装置',
    level: '四级',
    location: '东厂区1号楼1车间',
    time: '2019.03.01',
    man: '李刚 13814873478',
  },
];
const fields = [
  { label: '统一编码', value: 'code' },
  { label: '重大危险源名称', value: 'name' },
  { label: '重大危险源等级', value: 'level' },
  { label: '区域位置', value: 'location' },
  { label: '备案时间', value: 'time' },
  { label: '责任人', value: 'man' },
];

export default class DangerSourceDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClick = () => {
    const { setDrawerVisible } = this.props;
    setDrawerVisible('dangerSourceInfo');
  };

  render() {
    const { visible, onClose } = this.props;
    const {} = this.state;
    return (
      <DrawerContainer
        title="重大危险源监测"
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
