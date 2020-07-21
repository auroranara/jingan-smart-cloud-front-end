import React, { useState, useEffect } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { message, Card, Form, Table, Input, Select, Button } from 'antd';
import Link from 'umi/link';
import router from 'umi/router';
import { connect } from 'dva';
import moment from 'moment';
import {
  NAMESPACE,
  LIST_NAME,
  LIST_API,
  DETAIL_CODE,
  ADD_CODE,
  EDIT_CODE,
  DELETE_CODE,
} from '../config';
import styles from './index.less';

const BREADCRUMB_LIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '风险分级管控', name: '风险分级管控' },
  { title: '危险与可操作性分析（HAZOP）', name: '危险与可操作性分析（HAZOP）' },
];
const PAGE_SIZE = 10;
const FORMAT = 'YYYY-MM-DD';
const GET_PAYLOAD_BY_QUERY = ({ pageNum, pageSize, name, department, startDate, endDate }) => ({
  pageNum: pageNum > 0 ? +pageNum : 1,
  pageSize: pageSize > 0 ? +pageSize : 10,
  name: name ? decodeURIComponent(name) : undefined,
  department: department ? JSON.parse(decodeURIComponent(department)) : undefined,
  range: startDate && endDate ? [moment(+startDate), moment(+endDate)] : undefined,
});
const GET_QUERY_BY_PAYLOAD = ({ pageNum, pageSize, name, department, range }) => {
  const [startDate, endDate] = range || [];
  return {
    pageNum,
    pageSize,
    name: name ? encodeURIComponent(name.trim()) : undefined,
    department: department ? encodeURIComponent(JSON.stringify(department)) : undefined,
    startDate: startDate ? +startDate : undefined,
    endDate: endDate ? +endDate : undefined,
  };
};
const TRANSFORM_PAYLOAD = ({ department, range, ...payload }) => {
  const [startDate, endDate] = range || {};
  return {
    ...payload,
    departmentId: department && department.key,
    startDate: startDate && startDate.format(FORMAT),
    endDate: endDate && endDate.format(FORMAT),
  };
};

export default connect(
  state => state,
  null,
  (
    {
      user: {
        currentUser: { unitId, unitType, permissionCodes },
      },
      [NAMESPACE]: { [LIST_NAME]: list },
      loading: {
        effects: { [LIST_API]: loading },
      },
    },
    { dispatch },
    ownProps
  ) => {
    return {
      ...ownProps,
      unitId,
      isUnit: unitType === 4,
      hasDetailAuthority: permissionCodes.includes(DETAIL_CODE),
      hasAddAuthority: permissionCodes.includes(ADD_CODE),
      hasEditAuthority: permissionCodes.includes(EDIT_CODE),
      hasDeleteAuthority: permissionCodes.includes(DELETE_CODE),
      list,
      loading,
      getList(payload, callback) {
        dispatch({
          type: LIST_API,
          payload: TRANSFORM_PAYLOAD(payload),
          callback(success, data) {
            if (!success) {
              message.error('获取列表数据失败，请稍后重试！');
            }
            callback && callback(success, data);
          },
        });
      },
    };
  },
  {
    areStatesEqual: () => false,
    areOwnPropsEqual: () => false,
    areStatePropsEqual: () => false,
    areMergedPropsEqual: (nextProps, props) => {
      console.log(props.location.query === nextProps.location.query);
      return (
        (props.list === nextProps.list && props.loading === nextProps.loading) ||
        props.location.query === nextProps.location.query
      );
    },
  }
)(
  ({
    location: { pathname, query },
    unitId,
    isUnit,
    hasDetailAuthority,
    hasAddAuthority,
    hasEditAuthority,
    hasDeleteAuthority,
    list,
    loading,
    getList,
  }) => {
    const [form] = Form.useForm();
    // 初始化
    useEffect(() => {
      // 根据query获取payload
      const payload = GET_PAYLOAD_BY_QUERY(query);
      // 根据payload获取数据
      getList(payload);
      // 根据payload获取values
      const { pageNum, pageSize, ...values } = payload;
      // 根据values设置表单值
      form.setFieldsValue(values);
    }, []);
    // 查询按钮点击事件
    const onSearch = values => {
      // 从model中获取pageSize
      const { pagination: { pageSize = PAGE_SIZE } = {} } = list || {};
      // 获取payload
      const payload = {
        pageNum: 1,
        pageSize,
        ...values,
      };
      // 根据payload获取数据
      getList(payload);
      // 根据payload获取query
      const query = GET_QUERY_BY_PAYLOAD(payload);
      // 根据query生成新的路由
      router.replace({
        pathname,
        query,
      });
    };
    return (
      <PageHeaderLayout
        breadcrumbList={BREADCRUMB_LIST}
        title={BREADCRUMB_LIST[BREADCRUMB_LIST.length - 1].title}
      >
        <Card
          className={styles.formCard}
          onClick={() => {
            router.replace({
              pathname,
              query: {
                pageNum: 1,
                pageSize: 10,
              },
            });
          }}
        >
          123
        </Card>
        <Card
          onClick={() => {
            router.replace({
              pathname,
              query: {
                pageNum: '1',
                pageSize: '10',
              },
            });
          }}
        >
          123
        </Card>
      </PageHeaderLayout>
    );
  }
);
