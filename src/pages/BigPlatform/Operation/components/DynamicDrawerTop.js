import { Component, Fragment } from 'react';
import MsgRead from './MsgRead';
import moment from 'moment';
import styles from './DynamicDrawerTop.less'

import bakFlag from '@/assets/bac-flag.png'
import bakFlagFill from '@/assets/bac-flag-fill.png'
import cameraImg from '@/pages/BigPlatform/NewUnitFireControl/imgs/cameralogo.png'

const users = new Array(17).fill({
  id: '1',
  name: '张三丰',
});

const users2 = new Array(11).fill({
  id: '2',
  name: '张丰',
});
const getEmptyData = () => {
  return '暂无数据';
};

export default class DynamicDrawerTop extends Component {

  state = {
    showRepeatDesc: false,// 重复上报次数是否hover
  }

  // handleReadChange = (showReaded) => {
  //   this.setState({
  //     showReaded,
  //   })
  // }

  handleCameraClick = () => {
    const { onCameraClick } = this.props;
    onCameraClick && onCameraClick();
  }

  render() {
    const { showRepeatDesc } = this.state
    // console.log('headProps', this.props.headProps)
    const {
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
    } = this.props
    const scTime = moment(firstTime).format('YYYY-MM-DD HH:mm');
    const zjTime = moment(lastTime).format('YYYY-MM-DD HH:mm');
    return (
      <div className={styles.dynamicDrawerTop} style={style}>
        <div className={styles.companyInfoContainer}>
          <div className={styles.title}>{companyName}</div>

          {dynamicType === 0 && (
            <Fragment>
              <div className={styles.line}>详细位置：{install_address || getEmptyData()}</div>
              <div className={styles.line}>回路号：{component || getEmptyData()}</div>
              <div className={styles.line} style={{ marginBottom: 0 }}>部件类型：{unitTypeName || getEmptyData()}</div>
            </Fragment>
          )}
          {dynamicType === 1 && (
            <Fragment>
              {/* <div className={styles.line}>名称：{install_address||getEmptyData()}</div> */}
              <div className={styles.line}>所在区域：{area || getEmptyData()}</div>
              <div className={styles.line}>位置：{location || getEmptyData()}</div>
            </Fragment>
          )}
          {+num > 0 && (
            <div className={styles.logoContainer} style={{ top: 0, right: '24px' }}>
              <div
                className={styles.logo}
                style={{
                  backgroundImage: `url(${showRepeatDesc ? bakFlagFill : bakFlag})`,
                  backgroundSize: '100%',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                }}
                onMouseEnter={() => this.setState({ showRepeatDesc: true })}
                onMouseLeave={() => this.setState({ showRepeatDesc: false })}>
                <div>{num}</div>
              </div>
              <div className={styles.desc}>重复上报次数</div>
            </div>
          )}
          <div
            onClick={this.handleCameraClick}
            className={styles.cameraContainer}
            style={{
              top: '10px',
              right: '104px',
              backgroundImage: `url(${cameraImg})`,
              backgroundSize: '100%',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
            }}
          ></div>
          <div className={styles.repeatDesc} style={{ bottom: '16px', right: '22px', visibility: showRepeatDesc ? 'visible' : 'hidden' }}>
            <div>首次发生事件：{scTime}</div>
            <div>最近发生事件：{zjTime}</div>
          </div>
        </div>
        {/* <div className={styles.messageSendingContainer}>
          <div className={styles.topLine}>
            <span>报警消息已发送成功！</span>
            <span>共发送 12 人</span>
          </div>
          <MsgRead read={users} unread={users2} />
        </div> */}
      </div>
    )
  }
}
