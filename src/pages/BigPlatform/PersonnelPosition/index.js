import React, { PureComponent } from 'react';
import router from 'umi/router';
import { connect } from 'dva';

import styles from './index.less';
import styles1 from '@/pages/BigPlatform/ChemicalV2/index.less';
import BigPlatformLayout from '@/layouts/BigPlatformLayout';
// import bgImg from '@/pages/BigPlatform/ChemicalV2/imgs/bg.png';
import menuIcon from '@/pages/BigPlatform/ChemicalV2/imgs/menu-icon.png';
import { getSrc } from '@/pages/PersonnelPositionNew/utils';
import { CONTENT_STYLE, HEADER_STYLE, IMGS, SRC_BASES } from './utils';

const bgImg = 'http://data.jingan-china.cn/v2/chem/chemScreen/bg.png';

@connect(({ user, systemManagement }) => ({ user, systemManagement }))
export default class PersonnelPosition extends PureComponent {
  state = { index: 0, mouseIndex: undefined };

  componentDidMount() {
    const {
      dispatch,
      match: { params: { companyId } },
    } = this.props;
    const imgs = Array.from(IMGS);
    imgs.shift();
    imgs.forEach(({ icon }) => {
      const img = new Image();
      img.src = `http://data.jingan-china.cn/v2/new-menu/${icon}1.png`;
    });

    companyId && companyId !== 'index' && dispatch({
      type: 'systemManagement/fetchSettingDetail',
      payload: { companyId },
    });
  }

  handleClickMenu = () => {
    router.push('/company-workbench/view');
  };

  genHandleTabChange = i => e => {
    this.setState({ index: i });
  };

  genHandleMouseChange = i => e => {
    this.setState({ mouseIndex: i });
  };

  renderTabs = () => {
    const { index, mouseIndex } = this.state;
    return (
      <div className={styles.tabs}>
        {IMGS.map(({ name, icon }, i) => {
          const isSelectedOrMouseOver = i === index || i === mouseIndex;
          return (
            <div
              key={icon}
              className={styles[i === index ? 'selected' : i === mouseIndex ? 'tabHover' : 'tab']} // 选中或鼠标移上去或默认情况的样式判断
              onClick={this.genHandleTabChange(i)}
              onMouseEnter={this.genHandleMouseChange(i)}
              onMouseLeave={this.genHandleMouseChange()}
            >
              <span
                className={styles.icon}
                style={{
                  display: isSelectedOrMouseOver ? 'block' : 'none',
                  backgroundImage: `url(http://data.jingan-china.cn/v2/new-menu/${icon}1.png)`,
                }}
              />
              <span
                className={styles.icon}
                style={{
                  display: isSelectedOrMouseOver ? 'none' : 'block',
                  backgroundImage: `url(http://data.jingan-china.cn/v2/new-menu/${icon}.png)`,
                }}
              />
              {name}
            </div>
          );
        })}
      </div>
    )
  };

  render() {
    const {
      // user: {
      //   currentUser: { companyBasicInfo },
      // },
      systemManagement: { detail },
    } = this.props;
    const { index } = this.state;

    // const { mapIp, mapBuildId, mapSecret, appId } = companyBasicInfo || {};
    const { url: mapIp, buildingId: mapBuildId, secret: mapSecret, userName: appId } = detail;
    const src = getSrc(SRC_BASES[index], mapIp, mapBuildId, mapSecret, appId);
    // const src = `http://chem2.joysuch.com/js/tunnel.html?to=${SRC_BASES[index]}&buildId=200647&wh=false&appid=yanshi&secret=4011a04a6615406a9bbe84fcf30533de`;
    return (
      <BigPlatformLayout
        title="五位一体信息化管理平台"
        extra={'无锡市'}
        style={{
          background: `url(${bgImg}) no-repeat center`,
          backgroundSize: '100% 100%',
        }}
        headerStyle={HEADER_STYLE}
        titleStyle={{ fontSize: 46 }}
        contentStyle={CONTENT_STYLE}
        other={
          <div
            className={styles1.menuBtn}
            style={{ background: `url(${menuIcon}) center center / 100% 100% no-repeat` }}
            onClick={this.handleClickMenu}
          />
        }
      >
        <div className={styles.content}>
          {this.renderTabs()}
          <div className={styles.page}>
            <iframe className={styles.iframe} title="monitor" src={src} />
          </div>
        </div>
      </BigPlatformLayout>
    );
  }
}
