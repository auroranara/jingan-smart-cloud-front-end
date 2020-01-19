import React, { Component } from 'react';
// import { TreeSelect } from 'antd';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import { connect } from 'dva';

@connect(
  ({ common }) => ({
    common,
  }),
  dispatch => ({
    getMonitorTypeList(payload, callback) {
      dispatch({
        type: 'common/getMonitorTypeList',
        payload: {
          type: 4,
          ...payload,
        },
        callback,
      });
    },
  })
)
export default class MonitorTypeSelect extends Component {
  componentDidMount() {
    const { getMonitorTypeList } = this.props;
    getMonitorTypeList();
  }

  render() {
    const {
      common: { monitorTypeList = [] },
      value,
      onChange,
      allowClear = false,
      type,
    } = this.props;

    return (
      <SelectOrSpan
        style={{ width: '100%' }}
        value={value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder="请选择监测类型"
        onChange={onChange}
        allowClear={allowClear}
        list={monitorTypeList}
        type={type}
      />
    );
  }
}
