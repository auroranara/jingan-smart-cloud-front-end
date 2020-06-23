import React, { PureComponent, Fragment } from 'react';
import { Row, Col } from 'antd';

import SectionDrawer from '@/pages/BigPlatform/Safety/Company3/components/SectionDrawer';
import { getLabel, SEXES } from '@/pages/RoleAuthorization/AccountManagement/utils';
import styles from './SafetyOfficerDrawer.less';
import imgNoAvatar from '@/pages/BigPlatform/Gas/imgs/camera-bg.png';
import locationIcon from '../../imgs/location.png';

const rect = <span className={styles.rect} />;

function Card(props) {
  const { id, name, sex, entranceNumber, icnumber, photoDetails, handleLocatationClick } = props;
  const avatar = photoDetails && photoDetails.length ? photoDetails[0].webUrl : imgNoAvatar;

  return (
    <div className={styles.personList1} key={id}>
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
          <span className={styles.value}>{entranceNumber || '-'}</span>
        </div>
        <div className={styles.item}>
          <span className={styles.label1}>区域：</span>
          <span className={styles.value}>-</span>
        </div>
        <div className={styles.item}>
          <span className={styles.label1}>门禁卡号：</span>
          <span className={styles.value}>{icnumber || '-'}</span>
        </div>
      </div>
      {entranceNumber && (
        <span
          className={styles.locationIcon}
          style={{ backgroundImage: `url(${locationIcon})` }}
          onClick={e => handleLocatationClick && handleLocatationClick(entranceNumber)}
        />
      )}
    </div>
  );
}

function CardList(props) {
  const { title, list, handleLocatationClick } = props;
  // const list = [{}];

  return (
    <div>
      <h3 className={styles.cardTitle}>
        {rect}
        {title}
        <span className={styles.length}>
          ({list.length}
          人)
        </span>
      </h3>
      {list.map(item => (
        <Card key={item.id} handleLocatationClick={handleLocatationClick} {...item} />
      ))}
    </div>
  );
}

export default class ProductionOfficerDrawer extends PureComponent {
  state = {
    drawerWidth: 0,
  };
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
    const { drawerWidth } = this.state;
    let {
      visible,
      data: { keyList, valueList, total },
      handleLocatationClick,
      onClose,
      title: propsTitle,
    } = this.props;

    const title = (
      <Fragment>
        {propsTitle}
        <span className={styles.length}>
          ({total}
          人)
        </span>
      </Fragment>
    );

    return (
      <SectionDrawer
        drawerProps={{
          mask: false,
          width: visible ? 512 : drawerWidth,
          title,
          visible,
          onClose,
          afterVisibleChange: () => {
            // fix bug 10697, 弹窗遮罩问题
            if (!visible) this.setState({ drawerWidth: 0 });
            else this.setState({ drawerWidth: 512 });
          },
        }}
        sectionProps={{
          refScroll: this.refScroll,
        }}
      >
        <Row className={styles.personWrapper}>
          {Array.isArray(keyList) &&
            keyList.map(({ label, num }, index) => (
              <Col span={12} className={styles.person} key={index}>
                <div className={styles.personName}>{label}：</div>
                <div className={styles.personValue}>
                  {num || 0}
                  <span style={{ color: '#fff', marginLeft: 8 }}>人</span>
                </div>
              </Col>
            ))}
        </Row>
        <div className={styles.container}>
          {valueList.map(({ title, list }) => (
            <CardList
              key={title}
              title={title}
              list={list}
              handleLocatationClick={handleLocatationClick}
            />
          ))}
        </div>
      </SectionDrawer>
    );
  }
}
