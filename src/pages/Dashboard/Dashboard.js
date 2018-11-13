import React, { PureComponent } from 'react';
import { connect } from 'dva';

// import Carousel3d from './Carousel3d';
import codes from '@/utils/codes';
import styles from './Dashboard.less';

// const fire = 'http://data.jingan-china.cn/v2/dashboard/fire-control.png';
// const safe = 'http://data.jingan-china.cn/v2/dashboard/safety.png';
const fire = "http://data.jingan-china.cn/v2/dashboard/home-fire.png"
const safe = "http://data.jingan-china.cn/v2/dashboard/home-safety.png"
const monitor = "http://data.jingan-china.cn/v2/dashboard/home-monitor.png"

const safeItem = { src: safe, url: '', label: '安全驾驶舱' };
const fireItem = { src: fire, url: '', label: '消防驾驶舱' };
const monitorItem = { src: monitor, url: '', label: '动态监测驾驶舱' }

// 1=>安全生产 2=>消防 3=>环保(暂时对应动态监测大屏)
const CLASSIFICATION = { safety: 1, fireControl: 2, dynamicMonitor: 3 };

@connect(({ user }) => ({
  user,
}))
export default class Dashboard extends PureComponent {
  state = {
    safetyProduction: 0,
    fireService: 0,
    monitorService: 0,
  };

  componentDidMount() {
    let {
      user: {
        currentUser: {
          permissionCodes=[],
          companyBasicInfo: { fireService, safetyProduction, monitorService } = {},
          unitType,
          companyId,
          regulatoryClassification,
        },
      },
    } = this.props;

    // const regulatoryClassification = ['1', '2'];
    const classification = Array.isArray(regulatoryClassification) && regulatoryClassification.map(n => Number.parseInt(n, 10)) || [];
    const [[safetyAuth, clfcSafetyAuth], [fireControlAuth, clfcFireControlAuth], [dynamicMonitorAuth, clfcDynamicMonitorAuth]] = Object.entries(codes.dashboard)
      .map(([k, v]) => [permissionCodes.includes(v), classification.includes(CLASSIFICATION[k])]);
    // console.log([safetyAuth, clfcSafetyAuth], [fireControlAuth, clfcFireControlAuth], [dynamicMonitorAuth, clfcDynamicMonitorAuth]);

    safeItem.url = `${window.publicPath}#/big-platform/safety/government`
    fireItem.url = `${window.publicPath}#/big-platform/fire-control/government/index`
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

    const safeUrl = `${window.publicPath}#/big-platform/safety/company/${companyId}`;
    const fireUrl = `${window.publicPath}#/big-platform/fire-control/company/${companyId}`;
    const monitorUrl = `${window.publicPath}#/big-platform/monitor/company/${companyId}`;

    // 企事业主体和政府有业务分类，维保和运营没有
    // 所以企事业主体和政府的大屏权限 = 用户业务权限 && 企事业业务分类 && 账户被配置的权限，运营和维保企业的大屏权限 = 用户业务权限 && 账户被配置的权限
    switch(unitType) {
      // 维保企业
      case 1:
        safeItem.url = safeUrl;
        fireItem.url = fireUrl;
        monitorItem.url = monitorUrl;
        this.setState({
          safetyProduction: safetyProduction && safetyAuth,
          fireService: 0, // 这个迭代维保企业不能看消防
          monitorService: monitorService && dynamicMonitorAuth,
        });
        break;

      // 政府
      case 2:
        this.setState({
          safetyProduction: safetyProduction && safetyAuth && clfcSafetyAuth,
          fireService: fireService && fireControlAuth && clfcFireControlAuth,
        });
        break;

      // 运营
      case 3:
        this.setState({
          safetyProduction: 1 && safetyAuth,
          fireService: 1 && fireControlAuth,
        });
        break;

      // 企事业
      case 4:
        safeItem.url = safeUrl;
        fireItem.url = fireUrl;
        monitorItem.url = monitorUrl;
        this.setState({
          safetyProduction: safetyProduction && safetyAuth && clfcSafetyAuth,
          fireService: fireService && fireControlAuth && clfcFireControlAuth,
          monitorService: monitorService && dynamicMonitorAuth && clfcDynamicMonitorAuth,
        });
        break;

      default:
        console.warn(`unitType=${unitType} in Dashboard`);
    }
  }

  render() {
    const { safetyProduction, fireService, monitorService } = this.state;

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

    const items = [safeItem, fireItem, monitorItem];
    const imgWrapper = [safetyProduction, fireService, monitorService].reduce((prev, next, i) => {
      next && prev.push(items[i]);
      return prev;
    }, []);

    const goToBigScreen = url => {
      const win = window.open(url, '_blank');
      win.focus();
    };

    const hasFourItems = { width: '300px', height: '400px', padding: '20px' };
    const hasLittleItems = { width: '405px', height: '480px', padding: '40px' };

    const children = imgWrapper.map((item, i) => (
      <div
        key={i.toString()}
        style={imgWrapper && imgWrapper.length >= 4 ? hasFourItems : hasLittleItems}
      >
        {/* <div
          className={styles.imgItem}
          onClick={() => goToBigScreen(item.url)}
          style={{
            backgroundImage: `url(${item.src})`,
          }}
        /> */}
        <div className={styles.section} onClick={() => goToBigScreen(item.url)}>
          <div className={styles.imgContainer}>
            <img src={item.src} alt="" />
          </div>
          <div className={styles.textItem}>
            <div className={styles.text}>{item.label}</div>
          </div>
        </div>
      </div>
    ));
    return <div className={styles.dashboardContainer}>{children}</div>;
  }
}
