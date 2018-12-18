import React, { PureComponent } from 'react';
import { Col, Row } from 'antd';

import styles from './SafeDrawer.less';
import DrawerContainer from '../components/DrawerContainer';

// const LIST = [
//   { id: 0, name: '张三', phone: '18861872555' },
//   { id: 1, name: '李四', phone: '18861872555' },
//   { id: 2, name: '王五', phone: '18861872555' },
// ];

const TYPE = 'safe';
const DUTIES = ['单位法人', '安全负责人', '安全管理员', '安全员'];
const KEYS = ['legalList', 'safeChargerList', 'safeManagerList', 'saferList'];
const COLORS = ['255,72,72', '198,193,129', '0,168,255', '9,103,211'];
// const CLASSES = ['legal', 'leader', 'admin', 'person'];

function PersonCard(props) {
  const { list, duty, color, style, ...restProps } = props;

  return list && list.length && (
    <div className={styles.card} style={{ borderColor: color, ...style }} {...restProps}>
      <span className={styles.duty}>{duty}</span>
      {list.map(({ user_id: id, user_name: name, mobile: phone }) => (
        <p key={id}>
          <span className={styles.name}>{name}</span>
          <span>{phone}</span>
        </p>
      ))}
    </div>
  );
}

export default class SafeDrawer extends PureComponent {
  render() {
    const { visible, data, handleDrawerVisibleChange } = this.props;
    const safes = [...Array(4).keys()].map(i => {
      const arr = data[KEYS[i]];
      return Array.isArray(arr) ? arr : [];
    });

    const left = (
      <div className={styles.container}>
        <div className={styles.head}>
          <Row>
            <Col span={12}>
              <p className={styles.p}>
                单位法人
                <span className={styles.legal}>{safes[0].length}</span>
              </p>
            </Col>
            <Col span={12}>
              <p className={styles.p}>
                安全负责人
                <span className={styles.leader}>{safes[1].length}</span>
              </p>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <p className={styles.p}>
                安全管理员<span className={styles.admin}>{safes[2].length}</span>
              </p>
            </Col>
            <Col span={12}>
              <p className={styles.p}>
                安全员
                <span className={styles.person}>{safes[3].length}</span>
              </p>
            </Col>
          </Row>
        </div>
        <div className={styles.cards}>
          {DUTIES.map((d, i) => (
            <PersonCard
              key={i}
              duty={d}
              color={`rgb(${COLORS[i]})`}
              list={safes[i]}
            />)
          )}
        </div>
      </div>
    );

    return (
      <DrawerContainer
        title="安全人员"
        width={485}
        visible={visible}
        left={left}
        onClose={() => handleDrawerVisibleChange(TYPE)}
      />
    );
  }
}
