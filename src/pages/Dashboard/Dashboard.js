import React, { PureComponent } from 'react';
import { message } from 'antd';
import { connect } from 'dva';
// import Carousel3d from './Carousel3d';
import styles from './Dashboard.less';
import { getToken } from 'utils/authority';
import fire from '../../assets/fire-big-screen.png';
import safe from '../../assets/safe-bing-screen.png';

const safeItem = { src: safe, url: '', key: 'safe' };
let fireItem = {
  src: fire,
  url: '',
  key: 'fire',
};

@connect(({ user }) => ({
  user,
}))
export default class Dashboard extends PureComponent {
  state = {
    safetyProduction: 0,
    fireService: 0,
  };

  componentDidMount() {
    let {
      user: {
        currentUser: {
          companyBasicInfo: { fireService, safetyProduction } = {},
          unitType,
          companyId,
        },
      },
    } = this.props;

    // fireItem = {
    //   src: fire,
    //   url: `/acloud_new/v2/hdf/fireIndex.htm?token=${getToken()}&companyId=${companyId}`,
    //   key: 'fire',
    // };

    //如果单位为政府或者admin 运营 则显示企业大屏
    // unitType  1：维保企业 2：政府 3：运营 4:企事业主体
    // 政府根据companyBasicInfo的数据来
    if (unitType === 2) {
      safeItem.url = '/acloud_new/#/big-platform/safety/government';
      fireItem.url = '/acloud_new/#/big-platform/fire-control/government';
      //TODO 政府大屏开启
      this.setState({ safetyProduction, fireService });
    } else if (unitType === 3) {
      // 运营可以看所有政府大屏
      safeItem.url = '/acloud_new/#/big-platform/safety/government';
      fireItem.url = '/acloud_new/#/big-platform/fire-control/government';
      this.setState({ safetyProduction: 1, fireService: 1 });
    } else {
      // 企业根据companyBasicInfo的数据来
      safeItem.url = `/acloud_new/#/big-platform/safety/company/${companyId}`;
      fireItem.url = `/acloud_new/v2/hdf/fireIndex.htm?token=${getToken()}&companyId=${companyId}`;
      this.setState({
        safetyProduction,
        fireService,
      });
    }
  }

  render() {
    const { safetyProduction, fireService } = this.state;

    // safetyProduction,fireService 1开启/0关闭
    const imgWrapper =
      (safetyProduction && fireService && [safeItem, fireItem]) ||
      (safetyProduction && !fireService && [safeItem]) ||
      (!safetyProduction && fireService && [fireItem]) ||
      [];

    const goToBigScreen = url => {
      const win = window.open('', '_blank');
      win.location.href = url;
      win.focus();
    };

    const hasFourItems = { width: '300px', height: '400px', padding: '20px' };
    const hasLittleItems = { width: '340px', height: '440px', padding: '40px' };

    const children = imgWrapper.map((item, i) => (
      <div
        key={i.toString()}
        style={imgWrapper && imgWrapper.length >= 4 ? hasFourItems : hasLittleItems}
      >
        <div
          className={styles.imgItem}
          onClick={() => goToBigScreen(item.url)}
          style={{
            backgroundImage: `url(${item.src})`,
          }}
        />
      </div>
    ));
    return <div className={styles.dashboardContainer}>{children}</div>;
  }
}
