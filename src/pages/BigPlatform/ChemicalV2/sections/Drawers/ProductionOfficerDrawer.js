import React, { PureComponent, Fragment } from 'react';
import { Row, Col } from 'antd';

import SectionDrawer from '@/pages/BigPlatform/Safety/Company3/components/SectionDrawer';
import { getLabel, SEXES } from '@/pages/RoleAuthorization/AccountManagement/utils';
import styles from './SafetyOfficerDrawer.less';
import imgNoAvatar from '@/pages/BigPlatform/Gas/imgs/camera-bg.png';

const rect = <span className={styles.rect} />;

function Card(props) {
  const { id, user_name, sex, sn, section, cardNumber, avatarFileList } = props;
  const avatar = avatarFileList && avatarFileList.length ? avatarFileList[0].webUrl : imgNoAvatar;

  return (
    <div className={styles.personList} key={id}>
      <div className={styles.left}>
        <img src={avatar} alt="avatar" />
      </div>
      <div className={styles.middle}>
        <div className={styles.name}>{user_name}</div>
        <div className={styles.item}>
          <span className={styles.label1}>性别：</span>
          <span className={styles.value}>{getLabel(sex, SEXES)}</span>
        </div>
        <div className={styles.item}>
          <span className={styles.label1}>SN：</span>
          <span className={styles.value}>{sn}</span>
        </div>
        <div className={styles.item}>
          <span className={styles.label1}>区域：</span>
          <span className={styles.value}>
            {section}
          </span>
        </div>
        <div className={styles.item}>
          <span className={styles.label1}>门禁卡号：</span>
          <span className={styles.value}>{cardNumber}</span>
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
      onClose,
    } = this.props;

    const title = <Fragment>生产区域人员统计<span className={styles.length}>(21人)</span></Fragment>
    const keyList = [{ label: '管理人员', num: 2 }, { label: '安全巡查人员', num: 2 }, { label: '管理人员', num: 2 },{ label: '管理人员', num: 2 }, { label: '安全巡查人员', num: 2 }, { label: '管理人员', num: 2 },{ label: '管理人员', num: 2 }, { label: '安全巡查人员', num: 2 }, { label: '管理人员', num: 2 }];
    const valueList = [
      { title: '管理人员', list: [{ id:0, user_name: '张三', sex: '0', sn: '1980001cc8', section: '库房', cardNumber: '27102' }, { id:1, user_name: '张三', sex: '1', sn: '1980001cc8', section: '库房', cardNumber: '27102' }] },
      { title: '安全巡查人员', list: [{ id:0, user_name: '张三', sex: '0', sn: '1980001cc8', section: '库房', cardNumber: '27102' }] },
    ];

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
