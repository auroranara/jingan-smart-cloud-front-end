import React, { PureComponent } from 'react';
import { Row, Col, Tooltip } from 'antd';
import { connect } from 'dva';
import SectionDrawer from '@/pages/BigPlatform/Safety/Company3/components/SectionDrawer';
import { KeyList, ValueList, PersonList } from '../utils';
// 引入样式文件
import styles from './SafetyOfficerDrawer.less';
import EduIcon from '../imgs/eduIcon.png';
import PersonSafety from '../imgs/personSafety.png';
import RegisterEnginIcon from '../imgs/registerEnginIcon.png';

// const borderColorList = ['#FF4848', '#C6C181', '#00A8FF', '#0967D3'];

/**
 * 安全人员抽屉
 */
@connect(({ unitSafety }) => ({
  unitSafety,
}))
export default class SafetyOfficerDrawer extends PureComponent {
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
      // 抽屉是否可见
      visible,
      // 数据
      // unitSafety: { safetyOfficer: { keyList = [], valueList = [] } = {}, phoneVisible },
      // 抽屉关闭事件
      onClose,
      handleClickImgShow,
    } = this.props;

    const {
      // phoneVisible = true,
      keyList = KeyList,
      personList = PersonList,
      // valueList = ValueList,
    } = {};

    return (
      <SectionDrawer
        drawerProps={{
          title: '安全人员',
          visible,
          onClose,
        }}
        sectionProps={{
          refScroll: this.refScroll,
        }}
      >
        <Row className={styles.personWrapper}>
          {keyList &&
            keyList.map(({ label, value, key }) => (
              <Col span={12} className={styles.person} key={key}>
                <div className={styles.personName}>{label}</div>
                <div className={styles.personValue}>{value}</div>
              </Col>
            ))}
        </Row>
        <div className={styles.container}>
          {personList.map(item => {
            const { id, name, sex, age, phone, education, work, sign, eduPic, enginPic } = item;
            return (
              <div className={styles.personList} key={id}>
                <div
                  className={styles.left}
                  style={{
                    background: `url(${PersonSafety}) no-repeat center center`,
                    backgroundSize: '77% 65% ',
                  }}
                />
                <div className={styles.middle}>
                  <div className={styles.name}>{name}</div>
                  <div className={styles.item}>
                    <span className={styles.label}>性别：</span>
                    <span className={styles.value}>{sex}</span>
                  </div>
                  <div className={styles.item}>
                    <span className={styles.label}>年龄：</span>
                    <span className={styles.value}>{age}</span>
                  </div>
                  <div className={styles.item}>
                    <span className={styles.label}>手机号码：</span>
                    <span className={styles.value}>
                      {phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
                    </span>
                  </div>
                  <div className={styles.item}>
                    <span className={styles.label}>学历：</span>
                    <span className={styles.value}>{education}</span>
                  </div>
                  <div className={styles.item}>
                    <span className={styles.label}>专业：</span>
                    <span className={styles.value}>{work}</span>
                  </div>
                </div>
                <div className={styles.right}>
                  <div className={styles.sign}>
                    <span className={styles.signName}>{sign}</span>
                  </div>
                  <div className={styles.iconBtn}>
                    <Tooltip title="学历证书">
                      <div
                        className={styles.icon}
                        style={{
                          background: `url(${EduIcon}) no-repeat center bottom`,
                          backgroundSize: '48% 95%',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleClickImgShow([eduPic])}
                      />
                    </Tooltip>
                    <Tooltip title="注册安全工程师">
                      <div
                        className={styles.icon}
                        style={{
                          background: `url(${RegisterEnginIcon}) no-repeat center bottom`,
                          backgroundSize: '48%  95%',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleClickImgShow([enginPic])}
                      />
                    </Tooltip>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* <div className={styles.container}>
          {valueList &&
            valueList.map((value, index) => (
              <div
                className={styles.personList}
                style={{ borderColor: borderColorList[index % 4] }}
                key={keyList[index]}
              >
                <div className={styles.personLabel}>{keyList[index]}</div>
                {value.map(({ id, user_name: name, phone_number: phone }) => (
                  <div className={styles.personItem} key={id}>
                    <div className={styles.personItemName}>{name}</div>
                    <div className={styles.personItemPhone}>
                      {phoneVisible || !phone
                        ? phone
                        : `${phone}`.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
                    </div>
                  </div>
                ))}
              </div>
            ))}
        </div> */}
      </SectionDrawer>
    );
  }
}
