import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Tabs } from 'antd';
import classNames from 'classnames';
import LoginItem from './LoginItem';
import LoginTab from './LoginTab';
import LoginSubmit from './LoginSubmit';
import styles from './index.less';
import LoginContext from './loginContext';

class Login extends Component {
  static propTypes = {
    className: PropTypes.string,
    defaultActiveKey: PropTypes.string,
    onTabChange: PropTypes.func,
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    defaultActiveKey: '',
    onTabChange: () => {},
    onSubmit: () => {},
  };

<<<<<<< HEAD
  constructor(props) {
    super(props);
    this.state = {
      type: props.defaultActiveKey,
      tabs: [],
      active: {},
    };
  }

=======
  state = {
    type: this.props.defaultActiveKey,
    tabs: [],
    active: {},
  };
>>>>>>> init
  onSwitch = type => {
    this.setState({
      type,
    });
<<<<<<< HEAD
    const { onTabChange } = this.props;
    onTabChange(type);
  };

  getContext = () => {
    const { tabs } = this.state;
    const { form } = this.props;
=======
    this.props.onTabChange(type);
  };
  getContext = () => {
>>>>>>> init
    return {
      tabUtil: {
        addTab: id => {
          this.setState({
<<<<<<< HEAD
            tabs: [...tabs, id],
=======
            tabs: [...this.state.tabs, id],
>>>>>>> init
          });
        },
        removeTab: id => {
          this.setState({
<<<<<<< HEAD
            tabs: tabs.filter(currentId => currentId !== id),
          });
        },
      },
      form,
=======
            tabs: this.state.tabs.filter(currentId => currentId !== id),
          });
        },
      },
      form: this.props.form,
>>>>>>> init
      updateActive: activeItem => {
        const { type, active } = this.state;
        if (active[type]) {
          active[type].push(activeItem);
        } else {
          active[type] = [activeItem];
        }
        this.setState({
          active,
        });
      },
    };
  };
<<<<<<< HEAD

=======
>>>>>>> init
  handleSubmit = e => {
    e.preventDefault();
    const { active, type } = this.state;
    const activeFileds = active[type];
<<<<<<< HEAD
    const { form, onSubmit } = this.props;
    form.validateFields(activeFileds, { force: true }, (err, values) => {
      onSubmit(err, values);
    });
  };

=======
    this.props.form.validateFields(activeFileds, { force: true }, (err, values) => {
      this.props.onSubmit(err, values);
    });
  };
>>>>>>> init
  render() {
    const { className, children } = this.props;
    const { type, tabs } = this.state;
    const TabChildren = [];
    const otherChildren = [];
    React.Children.forEach(children, item => {
      if (!item) {
        return;
      }
      // eslint-disable-next-line
      if (item.type.typeName === 'LoginTab') {
        TabChildren.push(item);
      } else {
        otherChildren.push(item);
      }
    });
    return (
      <LoginContext.Provider value={this.getContext()}>
        <div className={classNames(className, styles.login)}>
          <Form onSubmit={this.handleSubmit}>
            {tabs.length ? (
              <>
                <Tabs
                  animated={false}
                  className={styles.tabs}
                  activeKey={type}
                  onChange={this.onSwitch}
                >
                  {TabChildren}
                </Tabs>
                {otherChildren}
              </>
            ) : (
              [...children]
            )}
          </Form>
        </div>
      </LoginContext.Provider>
    );
  }
}

Login.Tab = LoginTab;
Login.Submit = LoginSubmit;
Object.keys(LoginItem).forEach(item => {
  Login[item] = LoginItem[item];
});

export default Form.create()(Login);
