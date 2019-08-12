import { Component, Fragment } from 'react';
import { Tooltip, Spin } from 'antd';
import MsgRead from './MsgRead';
import moment from 'moment';
import Ellipsis from '@/components/Ellipsis';
import styles from './DynamicDrawerTop.less';

import bakFlag from '@/assets/bac-flag.png';
import bakFlagFill from '@/assets/bac-flag-fill.png';
import cameraImg from '@/pages/BigPlatform/NewUnitFireControl/imgs/cameralogo.png';

// const users = new Array(17).fill({
//   id: '1',
//   name: '张三丰',
// });

// const users2 = new Array(11).fill({
//   id: '2',
//   name: '张丰',
// });
const getEmptyData = () => {
  return '暂无数据';
};

export default class DynamicDrawerTop extends Component {
  state = {
    showRepeatDesc: false, // 重复上报次数是否hover
  };

  // handleReadChange = (showReaded) => {
  //   this.setState({
  //     showReaded,
  //   })
  // }

  handleCameraClick = () => {
    const { onCameraClick } = this.props;
    onCameraClick && onCameraClick();
  };

  render() {
    // const { showRepeatDesc } = this.state;
    const {
      hideInfo,
      companyName = null,
      component = null, // 回路号
      unitTypeName = null, // 部件类型
      area = null, // 所在区域
      location = null, // 所在位置
      install_address = null, // 详细位置
      address, // 位置
      dynamicType,
      // flowRepeat = {},
      firstTime,
      lastTime,
      num,
      style = {},
      sdeviceName = null,
      videoList = [],
      // createCompanyName = null,
      work_order = null,
      systemTypeValue = null,
      label = null,
      component_region,
      component_no,
      installAddress,
      componentName,
      componentRegion,
      componentNo,
      read = [],
      unread = [],
      msgType = 0, // 0 报警 1 故障
      msgSendLoading = false,
    } = this.props;
    // const scTime = moment(firstTime).format('YYYY-MM-DD HH:mm');
    // const zjTime = moment(lastTime).format('YYYY-MM-DD HH:mm');

    const totalRead = read.length + unread.length;
    const componentNum =
      ((component_region || component_region === 0) &&
        `${component_region}回路${component_no}号`) ||
      ((componentRegion || componentRegion === 0) && `${componentRegion}回路${componentNo}号`);

    const repeatTitle = (
      <div className={styles.repeatTimes}>
        <div className={styles.times}>
          <span className={styles.label}>首次发生：</span>
          {moment(firstTime).format('YYYY-MM-DD HH:mm:ss')}
        </div>
        <div className={styles.times}>
          <span className={styles.label}>最近发生：</span>
          {moment(lastTime).format('YYYY-MM-DD HH:mm:ss')}
        </div>
      </div>
    );
    const repeat = +num > 1 ? (
      <div className={styles.logoContainer}>
        <Tooltip placement={'bottomRight'} title={repeatTitle} overlayStyle={{ zIndex: 2222 }}>
          <div className={styles.desc}>
            重复上报
            <span style={{ fontSize: '18px' }}>{num}</span>次
          </div>
        </Tooltip>
      </div>
    ) : null;
    return (
      <div className={styles.dynamicDrawerTop} style={style}>
        {!hideInfo && (
          <div
            className={styles.companyInfoContainer}
            style={{ minHeight: dynamicType === 3 ? 'auto' : '130px', borderBottom: totalRead ? 'none' : '1px solid #04fdff' }}
          >
            {companyName && <div className={styles.title}>{companyName}</div>}
            {/* 主机 */}
            {dynamicType === 0 && (
              <Fragment>
                <div className={styles.line}>
                  详细位置：
                  {install_address || installAddress || getEmptyData()}
                </div>
                <div className={styles.line}>
                  回路号：
                  {component || componentNum || getEmptyData()}
                </div>
                <div className={styles.line} style={{ marginBottom: 0 }}>
                  部件类型：
                  {unitTypeName || label || componentName || getEmptyData()}
                </div>
              </Fragment>
            )}
            {/* 烟感 */}
            {(dynamicType === 1 || dynamicType === 2) && (
              <Fragment>
                {sdeviceName && (
                  <div className={styles.line}>
                    名称：
                    {sdeviceName}
                  </div>
                )}
                <div
                  className={styles.line}
                  style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  <Tooltip
                    placement={'bottomLeft'}
                    title={`所在区域：${area || getEmptyData()}`}
                    overlayStyle={{ zIndex: 6666 }}
                  >
                    所在区域：
                    {area || getEmptyData()}
                  </Tooltip>
                </div>
                <div
                  className={styles.line}
                  style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  <Tooltip
                    placement={'bottomLeft'}
                    title={`位置：${location || getEmptyData()}`}
                    overlayStyle={{ zIndex: 6666 }}
                  >
                    位置：
                    {location || getEmptyData()}
                  </Tooltip>
                </div>
              </Fragment>
            )}
            {/* 一键报修 */}
            {dynamicType === 3 && (
              <Fragment>
                <div className={styles.line} style={{ width: '100%' }}>
                  报修系统：
                  {systemTypeValue || getEmptyData()}
                </div>
                <div className={styles.line} style={{ width: '100%' }}>
                  工单编号：
                  {work_order || getEmptyData()}
                </div>
              </Fragment>
            )}
            {/* 视频 */}
            {dynamicType !== 3 && videoList && videoList.length > 0 && (
              <div
                onClick={this.handleCameraClick}
                className={styles.cameraContainer}
                style={{
                  top: '10px',
                  right: '110px',
                  backgroundImage: `url(${cameraImg})`,
                  backgroundSize: '100%',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                }}
              />
            )}
          </div>
        )}
        {totalRead > 0 && (
          <div className={styles.messageSendingContainer}>
            <Spin spinning={msgSendLoading} wrapperClassName={styles.spin}>
              <div className={styles.topLine}>
                <span>
                  {(dynamicType === 3 && `报修`) ||
                    (msgType === 0 && `报警`) ||
                    (msgType === 1 && `故障`)}
                  消息已发送成功！
                  <span>(共发送 {totalRead} 人)</span>
                </span>
                {repeat}
              </div>
              <MsgRead read={read} unread={unread} />
            </Spin>
          </div>
        )}
      </div>
    );
  }
}
