import React, { PureComponent } from 'react';
import { Col } from 'antd';
import DrawerContainer from '../components/DrawerContainer';
import ImgSlider from '../components/ImgSlider';
import styles from './DrawerOfFireAlarm.less';

const getEmptyValue = () => {
  return <span style={{ color: 'rgba(255, 250, 250, 0.45)' }}>暂无数据</span>;
};

const isVague = false;
function nameToVague(str) {
  let newStr = '';
  if (str && str.length === 1) return str;
  else if (str && str.length === 2) {
    newStr = str.substr(0, 1) + '*';
  } else if (str && str.length > 2) {
    newStr = str.substr(0, 1) + '*' + str.substr(-1);
  } else return str;
  return newStr;
}

function phoneToVague(str) {
  if (!str) return str;
  const newStr = str.substr(0, 3) + '****' + str.substr(-4);
  return newStr;
}
export default class DrawerOfFireAlarm extends PureComponent {
  // 渲染运行良好和基本正常
  renderItem = (item, index) => {
    const {
      id,
      checkCompanyName,
      checkDate,
      checkUsers, // 检查人数组
      sysStatus,
      files,
    } = item;
    const picture = files.reduce((acc, item) => {
      if (/.jpg{1}$|.png{1}$/.test(item.webUrl)) {
        return [...acc, item.webUrl];
      } else return acc;
    }, []);
    return (
      <div className={styles.fireAlarmItem} key={index}>
        <div className={styles.line}>
          <div className={styles.label}>
            <span>维保单位：</span>
          </div>
          <div className={styles.value}>
            <span>{checkCompanyName || getEmptyValue()}</span>
          </div>
        </div>
        <div className={styles.line}>
          <div className={styles.label}>
            <span>维保时间：</span>
          </div>
          <div className={styles.value}>
            <span>{checkDate || getEmptyValue()}</span>
          </div>
        </div>
        <div className={styles.line}>
          <div className={styles.label}>
            <span>维保人员：</span>
          </div>
          <div className={styles.listValue}>
            {checkUsers && checkUsers.length > 0
              ? checkUsers.map(({ userName, phoneNumber }, i) => (
                  <Col key={i} span={12}>
                    <span>{`${isVague ? nameToVague(userName) : userName} ${
                      isVague ? phoneToVague(phoneNumber) : phoneNumber
                    }`}</span>
                  </Col>
                ))
              : getEmptyValue()}
          </div>
        </div>
        {picture &&
          picture.length > 0 && (
            <div className={styles.imageLine}>
              <div className={styles.label}>
                <span>附件：</span>
              </div>
              <div className={styles.images}>
                <ImgSlider height={120} picture={picture} />
              </div>
            </div>
          )}
        <div className={+sysStatus === 2 ? styles.normalLogo : styles.goodLogo}>
          <span>{+sysStatus === 2 ? '基本正常' : '运行良好'}</span>
        </div>
      </div>
    );
  };

  renderLine = (label, value) => {
    return (
      <div className={styles.line}>
        <div className={styles.label}>
          <span>{label}</span>
        </div>
        <div className={styles.value}>
          <span>{value || getEmptyValue()}</span>
        </div>
      </div>
    );
  };

  render() {
    const { onClose, visible, list, pagination, title } = this.props;

    return (
      <DrawerContainer
        title={title}
        visible={visible}
        onClose={onClose}
        width={470}
        destroyOnClose={true}
        left={
          <div className={styles.drawerOfFireAlarm}>
            {list.map((item, index) => {
              const {
                sysStatus,
                checkCompanyName,
                checkDate,
                checkUsers,
                files, // 附件数组
                evaluate,
                opinion,
              } = item;
              const picture = files.reduce((acc, item) => {
                if (/.jpg{1}$|.png{1}$/.test(item.webUrl)) {
                  return [...acc, item.webUrl];
                } else return acc;
              }, []);
              // 1 error 2  normal 3 fine
              if (+sysStatus === 1) {
                return (
                  <div className={styles.fireAlarmItem} key={index}>
                    {this.renderLine('维保单位：', checkCompanyName)}
                    {this.renderLine('维保时间：', checkDate)}
                    <div className={styles.line}>
                      <div className={styles.label}>
                        <span>维保人员：</span>
                      </div>
                      <div className={styles.listValue}>
                        {checkUsers && checkUsers.length > 0
                          ? checkUsers.map(({ userName, phoneNumber }, i) => (
                              <Col key={i} span={12}>
                                <span>{`${isVague ? nameToVague(userName) : userName} ${
                                  isVague ? phoneToVague(phoneNumber) : phoneNumber
                                }`}</span>
                              </Col>
                            ))
                          : getEmptyValue()}
                      </div>
                    </div>
                    {this.renderLine('综合评价：', evaluate)}
                    {this.renderLine('整改意见：', opinion)}
                    {picture &&
                      picture.length > 0 && (
                        <div className={styles.imageLine}>
                          <div className={styles.label}>
                            <span>附件：</span>
                          </div>
                          <div className={styles.images}>
                            <ImgSlider height={120} picture={picture} />
                          </div>
                        </div>
                      )}
                    <div className={styles.errorLogo}>
                      <span>存在问题</span>
                    </div>
                  </div>
                );
              } else if (+sysStatus === 2) {
                return this.renderItem(item, index);
              } else if (+sysStatus === 3) {
                return this.renderItem(item, index);
              } else return null;
            })}
          </div>
        }
      />
    );
  }
}
