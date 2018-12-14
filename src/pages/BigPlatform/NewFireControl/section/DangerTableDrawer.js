import React, { PureComponent } from 'react';
import { Table } from 'antd';

import styles from './DangerTableDrawer.less';
import DrawerContainer from '../components/DrawerContainer';
import SearchBar from '../components/SearchBar';

function rand() {
  return Math.floor(Math.random() * 100);
}

const TYPE = 'dangerTable';

const numCols = ['total', 'afterRectification', 'toReview', 'hasExtended'];

// const DATA = [...Array(100).keys()].map(i => ({
//   id: i,
//   index: i,
//   name: '无锡市新吴区机械制造有限公司',
//   total: rand(),
//   a: rand(),
//   b: rand(),
//   c: rand(),
// }));

export default class DangerTableDrawer extends PureComponent {
  genCellRender = lableIndex => (n, record) => {
    const { handleShowDanger } = this.props;
    return <span className={styles.cell} onClick={e => handleShowDanger(record.companyId, lableIndex)}>{n}</span>
  };

  // addRender = cols => {
  //   cols.forEach(c => {
  //     if (numCols.includes(c.dataIndex))
  //       c.render = this.genCellRender;
  //   });
  // };

  render() {
    const { visible, data, handleDrawerVisibleChange } = this.props;

    const columns = [{
      title: '序号',
      dataIndex: 'index',
      width: 100,
      align: 'center',
    }, {
      title: '单位名称',
      dataIndex: 'companyName',
      align: 'center',
    }, {
      title: '隐患数量',
      dataIndex: 'total',
      width: 100,
      align: 'center',
      render: this.genCellRender(0),
    }, {
      title: '已超期',
      dataIndex: 'hasExtended',
      width: 100,
      align: 'center',
      render: this.genCellRender(1),
    }, {
      title: '待整改',
      dataIndex: 'afterRectification',
      width: 100,
      align: 'center',
      render: this.genCellRender(2),
    }, {
      title: '待复查',
      dataIndex: 'toReview',
      width: 100,
      align: 'center',
      render: this.genCellRender(3),
    }];

    const left = (
        <SearchBar searchStyle={{ width: 500 }}>
          <Table
            rowKey="companyId"
            columns={columns}
            dataSource={data}
            pagination={false}
            scroll={{ y: 600 }}
          />
        </SearchBar>
    );

    return (
      <DrawerContainer
        title="隐患列表"
        visible={visible}
        left={left}
        onClose={() => handleDrawerVisibleChange(TYPE)}
      />
    );
  }
}
