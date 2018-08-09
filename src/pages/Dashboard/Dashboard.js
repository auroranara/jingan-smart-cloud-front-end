import React, { PureComponent } from 'react';
import { message } from 'antd';
import { connect } from 'dva';
// import Carousel3d from './Carousel3d';
import styles from './Dashboard.less';
import { getToken } from 'utils/authority';
import fire from '../../assets/fire-big-screen.png';
import safe from '../../assets/safe-bing-screen.png';

const safeItem = { src: safe, url: 'http://www.baidu.com', key: 'safe' };
const fireItem = {
  src: fire,
  url: `/acloud_new/v2/hdf/fireIndex.htm?token=${getToken()}`,
  key: 'fire',
};

@connect(({ user }) => ({
  user,
}))
export default class Dashboard extends PureComponent {
  state = {
    hasSafeAuthority: true,
    safetyProduction: 0,
    fireService: 0,
  };

  componentDidMount() {
    console.log(this.props);
    let {
      user: {
        currentUser: {
          companyBasicInfo: { fireService, safetyProduction } = {},
          unitType,
          companyId,
        },
      },
    } = this.props;

    console.log(this.props);

    //如果单位为政府或者admin 运营 则显示企业大屏
    if (unitType === 3 || unitType === 2) {
      safeItem.url = '/acloud_new/#/big-platform/safety/government';

      //TODO 政府大屏开启
      this.setState({ hasSafeAuthority: true, safetyProduction: 1, fireService: 0 });
    } else {
      safeItem.url = `/acloud_new/#/big-platform/safety/company/${companyId}`;
      this.setState({
        hasSafeAuthority: !!companyId,
        safetyProduction,
        fireService,
      });
    }
  }

  render() {
    const { safetyProduction, fireService } = this.state;

    // safetyProduction,fireService 1开启/0关闭
    const imgWrapper =
      (safetyProduction &&
        fireService && [safeItem, fireItem]) ||
      (safetyProduction && !fireService && [safeItem]) ||
      (!safetyProduction && fireService && [fireItem]) ||
      [];

    const goToBigScreen = i => {
      const { hasSafeAuthority } = this.state;
      if (!hasSafeAuthority && imgWrapper[i].key === 'safe') {
        message.error('该功能暂时未开放！');
      } else {
        const url = imgWrapper[i].url;
        const win = window.open(url, '_blank');
        win.focus();
      }
    };

    const hasFourItems = { width: '300px', height: '400px', padding: '20px' }
    const hasLittleItems = { width: '340px', height: '440px', padding: '40px' }

    const children = imgWrapper.map((item, i) => (
      <div key={i.toString()} style={imgWrapper && imgWrapper.length >= 4 ? hasFourItems : hasLittleItems}>
        <div
          className={styles.imgItem}
          onClick={() => goToBigScreen(i)}
          style={{
            backgroundImage: `url(${item.src})`,
          }}
        />
      </div>
    ));
    return (
      <div className={styles.dashboardContainer}>
        {children}
      </div>
    );
  }
}
