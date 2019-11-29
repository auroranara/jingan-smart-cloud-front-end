import React, { PureComponent } from 'react';
import { Row, Col, Icon, Badge } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import BigPlatformLayout from '@/layouts/BigPlatformLayout';
import headerBg from '@/assets/new-header-bg.png';
import bgImg from '@/pages/BigPlatform/Chemical/imgs/bg.png';
import menuIcon from './imgs/menu-icon.png';
import styles from './index.less';
import { RiskPointDrawer } from '@/pages/BigPlatform/Safety/Company3/components';
import { POINTS } from './utils';

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
    this.state = {
      riskPointDrawerVisible: false,
      riskPointType: {},
    };
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
    router.push('/company-workbench/view');
  };

  /**
   * 设置抽屉是否显示
   * @param {string} drawerName 抽屉名称
   * @param {object} props 其他参数
   */
  setDrawerVisible = (drawerName, props, callback) => {
    const fullName = `${drawerName}DrawerVisible`;
    this.setState(({ [fullName]: visible }) => ({ [fullName]: !visible, ...props }));
    callback && callback(this.props);
  };

  /**
   * 渲染
   */
  render() {
    const { riskPointDrawerVisible, riskPointType } = this.state;
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
            className={styles.menuBtn}
            style={{ background: `url(${menuIcon}) center center / 100% 100% no-repeat` }}
            onClick={this.handleClickMenu}
          />
        }
      >
        <Tips />
        <div className={styles.container}>
          <Row gutter={15} className={styles.height100}>
            <Col span={6} className={styles.height100}>
              <div className={styles.leftTop}>
                <CompanyInfo handleClickCount={this.setDrawerVisible} />
              </div>

              <div className={styles.leftMiddle}>
                <Remind />
              </div>

              <div className={styles.leftBottom}>
                <KeyPoints />
              </div>
            </Col>

            <Col span={18} className={styles.height100}>
              <div className={styles.right}>
                <Map />
              </div>
            </Col>
          </Row>
          <div className={styles.msgContainer}>
            <Badge count={3}>
              <Icon type="message" className={styles.msgIcon} />
            </Badge>
          </div>
        </div>

        {/* 风险点抽屉 */}
        <RiskPointDrawer
          visible={riskPointDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('riskPoint');
          }}
          data={POINTS}
          riskPointType={riskPointType}
        />
      </BigPlatformLayout>
    );
  }
}
