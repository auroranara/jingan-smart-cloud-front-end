import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import SectionDrawer from '../SectionDrawer';
// 引入样式文件
import styles from './index.less';

/**
 * 特种设备抽屉
 */
export default class SpecialEquipmentDrawer extends PureComponent {
  componentDidUpdate({ visible: prevVisible }) {
    const { visible } = this.props;
    if (!prevVisible && visible) {
      this.scroll.dom.scrollTop();
    }
  }

  refScroll = scroll => {
    this.scroll = scroll;
  };

  render() {
    let {
      // 抽屉是否可见
      visible,
      // 数据
      onClose,
    } = this.props;

    const filterList = [
      { value: 'all', label: '全部', color: 'rgb(243, 245, 246)', number: 1 },
      { value: 1, label: '已过期', color: 'rgb( 248, 51, 41)', number: 2 },
      { value: 0, label: '未过期', color: 'rgb(243, 245, 246)', number: 2 },
    ];

    return (
      <SectionDrawer
        drawerProps={{
          title: '特种设备',
          visible,
          onClose: () => {
            onClose('specialEquipment');
          },
        }}
        sectionProps={{
          refScroll: this.refScroll,
          contentStyle: { paddingBottom: 16 },
          scrollProps: { className: styles.scrollContainer },
          fixedContent: (
            <Row className={styles.sectionFilter}>
              {filterList.map((item, i) => (
                <Col span={6} className={styles.filter} key={i}>
                  <div
                    className={styles.inActiveFilter}
                    // onClick={() => handleFilter(item.value)}
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
        <div className={styles.container} />
      </SectionDrawer>
    );
  }
}
