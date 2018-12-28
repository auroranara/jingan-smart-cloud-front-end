import React, { PureComponent } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import Section from '@/pages/BigPlatform/NewUnitFireControl/Section';
import pendingIcon from '@/assets/pending.png';
import cameraIcon from '../../imgs/camera.png';
import styles from './index.less';

// 根据状态获取图片
const statusIcon = {
  '1': pendingIcon,
  '2': '已处理',
};

// 根据类型获取文本
const typeLabel = {
  '1': '越界',
  '2': 'SOS求助',
  '3': '超员',
  '4': '缺员',
  '5': '长时间静止',
};

// 报警
const Alarm = function({
  data,
  onClick,
  handleShowVideo,
}) {
  const { id, cardId, info, type, time, status } = data;

  return (
    <div className={styles.alarm}>
      <div className={styles.alarmItem} onClick={() => { onClick(type, cardId); }}>
        <div className={styles.itemLine}>
          <div className={styles.label}>报警信息：</div>
          <div className={styles.value}>{info}</div>
        </div>
        <div className={styles.itemLine}>
          <div className={styles.label}>报警类型：</div>
          <div className={styles.value}>{typeLabel[type]}</div>
        </div>
        <div className={styles.itemLine}>
          <div className={styles.label}>报警时间：</div>
          <div className={styles.value}>{time}</div>
        </div>
        <div className={styles.icon} style={{ backgroundImage: `url(${statusIcon[status]})` }} />
        <span className={styles.camera}
          style={{ backgroundImage: `url(${cameraIcon})` }}
          onClick={e => {
            e.stopPropagation();
            handleShowVideo();
          }}
        />
      </div>
    </div>
  );
}

/**
 * description: 报警查看
 * author: sunkai
 * date: 2018年12月26日
 */
export default class AlarmView extends PureComponent {
  // 组件内仓库
  state = {

  }

  /**
   * 挂载后
   */
  componentDidMount() {

  }

  /**
   * 更新后
   */
  componentDidUpdate() {

  }

  /**
   * 销毁前
   */
  componentWillUnmount() {

  }

  /**
   * 修改滚动条颜色
   */
  renderThumb({ style, ...props }) {
    const thumbStyle = {
      backgroundColor: `rgba(9, 103, 211, 0.5)`,
      borderRadius: '10px',
    };
    return (
      <div
        style={{ ...style, ...thumbStyle }}
        {...props}
      />
    );
  }

  /**
   * 渲染
   */
  render() {
    const {
      // 容器类名
      className,
      // 容器样式
      style,
      // 数据源
      data=[
        {
          id: 1,
          info: '东厂区建筑物A',
          type: 1,
          time: '2018-12-25 12:00:00',
          status: 1,
        },
        {
          id: 2,
          info: '东厂区建筑物A',
          type: 2,
          time: '2018-12-25 12:00:00',
          status: 1,
        },
        {
          id: 3,
          info: '东厂区建筑物A',
          type: 3,
          time: '2018-12-25 12:00:00',
          status: 1,
        },
      ],
      // 点击事件
      onClick,
      handleShowVideo,
    } = this.props;

    return (
      <Section
        className={className?`${styles.container} ${className}`:styles.container}
        style={style}
        title="报警查看"
        contentStyle={{ padding: '16px 0' }}
      >
        <Scrollbars style={{ width: '100%', height: '100%' }} renderThumbHorizontal={this.renderThumb} renderThumbVertical={this.renderThumb}>
          {data.map(item => (
            <Alarm key={item.id} data={item} onClick={onClick} handleShowVideo={handleShowVideo} />
          ))}
        </Scrollbars>
      </Section>
    );
  }
}
