import React, { Component } from 'react';
import { Row, Col } from 'antd';
import Select from '@/jingan-components/Form/Select';
import styles from './index.less';

export const YES_OR_NO = [{ key: '1', value: '是' }, { key: '0', value: '否' }];
const MAPPER = {
  namespace: 'alarmMessage',
  list: 'majorHazardList',
  getList: 'getMajorHazardList',
};
const FIELDNAMES = {
  key: 'id',
  value: 'name',
};

export default class MajorHazardSelect extends Component {
  handleFirstChange = firstValue => {
    const { value, onChange } = this.props;
    const secondValue = (value && value[1]) || undefined;
    onChange && onChange([firstValue, secondValue]);
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
    const yes = firstValue === YES_OR_NO[0].key;

    return (
      <Row gutter={12}>
        <Col span={yes ? 12 : 24}>
          <Select
            placeholder="请选择是/否"
            value={firstValue}
            list={YES_OR_NO}
            onChange={this.handleFirstChange}
            allowClear
          />
        </Col>
        {yes && (
          <Col span={12}>
            <Select
              placeholder="请选择重大危险源"
              value={secondValue}
              mapper={MAPPER}
              fieldNames={FIELDNAMES}
              onChange={this.handleSecondChange}
              allowClear
              showSearch
              filterOption={false}
              labelInValue
            />
          </Col>
        )}
      </Row>
    );
  }
}
