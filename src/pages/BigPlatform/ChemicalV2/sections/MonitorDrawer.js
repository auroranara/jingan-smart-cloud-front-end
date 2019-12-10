import React, { PureComponent, Fragment } from 'react';
import { Col, Select } from 'antd';
import moment from 'moment';
import DrawerContainer from '@/pages/BigPlatform/NewUnitFireControl/components/DrawerContainer';
import styles from './MonitorDrawer.less';
import { MonitorItem } from '../components/Components';
import { MonitorList, MonitorFields, MonitorTitles } from '../utils';

const { Option } = Select;
const options = [
  { label: '全部状态', value: 0 },
  { label: '报警', value: 1 },
  { label: '正常', value: 2 },
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

  handleClick = data => {
    const { setDrawerVisible } = this.props;
    setDrawerVisible('monitorDetail', { monitorData: data });
  };

  render() {
    // type = [0,1,2,3,4,5,6]    ['罐区', '库区', '储罐', '生产装置', '库房', '气柜', '可燃有毒气体']
    const { visible, onClose, type = 0 } = this.props;
    const { selected } = this.state;
    return (
      <DrawerContainer
        title={`${MonitorTitles[type]}监测（${MonitorList[type].length}）`}
        visible={visible}
        onClose={() => {
          onClose();
          setTimeout(() => {
            this.setState({ selected: 0 });
          }, 500);
        }}
        width={535}
        destroyOnClose={true}
        zIndex={1666}
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
            <div className={styles.items}>
              {MonitorList[type]
                .filter(item => {
                  if (selected === 0) {
                    return true;
                  }
                  return item.status === selected;
                })
                .map((item, index) => (
                  <MonitorItem
                    key={index}
                    data={item}
                    fields={MonitorFields[type]}
                    onClick={() => this.handleClick(item)}
                  />
                ))}
            </div>
          </div>
        }
      />
    );
  }
}
