import React, { useState, useEffect } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Form from '@/jingan-components/Form';
import { List, Link } from '@/jingan-components/View';
import { Card, Tooltip } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import { connect } from 'dva';
import router from 'umi/router';
import styles from './index.less';

const BREADCRUMB_LIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '物联网监测', name: '物联网监测' },
  { title: 'IOT异常数据及趋势统计', name: 'IOT异常数据及趋势统计' },
];
const API = 'iotStatistics/getCompanyList';
const PAGE_SIZE = 18;
const TRANSFORM = ({ gridId, name, practicalAddress, equipmentType } = {}) => ({
  gridId,
  name: name && name.trim(),
  practicalAddress: practicalAddress && practicalAddress.trim(),
  equipmentType,
});

export default connect(
  ({
    user: { currentUser },
    iotStatistics: { companyList: list },
    loading: {
      effects: { [API]: loading },
    },
  }) => ({
    currentUser,
    list,
    loading,
  }),
  dispatch => ({
    getList(payload, callback) {
      dispatch({
        type: API,
        payload: {
          pageNum: 1,
          pageSize: PAGE_SIZE,
          ...payload,
        },
        callback,
      });
    },
  }),
  null,
  {
    areStatesEqual: () => false,
    areOwnPropsEqual: () => false,
    areStatePropsEqual: () => false,
    areMergedPropsEqual: (props, nextProps) => {
      return props.list === nextProps.list && props.loading === nextProps.loading;
    },
  }
)(
  ({
    currentUser: { unitType, unitId },
    list,
    list: { pagination: { total } = {} } = {},
    loading,
    getList,
  }) => {
    const [values, setValues] = useState(undefined);
    const [reloading, setReloading] = useState(false);
    useEffect(() => {
      if (unitType === 1 || unitType === 4) {
        router.replace(`/company-iot/IOT-abnormal-data/${unitId}`);
      }
    }, []);
    const fields = [
      ...(unitType !== 1 && unitType !== 4
        ? [
            {
              name: 'gridId',
              label: '所属网格',
              component: 'TreeSelect',
              props: {
                preset: 'grid',
                allowClear: true,
              },
            },
          ]
        : []),
      {
        name: 'name',
        label: '单位名称',
        component: 'Input',
      },
      {
        name: 'practicalAddress',
        label: '单位地址',
        component: 'Input',
      },
      {
        name: 'equipmentType',
        label: '监测类型',
        component: 'Select',
        props: {
          preset: 'monitorType',
          params: {
            type: 4,
          },
          allowClear: true,
        },
      },
    ];
    return (
      <PageHeaderLayout
        breadcrumbList={BREADCRUMB_LIST}
        title={BREADCRUMB_LIST[BREADCRUMB_LIST.length - 1].title}
        content={`单位总数：${total || 0}`}
      >
        <Form
          fields={fields}
          onSearch={values => {
            setValues(values);
            setReloading(true);
            getList(TRANSFORM(values), () => {
              setReloading(false);
            });
          }}
          onReset={values => {
            setValues(values);
            setReloading(true);
            getList(TRANSFORM(values), () => {
              setReloading(false);
            });
          }}
        />
        <List
          className={styles.infiniteList}
          list={list}
          loading={loading}
          reloading={reloading}
          getList={(payload, callback) => getList({ ...payload, ...TRANSFORM(values) }, callback)}
          renderItem={({ id: companyId, name, equipmentTypeList }) => (
            <Card
              title={
                <Ellipsis lines={1} tooltip>
                  {name}
                </Ellipsis>
              }
            >
              <div className={styles.iconContainer}>
                {equipmentTypeList.map(({ id, name, logoWebUrl }) => {
                  return (
                    <div className={styles.iconWrapper} key={id}>
                      <Tooltip title={name}>
                        <Link
                          className={styles.icon}
                          style={{ backgroundImage: `url(${logoWebUrl})` }}
                          to={`/company-iot/IOT-abnormal-data/${companyId}/${id}`}
                          target="_blank"
                        />
                      </Tooltip>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        />
      </PageHeaderLayout>
    );
  }
);
