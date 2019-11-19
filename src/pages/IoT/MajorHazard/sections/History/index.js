import React, { Component } from 'react';
import { Row, Col, Radio, Card } from 'antd';
import { Range } from '../../components';
import classNames from 'classnames';
import styles from './index.less';

const TYPES = [
  {
    key: '0',
    value: '图表',
  },
  {
    key: '1',
    value: '列表',
  },
];
const NUMBER_TYPES = [
  {
    key: '0',
    value: '绝对值',
  },
  {
    key: '1',
    value: '百分比',
  },
];

export default class History extends Component {
  state = {
    range: undefined, // 时间范围
    type: undefined, // 类型，['图表', '列表']
    numberType: undefined, // 数值类型，['绝对值', '百分比']
  }

  componentDidMount() {

  }

  getData = () => {
    const { getData } = this.props;
    const { range: [startDate, endDate]=[] } = this.state;
    getData({
      startDate,
      endDate,
    });
  }

  handleRangeChange = (range) => {
    this.setState({
      range,
    }, this.getData);
  }

  handleTypeChange = ({ target: { value: type } }) => {
    this.setState({
      type,
    });
  }

  renderRadio = () => {
    const { type } = this.state;

    return (
      <Radio.Group value={type} buttonStyle="solid" onChange={this.handleTypeChange}>
        {TYPES.map(({ key, value }) => (
          <Radio.Button key={key} value={key}>{value}</Radio.Button>
        ))}
      </Radio.Group>
    );
  }

  render() {
    const { range } = this.state;

    return (
      <Row gutter={24}>
        <Col span={24}>
          <Card className={styles.card}>
            <div className={styles.toolbar}>
              <Range value={range} onChange={this.handleRangeChange} />
              {this.renderRadio()}
            </div>
          </Card>
        </Col>
      </Row>
    );
  }
}
