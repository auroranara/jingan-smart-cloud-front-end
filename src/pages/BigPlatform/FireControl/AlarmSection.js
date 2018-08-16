import React, { PureComponent } from 'react';
import { Button, Col, Input, Row } from 'antd';

import FcSection from './FcSection';
import AlarmCard from './AlarmCard';

const alarms = [...Array(10).keys()].map(i => ({ company: '无锡晶安智慧有限公司', address: '无锡市新吴区汉江路5号', time: Date.now() - Math.floor(Math.random()*10)*60000 }));

export default function AlarmSection(props) {
  return (
    <FcSection title="警情信息">
      <Row gutter={6} style={{ marginBottom: 20 }}>
        <Col span={18}><Input style={{ background: 'rgba(9,103,211,0.2)', border: 'none', color: '#FFF' }} /></Col>
        <Col span={6}><Button style={{ background: 'rgba(9,103,211,0.5)', border: 'none', color: '#FFF', width: '100%' }}>查询</Button></Col>
      </Row>
      <div style={{ overflow: 'auto', height: 'calc(100% - 102px)' }}>
        {alarms.map((item, index) => <AlarmCard {...item} key={index} />)}
      </div>
    </FcSection>
  );
}
