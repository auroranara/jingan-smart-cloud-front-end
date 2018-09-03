import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import Header from './components/Header/Header';
import Section from './components/Section/Section';

import styles from './UnitFireControl.less';

/**
 * 单位消防大屏
 */
export default class App extends PureComponent {
  /**
   * 组件内部状态
   */
  state = {

  }

  /**
   * 挂载后声明周期函数
   */
  componentDidMount() {
    const { match: { params: { unitId } } } = this.props;
    console.log(unitId);
  }

  /**
   * 渲染函数
   */
  render() {
    // 从props中获取单位名称
    // const {  } = this.props;

    // 临时的单位名称，对接接口以后替换为真实数据
    const tempUnitName = "无锡晶安智慧科技有限公司";

    return (
      <div className={styles.main}>
        <Header title="晶安智慧消防云平台" extraContent={tempUnitName} />
        <div className={styles.mainBody}>
          <Row gutter={16} style={{ marginBottom: 16, height: 'calc(48.92% - 16px)' }}>
            <Col span={6} style={{ height: '100%' }}>
              <Section style={{  }} />
            </Col>
            <Col span={12} style={{ height: '100%' }}>
              <Section style={{  }} />
            </Col>
            <Col span={6} style={{ height: '100%' }}>
              <Section style={{  }} />
            </Col>
          </Row>
          <Row gutter={16} style={{ height: '51.08%' }}>
            <Col span={6} style={{ height: '100%' }}>
              <Section style={{  }} />
            </Col>
            <Col span={6} style={{ height: '100%' }}>
              <Section style={{  }} />
            </Col>
            <Col span={6} style={{ height: '100%' }}>
              <Section style={{  }} />
            </Col>
            <Col span={6} style={{ height: '100%' }}>
              <Section style={{  }} />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
