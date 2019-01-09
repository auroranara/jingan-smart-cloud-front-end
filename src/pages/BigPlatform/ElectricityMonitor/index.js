import React, { PureComponent } from 'react';
import { Input } from 'antd';
import { Map, Marker } from 'react-amap';
import BigPlatformLayout from '@/layouts/BigPlatformLayout';
import NewSection from '@/components/NewSection';
import headerBg from '@/assets/new-header-bg.png';
// 引入样式文件
import styles from './index.less';

const { Search } = Input

// 告警信息
const Message = function({  }) {
  return (
    <div className={styles.message}>

    </div>
  );
};

/**
 * description: 用电监测
 * author:
 * date: 2019年01月08日
 */
export default class ElectricityMonitor extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {

    };
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
   * 渲染
   */
  render() {

    return (
      <BigPlatformLayout
        title="晶安智慧用电监测平台"
        extra="无锡市"
        style={{ backgroundImage: 'none' }}
        headerStyle={{ position: 'absolute', top: 0, left: 0, width: '100%', fontSize: 16, zIndex: 9999, backgroundImage: `url(${headerBg})`, backgroundSize: '100% 100%' }}
        titleStyle={{ fontSize: 46 }}
        contentStyle={{ position: 'relative', height: '100%', zIndex: 0 }}
      >
        {/* 地图 */}
        <Map
          amapkey="665bd904a802559d49a33335f1e4aa0d"
          plugins={['Scale', { name: 'ToolBar', options: { locate: false } }]}
          // center={'无锡'}
          useAMapUI
        >
        </Map>
        {/* 搜索框 */}
        <Search placeholder="单位名称" enterButton="搜索" className={styles.left} style={{ top: 'calc(9.62963% + 24px)' }} />
        {/* 接入单位统计 */}
        <NewSection title="接入单位统计" className={styles.left} style={{ top: 'calc(9.62963% + 68px)', height: '13.611111%' }}>
        123
        </NewSection>
        {/* 实时报警统计 */}
        <NewSection title="实时报警统计" className={styles.left} style={{ top: 'calc(23.24% + 80px)', height: '21.944444%' }}>
        123
        </NewSection>
        {/* 近半年内告警统计 */}
        <NewSection title="近半年内告警统计" className={styles.left} style={{ top: 'calc(45.184444% + 92px)', height: '27.5926%' }}>
        123
        </NewSection>
        {/* 告警信息 */}
        <NewSection
          title="告警信息"
          className={styles.right}
          style={{ display: 'flex', flexDirection: 'column', height: 'auto', maxHeight: 'calc(91.37037% - 92px)' }}
          titleStyle={{ flex: 'none' }}
          contentStyle={{ flex: '1', display: 'flex', height: 'auto' }}
          scroll={{
            className: styles.scroll,
          }}
        >
          <div style={{ height: 800, backgroundColor: '#f28800' }}>这是一段很长的话这是一段很长的话这是一段很长的话这是一段很长的话</div>
        </NewSection>
      </BigPlatformLayout>
    );
  }
}
