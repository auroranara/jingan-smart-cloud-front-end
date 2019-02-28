import React, { PureComponent, Fragment } from 'react';
import { Select, Tooltip } from 'antd';
import moment from 'moment';
import Section from '../Section';
import videoPointIcon from '@/assets/videoPoint.png';
import gray from '@/assets/gray_new.png';
import exceptionGray from '@/assets/exception_gray.png';
// 引入样式文件
import styles from './index.less';
const { Option } = Select;

/* 图片地址前缀 */
const iconPrefix = 'http://data.jingan-china.cn/v2/big-platform/safety/com/';
/* 图片 */
const red = `${iconPrefix}red_new.png`;
const orange = `${iconPrefix}orange_new.png`;
const yellow = `${iconPrefix}yellow_new.png`;
const blue = `${iconPrefix}blue_new.png`;
const exceptionRed = `${iconPrefix}exception_red.png`;
const exceptionOrange = `${iconPrefix}exception_orange.png`;
const exceptionYellow = `${iconPrefix}exception_yellow.png`;
const exceptionBlue = `${iconPrefix}exception_blue.png`;

// 获取状态文本
const getStatusLabel = status => {
  switch (+status) {
    case 1:
    return <span style={{ color: '#fff' }}>正常</span>;
    case 2:
    return <span style={{ color: '#FF4848' }}>异常</span>;
    case 3:
    return <span style={{ color: '#fff' }}>待检查</span>;
    case 4:
    return <span style={{ color: '#FF4848' }}>已超时</span>;
    default:
    return '';
  }
};
/**
 * 根据颜色筛选图片
 */
const getIconByColor = ({ risk_level, originalStatus }={}) => {
  if (+originalStatus === 2) {
    switch (+risk_level) {
      case 1:
        return exceptionRed;
      case 2:
        return exceptionOrange;
      case 3:
        return exceptionYellow;
      case 4:
        return exceptionBlue;
      default:
        return exceptionGray;
    }
  } else {
    switch (+risk_level) {
      case 1:
        return red;
      case 2:
        return orange;
      case 3:
        return yellow;
      case 4:
        return blue;
      default:
        return gray;
    }
  }
};

/**
 * description: 安全风险四色图
 */
export default class FourColor extends PureComponent {
  state = {
    // 当前选中的四色图源数据
    selectedFourColorImg: {},
    // 当前四色图上的点位列表
    points: [],
    // 当前四色图上的视频列表
    videos: [],
  }

  componentDidUpdate({ model: { companyMessage: { fourColorImg: prevFourColorImg } } }) {
    const { model: { companyMessage: { fourColorImg } } } = this.props;
    // 当四色图源数据更新后，默认获取第一个四色图作为初始值
    if (fourColorImg !== prevFourColorImg) {
      this.changeSelectedFourColorImg(fourColorImg[0] || {});
    }
  }

  /**
   * 设置选中的四色图并筛选出对应的点位和视频
   */
  changeSelectedFourColorImg = (selectedFourColorImg) => {
    const { id } = selectedFourColorImg;
    const { selectedFourColorImg: { id: selectedFourColorImgId } } = this.state;
    // 如果新选中的四色图与原来的一致，则不做任何操作
    if (selectedFourColorImgId === id) {
      return;
    }
    const {
      model: {
        points: { fourColorImgPoints },
        videoList=[],
      },
    } = this.props;
    // 更新选中的四色图和对应视频列表
    this.setState({
      videos: videoList.filter(({ fix_img_id }) => fix_img_id === id),
      points: fourColorImgPoints[id] || [],
      selectedFourColorImg,
    });
  }

  /**
   * 下拉框选择事件
   */
  handleSelect = (id, { props: { data } }) => {
    this.changeSelectedFourColorImg(data);
  }

  /**
   * 下拉框
   */
  renderSelect() {
    const {
      model: {
        // 企业信息中获取四色图
        companyMessage: { fourColorImg = [] }={},
      },
    } = this.props;
    //  从state中获取当前选中的四色图id
    const { selectedFourColorImg: { id: selectedFourColorImgId } } = this.state;
    // 当四色图的数量大于1时才显示下拉框
    return fourColorImg.length > 1 ? (
      <Select
        value={selectedFourColorImgId}
        onSelect={this.handleSelect}
        className={styles.fourColorImgSelect}
        dropdownClassName={styles.fourColorImgSelectDropDown}
      >
        {fourColorImg.map(item => {
          const { id, fileName = '未命名' } = item;
          const isSelected = selectedFourColorImgId === id;
          return (
            <Option
              key={id}
              value={id}
              data={item}
              style={{ color: isSelected && '#00ffff' }}
            >
              {fileName.split('.')[0]}
            </Option>
          );
        })}
      </Select>
    ) : null;
  }

  /**
   * 图例
   */
  renderLegend(red, orange, yellow, blue, gray, video) {
    return (
      <div className={styles.legendContainer}>
        {red > 0 && (
          <div className={styles.legend}>
            <span
              className={styles.legendIcon}
              style={{ backgroundColor: '#FC1F02' }}
            />
            <span>重大风险</span>
          </div>
        )}
        {orange > 0 && (
          <div className={styles.legend}>
            <span
              className={styles.legendIcon}
              style={{ backgroundColor: '#F17A0A' }}
            />
            <span>较大风险</span>
          </div>
        )}
        {yellow > 0 && (
          <div className={styles.legend}>
            <span
              className={styles.legendIcon}
              style={{ backgroundColor: '#FBF719' }}
            />
            <span>一般风险</span>
          </div>
        )}
        {blue > 0 && (
          <div className={styles.legend}>
            <span
              className={styles.legendIcon}
              style={{ backgroundColor: '#1E60FF' }}
            />
            <span>低风险</span>
          </div>
        )}
        {gray > 0 && (
          <div className={styles.legend}>
            <span
              className={styles.legendIcon}
              style={{ backgroundColor: '#4E6693' }}
            />
            <span>风险点</span>
          </div>
        )}
        {video > 0 && (
          <div className={styles.legend}>
            <span
              className={styles.legendIcon}
              style={{
                backgroundImage: `url(${videoPointIcon})`,
                boxShadow: 'none',
                border: 'none',
              }}
            />
            <span>视频监控</span>
          </div>
        )}
      </div>
    );
  }

  render() {
    const {
      // 点击视频
      handleClickVideo,
      // 点击点位
      handleClickPoint,
    } = this.props;
    const { points, videos, selectedFourColorImg: { webUrl } } = this.state;
    // 红，橙，黄，蓝，未评级，视频计数
    let red = 0, orange = 0, yellow = 0, blue = 0, gray = 0;

    return (
      <Section title="安全点位图" action={this.renderSelect()}>
        <div className={styles.container}>
          {/* 四色图 */}
          <div className={styles.fourColorImage} style={{ backgroundImage: `url(${webUrl || 'http://data.jingan-china.cn/v2/big-platform/safety/com/default_four_color.png'})` }}>
            {points.map(({ itemId, xNum, yNum, info }) => {
              const { object_title, originalStatus, status, risk_level, user_name, last_check_date } = info || {};
              // 如果风险告知卡存在，则判断颜色并统计数量，否则默认为灰色
              switch (+risk_level) {
                case 1:
                  red++;
                  break;
                case 2:
                  orange++;
                  break;
                case 3:
                  yellow++;
                  break;
                case 4:
                  blue++;
                  break;
                default:
                  gray++;
                  break;
              }
              return (
                <Tooltip
                  key={itemId}
                  overlayClassName={styles.tooltip}
                  placement={xNum > 0.5 ? 'left': 'right'}
                  title={info ? (
                    <Fragment>
                      <div>{object_title}</div>
                      <div>有无隐患：{+originalStatus === 2 ? <span style={{ color: '#ff4848' }}>有隐患</span> : '无隐患'}</div>
                      <div>检查状态：{getStatusLabel(status)}</div>
                      <div>最近巡查：{user_name} {last_check_date && moment(last_check_date).format('YYYY-MM-DD')}</div>
                    </Fragment>
                  ) : <div style={{ textAlign: 'center' }}>暂无信息</div>}
                >
                  <div
                    key={itemId}
                    className={styles.point}
                    style={{
                      left: `${xNum * 100}%`,
                      bottom: `${(1 - yNum) * 100}%`,
                      width: 32,
                      height: 35,
                      backgroundImage: `url(${getIconByColor(info)})`,
                    }}
                    onClick={() => {handleClickPoint(itemId);}}
                  />
                </Tooltip>
              );
            })}
            {videos.map(({ id, name, key_id: keyId, x_num, y_num }) => {
              return (
                <Tooltip key={id} overlayClassName={styles.tooltip} placement="top" title={name}>
                  <div
                    className={styles.point}
                    style={{
                      left: `${x_num * 100}%`,
                      bottom: `${(1 - y_num) * 100}%`,
                      width: 36,
                      height: 36,
                      backgroundImage: `url(${videoPointIcon})`,
                      borderRadius: '50%',
                      boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.35)',
                    }}
                    onClick={() => {handleClickVideo(keyId);}}
                  />
                </Tooltip>
              );
            })}
          </div>
          {/* 图例 */}
          {this.renderLegend(red, orange, yellow, blue, gray, videos.length)}
        </div>
      </Section>
    );
  }
}
