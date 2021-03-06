import React, { Component } from 'react';
import { TreeSelect } from 'antd';
import { connect } from 'dva';

const GET_TYPE_LIST = 'accidentReport/getTypeList';
const dropdownStyle = { maxHeight: 400, overflow: 'auto' };

@connect(
  ({ accidentReport, loading }) => ({
    accidentReport,
    loading: loading.effects[GET_TYPE_LIST],
  }),
  dispatch => ({
    getTypeList(payload, callback) {
      dispatch({
        type: GET_TYPE_LIST,
        payload: {
          type: 'accidentType',
          ...payload,
        },
        callback,
      });
    },
  })
)
export default class TypeSelect extends Component {
  componentDidMount() {
    const { parentIds, getTypeList } = this.props;
    (parentIds ? parentIds.split(',') : ['0']).forEach(parentId => {
      if (parentId) {
        getTypeList({
          parentId,
        });
      }
    });
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.accidentReport.typeList !== this.props.accidentReport.typeList ||
      nextProps.loading !== this.props.loading ||
      nextProps.value !== this.props.value
    );
  }

  handleLoadData = treeNode => {
    return new Promise(resolve => {
      const { getTypeList } = this.props;
      getTypeList({ parentId: treeNode.props.id }, () => {
        resolve();
      });
    });
  };

  render() {
    const {
      className,
      value,
      onChange,
      placeholder = '请选择事故类型代码',
      allowClear = false,
      accidentReport: { typeList = [] },
    } = this.props;

    return (
      <TreeSelect
        className={className}
        treeDataSimpleMode
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        dropdownStyle={dropdownStyle}
        loadData={this.handleLoadData}
        treeData={typeList}
        allowClear={allowClear}
      />
    );
  }
}
