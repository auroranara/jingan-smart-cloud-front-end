import { PureComponent } from 'react';
import { Tabs } from 'antd';
import DrawerContainer from '@/pages/BigPlatform/NewUnitFireControl/components/DrawerContainer';
import styles from './index.less';
import iconAlarm from '@/assets/icon-alarm.png';
// 储罐监测卡片
import { StorageCard, FlamCard, ToxicCard } from '@/pages/BigPlatform/ChemicalV2/components/MonitorCard';
import Divider from '@/pages/BigPlatform/ChemicalV2/components/Divider';

const { TabPane } = Tabs;

const storageUrl = 'http://data.jingan-china.cn/v2/chem/screen/storage.png';
const tabsOptions = [{ label: '储罐监测', key: '0' }, { label: '可燃气体', key: '1' }, { label: '有毒气体', key: '2' }];

export default class AreaMonitorDrawer extends PureComponent {

  constructor(props) {
    super(props);
    this.tabContainer = null;
    this.state = {
      activeKey: '0', // tabs当前key
    }
  }

  // 标题
  renderTitle = (title) => (
    <div className={styles.title}>{title}</div>
  )

  // 基本信息卡片
  renderBaseInfo = () => (
    <div className={styles.infoCard}>
      <img src={storageUrl} alt="img" />
      <div className={styles.content}>
        <p>溶剂罐区</p>
        <p><span>在厂区的位置：</span>东厂区储罐区域</p>
        <p><span>所处环境功能区：</span>一类区</p>
        <p><span>储罐区面积（㎡）：</span>1000</p>
        <p><span>有无围堰：</span>有</p>
        <p><span>罐区总容积（m³）：</span>500</p>
        <p><span>常规储量（t）：</span>60</p>
      </div>
      <div className={styles.iconAlarm} style={{ background: `url(${iconAlarm}) no-repeat center center / 100% 100%` }}></div>
    </div>
  )

  // 监测情况统计
  renderStatistics = () => (
    <div className={styles.statistics}>
      <div>储罐监测：<span>1</span> / <span>1</span></div>
      <div>可燃气体监测：<span>1</span> / <span>1</span></div>
      <div>有毒气体监测：<span>1</span> / <span>1</span></div>
    </div>
  )

  // 渲染监测情况tabs
  renderMonitorTabs = () => (
    <Tabs activeKey={this.state.activeKey} animated={false} onChange={this.handleMonitorTabChange} renderTabBar={this.renderTabBar} size="small">
      <TabPane tab="储罐监测" key="0">
        <StorageCard />
        <Divider />
        <StorageCard />
        <Divider />
        <StorageCard />
      </TabPane>
      <TabPane tab="可燃气体" key="1">
        <FlamCard />
        <Divider />
        <FlamCard />
        <Divider />
        <FlamCard />
      </TabPane>
      <TabPane tab="有毒气体" key="2">
        <ToxicCard />
      </TabPane>
    </Tabs>
  )

  renderTabBar = (props) => {
    return (
      <div className={styles.tabsContainer}>
        {tabsOptions.map(({ label, key }) => (
          <span
            className={this.state.activeKey === key ? styles.activeTab : styles.tab}
            onClick={props.onChange ? () => props.onChange(key) : null}
            key={key}>
            {label}
          </span>
        ))}
      </div>
    )
  }

  // 监测情况tab改变
  handleMonitorTabChange = (key) => {
    this.setState({ activeKey: key })
    document.querySelector('.ant-tabs-content').scrollTo(0, 0);
  }

  renderContent = () => {
    return (
      <div className={styles.areaMonitorDrawer}>
        {this.renderTitle('基本信息')}
        {this.renderBaseInfo()}
        {this.renderTitle('监测情况')}
        {this.renderStatistics()}
        {this.renderMonitorTabs()}
      </div>
    )
  }

  render () {
    const {
      visible,
      onClose,
      title,
    } = this.props;
    return (
      <DrawerContainer
        title={title}
        visible={visible}
        width={535}
        destroyOnClose={true}
        zIndex={1222}
        left={this.renderContent()}
        onClose={onClose}
        leftParStyle={{ overFlowY: 'auto' }}
      />
    )
  }
}
