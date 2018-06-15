import React, { Component } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import omit from 'omit.js';
import styles from './index.less';
import ItemMap from './map';
import LoginContext from './loginContext';

const FormItem = Form.Item;

class WarpFormItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }
<<<<<<< HEAD

  componentDidMount() {
    const { updateActive, name } = this.props;
    if (updateActive) {
      updateActive(name);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

=======
  componentDidMount() {
    if (this.props.updateActive) {
      this.props.updateActive(this.props.name);
    }
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
>>>>>>> init
  onGetCaptcha = () => {
    const { onGetCaptcha } = this.props;
    const result = onGetCaptcha ? onGetCaptcha() : null;
    if (result === false) {
      return;
    }
    if (result instanceof Promise) {
      result.then(this.runGetCaptchaCountDown);
    } else {
      this.runGetCaptchaCountDown();
    }
  };
<<<<<<< HEAD

=======
>>>>>>> init
  getFormItemOptions = ({ onChange, defaultValue, rules }) => {
    const options = {
      rules: rules || this.customprops.rules,
    };
    if (onChange) {
      options.onChange = onChange;
    }
    if (defaultValue) {
      options.initialValue = defaultValue;
    }
    return options;
  };
<<<<<<< HEAD

  runGetCaptchaCountDown = () => {
    const { countDown } = this.props;
    let count = countDown || 59;
=======
  runGetCaptchaCountDown = () => {
    let count = this.props.countDown || 59;
>>>>>>> init
    this.setState({ count });
    this.interval = setInterval(() => {
      count -= 1;
      this.setState({ count });
      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  };
<<<<<<< HEAD

  render() {
    const { count } = this.state;

    const {
      form: { getFieldDecorator },
    } = this.props;
=======
  render() {
    const { count } = this.state;

    const { getFieldDecorator } = this.props.form;
>>>>>>> init

    // 这么写是为了防止restProps中 带入 onChange, defaultValue, rules props
    const {
      onChange,
      customprops,
      defaultValue,
      rules,
      name,
      updateActive,
<<<<<<< HEAD
      type,
=======
>>>>>>> init
      ...restProps
    } = this.props;

    // get getFieldDecorator props
    const options = this.getFormItemOptions(this.props);

    const otherProps = restProps || {};
<<<<<<< HEAD
    if (type === 'Captcha') {
=======
    if (this.props.type === 'Captcha') {
>>>>>>> init
      const inputProps = omit(otherProps, ['onGetCaptcha']);
      return (
        <FormItem>
          <Row gutter={8}>
            <Col span={16}>
<<<<<<< HEAD
              {getFieldDecorator(name, options)(<Input {...customprops} {...inputProps} />)}
=======
              {getFieldDecorator(name, options)(
                <Input {...this.props.customprops} {...inputProps} />
              )}
>>>>>>> init
            </Col>
            <Col span={8}>
              <Button
                disabled={count}
                className={styles.getCaptcha}
                size="large"
                onClick={this.onGetCaptcha}
              >
                {count ? `${count} s` : '获取验证码'}
              </Button>
            </Col>
          </Row>
        </FormItem>
      );
    }
    return (
      <FormItem>
<<<<<<< HEAD
        {getFieldDecorator(name, options)(<Input {...customprops} {...otherProps} />)}
=======
        {getFieldDecorator(name, options)(<Input {...this.props.customprops} {...otherProps} />)}
>>>>>>> init
      </FormItem>
    );
  }
}

const LoginItem = {};
Object.keys(ItemMap).forEach(key => {
  const item = ItemMap[key];
  LoginItem[key] = props => {
    return (
      <LoginContext.Consumer>
        {context => (
          <WarpFormItem
            customprops={item.props}
            {...props}
            rules={item.rules}
            type={key}
            updateActive={context.updateActive}
            form={context.form}
          />
        )}
      </LoginContext.Consumer>
    );
  };
});

export default LoginItem;
