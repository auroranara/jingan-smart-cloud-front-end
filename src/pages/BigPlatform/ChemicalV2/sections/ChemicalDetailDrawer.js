import React, { PureComponent, Fragment } from 'react';
import DrawerContainer from '@/pages/BigPlatform/NewUnitFireControl/components/DrawerContainer';
import styles from './ChemicalDetailDrawer.less';
import { RISK_CATEGORIES } from '@/pages/SafetyKnowledgeBase/MSDS/utils';
import { CardItem } from '../components/Components';

const Types = ['生产原料', '中间产品', '最终产品'];
const Forms = ['固态', '液态', '气态', '等离子态'];
const HighRiskChemicals = ['硝酸铵', '硝化棉', '氰化钠'];
const NO_DATA = '暂无数据';
const renderYesOrNo = val => (+val === 1 ? '是' : '否');
const basicFields = [
  { label: '物料类型', value: 'type', render: val => Types[val - 1] },
  { label: '统一编码', value: 'unifiedCode' },
  { label: '化学品名称', value: 'chineName' },
  { label: 'CAS号', value: 'casNo' },
  { label: '危险化学品目录序号', value: 'dangerChemcataSn' },
  {
    label: '危险性类别',
    value: 'riskCateg',
    render: val => RISK_CATEGORIES[val] || NO_DATA,
  },
  // { label: '危险特性', value: 'name' },
  { label: '物质形态', value: 'materialForm', render: val => Forms[val - 1] },
  { label: '是否剧毒化学品', value: 'highlyToxicChem', render: renderYesOrNo },
  { label: '是否易制毒', value: 'easyMakePoison', render: renderYesOrNo },
  { label: '是否易制爆', value: 'easyMakeExplode', render: renderYesOrNo },
  { label: '是否高危化学品', value: 'isDangerChemicals', render: renderYesOrNo },
  {
    label: '高危化学品种类',
    value: 'highRiskChemicals',
    render: val => HighRiskChemicals[val] || NO_DATA,
  },
];
const Annuals = [
  {
    label: '年消耗量',
    value: 'annualConsumption',
    render: (val, row) => val + (row.annualConsumptionUnit === '1' ? 't' : 'm³'),
  },
  {
    label: '年产量',
    value: 'annualThroughput',
    render: (val, row) => val + (row.annualThroughputUnit === '1' ? 't' : 'm³'),
  },
];

export default class ChemicalDetailDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { visible, onClose, chemicalDetail } = this.props;
    const { safetyMeasures, emergencyMeasure, type } = chemicalDetail;
    const fields = [...basicFields];
    fields.splice(4, 0, +type === 1 ? Annuals[0] : Annuals[1]);
    if (+chemicalDetail.isDangerChemicals !== 1) fields.splice(fields.length - 1, 1);

    return (
      <DrawerContainer
        title="重点监管危化品安全措施和应急处置措施"
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
            <CardItem data={chemicalDetail} fields={fields} />
            <div className={styles.title}>安全措施：</div>
            <div className={styles.content}>{safetyMeasures}</div>

            <div className={styles.title}>应急处置措施：</div>
            <div className={styles.content}>{emergencyMeasure}</div>
          </div>
        }
      />
    );
  }
}
