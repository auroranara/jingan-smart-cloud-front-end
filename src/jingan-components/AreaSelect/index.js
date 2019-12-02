import React, { Component } from 'react';
import { Cascader } from 'antd';
import { connect } from 'dva';

const GET_AREA_LIST = 'common/getAreaList';
const FIELDNAMES = {
  value: 'id',
  label: 'name',
  children: 'children',
  isLeaf: 'isLeaf',
};

@connect(({
  common,
  loading,
}) => ({
  common,
  loading: loading.effects[GET_AREA_LIST],
}), dispatch => ({
  getAreaList(payload, callback) {
    dispatch({
      type: GET_AREA_LIST,
      payload,
      callback,
    });
  },
}))
export default class AreaSelect extends Component {
  componentDidMount() {
    const { getAreaList, value } = this.props;
    getAreaList({
      cityIds: value && value.join(','),
    });
  }

  componentDidUpdate({ value: prevValue }) {
    const { value, getAreaList } = this.props;
    if (prevValue !== value && (!prevValue || !value || prevValue.length !== value.length)) {
      getAreaList({
        cityIds: value && value.join(','),
      });
    }
  }

  handleLoadData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
  }

  render() {
    const {
      className,
      value,
      onChange,
      placeholder='请选择所在区域',
      allowClear=false,
      common: {
        areaList=[],
      },
    } = this.props;

    return (
      <Cascader
        className={className}
        options={areaList}
        value={value}
        onChange={onChange}
        loadData={this.handleLoadData}
        placeholder={placeholder}
        fieldNames={FIELDNAMES}
        allowClear={allowClear}
        changeOnSelect
      />
    );
  }
}
