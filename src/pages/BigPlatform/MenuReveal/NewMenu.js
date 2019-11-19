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
import styles from './NewMenu.less';

// 每个模块标题左侧图
import dividerPic from '@/assets/divider.png';

const userLogoUrl = 'http://data.jingan-china.cn/v2/menu/icon-user.png';
const logoutLogoUrl = 'http://data.jingan-china.cn/v2/menu/icon-logout.png';

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
  lg: 8,
  xl: 4,
};

// 菜单模块分类配置
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
    icon: 'http://data.jingan-china.cn/v2/menu/icon-security-production.png',
  },
  {
    name: '安全风险分区管理系统',
    blocks: ['riskControl', 'twoInformationManagement', 'cardsInfo'],
    icon: 'http://data.jingan-china.cn/v2/menu/icon-security-risk.png',
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
    icon: 'http://data.jingan-china.cn/v2/menu/icon-major%20hazard.png',
  },
  {
    name: '人员在岗在位管理系统',
    blocks: ['training', 'personnelPosition', 'securityManage', 'personnelManagement'],
    icon: 'http://data.jingan-china.cn/v2/menu/icon-Staff.png',
  },
];

@connect(({ user, login }) => ({
  user,
  login,
}))
export default class NewMenuReveal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuSys: [], // 系统菜单列表
      currentBlockClassification: null, // 当前模块下标（数组blockClassification下标）
    };
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
        // 驾驶舱路由、系统路由
        const configSys = menuAll.find(item => item.path === '/');
        const menuSysAll = this.filterSysMenu(configSys.routes, 2);
        const blocks = blockClassification[0].blocks;
        const menuSys = menuSysAll.filter(item => blocks.includes(item.name));
        this.setState({ menuSys, menuSysAll });
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

  // 点击模块分类
  handleSelectBlockClassification = index => {
    const { menuSysAll } = this.state;
    const blocks = blockClassification[index].blocks;
    const menuSys = menuSysAll.filter(item => blocks.includes(item.name));
    this.setState({ currentBlockClassification: index, menuSys });
  };

  // 输出数据类型
  generateType = str => Object.prototype.toString.call(str).replace(/\[|\]|object\s/g, '').toLocaleLowerCase()

  generateMenuItemClass = index => {
    const { currentBlockClassification } = this.state;
    return classNames(styles.menyItem, {
      [styles.selectedItem]: currentBlockClassification === index,
    })
  }

  handleLogout = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/logout',
    });
  }

  renderBlocks = () => {
    return (
      <div className={styles.blocks}>
        {blockClassification.map((item, index) => (
          <div key={index} className={styles.blockItem} onClick={() => this.handleSelectBlockClassification(index)}>
            <div className={styles.blockItemInner}>
              <img src={item.icon} alt="block" />
              <div style={{ marginTop: '-10px' }}>{item.name.slice(0, 4)}</div>
              <div>{item.name.slice(4)}</div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  renderBlockMenus = () => {
    const { menuSys } = this.state;
    return (
      <div className={styles.innerContent}>
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
    )
  }

  render () {
    const {
      user: {
        currentUser: {
          userName,
        },
      },
    } = this.props
    const { currentBlockClassification } = this.state
    return (
      <div className={styles.newMenuRevealContainer}>
        {/* 头部 */}
        <div className={styles.header}>
          <span>{projectShortName}</span>
          <div className={styles.headerLine}></div>
          <div className={styles.userInfo}>
            <img src={userLogoUrl} alt="user" />
            <span>{userName}</span>
            <img onClick={this.handleLogout} src={logoutLogoUrl} alt="logout" />
          </div>
          {this.generateType(currentBlockClassification) === 'number' ? (
            <div className={styles.menuContainer}>
              {blockClassification.map((item, index) => (
                <div key={index} className={this.generateMenuItemClass(index)} onClick={() => this.handleSelectBlockClassification(index)}>
                  <span>{item.name}</span>
                </div>
              ))}
              <div onClick={() => { this.setState({ currentBlockClassification: null }) }} className={styles.backButton}></div>
            </div>
          ) : null}
        </div>
        {/* 菜单模块内容 */}
        <Col className={styles.content} span={16} offset={4}>
          {this.generateType(currentBlockClassification) === 'number' ? this.renderBlockMenus() : this.renderBlocks()}
        </Col>
        {/* 底部 */}
        <div className={styles.footer}>
          <div className={styles.linkItem} onClick={() => router.push('/company-workbench/view')}>
            <img src={'http://data.jingan-china.cn/v2/menu/icon-workbench.png'} alt="link" />
            <div>工作台</div>
          </div>
          <div className={styles.linkItem} onClick={() => router.push('/big-platform/chemical/index')}>
            <img src={'http://data.jingan-china.cn/v2/menu/icon-cockpit.png'} alt="link" />
            <div>驾驶舱</div>
          </div>
        </div>
      </div>
    )
  }
}
