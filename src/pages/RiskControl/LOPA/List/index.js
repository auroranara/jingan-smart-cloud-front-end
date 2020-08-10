import React, { useState, useEffect, useMemo, useCallback, Fragment } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import {
  message,
  Card,
  Form,
  Row,
  Col,
  Spin,
  Input,
  TreeSelect,
  DatePicker,
  Button,
  Table,
  Divider,
  Popconfirm,
} from 'antd';
import PagingSelect from '@/jingan-components/PagingSelect';
import Link from 'umi/link';
import { connect } from 'dva';
import moment from 'moment';
import { stringify } from 'qs';
import {
  modelName,
  listName,
  listApi,
  deleteApi,
  detailCode,
  addCode,
  editCode,
  deleteCode,
  detailPath,
  addPath,
  editPath,
  parentLocale,
  listLocale,
} from '../config';
import {
  dateFormat,
  getRanges,
  showTotal,
  getSelectValueFromEvent,
  EmptyText,
  dateRangePickerPlaceholder,
  listPageCol,
  hiddenCol,
} from '@/utils';
import styles from './index.less';
const { RangePicker } = DatePicker;

// 面包屑
const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: parentLocale, name: parentLocale },
  { title: listLocale, name: listLocale },
];
// 根据query获取payload（用于初始化）
const getPayloadByQuery = ({
  pageNum,
  pageSize,
  company,
  name,
  department,
  assessmentStartDate,
  assessmentEndDate,
}) => ({
  pageNum: pageNum > 0 ? +pageNum : 1,
  pageSize: pageSize > 0 ? +pageSize : 10,
  company: company ? JSON.parse(decodeURIComponent(company)) : undefined,
  name: name ? decodeURIComponent(name) : undefined,
  department: department ? JSON.parse(decodeURIComponent(department)) : undefined,
  range:
    assessmentStartDate && assessmentEndDate
      ? [moment(+assessmentStartDate), moment(+assessmentEndDate)]
      : undefined,
});
// 根据payload获取search（用于路由跳转）
const getSearchByPayload = ({ company, name, department, range, ...rest } = {}) => {
  const [assessmentStartDate, assessmentEndDate] = range || [];
  const query = {
    ...rest,
    company: company ? encodeURIComponent(JSON.stringify(company)) : undefined,
    name: name ? encodeURIComponent(name) : undefined,
    department: department ? encodeURIComponent(JSON.stringify(department)) : undefined,
    assessmentStartDate: assessmentStartDate ? +assessmentStartDate : undefined,
    assessmentEndDate: assessmentEndDate ? +assessmentEndDate : undefined,
  };
  const search = stringify(query);
  return search && `?${search}`;
};
// 转换payload为接口需要的格式
const transformPayload = ({ company, department, range, ...rest }) => {
  const [assessmentStartDate, assessmentEndDate] = range || [];
  return {
    ...rest,
    companyId: company && company.key,
    departmentId: department && department.key,
    assessmentStartDate: assessmentStartDate && assessmentStartDate.format(dateFormat),
    assessmentEndDate: assessmentEndDate && assessmentEndDate.format(dateFormat),
  };
};
// 转换values为payload需要的格式（基本上只对输入框值进行trim）
const transformValues = ({ name, ...rest }) => ({
  ...rest,
  name: name && name.trim(),
});
// 获取表单配置
const getFields = ({
  isUnit,
  values,
  form,
  search,
  hasAddAuthority,
  companyList,
  loadingCompanyList,
  setCompanyPayload,
  onCompanySelectChange,
  departmentTree,
  loadingDepartmentTree,
  ranges,
}) => [
  {
    name: 'company',
    label: '单位名称',
    children: (
      <PagingSelect
        options={companyList.list}
        loading={loadingCompanyList}
        allowClear
        disabled={isUnit}
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
    ),
    getValueFromEvent: getSelectValueFromEvent,
    col: !isUnit ? listPageCol : hiddenCol,
  },
  {
    name: 'name',
    label: '名称',
    children: <Input placeholder="请输入" maxLength={50} allowClear />,
    col: listPageCol,
  },
  {
    name: 'department',
    label: '所属部门',
    children: (
      <TreeSelect
        placeholder="请选择"
        treeData={values.company ? departmentTree : []}
        labelInValue
        notFoundContent={loadingDepartmentTree ? <Spin size="small" /> : undefined}
        showSearch
        treeNodeFilterProp="title"
        allowClear
      />
    ),
    getValueFromEvent: getSelectValueFromEvent,
    col: listPageCol,
  },
  {
    name: 'range',
    label: '时间',
    children: (
      <RangePicker
        className={styles.rangePicker}
        placeholder={dateRangePickerPlaceholder}
        format={dateFormat}
        separator="~"
        ranges={ranges}
        allowClear
      />
    ),
    col: listPageCol,
  },
  {
    children: (
      <div className={styles.buttonContainer}>
        <Button type="primary" htmlType="submit">
          查询
        </Button>
        <Button
          onClick={() => {
            form.resetFields();
            form.submit();
          }}
        >
          重置
        </Button>
        <Button type="primary" href={`#${addPath}${search}`} disabled={!hasAddAuthority}>
          新增
        </Button>
      </div>
    ),
    col: isUnit
      ? {
          xxl: 6,
          xl: 24,
          lg: 12,
          md: 12,
          sm: 24,
          xs: 24,
        }
      : {
          xxl: 24,
          xl: 16,
          lg: 24,
          md: 24,
          sm: 24,
          xs: 24,
        },
  },
];
// 获取表格配置
const getColumns = ({
  isUnit,
  search,
  hasDetailAuthority,
  hasEditAuthority,
  hasDeleteAuthority,
  deleteList,
  setPayload,
}) => [
  ...(!isUnit
    ? [
        {
          dataIndex: 'companyName',
          title: '单位名称',
          render: value => value || <EmptyText />,
        },
      ]
    : []),
  {
    dataIndex: 'name',
    title: '名称',
    render: value => value || <EmptyText />,
  },
  {
    dataIndex: 'departmentName',
    title: '部门',
    render: value => value || <EmptyText />,
  },
  {
    dataIndex: 'principalName',
    title: '负责人',
    render: value => value || <EmptyText />,
  },
  {
    dataIndex: 'assessmentDate',
    title: '评定时间',
    render: value => (value ? moment(value).format(dateFormat) : <EmptyText />),
  },
  {
    dataIndex: 'otherFileList',
    title: '分析报告附件',
    render: value =>
      value && value.length ? (
        <Fragment>
          {value.map((item, index) => (
            <div key={index}>
              <a href={item.webUrl} target="_blank" rel="noopener noreferrer">
                {item.fileName}
              </a>
            </div>
          ))}
        </Fragment>
      ) : (
        <EmptyText />
      ),
  },
  {
    dataIndex: '操作',
    title: '操作',
    render: (_, data) => (
      <Fragment>
        <Link to={`${detailPath}/${data.id}${search}`} disabled={!hasDetailAuthority}>
          查看
        </Link>
        <Divider type="vertical" />
        <Link to={`${editPath}/${data.id}${search}`} disabled={!hasEditAuthority}>
          编辑
        </Link>
        <Divider type="vertical" />
        <Popconfirm
          title="您确定要删除这条数据吗？"
          onConfirm={() => {
            deleteList(
              {
                id: data.id,
              },
              success => {
                if (success) {
                  setPayload(payload => ({ ...payload }));
                }
              }
            );
          }}
          disabled={!hasDeleteAuthority}
        >
          <Link to="/" disabled={!hasDeleteAuthority}>
            删除
          </Link>
        </Popconfirm>
      </Fragment>
    ),
  },
];

export default connect(
  state => state,
  null,
  (
    {
      user: {
        currentUser: { unitId, unitName, unitType, permissionCodes },
      },
      dict: { companyList, departmentTree },
      [modelName]: { [listName]: list },
      loading: {
        effects: {
          [listApi]: loading,
          [deleteApi]: deleting,
          'dict/getCompanyList': loadingCompanyList,
          'dict/getDepartmentTree': loadingDepartmentTree,
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
      hasDetailAuthority: permissionCodes.includes(detailCode),
      hasAddAuthority: permissionCodes.includes(addCode),
      hasEditAuthority: permissionCodes.includes(editCode),
      hasDeleteAuthority: permissionCodes.includes(deleteCode),
      list,
      loading,
      deleting,
      companyList,
      loadingCompanyList,
      departmentTree,
      loadingDepartmentTree,
      getList(payload, callback) {
        dispatch({
          type: listApi,
          payload: transformPayload(payload),
          callback(success, data) {
            if (!success) {
              message.error('获取列表数据失败，请稍后重试！');
            }
            callback && callback(success, data);
          },
        });
      },
      deleteList(payload, callback) {
        dispatch({
          type: deleteApi,
          payload,
          callback(success, data) {
            if (success) {
              message.success('删除成功！');
            } else {
              message.error('删除失败，请稍后重试！');
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
    };
  },
  {
    areStatesEqual: () => false,
    areOwnPropsEqual: () => false,
    areStatePropsEqual: () => false,
    areMergedPropsEqual: (nextProps, props) => {
      return (
        props.list === nextProps.list &&
        props.loading === nextProps.loading &&
        props.deleting === nextProps.deleting &&
        props.companyList === nextProps.companyList &&
        props.loadingCompanyList === nextProps.loadingCompanyList &&
        props.departmentTree === nextProps.departmentTree &&
        props.loadingDepartmentTree === nextProps.loadingDepartmentTree
      );
    },
  }
)(
  ({
    location: { query },
    unitId,
    unitName,
    isUnit,
    hasDetailAuthority,
    hasAddAuthority,
    hasEditAuthority,
    hasDeleteAuthority,
    list: { list = [], pagination: { total, pageNum, pageSize } = {} } = {},
    loading,
    deleting,
    companyList,
    loadingCompanyList,
    departmentTree,
    loadingDepartmentTree,
    getList,
    deleteList,
    getCompanyList,
    getDepartmentTree,
  }) => {
    // 创建表单引用
    const [form] = Form.useForm();
    // 创建表单初始值
    const [initialValues] = useState({
      company: isUnit ? { key: unitId, value: unitId, label: unitName } : undefined,
    });
    // 创建列表接口对应的payload（通过监听payload的变化来请求接口）
    const [payload, setPayload] = useState(undefined);
    // 创建单位列表接口对应的payload（同上）
    const [companyPayload, setCompanyPayload] = useState(undefined);
    // 根据payload获取search（用于路由跳转）
    const search = useMemo(() => getSearchByPayload(payload), [payload]);
    // 获取表格配置
    const columns = useMemo(
      () =>
        getColumns({
          isUnit,
          search,
          hasDetailAuthority,
          hasEditAuthority,
          hasDeleteAuthority,
          deleteList,
          setPayload,
        }),
      [search]
    );
    // 获取时间范围选择器的快捷选项
    const ranges = useMemo(() => getRanges(), [+moment().startOf('day')]);
    // 初始化
    useEffect(() => {
      // 获取payload
      const payload = getPayloadByQuery({ ...initialValues, ...query });
      // 获取列表
      setPayload(payload);
      // 如果当前账号不是单位账号，则获取单位列表
      if (!isUnit) {
        setCompanyPayload({ pageNum: 1, pageSize: 10 });
      }
      // 如果当前账号是单位账号或者已选择单位，则获取部门列表
      if (isUnit || payload.company) {
        getDepartmentTree({
          companyId: isUnit ? unitId : payload.company.key,
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
    // 单位选择器change事件
    const onCompanySelectChange = useCallback(company => {
      // 如果已选择单位，则获取部门列表
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
      values => setPayload(payload => ({ ...payload, ...transformValues(values), pageNum: 1 })),
      []
    );
    // 表格change事件
    const onTableChange = useCallback(
      ({ current: pageNum, pageSize }) =>
        setPayload(payload => ({
          ...payload,
          pageNum: pageSize === payload.pageSize ? pageNum : 1,
          pageSize,
        })),
      []
    );
    return (
      <PageHeaderLayout
        breadcrumbList={breadcrumbList}
        title={breadcrumbList[breadcrumbList.length - 1].title}
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
                const values = getFieldsValue();
                return (
                  <Row gutter={24}>
                    {getFields({
                      isUnit,
                      values,
                      form,
                      search,
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
