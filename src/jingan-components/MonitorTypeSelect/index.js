import React, { Component } from 'react';
import { TreeSelect } from 'antd';
import { connect} from 'dva';

@connect(({
  common,
}) => ({
  common,
}), dispatch => ({
  getMonitorTypeList(payload, callback) {
    dispatch({
      type: 'common/getMonitorTypeList',
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
      common: {
        monitorTypeList=[],
      },
      value,
      onChange,
      allowClear=false,
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
