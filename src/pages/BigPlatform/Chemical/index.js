import React, { PureComponent } from 'react';
import { Row, Col, Icon } from 'antd';
import { connect } from 'dva';
import { stringify } from 'qs';
import moment from 'moment';
import router from 'umi/router';
import BigPlatformLayout from '@/layouts/BigPlatformLayout';
import headerBg from '@/assets/new-header-bg.png';
import bgImg from '@/pages/BigPlatform/Chemical/imgs/bg.png';
import menuIcon from './imgs/menu-icon.png';
import styles from './index.less';
import {
  Risk,
  KeyPoints,
  HighDanger,
  Emergency,
  Remind,
  Tips,
  CompanyInfo,
  Notice,
  HiddenDanger,
  Map,
} from './sections/Components';

const HEADER_STYLE = {
  top: 0,
  left: 0,
  width: '100%',
  fontSize: 16,
  zIndex: 99,
  backgroundImage: `url(${headerBg})`,
  backgroundSize: '100% 100%',
};

const CONTENT_STYLE = { position: 'relative', height: '90.37037%', zIndex: 0 };

export default class Chemical extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  handleDrawerVisibleChange = (name, rest) => {
    const stateName = `${name}DrawerVisible`;
    this.setState(state => ({
      [stateName]: !state[stateName],
      ...rest,
    }));
  };

  handleParentChange = newState => {
    this.setState({ ...newState });
  };

  handleClickMenu = () => {
    router.push('/company-workbench/workbench/list');
  };

  /**
   * 渲染
   */
  render() {
    const {} = this.state;
    return (
      <BigPlatformLayout
        title="晶安化工安全生产管理系统"
        extra={'无锡晶安智慧科技有限公司'}
        style={{
          background: `url(${bgImg}) no-repeat center`,
          backgroundSize: '100% 100%',
        }}
        headerStyle={HEADER_STYLE}
        titleStyle={{ fontSize: 46 }}
        contentStyle={CONTENT_STYLE}
        other={
          <div
            className={styles.menuBtn}
            style={{ background: `url(${menuIcon}) center center / 100% 100% no-repeat` }}
            onClick={this.handleClickMenu}
          />
        }
      >
        <Tips />
        <div className={styles.container}>
          <div className={styles.topContainer}>
            <Row gutter={15} className={styles.height100}>
              <Col span={5} className={styles.height100}>
                {/* 公司介绍 */}
                <CompanyInfo />
                {/* 最新公告 */}
                <Notice />
              </Col>
              <Col span={14} className={styles.height100}>
                {/* map */}
                <Map />
              </Col>
              <Col span={5} className={styles.height100}>
                {/* 隐患统计 */}
                <HiddenDanger />
                {/* 到期提醒 */}
                <Remind />
              </Col>
            </Row>
          </div>
          <div className={styles.bottomContainer}>
            <Row gutter={15} className={styles.height100}>
              <Col span={6} className={styles.height100}>
                {/* 风险情况统计 */}
                <Risk />
              </Col>
              <Col span={6} className={styles.height100}>
                {/* 两重点 */}
                <KeyPoints />
              </Col>
              <Col span={6} className={styles.height100}>
                {/* 重大危险源 */}
                <HighDanger />
              </Col>
              <Col span={6} className={styles.height100}>
                {/* 应急资源统计 */}
                <Emergency />
              </Col>
            </Row>
          </div>
        </div>
      </BigPlatformLayout>
    );
  }
}
