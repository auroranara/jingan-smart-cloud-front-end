import React from 'react';
import { Icon } from 'antd';
import BigPlatformCard from '../BigPlatformCard';
import videoCameraIcon from '@/assets/videoCamera.png';
import alarmIcon from '@/assets/icon-alarm2.png';
import lossIcon from '@/assets/icon-loss.png';
// 引入样式文件
import styles from './index.less';
const { Container } = BigPlatformCard;

// 温湿度监测点卡片
export default class HumiturePointCard extends BigPlatformCard {
  FIELDNAMES = {
    name: 'name', // 点位名称
    temperature: 'temperature', // 当前温度
    minTemperature: 'minTemperature', // 最小温度
    maxTemperature: 'maxTemperature', // 最大温度
    humidity: 'humidity', // 当前湿度
    minHumidity: 'minHumidity', // 最小湿度
    maxHumidity: 'maxHumidity', // 最大湿度
    area: 'area', // 所在区域
    location: 'location', // 所在位置
    status: 'status', // 状态
    videoList: 'videoList', // 视频列表
  };

  FIELDS = [
    {
      label: '当前温度',
      render: ({ temperature, minTemperature, maxTemperature }) => temperature != undefined && ( // eslint-disable-line
        <span>
          {`${temperature}℃`}
          {(minTemperature != undefined || maxTemperature != undefined) && ( // eslint-disable-line
            <span className={styles.range}>{`（${minTemperature != undefined ? `${minTemperature}℃` : '?'} ~ ${maxTemperature != undefined ? `${maxTemperature}℃` : '?'}）`/*eslint-disable-line*/}</span>
          )}
        </span>
      ),
      className: styles.row,
    },
    {
      label: '当前湿度',
      render: ({ humidity, minHumidity, maxHumidity }) => humidity != undefined && ( // eslint-disable-line
        <span>
          {`${humidity}%`}
          {(minHumidity != undefined || maxHumidity != undefined) && ( // eslint-disable-line
            <span className={styles.range}>{`（${minHumidity != undefined ? `${minHumidity}%` : '?'} ~ ${maxHumidity != undefined ? `${maxHumidity}%` : '?'}）`/*eslint-disable-line*/}</span>
          )}
        </span>
      ),
      className: styles.row,
    },
    {
      label: '所在区域',
      key: 'area',
      className: styles.row,
    },
    {
      label: '所在位置',
      key: 'location',
      className: styles.row,
    },
  ];

  handleClick = () => {
    const { onClick, data } = this.props;
    onClick && onClick(data);
  }

  renderStatus = (status) => {
    if (+status === 2) {
      return <span className={styles.alarmIcon} style={{ backgroundImage: `url(${alarmIcon})` }}>报警</span>
    } else if (+status === 3) {
      return <span className={styles.lossIcon} style={{ backgroundImage: `url(${lossIcon})` }}>失联</span>
    }
  }

  render() {
    const {
      className, // 容器类名
      style, // 容器样式
      onVideoClick,
    } = this.props;
    const fieldsValue = this.getFieldsValue();
    const { name, status, videoList } = fieldsValue;

    return (
      <Container className={className} style={style}>
        <div className={styles.title}>{name}</div>
        {Array.isArray(videoList) && videoList.length > 0 && <div className={styles.video} style={{ backgroundImage: `url(${videoCameraIcon})` }} onClick={() => onVideoClick(videoList)} />}
        <Icon type="right" className={styles.arrow} onClick={this.handleClick} />
        {this.renderStatus(status)}
        {this.renderFields(fieldsValue)}
      </Container>
    );
  }
}
