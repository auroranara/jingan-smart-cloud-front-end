import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Card, Spin } from 'antd';
import moment from 'moment';
import { Map, Marker } from 'react-amap';

import DescriptionList from '@/components/DescriptionList';
import Ellipsis from '@/components/Ellipsis';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import urls from '@/utils/urls';
import titles from '@/utils/titles';

import styles from './index.less';
import SafetyDetail from './SafetyDetail';

const { Description } = DescriptionList;

// const companyTypes = ['', '重点单位', '一般单位', '九小场所'];
// 获取title
const {
  home: homeTitle,
  maintenance: { list: listTitle, menu: menuTitle, serviceList: serviceListTitle, serviceDetail: title },
} = titles;
// 获取链接地址
const {
  home: homeUrl,
  maintenance: { list: listUrl, serviceList: serviceListUrl },
} = urls;
/* 表单标签 */
const fieldLabels = {
  administrativeDivision: '行政区域',
  businessScope: '经营范围',
  code: '社会信用代码',
  companyIchnography: '单位平面图',
  companyStatus: '单位状态',
  createTime: '成立时间',
  economicType: '经济类型',
  groupName: '集团公司名称',
  companyType: '单位类型',
  industryCategory: '行业类别',
  coordinate: '经纬度',
  licenseType: '营业执照类别',
  name: '	单位名称',
  practicalAddress: '实际经营地址',
  registerAddress: '注册地址',
  scale: '规模情况',
  principalName: '姓名',
  principalPhone: '联系方式',
  principalEmail: '邮箱',
  companyNature: '单位性质',
};
// tab列表
const tabList = [
  {
    key: '0',
    tab: '基本信息',
  },
  {
    key: '1',
    tab: '安监信息',
  },
];
// 默认选中一般企业
const defaultCompanyNature = '一般企业';
/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

/**
 * 服务单位详情
 */
@connect(({ maintenanceCompany, user, loading }) => ({
  maintenanceCompany,
  user,
  loading: loading.models.maintenanceCompany,
}))
@Form.create()
export default class App extends PureComponent {
  state = {
    isCompany: true,
    tabActiveKey: tabList[0].key,
  };

  /* 生命周期函数 */
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { companyId },
      },
    } = this.props;
    // 获取详情
    dispatch({
      type: 'maintenanceCompany/fetchServiceDetail',
      payload: {
        companyId,
      },
      callback: ({ companyNatureLabel }) => {
        this.setState({
          isCompany: companyNatureLabel === defaultCompanyNature,
        });
      },
    });
  }

  handleTabChange = key => {
    this.setState({
      tabActiveKey: key,
    });
  };

  /* 渲染行业类别 */
  renderIndustryCategory() {
    const {
      maintenanceCompany: {
        serviceDetail: { industryCategoryLabel },
      },
    } = this.props;

    return (
      <Description term={fieldLabels.industryCategory}>
        {industryCategoryLabel || getEmptyData()}
      </Description>
    );
  }

  /* 渲染单位状态 */
  renderCompanyStatus() {
    const {
      maintenanceCompany: {
        serviceDetail: { companyStatusLabel },
      },
    } = this.props;

    return (
      <Description term={fieldLabels.companyStatus}>
        {companyStatusLabel || getEmptyData()}
      </Description>
    );
  }

  /* 渲染基础信息 */
  renderBasicInfo() {
    const {
      maintenanceCompany: {
        serviceDetail: {
          name,
          code,
          longitude,
          latitude,
          companyNatureLabel,
          companyIchnography,
          registerAddress,
          registerProvinceLabel,
          registerCityLabel,
          registerDistrictLabel,
          registerTownLabel,
          practicalAddress,
          practicalProvinceLabel,
          practicalCityLabel,
          practicalDistrictLabel,
          practicalTownLabel,
        },
      },
    } = this.props;
    const { isCompany } = this.state;

    const registerAddressLabel =
      (registerProvinceLabel || '') +
      (registerCityLabel || '') +
      (registerDistrictLabel || '') +
      (registerTownLabel || '') +
      (registerAddress || '');
    const practicalAddressLabel =
      (practicalProvinceLabel || '') +
      (practicalCityLabel || '') +
      (practicalDistrictLabel || '') +
      (practicalTownLabel || '') +
      (practicalAddress || '');

    let companyIchnographyList = companyIchnography ? JSON.parse(companyIchnography) : [];
    companyIchnographyList = Array.isArray(companyIchnographyList)
      ? companyIchnographyList
      : JSON.parse(companyIchnographyList.dbUrl);
    // console.log(typeof companyIchnographyList);

    return (
      <Card title="基础信息" className={styles.card} bordered={false}>
        <DescriptionList col={3} style={{ marginBottom: 16 }}>
          <Description term={fieldLabels.name}>{name || getEmptyData()}</Description>
          <Description term={fieldLabels.companyNature}>
            {companyNatureLabel || getEmptyData()}
          </Description>
          <Description term={fieldLabels.code}>{code || getEmptyData()}</Description>
          <Description term={fieldLabels.coordinate}>
            {longitude && latitude ? `${longitude},${latitude}` : (
              getEmptyData()
            )}
          </Description>
          <Description term={fieldLabels.registerAddress} style={{ height: 38 }}>
            <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
              {registerAddressLabel || getEmptyData()}
            </Ellipsis>
          </Description>
          <Description term={fieldLabels.practicalAddress} style={{ height: 38 }}>
            <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
              {practicalAddressLabel || getEmptyData()}
            </Ellipsis>
          </Description>
          {!isCompany && this.renderIndustryCategory()}
          {!isCompany && this.renderCompanyStatus()}
        </DescriptionList>
        <DescriptionList col={1} style={{ marginBottom: 20 }}>
          <Description term={fieldLabels.companyIchnography}>
            {companyIchnographyList.length !== 0
              ? companyIchnographyList.map(({ name, url }) => (
                  <div key={url}>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {name || '预览'}
                    </a>
                  </div>
                ))
              : getEmptyData()}
          </Description>
        </DescriptionList>
      </Card>
    );
  }

  /**
   * 渲染地图
   */
  renderMap() {
    const {
      maintenanceCompany: {
        serviceDetail: { longitude, latitude },
      },
    } = this.props;
    const center = longitude && latitude ? { longitude, latitude } : undefined;

    return (
      <Card title="位置信息" className={`${styles.card} ${styles.mapCard}`} bordered={false}>
        <Map
          amapkey="08390761c9e9bcedbdb2f18a2a815541"
          plugins={['Scale', { name: 'ToolBar', options: { locate: false } }]}
          status={{
            keyboardEnable: false,
          }}
          center={center}
          useAMapUI
          scrollWheel={false}
        >
          {center && <Marker position={center} />}
        </Map>
      </Card>
    );
  }

  /* 渲染更多信息 */
  renderMoreInfo() {
    const {
      maintenanceCompany: {
        serviceDetail: {
          economicTypeLabel,
          scaleLabel,
          licenseTypeLabel,
          createTime,
          groupName,
          businessScope,
          companyTypeLable,
        },
      },
    } = this.props;

    return (
      <Card title="更多信息" className={styles.card} bordered={false}>
        <DescriptionList col={3}>
          {this.renderIndustryCategory()}
          <Description term={fieldLabels.economicType}>
            {economicTypeLabel || getEmptyData()}
          </Description>
          {this.renderCompanyStatus()}
          <Description term={fieldLabels.companyType}>
            {companyTypeLable || getEmptyData()}
          </Description>
          <Description term={fieldLabels.scale}>{scaleLabel || getEmptyData()}</Description>
          <Description term={fieldLabels.licenseType}>
            {licenseTypeLabel || getEmptyData()}
          </Description>
          <Description term={fieldLabels.createTime}>
            {createTime ? moment(+createTime).format('YYYY-MM-DD') : getEmptyData()}
          </Description>
          <Description term={fieldLabels.groupName}>{groupName || getEmptyData()}</Description>
          <Description term={fieldLabels.businessScope}>
            {businessScope || getEmptyData()}
          </Description>
        </DescriptionList>
      </Card>
    );
  }

  /* 渲染人员信息 */
  renderPersonalInfo() {
    const {
      maintenanceCompany: {
        serviceDetail: {
          legalName,
          legalPhone,
          legalEmail,
          principalName,
          principalPhone,
          principalEmail,
          safetyName,
          safetyPhone,
          safetyEmail,
        },
      },
    } = this.props;
    return (
      <Fragment>
        <Card title="人员信息" bordered={false}>
          <DescriptionList title="法定代表人" col={3} style={{ marginBottom: 32 }}>
            <Description term={fieldLabels.principalName}>
              {legalName || getEmptyData()}
            </Description>
            <Description term={fieldLabels.principalPhone}>
              {legalPhone || getEmptyData()}
            </Description>
            <Description term={fieldLabels.principalEmail}>
              {legalEmail || getEmptyData()}
            </Description>
          </DescriptionList>
          <DescriptionList title="主要负责人" col={3} style={{ marginBottom: 32 }}>
            <Description term={fieldLabels.principalName}>
              {principalName || getEmptyData()}
            </Description>
            <Description term={fieldLabels.principalPhone}>
              {principalPhone || getEmptyData()}
            </Description>
            <Description term={fieldLabels.principalEmail}>
              {principalEmail || getEmptyData()}
            </Description>
          </DescriptionList>
          <DescriptionList title="安全负责人" col={3} style={{ marginBottom: 32 }}>
            <Description term={fieldLabels.principalName}>
              {safetyName || getEmptyData()}
            </Description>
            <Description term={fieldLabels.principalPhone}>
              {safetyPhone || getEmptyData()}
            </Description>
            <Description term={fieldLabels.principalEmail}>
              {safetyEmail || getEmptyData()}
            </Description>
          </DescriptionList>
        </Card>
      </Fragment>
    );
  }

  render() {
    const {
      loading,
      match: {
        params: { id, companyId },
      },
    } = this.props;
    const { tabActiveKey, isCompany } = this.state;
    // 面包屑
    const breadcrumbList = [
      {
        title: homeTitle,
        name: homeTitle,
        href: homeUrl,
      },
      {
        title: menuTitle,
        name: menuTitle,
      },
      {
        title: listTitle,
        name: listTitle,
        href: listUrl,
      },
      {
        title: serviceListTitle,
        name: serviceListTitle,
        href: serviceListUrl+id,
      },
      {
        title,
        name: title,
      },
    ];

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        tabList={tabList}
        onTabChange={this.handleTabChange}
        tabActiveKey={tabActiveKey}
        wrapperClassName={styles.advancedForm}
      >
        <Spin spinning={loading}>
          <div style={{ display: tabActiveKey === tabList[0].key ? 'block' : 'none' }}>
            {this.renderBasicInfo()}
            {this.renderMap()}
            {isCompany && this.renderMoreInfo()}
            {this.renderPersonalInfo()}
          </div>
          <div style={{ display: tabActiveKey === tabList[1].key ? 'block' : 'none' }}>
            <SafetyDetail companyId={companyId} />
          </div>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
