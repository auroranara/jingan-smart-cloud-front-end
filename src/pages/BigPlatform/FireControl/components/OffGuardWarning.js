import React, { Component } from 'react';
import { Col, Row, Button, message } from 'antd';

import { myParseInt } from '../utils';
import styles from './OffGuardWarning.less';

function UnitCard(props) {
  const { index, companyName, alerted, onClick } = props;
  const parsedAlerted = myParseInt(alerted);

  const style = parsedAlerted ? { color: '#4092fa', border: '1px solid #4092fa', backgroundColor: 'transparent' } : { backgroundColor: '#053d84', color: '#fff', border: '1px solid #053d84' };

  return (
    <Row style={{ borderBottom: '1px rgb(9, 103, 211) solid' }}>
      <Col span={4}>
        <p className={styles.number}>{index}</p>
      </Col>
      <Col span={14}>
        <p className={styles.unitCard}>{companyName}</p>
      </Col>
      <Col span={6} style={{ padding: '10px 0' }}>
        <Button
          className={styles.btnWarning}
          onClick={parsedAlerted ? null : onClick}
          style={style}
        >
          {`${parsedAlerted ? '已' : ''}警告`}
        </Button>
      </Col>
    </Row>
  );
}

// const list = [...Array(20).keys()].map(i => ({
//   unit: '无锡晶安智慧科技有限公司',
// }));

export default class OffGuardWarning extends Component {
  handleClick = item => {
    const { dispatch, data: offGuard } = this.props;
    const { unitName, list=[] } = offGuard;
    if (!list.length) {
      message.warn('企业列表为空，无法一键警告');
      return;
    }

    const isWarnAll = !item;
    const recordsId = isWarnAll ? list[0].recordsId : item.recordsId;
    const companyIds = isWarnAll ? list.map(({ companyId }) => companyId).join(',') : item.companyId;

    dispatch({
      type: 'bigFireControl/offGuardWarn',
      payload: { unitName, recordsId, companyIds },
      callback(code, msg, data) {
        const warnedList = data && data.list ? data.list : [];

        if (code !== 200)
          message.warn(msg);
        else {
          const index = list.indexOf(item);
          const newList = isWarnAll ? list.map(item => {
            if (warnedList.includes(item.companyId))
              return { ...item, alertFlag: 1 };
            return item;
          }) : list.map((item, i) => {
            if (i === index)
              return { ...item, alertFlag: 1 };
            return item;
          });
          dispatch({
            type: 'bigFireControl/saveOffGuard',
            payload: { ...offGuard, list: newList },
          });
        }
      },
    });
  }

  render() {
    const { showed, data: { list=[] } } = this.props;

    return (
      <section style={{ display: showed ? 'block' : 'none' }} className={styles.container}>
        <Row span={24} style={{ height: '20%' }}>
          <Col span={12} style={{ height: '100%' }}>
            <div className={styles.left}>
              <Button type="primary" onClick={() => this.handleClick()}>一键警告</Button>
            </div>
          </Col>
          <Col span={12} style={{ height: '100%' }}>
            <div className={styles.right}>
              <p>
                脱岗单位:
                <span style={{ paddingLeft: '5px' }}>{list.length}</span>
              </p>
            </div>
          </Col>
        </Row>
        <div className={styles.table}>
          {list.map((item, index) => {
            const { id, companyName, alertFlag } = item;
            return <UnitCard key={id} index={index + 1} companyName={companyName} alerted={alertFlag} onClick={e => this.handleClick(item)} />
          })}
        </div>
      </section>
    );
  }
}
