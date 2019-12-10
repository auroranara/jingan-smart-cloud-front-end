import React, { PureComponent } from 'react';
import { Card, Input, List, Select } from 'antd';
// import Link from 'umi/link';
import { connect } from 'dva';
import Ellipsis from '@/components/Ellipsis';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import styles from './DataAnalysisList.less';
import InlineForm from '@/pages/BaseInfo/Company/InlineForm';
import CODES from '@/utils/codes';
import { AuthIcon } from '@/utils/customAuth';
import { INPUT_SPAN, LABEL_COL_8, WRAPPER_COL_1 as WRAPPER_COL } from './constant';
import { handleListFormVals } from './utils';

import {
  electricityIcon,
  electricityDarkIcon,
  fireIcon,
  fireDarkIcon,
  humitureIcon,
  humitureDarkIcon,
  toxicGasIcon,
  toxicGasDarkIcon,
  wasteWaterIcon,
  wasteWaterDarkIcon,
  wasteGasIcon,
  wasteGasDarkIcon,
  waterIcon,
  waterDarkIcon,
  storageTankIcon,
  storageTankDarkIcon,
  smokeDetectorIcon,
  smokeDetectorDarkIcon,
} from '../imgs/links';

const { Option } = Select;

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '物联网监测', name: '物联网监测' },
  { title: 'IOT监测及趋势统计', name: 'IOT监测及趋势统计' },
];

const NO_DATA = '暂无信息';
const PAGE_SIZE = 18;
const ICON_STYLE = {
  width: 30,
  height: 30,
  // marginRight: 15,
  marginRight: 8,
  backgroundSize: '100% 100%',
};
const LAST_ICON_STYLE = { ...ICON_STYLE, marginRight: 0 };

const ICONS = [
  'electricity',
  'toxic-gas',
  'waste-water',
  'waste-gas',
  'storage-tank',
  'smoke-detector',
  'fire',
  'humiture',
  'water',
];
const ICONS_URL = {
  electricity: electricityIcon,
  'electricity-d': electricityDarkIcon,
  'toxic-gas': toxicGasIcon,
  'toxic-gas-d': toxicGasDarkIcon,
  'waste-water': wasteWaterIcon,
  'waste-water-d': wasteWaterDarkIcon,
  'waste-gas': wasteGasIcon,
  'waste-gas-d': wasteGasDarkIcon,
  'storage-tank': storageTankIcon,
  'storage-tank-d': storageTankDarkIcon,
  'smoke-detector': smokeDetectorIcon,
  'smoke-detector-d': smokeDetectorDarkIcon,
  fire: fireIcon,
  'fire-d': fireDarkIcon,
  humiture: humitureIcon,
  'humiture-d': humitureDarkIcon,
  water: waterIcon,
  'water-d': waterDarkIcon,
};
const ICONS_CN = {
  electricity: '电气火灾数据分析',
  'toxic-gas': '可燃有毒气体数据分析',
  'waste-water': '废水数据分析',
  'waste-gas': '废气数据分析',
  'storage-tank': '储罐数据分析',
  'smoke-detector': '独立烟感数据分析',
  fire: '火灾自动报警系统',
  humiture: '温湿度传感器数据分析',
  water: '水系统数据分析',
};
const OPTIONS = [
  { name: '全部', key: 0 },
  { name: '电气火灾', key: 1 },
  { name: '可燃有毒气体', key: 2 },
  { name: '废水', key: 3 },
  { name: '废气', key: 4 },
  { name: '储罐', key: 5 },
  { name: '独立烟感', key: 6 },
  { name: '火灾自动报警系统', key: 7 },
  { name: '温湿度传感器', key: 8 },
  { name: '水系统', key: 9 },
];

const fields = [
  {
    id: 'name',
    label: '单位名称：',
    labelCol: LABEL_COL_8,
    wrapperCol: WRAPPER_COL,
    inputSpan: INPUT_SPAN,
    render: () => <Input placeholder="请输入单位名称" />,
    transform: v => v.trim(),
  },
  {
    id: 'practicalAddress',
    label: '单位地址：',
    labelCol: LABEL_COL_8,
    wrapperCol: WRAPPER_COL,
    inputSpan: INPUT_SPAN,
    render: () => <Input placeholder="请输入单位地址" />,
    transform: v => v.trim(),
  },
  {
    id: 'type',
    label: '监测类型：',
    labelCol: LABEL_COL_8,
    wrapperCol: WRAPPER_COL,
    inputSpan: INPUT_SPAN,
    options: { initialValue: '0' },
    render: () => (
      <Select placeholder="请选择监测类型">
        {OPTIONS.map(({ name, key }) => (
          <Option key={key}>{name}</Option>
        ))}
      </Select>
    ),
  },
];

const documentElem = document.documentElement;
// const body = document.body;
const childElem = document.querySelector('#root div');

@connect(({ loading, dataAnalysis }) => ({
  dataAnalysis,
  loading: loading.effects['dataAnalysis/fetchCompanyList'],
}))
export default class DataAnalysisList extends PureComponent {
  state = {
    formVals: null,
    hasMore: true, // 数据库中是否还存在数据
  };

  componentDidMount() {
    this.fetchCompanies(true);
    // body.onscroll = this.handleScroll;
    document.addEventListener('scroll', this.handleScroll, false);
  }

  componentWillUnMount() {
    // body.onscroll = null;
    document.removeEventListener('scroll', this.handleScroll);
  }

  pageNum = 1;

  handleScroll = e => {
    const { loading } = this.props;
    const { hasMore } = this.state;
    // 滚动时子元素相对定高的父元素滚动，事件加在父元素上，且查看父元素scrollTop，当滚到底时，父元素scrollTop+父元素高度=子元素高度
    // 判断页面是否滚到底部
    const scrollToBottom =
      documentElem.scrollTop + documentElem.offsetHeight >= childElem.offsetHeight;
    // 当页面滚到底部且当前并不在请求数据且数据库还有数据时，才能再次请求
    if (scrollToBottom && !loading && hasMore) this.loadMore();
  };

  handleSearch = values => {
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
    if (initial) {
      this.pageNum = 1;
      this.setState({ hasMore: true });
    }

    const pageNum = this.pageNum;
    let payload = { pageSize: PAGE_SIZE, pageNum: pageNum };
    if (values) payload = { ...payload, ...handleListFormVals(values) };

    dispatch({
      type: 'dataAnalysis/fetchCompanyList',
      payload,
      callback: total => {
        if (total <= pageNum * PAGE_SIZE) this.setState({ hasMore: false });
        this.pageNum++;
      },
    });
  };

  renderList() {
    const {
      loading,
      dataAnalysis: {
        companies: { list = [] },
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
              smokeNum=0,
              pollutionWaterNum,
              pollutionGasNum,
              opcNum,
              transmissionNum,
              humitureNum=0,
              waterNum=0,
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
              'storage-tank': opcNum,
              'smoke-detector': smokeNum,
              fire: transmissionNum,
              humiture: humitureNum,
              water: waterNum,
            };

            const icons = ICONS.filter(icon => iconNums[icon]);

            return (
              <List.Item key={id}>
                <Card className={styles.card} title={name}>
                  <Ellipsis tooltip className={styles.ellipsis} lines={1}>
                    地址：
                    {practicalAddressLabel ? practicalAddressLabel : NO_DATA}
                  </Ellipsis>
                  <Ellipsis tooltip className={styles.ellipsis} lines={1}>
                    行业类别：
                    {industryCategoryLabel ? industryCategoryLabel : NO_DATA}
                  </Ellipsis>
                  <p>
                    安全管理员：
                    {safetyName ? safetyName : NO_DATA}
                  </p>
                  <p>
                    联系电话：
                    {safetyPhone ? safetyPhone : NO_DATA}
                  </p>
                  <p className={styles.icons}>
                    {/* {ICONS.map(icon => ( */}
                    {icons.map((icon, i) => (
                      <AuthIcon
                        key={icon}
                        title={ICONS_CN[icon]}
                        url={ICONS_URL[icon]}
                        darkUrl={ICONS_URL[`${icon}-d`]}
                        code={CODES.dataAnalysis.IOTAbnormalData[icon]}
                        // to={{
                        //   pathname: `/company-iot/IOT-abnormal-data/${icon}/${id}`,
                        //   num: iconNums[icon],
                        // }}
                        to={`/company-iot/IOT-abnormal-data/${
                          icon === 'fire'
                            ? `fire-alarm/company/${id}`
                            : `${icon}/${id}/count/${iconNums[icon]}`
                        }`}
                        style={i === icons.length - 1 ? LAST_ICON_STYLE : ICON_STYLE}
                        target="_blank"
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
    const {
      dataAnalysis: {
        companies: { pagination: { total = 0 } = {} },
      },
    } = this.props;

    return (
      <PageHeaderLayout
        title="IOT监测及趋势统计"
        breadcrumbList={breadcrumbList}
        content={
          <div className={styles.total}>
            监测单位总数：
            {total}
          </div>
        }
      >
        <Card className={styles.search}>
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
