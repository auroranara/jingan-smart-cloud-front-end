import React, { PureComponent, Fragment } from 'react';
import { Col, Select } from 'antd';
import moment from 'moment';
import DrawerContainer from '@/pages/BigPlatform/NewUnitFireControl/components/DrawerContainer';
import styles from './MonitorDrawer.less';
// import { DataList } from '../utils';

const { Option } = Select;
const options = [
  { label: '全部状态', value: 0 },
  { label: '报警', value: 1 },
  { label: '正常', value: 2 },
];

const list = [
  { title: 'name', status: 2, location: '仓库-7号仓库', isDanger: 0 },
  // { title: 'name', label: '区域位置', value: '仓库-7号仓库' },
  // { title: 'name', label: '是否构成重大危险源', value: '是' },
];
const fields = [
  { label: '区域位置', value: 'location' },
  {
    label: '是否构成重大危险源',
    value: 'isDanger',
    render: val => {
      return val === 0 ? '否' : '是';
    },
  },
];
export default class MonitorDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selected: 0,
    };
  }

  handleSelect = value => {
    this.setState({ selected: value });
  };

  render() {
    const { visible, onClose, type } = this.props;
    const { selected } = this.state;
    return (
      <DrawerContainer
        title="当前隐患"
        visible={visible}
        onClose={onClose}
        width={535}
        destroyOnClose={true}
        left={
          <div className={styles.container}>
            <Select
              value={selected}
              onSelect={this.handleSelect}
              className={styles.select}
              dropdownClassName={styles.dropDown}
            >
              {options.map((item, index) => {
                const { label, value } = item;
                return (
                  <Option
                    key={index}
                    value={value}
                    style={{
                      color: selected === value && '#00ffff',
                    }}
                  >
                    {label}
                  </Option>
                );
              })}
            </Select>
          </div>
        }
      />
    );
  }
}
