import { Component } from 'react';
import { Row, Col, Dropdown, Menu } from 'antd';
// import _ from 'lodash';
import { connect } from 'dva';
import router from 'umi/router';
import config from './../../../../config/config';
// 在zh-CN.js文件中找到对应文案
import { formatMessage } from 'umi/locale';
import { filterBigPlatform } from '@/utils/customAuth';
import classNames from 'classnames';
import styles from './index.less';

// 每个模块标题左侧图
import dividerPic from '@/assets/divider.png';

// 项目名称、logo
const { projectShortName, logo } = global.PROJECT_CONFIG;
// 每个模块标题左侧色块
const Divider = () => (
  <div
    className={styles.divider}
    style={{
      background: `url(${dividerPic}) no-repeat center center`,
      backgroundSize: '100% 100%',
    }}
  />
);
const itemColWrapper = {
  xs: 24,
  sm: 12,
  md: 8,
  lg: 4,
  xl: 4,
};

const blockClassification = [
  {
    name: '安全生产全流程管理系统',
    blocks: [
      'baseInfo',
      'fireControl',
      'roleAuthorization',
      'dataAnalysis',
      'systemManagement',
      'lawEnforcement',
      'safetyKnowledgeBase',
      'announcementManagement',
    ],
    style: { top: '57px', left: '211px', padding: '3px 30px' },
  },
  {
    name: '安全风险分区管理系统',
    blocks: ['riskControl', 'twoInformationManagement', 'cardsInfo'],
    style: { top: '118px', left: '257px', padding: '3px 20px' },
  },
  {
    name: '重大危险源监测预警系统',
    blocks: [
      'deviceManagement',
      'videoMonitor',
      'emergencyManagement',
      'accidentManagement',
      'iot',
    ],
    style: { top: '186px', left: '261px', padding: '3px 20px' },
  },
  {
    name: '人员在岗在位管理系统',
    blocks: ['training', 'personnelPosition', 'securityManage', 'personnelManagement'],
    style: { top: '246px', left: '188px', padding: '3px 30px' },
  },
];

@connect(({ user }) => ({
  user,
}))
export default class MenuReveal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuSys: [], // 系统菜单列表
      menuBigPlatform: [], // 驾驶舱列表
      currentBlockClassification: 0, // 左侧分类下标（数组blockClassification下标）
    };
    this.menuBigPlatformDom = null; // // 驾驶舱下拉容器dom
  }

  componentDidMount () {
    const { dispatch } = this.props;
    // 深拷贝，防止污染配置文件
    const menuAll = JSON.parse(JSON.stringify(config['routes']));
    dispatch({ type: 'user/fetchGrids' });
    // 获取用户信息 包含permissionCodes，
    dispatch({
      type: 'user/fetchCurrent',
      callback: () => {
        const { user } = this.props;
        // 驾驶舱路由、系统路由
        const configBigPlatform = menuAll.find(item => item.path === '/big-platform');
        const configSys = menuAll.find(item => item.path === '/');
        const menuSysAll = this.filterSysMenu(configSys.routes, 2);
        const menuBigPlatform = filterBigPlatform(configBigPlatform.routes, user);
        const blocks = blockClassification[0].blocks;
        const menuSys = menuSysAll.filter(item => blocks.includes(item.name));
        this.setState({ menuSys, menuSysAll, menuBigPlatform });
        // console.log('menuSys', menuSysAll);
      },
    });
  }

  /**
   * 筛选系统路由
   * @param {Array} array 待处理数组
   * @param {Number} depth depth=2 两层含有routes子节点数组
   * @param {String} parentLocale 上级节点的locale，locale用于生成对应的文字描述（与zh-CN.js文件对应）
   **/
  filterSysMenu = (array, depth = 0, parentLocale) => {
    const {
      user: {
        currentUser: { permissionCodes },
      },
    } = this.props;
    return array.reduce((arr, item) => {
      let locale = 'menu';
      if (parentLocale && item.name) {
        locale = `${parentLocale}.${item.name}`;
      } else if (item.name) {
        locale = `menu.${item.name}`;
      } else if (parentLocale) {
        locale = parentLocale;
      }
      // 筛选掉重定向、隐藏菜单、首页或工作台、无权限
      if (
        item.redirect ||
        item.hideInMenu ||
        ['/dashboard', '/company-workbench'].includes(item.path) ||
        !permissionCodes.includes(item.code)
      ) {
        return arr;
      } else if (item.routes && item.routes.length && +depth > 1) {
        return [
          ...arr,
          {
            ...item,
            locale,
            title: formatMessage({ id: locale }),
            routes: this.filterSysMenu(item.routes, depth - 1, locale),
          },
        ];
      } else {
        const { routes, ...res } = item;
        return [...arr, { ...res, title: formatMessage({ id: locale }), locale }];
      }
    }, []);
  };

  // 点击菜单 打开相应新页面
  handleOpenMenu = url => {
    // window.open(`${window.publicPath}#${url}`, '_blank')
    router.push(url);
  };

  // 去除url中尾部参数
  clearParam = url => (/\:/.test(url) ? url.split(':').shift() : url);

  // 生成系统菜单图标url http://data.jingan-china.cn/v2/menu/+模块名称+菜单名称
  generateSysUrl = ({ locale, title }) => {
    const parentLocale = locale
      .split('.')
      .slice(0, 2)
      .join('.');
    const parentTitle = formatMessage({ id: parentLocale });
    return `http://data.jingan-china.cn/v2/menu/${encodeURIComponent(
      parentTitle
    )}/${encodeURIComponent(title)}.png`;
  };

  // 点击驾驶舱菜单
  clickBigPlatformMenu = ({ key }) => {
    const { menuBigPlatform } = this.state;
    const target = menuBigPlatform.find(item => item.name === key);
    window.open(target.path || `${window.publicPath}#/`, '_blank');
  };

  // 生成模块分类元素classname
  classificationClass = index => {
    const { currentBlockClassification } = this.state;
    return classNames(styles.classificationItem, {
      [styles.selected]: currentBlockClassification === index,
    });
  };

  // 点击模块分类
  handleSelectBlockClassification = index => {
    const { dispatch } = this.props;
    const { menuSysAll } = this.state;
    const blocks = blockClassification[index].blocks;
    const menuSys = menuSysAll.filter(item => blocks.includes(item.name));
    this.setState({ currentBlockClassification: index, menuSys });
  };

  render () {
    const { menuSys, menuBigPlatform } = this.state;
    const menu = (
      <Menu selectedKeys={[]} onClick={this.clickBigPlatformMenu}>
        {menuBigPlatform && menuBigPlatform.length
          ? menuBigPlatform.map(item => (
            <Menu.Item key={item.name}>{formatMessage({ id: item.locale })}</Menu.Item>
          ))
          : null}
      </Menu>
    );
    return (
      <div className={styles.menuRevealContainer}>
        {/* 头部 */}
        <div className={styles.header}>
          <a href="#/">
            <img src={logo} alt="logo" />
            <h1>{projectShortName}</h1>
          </a>
          <div className={styles.menu}>
            <div
              className={styles.menuItem}
              onClick={() => router.push('/company-workbench/view')}
            >
              <span>工作台</span>
            </div>
            <div className={styles.menuItem}>
              <span style={{ color: 'white' }}>系统</span>
            </div>
            <div
              className={styles.menuItem}
              ref={ref => {
                this.menuBigPlatformDom = ref;
              }}
            >
              <Dropdown overlay={menu} getPopupContainer={() => this.menuBigPlatformDom}>
                <span>驾驶舱</span>
              </Dropdown>
            </div>
          </div>
        </div>
        {/* 内容 */}
        <Row className={styles.content}>
          {/* 左侧筛选 */}
          <div className={styles.classificationContainer}>
            <div className={styles.classification}>
              {blockClassification.map(({ name, style }, index) => (
                <div
                  key={index}
                  className={this.classificationClass(index)}
                  style={style}
                  onClick={() => this.handleSelectBlockClassification(index)}
                >
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>
          {/* 模块内容 */}
          <div className={styles.blockContainer}>
            {menuSys.length
              ? menuSys.map(block => (
                <Row key={block.name}>
                  <div className={styles.blockTitle}>
                    <Divider /> {block.title}
                  </div>
                  <Row className={styles.blockContent}>
                    {block.routes && block.routes.length
                      ? block.routes.map(item => (
                        <Col key={item.name} {...itemColWrapper} className={styles.itemOuter}>
                          <div className={styles.item}>
                            <div
                              className={styles.itemInner}
                              onClick={() => this.handleOpenMenu(item.path)}
                            >
                              <img src={this.generateSysUrl(item)} alt="logo" />
                              <div>{item.title}</div>
                            </div>
                          </div>
                        </Col>
                      ))
                      : null}
                  </Row>
                </Row>
              ))
              : null}
          </div>
        </Row>
      </div>
    );
  }
}
