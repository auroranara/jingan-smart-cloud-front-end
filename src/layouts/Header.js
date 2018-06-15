import React, { PureComponent } from 'react';
import { Layout, message } from 'antd';
import Animate from 'rc-animate';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import GlobalHeader from '../components/GlobalHeader';
import TopNavHeader from '../components/TopNavHeader';
import styles from './Header.less';
import Authorized from '../utils/Authorized';

const { Header } = Layout;

class HeaderView extends PureComponent {
  state = {
    visible: true,
  };
<<<<<<< HEAD

  componentDidMount() {
    document.getElementById('root').addEventListener('scroll', this.handScroll);
  }

  componentWillUnmount() {
    document.getElementById('root').removeEventListener('scroll', this.handScroll);
  }

=======
  componentDidMount() {
    document.getElementById('root').addEventListener('scroll', this.handScroll);
  }
  componentWillUnmount() {
    document.getElementById('root').removeEventListener('scroll', this.handScroll);
  }
>>>>>>> init
  getHeadWidth = () => {
    const { isMobile, collapsed, setting } = this.props;
    const { fixedHeader, layout } = setting;
    if (isMobile || !fixedHeader || layout === 'topmenu') {
      return '100%';
    }
    return collapsed ? 'calc(100% - 80px)' : 'calc(100% - 256px)';
  };
<<<<<<< HEAD

  handleNoticeClear = type => {
    message.success(`清空了${type}`);
    const { dispatch } = this.props;
    dispatch({
=======
  handleNoticeClear = type => {
    message.success(`清空了${type}`);
    this.props.dispatch({
>>>>>>> init
      type: 'global/clearNotices',
      payload: type,
    });
  };
<<<<<<< HEAD

  handleMenuClick = ({ key }) => {
    const { dispatch } = this.props;
    if (key === 'userCenter') {
      dispatch(routerRedux.push('/account/center'));
      return;
    }
    if (key === 'triggerError') {
      dispatch(routerRedux.push('/exception/trigger'));
      return;
    }
    if (key === 'userinfo') {
      dispatch(routerRedux.push('/account/settings/base'));
      return;
    }
    if (key === 'logout') {
      dispatch({
=======
  handleMenuClick = ({ key }) => {
    if (key === 'userCenter') {
      this.props.dispatch(routerRedux.push('/account/center'));
      return;
    }
    if (key === 'triggerError') {
      this.props.dispatch(routerRedux.push('/exception/trigger'));
      return;
    }
    if (key === 'userinfo') {
      this.props.dispatch(routerRedux.push('/account/settings/base'));
      return;
    }
    if (key === 'logout') {
      this.props.dispatch({
>>>>>>> init
        type: 'login/logout',
      });
    }
  };
<<<<<<< HEAD

  handleNoticeVisibleChange = visible => {
    if (visible) {
      const { dispatch } = this.props;
      dispatch({
=======
  handleNoticeVisibleChange = visible => {
    if (visible) {
      this.props.dispatch({
>>>>>>> init
        type: 'global/fetchNotices',
      });
    }
  };
<<<<<<< HEAD

  handScroll = () => {
    const { autoHideHeader } = this.props;
    const { visible } = this.state;
    if (!autoHideHeader) {
=======
  handScroll = () => {
    if (!this.props.autoHideHeader) {
>>>>>>> init
      return;
    }
    const { scrollTop } = document.getElementById('root');
    if (!this.ticking) {
      this.ticking = false;
      requestAnimationFrame(() => {
<<<<<<< HEAD
        if (scrollTop > 400 && visible) {
=======
        if (scrollTop > 400 && this.state.visible) {
>>>>>>> init
          this.setState({
            visible: false,
          });
        }
<<<<<<< HEAD
        if (scrollTop < 400 && !visible) {
=======
        if (scrollTop < 400 && !this.state.visible) {
>>>>>>> init
          this.setState({
            visible: true,
          });
        }
        this.ticking = false;
      });
    }
  };
<<<<<<< HEAD

  render() {
    const { isMobile, handleMenuCollapse, setting } = this.props;
    const { silderTheme, layout, fixedHeader } = setting;
    const { visible } = this.state;
    const isTop = layout === 'topmenu';
    const HeaderDom = visible ? (
=======
  render() {
    const { isMobile, handleMenuCollapse } = this.props;
    const { silderTheme, layout, fixedHeader } = this.props.setting;
    const isTop = layout === 'topmenu';
    const HeaderDom = this.state.visible ? (
>>>>>>> init
      <Header
        style={{ padding: 0, width: this.getHeadWidth() }}
        className={fixedHeader ? styles.fixedHeader : ''}
      >
        {isTop && !isMobile ? (
          <TopNavHeader
            theme={silderTheme}
            mode="horizontal"
            Authorized={Authorized}
            onCollapse={handleMenuCollapse}
            onNoticeClear={this.handleNoticeClear}
            onMenuClick={this.handleMenuClick}
            onNoticeVisibleChange={this.handleNoticeVisibleChange}
            {...this.props}
          />
        ) : (
          <GlobalHeader
            onCollapse={handleMenuCollapse}
            onNoticeClear={this.handleNoticeClear}
            onMenuClick={this.handleMenuClick}
            onNoticeVisibleChange={this.handleNoticeVisibleChange}
            {...this.props}
          />
        )}
      </Header>
    ) : null;
    return (
      <Animate component="" transitionName="fade">
        {HeaderDom}
      </Animate>
    );
  }
}

export default connect(({ user, global, setting, loading }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
  setting,
}))(HeaderView);
