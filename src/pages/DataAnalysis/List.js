import React, { PureComponent } from 'react';
import { Button, Card, Input, List, Select } from 'antd';
import Link from 'umi/link';
import Ellipsis from '@/components/Ellipsis';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import styles from './List.less';
import InlineForm from '../BaseInfo/Company/InlineForm';

const { Option } = Select;

const OPTIONS = [
  { name: '用电安全', key: 'electricity' },
  { name: '可燃有毒气体', key: 'toxicGas' },
  { name: '废水', key: 'wasteWater' },
  { name: '废气', key: 'wasteGas' },
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
    id: 'address',
    inputSpan: INPUT_SPAN,
    render: () => <Input placeholder="请输入单位地址" />,
    transform: v => v.trim(),
  },
  {
    id: 'category',
    inputSpan: INPUT_SPAN,
    render: () => <Select placeholder="请选择监测类型">{OPTIONS.map(({ name, key }) => <Option key={key}>{name}</Option>)}</Select>,
  },
];

export default class DataAnalysisLayout extends PureComponent {
  renderList() {
    // const {
    //   transmission: {
    //     data: { list },
    //   },
    // } = this.props;

    const list = [...Array(10).keys()].map(i => ({ id: i, name: `企业${i}` }));

    return (
      <div className={styles.cardList}>
        <List
          rowKey="id"
          // loading={loading}
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={item => {
            const {
              id,
              name,
              safetyName,
              safetyPhone,
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

            return (
              <List.Item key={id}>
                  <Card className={styles.card} title={name}>
                    <Ellipsis tooltip className={styles.ellipsis} lines={1}>
                      地址：
                      {practicalAddressLabel ? practicalAddressLabel : '暂无信息'}
                    </Ellipsis>
                    <p>
                      行业类别：
                      暂无信息
                    </p>
                    <p>
                      安全负责人：
                      {safetyName ? safetyName : '暂无信息'}
                    </p>
                    <p>
                      联系电话：
                      {safetyPhone ? safetyPhone : '暂无信息'}
                    </p>
                    <p className={styles.icons}>
                      <Link to={`/data-analysis/IOT-abnormal-data/toxic-gas/${id}`}>有毒有害气体</Link>
                      <Link to={`/data-analysis/IOT-abnormal-data/electricity/${id}`}>用电安全</Link>
                      <Link to={`/data-analysis/IOT-abnormal-data/waste-water/${id}`}>废水</Link>
                      <Link to={`/data-analysis/IOT-abnormal-data/waste-gas/${id}`}>废气</Link>
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
    return (
      <PageHeaderLayout
        title="IOT异常数据分析"
        // breadcrumbList={breadcrumbList}
        content={
          <div>
            监测企业总数：1
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
