import { Component, createRef } from 'react';
// import { Form } from '@ant-design/compatible';
// import '@ant-design/compatible/assets/index.css';
import { Form, Row, Col, Modal } from 'antd';
// import _ from 'lodash';
import { connect } from 'dva';
import router from 'umi/router';
import config from './../../../../config/config';
// 在zh-CN.js文件中找到对应文案
import { formatMessage } from 'umi/locale';
// import { filterBigPlatform } from '@/utils/customAuth';
import { SRC_MAP, setBlocks, setMenuSys } from './utils';
import classNames from 'classnames';
import styles from './NewMenu.less';
// 每个模块标题左侧图
import dividerPic from '@/assets/divider.png';
import Select from '@/jingan-components/Form/Select';

const userLogoUrl = 'http://data.jingan-china.cn/v2/menu/icon-user.png';
const logoutLogoUrl = 'http://data.jingan-china.cn/v2/menu/icon-logout.png';

// 项目名称、logo
const { projectShortName } = global.PROJECT_CONFIG;

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
    name: '重大危险源监测预警系统',
    splitIndex: 5,
    blocks: [],
    icon: 'http://data.jingan-china.cn/v2/new-menu/icon-major-hazard.png',
  },
  {
    name: '可燃有毒气体监测预警系统',
    splitIndex: 6,
    blocks: [],
    icon: 'http://data.jingan-china.cn/v2/new-menu/icon-gas-1.png',
  },
  {
    name: '企业安全风险分区管理系统',
    splitIndex: 6,
    blocks: [],
    icon: 'http://data.jingan-china.cn/v2/new-menu/icon-security-risk.png',
  },
  {
    name: '人员在岗在位管理系统',
    splitIndex: 4,
    blocks: [],
    icon: 'http://data.jingan-china.cn/v2/new-menu/icon-Staff.png',
  },
  {
    name: '企业生产全流程管理系统',
    splitIndex: 4,
    blocks: [],
    icon: 'http://data.jingan-china.cn/v2/new-menu/icon-security-production.png',
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
      menuSysAll: [],
      // currentBlockClassification属性控制显示系统还是子菜单，从原来的组件复制过来，分成了两个组件，所以只需要显示一个，这里显示的是子菜单，值为变化的数字
      currentBlockClassification: 0, // 当前模块下标（数组blockClassification下标）
      modalVisible: false,
    };
  }
  componentDidMount() {
    const {
      dispatch,
      user: {
        currentUser: { permissionCodes },
      },
    } = this.props;

    if (permissionCodes && permissionCodes.length)
      // 从系统页面跳转过来，不需要重新请求currentUser相关信息
      this.initMenus();
    else {
      // 刷新页面需要重新请求currentUser相关信息
      dispatch({ type: 'user/fetchGrids' });
      dispatch({
        type: 'user/fetchCurrent', // 获取用户信息 包含permissionCodes，
        callback: (data, login) => {
          const { logined } = login;
          this.initMenus();

          if (logined) dispatch({ type: 'login/saveLogined', payload: false }); // 跳转过后，重置logined，不然刷新还会跳转
        },
      });
    }
  }

  initMenus = () => {
    const {
      user: { systemType },
    } = this.props;
    const { routes } = config;
    setBlocks(blockClassification, routes);
    // 深拷贝，防止污染配置文件
    const menuAll = JSON.parse(JSON.stringify(routes));
    // 驾驶舱路由、系统路由
    const configSys = menuAll.find(item => item.path === '/');
    const menuSysAll = this.filterSysMenu(configSys.routes, 2);
    setMenuSys(blockClassification, menuSysAll);
    // const blocks = blockClassification[0].blocks;
    // const menuSys = menuSysAll.filter(item => blocks.includes(item.name));
    const classification = blockClassification.filter(({ menuSys }) => menuSys.length);
    this.setState(
      {
        currentBlockClassification: systemType,
        menuSys: classification.length ? classification[0].menuSys : [],
        menuSysAll,
      },
      () => this.handleSelectBlockClassification(systemType)
    );
  };

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
        // ['/dashboard', '/company-workbench'].includes(item.path)
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
    router.push(url.replace(/\/:[^\/]*/g, ''));
  };

  // 去除url中尾部参数
  clearParam = url => (/\:/.test(url) ? url.split(':').shift() : url);

  generateSysUrl = ({ name, code }) => {
    const title = SRC_MAP[code] || name;
    return `http://data.jingan-china.cn/v2/new-menu/${title}.png`;
  };

  // 点击模块分类
  handleSelectBlockClassification = index => {
    // const { dispatch } = this.props;
    const { menuSysAll } = this.state;
    const blocks = blockClassification[index].blocks;
    const menuSys = menuSysAll.filter(item => blocks.includes(item.name));
    this.setState({ currentBlockClassification: index, menuSys });
    // dispatch({ type: 'user/saveSystemType', payload: index });
  };

  // 输出数据类型
  generateType = str =>
    Object.prototype.toString
      .call(str)
      .replace(/\[|\]|object\s/g, '')
      .toLocaleLowerCase();

  generateMenuItemClass = index => {
    const { currentBlockClassification } = this.state;
    return classNames(styles.menuItem, {
      [styles.selectedItem]: currentBlockClassification === index,
    });
  };

  handleLogout = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/logout',
    });
  };

  // 确认单位
  handleConfirmCompany = () => {
    this.formRef.current
      .validateFields()
      .then(({ company }) => {
        this.setState({ modalVisible: false }, () => {
          window.open(`${window.publicPath}#/big-platform/chemical/${company.value}`, '_blank');
        });
      })
      .catch(err => {});
  };

  handleViewBigPlatform = () => {
    const {
      user: {
        isCompany,
        currentUser: { companyId },
      },
    } = this.props;
    if (isCompany) {
      // 如果是单位用户
      window.open(`${window.publicPath}#/big-platform/chemical/${companyId}`, '_blank');
    } else {
      // 如果不是，弹出选择单位
      this.setState({ modalVisible: true });
    }
  };

  formRef = createRef();

  renderBlocks = () => {
    return (
      <div className={styles.blocks}>
        {blockClassification.map(({ name, splitIndex, icon }, index) => (
          <div
            key={index}
            className={styles.blockItem}
            onClick={() => this.handleSelectBlockClassification(index)}
          >
            <div className={styles.blockItemInner}>
              <img src={icon} alt="block" />
              <div style={{ marginTop: '20px' }}>{name.slice(0, splitIndex)}</div>
              <div>{name.slice(splitIndex)}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  renderBlockMenus = () => {
    const { menuSys } = this.state;
    // console.log(menuSys);
    return (
      <div className={styles.innerContent}>
        {menuSys.length
          ? menuSys.map(block => (
              <div key={block.name}>
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
                              onClick={
                                item.developing ? null : () => this.handleOpenMenu(item.path)
                              }
                            >
                              <img src={this.generateSysUrl(item)} alt="logo" />
                              <div>{item.title}</div>
                              {item.developing ? <span className={styles.dot} /> : null}
                            </div>
                          </div>
                        </Col>
                      ))
                    : null}
                </Row>
              </div>
            ))
          : null}
      </div>
    );
  };

  render() {
    const {
      user: {
        currentUser: { userName, unitType, companyId, permissionCodes },
      },
    } = this.props;
    const { currentBlockClassification, modalVisible } = this.state;

    // const showWorkbench = permissionCodes.includes('companyWorkbench');
    const showChemical = permissionCodes && permissionCodes.includes('dashboard.chemical');
    return (
      <div className={styles.newMenuRevealContainer}>
        {/* 头部 */}
        <div className={styles.header}>
          <span>{projectShortName}</span>
          <div className={styles.headerLine} />
          <div className={styles.userInfo}>
            <img src={userLogoUrl} alt="user" />
            <span>{userName}</span>
            <img onClick={this.handleLogout} src={logoutLogoUrl} alt="logout" />
          </div>
          {this.generateType(currentBlockClassification) === 'number' ? (
            <div className={styles.menuContainer}>
              {blockClassification.map(
                (item, index) =>
                  item.menuSys && item.menuSys.length ? (
                    <div
                      key={index}
                      className={this.generateMenuItemClass(index)}
                      onClick={() => this.handleSelectBlockClassification(index)}
                    >
                      <span>{item.name.slice(0, -2)}</span>
                    </div>
                  ) : null
              )}
              <div
                onClick={() => router.push('/menu-reveal/system')}
                className={styles.backButton}
              />
            </div>
          ) : null}
        </div>
        {/* 菜单模块内容 */}
        <Col className={styles.content} span={16} offset={4}>
          {this.generateType(currentBlockClassification) === 'number'
            ? this.renderBlockMenus()
            : this.renderBlocks()}
        </Col>
        {/* 底部 */}
        <div className={styles.footer}>
          {/* {showWorkbench && (
            <div className={styles.linkItem} onClick={() => router.push('/company-workbench/view')}>
              <img src={'http://data.jingan-china.cn/v2/menu/icon-workbench.png'} alt="link" />
              <div>工作台</div>
            </div>
          )} */}
          <div className={styles.linkItem} onClick={() => router.push('/company-workbench/view')}>
            <img src={'http://data.jingan-china.cn/v2/menu/icon-workbench.png'} alt="link" />
            <div>工作台</div>
          </div>
          {showChemical && (
            <div
              className={styles.linkItem}
              // onClick={() => router.push(`/big-platform/chemical/${companyId}`)}
              onClick={this.handleViewBigPlatform}
            >
              <img src={'http://data.jingan-china.cn/v2/menu/icon-cockpit.png'} alt="link" />
              <div>驾驶舱</div>
            </div>
          )}
        </div>
        <Modal
          title="选择单位"
          visible={modalVisible}
          onCancel={() => this.setState({ modalVisible: false })}
          onOk={this.handleConfirmCompany}
          destroyOnClose
          centered
        >
          <Form ref={this.formRef}>
            <Form.Item
              name="company"
              label="单位名称"
              rules={[{ type: 'object', required: true, message: '单位名称不能为空' }]}
            >
              <Select
                showSearch
                filterOption={false}
                labelInValue
                mapper={{
                  namespace: 'common',
                  list: 'unitList',
                  getList: 'getUnitList',
                }}
                fieldNames={{
                  key: 'id',
                  value: 'name',
                }}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}
