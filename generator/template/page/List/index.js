import React, { Fragment, useState, useMemo, useCallback, useEffect } from 'react';
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
import router from 'umi/router';
import { connect } from 'dva';
import moment from 'moment';
import { stringify } from 'qs';
import {
  NAMESPACE,
  DETAIL_CODE,
  ADD_CODE,
  EDIT_CODE,
  DELETE_CODE,
  LIST_PATH,
  DETAIL_PATH,
  ADD_PATH,
  EDIT_PATH,
  PARENT_LOCALE,
  LIST_LOCALE,
} from '../config';
import {
  PAGE_SIZE,
  listPageCol,
  hiddenCol,
  dateFormat,
  dateRangePickerPlaceholder,
  getRanges,
  getSelectValueFromEvent,
  showTotal,
  EmptyText,
} from '@/utils';
import styles from './index.less';
const { RangePicker } = DatePicker;

/* 面包屑 */
const BREADCRUMB_LIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: PARENT_LOCALE, name: PARENT_LOCALE },
  { title: LIST_LOCALE, name: LIST_LOCALE },
];
/* 根据query获取payload（用于初始化） */
const GET_PAYLOAD_BY_QUERY = ({
  pageNum,
  pageSize,
  company,
  name,
  department,
  startDate,
  endDate,
}) => {
  try {
    return {
      pageNum: pageNum > 0 ? +pageNum : 1,
      pageSize: pageSize > 0 ? +pageSize : PAGE_SIZE,
      company: company ? JSON.parse(decodeURIComponent(company)) : undefined,
      name: name ? decodeURIComponent(name) : undefined,
      department: department ? JSON.parse(decodeURIComponent(department)) : undefined,
      range: startDate && endDate ? [moment(+startDate), moment(+endDate)] : undefined,
    };
  } catch (e) {
    console.log(e);
  }
  return { pageNum: 1, pageSize: PAGE_SIZE };
};
/* 根据payload获取query（前置） */
const GET_QUERY_BY_PAYLOAD = ({ company, name, department, range, ...rest }) => {
  const [startDate, endDate] = range || [];
  return {
    ...rest,
    company: company ? encodeURIComponent(JSON.stringify(company)) : undefined,
    name: name ? encodeURIComponent(name) : undefined,
    department: department ? encodeURIComponent(JSON.stringify(department)) : undefined,
    startDate: startDate ? +startDate : undefined,
    endDate: endDate ? +endDate : undefined,
  };
};
/* 根据payload获取search（用于路由跳转） */
const GET_SEARCH_BY_PAYLOAD = payload => {
  const query = GET_QUERY_BY_PAYLOAD(payload || {});
  const search = stringify(query);
  return search && `?${search}`;
};
/* 转换payload为接口需要的格式 */
const TRANSFORM_PAYLOAD = ({ company, department, range, ...rest }) => {
  const [startDate, endDate] = range || [];
  return {
    ...rest,
    companyId: company && company.key,
    departmentId: department && department.key,
    startDate: startDate && startDate.format(dateFormat),
    endDate: endDate && endDate.format(dateFormat),
  };
};
/* 转换values为payload需要的格式（基本上只对输入框的值进行trim操作） */
const TRANSFORM_VALUES = ({ name, ...rest }) => ({
  ...rest,
  name: name ? name.trim() : undefined,
});
/* 获取表单配置 */
const GET_FIELDS = ({
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
}) => [
  {
    name: 'company',
    label: '单位名称',
    children: (
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
        allowClear
      />
    ),
    getValueFromEvent: getSelectValueFromEvent,
    hidden: isUnit,
    col: isUnit ? hiddenCol : listPageCol,
  },
  {
    name: 'name',
    label: '名称',
    children: (
      <Input placeholder="请输入" maxLength={50} onPressEnter={() => form.submit()} allowClear />
    ),
    col: listPageCol,
  },
  {
    name: 'department',
    label: '所属部门',
    children: (
      <TreeSelect
        placeholder="请选择"
        treeData={values.company ? departmentTree : []}
        notFoundContent={loadingDepartmentTree ? <Spin size="small" /> : undefined}
        treeNodeFilterProp="title"
        labelInValue
        showSearch
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
        ranges={ranges}
        separator="~"
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
        <Button type="primary" href={`#${ADD_PATH}${search}`} disabled={!hasAddAuthority}>
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
/* 获取表格配置 */
const GET_COLUMNS = ({
  search,
  isUnit,
  hasDetailAuthority,
  hasEditAuthority,
  hasDeleteAuthority,
  deleteList,
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
    title: '所属部门',
    render: value => value || <EmptyText />,
  },
  {
    dataIndex: 'date',
    title: '时间',
    render: value => (value ? moment(value).format(dateFormat) : <EmptyText />),
  },
  {
    dataIndex: 'fileList',
    title: '附件',
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
    render: (_, { id }) => (
      <Fragment>
        <Link to={`${DETAIL_PATH}/${id}${search}`} disabled={!hasDetailAuthority}>
          查看
        </Link>
        <Divider type="vertical" />
        <Link to={`${EDIT_PATH}/${id}${search}`} disabled={!hasEditAuthority}>
          编辑
        </Link>
        <Divider type="vertical" />
        <Popconfirm
          title="您确定要删除这条数据吗？"
          onConfirm={() => {
            deleteList({
              id,
            });
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
  ({
    user: { currentUser },
    dict: { companyList, departmentTree },
    [NAMESPACE]: { list },
    loading: {
      models: { [NAMESPACE]: loading },
      effects: {
        'dict/getCompanyList': loadingCompanyList,
        'dict/getDepartmentTree': loadingDepartmentTree,
      },
    },
  }) => ({
    currentUser,
    list,
    loading,
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
    // 创建部门树接口对应的payload（同上）
    const [departmentPayload, setDepartmentPayload] = useState(undefined);
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
      // 如果已选择单位，则获取部门列表
      if (company) {
        setDepartmentPayload({
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
      // 如果已选择单位，则获取部门列表
      if (payload.company) {
        setCompanyPayload({
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
    // 当departmentPayload发生变化时获取部门树
    useEffect(
      () => {
        if (departmentPayload) {
          getDepartmentTree(departmentPayload);
        }
      },
      [departmentPayload]
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
                const values = getFieldsValue();
                return (
                  <Row gutter={24}>
                    {GET_FIELDS({
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
            loading={loading}
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
