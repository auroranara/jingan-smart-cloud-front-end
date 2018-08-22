import React, { PureComponent } from 'react';
import { Button, Col, Input, Row } from 'antd';

import FcSection from './FcSection';
import AlarmCard from './components/AlarmCard';
import styles from './AlarmSection.less';
import noAlarm from './noAlarm.png';

// const alarms = [...Array(10).keys()].map(i => ({ company: '无锡晶安智慧有限公司', address: '无锡市新吴区汉江路5号', time: Date.now() - Math.floor(Math.random()*10)*60000 }));

export default class AlarmSection extends PureComponent {
  node = null; // ref函数获取的node为antd的Input组件实例，需要再访问其对应的input属性才是原生dom

  handleSearch = () => {
    const { dispatch } = this.props;
    console.log(this.node);
    dispatch({ type: 'bigFireControl/fetchAlarm', payload: { searchName: this.node.input.value.trim() } });
  }

  render() {
    const { list = [] } = this.props.alarmData;
    const cards = list.map(({ id, name, searchArea, saveTime }) => <AlarmCard key={id} company={name} address={searchArea} time={saveTime} />);
    const noCard = <div className={styles.noCard} style={{ background: `url(${noAlarm})`, backgroundSize: '100% 100%' }} />;

    return (
      <FcSection title="警情信息" style={{ padding: '0 15px 15px' }}>
        <Row gutter={6} style={{ marginBottom: 20 }}>
          <Col span={18}>
            <Input
              onPressEnter={this.handleSearch}
              ref={node => { this.node = node; }}
              placeholder="请输入单位名称或地址"
              style={{ background: 'rgba(9,103,211,0.2)', border: 'none', color: '#FFF' }}
            />
          </Col>
          <Col span={6}>
            <Button
              onClick={this.handleSearch}
              style={{ background: 'rgba(9,103,211,0.5)', border: 'none', color: '#FFF', width: '100%' }}
            >
              查询
            </Button>
          </Col>
        </Row>
        <div className={styles.cardContainer} style={{ height: 'calc(100% - 110px)' }}>
          {list.length ? cards : noCard}
        </div>
      </FcSection>
    );
  }
}
