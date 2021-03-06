import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Collapse } from 'antd';
import styles from './index.less';
// 隐患业务分类
import { hiddenDangerType } from '@/utils/dict';

const { Panel } = Collapse;

const customPanelStyle = {
  overflow: 'hidden',
  background: '#033069',
}

// 分割线
const DashDivider = () => (<div className={styles.divider}></div>)

const renderSubTitle = (title, tag) => (
  <span>
    <span className={styles.borderIcon}>{tag}</span>
    {title}
  </span>
)

const renderTitle = (title) => (<span className={styles.title}>>>{title}</span>)

// 展开后的信息
const InfoItem = (value, index, level) => (
  <div key={index}>
    {index === 0 && <DashDivider />}
    <div>{value}</div>
    {level ? (<div className={styles.grayText}>{level}</div>) : null}
    <DashDivider />
  </div>
)

const InnerCollapse = (arr) => {
  return (
    <Collapse
      bordered={false}
      expandIconPosition="right"
      expandIcon={({ isActive }) => <LegacyIcon style={{ color: '#02fcfa', fontSize: '17px' }} type="right" rotate={isActive ? 90 : 0} />}
    >
      {arr.map(({ object_title, object_id, business_type, flows }) => (
        <Panel header={renderSubTitle(object_title, hiddenDangerType[business_type].slice(0, 1))} key={object_id} extra={flows && flows.length || 0} style={customPanelStyle}>
          <div className={styles.textContent}>
            {flows.map((item, index) => InfoItem(item.flow_name, index, item.danger_level))}
          </div>
        </Panel>
      ))}
    </Collapse>
  );
}

// 标准及措施
const StandardsAndMeasures = (props) => {
  const {
    // 标准及措施列表
    standardsAndMeasuresList = [],
    // 点位检查标准列表
    pointInspectionStandardsList = [],
    itemName,
  } = props;
  const smallNum = pointInspectionStandardsList.reduce((total, val) => {
    const len = val.flows.length || 0;
    return total + len;
  }, 0)
  return (
    <div className={styles.standardContainer}>
      <Collapse
        bordered={false}
        expandIconPosition="right"
        defaultActiveKey={[0]}
      >
        <Panel header={renderTitle('点位检查标准')} key={0} style={customPanelStyle}>
          <div className={styles.content}>
            <div className={styles.titleLine}>
              <span>{itemName}</span>
              <span>共{pointInspectionStandardsList.length || 0}个大项，{smallNum}个小项</span>
            </div>
            {InnerCollapse(pointInspectionStandardsList)}
          </div>
        </Panel>
      </Collapse>
      <Collapse
        bordered={false}
        expandIconPosition="right"
        defaultActiveKey={[standardsAndMeasuresList.length - 1]}
      >
        {standardsAndMeasuresList.map(({ title, detailInfo }, index) => title ? (
          <Panel header={renderTitle(title)} key={index} style={customPanelStyle}>
            <div className={styles.textContent}>
              {title === '警示标志' ? (
                detailInfo.map(({ webUrl }, index) => webUrl && webUrl.length ? webUrl.map((val, i) => val ? (
                  <img key={`${index}-${i}`} className={styles.alarmLogo} src={val} alt="logo" />
                ) : null) : null)
              ) : detailInfo.filter(info => !!info.value).map((val, index) => InfoItem(val.value, index))}
            </div>
          </Panel>
        ) : null)}
      </Collapse>
    </div>
  );
};

export default StandardsAndMeasures;
