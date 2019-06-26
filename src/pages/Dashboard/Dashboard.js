import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { message } from 'antd';

import codes from '@/utils/codes';
import styles from './Dashboard.less';

// 大屏入口图片路径
const fire = 'http://data.jingan-china.cn/v2/dashboard/home-fire.png';
const safe = 'http://data.jingan-china.cn/v2/dashboard/home-safety.png';
const monitor = 'http://data.jingan-china.cn/v2/dashboard/home-monitor.png';
const posoitionImg = 'http://data.jingan-china.cn/v2/dashboard/personnel-positioning.png';
const gasImg = 'http://data.jingan-china.cn/v2/dashboard/gas.png';
const electricImg = 'http://data.jingan-china.cn/v2/dashboard/dashboard-electricity.png';
const fireMaintenanceImg = 'http://data.jingan-china.cn/new-fire-control.png';
const smokeImg = 'http://data.jingan-china.cn/smoke.png';
const operationImg = 'http://data.jingan-china.cn/v2/dashboard/operation.png';
const threedgisImg = 'http://data.jingan-china.cn/v2/dashboard/3dgis.png';

// const safeItem = { src: safe, url: '', label: '政府安全驾驶舱' };
// const fireItem = { src: fire, url: '', label: '消防主机联网驾驶舱' };
// const monitorItem = { src: monitor, url: '', label: '动态监测驾驶舱' };
// const positionItem = { src: posoitionImg, url: '', label: '人员定位驾驶舱' };
// const electricItem = { src: electricImg, url: '', label: '智慧用电驾驶舱' };
// const gasItem = { src: gasImg, url: '', label: '智慧燃气驾驶舱' };
// const fireMaintenanceItem = { src: fireMaintenanceImg, url: '', label: '企业消防运营驾驶舱' };
// const smokeItem = { src: smokeImg, url: '', label: '烟感驾驶舱' };
// const operationItem = { src: operationImg, url: '', label: '智慧消防运营驾驶舱' };
// const threedgisItem = { src: threedgisImg, url: '', label: '3D-GIS驾驶舱' };

const IMGS = [
  fire,
  safe,
  monitor,
  posoitionImg,
  gasImg,
  electricImg,
  fireMaintenanceImg,
  smokeImg,
  operationImg,
  threedgisImg,
];
const LABELS = [
  '政府安全',
  '消防主机联网',
  '动态监测',
  '人员定位',
  '智慧用电',
  '智慧燃气',
  '企业消防运营',
  '烟感',
  '智慧消防运营',
  '3D-GIS',
];
const [
  safeItem,
  fireItem,
  monitorItem,
  positionItem,
  electricItem,
  gasItem,
  fireMaintenanceItem,
  smokeItem,
  operationItem,
  threedgisItem,
] = IMGS.map((img, i) => ({
  src: img,
  url: '',
  label: `${LABELS[i]}驾驶舱`,
}));

// const CLASSIFICATION = { safety: 1, fireControl: 2, environmentProtection: 3 };

@connect(({ user }) => ({
  user,
}))
export default class Dashboard extends PureComponent {
  state = {
    safetyProduction: 0, // 安全大屏可见
    fireService: 0, // 消防可见
    monitorService: 0, // 动态监测可见
    personnelPositioning: 0, // 人员定位可见
    electricityMonitor: 0, // 用电安全可见
    gasVisible: 0, // 燃气入口可见
    fireMaintenanceVisible: 0, // 消防维保大屏可见
    smokeVisible: 0, // 烟感大屏可见
    operationVisible: 0, // 智慧消防运营大屏
    threedgisVisible: 0, // 3D-GIS
  };

  componentDidMount() {
    let {
      dispatch,
      user: {
        currentUser: {
          permissionCodes = [],
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
      },
    } = this.props;

    dispatch({ type: 'user/fetchGrids' });

    // const regulatoryClassification = ['1', '2'];
    const classification =
      (Array.isArray(regulatoryClassification) &&
        regulatoryClassification.map(n => Number.parseInt(n, 10))) ||
      [];
    // 判断用户权限中是否有首页大屏的权限
    const [
      safetyAuth,
      fireControlAuth,
      dynamicMonitorAuth,
      personnelPositionAuth,
      electricityMonitorAuth,
      gasAuth,
      fireMaintenanceAuth,
      smokeAuth,
      operationAuth,
      threedgisAuth,
    ] = Object.entries(codes.dashboard).map(([k, v]) => permissionCodes.includes(v));

    // 1=>安全生产(安全大屏和动态监测大屏) 2=>消防(消防大屏) 3=>环保(暂时没有大屏对应) 4=>卫生(暂时没有大屏对应)
    const [clfcSafetyAuth, clfcFireControlAuth /* clfcEnviromentAuth */] = [1, 2, 3].map(k =>
      classification.includes(k)
    );
    // console.log([safetyAuth, clfcSafetyAuth], [fireControlAuth, clfcFireControlAuth], [dynamicMonitorAuth, clfcDynamicMonitorAuth]);

    safeItem.url = `${window.publicPath}#/big-platform/safety/government/index`;
    // fireItem.url = `${window.publicPath}#/big-platform/fire-control/government/index`
    fireItem.url = `${window.publicPath}#/big-platform/new-fire-control/government/index`;
    gasItem.url = `${window.publicPath}#/big-platform/gas`;
    operationItem.url = `${window.publicPath}#/big-platform/operation`;
    // threedgisItem.url = `${window.publicPath}#/big-platform/3d-gis`;
    // smokeItem.url = `${window.publicPath}#/big-platform/smoke/${companyId}`
    // electricItem.url = `${window.publicPath}#/big-platform/electricity-monitor` // 移到render里面
    // unitType  1：维保企业 2：政府 3：运营 4:社会单位
    // 政府根据companyBasicInfo的数据来
    // if (unitType === 2) {
    //   //TODO 政府大屏开启
    //   this.setState({ safetyProduction: safetyProduction && safetyAuth, fireService: fireService && fireControlAuth });
    // } else if (unitType === 3) {
    //   // 运营可以看所有政府大屏
    //   this.setState({ safetyProduction: 1 && safetyAuth, fireService: 1 && fireControlAuth });
    // } else {
    //   // 企业根据companyBasicInfo的数据来
    //   safeItem.url = `${window.publicPath}#/big-platform/safety/company/${companyId}`;
    //   fireItem.url = `${window.publicPath}#/big-platform/fire-control/company/${companyId}`;
    //   monitorItem.url = `${window.publicPath}#/big-platform/monitor/company/${companyId}`
    //   this.setState({
    //     safetyProduction: safetyProduction && safetyAuth,
    //     fireService: unitType === 1 ? 0 : fireService && fireControlAuth, // 这个迭代维保企业不能看消防
    //     monitorService: monitorService && dynamicMonitorAuth,
    //   });
    // }

    // 企业url
    const safeUrl = `${window.publicPath}#/big-platform/safety/company/${companyId}`;
    const fireUrl = `${window.publicPath}#/big-platform/fire-control/company/${companyId}`;
    const monitorUrl = `${window.publicPath}#/big-platform/monitor/company/${companyId}`;
    const positionUrl = `${window.publicPath}#/big-platform/position/${companyId}`;
    const fireMaintenanceUrl = `${
      window.publicPath
    }#/big-platform/fire-control/new-company/${companyId}`;

    if (threedgisAuth) this.setState({ threedgisVisible: 1 });

    // 社会单位和政府有业务分类，维保和运营没有
    // 所以社会单位和政府的大屏权限 = 用户业务权限 && 企事业业务分类 && 账户被配置的权限，运营和维保企业的大屏权限 = 用户业务权限 && 账户被配置的权限
    switch (unitType) {
      // 维保企业
      case 1:
        safeItem.url = safeUrl;
        safeItem.label = '企业安全驾驶舱';
        fireItem.url = fireUrl;
        fireItem.label = '消防驾驶舱';
        monitorItem.url = monitorUrl;
        positionItem.url = positionUrl;
        fireMaintenanceItem.url = fireMaintenanceUrl;
        this.setState({
          safetyProduction: safetyProduction && safetyAuth,
          fireService: 0, // 这个迭代维保企业不能看消防
          fireMaintenanceVisible: 0,
          monitorService: monitorService && dynamicMonitorAuth,
          personnelPositioning: personnelPositioning && personnelPositionAuth,
          operationVisible: operationAuth,
        });
        break;

      // 政府
      case 2:
        this.setState({
          safetyProduction: safetyProduction && safetyAuth && clfcSafetyAuth,
          fireService: fireService && fireControlAuth && clfcFireControlAuth,
          electricityMonitor: electricityMonitorAuth,
          gasVisible: gasAuth,
          smokeVisible: smokeAuth,
        });
        break;

      // 运营
      case 3:
        this.setState({
          safetyProduction: safetyAuth,
          fireService: fireControlAuth,
          electricityMonitor: electricityMonitorAuth,
          gasVisible: gasAuth,
          smokeVisible: smokeAuth,
        });
        break;

      // 企事业
      case 4:
        safeItem.url = safeUrl;
        safeItem.label = '企业安全驾驶舱';
        fireItem.url = fireUrl;
        fireItem.label = '消防驾驶舱';
        monitorItem.url = monitorUrl;
        positionItem.url = positionUrl;
        fireMaintenanceItem.url = fireMaintenanceUrl;
        this.setState({
          safetyProduction: safetyProduction && safetyAuth && clfcSafetyAuth,
          fireService: fireService && fireControlAuth && clfcFireControlAuth,
          fireMaintenanceVisible: fireService && fireMaintenanceAuth && clfcFireControlAuth,
          monitorService: monitorService && dynamicMonitorAuth && clfcSafetyAuth,
          personnelPositioning: personnelPositioning && personnelPositionAuth,
        });
        break;

      default:
        console.warn(`unitType=${unitType} in Dashboard`);
    }
  }

  generateAlign = (arr, i) => {
    if (!arr || !Array.isArray(arr)) return;
    const length = arr.length;
    switch (length) {
      case 1:
        return 'center';
      case 2:
        return (i === 0 && 'flex-end') || (i === 1 && 'flex-start');
      default:
        return ['flex-end', 'center', 'flex-start'][i % 3];
    }
  };

  notice = e => {
    e.preventDefault();
    message.info('抱歉，网站建设中...');
  };

  render() {
    const {
      user: { grids },
    } = this.props;
    electricItem.url = `${window.publicPath}#/big-platform/electricity-monitor/${
      grids.length ? grids[0].value : 'index'
    }`;
    gasItem.url = `${window.publicPath}#/big-platform/gas/${
      grids.length ? grids[0].value : 'index'
    }`;
    smokeItem.url = `${window.publicPath}#/big-platform/smoke/${
      grids.length ? grids[0].value : 'index'
    }`;

    // items中的参数必须与state中一一对应
    const items = [
      safeItem,
      fireItem,
      monitorItem,
      positionItem,
      electricItem,
      gasItem,
      fireMaintenanceItem,
      smokeItem,
      operationItem,
      threedgisItem,
    ];
    // 如果state中不全是控制大屏显示的参数，则需要修改
    const imgWrapper = Object.entries(this.state).reduce((prev, [, value], i) => {
      value && prev.push(items[i]);
      return prev;
    }, []);
    // console.log(imgWrapper);

    return (
      <div className={styles.container}>
        {imgWrapper
          .reduce((result, item, index) => {
            const i = Math.floor(index / 3);
            if (result[i]) {
              result[i].push(item);
            } else {
              result[i] = [item];
            }
            return result;
          }, [])
          .map(list => {
            return (
              <div className={styles.list} key={list[0].label}>
                {list.map(({ src, url, label }) => {
                  return (
                    <div key={label} className={styles.itemWrapper}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.item}
                        onClick={url ? null : this.notice}
                      >
                        <div className={styles.itemIconWrapper}>
                          <div
                            className={styles.itemIcon}
                            style={{ backgroundImage: `url(${src})` }}
                          />
                        </div>
                        <div className={styles.itemLabel}>{label}</div>
                      </a>
                    </div>
                  );
                })}
              </div>
            );
          })}
      </div>
    );
  }
}
