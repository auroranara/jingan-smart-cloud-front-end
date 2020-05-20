import React, { PureComponent, Fragment } from 'react';
import DrawerContainer from '@/pages/BigPlatform/NewUnitFireControl/components/DrawerContainer';
import styles from './DangerSourceInfoDrawer.less';
import { CardItem } from '../../components/Components';
import { MonitorConfig } from '../../utils';
import { RISK_CATEGORIES, getRiskCategoryLabel } from '@/pages/SafetyKnowledgeBase/MSDS/utils';
import iconAlarm from '@/assets/icon-alarm.png';

const monitorTypes = ['302', '304', '311', '312', '314'];
const nameLabels = ['储罐名称', '库房名称', '装置名称', '气柜名称', '管道名称'];
const uniqueByid = array => {
  return array.reduce((prev, next) => {
    const ids = prev.map(item => item.id);
    if (ids.indexOf(next.id) < 0) prev.push(next);
    return prev;
  }, []);
};
const NO_DATA = '暂无数据';

export default class DangerSourceInfoDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClickDetail = () => {
    const { setDrawerVisible } = this.props;
    setDrawerVisible('dangerSourceLvl');
  };

  render() {
    const {
      visible,
      onClose,
      dangerSourceDetail = {},
      handleShowDangerSourceLvl,
      handleClickShowMonitorDetail,
      dangerSourceMaterials: { miList = [] },
    } = this.props;
    const {
      dangerSourceList: {
        productDevice = [],
        industryPipeline = [],
        gasHolderManage = [],
        tankArea = [],
        wareHouseArea = [],
      } = {},
      id,
    } = dangerSourceDetail;
    const tmList = tankArea.reduce((prev, next) => {
      const { tmList } = next;
      return [...prev, ...tmList];
    }, []);
    const warehouseInfos = wareHouseArea.reduce((prev, next) => {
      const { warehouseInfos } = next;
      return [...prev, ...warehouseInfos];
    }, []);
    const basicFields = [
      { label: '统一编码', value: 'code' },
      { label: '重大危险源名称', value: 'name' },
      {
        label: '重大危险源等级',
        value: 'dangerLevel',
        render: val => ['一级', '二级', '三级', '四级'][val - 1],
        extra: (
          <span className={styles.detail} onClick={this.handleClickDetail}>
            查看详情>>
          </span>
        ),
      },
      { label: '区域位置', value: 'location' },
      { label: '责任人', value: 'dutyPerson' },
    ];

    const monitors = [tmList, warehouseInfos, productDevice, gasHolderManage, industryPipeline];
    const total = monitors.reduce((prev, next) => {
      prev += next.length;
      return prev;
    }, 0);
    const materials = uniqueByid(miList);

    return (
      <DrawerContainer
        // title="重大危险源监测"
        visible={visible}
        onClose={onClose}
        width={535}
        destroyOnClose={true}
        zIndex={1322}
        left={
          <div className={styles.container}>
            <div className={styles.title} style={{ marginTop: 0 }}>
              基本信息：
            </div>
            <CardItem data={dangerSourceDetail} fields={basicFields} />
            <div className={styles.title}>防护要求：</div>
            <div className={styles.content}>
              {/* 必须戴防护手套，必须戴防毒面具，必须穿防护服，必须戴防护眼镜 */}
              {materials.length > 0
                ? materials.map((item, index) => <div key={index}>{item.fhyq}</div>)
                : '暂无数据'}
            </div>
            <div className={styles.title}>安全措施：</div>
            <div className={styles.content}>
              {/* 严格按照规定穿戴劳动保护，定期进行巡查，发现泄露及时处理。作业时严格遵守安全操作过程，保持设备通风良好。 */}
              {materials.length > 0
                ? materials.map((item, index) => <div key={index}>{item.aqcs}</div>)
                : '暂无数据'}
            </div>
            {total > 0 && (
              <div>
                <div className={styles.title}>存储情况：</div>
                {monitors.map((dataList, index) => {
                  const monitorType = monitorTypes[index];
                  // MonitorConfig['302'].fields.splice(2, 0, ...[
                  //   {}
                  // ])
                  const { title, icon } = MonitorConfig[monitorType] || {};
                  let { fields } = MonitorConfig[monitorType] || {};
                  fields = [
                    // 名称加个label
                    { label: nameLabels[index], value: fields[0].value },
                    ...fields.slice(1),
                  ];
                  if (monitorType === '302') {
                    // 储罐加危险性类别、设计储量
                    fields = [
                      ...fields.slice(0, 3),
                      {
                        label: '危险性类别',
                        value: 'riskCateg',
                        // render: val => RISK_CATEGORIES[val] || NO_DATA,
                        render: val => getRiskCategoryLabel(val, RISK_CATEGORIES) || NO_DATA,
                      },
                      {
                        label: '设计储量',
                        value: 'designReserves',
                        render: val => (val ? val + 't' : NO_DATA),
                      },
                      ...fields.slice(3),
                    ];
                  }

                  return dataList.map((item, i) => {
                    const { warnStatus } = item;
                    const newItem = {
                      ...item,
                      icon: typeof icon === 'function' ? icon(item) : icon,
                    };

                    return (
                      <CardItem
                        key={i}
                        data={newItem}
                        fields={fields}
                        extraBtn={
                          <Fragment>
                            {+warnStatus === -1 && (
                              <div
                                className={styles.alarm}
                                style={{
                                  background: `url(${iconAlarm}) center center / 100% auto no-repeat`,
                                }}
                              />
                            )}
                            <div
                              className={styles.more}
                              onClick={() => {
                                handleClickShowMonitorDetail(monitorType, item.id);
                              }}
                            >
                              监测详情>
                            </div>
                          </Fragment>
                        }
                      />
                    );
                  });
                })}
              </div>
            )}
          </div>
        }
      />
    );
  }
}
