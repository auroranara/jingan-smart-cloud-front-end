import React, { Component, Fragment } from 'react';
import { Input, Card } from 'antd';
import ListPage from '@/templates/ListPage';
import Ellipsis from '@/components/Ellipsis';
import EmptyText from '@/jingan-components/View/EmptyText';
import styles from './index.less';

const MAPPER = {
  namespace: 'common',
  list: 'companyList',
  getList: 'getCompanyList',
};

export default class Company extends Component {
  getContent = ({ list: { pagination: { total } = {} } = {} }) => (
    <Fragment>
      单位总数：
      {total || 0}
    </Fragment>
  );

  getFields = () => [
    {
      id: 'name',
      transform: v => v.trim(),
      render: ({ onSearch }) => (
        <Input placeholder="请输入单位名称" maxLength={100} onPressEnter={onSearch} />
      ),
    },
  ];

  renderItem = item => {
    const {
      name,
      practicalProvinceLabel,
      practicalCityLabel,
      practicalDistrictLabel,
      practicalTownLabel,
      practicalAddress,
      safetyName,
      safetyPhone,
    } = item;
    const { onClick } = this.props;
    const address = [
      practicalProvinceLabel,
      practicalCityLabel,
      practicalDistrictLabel,
      practicalTownLabel,
      practicalAddress,
    ]
      .filter(v => v)
      .join('');
    return (
      <Card
        title={
          <Ellipsis className={styles.ellipsis} lines={1} tooltip>
            {name}
          </Ellipsis>
        }
        hoverable
        onClick={
          onClick
            ? () => {
                onClick(item);
                window.scrollTo(0, 0);
              }
            : undefined
        }
      >
        <div className={styles.cardContent}>
          <div className={styles.cardRow}>
            <div>地址：</div>
            <div>
              {address ? (
                <Ellipsis lines={1} tooltip>
                  {address}
                </Ellipsis>
              ) : (
                <EmptyText />
              )}
            </div>
          </div>
          <div className={styles.cardRow}>
            <div>安全负责人：</div>
            <div>
              {safetyName ? (
                <Ellipsis lines={1} tooltip>
                  {safetyName}
                </Ellipsis>
              ) : (
                <EmptyText />
              )}
            </div>
          </div>
          <div className={styles.cardRow}>
            <div>联系电话：</div>
            <div>
              {safetyPhone ? (
                <Ellipsis lines={1} tooltip>
                  {safetyPhone}
                </Ellipsis>
              ) : (
                <EmptyText />
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  render() {
    const { route, location, match, breadcrumbList, mapper = MAPPER } = this.props;
    const props = {
      content: this.getContent,
      fields: this.getFields,
      renderItem: this.renderItem,
      mapper: mapper,
      route,
      location,
      match,
      breadcrumbList,
    };

    return <ListPage {...props} />;
  }
}
