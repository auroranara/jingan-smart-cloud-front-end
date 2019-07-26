import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import { connect } from 'dva';
import classNames from 'classnames';
import moment from 'moment';
import CustomDrawer from '@/jingan-components/CustomDrawer';
import CustomTabs from '@/jingan-components/CustomTabs';
import nameIcon from './assets/name.png';
import locationIcon from './assets/location.png';
import leakageCurrentIcon from './assets/leakage-current.png';
import temperatureIcon from './assets/temperature.png';
import currentIcon from './assets/current.png';
import voltageIcon from './assets/voltage.png';
import lossIcon from './assets/loss.png';
import styles from './index.less';

function formatTime (time) {
  const diff = moment().diff(moment(time));
  if (diff >= 2 * 24 * 60 * 60 * 1000) {
    return moment(time).format('YYYY-MM-DD HH:mm:ss');
  } else if (diff >= 24 * 60 * 60 * 1000) {
    return moment(time).format('昨日 HH:mm:ss');
  } else if (diff >= 60 * 60 * 1000) {
    return moment(time).format('今日 HH:mm:ss');
  } else if (diff >= 60 * 1000) {
    return `${moment.duration(diff).minutes()}分钟前`;
  } else {
    return '刚刚';
  }
}

function getParamStyle (name) {
  if (name === '漏电电流') {
    return { backgroundImage: `url(${leakageCurrentIcon})`, backgroundSize: '18px 15px' };
  } else if (name.includes('温度')) {
    return { backgroundImage: `url(${temperatureIcon})`, backgroundSize: '14px 19px' };
  } else if (name.includes('电流')) {
    return { backgroundImage: `url(${currentIcon})`, backgroundSize: '18px 18px' };
  } else if (name.includes('电压')) {
    return { backgroundImage: `url(${voltageIcon})`, backgroundSize: '18px 18px' };
  }
}

/* 电气火灾监测抽屉 */
@connect(({ gasStation }) => ({
  gasStation,
}))
export default class ElectricalFireMonitoringDrawer extends PureComponent {
  state = {
    activeKey: '报警',
  }

  componentDidUpdate({ visible: prevVisbile }) {
    const { visible, value } = this.props;
    if (!prevVisbile && visible) {
      this.handleTabClick(value);
    }
  }

  setScrollReference = (scroll) => {
    this.scroll = scroll && scroll.dom;
  }

  handleTabClick = (activeKey) => {
    this.setState({
      activeKey,
    });
    this.scroll && this.scroll.scrollTop();
  }

  handleJumpButtonClick = (data) => {
    const { onJump } = this.props;
    onJump && onJump(data);
  }

  renderCard = (data) => {
    const { activeKey } = this.state;
    const { id, location, updateTime, params } = data;
    let style, className;
    const rows = [
      {
        key: 'name',
        value: location,
        style: { backgroundImage: `url(${nameIcon})`, backgroundSize: '21px 19.5px' },
      },
      // {
      //   key: 'location',
      //   value: <span className={styles.location}>{location}</span>,
      //   style: { backgroundImage: `url(${locationIcon})`, backgroundSize: '15.5px 18px' },
      // },
    ];
    if (activeKey === '报警') {
      className = styles.enable;
      style = { borderColor: '#f83329' };
      let num = 0;
      for (let i = 0; i<params.length && num < 2; i++) {
        const { name, value, unit, normalMin, normalMax, status } = params[i];
        if (status > 0) {
          rows.push({
            key: name,
            value: <span><span className={styles.alarmColor}>{`${name}：${value}${unit}`}</span>{`(${value >= normalMax ? `≥${normalMax}` : `≤${normalMin}`}${unit})`}</span>,
            style: getParamStyle(name),
          });
          num++;
        }
      }
    } else if (activeKey === '失联') {
      style = { borderColor: '#9f9f9f' };
      rows.push({
        key: 'updateTime',
        value: formatTime(+updateTime),
        style: { backgroundImage: `url(${lossIcon})`, backgroundSize: '18px 14px' },
      });
    } else {
      className = styles.enable;
      style = { borderColor: '#00ffff' };
      for (let i = 0; i < 2; i++) {
        const { name, value, unit } = params[i];
        rows.push({
          key: name,
          value: `${name}：${isNaN(value) ? '--' : `${value}${unit}`}`,
          style: getParamStyle(name),
        });
      }
    }

    return (
      <div
        className={classNames(styles.card, className)}
        style={style}
        key={id}
        onClick={activeKey !== '失联' ? () => this.handleJumpButtonClick(data) : undefined}
      >
        {rows.map(({ key, value, style }) => (
          <div
            key={key}
            className={styles.cardRow}
          >
            <div className={styles.cardRowIcon} style={style} />
            <div className={styles.cardRowValue}>{value}</div>
          </div>
        ))}
        {activeKey !== '失联' && (
          <Icon
            type="right"
            className={styles.jumpButton}
          />
        )}
      </div>
    );
  }

  render() {
    const {
      visible,
      onClose,
      gasStation: {
        distributionBoxClassification: {
          alarm=[],
          loss=[],
          normal=[],
        }={},
      }={},
    } = this.props;
    const { activeKey } = this.state;
    const tabs = [
      {
        key: '报警',
        value: <span>报警<span className={styles.alarmCount}>({alarm.length})</span></span>,
      },
      {
        key: '失联',
        value: <span>失联<span className={styles.lossCount}>({loss.length})</span></span>,
      },
      {
        key: '正常',
        value: <span>正常<span className={styles.normalCount}>({normal.length})</span></span>,
      },
    ];
    const list = ({ 报警: alarm, 失联: loss, 正常: normal })[activeKey];

    return (
      <CustomDrawer
        title="电气火灾监测"
        visible={visible}
        onClose={onClose}
        sectionProps={{
          fixedContent: (
            <CustomTabs
              className={styles.tabs}
              data={tabs}
              activeKey={activeKey}
              onClick={this.handleTabClick}
            />
          ),
          scrollProps: {
            ref: this.setScrollReference,
          },
          spinProps: {
            // loading: !!loading,
            wrapperClassName: styles.spin,
          },
        }}
      >
        <div className={styles.container}>
          {list && list.map(this.renderCard)}
        </div>
      </CustomDrawer>
    );
  }
}
