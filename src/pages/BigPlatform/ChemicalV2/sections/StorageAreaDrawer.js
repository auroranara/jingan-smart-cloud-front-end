import React, { PureComponent, Fragment } from 'react';
import { Row, Col, Icon } from 'antd';
import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import SectionDrawer from '@/pages/BigPlatform/Safety/Company3/components/SectionDrawer';
import moment from 'moment';
// 引入样式文件
import styles from './StorageAreaDrawer.less';
import cameraImg from '@/pages/BigPlatform/Operation/imgs/camera.png';

export default class StorageAreaDrawer extends PureComponent {
  state = {};

  getOption = (value, title) => {
    const color = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
      {
        offset: 0,
        color: '#183E79', // 0% 处的颜色
      },
      {
        offset: 0.2,
        color: '#1F90FE', // 100% 处的颜色
      },
      {
        offset: 0.6,
        color: '#2C82E7', // 100% 处的颜色
      },
      {
        offset: 1,
        color: '#F01C07', // 100% 处的颜色
      },
    ]);
    const colorSet = [
      [1, color],
      // [0.91, color],
      // [1, '#FFF']
    ];
    const option = {
      title: {
        text: title,
        textStyle: {
          color: '#fff',
          fontSize: 14,
        },
        bottom: 25,
        left: 'center',
      },
      tooltip: {
        show: false,
        formatter: '{a} <br/>{b} : {c}%',
      },
      series: [
        {
          name: '浓度',
          type: 'gauge',
          axisLine: {
            show: true,
            lineStyle: {
              color: colorSet,
              width: 15,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              opacity: 1,
            },
          },
          splitLine: {
            show: true,
            length: 15,
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#c2c2c2',
            },
          },
          title: {
            show: true,
            textStyle: {
              color: '#c2c2c2',
            },
          },
          itemStyle: {
            color: value > 60 ? '#F83329' : '#1E90FF',
          },
          detail: {
            formatter: '{value}',
            textStyle: {
              color: value > 60 ? '#F83329' : '#fff',
              fontSize: 20,
            },
          },
          data: [{ value: value, name: 'mg/m³' }],
        },
      ],
    };
    return option;
  };

  render() {
    const { visible, onClose } = this.props;

    return (
      <SectionDrawer
        drawerProps={{
          title: '罐区监测',
          visible,
          onClose,
        }}
      >
        <div className={styles.top}>
          <div>
            <span className={styles.label}>罐区名称：</span>
            溶剂罐区
          </div>
          <div>
            <span className={styles.label}>存储物资：</span>
            甲醛、乙炔、一氧化碳
          </div>
          <div
            className={styles.video}
            style={{
              background: `url(${cameraImg}) center center / 100% 100% no-repeat`,
            }}
          />
        </div>

        <div className={styles.middle}>
          <div className={styles.point}>监测点：科力安可燃有毒气体88</div>
          <div className={styles.location}>
            <Icon type="environment" className={styles.icon} />
            罐区-溶剂罐区
          </div>
          <div className={styles.extra}>工单动态>></div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.title}>实时监测数据</div>
          <div className={styles.gaugeContainer}>
            <ReactEcharts
              option={this.getOption(68, '可燃气体浓度')}
              style={{ height: '100%', width: '100%' }}
              notMerge={true}
            />
            <div className={styles.tips}>
              <div className={styles.overVal}>
                <Icon type="caret-up" className={styles.icon} />
                26
              </div>
              超过预警阈值
            </div>
          </div>
          <div className={styles.gaugeContainer}>
            <ReactEcharts
              option={this.getOption(30, '有毒气体浓度')}
              style={{ height: '100%', width: '100%' }}
              notMerge={true}
            />
          </div>
          <div className={styles.extra}>监测趋势>></div>
        </div>
      </SectionDrawer>
    );
  }
}
