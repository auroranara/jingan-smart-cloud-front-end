import React, { PureComponent } from 'react';
import { Select } from 'antd';
import classnames from 'classnames';
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
  /**
   * 下拉框
   */
  renderSelect() {
    const {
      bigPlatform: {
        // 企业信息中获取四色图
        companyMessage: { fourColorImg = [] }={},
        // 视频列表
        videoList=[],
        // 风险点信息列表
        pointInfoList=[],
        // 监控球数据
        monitorData={},
      },
    } = this.props;
    const { selectedFourColorImgId } = this.state;
    return fourColorImg.length > 1 ? (
      <Select
        value={selectedFourColorImgId}
        onSelect={this.handleSelectFourColorImg}
        className={styles.fourColorImgSelect}
        style={{
          position: 'absolute',
          top: '16px',
          left: 0,
          width: 150,
        }}
        dropdownClassName={styles.fourColorImgSelectDropDown}
      >
        {fourColorImg.map(({ id, fileName = '未命名', webUrl }) => {
          const isSelected = selectedFourColorImgId === id;
          const i = fileName.indexOf('.');
          return (
            <Option
              key={id}
              value={id}
              url={webUrl}
              style={{ backgroundColor: isSelected && '#0967D3', color: isSelected && '#fff' }}
            >
              {i === -1 ? fileName : fileName.slice(0, i)}
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
      // 容器样式
      style,
      // 容器类名
      className,
      // 模型
      model: {
        companyMessage: {
          // 风险点列表
          point=[],
          // 四色图列表
          fourColorImg=[],
        },
      },
    } = this.props;
    // 合并以后的容器类名
    const containerClassName = classnames(styles.container, className);
    // 红，橙，黄，蓝，未评级，视频计数
    let red = 0, orange = 0, yellow = 0, blue = 0, gray = 0, video = 0;

    return (
      <div style={style} className={containerClassName}>
        {/* 标题 */}
        <div className={styles.title}>安全风险四色图</div>
        {/* 下拉框 */}
        {/* 监控球 */}
        {/* 四色图 */}
        <RiskImg
          src={this.props.src}
        >
          {point.map(({ itemId, xNum, yNum, fixImgId }) => {
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
