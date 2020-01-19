import React, { Component } from 'react';
import { Card, message, Tooltip } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import InputOrSpan from '@/jingan-components/InputOrSpan';
import InfiniteList from '@/jingan-components/InfiniteList';
import CustomForm from '@/jingan-components/CustomForm';
import MonitorTypeSelect from '@/jingan-components/MonitorTypeSelect';
import Ellipsis from '@/components/Ellipsis';
import { connect } from 'dva';
import Link from 'umi/link';
import styles from './index.less';

const BREADCRUMB_LIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '物联网监测', name: '物联网监测' },
  { title: 'IOT监测及趋势统计', name: 'IOT监测及趋势统计' },
];
const FIELDS = [
  {
    id: 'name',
    label: '单位名称',
    transform: value => value.trim(),
    render: ({ handleSearch }) => (
      <InputOrSpan placeholder="请输入单位名称" onPressEnter={handleSearch} maxLength={50} />
    ),
  },
  {
    id: 'practicalAddress',
    label: '单位地址',
    render: ({ handleSearch }) => (
      <InputOrSpan placeholder="请输入单位地址" onPressEnter={handleSearch} maxLength={50} />
    ),
  },
  {
    id: 'equipmentType',
    label: '监测类型',
    render: () => <MonitorTypeSelect allowClear />,
  },
];
const API = 'iotStatistics/getCompanyList';
const EmptyData = () => <span className={styles.emptyData}>暂无数据</span>;

@connect(
  ({ user: { currentUser }, iotStatistics: { companyList }, loading }) => ({
    currentUser,
    companyList,
    loading: loading.effects[API],
  }),
  dispatch => ({
    getCompanyList(payload, callback) {
      dispatch({
        type: API,
        payload: {
          pageNum: 1,
          pageSize: 18,
          ...payload,
        },
        callback: (success, data) => {
          if (!success) {
            message.error('获取列表数据失败，请稍后重试！');
          }
          callback && callback(success, callback);
        },
      });
    },
  })
)
export default class CompanyList extends Component {
  state = {
    reloading: false,
  };

  prevValues = {};

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.currentUser !== this.props.currentUser ||
      nextProps.companyList !== this.props.companyList ||
      nextProps.loading !== this.props.loading ||
      nextState !== this.state
    );
  }

  getCompanyList = (pageNum, callback) => {
    this.props.getCompanyList(
      {
        pageNum,
        ...this.prevValues,
      },
      callback
    );
  };

  handleSearch = values => {
    this.prevValues = values;
    this.setState({
      reloading: true,
    });
    this.props.getCompanyList(values, () => {
      this.setState({
        reloading: false,
      });
    });
  };

  renderItem = ({
    id: companyId,
    name,
    practicalProvinceLabel,
    practicalCityLabel,
    practicalDistrictLabel,
    practicalTownLabel,
    practicalAddress,
    industryCategoryLabel,
    safetyName,
    safetyPhone,
    equipmentTypeList,
  }) => {
    const address = [
      practicalProvinceLabel,
      practicalCityLabel,
      practicalDistrictLabel,
      practicalTownLabel,
      practicalDistrictLabel,
    ]
      .filter(v => v)
      .join('');
    return (
      <Card
        title={
          <Ellipsis lines={1} tooltip>
            {name}
          </Ellipsis>
        }
      >
        <div className={styles.fieldWrapper}>
          <span>
            <span className={styles.address}>地址</span>：
          </span>
          <span>
            {address ? (
              <Ellipsis lines={1} tooltip>
                {address}
              </Ellipsis>
            ) : (
              <EmptyData />
            )}
          </span>
        </div>
        <div className={styles.fieldWrapper}>
          <span>
            <span className={styles.industryCategory}>行业类别</span>：
          </span>
          <span>
            {industryCategoryLabel ? (
              <Ellipsis lines={1} tooltip>
                {industryCategoryLabel}
              </Ellipsis>
            ) : (
              <EmptyData />
            )}
          </span>
        </div>
        <div className={styles.fieldWrapper}>
          <span>
            <span className={styles.safetyName}>安全管理员</span>：
          </span>
          <span>
            {safetyName ? (
              <Ellipsis lines={1} tooltip>
                {safetyName}
              </Ellipsis>
            ) : (
              <EmptyData />
            )}
          </span>
        </div>
        <div className={styles.fieldWrapper}>
          <span>
            <span className={styles.safetyPhone}>联系电话</span>：
          </span>
          <span>
            {safetyPhone ? (
              <Ellipsis lines={1} tooltip>
                {safetyPhone}
              </Ellipsis>
            ) : (
              <EmptyData />
            )}
          </span>
        </div>
        <div className={styles.iconContainer}>
          {equipmentTypeList.map(({ id, name, logoWebUrl }) => {
            return (
              <div className={styles.iconWrapper} key={id}>
                <Tooltip title={name}>
                  <Link
                    className={styles.icon}
                    style={{ backgroundImage: `url(${logoWebUrl})` }}
                    to={
                      name === '火灾自动报警系统'
                        ? `/company-iot/IOT-abnormal-data/fire-alarm/company/${companyId}`
                        : `/company-iot/IOT-abnormal-data/${companyId}/${id}`
                    }
                    target="_blank"
                  />
                </Tooltip>
              </div>
            );
          })}
        </div>
      </Card>
    );
  };

  render() {
    const {
      companyList,
      companyList: { pagination: { total } = {} } = {},
      loading = false,
    } = this.props;
    const { reloading } = this.state;

    return (
      <PageHeaderLayout
        title={BREADCRUMB_LIST[BREADCRUMB_LIST.length - 1].title}
        breadcrumbList={BREADCRUMB_LIST}
        content={`监测单位总数：${total || 0}`}
      >
        <Card className={styles.customFormCard}>
          <CustomForm
            className={styles.customForm}
            fields={FIELDS}
            onSearch={this.handleSearch}
            onReset={this.handleSearch}
            ref={this.setFormReference}
          />
        </Card>
        <InfiniteList
          className={styles.infiniteList}
          list={companyList}
          loading={loading}
          reloading={reloading}
          getList={this.getCompanyList}
          renderItem={this.renderItem}
        />
      </PageHeaderLayout>
    );
  }
}
