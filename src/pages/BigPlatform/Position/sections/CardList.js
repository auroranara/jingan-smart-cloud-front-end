import React, { PureComponent } from 'react';
import { Input, Table } from 'antd';

import styles from './SectionList.less';
import { getUserName } from '../utils';

const ONLINE = 1;

export default class CardList extends PureComponent {
  state = {
    value: '',
  }

  handleChange = e => {
    this.setState({ value: e.target.value });
  };

  render() {
    const { areaInfo, positions, handleTrack } = this.props;
    const { value } = this.state;

    const columns = [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        return <span className={styles[record.status ? 'alarm' : null]}>{text}</span>
      },
    }, {
      title: '区域',
      dataIndex: 'fullName',
      key: 'fullName',
    }, {
      title: '编号',
      dataIndex: 'code',
      key: 'code',
    }, {
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        return <span className={styles.track} onClick={e => handleTrack(record.areaId, record.id, record.userId)}>追踪</span>
      },
    }];

    let list = [];
    if (positions.length && Object.keys(areaInfo).length)
      list = positions.filter(({ userName, visitorName, cardCode }) => [userName, visitorName, cardCode.toString()].some(s => s && s.includes(value)));

    // console.log(list, areaInfo);
    const dataSource = list.filter(({ areaId }) => areaId).map(p => {
      const { areaId, cardId, cardCode, sos, tlong, overstep, onlineStatus, userId } = p;
      const name = getUserName(p, true);
      return {
        id: cardId,
        areaId,
        name: name || '无名',
        fullName: areaInfo[areaId || null] ? areaInfo[areaId || null].fullName : '火星',
        code: cardCode,
        status: sos || tlong || overstep, // true 火警 false 正常
        online: +onlineStatus === ONLINE,
        userId,
      };
    });

    return (
      <div className={styles.cards}>
        <Input
          className={styles.input}
          value={value}
          onChange={this.handleChange}
          placeholder="请输入人员姓名或编号"
        />
        <div className={styles.cardListTable}>
          <Table
            size="small"
            rowKey="id"
            className={styles.table}
            dataSource={dataSource}
            columns={columns}
            pagination={false}
          />
        </div>
      </div>
    );
  }
}
