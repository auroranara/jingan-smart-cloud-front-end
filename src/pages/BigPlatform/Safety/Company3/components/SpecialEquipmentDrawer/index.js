import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import moment from 'moment';

import SectionDrawer from '../SectionDrawer';
import Cards from './cards';
// 引入样式文件
import styles from './index.less';

/**
 * 特种设备抽屉
 */
export default class SpecialEquipmentDrawer extends PureComponent {
  state = {
    specialStatus: 2,
  };
  componentDidUpdate({ visible: prevVisible }) {
    const { visible } = this.props;
    if (!prevVisible && visible) {
      this.scroll.dom.scrollTop();
    }
  }

  refScroll = scroll => {
    this.scroll = scroll;
  };

  /**
   * 根据状态获取特种设备列表
   * 1 已过期
   * 0 未过期
   */
  handleFilter = i => {
    this.setState({ specialStatus: i });
  };

  render() {
    let {
      // 抽屉是否可见
      visible,
      // 数据
      specialData: { list = [] },
    } = this.props;

    const { specialStatus } = this.state;

    const filterLabel = [
      { value: 2, label: '全部', color: 'rgb(243, 245, 246)', number: list.length },
      {
        value: 1,
        label: '已过期',
        color: 'rgb( 248, 51, 41)',
        number: list.filter(item => item.checkStatus === '1').length,
      },
      {
        value: 0,
        label: '未过期',
        color: 'rgb(243, 245, 246)',
        number: list.filter(item => item.checkStatus === '0').length,
      },
    ];

    const filterList = list.filter(item => {
      switch (specialStatus) {
        case 0:
          return item.checkStatus === '0';
        case 1:
          return item.checkStatus === '1';
        case 2:
          return true;
        default:
          return false;
      }
    });

    return (
      <SectionDrawer
        drawerProps={{
          title: '特种设备',
          visible,
          onClose: () => {
            this.props.onClose();
            this.setState({
              visible: false,
              specialStatus: 2,
            });
          },
        }}
        sectionProps={{
          refScroll: this.refScroll,
          contentStyle: { paddingBottom: 16 },
          scrollProps: { className: styles.scrollContainer },
          fixedContent: (
            <Row className={styles.sectionFilter}>
              {filterLabel.map((item, i) => (
                <Col span={6} className={styles.filter} key={i}>
                  <div
                    className={
                      specialStatus === item.value ? styles.activeFilter : styles.inActiveFilter
                    }
                    onClick={() => this.handleFilter(item.value)}
                  >
                    {item.label}
                    <span style={{ color: item.color, paddingLeft: 10 }}>{item.number}</span>
                  </div>
                </Col>
              ))}
            </Row>
          ),
        }}
      >
        <div className={styles.container}>
          {filterList.map(
            ({ data_id, data_true_name, factory_number, linkman, recheck_date, checkStatus }) => (
              <Cards
                key={data_id}
                status={checkStatus}
                contentList={[
                  { label: '设备名称', value: data_true_name },
                  {
                    label: '出厂编号',
                    value: factory_number,
                  },
                  {
                    label: <span style={{ letterSpacing: 4.5 }}>负责人</span>,
                    value: linkman,
                  },
                  {
                    label: '有效期至',
                    value: (
                      <span className={+checkStatus === 1 ? styles.timeStatus : ''}>
                        {moment(recheck_date).format('YYYY-MM-DD')}
                      </span>
                    ),
                  },
                ]}
              />
            )
          )}
        </div>
      </SectionDrawer>
    );
  }
}
