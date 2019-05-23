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
// const DUTIES = ['单位法人', '安全负责人', '安全管理员', '安全员'];
// const KEYS = ['legalList', 'safeChargerList', 'safeManagerList', 'saferList'];
const COLORS = ['255,72,72', '198,193,129', '0,168,255', '9,103,211'];

function PersonCard(props) {
  const { list, duty, color, style, ...restProps } = props;

  return list && list.length ? (
    <div className={styles.card} style={{ borderColor: color, ...style }} {...restProps}>
      <span className={styles.duty}>{duty}</span>
      {list.map(({ id, user_name: name, phone_number: phone }) => (
        <p key={id}>
          <span className={styles.name}>{name}</span>
          <span>{phone}</span>
        </p>
      ))}
    </div>
  ) : null;
}

export default class SafeDrawer extends PureComponent {
  render() {
    const { visible, data, handleDrawerVisibleChange } = this.props;
    const men = Object.entries(data);
    const rows = [];
    for (let i = 0; i < men.length; i += 2) {
      const first = men[i];
      const second = men[i + 1];
      rows.push(
        <Row key={first[0]}>
          <Col span={12}>
            <p className={styles.p}>
              {first[0]}
              <span>{Array.isArray(first[1]) ? first[1].length : 0}</span>
            </p>
          </Col>
          {second && (
            <Col span={12}>
              <p className={styles.p}>
                {second[0]}
                <span>{Array.isArray(second[1]) ? second[1].length : 0}</span>
              </p>
            </Col>
          )}
        </Row>
      );
    }

    const left = (
      <div className={styles.container}>
        <div className={styles.head}>
          {rows}
        </div>
        <div className={styles.cards} style={{ height: `calc(100% - ${40 * rows.length}px)` }}>
          {men.map(([duty, list], i) => (
            <PersonCard key={duty} duty={duty} color={`rgb(${COLORS[i % 4]})`} list={list} />
          ))}
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
