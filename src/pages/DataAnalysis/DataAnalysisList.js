import React, { PureComponent } from 'react';
import { Card, Input, List, Select } from 'antd';
// import Link from 'umi/link';
import { connect } from 'dva';
import Ellipsis from '@/components/Ellipsis';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import styles from './DataAnalysisList.less';
import InlineForm from '../BaseInfo/Company/InlineForm';
import { AuthIcon } from '@/utils/customAuth';
import CODES from '@/utils/codes';

import electricityIcon from './imgs/electricity.png';
import electricityDarkIcon from './imgs/electricity-d.png';
import toxicGasIcon from './imgs/toxic-gas.png';
import toxicGasDarkIcon from './imgs/toxic-gas-d.png';
import wasteWaterIcon from './imgs/waste-water.png';
import wasteWaterDarkIcon from './imgs/waste-water-d.png';
import wasteGasIcon from './imgs/waste-gas.png';
import wasteGasDardIcon from './imgs/waste-gas-d.png';

const { Option } = Select;

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '数据分析', name: '数据分析' },
  { title: 'IOT异常数据分析', name: 'IOT异常数据分析' },
];

const NO_DATA = '暂无信息';
const PAGE_SIZE = 18;
const ICONS = ['electricity', 'toxic-gas', 'waste-water', 'waste-gas'];
const ICONS_URL = {
  electricity: electricityIcon,
  'electricity-d': electricityDarkIcon,
  'toxic-gas': toxicGasIcon,
  'toxic-gas-d': toxicGasDarkIcon,
  'waste-water': wasteWaterIcon,
  'waste-water-d': wasteWaterDarkIcon,
  'waste-gas': wasteGasIcon,
  'waste-gas-d': wasteGasDardIcon,
};
const ICONS_CN = {
  electricity: '用电安全异常数据分析',
  'toxic-gas': '可燃有毒气体异常数据分析',
  'waste-water': '废水异常数据分析',
  'waste-gas': '废气异常数据分析',
  'opc': 'opc异常数据分析',
};
const OPTIONS = [
  { name: '用电安全', key: 1 },
  { name: '可燃有毒气体', key: 2 },
  { name: '废水', key: 3 },
  { name: '废气', key: 4 },
  { name: 'opc', key: 5 },
];
const INPUT_SPAN = { lg: 6, md: 12, sm: 24 };

const fields = [
  {
    id: 'name',
    inputSpan: INPUT_SPAN,
    render: () => <Input placeholder="请输入单位名称" />,
    transform: v => v.trim(),
  },
  {
    id: 'practicalAddress',
    inputSpan: INPUT_SPAN,
    render: () => <Input placeholder="请输入单位地址" />,
    transform: v => v.trim(),
  },
  {
    id: 'type',
    inputSpan: INPUT_SPAN,
    render: () => <Select placeholder="请选择监测类型">{OPTIONS.map(({ name, key }) => <Option key={key}>{name}</Option>)}</Select>,
  },
];

@connect(({ loading, dataAnalysis }) => ({ dataAnalysis, loading: loading.models.dataAnalysis }))
export default class DataAnalysisList extends PureComponent {
  state = { formVals: null };

  componentDidMount() {
    this.fetchCompanies(true);
  }

  pageNum = 1;

  handleSearch = (values) => {
    this.setState({ formVals: values });
    this.fetchCompanies(true, values);
  };

  handleReset = () => {
    this.setState({ formVals: null });
    this.fetchCompanies(true);
  };

  loadMore = () => {
    const { formVals } = this.state;
    this.fetchCompanies(false, formVals);
  };

  fetchCompanies = (initial, values) => {
    const { dispatch } = this.props;
    // 若是点击搜索按钮或者组件刚加载时的初始化，则传入initial=true,将pageNum置为初始值1
    if (initial)
      this.pageNum = 1;
    let payload = { pageSize: PAGE_SIZE, pageNum: this.pageNum };
    if (values)
      payload = { ...payload, ...values };
    dispatch({
      type: 'dataAnalysis/fetchCompanyList',
      payload,
      callback: () => this.pageNum++,
    });
  };

  renderList() {
    const {
      loading,
      dataAnalysis: {
        companies: { list=[] },
      },
    } = this.props;

    // const list = [...Array(10).keys()].map(i => ({ id: i, name: `企业${i}` }));

    return (
      <div className={styles.cardList}>
        <List
          rowKey="id"
          loading={loading}
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={item => {
            const {
              id,
              name,
              safetyName,
              safetyPhone,
              elecNum,
              gasNum,
              pollutionWaterNum,
              pollutionGasNum,
              opcNum,
              industryCategoryLabel,
              practicalProvinceLabel,
              practicalCityLabel,
              practicalDistrictLabel,
              practicalTownLabel,
              practicalAddress,
            } = item;

            const practicalAddressLabel =
              (practicalProvinceLabel || '') +
              (practicalCityLabel || '') +
              (practicalDistrictLabel || '') +
              (practicalTownLabel || '') +
              (practicalAddress || '');

            const iconNums = {
              electricity: elecNum,
              'toxic-gas': gasNum,
              'waste-water': pollutionWaterNum,
              'waste-gas': pollutionGasNum,
              'opc': opcNum,
            };

            return (
              <List.Item key={id}>
                  <Card className={styles.card} title={name}>
                    <Ellipsis tooltip className={styles.ellipsis} lines={1}>
                      地址：
                      {practicalAddressLabel ? practicalAddressLabel : NO_DATA}
                    </Ellipsis>
                    <p>
                      行业类别：
                      {industryCategoryLabel ? industryCategoryLabel : NO_DATA}
                    </p>
                    <p>
                      安全负责人：
                      {safetyName ? safetyName : NO_DATA}
                    </p>
                    <p>
                      联系电话：
                      {safetyPhone ? safetyPhone : NO_DATA}
                    </p>
                    <p className={styles.icons}>
                      {ICONS.filter(icon => iconNums[icon]).map(icon => (
                        <AuthIcon
                          key={icon}
                          title={ICONS_CN[icon]}
                          url={ICONS_URL[icon]}
                          darkUrl={ICONS_URL[`${icon}-d`]}
                          code={CODES.dataAnalysis.IOTAbnormalData[icon]}
                          // to={{
                          //   pathname: `/data-analysis/IOT-abnormal-data/${icon}/${id}`,
                          //   num: iconNums[icon],
                          // }}
                          to={`/data-analysis/IOT-abnormal-data/${icon}/${id}/count/${iconNums[icon]}`}
                          style={{ width: 30, height: 30, marginRight: 15, backgroundSize: '100% 100%' }}
                        />
                      ))}
                    </p>
                  </Card>
              </List.Item>
            );
          }}
        />
      </div>
    );
  }

  render() {
    const { dataAnalysis: { companies: { list=[] } } } = this.props;

    return (
      <PageHeaderLayout
        title="IOT异常数据分析"
        breadcrumbList={breadcrumbList}
        content={
          <div className={styles.total}>
            监测企业总数：{list.length}
          </div>
        }
      >
        <Card>
          <InlineForm
            fields={fields}
            buttonSpan={{ xl: 6, md: 12, sm: 24 }}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
          />
        </Card>
        {this.renderList()}
      </PageHeaderLayout>
    );
  }
}
