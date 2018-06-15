import React, { PureComponent } from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import BasicLayout from './BasicLayout';
import { getMenuData } from '../common/menu';
/**
 * 根据菜单取得重定向地址.
 */

const MenuData = getMenuData();
const getRedirectData = () => {
  const redirectData = [];
  const getRedirect = item => {
    if (item && item.children) {
      if (item.children[0] && item.children[0].path) {
        redirectData.push({
          from: `${item.path}`,
          to: `${item.children[0].path}`,
        });
        item.children.forEach(children => {
          getRedirect(children);
        });
      }
    }
  };
  MenuData.forEach(getRedirect);
  return redirectData;
};
const redirectData = getRedirectData();

class LoadingPage extends PureComponent {
  state = {
    loading: true,
    isMobile: false,
  };
<<<<<<< HEAD

  componentDidMount() {
    const { dispatch } = this.props;
=======
  componentDidMount() {
>>>>>>> init
    this.enquireHandler = enquireScreen(mobile => {
      this.setState({
        isMobile: mobile,
      });
    });
<<<<<<< HEAD
    dispatch({
=======
    this.props.dispatch({
>>>>>>> init
      type: 'user/fetchCurrent',
    });
    this.hideLoading();
    this.initSetting();
  }
<<<<<<< HEAD

  componentWillUnmount() {
    unenquireScreen(this.enquireHandler);
  }

=======
  componentWillUnmount() {
    unenquireScreen(this.enquireHandler);
  }
>>>>>>> init
  hideLoading() {
    this.setState({
      loading: false,
    });
  }
<<<<<<< HEAD

=======
>>>>>>> init
  /**
   * get setting from url params
   */
  initSetting() {
<<<<<<< HEAD
    const { dispatch } = this.props;
    dispatch({
      type: 'setting/getSetting',
    });
  }

  render() {
    const { loading, isMobile } = this.state;
    if (loading) {
=======
    this.props.dispatch({
      type: 'setting/getSetting',
    });
  }
  render() {
    if (this.state.loading) {
>>>>>>> init
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            margin: 'auto',
            paddingTop: 50,
            textAlign: 'center',
          }}
        >
          <Spin size="large" />
        </div>
      );
    }
    return (
      <BasicLayout
<<<<<<< HEAD
        isMobile={isMobile}
=======
        isMobile={this.state.isMobile}
>>>>>>> init
        menuData={MenuData}
        redirectData={redirectData}
        {...this.props}
      />
    );
  }
}

export default connect()(LoadingPage);
