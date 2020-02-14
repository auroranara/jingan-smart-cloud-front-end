import React, { Component } from 'react';
import { message } from 'antd';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import { connect } from 'dva';

@connect(
  ({ licensePlateRecognitionSystem: { cityList } }) => ({
    cityList,
  }),
  dispatch => ({
    getCityList(payload, callback) {
      dispatch({
        type: 'licensePlateRecognitionSystem/getCityList',
        payload,
        callback(success, data) {
          if (!success) {
            message.error('获取城市列表失败，请稍候重试！');
          }
          callback && callback(success, data);
        },
      });
    },
  })
)
export default class CitySelect extends Component {
  state = {
    open: false,
  };

  componentDidMount() {
    const { cityIds, getCityList } = this.props;
    if (cityIds) {
      getCityList({
        cityIds,
      });
    }
  }

  componentDidUpdate({ cityIds: prevCityIds }) {
    const { cityIds } = this.props;
    if (cityIds !== prevCityIds) {
      const { getCityList, onChange, value } = this.props;
      getCityList({
        cityIds,
      });
      if (value && prevCityIds) {
        onChange && onChange();
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.cityList !== this.props.cityList ||
      nextProps.cityIds !== this.props.cityIds ||
      nextProps.value !== this.props.value ||
      nextState !== this.state
    );
  }

  handleDropdownVisibleChange = open => {
    const { cityIds, focus } = this.props;
    if (cityIds) {
      this.setState({
        open,
      });
    } else {
      focus && focus();
    }
  };

  render() {
    const { cityIds, cityList, getCityList, focus, ...props } = this.props;
    const { open } = this.state;

    return (
      <SelectOrSpan
        {...props}
        list={cityList}
        placeholder="请选择车场所在城市"
        open={open}
        onDropdownVisibleChange={this.handleDropdownVisibleChange}
      />
    );
  }
}
