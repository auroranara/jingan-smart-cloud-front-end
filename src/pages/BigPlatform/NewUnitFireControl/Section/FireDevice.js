import React, { PureComponent } from 'react';
import { Radio, Row, Col } from 'antd';
import { connect } from 'dva';
import WaterCards from '../components/WaterCards';
import ChartGauge from '../components/ChartGauge';
import Section from '../Section';
import styles from './FireDevice.less';

@connect(({ newUnitFireControl }) => ({
  newUnitFireControl,
}))
export default class FireDevice extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      type: '101',
    };
  }

  // 切换状态
  handelRadioChange = item => {
    const { dispatch, companyId } = this.props;
    const {
      target: { value },
    } = item;
    this.setState({ type: value });
    dispatch({
      type: 'newUnitFireControl/fetchWaterSystem',
      payload: {
        companyId,
        type: value,
      },
    });
  };

  renderHydrant = () => {
    const { waterList } = this.props;

    return waterList.map(item => {
      const { deviceDataList } = item;
      if (!deviceDataList.length) return null;
      const { deviceId, deviceName } = item;
      const [
        {
          value,
          status,
          deviceParamsInfo: { minValue, maxValue, normalUpper, normalLower },
        },
      ] = deviceDataList;

      return (
        <Col span={12} className={styles.gaugeCol} key={deviceId}>
          <ChartGauge
            showName
            showValue
            radius="75%"
            isLost={+status < 0}
            name={deviceName}
            value={value || 0}
            range={[minValue || 0, maxValue || value || 5]}
            normalRange={[normalLower, normalUpper]}
          />
        </Col>
      );
    });
  };

  renderPond = () => {
    const { waterList } = this.props;

    return waterList.map(item => {
      const { deviceDataList } = item;
      if (!deviceDataList.length) return null;
      const { deviceId, deviceName } = item;
      const [
        {
          value,
          status,
          unit,
          deviceParamsInfo: { normalUpper, normalLower },
        },
      ] = deviceDataList;

      return (
        <WaterCards
          key={deviceId}
          name={deviceName}
          value={value}
          status={status}
          unit={unit}
          range={[normalLower, normalUpper]}
        />
      );
    });
  };

  render() {
    const { onClick } = this.props;
    const { type } = this.state;
    return (
      <Section title="水系统">
        <div className={styles.container}>
          <div className={styles.tabsWrapper}>
            <Radio.Group value={type} buttonStyle="solid" onChange={this.handelRadioChange}>
              <Radio.Button value="101">消火栓系统</Radio.Button>
              <Radio.Button value="102">自动喷淋系统</Radio.Button>
              <Radio.Button value="103">水池/水箱</Radio.Button>
            </Radio.Group>
          </div>
          <Row
            className={styles.itemsWrapper}
            onClick={() => {
              if (type === '101') onClick(0, type);
              if (type === '102') onClick(1, type);
              if (type === '103') onClick(2, type);
            }}
          >
            {type === '101' && this.renderHydrant()}
            {type === '102' && this.renderHydrant()}
            {type === '103' && this.renderPond()}
          </Row>
        </div>
      </Section>
    );
  }
}
