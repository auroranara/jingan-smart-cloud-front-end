import React, { Component } from 'react';
import { TreeSelect } from 'antd';
import { connect} from 'dva';

@connect(({
  alarmMessage,
}) => ({
  alarmMessage,
}), dispatch => ({
  getMonitorTypeList(payload, callback) {
    dispatch({
      type: 'alarmMessage/getMonitorTypeList',
      payload,
      callback,
    });
  },
}))
export default class MonitorTypeSelect extends Component {
  componentDidMount() {
    const {
      getMonitorTypeList,
    } = this.props;
    getMonitorTypeList();
  }

  render() {
    const {
      alarmMessage: {
        monitorTypeList=[],
      },
      value,
      onChange,
      allowClear=true,
    } = this.props;

    return (
      <TreeSelect
        style={{ width: '100%' }}
        value={value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeData={monitorTypeList}
        placeholder="请选择监测类型"
        onChange={onChange}
        allowClear={allowClear}
      />
    );
  }
}
