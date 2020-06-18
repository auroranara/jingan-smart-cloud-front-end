import React, { PureComponent, Fragment } from 'react';
import { Row, Col } from 'antd';

import SectionDrawer from '@/pages/BigPlatform/Safety/Company3/components/SectionDrawer';
import { getLabel, SEXES } from '@/pages/RoleAuthorization/AccountManagement/utils';
import styles from './SafetyOfficerDrawer.less';
import imgNoAvatar from '@/pages/BigPlatform/Gas/imgs/camera-bg.png';

const rect = <span className={styles.rect} />;

function Card(props) {
  const { id, name, sex, entranceNumber, partName, icnumber, photoDetails } = props;
  const avatar = photoDetails && photoDetails.length ? photoDetails[0].webUrl : imgNoAvatar;

  return (
    <div className={styles.personList} key={id}>
      <div className={styles.left}>
        <img src={avatar} alt="avatar" />
      </div>
      <div className={styles.middle}>
        <div className={styles.name}>{name}</div>
        <div className={styles.item}>
          <span className={styles.label1}>性别：</span>
          <span className={styles.value}>{getLabel(sex, SEXES)}</span>
        </div>
        <div className={styles.item}>
          <span className={styles.label1}>SN：</span>
          <span className={styles.value}>{entranceNumber}</span>
        </div>
        <div className={styles.item}>
          <span className={styles.label1}>区域：</span>
          <span className={styles.value}>
            {partName}
          </span>
        </div>
        <div className={styles.item}>
          <span className={styles.label1}>门禁卡号：</span>
          <span className={styles.value}>{icnumber}</span>
        </div>
      </div>
    </div>
  );
}

function CardList(props) {
  const { title, list } = props;

  return (
    <div>
      <h3 className={styles.cardTitle}>
        {rect}{title}
        <span className={styles.length}>({list.length}人)</span>
      </h3>
      {list.map(item => <Card key={item.id} {...item} />)}
    </div>
  );
}

export default class ProductionOfficerDrawer extends PureComponent {
  componentDidUpdate({ visible: prevVisible }) {
    const { visible } = this.props;
    if (!prevVisible && visible) {
      this.scroll && this.scroll.scrollTop();
    }
  }

  refScroll = scroll => {
    this.scroll = (scroll && scroll.dom) || scroll;
  };

  render() {
    let {
      visible,
      data: { keyList, valueList, total },
      onClose,
    } = this.props;

    const title = <Fragment>生产区域人员统计<span className={styles.length}>({total}人)</span></Fragment>;

    return (
      <SectionDrawer
        drawerProps={{
          title,
          visible,
          onClose,
        }}
        sectionProps={{
          refScroll: this.refScroll,
        }}
      >
        <Row className={styles.personWrapper}>
          {Array.isArray(keyList) &&
            keyList.map(({ label, num }, index) => (
              <Col span={12} className={styles.person} key={index}>
                <div className={styles.personName}>{label}</div>
                <div className={styles.personValue}>{num || 0}</div>
              </Col>
            ))}
        </Row>
        <div className={styles.container}>
          {valueList.map(({ title, list }) => <CardList key={title} title={title} list={list} />)}
        </div>
      </SectionDrawer>
    );
  }
}
