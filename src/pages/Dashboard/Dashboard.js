import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import Carousel3d from './Carousel3d';
import codes from '@/utils/codes';
import styles from './Dashboard.less';
import { Row, Col } from 'antd';
import Ellipsis from '@/components/Ellipsis';
// 用电安全驾驶舱图
import electricImg from '../../assets/dashboard-electricity.png';

// 大屏入口图片路径
const fire = 'http://data.jingan-china.cn/v2/dashboard/home-fire.png';
const safe = 'http://data.jingan-china.cn/v2/dashboard/home-safety.png';
const monitor = 'http://data.jingan-china.cn/v2/dashboard/home-monitor.png';
const psoitionImg = 'http://data.jingan-china.cn/v2/dashboard/personnel-positioning.png';
const gasImg = 'http://data.jingan-china.cn/v2/dashboard/gas.png';
const fireMaintenanceImg = 'http://data.jingan-china.cn/new-fire-control.png';
const smokeImg = 'http://data.jingan-china.cn/smoke.png';

const safeItem = { src: safe, url: '', label: '安全驾驶舱' };
const fireItem = { src: fire, url: '', label: '消防驾驶舱' };
const monitorItem = { src: monitor, url: '', label: '动态监测驾驶舱' };
const positionItem = { src: psoitionImg, url: '', label: '人员定位驾驶舱' };
const electricItem = { src: electricImg, url: '', label: '智慧用电驾驶舱' };
const gasItem = { src: gasImg, url: '', label: '智慧燃气驾驶舱' };
const fireMaintenanceItem = { src: fireMaintenanceImg, url: '', label: '消防维保驾驶舱' };
const smokeItem = { src: smokeImg, url: '', label: '烟感驾驶舱' };

// const CLASSIFICATION = { safety: 1, fireControl: 2, environmentProtection: 3 };

@connect(({ user }) => ({
  user,
}))
export default class Dashboard extends PureComponent {
  state = {
    safetyProduction: 0,      // 安全大屏可见
    fireService: 0,           // 消防可见
    monitorService: 0,        // 动态监测可见
    personnelPositioning: 0,  // 人员定位可见
    electricityMonitor: 0,    // 用电安全可见
    gasVisible: 0,            // 燃气入口可见
    fireMaintenanceVisible: 0, // 消防维保大屏可见
    smokeVisible: 0,           // 烟感大屏可见
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
    // smokeItem.url = `${window.publicPath}#/big-platform/smoke/${companyId}`
    // electricItem.url = `${window.publicPath}#/big-platform/electricity-monitor` // 移到render里面
    // unitType  1：维保企业 2：政府 3：运营 4:企事业主体
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
    const fireMaintenanceUrl = `${window.publicPath}#/big-platform/fire-control/new-company/${companyId}`;

    // 企事业主体和政府有业务分类，维保和运营没有
    // 所以企事业主体和政府的大屏权限 = 用户业务权限 && 企事业业务分类 && 账户被配置的权限，运营和维保企业的大屏权限 = 用户业务权限 && 账户被配置的权限
    switch (unitType) {
      // 维保企业
      case 1:
        safeItem.url = safeUrl;
        fireItem.url = fireUrl;
        monitorItem.url = monitorUrl;
        positionItem.url = positionUrl;
        fireMaintenanceItem.url = fireMaintenanceUrl;
        this.setState({
          safetyProduction: safetyProduction && safetyAuth,
          fireService: 0, // 这个迭代维保企业不能看消防
          fireMaintenanceVisible: 0,
          monitorService: monitorService && dynamicMonitorAuth,
          personnelPositioning: personnelPositioning && personnelPositionAuth,
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
        fireItem.url = fireUrl;
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
    if (!arr || !Array.isArray(arr)) return
    const length = arr.length
    switch (length) {
      case 1:
        return 'center'
      case 2:
        return (i === 0 && 'flex-end') || (i === 1 && 'flex-start')
      default:
        return ['flex-end', 'center', 'flex-start'][i % 3]
    }
  }

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

    // safetyProduction,fireService 1开启/0关闭
    // const imgWrapper =
    //   (safetyProduction && fireService && [safeItem, fireItem]) ||
    //   (safetyProduction && !fireService && [safeItem]) ||
    //   (!safetyProduction && fireService && [fireItem]) ||
    //   [];

    // let imgWrapper = [];
    // if (safetyProduction) {
    //   imgWrapper.push(safeItem)
    // }
    // if (fireService) {
    //   imgWrapper.push(fireItem)
    // }
    // if (monitorService) {
    //   imgWrapper.push(monitorItem)
    // }

    // items中的参数必须与state中一一对应
    const items = [safeItem, fireItem, monitorItem, positionItem, electricItem, gasItem, fireMaintenanceItem, smokeItem];
    // 如果state中不全是控制大屏显示的参数，则需要修改
    const imgWrapper = Object.entries(this.state).reduce((prev, [, value], i) => {
      value && prev.push(items[i]);
      return prev;
    }, []);

    const goToBigScreen = url => {
      const win = window.open(url, '_blank');
      win.focus();
    };

    // const hasFourItems = { width: '330px', height: '425px', padding: '25px' };
    // const hasLittleItems = { width: '405px', height: '480px', padding: '40px' };

    return (
      <Row
        gutter={{ xs: 10, sm: 20, md: 20, lg: 50 }}
        className={styles.dashboardContainer}
        style={imgWrapper.length > 3 ? { height: 'auto' } : { height: '800px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        {imgWrapper.map((item, i) => (
          <Col
            span={8}
            key={i.toString()}
            style={{
              display: 'flex',
              justifyContent: this.generateAlign(imgWrapper, i),
              marginTop: '40px',
            }}
          >
            <div className={styles.section} onClick={() => goToBigScreen(item.url)}>
              <div className={styles.imgContainer}>
                <img src={item.src} alt="" />
              </div>
              <div className={styles.text}>
                <Ellipsis lines={1}>{item.label}</Ellipsis>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    );
  }
}
