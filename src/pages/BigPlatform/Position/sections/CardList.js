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
        return <span className={styles.track} onClick={e => handleTrack(record.areaId, record.id)}>追踪</span>
      },
    }];

    let list = [];
    if (positions.length && Object.keys(areaInfo).length)
      list = positions.filter(({ userName, visitorName, cardCode }) => [userName, visitorName, cardCode.toString()].some(s => s && s.includes(value)));

    const dataSource = list.map(p => {
      const { areaId, cardId, cardCode, sos, tLong, overstep, onlineStatus } = p;
      const name = getUserName(p, true);
      return {
        id: cardId,
        areaId,
        name,
        fullName: areaInfo[areaId].fullName,
        code: cardCode,
        status: sos || tLong || overstep, // true 火警 false 正常
        online: +onlineStatus === ONLINE,
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
        <Table
          size="small"
          rowKey="id"
          className={styles.table}
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
      </div>
    );
  }
}
