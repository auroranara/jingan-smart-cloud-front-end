import React, { PureComponent } from 'react';
import { Button, Col, Input, Row } from 'antd';

import FcSection from './FcSection';
import AlarmCard from './AlarmCard';

function AlarmSection(props) {
  const { isBack } = props;
  const title = isBack ? "警情信息反面" : "警情信息";

  return (
    <FcSection title={title} isBack={isBack}>
      <Row>
        <Col span={18}><Input style={{ background: 'rgba(9,103,211,0.2)', border: 'none', color: '#FFF' }} /></Col>
        <Col span={6}><Button style={{ background: 'rgba(9,103,211,0.5)', border: 'none', color: '#FFF', marginLeft: 10 }}>查询</Button></Col>
      </Row>
      <div>
        <AlarmCard />
        <AlarmCard />
        <AlarmCard />
      </div>
    </FcSection>
  );
}

export default AlarmSection;
