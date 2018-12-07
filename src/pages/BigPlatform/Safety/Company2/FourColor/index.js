import React, { PureComponent } from 'react';
import { Select } from 'antd';
import classnames from 'classnames';
import MonitorBall from '@/components/MonitorBall';
import RiskImg from '../../Components/RiskImg';
import RiskImgPosition from '../../Components/RiskImgPosition';
import videoPointIcon from '../../img/videoPoint.png';

import styles from './index.less';
const { Option } = Select;


/**
 * description: 安全风险四色图
 * author: sunkai
 * date: 2018年12月02日
 */
export default class FourColor extends PureComponent {
  state = {
    // 当前选中的四色图源数据
    selectedFourColorImg: {},
    // 当前四色图上的点位列表
    points: [],
  }

  componentDidUpdate({ model: { companyMessage: { fourColorImg: prevFourColorImg } } }) {
    const { model: { companyMessage: { fourColorImg } } } = this.props;
    // 当四色图源数据更新后，默认获取第一个四色图作为初始值
    if (fourColorImg !== prevFourColorImg) {
      this.filterPointsBySelectedFourColorImg(fourColorImg[0] || {});
    }
  }

  /**
   * 设置选中的四色图并筛选出对应的点位
   */
  filterPointsBySelectedFourColorImg = (selectedFourColorImg) => {
    const { id } = selectedFourColorImg;
    const { selectedFourColorImg: { id: selectedFourColorImgId } } = this.state;
    // 如果新选中的四色图与原来的一致，则不做任何操作
    if (selectedFourColorImgId === id) {
      return;
    }
    const {
      model: {
        companyMessage: {
          point=[],
        },
      },
    } = this.props;
    this.setState({
      points: id ? point.filter(({ fixImgId }) => fixImgId === id) : [],
      selectedFourColorImg,
    });
  }

  /**
   * 下拉框选择事件
   */
  handleSelect = (id, { props: { data } }) => {
    console.log(data);
    this.filterPointsBySelectedFourColorImg(data);
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
          const { id, fileName = '未命名' } = item
          const isSelected = selectedFourColorImgId === id;
          return (
            <Option
              key={id}
              value={id}
              data={item}
              style={{ backgroundColor: isSelected && '#0967D3', color: isSelected && '#fff' }}
            >
              {fileName.split('.')[0]}
            </Option>
          );
        })}
      </Select>
    ) : null;
  }

  /**
   * 监控球
   */
  renderMonitorBall() {
    const {
      model: {
        // 监控球数据
        monitorData: { score = 0, count = 0, unnormal = 0 },
      },
      // 监控球数据是否正在加载中
      monitorDataLoading,
      // 监控球点击事件
      handleClickMonitorBall,
    } = this.props;
    // 当percent小于80或者报警时，显示异常颜色
    const color = +score < 80 || +unnormal > 0 ? '#ff7863' : '#00A8FF';
    // 当设备数为0时不显示监控球
    return +count !== 0 && !monitorDataLoading ? (
      <MonitorBall
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          zIndex: '9',
          boxShadow: `0 0 1em ${color}`,
        }}
        height={128}
        color={color}
        percent={score}
        title="安全监测"
        onClick={handleClickMonitorBall}
      />
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
      // 容器样式
      style,
      // 容器类名
      className,
      // 模型
      model: {
        // 视频列表
        videoList=[],
        // 风险点信息列表
        pointInfoList=[],
      },
    } = this.props;
    const { points, selectedFourColorImg: { webUrl } } = this.state;
    // 合并以后的容器类名
    const containerClassName = classnames(styles.container, className);
    // 红，橙，黄，蓝，未评级，视频计数
    let red = 0, orange = 0, yellow = 0, blue = 0, gray = 0, video = 0;

    return (
      <div style={style} className={containerClassName}>
        {/* 标题 */}
        <div className={styles.title}>安全风险四色图</div>
        {/* 下拉框 */}
        {this.renderSelect()}
        {/* 监控球 */}
        {this.renderMonitorBall()}
        {/* 四色图 */}
        <RiskImg
          src={webUrl}
        >
          {points.map(({ itemId, xNum, yNum }) => {
            return (
              <RiskImgPosition
                key={itemId}
                position={{ x: xNum, y: yNum }}
              >
                <div>123</div>
              </RiskImgPosition>
            );
          })}
        </RiskImg>
        {/* 图例 */}
        {this.renderLegend(red, orange, yellow, blue, gray, video)}
      </div>
    );
  }
}
