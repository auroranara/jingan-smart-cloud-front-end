import React, { useState, useMemo, useCallback, useEffect } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { message, Card, Skeleton, Form, Row, Col } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import {
  NAMESPACE,
  LIST_PATH,
  GET_BREADCRUMB_LIST,
  GET_VALUES_BY_DETAIL,
  GET_PAYLOAD_BY_VALUES,
  GET_FORM_FIELDS,
} from '../config';
import { PAGE_SIZE, labelCol, wrapperCol } from '@/utils';
import styles from './index.less';

export default connect(
  ({
    user: { currentUser },
    dict: { companyList, personList, departmentTree },
    [NAMESPACE]: { detail },
    loading: {
      models: { [NAMESPACE]: submitting },
      effects: {
        [`${NAMESPACE}/getDetail`]: loading,
        'dict/getCompanyList': loadingCompanyList,
        'dict/getDepartmentTree': loadingDepartmentTree,
        'dict/getPersonList': loadingPersonList,
      },
    },
  }) => ({
    currentUser,
    detail,
    loading,
    submitting,
    companyList,
    loadingCompanyList,
    personList,
    loadingPersonList,
    departmentTree,
    loadingDepartmentTree,
  })
)(
  ({
    match: {
      params: { id },
    },
    route: { name },
    location: { pathname, search: unsafeSearch, query },
    currentUser,
    detail,
    loading,
    submitting,
    companyList,
    loadingCompanyList,
    personList,
    loadingPersonList,
    departmentTree,
    loadingDepartmentTree,
    dispatch,
  }) => {
    // 创建表单引用
    const [form] = Form.useForm();
    // 创建单位列表接口对应的payload（通过监听payload的变化来请求接口）
    const [companyPayload, setCompanyPayload] = useState(undefined);
    // 创建人员列表接口对应的payload（同上）
    const [personPayload, setPersonPayload] = useState(undefined);
    // 创建部门树接口对应的payload（同上）
    const [departmentPayload, setDepartmentPayload] = useState(undefined);
    // 获取search（用于路由跳转）
    const search = useMemo(
      () => unsafeSearch && (unsafeSearch.startsWith('?') ? unsafeSearch : `?${unsafeSearch}`),
      []
    );
    // 获取当前账号是否为单位、所属单位
    const { isUnit, company } = useMemo(() => {
      const { unitType, unitId, unitName } = currentUser;
      const isUnit = unitType === 4;
      return {
        isUnit,
        company: isUnit ? { key: unitId, value: unitId, label: unitName } : undefined,
      };
    }, []);
    // 获取表单初始值
    const initialValues = useMemo(
      () => ({
        company,
      }),
      []
    );
    // 获取面包屑
    const breadcrumbList = useMemo(() => GET_BREADCRUMB_LIST({ name, search }), [name, search]);
    // 获取列表接口
    const getDetail = useCallback(
      (payload, callback) =>
        dispatch({
          type: `${NAMESPACE}/getDetail`,
          payload,
          callback(isSuccess, dataOrMsg) {
            if (!isSuccess) {
              message.error(`获取详情数据失败，${dataOrMsg || '请稍后重试'}！`);
            }
            callback && callback(dataOrMsg);
          },
        }),
      []
    );
    // 新增接口
    const add = useCallback(
      (payload, callback) =>
        dispatch({
          type: `${NAMESPACE}/add`,
          payload,
          callback(isSuccess, dataOrMsg) {
            if (isSuccess) {
              message.success('新增成功！');
              // 新增成功以后返回列表页面的第一页以方便查看新增的数据
              router.push(
                `${LIST_PATH}?pageSize=${query.pageSize > 0 ? query.pageSize : PAGE_SIZE}`
              );
            } else {
              message.error(`新增失败，${dataOrMsg || '请稍后重试'}！`);
            }
            callback && callback(dataOrMsg);
          },
        }),
      [search]
    );
    // 新增接口
    const edit = useCallback(
      (payload, callback) =>
        dispatch({
          type: `${NAMESPACE}/edit`,
          payload,
          callback(isSuccess, dataOrMsg) {
            if (isSuccess) {
              message.success('编辑成功！');
              // 编辑成功以后返回列表页面并带回参数以方便查看编辑的数据
              router.push(`${LIST_PATH}${search}`);
            } else {
              message.error(`编辑失败，${dataOrMsg || '请稍后重试'}！`);
            }
            callback && callback(dataOrMsg);
          },
        }),
      [search]
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
    // 获取人员列表接口
    const getPersonList = useCallback(
      (payload, callback) =>
        dispatch({
          type: 'dict/getPersonList',
          payload,
          callback(isSuccess, dataOrMsg) {
            if (!isSuccess) {
              message.error(`获取人员列表数据失败，${dataOrMsg || '请稍后重试'}！`);
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
      // 如果已选择单位，则获取人员列表、部门树
      if (company) {
        setPersonPayload({ pageNum: 1, pageSize: PAGE_SIZE, companyId: company.key });
        setDepartmentPayload({
          companyId: company.key,
        });
      }
      // 清空人员、部门字段值
      form.setFieldsValue({
        principal: undefined,
        department: undefined,
      });
    }, []);
    // 人员选择器change事件
    const onPersonSelectChange = useCallback((_, { data: { departmentId, departmentName } }) => {
      // 设置部门字段值
      form.setFieldsValue({
        department: departmentId
          ? { key: departmentId, value: departmentId, label: departmentName }
          : undefined,
      });
    }, []);
    // 表单finish事件
    const onFinish = useCallback(
      values => {
        const payload = GET_PAYLOAD_BY_VALUES(values);
        if (name === 'add') {
          add(payload);
        } else if (name === 'edit') {
          edit(payload);
        }
      },
      [pathname]
    );
    // 初始化
    useEffect(
      () => {
        if (id) {
          getDetail(
            {
              id,
            },
            (isSuccess, dataOrMsg) => {
              if (isSuccess) {
                const { companyId } = dataOrMsg;
                if (companyId) {
                  // 设置初始值
                  form.setFieldsValue(GET_VALUES_BY_DETAIL(dataOrMsg));
                  // 获取人员列表、部门树
                  setPersonPayload({ pageNum: 1, pageSize: PAGE_SIZE, companyId });
                  setDepartmentPayload({ companyId });
                } else {
                  // 重置初始值
                  form.resetFields();
                }
              } else {
                // 重置初始值
                form.resetFields();
              }
            }
          );
        } else {
          // 重置初始值
          form.resetFields();
          // 如果当前账号是单位账号，则获取人员列表、部门树
          if (isUnit) {
            setPersonPayload({ pageNum: 1, pageSize: PAGE_SIZE, companyId: company.key });
            setDepartmentPayload({
              companyId: company.key,
            });
          }
        }
        // 如果当前账号不是单位账号时，则获取单位列表
        if (!isUnit) {
          setCompanyPayload({ pageNum: 1, pageSize: PAGE_SIZE });
        }
      },
      [pathname]
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
    // 当personPayload发生变化时获取人员列表
    useEffect(
      () => {
        if (personPayload && personPayload.companyId) {
          getPersonList(personPayload);
        }
      },
      [personPayload]
    );
    // 当departmentPayload发生变化时获取部门树
    useEffect(
      () => {
        if (departmentPayload && departmentPayload.companyId) {
          getDepartmentTree(departmentPayload);
        }
      },
      [departmentPayload]
    );
    return (
      <PageHeaderLayout
        key={`${name}${search}`}
        breadcrumbList={breadcrumbList}
        title={breadcrumbList[breadcrumbList.length - 1].title}
      >
        <Card>
          {loading ? (
            <Skeleton active />
          ) : (
            <Form
              className={styles.form}
              form={form}
              initialValues={initialValues}
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              onFinish={onFinish}
            >
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, values) =>
                  ['company'].some(dependency => prevValues[dependency] !== values[dependency])
                }
              >
                {({ getFieldsValue }) => {
                  const values = { ...GET_VALUES_BY_DETAIL(detail), ...getFieldsValue() };
                  return (
                    <Row gutter={24}>
                      {GET_FORM_FIELDS({
                        values,
                        name,
                        search,
                        isUnit,
                        submitting,
                        companyList,
                        loadingCompanyList,
                        setCompanyPayload,
                        onCompanySelectChange,
                        personList,
                        loadingPersonList,
                        setPersonPayload,
                        onPersonSelectChange,
                        departmentTree,
                        loadingDepartmentTree,
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
          )}
        </Card>
      </PageHeaderLayout>
    );
  }
);
