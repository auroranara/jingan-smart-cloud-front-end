import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Carousel3d from './Carousel3d';
import styles from './Dashboard.less';
import { getToken } from 'utils/authority';
import fire from '../../assets/fire-big-screen.png';
import safe from '../../assets/safe-bing-screen.png';

const maxLength = 6; // 最多容纳个数

@connect(({ user }) => ({
  user,
}))
export default class Dashboard extends PureComponent {
  state = {
    current: 0,
  };

  handleChange = data => {
    if (data.eventType === 'end') {
      this.setState({ current: data.current });
    }
  };

  render() {
    const { current } = this.state;
    const {
      user: {
        currentUser: { companyBasicInfo },
      },
    } = this.props;

    let safetyProduction, fireService;
    if (companyBasicInfo) {
      safetyProduction = companyBasicInfo.safetyProduction;
      fireService = companyBasicInfo.fireService;
    }
    const safeItem = { src: safe, url: 'http://www.baidu.com' };
    const fireItem = { src: fire, url: `/acloud_new/v2/hdf/fireIndex.htm?token=${getToken()}` };

    // safetyProduction,fireService 0开启/1关闭
    const imgWrapper =
      (safetyProduction === 0 &&
        fireService === 0 && [safeItem, fireItem, safeItem, fireItem, safeItem, fireItem]) ||
      (safetyProduction === 0 && fireService === 1 && [safeItem, safeItem, safeItem, safeItem]) ||
      (safetyProduction === 1 && fireService === 0 && [fireItem, fireItem, fireItem, fireItem]) ||
      [];

    const goToBigScreen = () => {
      const url = imgWrapper[current].url;
      const win = window.open(url, '_blank');
      win.focus();
    };

    const children = imgWrapper.map((item, i) => (
      <div
        key={i.toString()}
        className={styles.imgWrapper}
        onClick={current === i ? goToBigScreen : null}
        style={{
          backgroundImage: `url(${item.src})`,
        }}
      />
    ));
    return (
      <div className={styles.carouselDemoWrapper}>
        <Carousel3d
          className={styles.carouselDemo}
          onChange={this.handleChange}
          childMaxLength={maxLength}
        >
          {children}
        </Carousel3d>
      </div>
    );
  }
}
