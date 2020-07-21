import React, { useState, useEffect } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { message, Card, Form, Table, Input, Select, Button } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
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
const GET_VALUES_BY_QUERY = () => {};

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
          payload: {
            pageNum: 1,
            pageSize: 10,
            ...payload,
          },
          callback(success, data) {
            if (success) {
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
    areMergedPropsEqual: (props, nextProps) =>
      props.list === nextProps.list && props.loading === nextProps.loading,
  }
)(
  ({
    location: { query },
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
    const [values, setValues] = useState(undefined);
    // 初始化
    useEffect(() => {
      // 获取数据
      getList({});
      //
    }, []);
    // 查询按钮点击事件
    const onSearch = values => {
      // 调用接口获取数据
      // 将当前值通过路由保存
    };
    return (
      <PageHeaderLayout
        breadcrumbList={BREADCRUMB_LIST}
        title={BREADCRUMB_LIST[BREADCRUMB_LIST.length - 1].title}
      >
        <Card className={styles.formCard}>123</Card>
        <Card>123</Card>
      </PageHeaderLayout>
    );
  }
);
