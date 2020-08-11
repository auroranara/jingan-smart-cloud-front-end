import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import {
  message,
  Card,
  Skeleton,
  Spin,
  Form,
  Row,
  Col,
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
  modelName,
  detailName,
  detailApi,
  addApi,
  editApi,
  listPath,
  parentLocale,
  listLocale,
  detailLocale,
  addLocale,
  editLocale,
} from '../config';
import {
  dateFormat,
  getSelectValueFromEvent,
  Text,
  labelCol,
  wrapperCol,
  col,
  buttonWrapperCol,
  hiddenCol,
} from '@/utils';
import styles from './index.less';

// 获取面包屑
const getBreadcrumbList = ({ name, search }) => {
  const title = {
    detail: detailLocale,
    add: addLocale,
    edit: editLocale,
  }[name];
  return [
    { title: '首页', name: '首页', href: '/' },
    { title: parentLocale, name: parentLocale },
    {
      title: listLocale,
      name: listLocale,
      href: `${listPath}${search}`,
    },
    { title, name: title },
  ];
};
// 根据detail获取values（用于初始化）
const getValuesByDetail = ({
  companyId,
  companyName,
  name,
  departmentId,
  departmentName,
  principal,
  principalName,
  date,
  fileList,
}) => ({
  company: companyId ? { key: companyId, value: companyId, label: companyName } : undefined,
  name: name || undefined,
  department: departmentId
    ? { key: departmentId, value: departmentId, label: departmentName }
    : undefined,
  principal: principal ? { key: principal, value: principal, label: principalName } : undefined,
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
// 根据values获取payload（用于提交）
const getPayloadByValues = ({ company, name, department, principal, date, fileList }) => ({
  companyId: company && company.key,
  name: name && name.trim(),
  departmentId: department && department.key,
  principal: principal && principal.key,
  date: date && date.format(dateFormat),
  fileList,
});
// 获取表单配置
const getFields = ({
  isUnit,
  values,
  name,
  search,
  adding,
  editing,
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
}) => [
  {
    name: 'company',
    label: '单位名称',
    children:
      name !== 'detail' ? (
        <PagingSelect
          options={companyList.list}
          loading={loadingCompanyList}
          disabled={isUnit || name === 'edit'}
          hasMore={
            companyList.pagination &&
            companyList.pagination.total >
              companyList.pagination.pageNum * companyList.pagination.pageSize
          }
          onSearch={name => setCompanyPayload(payload => ({ ...payload, pageNum: 1, name }))}
          loadMore={() =>
            setCompanyPayload(payload => ({ ...payload, pageNum: payload.pageNum + 1 }))
          }
          onChange={onCompanySelectChange}
        />
      ) : (
        <Text type="Select" labelInValue />
      ),
    getValueFromEvent: getSelectValueFromEvent,
    rules: name !== 'detail' ? [{ required: true, message: '请选择单位名称' }] : undefined,
    col: !isUnit ? col : hiddenCol,
  },
  {
    name: 'name',
    label: '名称',
    children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
    rules:
      name !== 'detail'
        ? [
            { required: true, message: '请输入名称' },
            { whitespace: true, message: '名称不能为空格' },
          ]
        : undefined,
    col,
  },
  {
    name: 'principal',
    label: '负责人',
    children:
      name !== 'detail' ? (
        <PagingSelect
          options={values.company ? personList.list : []}
          loading={loadingPersonList}
          hasMore={
            personList.pagination &&
            personList.pagination.total >
              personList.pagination.pageNum * personList.pagination.pageSize
          }
          onSearch={name => setPersonPayload(payload => ({ ...payload, pageNum: 1, name }))}
          loadMore={() =>
            setPersonPayload(payload => ({ ...payload, pageNum: payload.pageNum + 1 }))
          }
          onChange={onPersonSelectChange}
        />
      ) : (
        <Text type="Select" labelInValue />
      ),
    getValueFromEvent: getSelectValueFromEvent,
    rules: name !== 'detail' ? [{ required: true, message: '请选择负责人' }] : undefined,
    col,
  },
  {
    name: 'department',
    label: '所属部门',
    children:
      name !== 'detail' ? (
        <TreeSelect
          placeholder="请选择"
          treeData={values.company ? departmentTree : []}
          labelInValue
          notFoundContent={loadingDepartmentTree ? <Spin size="small" /> : undefined}
          showSearch
          treeNodeFilterProp="title"
        />
      ) : (
        <Text type="TreeSelect" labelInValue />
      ),
    getValueFromEvent: getSelectValueFromEvent,
    rules: name !== 'detail' ? [{ required: true, message: '请选择所属部门' }] : undefined,
    col,
  },
  {
    name: 'date',
    label: '时间',
    children:
      name !== 'detail' ? (
        <DatePicker
          className={styles.datePicker}
          placeholder="请选择"
          format={dateFormat}
          allowClear={false}
        />
      ) : (
        <Text type="DatePicker" format={dateFormat} />
      ),
    rules: name !== 'detail' ? [{ required: true, message: '请选择时间' }] : undefined,
    col,
  },
  {
    name: 'fileList',
    label: '附件',
    children: name !== 'detail' ? <Upload /> : <Text type="Upload" />,
    rules:
      name !== 'detail'
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
        {(name === 'add' || name === 'edit') && (
          <Button type="primary" htmlType="submit" loading={adding || editing}>
            提交
          </Button>
        )}
        <Button href={`#${listPath}${search}`}>返回</Button>
      </div>
    ),
    wrapperCol: buttonWrapperCol,
    col,
  },
];

export default connect(
  state => state,
  null,
  (
    {
      user: {
        currentUser: { unitId, unitName, unitType },
      },
      dict: { companyList, departmentTree, personList },
      [modelName]: { [detailName]: detail },
      loading: {
        effects: {
          [detailApi]: loading,
          [addApi]: adding,
          [editApi]: editing,
          'dict/getCompanyList': loadingCompanyList,
          'dict/getDepartmentTree': loadingDepartmentTree,
          'dict/getPersonList': loadingPersonList,
        },
      },
    },
    { dispatch },
    ownProps
  ) => {
    return {
      ...ownProps,
      unitId,
      unitName,
      isUnit: unitType === 4,
      detail,
      loading,
      adding,
      editing,
      companyList,
      loadingCompanyList,
      departmentTree,
      loadingDepartmentTree,
      personList,
      loadingPersonList,
      getDetail(payload, callback) {
        dispatch({
          type: detailApi,
          payload,
          callback(success, data) {
            if (!success) {
              message.error('获取详情数据失败，请稍后重试！');
            }
            callback && callback(success, data);
          },
        });
      },
      add(payload, callback) {
        dispatch({
          type: addApi,
          payload,
          callback(success, data) {
            if (success) {
              message.success('新增成功！');
            } else {
              message.error('新增失败，请稍后重试！');
            }
            callback && callback(success, data);
          },
        });
      },
      edit(payload, callback) {
        dispatch({
          type: editApi,
          payload,
          callback(success, data) {
            if (success) {
              message.success('编辑成功！');
            } else {
              message.error('编辑失败，请稍后重试！');
            }
            callback && callback(success, data);
          },
        });
      },
      getCompanyList(payload, callback) {
        dispatch({
          type: 'dict/getCompanyList',
          payload,
          callback(success, data) {
            if (!success) {
              message.error('获取单位列表数据失败，请稍后重试！');
            }
            callback && callback(success, data);
          },
        });
      },
      getDepartmentTree(payload, callback) {
        dispatch({
          type: 'dict/getDepartmentTree',
          payload,
          callback(success, data) {
            if (!success) {
              message.error('获取部门树数据失败，请稍后重试！');
            }
            callback && callback(success, data);
          },
        });
      },
      getPersonList(payload, callback) {
        dispatch({
          type: 'dict/getPersonList',
          payload,
          callback(success, data) {
            if (!success) {
              message.error('获取人员列表数据失败，请稍后重试！');
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
      // pathname变化即相当于name和id的变化
      return (
        props.detail === nextProps.detail &&
        props.loading === nextProps.loading &&
        props.adding === nextProps.adding &&
        props.editing === nextProps.editing &&
        props.companyList === nextProps.companyList &&
        props.loadingCompanyList === nextProps.loadingCompanyList &&
        props.departmentTree === nextProps.departmentTree &&
        props.loadingDepartmentTree === nextProps.loadingDepartmentTree &&
        props.personList === nextProps.personList &&
        props.loadingPersonList === nextProps.loadingPersonList &&
        props.location.pathname === nextProps.location.pathname
      );
    },
  }
)(
  ({
    match: {
      params: { id },
    },
    route: { name },
    location: { pathname, search: unsafeSearch },
    unitId,
    unitName,
    isUnit,
    // detail = {},
    loading,
    adding,
    editing,
    companyList,
    loadingCompanyList,
    departmentTree,
    loadingDepartmentTree,
    personList,
    loadingPersonList,
    getDetail,
    add,
    edit,
    getCompanyList,
    getDepartmentTree,
    getPersonList,
  }) => {
    // 创建表单引用
    const [form] = Form.useForm();
    // 创建表单初始值
    const [initialValues] = useState({
      company: isUnit ? { key: unitId, value: unitId, label: unitName } : undefined,
    });
    // 创建单位列表接口对应的payload（通过监听payload的变化来请求接口）
    const [companyPayload, setCompanyPayload] = useState(undefined);
    // 创建人员列表接口对应的payload（同上）
    const [personPayload, setPersonPayload] = useState(undefined);
    // 获取search（用于路由跳转）
    const search = useMemo(
      () => unsafeSearch && (unsafeSearch.startsWith('?') ? unsafeSearch : `?${unsafeSearch}`),
      []
    );
    // 获取面包屑
    const breadcrumbList = useMemo(() => getBreadcrumbList({ name, search }), [name]);
    // 初始化
    useEffect(
      () => {
        if (id) {
          getDetail(
            {
              id,
            },
            (success, data) => {
              if (success) {
                const { companyId } = data;
                // 设置初始值
                form.setFieldsValue(getValuesByDetail(data));
                // 如果companyId存在或者当前账号是单位账号，则获取部门列表和人员列表
                if (companyId || isUnit) {
                  getDepartmentTree({
                    companyId: companyId || unitId,
                  });
                  setPersonPayload({ pageNum: 1, pageSize: 10, companyId: companyId || unitId });
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
          // 如果当前账号是单位账号，则获取部门列表和人员列表
          if (isUnit) {
            getDepartmentTree({
              companyId: unitId,
            });
            setPersonPayload({ pageNum: 1, pageSize: 10, companyId: unitId });
          }
        }
        // 如果当前账号不是单位账号时，则获取单位列表
        if (!isUnit) {
          setCompanyPayload({ pageNum: 1, pageSize: 10 });
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
        // 当前账号是单位账号或者已选择单位时才请求接口
        if (personPayload && personPayload.companyId) {
          getPersonList(personPayload);
        }
      },
      [personPayload]
    );
    // 表单finish事件
    const onFinish = useCallback(
      values => {
        const payload = getPayloadByValues(values);
        if (name === 'add') {
          add(payload, success => {
            if (success) {
              router.push(listPath);
            }
          });
        } else if (name === 'edit') {
          edit(
            {
              id,
              ...payload,
            },
            success => {
              if (success) {
                router.push(`${listPath}${search}`);
              }
            }
          );
        }
      },
      [pathname]
    );
    // 单位选择器change事件
    const onCompanySelectChange = useCallback(company => {
      // 如果已选择单位，则获取部门列表和人员列表
      if (company) {
        getDepartmentTree({
          companyId: company.key,
        });
        setPersonPayload({ pageNum: 1, pageSize: 10, companyId: company.key });
      }
      // 清空部门和人员字段值
      form.setFieldsValue({
        department: undefined,
        principal: undefined,
      });
    }, []);
    // 人员选择器change事件
    const onPersonSelectChange = useCallback((_, { data: { departmentId, departmentName } }) => {
      form.setFieldsValue({
        department: departmentId
          ? { key: departmentId, value: departmentId, label: departmentName }
          : undefined,
      });
    }, []);
    return (
      <PageHeaderLayout
        key={name}
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
                  const values = getFieldsValue();
                  return (
                    <Row gutter={24}>
                      {getFields({
                        isUnit,
                        values,
                        name,
                        search,
                        adding,
                        editing,
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
