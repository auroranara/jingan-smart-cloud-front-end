import React, { PureComponent } from 'react';
import { message } from 'antd';
import { connect } from 'dva';
import Carousel3d from './Carousel3d';
import styles from './Dashboard.less';
import { getToken } from 'utils/authority';
import fire from '../../assets/fire-big-screen.png';
import safe from '../../assets/safe-bing-screen.png';

const maxLength = 6; // 最多容纳个数
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
    current: 0,
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
      safeItem.url = `/acloud_new/#//big-platform/safety/company/${companyId}`;
      this.setState({
        hasSafeAuthority: !!companyId,
        safetyProduction,
        fireService,
      });
    }
  }

  handleChange = data => {
    if (data.eventType === 'end') {
      this.setState({ current: data.current });
    }
  };

  render() {
    const { current, safetyProduction, fireService } = this.state;

    // safetyProduction,fireService 1开启/0关闭
    const imgWrapper =
      (safetyProduction &&
        fireService && [safeItem, fireItem, safeItem, fireItem, safeItem, fireItem]) ||
      (safetyProduction && !fireService && [safeItem, safeItem, safeItem, safeItem]) ||
      (!safetyProduction && fireService && [fireItem, fireItem, fireItem, fireItem]) ||
      [];

    const goToBigScreen = () => {
      const { hasSafeAuthority } = this.state;
      if (!hasSafeAuthority && imgWrapper[current].key === 'safe') {
        message.error('该功能暂时未开放！');
      } else {
        const url = imgWrapper[current].url;
        const win = window.open(url, '_blank');
        win.focus();
      }
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
