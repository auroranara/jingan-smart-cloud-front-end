import React, { PureComponent, Fragment } from 'react';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Alert,
  Input,
  Carousel,
  Button,
  Checkbox,
  List,
  Card,
  Tabs,
  Spin,
  Modal,
  message,
} from 'antd';
import CountDown from '@/components/CountDown';
import { connect } from 'dva';
import router from 'umi/router';
// import debounce from 'lodash/debounce';
import { aesEncrypt, isMobileExcludeIpad } from '@/utils/utils';
import config from '../config';
// 引入样式文件
import styles from './index.less';

const { Item: FormItem } = Form;
const { TabPane } = Tabs;

// 轮播时间
const carouselTime = 10 * 1000;
// localStorage名称
const localStorageName = '_login_account';
// 是否为手机端
const isFromMobile = isMobileExcludeIpad();
// 验证码组件
const Code = ({
  size,
  value,
  onChange,
  onClick,
  onPressEnter,
  refCodeInput,
  coding,
  targetTime,
  onEnd,
  onFocus,
}) => {
  return (
    <div className={styles.codeContainer}>
      <div className={styles.codeWrapper}>
        <Input
          value={value}
          onChange={onChange}
          size={size}
          prefix={<LegacyIcon type="mail" className={styles.icon} />}
          placeholder="验证码"
          onPressEnter={onPressEnter}
          ref={refCodeInput}
          onFocus={onFocus}
        />
      </div>
      <div className={styles.codeWrapper}>
        <Button disabled={coding} onClick={onClick} size={size}>
          {coding ? (
            <CountDown
              className={styles.countDown}
              format={time => `${Math.ceil(time / 1000)} s`}
              target={targetTime}
              onEnd={onEnd}
            />
          ) : (
            '获取验证码'
          )}
        </Button>
      </div>
    </div>
  );
};

/**
 * description: 登录页面
 * author: sunkai
 * date: 2019年01月23日
 */
@connect(({ login, loading }) => ({
  login,
  submitting: loading.models.login,
  sending: loading.effects['login/getCode'],
}))
@Form.create()
export default class Login extends PureComponent {
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
      // 是否正在获取验证码
      coding: false,
      // 目标时间
      targetTime: undefined,
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

  refBigCarousel = bigCarousel => {
    this.bigCarousel = bigCarousel;
  };

  refSmallCarousel = smallCarousel => {
    this.smallCarousel = smallCarousel;
  };

  refPasswordInput = passwordInput => {
    this.passwordInput = passwordInput;
  };

  refMain = main => {
    this.main = main;
  };

  refCodeInput = codeInput => {
    this.codeInput = codeInput;
  };

  /**
   * 获取localStorage数据
   */
  getLocalStorage = () => {
    const {
      location: {
        query: { type },
      },
    } = this.props;
    const { projectShortName } = config[type] || global.PROJECT_CONFIG;
    this.setState({
      commonAccount:
        JSON.parse(localStorage.getItem(`${projectShortName}${localStorageName}`)) || [],
    });
  };

  /**
   * 存储localStorage数据
   */
  setLocalStorage = data => {
    const {
      location: {
        query: { type },
      },
    } = this.props;
    const { projectShortName } = config[type] || global.PROJECT_CONFIG;
    localStorage.setItem(`${projectShortName}${localStorageName}`, JSON.stringify(data));
  };

  /**
   * 添加轮播定时器
   */
  addCarouselTimer = () => {
    this.carouselTimer = setTimeout(() => {
      this.bigCarousel && this.bigCarousel.next();
      this.smallCarousel && this.smallCarousel.next();
      this.addCarouselTimer();
    }, carouselTime);
  };

  /**
   * resize事件
   */
  handleResize = () => {
    const height = window.innerHeight;
    const { size } = this.state;
    if (height > 800) {
      size !== 'large' && this.setState({ size: 'large' });
    } else if (height > 600) {
      size !== 'default' && this.setState({ size: 'default' });
    } else {
      size !== 'small' && this.setState({ size: 'small' });
    }
  };

  /**
   * 登录类型切换
   */
  handleTabChange = type => {
    const { targetTime, coding } = this.state;
    const now = +new Date();
    this.setState({
      type,
      notice: undefined,
      ...(coding && targetTime <= now && { coding: false }),
    });
  };

  /**
   * 提交
   */
  handleSubmit = () => {
    const {
      dispatch,
      form: { validateFields },
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        const { type } = this.state;
        if (type === '1') {
          const { username, password, remember } = values;
          const payload = { username, password: aesEncrypt(password) };
          dispatch({
            type: 'login/login',
            payload,
            success: ({ isFirstLogin, ruleStatus }) => {
              const { commonAccount } = this.state;
              const account = commonAccount.filter(
                ({ username: userName }) => userName === username
              )[0];
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
              if (+isFirstLogin === 1) message.warn('首次登录，请修改密码');
              else if (+ruleStatus === 1) message.warn('密码规则已改变，请修改密码');
            },
            error: notice => {
              this.setState({ notice });
            },
            handleMoreUser: () => {
              this.setState({
                isMoreUser: true,
                payload,
              });
            },
          });
        } else {
          dispatch({
            type: 'login/loginByPhone',
            payload: values,
            error: notice => {
              this.setState({ notice });
            },
            success: ({ isFirstLogin, ruleStatus }) => {
              if (+isFirstLogin === 1) message.warn('首次登录，请修改密码');
              else if (+ruleStatus === 1) message.warn('密码规则已改变，请修改密码');
            },
            handleMoreUser: props => {
              this.setState({
                isMoreUser: true,
                payload: {
                  ...props,
                  ...values,
                },
              });
            },
          });
        }
      }
    });
  };

  /**
   * 快捷登录
   */
  handleQuickLogin = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/login',
      payload,
      error: () => {
        this.setState({ notice: '密码已更换，请手动登录以更新本地账号！' });
      },
      success: ({ isFirstLogin, ruleStatus }) => {
        if (+isFirstLogin === 1) message.warn('首次登录，请修改密码');
        else if (+ruleStatus === 1) message.warn('密码规则已改变，请修改密码');
      },
      handleMoreUser: () => {
        this.setState({
          isMoreUser: true,
          payload,
        });
      },
    });
  };

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
  };

  /**
   * 密码输入框回车
   */
  handlePasswordPressEnter = () => {
    this.handleSubmit();
  };

  // 手机号输入框回车
  handlePhonePressEnter = () => {
    this.codeInput.focus();
  };

  // 验证码输入框回车
  handleCodePressEnter = () => {
    this.handleSubmit();
  };

  // 获取验证码按钮点击事件
  handleCodeButtonClick = () => {
    const {
      dispatch,
      form: { validateFieldsAndScroll },
    } = this.props;
    validateFieldsAndScroll(['phone'], (errors, values) => {
      if (!errors) {
        dispatch({
          type: 'login/getCode',
          payload: values,
          callback: ({ code, msg }) => {
            if (code === 200) {
              message.success('发送成功！');
            } else {
              this.setState({ notice: msg });
            }
          },
        });
        this.setState({
          coding: true,
          targetTime: +new Date() + 60000,
        });
      }
    });
  };

  // 获取验证码倒计时结束
  handleCodingEnd = () => {
    this.setState({
      coding: false,
    });
  };

  /**
   * 多用户选择
   */
  handleSelectUser = userId => {
    const { dispatch } = this.props;
    const { payload, type } = this.state;

    dispatch({
      type: 'login/loginWithUserId',
      payload: {
        type,
        userId,
        ...payload,
      },
      success: ({ isFirstLogin, ruleStatus }) => {
        if (+isFirstLogin === 1) message.warn('首次登录，请修改密码');
        else if (+ruleStatus === 1) message.warn('密码规则已改变，请修改密码');
      },
    });
  };

  /**
   * 关闭警告
   */
  handleAlertClose = () => {
    this.setState({ notice: undefined });
  };

  /**
   * 前往下载页面
   */
  handleToDownload = () => {
    const {
      location: { search },
    } = this.props;
    router.push(`/user/download${search}`);
  };

  handleToForget = () => {
    router.push(`/user/forget-password`);
  };

  /**
   *
   */
  handleDeleteCommonAccount = account => {
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
  };

  /**
   * 表单
   */
  renderForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { size, notice, type, coding, targetTime } = this.state;

    return (
      <Form className={styles.form}>
        {notice && (
          <Alert
            style={{ marginBottom: 16 }}
            message={notice}
            type="error"
            showIcon
            closable
            onClose={this.handleAlertClose}
          />
        )}
        {type === '1' ? (
          <Fragment>
            <FormItem>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '请输入账号！' }],
              })(
                <Input
                  size={size}
                  prefix={<LegacyIcon type="user" className={styles.icon} />}
                  placeholder="账号"
                  onPressEnter={this.handleUsernamePressEnter}
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码！' }],
              })(
                <Input.Password
                  size={size}
                  prefix={<LegacyIcon type="lock" className={styles.icon} />}
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
              })(<Checkbox>保存为本地常用账号</Checkbox>)}
            </FormItem>
            {this.renderCommonAccount()}
          </Fragment>
        ) : (
          <Fragment>
            <FormItem>
              {getFieldDecorator('phone', {
                getValueFromEvent: ({ target: { value } }) =>
                  value.replace(/(\d*).*/, '$1').slice(0, 11),
                rules: [
                  { required: true, message: '请输入手机号！' },
                  { len: 11, message: '手机号格式错误！' },
                ],
              })(
                <Input
                  size={size}
                  prefix={<LegacyIcon type="mobile" className={styles.icon} />}
                  placeholder="手机号"
                  onPressEnter={this.handlePhonePressEnter}
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('code', {
                getValueFromEvent: ({ target: { value } }) =>
                  value.replace(/(\d*).*/, '$1').slice(0, 6),
                rules: [
                  { required: true, message: '请输入验证码！' },
                  { len: 6, message: '验证码格式错误！' },
                ],
              })(
                <Code
                  size={size}
                  onPressEnter={this.handleCodePressEnter}
                  refCodeInput={this.refCodeInput}
                  onClick={this.handleCodeButtonClick}
                  coding={coding}
                  targetTime={targetTime}
                  onEnd={this.handleCodingEnd}
                />
              )}
            </FormItem>
          </Fragment>
        )}
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
              <LegacyIcon type="download" className={styles.downloadIcon} />
              APP下载
            </span>
            <div onClick={this.handleToForget} className={styles.forget}>
              忘记密码
            </div>
          </div>
        </FormItem>
      </Form>
    );
  };

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
        renderItem={({ userId, unitName, roleName }) => (
          <List.Item key={userId} className={styles.listItem}>
            <Card.Grid onClick={() => this.handleSelectUser(userId)} className={styles.cardGrid}>
              <div className={styles.cardGridDiv}>{unitName ? unitName : '平台管理'}</div>
              {roleName && <div className={styles.cardGridDiv}>{roleName}</div>}
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
        {showAccount &&
          commonAccount.map(item => (
            <div key={item.username} className={styles.commonAccount}>
              <span
                className={styles.quickLoginButton}
                onClick={() => {
                  this.handleQuickLogin(item);
                }}
              >
                {item.username}
              </span>
              <span
                className={styles.accountDeleleButton}
                onClick={() => {
                  this.handleDeleteCommonAccount(item);
                }}
              >
                <LegacyIcon type="close" />
              </span>
            </div>
          ))}
      </div>
    );
  }

  /**
   * 手机版
   */
  renderMobile() {
    const {
      submitting,
      sending,
      location: {
        query: { type: configType },
      },
    } = this.props;
    const { isMoreUser } = this.state;
    const { logo } = global.PROJECT_CONFIG;
    const { projectName, focus } = config[configType] || global.PROJECT_CONFIG;

    return (
      <div className={styles.mobileContainer}>
        <div className={styles.main} ref={this.refMain}>
          <Spin spinning={(submitting && !sending) || false}>
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
    const {
      submitting,
      sending,
      location: {
        query: { type: configType },
      },
    } = this.props;
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
            <Spin spinning={(submitting && !sending) || false}>
              <div className={styles.titleWrapper}>
                <div className={styles.logo} style={{ backgroundImage: `url(${logo})` }} />
                <div className={styles.title}>{projectName}</div>
              </div>
              {/* <div className={styles.logo} /> */}
              <div className={styles.formWrapper}>
                {isMoreUser ? (
                  this.renderMoreUser()
                ) : (
                  <Tabs activeKey={type} onChange={this.handleTabChange} animated={false}>
                    <TabPane tab="账号密码登录" key="1">
                      {type === '1' && this.renderForm()}
                    </TabPane>
                    <TabPane tab="手机号登录" key="2">
                      {type === '2' && this.renderForm()}
                    </TabPane>
                  </Tabs>
                )}
              </div>
            </Spin>
          </div>
        </div>
        <div className={styles.footer}>
          <div>
            <div>
              <span>copyright©2020</span>
              <span>{unitName}</span>
              <span style={{ marginLeft: '5px' }}>{global.VERSION}</span>
            </div>
            <div>
              {serviceSupport && (
                <span>
                  运营支持：
                  {serviceSupport}
                </span>
              )}
              {servicePhone && (
                <span>
                  服务电话：
                  {servicePhone}
                </span>
              )}
            </div>
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
