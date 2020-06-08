import React, { PureComponent } from 'react';
import { Row, Col, Tooltip } from 'antd';
import { connect } from 'dva';

import SectionDrawer from '@/pages/BigPlatform/Safety/Company3/components/SectionDrawer';
import { getLabel, SEXES, DEGREES } from '@/pages/RoleAuthorization/AccountManagement/utils';
import styles from './SafetyOfficerDrawer.less';
import EduIcon from '../../imgs/eduIcon.png';
import RegisterEnginIcon from '../../imgs/registerEnginIcon.png';
import imgNoAvatar from '@/pages/BigPlatform/Gas/imgs/camera-bg.png';

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

  /**
   * 生成年龄
   * @param {number} time 出生日期时间戳
   **/
  generateAge = time => (time ? new Date().getYear() - new Date(time).getYear() : '-');

  render() {
    let {
      // 抽屉是否可见
      visible,
      // 数据
      // unitSafety: { safetyOfficer: { keyList = [], valueList = [] } = {}, phoneVisible },
      // 抽屉关闭事件
      onClose,
      handleClickImgShow,
      unitSafety: {
        safetyOfficer: { keyList, valueList },
      },
    } = this.props;

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
            keyList.map((item, index) => (
              <Col span={12} className={styles.person} key={index}>
                <div className={styles.personName}>{item}</div>
                <div className={styles.personValue}>{valueList[index].length || 0}</div>
              </Col>
            ))}
        </Row>
        <div className={styles.container}>
          {valueList.reduce((all, val) => [...all, ...val], []).map(item => {
            const {
              id,
              role_name,
              education, // 学历
              major, // 专业
              user_name,
              sex,
              birth,
              phone_number,
              safetyFile,
              educationFileList,
              avatarFileList, // 头像
            } = item;
            const avatar =
              avatarFileList && avatarFileList.length ? avatarFileList[0].webUrl : imgNoAvatar;
            return (
              <div className={styles.personList} key={id}>
                <div className={styles.left}>
                  <img src={avatar} alt="avatar" />
                </div>
                <div className={styles.middle}>
                  <div className={styles.name}>{user_name}</div>
                  <div className={styles.item}>
                    <span className={styles.label}>性别：</span>
                    <span className={styles.value}>{getLabel(sex, SEXES)}</span>
                  </div>
                  <div className={styles.item}>
                    <span className={styles.label}>年龄：</span>
                    <span className={styles.value}>{this.generateAge(birth)}</span>
                  </div>
                  <div className={styles.item}>
                    <span className={styles.label}>手机号码：</span>
                    <span className={styles.value}>
                      {phone_number ? phone_number.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : '-'}
                    </span>
                  </div>
                  <div className={styles.item}>
                    <span className={styles.label}>学历：</span>
                    <span className={styles.value}>{getLabel(education, DEGREES)}</span>
                  </div>
                  <div className={styles.item}>
                    <span className={styles.label}>专业：</span>
                    <span className={styles.value}>{major || '-'}</span>
                  </div>
                </div>
                <div className={styles.right}>
                  <div className={styles.sign}>
                    <span className={styles.signName}>{role_name}</span>
                  </div>
                  <div className={styles.iconBtn}>
                    {educationFileList &&
                      educationFileList.length > 0 && (
                        <Tooltip title="学历证书">
                          <div
                            className={styles.icon}
                            style={{
                              background: `url(${EduIcon}) no-repeat center bottom`,
                              backgroundSize: '100% 100%',
                            }}
                            onClick={() =>
                              handleClickImgShow(educationFileList.map(item => item.webUrl))
                            }
                          />
                        </Tooltip>
                      )}
                    {safetyFile &&
                      safetyFile.length > 0 && (
                        <Tooltip title="注册安全工程师">
                          <div
                            className={styles.icon}
                            style={{
                              background: `url(${RegisterEnginIcon}) no-repeat center bottom`,
                              backgroundSize: '100%  100%',
                            }}
                            onClick={() => handleClickImgShow(safetyFile.map(item => item.webUrl))}
                          />
                        </Tooltip>
                      )}
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
