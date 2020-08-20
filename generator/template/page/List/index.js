import React, { useState, useMemo, useCallback, useEffect } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { message, Card, Form, Row, Col, Table } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import moment from 'moment';
import {
  NAMESPACE,
  DETAIL_CODE,
  ADD_CODE,
  EDIT_CODE,
  DELETE_CODE,
  LIST_PATH,
  BREADCRUMB_LIST,
  GET_PAYLOAD_BY_QUERY,
  GET_QUERY_BY_PAYLOAD,
  GET_SEARCH_BY_PAYLOAD,
  TRANSFORM_PAYLOAD,
  TRANSFORM_VALUES,
  GET_LIST_FIELDS,
  GET_COLUMNS,
} from '../config';
import { PAGE_SIZE, getRanges, showTotal } from '@/utils';
import styles from './index.less';

export default connect(
  ({
    user: { currentUser },
    dict: { companyList, departmentTree },
    [NAMESPACE]: { list },
    loading: {
      effects: {
        [`${NAMESPACE}/getList`]: loading,
        [`${NAMESPACE}/delete`]: deleting,
        'dict/getCompanyList': loadingCompanyList,
        'dict/getDepartmentTree': loadingDepartmentTree,
      },
    },
  }) => ({
    currentUser,
    list,
    loading,
    deleting,
    companyList,
    loadingCompanyList,
    departmentTree,
    loadingDepartmentTree,
  })
)(
  ({
    location: { query },
    currentUser,
    list: { list = [], pagination: { total, pageNum, pageSize } = {} },
    loading,
    deleting,
    companyList,
    loadingCompanyList,
    departmentTree,
    loadingDepartmentTree,
    dispatch,
  }) => {
    // 创建表单引用
    const [form] = Form.useForm();
    // 创建列表接口对应的payload（通过监听payload的变化来请求接口）
    const [payload, setPayload] = useState(undefined);
    // 创建单位列表接口对应的payload（同上）
    const [companyPayload, setCompanyPayload] = useState(undefined);
    // 获取路径参数
    const search = useMemo(() => GET_SEARCH_BY_PAYLOAD(payload), [payload]);
    // 获取当前账号是否为单位、所属单位、增删改查权限
    const {
      isUnit,
      company,
      hasDetailAuthority,
      hasAddAuthority,
      hasEditAuthority,
      hasDeleteAuthority,
    } = useMemo(() => {
      const { unitType, unitId, unitName, permissionCodes } = currentUser;
      const isUnit = unitType === 4;
      return {
        isUnit,
        company: isUnit ? { key: unitId, value: unitId, label: unitName } : undefined,
        hasDetailAuthority: permissionCodes.includes(DETAIL_CODE),
        hasAddAuthority: permissionCodes.includes(ADD_CODE),
        hasEditAuthority: permissionCodes.includes(EDIT_CODE),
        hasDeleteAuthority: permissionCodes.includes(DELETE_CODE),
      };
    }, []);
    // 获取表单初始值
    const initialValues = useMemo(
      () => ({
        company,
      }),
      []
    );
    // 获取时间范围选择器的快捷选项
    const ranges = useMemo(() => getRanges(), [+moment().startOf('day')]);
    // 获取列表接口
    const getList = useCallback(
      (payload, callback) =>
        dispatch({
          type: `${NAMESPACE}/getList`,
          payload: TRANSFORM_PAYLOAD(payload),
          callback(isSuccess, dataOrMsg) {
            if (!isSuccess) {
              message.error(`获取列表数据失败，${dataOrMsg || '请稍后重试'}！`);
            }
            callback && callback(dataOrMsg);
          },
        }),
      []
    );
    // 删除列表接口
    const deleteList = useCallback(
      (payload, callback) =>
        dispatch({
          type: `${NAMESPACE}/delete`,
          payload,
          callback(isSuccess, dataOrMsg) {
            if (isSuccess) {
              message.success('删除成功！');
              // 删除成功以后重新加载当前页的数据
              setPayload(payload => ({ ...payload }));
            } else {
              message.error(`删除失败，${dataOrMsg || '请稍后重试'}！`);
            }
            callback && callback(dataOrMsg);
          },
        }),
      []
    );
    // 获取单位列表接口
    const getCompanyList = useCallback(
      (payload, callback) =>
        dispatch({
          type: 'dict/getCompanyList',
          payload,
          callback(isSuccess, dataOrMsg) {
            if (!isSuccess) {
              message.error(`获取单位列表数据失败，${dataOrMsg || '请稍后重试'}！`);
            }
            callback && callback(dataOrMsg);
          },
        }),
      []
    );
    // 获取部门树接口
    const getDepartmentTree = useCallback(
      (payload, callback) =>
        dispatch({
          type: 'dict/getDepartmentTree',
          payload,
          callback(isSuccess, dataOrMsg) {
            if (!isSuccess) {
              message.error(`获取部门树数据失败，${dataOrMsg || '请稍后重试'}！`);
            }
            callback && callback(dataOrMsg);
          },
        }),
      []
    );
    // 单位选择器change事件
    const onCompanySelectChange = useCallback(company => {
      // 如果已选择单位，则获取部门树
      if (company) {
        getDepartmentTree({
          companyId: company.key,
        });
      }
      // 清空部门字段值
      form.setFieldsValue({ department: undefined });
    }, []);
    // 表单finish事件
    const onFinish = useCallback(
      values => setPayload(payload => ({ ...payload, ...TRANSFORM_VALUES(values), pageNum: 1 })),
      []
    );
    // 表格change事件
    const onTableChange = useCallback(
      ({ current, pageSize }) =>
        setPayload(payload => ({
          ...payload,
          pageNum: pageSize === payload.pageSize ? current : 1,
          pageSize,
        })),
      []
    );
    // 获取表格配置
    const columns = useMemo(
      () =>
        GET_COLUMNS({
          search,
          isUnit,
          hasDetailAuthority,
          hasEditAuthority,
          hasDeleteAuthority,
          deleteList,
        }),
      [search]
    );
    // 初始化
    useEffect(() => {
      // 获取payload
      const initialQuery = GET_QUERY_BY_PAYLOAD(initialValues);
      const payload = GET_PAYLOAD_BY_QUERY({
        ...initialQuery,
        ...query,
        company: isUnit ? initialQuery.company : query.company,
      });
      // 获取列表
      setPayload(payload);
      // 如果当前账号不是单位账号，则获取单位列表
      if (!isUnit) {
        setCompanyPayload({ pageNum: 1, pageSize: PAGE_SIZE });
      }
      // 如果已选择单位，则获取部门树
      if (payload.company) {
        getDepartmentTree({
          companyId: payload.company.key,
        });
      }
    }, []);
    // 当payload发生变化时获取列表
    useEffect(
      () => {
        if (payload) {
          // 请求接口
          getList(payload);
          // 获取values
          const { pageNum, pageSize, ...values } = payload;
          // 设置表单值
          form.setFieldsValue(values);
          // 设置路径
          router.replace(`${LIST_PATH}${GET_SEARCH_BY_PAYLOAD(payload)}`);
        }
      },
      [payload]
    );
    // 当companyPayload发生变化时获取单位列表
    useEffect(
      () => {
        if (companyPayload) {
          getCompanyList(companyPayload);
        }
      },
      [companyPayload]
    );
    return (
      <PageHeaderLayout
        breadcrumbList={BREADCRUMB_LIST}
        title={BREADCRUMB_LIST[BREADCRUMB_LIST.length - 1].title}
      >
        <Card className={styles.formCard}>
          <Form form={form} initialValues={initialValues} onFinish={onFinish}>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, values) =>
                ['company'].some(dependency => prevValues[dependency] !== values[dependency])
              }
            >
              {({ getFieldsValue }) => {
                const values = { ...initialValues, ...getFieldsValue() };
                return (
                  <Row gutter={24}>
                    {GET_LIST_FIELDS({
                      form,
                      values,
                      search,
                      isUnit,
                      hasAddAuthority,
                      companyList,
                      loadingCompanyList,
                      setCompanyPayload,
                      onCompanySelectChange,
                      departmentTree,
                      loadingDepartmentTree,
                      ranges,
                    }).map(({ name, col, ...item }, index) => (
                      <Col key={name || index} {...col}>
                        <Form.Item name={name} {...item} />
                      </Col>
                    ))}
                  </Row>
                );
              }}
            </Form.Item>
          </Form>
        </Card>
        <Card>
          <Table
            className={styles.table}
            rowKey="id"
            columns={columns}
            dataSource={list}
            loading={loading || deleting}
            scroll={{
              x: true,
            }}
            pagination={{
              total,
              current: pageNum,
              pageSize,
              showTotal,
              showQuickJumper: true,
              showSizeChanger: true,
            }}
            onChange={onTableChange}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
);
