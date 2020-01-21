import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import DrawerContainer from '@/pages/BigPlatform/NewUnitFireControl/components/DrawerContainer';
// import styles from './MonitorDrawer.less';
import { CardItem } from '../components/Components';

const NO_DATA = '暂无数据';
const fields = [
  { label: '统一编码', value: 'code' },
  { label: '重大危险源名称', value: 'name' },
  {
    label: '重大危险源等级',
    value: 'dangerLevel',
    render: val => ['一级', '二级', '三级', '四级'][val - 1],
  },
  { label: '区域位置', value: 'location' },
  {
    label: '备案时间',
    value: 'recordDate',
    render: val => (val ? moment(val).format('YYYY-MM-DD') : NO_DATA),
  },
  { label: '责任人', value: 'dutyPerson' },
];

export default class DangerSourceDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClick = detail => {
    const { handleShowDangerSourceDetail } = this.props;
    handleShowDangerSourceDetail(detail);
  };

  render() {
    const { visible, onClose, dangerSourceList } = this.props;

    return (
      <DrawerContainer
        title="重大危险源列表"
        visible={visible}
        onClose={onClose}
        width={535}
        destroyOnClose={true}
        zIndex={1222}
        left={
          <div
            style={{
              position: 'relative',
              height: '100%',
              overflow: 'auto',
              marginRight: '-15px',
              paddingRight: '15px',
            }}
          >
            {dangerSourceList.map((item, index) => (
              <CardItem
                key={index}
                data={item}
                fields={fields}
                onClick={() => this.handleClick(item)}
              />
            ))}
          </div>
        }
      />
    );
  }
}
