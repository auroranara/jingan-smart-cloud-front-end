import { PureComponent, Fragment } from 'react';
import { Tabs } from 'antd';
import DrawerContainer from '@/pages/BigPlatform/NewUnitFireControl/components/DrawerContainer';
import styles from './index.less';
import iconAlarm from '@/assets/icon-alarm.png';
// 储罐监测卡片
import { TankCard, ReservoirAreaCard, GasCard } from '@/pages/BigPlatform/ChemicalV2/components/MonitorCard';
import Divider from '@/pages/BigPlatform/ChemicalV2/components/Divider';
import { judgeEnum, envFunAreaEnum } from '@/utils/dict';
import emptyImg from '@/assets/empty_data.png';

const { TabPane } = Tabs;

const storageUrl = 'http://data.jingan-china.cn/v2/chem/screen/storage.png';
// const tabsOptions = [{ label: '储罐监测', key: '0' }, { label: '可燃气体', key: '1' }, { label: '有毒气体', key: '2' }];

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

  // 罐区基本信息卡片
  renderTankBaseInfo = ({
    areaName,
    location,
    environmentArea,
    spaceArea,
    hasCoffer,
    areaVolume,
    commonStore,
    warnStatus,
  }) => (
      <div className={styles.infoCard}>
        <img src={storageUrl} alt="img" />
        <div className={styles.content}>
          <p>{areaName}</p>
          <p><span>在厂区的位置：</span>{location}</p>
          <p><span>所处环境功能区：</span>{envFunAreaEnum[environmentArea]}</p>
          <p><span>储罐区面积（㎡）：</span>{spaceArea}</p>
          <p><span>有无围堰：</span>{judgeEnum[hasCoffer]}</p>
          <p><span>罐区总容积（m³）：</span>{areaVolume}</p>
          <p><span>常规储量（t）：</span>{commonStore}</p>
        </div>
        {+warnStatus !== 0 && (
          <div className={styles.iconAlarm} style={{ background: `url(${iconAlarm}) no-repeat center center / 100% 100%` }}></div>
        )}
      </div>
    )

  // 库区
  renderReservoirBaseInfo = ({
    name,
    position,
    environment,
    area,
    warnStatus,
  }) => (
      <div className={styles.infoCard}>
        <img src={storageUrl} alt="img" />
        <div className={styles.content}>
          <p>{name}</p>
          <p><span>在厂区的位置：</span>{position}</p>
          <p><span>所处环境功能区：</span>{envFunAreaEnum[environment]}</p>
          <p><span>库区面积（㎡）：</span>{area}</p>
        </div>
        {+warnStatus !== 0 && (
          <div className={styles.iconAlarm} style={{ background: `url(${iconAlarm}) no-repeat center center / 100% 100%` }}></div>
        )}
      </div>
    )

  // 监测情况统计
  renderStatistics = (tabs) => (
    <div className={styles.statistics}>
      {tabs.map(({ tab, warn, total }, index) => (
        <div key={index}>{tab}：<span>{warn}</span> / <span>{total}</span></div>
      ))}
    </div>
  )

  // 渲染监测情况tabs
  renderMonitorTabs = (tabs, onVideoClick) => (
    <Tabs activeKey={this.state.activeKey} animated={false} onChange={this.handleMonitorTabChange} renderTabBar={this.renderTabBar} size="small">
      {tabs.map(({ tab, dataSourse, ...res }, i) => (
        <TabPane tab={tab} key={i + ''}>
          {dataSourse.length ? dataSourse.map((item, index) => (
            <Fragment key={index}>
              {+this.state.activeKey === 0 && /罐区/.test(this.props.title) && (<TankCard data={item} onVideoClick={onVideoClick} {...res} />)}
              {+this.state.activeKey === 0 && /库区/.test(this.props.title) && (<ReservoirAreaCard data={item} onVideoClick={onVideoClick} {...res} />)}
              {[1, 2].includes(+this.state.activeKey) && (<GasCard data={item} onVideoClick={onVideoClick} {...res} />)}
              {index !== dataSourse.length - 1 && <Divider />}
            </Fragment>
          )) : (
              <div className={styles.emptyContent} style={{ background: `url(${emptyImg}) no-repeat center center / 50% 50%` }}></div>
            )}
        </TabPane>
      ))}
    </Tabs>
  )

  renderTabBar = (props) => {
    const { tabs } = this.props;
    return (
      <div className={styles.tabsContainer}>
        {tabs.map(({ tab }, index) => (
          <span
            className={+this.state.activeKey === index ? styles.activeTab : styles.tab}
            onClick={props.onChange ? () => props.onChange(index) : null}
            key={index}>
            {tab}
          </span>
        ))}
      </div>
    )
  }

  // 监测情况tab改变
  handleMonitorTabChange = (key) => {
    this.setState({ activeKey: key + '' })
    document.querySelector('.ant-tabs-content').scrollTo(0, 0);
  }

  renderContent = () => {
    const {
      title,
      data,
      tabs,
      onVideoClick,
    } = this.props;
    // TODO：
    const statisticsProps = tabs.map(({ dataSourse = [], ...res }) => ({
      ...res,
      total: dataSourse.length,
      warn: dataSourse.filter(item => item.warnStatus === -1).length,
    }));

    return (
      <div className={styles.areaMonitorDrawer}>
        {this.renderTitle('基本信息')}
        {/罐区/.test(title) && this.renderTankBaseInfo(data)}
        {/库区/.test(title) && this.renderReservoirBaseInfo(data)}
        {this.renderTitle('监测情况')}
        {this.renderStatistics(statisticsProps)}
        {this.renderMonitorTabs(tabs, onVideoClick)}
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
