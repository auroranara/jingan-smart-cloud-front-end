import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card, Form, Icon, Popover } from 'antd';

import styles1 from '@/pages/BaseInfo/Company/Company.less';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { genOperateCallback } from '@/pages/PersonnelManagement/CheckPoint/utils';
import { getFieldLabels, renderSections, LIST_URL, RISK_CATEGORIES } from './utils';

@Form.create()
@connect(({ msds, loading }) => ({ msds, loading: loading.models.msds }))
export default class MEdit extends PureComponent {
  state={ sections: [] };

  componentDidMount() {
    const {
      match: { params: { id } },
    } = this.props;
    const sections = [
      {
        title: '第一部分：化学品名称',
        fields: [
          { name: 'chineName', label: '化学品中文名称' },
          { name: 'chineName2', label: '化学品中文名称二', required: false },
          { name: 'engName', label: '化学品英文名称' },
          { name: 'engName2', label: '化学品英文名称二', required: false },
          { name: 'bookCode', label: '技术说明书编码' },
          { name: 'casNo', label: 'CAS号' },
          { name: 'molecFormu', label: '分子式' },
          { name: 'molecWeight', label: '分子量' },
        ],
      },
      {
        title: '第二部分：成分/组成信息',
        fields: [
          { name: 'injurant', label: '有害物成分' },
          { name: 'content', label: '含量', required: false },
          { name: 'injurantCas', label: '有害物CAS号' },
        ],
      },
      {
        title: '第三部分：危险性概述',
        fields: [
          { name: 'riskCateg', label: '危险性类别', type: 'select', options: RISK_CATEGORIES },
          { name: 'invasionRoute', label: '侵入途径', type: 'text', required: false },
          { name: 'healthHazard', label: '健康危害', type: 'text' },
          { name: 'environmentalHarm', label: '环境危害', type: 'text' },
          { name: 'deflagration', label: '爆燃危险', type: 'text' },
        ],
      },
      {
        title: '第四部分：急救措施',
        fields: [
          { name: 'skinContact', label: '皮肤接触', type: 'text' },
          { name: 'eyeContact', label: '眼睛接触', type: 'text' },
          { name: 'inhalHazard', label: '吸入危害', type: 'text', required: false },
          { name: 'ingestHazard', label: '食入危害', type: 'text' },
        ],
      },
      {
        title: '第五部分：消防措施',
        fields: [
          { name: 'hazardChara', label: '危险特性', type: 'text' },
          { name: 'combustionProducts', label: '有害燃烧产物', type: 'text' },
          { name: 'extinMethod', label: '灭火方法', type: 'text' },
        ],
      },
      {
        title: '第六部分：泄露应急处理',
        fields: [
          { name: 'leakDisposal', label: '泄露处理', type: 'text' },
        ],
      },
      {
        title: '第七部分：操作处置与储存',
        fields: [
          { name: 'operationCautions', label: '操作注意事项', type: 'text' },
          { name: 'storaTransNotice', label: '存储注意事项', type: 'text' },
        ],
      },
      {
        title: '第八部分：接触控制/个体防护',
        fields: [
          { name: 'occupationalExposureLimit', label: '职业接触限值' },
          // { name: 'MAC_CN', label: <span>中国MAC(mg/m<sub>3</sub>)</span> },
          { name: 'macCn', label: '中国MAC(mg/m3)' },
          { name: 'macSov', label: '前苏联MAC(mg/m3)' },
          { name: 'tlvtn', label: 'TLVTN' },
          { name: 'tlvwn', label: 'TLVWN' },
          { name: 'monitoringMethod', label: '监测方法', type: 'text', required: false },
          { name: 'enginContr', label: '工程控制', type: 'text' },
          { name: 'respiProtect', label: '呼吸系统防护', type: 'text' },
          { name: 'eyeProtect', label: '眼睛防护', type: 'text' },
          { name: 'bodyProtect', label: '身体防护', type: 'text' },
          { name: 'handProtect', label: '手防护', type: 'text' },
          { name: 'otherProtect', label: '其他防护', type: 'text' },
        ],
      },
      {
        title: '第九部分：理化特性',
        fields: [
          { name: 'mainComponents', label: '主要成分' },
          { name: 'shape', label: '外形与形状', type: 'text' },
          { name: 'ph', label: 'pH值', required: false },
          { name: 'meltPoint', label: '熔点(℃)', required: false },
          { name: 'boilPoint', label: '沸点(℃)', required: false },
          { name: 'relatDensiWater', label: '相对密度(水=1)', required: false },
          { name: 'relatDensiAir', label: '相对蒸汽密度(空气=1)', required: false },
          { name: 'saturatedVaporPressure', label: '饱和蒸汽压(KPa)' },
          { name: 'combustionHeat', label: '燃烧热(KJ/mol)' },
          { name: 'criticalTemperature', label: '临界温度(℃)' },
          { name: 'criticalPressure', label: '临界压力(MPa)' },
          { name: 'logKow', label: '辛醇/水分配系数的对数值' },
          { name: 'flashPoint', label: '闪点(℃)', required: false },
          { name: 'ignitTemp', label: '燃点(℃)', required: false },
          { name: 'upperExplosionLimit', label: '爆炸上限%(V/V)' },
          { name: 'lowerExplosionLimit', label: '爆炸下限%(V/V)' },
          { name: 'solubility', label: '溶解性' },
          { name: 'mainUsage', label: '主要用途', type: 'text' },
          { name: 'others', label: '其他理化性质', type: 'text', required: false },
        ],
      },
      {
        title: '第十部分：稳定性和反应活性',
        fields: [
          { name: 'stability', label: '稳定性', type: 'text', required: false },
          { name: 'incompatibilitySubstances', label: '禁配物' },
          { name: 'avoidContactConditions', label: '避免接触的条件', required: false },
          { name: 'aggregateHarm', label: '聚合危害', required: false },
          { name: 'decompositionProduct', label: '分解产物', required: false },
        ],
      },
      {
        title: '第十一部分：毒理学资料',
        fields: [
          { name: 'acuteToxicity', label: '急性毒性', type: 'text', required: false },
          { name: 'chronicToxicity', label: '亚急性和慢性毒性', type: 'text', required: false },
          { name: 'irritation', label: '刺激性', type: 'text', required: false },
          { name: 'sensitization', label: '致敏性', type: 'text', required: false },
          { name: 'mutagenicity', label: '致突变性', type: 'text', required: false },
          { name: 'teratogenicity', label: '致畸性', type: 'text', required: false },
          { name: 'carcinogenicity', label: '致癌性', type: 'text', required: false },
        ],
      },
      {
        title: '第十二部分：生态学资料',
        fields: [
          { name: 'ecotoxicology', label: '生态毒理特性', type: 'text', required: false },
          { name: 'biodegradability', label: '生物降解性', type: 'text', required: false },
          { name: 'nonBiodegradable', label: '非生物降解性', type: 'text', required: false },
          { name: 'bioaccumulation', label: '生物富集或生物积累性', type: 'text', required: false },
          { name: 'biologicalHazards', label: '其他有害作用', type: 'text', required: false },
        ],
      },
      {
        title: '第十三部分：废弃处置',
        fields: [
          { name: 'wasteProperty', label: '废弃物性质', type: 'text', required: false },
          { name: 'wasteDisposedMethod', label: '废弃处置方法', type: 'text', required: false },
          { name: 'wasteNote', label: '废弃注意事项', type: 'text', required: false },
        ],
      },
      {
        title: '第十四部分：运输信息',
        fields: [
          { name: 'dangerousGoodsCode', label: '危险货物编号', required: false },
          { name: 'uncode', label: 'UN编号', required: false },
          { name: 'packingMark', label: '包装标志', required: false },
          { name: 'packingKind', label: '包装类别', required: false },
          { name: 'packingMethod', label: '包装方法', type: 'text', required: false },
          { name: 'transportationAttention', label: '运输注意事项', type: 'text' },
        ],
      },
      {
        title: '第十五部分：法规信息',
        fields: [
          { name: 'law', label: '法规信息', type: 'text', required: false },
        ],
      },
      {
        title: '第十六部分：其他信息',
        fields: [
          { name: 'reference', label: '参考文献', type: 'text', required: false },
          { name: 'fillingDepartment', label: '填表部门', required: false },
          { name: 'auditingDepartment', label: '数据审核单位', required: false },
          { name: 'modifyDescription', label: '修改说明', type: 'text', required: false },
          { name: 'otherMatters', label: '其他信息', type: 'text', required: false },
        ],
      },
    ];

    this.fieldLabels = getFieldLabels(sections);

    this.setState({ sections }, id ? this.getDetail() : null);
  }

  fieldLabels = {};

  getDetail = () => {
    const {
      dispatch,
      match: { params: { id } },
      form: { setFieldsValue },
    } = this.props;
    dispatch({
      type: 'msds/getMSDS',
      payload: id,
      callback: detail => setFieldsValue(detail),
    });
  };

  renderErrorInfo() {
    const {
      form: { getFieldsError },
    } = this.props;
    const errors = getFieldsError();
    const errorCount = Object.keys(errors).filter(key => errors[key]).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = fieldKey => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = Object.keys(errors).map(key => {
      if (!errors[key]) {
        return null;
      }
      return (
        <li key={key} className={styles1.errorListItem} onClick={() => scrollToField(key)}>
          <Icon type="cross-circle-o" className={styles1.errorIcon} />
          <div className={styles1.errorMessage}>{errors[key][0]}</div>
          <div className={styles1.errorField}>{this.fieldLabels[key]}</div>
        </li>
      );
    });
    return (
      <span className={styles1.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles1.errorPopover}
          trigger="click"
          getPopupContainer={trigger => trigger.parentNode}
        >
          <Icon type="exclamation-circle" />
          {errorCount}
        </Popover>
      </span>
    );
  }

  /* 渲染底部工具栏 */
  renderFooterToolbar() {
    const { loading } = this.props;
    return (
      <FooterToolbar>
        {this.renderErrorInfo()}
        <Button onClick={e => router.push(LIST_URL)}>返回</Button>
        {!this.isDetail() && (
          <Button
            type="primary"
            size="large"
            onClick={this.handleClickValidate}
            loading={loading}
          >
            提交
          </Button>
        )}
      </FooterToolbar>
    );
  }

  add = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'msds/addMSDS',
      payload: values,
      callback: genOperateCallback(LIST_URL),
    })
  };

  update = values => {
    const {
      dispatch,
      match: { params: { id } },
    } = this.props;
    dispatch({
      type: 'msds/editMSDS',
      payload: { ...values, id },
      callback: genOperateCallback(LIST_URL),
    })
  };

  handleClickValidate = () => {
    const {
      match: { params: { id } },
      form: { validateFieldsAndScroll },
    } = this.props;

    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        if (id)
          this.update(values);
        else
          this.add(values);
      }
    });
  };

  isDetail = () => {
    const { match: { url } } = this.props;
    return url && url.includes('detail');
  };

  render() {
    const {
      match: { params: { id } },
      form: { getFieldDecorator },
    } = this.props;
    const { sections } = this.state;

    const title = this.isDetail() ? '详情' : id ? '编辑' : '新增';
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '安全生产知识库', name: '安全生产知识库' },
      { title: '化学品安全说明书', name: '化学品安全说明书', href: LIST_URL },
      { title, name: title },
    ];

    return (
      <PageHeaderLayout
        title="新增MSDS"
        breadcrumbList={breadcrumbList}
      >
        <Card style={{ marginBottom: 15 }}>
          {renderSections(sections, getFieldDecorator)}
        </Card>
        {this.renderFooterToolbar()}
      </PageHeaderLayout>
    );
  }
}
