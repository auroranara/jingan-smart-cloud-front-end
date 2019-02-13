import React, { PureComponent } from 'react';
import { Alert, Input, Carousel, Icon, Form, Button, Checkbox, List, Card, Tabs, Spin, Modal } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
// import debounce from 'lodash/debounce';
import { aesEncrypt, isMobileExcludeIpad } from '@/utils/utils';
import config from '../config';
// 引入样式文件
import styles from './index.less';

const { Item: FormItem } = Form;
const { TabPane } = Tabs

// 轮播时间
const carouselTime = 10 * 1000;
// localStorage名称
const localStorageName = '_login_account';
// 是否为手机端
const isFromMobile = isMobileExcludeIpad();

/**
 * description: 南消登录页面
 * author: sunkai
 * date: 2019年01月23日
 */
@connect(({ login, loading }) => ({
  login,
  submitting: loading.models.login,
}))
@Form.create()
export default class NanXiaoLogin extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // 登录类型
      type: '1',
      // 错误信息
      notice: undefined,
      // 组件大小
      size: 'large',
      // 常用账号
      commonAccount: [],
      // 暂存账号
      payload: undefined,
    };
    // 轮播定时器
    this.carouselTimer = null;
    // 大的轮播实例
    this.bigCarousel = null;
    // 小的轮播实例
    this.smallCarousel = null;
    // 密码输入框
    this.passwordInput = null;
    // resize事件
    // this.debouncedHandleResize = debounce(this.handleResize, 100);
  }


  /**
   * 挂载后
   */
  componentDidMount() {
    this.getLocalStorage();
    this.addCarouselTimer();
    // this.handleResize();
    // window.addEventListener('resize', this.debouncedHandleResize);
  }

  /**
   * 销毁前
   */
  componentWillUnmount() {
    clearTimeout(this.carouselTimer);
    // window.removeEventListener('resize', this.debouncedHandleResize);
  }

  refBigCarousel = (bigCarousel) => {
    this.bigCarousel = bigCarousel;
  }

  refSmallCarousel = (smallCarousel) => {
    this.smallCarousel = smallCarousel;
  }

  refPasswordInput = (passwordInput) => {
    this.passwordInput = passwordInput;
  }

  refMain = (main) => {
    this.main = main;
  }

  /**
   * 获取localStorage数据
   */
  getLocalStorage = () => {
    const { location: { query: { type } } } = this.props;
    const { projectShortName } = config[type] || global.PROJECT_CONFIG;
    this.setState({ commonAccount: JSON.parse(localStorage.getItem(`${projectShortName}${localStorageName}`)) || [] });
  }

  /**
   * 存储localStorage数据
   */
  setLocalStorage = (data) => {
    const { location: { query: { type } } } = this.props;
    const { projectShortName } = config[type] || global.PROJECT_CONFIG;
    localStorage.setItem(`${projectShortName}${localStorageName}`, JSON.stringify(data));
  }

  /**
   * 添加轮播定时器
   */
  addCarouselTimer = () => {
    this.carouselTimer = setTimeout(() => {
      this.bigCarousel && this.bigCarousel.next();
      this.smallCarousel && this.smallCarousel.next();
      this.addCarouselTimer();
    }, carouselTime);
  }

  /**
   * resize事件
   */
  handleResize = () => {
    const height = window.innerHeight;
    const { size } = this.state;
    if (height > 800) {
      size !== 'large' && this.setState({ size: 'large' });
    }
    else if (height > 600) {
      size !== 'default' && this.setState({ size: 'default' });
    }
    else {
      size !== 'small' && this.setState({ size: 'small' });
    }
  }

  /**
   * 登录类型切换
   */
  handleTabChange = type => {
    this.setState({ type });
  };

  /**
   * 提交
   */
  handleSubmit = () => {
    const { form: { validateFields } } = this.props;
    validateFields((err, values) => {
      if (!err) {
        const { username, password, remember } = values;
        const payload = { username, password: aesEncrypt(password) };
        const { dispatch } = this.props;
        dispatch({
          type: 'login/login',
          payload,
          success: () => {
            const { commonAccount } = this.state;
            const account = commonAccount.filter(({ username: userName }) => userName === username)[0];
            // 账号已存在并且有更新时
            if (account && account.password !== payload.password) {
              account.password = payload.password;
              this.setLocalStorage(commonAccount);
            }
            // 账号不存在并且勾选保存时
            else if (!account && remember) {
              commonAccount.push(payload);
              this.setLocalStorage(commonAccount);
            }
          },
          error: (notice) => {
            this.setState({ notice });
          },
          handleMoreUser: () => {
            this.setState({
              isMoreUser: true,
              payload,
            });
          },
        });
      }
    });
  };

  /**
   * 快捷登录
   */
  handleQuickLogin = (payload) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/login',
      payload,
      error: () => {
        this.setState({ notice: '密码已更换，请手动登录以更新本地账号！' });
      },
      handleMoreUser: () => {
        this.setState({
          isMoreUser: true,
          payload,
        });
      },
    });
  }

  /**
   * 用户名输入框回车
   */
  handleUsernamePressEnter = () => {
    this.passwordInput.focus();
    // const { form: { validateFields } } = this.props;
    // validateFields(['username'], (err) => {
    //   if (!err) {
    //   }
    // });
  }

  /**
   * 密码输入框回车
   */
  handlePasswordPressEnter = () => {
    this.handleSubmit();
  }

  /**
   * 多用户选择
   */
  handleSelectUser = (userId) => {
    const { dispatch } = this.props;
    const { payload } = this.state;

    dispatch({
      type: 'login/loginWithUserId',
      payload: {
        userId,
        ...payload,
      },
    });
  }

  /**
   * 关闭警告
   */
  handleAlertClose = () => {
    this.setState({ notice: undefined });
  }

  /**
   * 前往下载页面
   */
  handleToDownload = () => {
    const { location: { search } } = this.props;
    router.push(`/user/download${search}`);
  }

  /**
   *
   */
  handleDeleteCommonAccount = (account) => {
    Modal.confirm({
      cancelText: '取消',
      okText: '确定',
      maskClosable: false,
      closable: false,
      mask: false,
      keyboard: false,
      centered: true,
      title: '您确定要删除这个常用账号吗？',
      getContainer: () => this.main,
      onOk: () => {
        const { commonAccount } = this.state;
        const newCommonAccount = commonAccount.filter(item => item !== account);
        // 更新本地数据
        this.setState({ commonAccount: newCommonAccount });
        // 更新localStorage
        this.setLocalStorage(newCommonAccount);
      },
    });
  }

  /**
   * 表单
   */
  renderForm = () => {
    const { form: { getFieldDecorator } } = this.props;
    const { size, notice } = this.state;

    return (
      <Form className={styles.form}>
        {notice && (
          <Alert style={{ marginBottom: 16 }} message={notice} type="error" showIcon closable onClose={this.handleAlertClose} />
        )}
        <FormItem>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入账号!' }],
          })(
            <Input
              size={size}
              prefix={<Icon type="user" className={styles.icon} />}
              placeholder="账号"
              onPressEnter={this.handleUsernamePressEnter}
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码!' }],
          })(
            <Input
              size={size}
              prefix={<Icon type="lock" className={styles.icon} />}
              type="password"
              placeholder="密码"
              onPressEnter={this.handlePasswordPressEnter}
              ref={this.refPasswordInput}
            />
          )}
        </FormItem>
        <FormItem className={styles.checkboxFormItem}>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>保存为本地常用账号</Checkbox>
          )}
        </FormItem>
        {this.renderCommonAccount()}
        <FormItem className={styles.submitFormItem}>
          <Button
            size={size}
            htmlType="button"
            type="primary"
            className={styles.submitButton}
            onClick={this.handleSubmit}
            block
          >
            登录
          </Button>
        </FormItem>
        <FormItem className={styles.downloadFormItem}>
          <div className={styles.downloadContainer}>
            <span onClick={this.handleToDownload} className={styles.download}>
              <Icon type="download" className={styles.downloadIcon} />
              APP下载
            </span>
          </div>
        </FormItem>
      </Form>
    );
  }

  /**
   * 多用户
   */
  renderMoreUser = () => {
    let {
      login: { users },
    } = this.props;
    users = users.slice(0, 5);
    return (
      <List
        dataSource={users}
        split={false}
        renderItem={({ userId, unitName }) => (
          <List.Item key={userId} className={styles.listItem}>
            <Card.Grid onClick={() => this.handleSelectUser(userId)} className={styles.cardGrid}>
              {unitName ? unitName : '运营企业'}
            </Card.Grid>
          </List.Item>
        )}
      />
    );
  };

  /**
   * 常用账号
   */
  renderCommonAccount() {
    const { commonAccount } = this.state;
    const showAccount = commonAccount && commonAccount.length > 0;
    return (
      <div className={styles.commonAccountWrapper}>
        {showAccount && <div>选择常用账号登录：</div>}
        {showAccount && commonAccount.map((item) => (
          <div key={item.username} className={styles.commonAccount}>
            <span className={styles.quickLoginButton} onClick={() => {this.handleQuickLogin(item);}}>{item.username}</span>
            <span className={styles.accountDeleleButton} onClick={() => {this.handleDeleteCommonAccount(item);}}><Icon type="close" /></span>
          </div>
        ))}
      </div>
    );
  }

  /**
   * 手机版
   */
  renderMobile() {
    const { submitting, location: { query: { type: configType } } } = this.props;
    const { isMoreUser } = this.state;
    const { logo } = global.PROJECT_CONFIG;
    const { projectName, focus } = config[configType] || global.PROJECT_CONFIG;

    return (
      <div className={styles.mobileContainer}>
        <div className={styles.main} ref={this.refMain}>
          <Spin spinning={!!submitting}>
            <div className={styles.titleWrapper}>
              <div className={styles.logo} style={{ backgroundImage: `url(${logo})` }} />
              <div className={styles.title}>{projectName}</div>
            </div>
            {/* <div className={styles.logo} /> */}
            <div className={styles.formWrapper}>
              {isMoreUser ? this.renderMoreUser() : this.renderForm()}
            </div>
          </Spin>
          <div className={styles.carouselWrapper}>
            <Carousel dots={false} ref={this.refSmallCarousel}>
              {focus.map(url => (
                <div key={url} className={styles.imageWrapper}>
                  <div className={styles.image} style={{ backgroundImage: `url(${url})` }} />
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </div>
    );
  }

  /**
   * PC端
   */
  renderPC() {
    const { submitting, location: { query: { type: configType } } } = this.props;
    const { type, isMoreUser } = this.state;
    const { logo, unitName, servicePhone, serviceSupport } = global.PROJECT_CONFIG;
    const { projectName, focus, blur } = config[configType] || global.PROJECT_CONFIG;

    return (
      <div className={styles.container}>
        <div className={styles.carouselWrapper}>
          <Carousel dots={false} ref={this.refBigCarousel} effect="fade">
            {blur.map(url => (
              <div key={url} className={styles.imageWrapper}>
                <div className={styles.image} style={{ backgroundImage: `url(${url})` }} />
              </div>
            ))}
          </Carousel>
        </div>
        {/* <div className={styles.cover} /> */}
        <div className={styles.wrapper}>
          <div className={styles.carouselWrapper}>
            <Carousel dots={false} ref={this.refSmallCarousel} effect="fade">
              {focus.map(url => (
                <div key={url} className={styles.imageWrapper}>
                  <div className={styles.image} style={{ backgroundImage: `url(${url})` }} />
                </div>
              ))}
            </Carousel>
          </div>
          <div className={styles.main} ref={this.refMain}>
            <Spin spinning={!!submitting}>
              <div className={styles.titleWrapper}>
                <div className={styles.logo} style={{ backgroundImage: `url(${logo})` }} />
                <div className={styles.title}>{projectName}</div>
              </div>
              {/* <div className={styles.logo} /> */}
              <div className={styles.formWrapper}>
                {isMoreUser ? this.renderMoreUser() : (
                  <Tabs activeKey={type} onChange={this.handleTabChange}>
                    <TabPane tab="账号密码登录" key="1">{this.renderForm()}</TabPane>
                  </Tabs>
                )}
              </div>
            </Spin>
          </div>
        </div>
        <div className={styles.footer}>
          <div>
            <div><span>copyright©2019</span><span>{unitName}</span></div>
            <div><span>运营支持：{serviceSupport}</span><span>服务电话：{servicePhone}</span></div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * 渲染
   */
  render() {
    return isFromMobile ? this.renderMobile() : this.renderPC();
  }
}
