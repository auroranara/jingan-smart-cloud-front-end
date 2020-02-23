import React, { Component } from 'react';
import { message } from 'antd';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import { connect } from 'dva';

@connect(
  ({ licensePlateRecognitionSystem: { provinceList } }) => ({
    provinceList,
  }),
  dispatch => ({
    getProvinceList(payload, callback) {
      dispatch({
        type: 'licensePlateRecognitionSystem/getProvinceList',
        payload,
        callback(success, data) {
          if (!success) {
            message.error('获取省份列表失败，请稍候重试！');
          }
          callback && callback(success, data);
        },
      });
    },
  }),
  null,
  { withRef: true }
)
export default class ProvinceSelect extends Component {
  state = {
    open: false,
  };

  componentDidMount() {
    const { getProvinceList } = this.props;
    getProvinceList();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.provinceList !== this.props.provinceList ||
      nextProps.value !== this.props.value ||
      nextState !== this.state
    );
  }

  setSelectReference = select => {
    this.select = select;
  };

  handleDropdownVisibleChange = open => {
    this.setState({
      open,
    });
  };

  focus = () => {
    this.handleDropdownVisibleChange(true);
    setTimeout(() => {
      this.select && this.select.focus();
    }, 0);
  };

  render() {
    const { provinceList, getProvinceList, ...props } = this.props;
    const { open } = this.state;

    return (
      <SelectOrSpan
        {...props}
        list={provinceList}
        placeholder="请选择车场所在省份"
        open={open}
        onDropdownVisibleChange={this.handleDropdownVisibleChange}
        selectRef={this.setSelectReference}
      />
    );
  }
}
