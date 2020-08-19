import React, { useState, useMemo, useCallback, useEffect } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import {
  message,
  Card,
  Skeleton,
  Form,
  Row,
  Col,
  Spin,
  Input,
  TreeSelect,
  DatePicker,
  Button,
} from 'antd';
import Upload from '@/jingan-components/Form/Upload';
import PagingSelect from '@/jingan-components/PagingSelect';
import router from 'umi/router';
import { connect } from 'dva';
import moment from 'moment';
import {
  NAMESPACE,
  LIST_PATH,
  PARENT_LOCALE,
  LIST_LOCALE,
  DETAIL_LOCALE,
  ADD_LOCALE,
  EDIT_LOCALE,
} from '../config';
import {
  PAGE_SIZE,
  col,
  hiddenCol,
  labelCol,
  wrapperCol,
  buttonWrapperCol,
  dateFormat,
  getSelectValueFromEvent,
  Text,
} from '@/utils';
import styles from './index.less';

/* 获取面包屑 */
const GET_BREADCRUMB_LIST = ({ name, search }) => {
  const title = {
    detail: DETAIL_LOCALE,
    add: ADD_LOCALE,
    edit: EDIT_LOCALE,
  }[name];
  return [
    { title: '首页', name: '首页', href: '/' },
    { title: PARENT_LOCALE, name: PARENT_LOCALE },
    {
      title: LIST_LOCALE,
      name: LIST_LOCALE,
      href: `${LIST_PATH}${search}`,
    },
    { title, name: title },
  ];
};
/* 根据detail获取values（用于初始化） */
const GET_VALUES_BY_DETAIL = ({
  id,
  companyId,
  companyName,
  name,
  principal,
  principalName,
  departmentId,
  departmentName,
  date,
  fileList,
}) => ({
  id: id || undefined,
  company: companyId ? { key: companyId, value: companyId, label: companyName } : undefined,
  name: name || undefined,
  principal: principal ? { key: principal, value: principal, label: principalName } : undefined,
  department: departmentId
    ? { key: departmentId, value: departmentId, label: departmentName }
    : undefined,
  date: date ? moment(date) : undefined,
  fileList: fileList
    ? fileList.map((item, index) => ({
        ...item,
        url: item.webUrl,
        status: 'done',
        uid: -index - 1,
        name: item.fileName,
      }))
    : undefined,
});
/* 根据values获取payload（用于提交） */
const GET_PAYLOAD_BY_VALUES = ({ company, name, department, principal, date, ...rest }) => ({
  ...rest,
  companyId: company && company.key,
  name: name && name.trim(),
  principal: principal && principal.key,
  departmentId: department && department.key,
  date: date && date.format(dateFormat),
});
/* 获取表单配置 */
const GET_FIELDS = ({
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
}) => {
  const isNotDetail = name !== 'detail';
  return [
    {
      name: 'id',
      children: <Text />,
      hidden: true,
      col: hiddenCol,
    },
    {
      name: 'company',
      label: '单位名称',
      children: isNotDetail ? (
        <PagingSelect
          options={companyList.list}
          loading={loadingCompanyList}
          hasMore={
            companyList.pagination &&
            companyList.pagination.total >
              companyList.pagination.pageNum * companyList.pagination.pageSize
          }
          loadMore={() =>
            setCompanyPayload(payload => ({ ...payload, pageNum: payload.pageNum + 1 }))
          }
          onSearch={name => setCompanyPayload(payload => ({ ...payload, pageNum: 1, name }))}
          onChange={onCompanySelectChange}
          disabled={name !== 'add'}
        />
      ) : (
        <Text type="Select" labelInValue />
      ),
      getValueFromEvent: getSelectValueFromEvent,
      rules: isNotDetail ? [{ required: true, message: '请选择单位名称' }] : undefined,
      hidden: isUnit,
      col: isUnit ? hiddenCol : col,
    },
    {
      name: 'name',
      label: '名称',
      children: isNotDetail ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules: isNotDetail
        ? [
            { required: true, message: '请输入名称' },
            { whitespace: true, message: '名称不能只为空格' },
          ]
        : undefined,
      col,
    },
    {
      name: 'principal',
      label: '负责人',
      children: isNotDetail ? (
        <PagingSelect
          options={values.company ? personList.list : []}
          loading={loadingPersonList}
          hasMore={
            personList.pagination &&
            personList.pagination.total >
              personList.pagination.pageNum * personList.pagination.pageSize
          }
          loadMore={() =>
            setPersonPayload(payload => ({ ...payload, pageNum: payload.pageNum + 1 }))
          }
          onSearch={name => setPersonPayload(payload => ({ ...payload, pageNum: 1, name }))}
          onChange={onPersonSelectChange}
        />
      ) : (
        <Text type="Select" labelInValue />
      ),
      getValueFromEvent: getSelectValueFromEvent,
      rules: isNotDetail ? [{ required: true, message: '请选择负责人' }] : undefined,
      col,
    },
    {
      name: 'department',
      label: '所属部门',
      children: isNotDetail ? (
        <TreeSelect
          placeholder="请选择"
          treeData={values.company ? departmentTree : []}
          notFoundContent={loadingDepartmentTree ? <Spin size="small" /> : undefined}
          treeNodeFilterProp="title"
          showSearch
          labelInValue
        />
      ) : (
        <Text type="TreeSelect" labelInValue />
      ),
      getValueFromEvent: getSelectValueFromEvent,
      rules: isNotDetail ? [{ required: true, message: '请选择所属部门' }] : undefined,
      col,
    },
    {
      name: 'date',
      label: '时间',
      children: isNotDetail ? (
        <DatePicker
          className={styles.datePicker}
          placeholder="请选择"
          format={dateFormat}
          allowClear={false}
        />
      ) : (
        <Text type="DatePicker" format={dateFormat} />
      ),
      rules: isNotDetail ? [{ required: true, message: '请选择时间' }] : undefined,
      col,
    },
    {
      name: 'fileList',
      label: '附件',
      children: isNotDetail ? <Upload /> : <Text type="Upload" />,
      rules: isNotDetail
        ? [
            {
              required: true,
              type: 'array',
              min: 1,
              message: '请上传附件',
            },
          ]
        : undefined,
      col,
    },
    {
      children: (
        <div className={styles.buttonContainer}>
          {isNotDetail && (
            <Button type="primary" htmlType="submit" loading={submitting}>
              提交
            </Button>
          )}
          <Button href={`#${LIST_PATH}${search}`}>返回</Button>
        </div>
      ),
      wrapperCol: buttonWrapperCol,
      col,
    },
  ];
};

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
    location: { pathname, search: unsafeSearch },
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
              router.push(LIST_PATH);
            } else {
              message.error(`新增失败，${dataOrMsg || '请稍后重试'}！`);
            }
            callback && callback(dataOrMsg);
          },
        }),
      []
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
                      {GET_FIELDS({
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
