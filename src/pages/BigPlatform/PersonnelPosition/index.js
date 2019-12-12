import React, { PureComponent } from 'react';
import router from 'umi/router';

import { CONTENT_STYLE, HEADER_STYLE, SRC } from './utils';
import styles from './index.less';
import styles1 from '@/pages/BigPlatform/ChemicalV2/index.less';
import BigPlatformLayout from '@/layouts/BigPlatformLayout';
import bgImg from '@/pages/BigPlatform/Chemical/imgs/bg.png';
import menuIcon from '@/pages/BigPlatform/ChemicalV2/imgs/menu-icon.png';

export default class PersonnelPosition extends PureComponent {
  handleClickMenu = () => {
    router.push('/company-workbench/view');
  };

  render() {
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
        <iframe className={styles.iframe} title="monitor" src={SRC} />
      </BigPlatformLayout>
    );
  }
}
