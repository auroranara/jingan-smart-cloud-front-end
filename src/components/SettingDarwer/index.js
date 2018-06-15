import React, { PureComponent } from 'react';
import { Select, message, List, Switch, Divider, Icon } from 'antd';
import DrawerMenu from 'rc-drawer';
import { connect } from 'dva';
import styles from './index.less';
import ThemeColor from './ThemeColor';
import BlockChecbox from './BlockChecbox';

const Body = ({ children, title, style }) => (
  <div
    style={{
      ...style,
      marginBottom: 24,
    }}
  >
    <h3 className={styles.title}>{title}</h3>
    {children}
  </div>
);

@connect(({ setting }) => ({ setting }))
class SettingDarwer extends PureComponent {
  componentDidMount() {
<<<<<<< HEAD
    const {
      setting: { themeColor, colorWeak },
    } = this.props;
=======
    const { themeColor, colorWeak } = this.props.setting;
>>>>>>> init
    if (themeColor !== '#1890FF') {
      window.less.refresh().then(() => {
        this.colorChange(themeColor);
      });
    }
    if (colorWeak === 'open') {
      document.body.className = 'colorWeak';
    }
  }
<<<<<<< HEAD

  getLayOutSetting = () => {
    const {
      setting: { grid, fixedHeader, autoHideHeader, fixSiderbar },
    } = this.props;
=======
  getLayOutSetting = () => {
    const { grid, fixedHeader, autoHideHeader, fixSiderbar } = this.props.setting;
>>>>>>> init
    return [
      {
        title: '栅格模式',
        action: [
          <Select
            value={grid}
            size="small"
            onSelect={value => this.changeSetting('grid', value)}
            style={{ width: 80 }}
          >
            <Select.Option value="Wide">定宽</Select.Option>
            <Select.Option value="Fluid">流式</Select.Option>
          </Select>,
        ],
      },
      {
        title: '固定 Header',
        action: [
          <Switch
            size="small"
            checked={!!fixedHeader}
            onChange={checked => this.changeSetting('fixedHeader', checked)}
          />,
        ],
      },
      {
        title: '下滑时隐藏 Header',
<<<<<<< HEAD
        hide: !fixedHeader,
=======
        hide: fixedHeader,
>>>>>>> init
        action: [
          <Switch
            size="small"
            checked={!!autoHideHeader}
            onChange={checked => this.changeSetting('autoHideHeader', checked)}
          />,
        ],
      },
      {
        title: '固定 Siderbar',
        action: [
          <Switch
            size="small"
            checked={!!fixSiderbar}
            onChange={checked => this.changeSetting('fixSiderbar', checked)}
          />,
        ],
      },
    ].filter(item => {
      return !item.hide;
    });
  };
<<<<<<< HEAD

  changeSetting = (key, value) => {
    const { setting } = this.props;
    const nextState = { ...setting };
=======
  changeSetting = (key, value) => {
    const nextState = { ...this.props.setting };
>>>>>>> init
    nextState[key] = value;
    if (key === 'layout') {
      if (value === 'topmenu') {
        nextState.grid = 'Wide';
      } else {
        nextState.grid = 'Fluid';
      }
    }
    if (key === 'fixedHeader') {
<<<<<<< HEAD
      if (!value) {
=======
      if (value) {
>>>>>>> init
        nextState.autoHideHeader = false;
      }
    }
    if (key === 'colorWeak') {
<<<<<<< HEAD
      if (value) {
=======
      if (value === 'open') {
>>>>>>> init
        document.body.className = 'colorWeak';
      } else {
        document.body.className = '';
      }
    }
    this.setState(nextState, () => {
<<<<<<< HEAD
      const { dispatch } = this.props;
      dispatch({
=======
      this.props.dispatch({
>>>>>>> init
        type: 'setting/changeSetting',
        payload: this.state,
      });
    });
  };
<<<<<<< HEAD

  togglerContent = () => {
    const { setting } = this.props;
    this.changeSetting('collapse', !setting.collapse);
  };

=======
  togglerContent = () => {
    this.changeSetting('collapse', !this.props.setting.collapse);
  };
>>>>>>> init
  colorChange = color => {
    this.changeSetting('themeColor', color);
    const hideMessage = message.loading('正在编译主题！', 0);
    setTimeout(() => {
      window.less
        .modifyVars({
          '@primary-color': color,
        })
        .then(() => {
          hideMessage();
        })
        .catch(() => {
          message.error(`Failed to update theme`);
        });
    }, 200);
  };
<<<<<<< HEAD

  render() {
    const {
      setting: { collapse, silderTheme, themeColor, layout, colorWeak },
    } = this.props;
=======
  render() {
    const { collapse, silderTheme, themeColor, layout, colorWeak } = this.props.setting;
>>>>>>> init
    return (
      <div className={styles.settingDarwer}>
        <DrawerMenu
          parent={null}
          level={null}
          open={collapse}
          mask={false}
          onHandleClick={this.togglerContent}
<<<<<<< HEAD
          handler={
            <div className="drawer-handle">
              {!collapse ? (
                <Icon
                  type="setting"
                  style={{
                    color: '#FFF',
                    fontSize: 20,
                  }}
                />
              ) : (
                <Icon
                  type="close"
                  style={{
                    color: '#FFF',
                    fontSize: 20,
                  }}
                />
              )}
            </div>
=======
          handleChild={
            !collapse ? (
              <Icon
                type="setting"
                style={{
                  color: '#FFF',
                  fontSize: 20,
                }}
              />
            ) : (
              <Icon
                type="close"
                style={{
                  color: '#FFF',
                  fontSize: 20,
                }}
              />
            )
>>>>>>> init
          }
          placement="right"
          width="336px"
          style={{
            zIndex: 999,
          }}
          onMaskClick={this.togglerContent}
        >
          <div className={styles.content}>
            <Body title="整体风格设置">
              <BlockChecbox
                list={[
                  {
                    key: 'dark',
                    url: 'https://gw.alipayobjects.com/zos/rmsportal/LCkqqYNmvBEbokSDscrm.svg',
                  },
                  {
                    key: 'light',
                    url: 'https://gw.alipayobjects.com/zos/rmsportal/jpRkZQMyYRryryPNtyIC.svg',
                  },
                ]}
                value={silderTheme}
                onChange={value => this.changeSetting('silderTheme', value)}
              />
            </Body>

            <ThemeColor value={themeColor} onChange={this.colorChange} />

            <Divider />

            <Body title="导航设置 ">
              <BlockChecbox
                list={[
                  {
                    key: 'sidemenu',
                    url: 'https://gw.alipayobjects.com/zos/rmsportal/JopDzEhOqwOjeNTXkoje.svg',
                  },
                  {
                    key: 'topmenu',
                    url: 'https://gw.alipayobjects.com/zos/rmsportal/KDNDBbriJhLwuqMoxcAr.svg',
                  },
                ]}
                value={layout}
                onChange={value => this.changeSetting('layout', value)}
              />
            </Body>

            <List
              split={false}
              dataSource={this.getLayOutSetting()}
              renderItem={item => <List.Item actions={item.action}>{item.title}</List.Item>}
            />

            <Divider />

            <Body title="其他设置 ">
              <List.Item
                actions={[
<<<<<<< HEAD
                  <Switch
                    size="small"
                    checked={!!colorWeak}
                    onChange={checked => this.changeSetting('colorWeak', checked)}
                  />,
=======
                  <Select
                    value={colorWeak}
                    size="small"
                    onSelect={value => this.changeSetting('colorWeak', value)}
                    style={{ width: 80 }}
                  >
                    <Select.Option value="close">close</Select.Option>
                    <Select.Option value="open">open</Select.Option>
                  </Select>,
>>>>>>> init
                ]}
              >
                色弱模式
              </List.Item>
            </Body>
          </div>
        </DrawerMenu>
      </div>
    );
  }
}

export default SettingDarwer;
