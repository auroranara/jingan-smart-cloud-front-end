import React, { Component } from 'react';
import { Row, Col } from 'antd';
import Select from '@/jingan-components/Form/Select';
import styles from './index.less';

const MAPPER1 = {
  namespace: 'alarmMessage',
  list: 'monitorObjectTypeList',
  getList: 'getMonitorObjectTypeList',
};
const FIELDNAMES1 = {
  key: 'id',
  value: 'name',
};
const MAPPER2 = {
  namespace: 'alarmMessage',
  list: 'monitorObjectList',
  getList: 'getMonitorObjectList',
};
const FIELDNAMES2 = {
  key: 'id',
  value: 'name',
};

export default class MonitorObjectSelect extends Component {
  handleFirstChange = firstValue => {
    const { value, onChange } = this.props;
    // const secondValue = (value && value[1]) || undefined;
    onChange && onChange([firstValue, undefined]);
  };

  handleSecondChange = secondValue => {
    const { value, onChange } = this.props;
    const firstValue = (value && value[0]) || undefined;
    onChange && onChange([firstValue, secondValue]);
  };

  render() {
    const { value } = this.props;
    const firstValue = (value && value[0]) || undefined;
    const secondValue = (value && value[1]) || undefined;

    return (
      <Row gutter={12}>
        <Col span={12}>
          <Select
            placeholder="请选择监测对象类型"
            value={firstValue}
            mapper={MAPPER1}
            fieldNames={FIELDNAMES1}
            onChange={this.handleFirstChange}
            params={{
              type: '3',
            }}
            allowClear
          />
        </Col>
        <Col span={12}>
          <Select
            key={firstValue}
            params={{
              type: firstValue,
            }}
            placeholder="请选择监测对象"
            value={secondValue}
            mapper={MAPPER2}
            fieldNames={FIELDNAMES2}
            onChange={this.handleSecondChange}
            allowClear
            showSearch
            filterOption={false}
            labelInValue
          />
        </Col>
      </Row>
    );
  }
}
