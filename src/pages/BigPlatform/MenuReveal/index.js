import { Component } from 'react';
import {
  Row,
  Col,
  Dropdown,
  Menu,
} from 'antd';
// import _ from 'lodash';
import { connect } from 'dva';
import router from 'umi/router';
import config from './../../../../config/config';
// 在zh-CN.js文件中找到对应文案
import { formatMessage } from 'umi/locale';
import styles from './index.less';

// 每个模块标题左侧图
import dividerPic from '@/assets/divider.png';

// 项目名称、logo
const { projectShortName, logo } = global.PROJECT_CONFIG;
// 每个模块标题左侧色块
const Divider = () => <div className={styles.divider} style={{ background: `url(${dividerPic}) no-repeat center center`, backgroundSize: '100% 100%' }}></div>
const itemColWrapper = {
  xs: 16,
  sm: 8,
  md: 8,
  lg: 4,
  xl: 4,
}

@connect((({ user }) => ({
  user,
})))
export default class MenuReveal extends Component {

  state = {
    menuSys: [], // 系统菜单列表
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const menuAll = config['routes'];
    dispatch({ type: 'user/fetchGrids' });
    // 获取用户信息 包含permissionCodes，
    dispatch({
      type: 'user/fetchCurrent',
      callback: () => {
        // 驾驶舱路由、系统路由
        const configBigPlatform = menuAll.find(item => item.path === '/big-platform')
        const configSys = menuAll.find(item => item.path === '/')
        const menuSys = this.filterSysMenu(configSys.routes, 2)
        // const menuBigPlatform = this.filterBigPlatform(configBigPlatform.routes)
        // console.log('menuBigPlatform', menuBigPlatform);

        this.setState({ menuSys })
      },
    });
  }

  /**
   * 筛选系统路由
   * @param {Array} array 待处理数组
   * @param {Number} depth depth=2 两层含有routes子节点数组
   * @param {String} parentName 上级节点的locale，locale用于生成对应的文字描述（与zh-CN.js文件对应）
   **/
  filterSysMenu = (array, depth = 0, parentName) => {
    const {
      user: { currentUser: { permissionCodes } },
    } = this.props
    return array.reduce((arr, item) => {
      let locale = 'menu'
      if (parentName && item.name) {
        locale = `${parentName}.${item.name}`;
      } else if (item.name) {
        locale = `menu.${item.name}`;
      } else if (parentName) {
        locale = parentName;
      }
      if (item.redirect || item.hideInMenu || /\/dashboard/.test(item.path) || !permissionCodes.includes(item.code)) {
        return arr
      } else if (item.routes && item.routes.length && +depth > 1) {
        return [...arr, { ...item, locale, title: formatMessage({ id: locale }), routes: this.filterSysMenu(item.routes, depth - 1, locale) }]
      } else {
        const { routes, ...res } = item
        return [...arr, { ...res, locale, title: formatMessage({ id: locale }) }]
      }
    }, [])
  }

  /**
   * 筛选驾驶舱路由
   **/
  filterBigPlatform = (array) => {
    const {
      user: {
        currentUser: {
          permissionCodes,
          companyBasicInfo: {
            fireService,
            safetyProduction,
            monitorService,
            personnelPositioning,
          } = {},
          unitType,
          companyId,
          regulatoryClassification,
        },
        grids,
      },
    } = this.props
    // const regulatoryClassification = ['1', '2'];
    const classification =
      (Array.isArray(regulatoryClassification) &&
        regulatoryClassification.map(n => Number.parseInt(n, 10))) ||
      [];
    // 1=>安全生产(安全大屏和动态监测大屏) 2=>消防(消防大屏) 3=>环保(暂时没有大屏对应) 4=>卫生(暂时没有大屏对应)
    const [clfcSafetyAuth, clfcFireControlAuth /* clfcEnviromentAuth */] = [1, 2, 3].map(k =>
      classification.includes(k)
    );

    return array.reduce((arr, item) => {
      const path = `${window.publicPath}#${this.generateUrl(item.path)}`;
      /*
      'menu.bigPlatform.governmentSafety': '政府安全驾驶舱',      /index
      'menu.bigPlatform.companySafety': '企业安全驾驶舱',         /companyId
      'menu.bigPlatform.newFireControl': '消防主机联网驾驶舱',    /index
      'menu.bigPlatform.fireControl': '消防驾驶舱',              /companyId
      'menu.bigPlatform.fireMaintenance': '企业消防运营驾驶舱',   /companyId
      'menu.bigPlatform.dynamicMonitor': '动态监测驾驶舱',        /companyId
      'menu.bigPlatform.personnelPositioning': '人员定位驾驶舱',  /companyId
      'menu.bigPlatform.electricityMonitor': '智慧用电驾驶舱',    /grids
      'menu.bigPlatform.gas': '智慧燃气驾驶舱',                   /grids
      'menu.bigPlatform.smoke': '烟感驾驶舱',                     /grids
      'menu.bigPlatform.operation': '智慧消防运营驾驶舱',
      'menu.bigPlatform.threedgis': '3D-GIS驾驶舱',
      'menu.bigPlatform.gasStation': '加油站驾驶舱',              /companyId
      */
      // 筛选掉重定向和无权限
      if (item.redirect || !permissionCodes.includes(item.code)) {
        return arr;
      }
      // 处理路径path
      if (['electricityMonitor', 'gas', 'smoke'].includes(item.name)) {
        item.path = `${path}${grids.length ? grids[0].value : 'index'}`
      } else if (['companySafety', 'fireControl'].includes(name) && [1, 4].includes(unitType) || ['fireMaintenance', 'dynamicMonitor', 'personnelPositioning', 'gasStation'].includes(name)) {
        item.path = path + companyId;
      } else if (['governmentSafety', 'newFireControl'].includes(name)) {
        item.path = path + 'index';
      }

      if (unitType === 1) {
        // 维保企业
        // 这个迭代维保企业不能看消防
        if (['governmentSafety', 'newFireControl', 'fireControl', 'newFireControl', 'fireMaintenance'].includes(item.name)) return arr;
      } else if (unitType === 2) {
        // 政府

      } else if (unitType === 3) {
        // 运营

      } else if (unitType === 4) {
        // 企事业
        if (['governmentSafety', 'newFireControl'].includes(item.name)) return arr;
      }
      return [...arr, { ...item, locale: `menu.bigPlatform.${item.name}` }]
    }, [])
  }

  // 点击菜单 打开相应新页面
  handleOpenMenu = (url) => {
    window.open(`${window.publicPath}#${url}`, '_blank')
  }

  generateUrl = url => url.test(':') ? url.split(':').shift() : url

  generateSysUrl = ({ locale, title }) => {
    const parentLocale = locale.split('.').slice(0, 2).join('.')
    const parentTitle = formatMessage({ id: parentLocale })
    return `http://data.jingan-china.cn/v2/menu/${encodeURIComponent(parentTitle)}/${encodeURIComponent(title)}.png`
  }

  render() {
    const { menuSys } = this.state
    return (
      <div className={styles.menuRevealContainer}>
        {/* 头部 */}
        <div className={styles.header}>
          <a href="#/">
            <img src={logo} alt="logo" />
            <h1>{projectShortName}</h1>
          </a>
          <div className={styles.menu}>
            <div className={styles.menuItem} onClick={() => router.push('/company-workbench/workbench/list')}><span>工作台</span></div>
            <div className={styles.menuItem}><span style={{ color: 'white' }}>系统</span></div>
            <div className={styles.menuItem}><span>驾驶舱</span></div>
          </div>
        </div>
        {/* 内容 */}
        <Row className={styles.content}>
          <Col span={16} offset={4}>
            {/* 每个模块 */}
            {menuSys.length ? menuSys.map(block => (
              <Row key={block.name}>
                <div className={styles.blockTitle}><Divider /> {block.title}</div>
                <Row className={styles.blockContent}>
                  {block.routes && block.routes.length ? block.routes.map(item => (
                    <Col key={item.name} {...itemColWrapper} className={styles.itemOuter}>
                      <div className={styles.item}>
                        <div className={styles.itemInner} onClick={() => this.handleOpenMenu(item.path)}>
                          <img src={this.generateSysUrl(item)} alt="logo" />
                          <div>{item.title}</div>
                        </div>
                      </div>
                    </Col>
                  )) : null}
                </Row>
              </Row>
            )) : null}
          </Col>
        </Row>
      </div>
    )
  }
}
