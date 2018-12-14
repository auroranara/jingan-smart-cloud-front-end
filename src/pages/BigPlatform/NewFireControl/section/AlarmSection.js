import React, { PureComponent } from 'react';
import { Button, Col, Input, Row } from 'antd';

import FcSection from './FcSection';
import AlarmCard from '../components/AlarmCard';
import styles from './AlarmSection.less';
// import noAlarm from './img/noAlarm.png';

const DELAY = 2000;

// const alarms = [...Array(10).keys()].map(i => ({ company: '无锡晶安智慧有限公司', address: '无锡市新吴区汉江路5号', time: Date.now() - Math.floor(Math.random()*10)*60000 }));

export default class AlarmSection extends PureComponent {
  node = null; // ref函数获取的node为antd的Input组件实例，需要再访问其对应的input属性才是原生dom
  timer = null; // 该模块的轮询定时器

  componentDidMount() {
    this.startPoll();
  }

  componentWillUnmount() {
    this.clearPoll();
  }

  startPoll = () => {
    // this.timer = setInterval(this.fetchAlarm, DELAY);
  };

  clearPoll = () => {
    clearInterval(this.timer);
  }

  fetchAlarm = () => {
    const { handleFetch } = this.props;
    // console.log('poll alarm');
    handleFetch && handleFetch({ searchName: this.node.input.value.trim() });
  };

  handleSearch = () => {
    this.fetchAlarm();
  }

  handleFocus = () => {
    this.clearPoll();
  }

  handleBlur = () => {
    this.startPoll();
  }

  render() {
    const { data: { list = [] }, isBack = false, title, backTitle, handleRotate, handleClick } = this.props;

    const cards = list.map((item) => {
      const { id } = item;
      return <AlarmCard key={id} data={item} onClick={() => handleClick(item)} />
    });
    const noCard = <div className={styles.noCard} />;
    // const noCard = <div className={styles.noCard} style={{ backgroundImage: `url(${noAlarm})`}} />;

    return (
      <FcSection
        title={title}
        backTitle={backTitle}
        handleBack={handleRotate}
        isBack={isBack}
        style={{ padding: '0 15px 15px', position: 'relative' }}>
          <Row gutter={6} style={{ marginBottom: 20 }}>
            <Col span={18}>
              <Input
                onPressEnter={this.handleSearch}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                ref={node => { this.node = node; }}
                placeholder="请输入单位名称"
                // style={{ background: 'rgba(9,103,211,0.2)', border: 'none', color: '#FFF' }}
                style={{ background: 'rgb(6,59,111)', border: 'none', color: '#FFF', boxShadow: 'rgba(0, 0, 0, 0.3) 3px 3px 5px' }}
              />
            </Col>
            <Col span={6}>
              <Button
                onClick={this.handleSearch}
                // style={{ background: 'rgba(9,103,211,0.5)', border: 'none', color: '#FFF', width: '100%' }}
                style={{ background: 'rgb(6,59,111)', border: 'none', color: '#FFF', width: '100%', boxShadow: 'rgba(0, 0, 0, 0.3) 3px 3px 5px' }}
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
