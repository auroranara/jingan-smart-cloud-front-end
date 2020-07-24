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
  Select,
  TreeSelect,
  DatePicker,
  Button,
  Table,
  Divider,
  Popconfirm,
} from 'antd';
import Link from 'umi/link';
import router from 'umi/router';
import { connect } from 'dva';
import moment from 'moment';
import { stringify } from 'qs';
import {
  NAMESPACE,
  LIST_NAME,
  LIST_API,
  DELETE_API,
  DETAIL_CODE,
  ADD_CODE,
  EDIT_CODE,
  DELETE_CODE,
  DETAIL_PATH,
  ADD_PATH,
  EDIT_PATH,
} from '../config';
import {
  FORMAT,
  showTotal,
  getSelectValueFromEvent,
  EmptyText,
  RANGE_PICKER_PLACEHOLDER,
  LIST_PAGE_COL,
} from '@/utils';
import styles from './index.less';
const { Option } = Select;
const { RangePicker } = DatePicker;

const BREADCRUMB_LIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '风险分级管控', name: '风险分级管控' },
  { title: '保护层分析（LOPA）', name: '保护层分析（LOPA）' },
];
const GET_PAYLOAD_BY_QUERY = ({
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
const GET_QUERY_BY_PAYLOAD = ({ pageNum, pageSize, company, name, department, range }) => {
  const [assessmentStartDate, assessmentEndDate] = range || [];
  return {
    pageNum,
    pageSize,
    company: company ? encodeURIComponent(JSON.stringify(company)) : undefined,
    name: name ? encodeURIComponent(name.trim()) : undefined,
    department: department ? encodeURIComponent(JSON.stringify(department)) : undefined,
    assessmentStartDate: assessmentStartDate ? +assessmentStartDate : undefined,
    assessmentEndDate: assessmentEndDate ? +assessmentEndDate : undefined,
  };
};
const TRANSFORM_PAYLOAD = ({ company, department, range, ...payload }) => {
  const [assessmentStartDate, assessmentEndDate] = range || [];
  return {
    ...payload,
    companyId: company && company.key,
    departmentId: department && department.key,
    assessmentStartDate: assessmentStartDate && assessmentStartDate.format(FORMAT),
    assessmentEndDate: assessmentEndDate && assessmentEndDate.format(FORMAT),
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
      dict: { companyList, departmentTree },
      [NAMESPACE]: { [LIST_NAME]: list },
      loading: {
        effects: {
          [LIST_API]: loading,
          [DELETE_API]: deleting,
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
      isUnit: unitType === 4,
      hasDetailAuthority: permissionCodes.includes(DETAIL_CODE),
      hasAddAuthority: permissionCodes.includes(ADD_CODE),
      hasEditAuthority: permissionCodes.includes(EDIT_CODE),
      hasDeleteAuthority: permissionCodes.includes(DELETE_CODE),
      list,
      loading,
      deleting,
      companyList,
      loadingCompanyList,
      departmentTree,
      loadingDepartmentTree,
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
      deleteList(payload, callback) {
        dispatch({
          type: DELETE_API,
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
          payload: {
            pageNum: 1,
            pageSize: 10,
            ...payload,
          },
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
        props.loadingDepartmentTree === nextProps.loadingDepartmentTree &&
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
    const [form] = Form.useForm();
    const [appending, setAppending] = useState(false);
    // 当query发生变化时重新请求接口
    useEffect(
      () => {
        // 根据query获取payload
        const payload = GET_PAYLOAD_BY_QUERY(query);
        // 根据payload获取数据
        getList(payload);
        // 根据payload获取values
        const { pageNum, pageSize, ...values } = payload;
        // 根据values设置表单值
        form.setFieldsValue(values);
      },
      [query]
    );
    // 初始化下拉框
    useEffect(() => {
      // 根据query获取payload
      const payload = GET_PAYLOAD_BY_QUERY(query);
      // 如果当前账号不是单位账号，则获取单位列表
      if (!isUnit) {
        getCompanyList();
      }
      // 如果当前账号是单位账号或者已选择单位，则获取部门列表
      if (isUnit || payload.company) {
        getDepartmentTree({
          companyId: isUnit ? unitId : payload.company.key,
        });
      }
    }, []);
    // 时间范围选择器的预设
    const ranges = useMemo(
      () => {
        return {
          今天: [moment().startOf('day'), moment().endOf('day')],
          最近一周: [
            moment()
              .startOf('day')
              .subtract(1, 'weeks')
              .add(1, 'days'),
            moment().endOf('day'),
          ],
          最近一个月: [
            moment()
              .startOf('day')
              .subtract(1, 'months')
              .add(1, 'days'),
            moment().endOf('day'),
          ],
          最近三个月: [
            moment()
              .startOf('day')
              .subtract(1, 'quarters')
              .add(1, 'days'),
            moment().endOf('day'),
          ],
          最近半年: [
            moment()
              .startOf('day')
              .subtract(6, 'months')
              .add(1, 'days'),
            moment().endOf('day'),
          ],
          最近一年: [
            moment()
              .startOf('day')
              .subtract(1, 'years')
              .add(1, 'days'),
            moment().endOf('day'),
          ],
        };
      },
      [+moment().startOf('day')]
    );
    // query字符串
    const queryString = stringify(query);
    // 表格配置
    const columns = useMemo(() => {
      return [
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
          render: value => (value ? moment(value).format(FORMAT) : <EmptyText />),
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
              <Link
                to={`${DETAIL_PATH}/${data.id}${queryString ? `?${queryString}` : ''}`}
                disabled={!hasDetailAuthority}
              >
                查看
              </Link>
              <Divider type="vertical" />
              <Link
                to={`${EDIT_PATH}/${data.id}${queryString ? `?${queryString}` : ''}`}
                disabled={!hasEditAuthority}
              >
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
                        router.replace({
                          pathname,
                          query: {
                            ...query,
                          },
                        });
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
    }, []);
    // 表单finish事件
    const onFinish = values => {
      // 根据query获取payload
      const payload = GET_PAYLOAD_BY_QUERY(query);
      // 生成新的payload
      const newPayload = {
        ...payload,
        ...values,
        pageNum: 1,
      };
      // 根据新的payload获取新的query
      const newQuery = GET_QUERY_BY_PAYLOAD(newPayload);
      // 根据query生成新的路由
      router.replace({
        pathname,
        query: newQuery,
      });
    };
    // 单位选择器search事件
    const onCompanySelectSearch = useMemo(() => {
      let timer;
      return value => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          getCompanyList({
            label: value && value.trim(),
          });
        }, 300);
      };
    }, []);
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
    // 表格change事件
    const onTableChange = ({ current: pageNum, pageSize }) => {
      // 根据query获取payload
      const payload = GET_PAYLOAD_BY_QUERY(query);
      // 生成新的payload
      const newPayload = {
        ...payload,
        pageNum: pageSize === payload.pageSize ? pageNum : 1,
        pageSize,
      };
      // 根据新的payload获取新的query
      const newQuery = GET_QUERY_BY_PAYLOAD(newPayload);
      // 根据新的query生成新的路由
      router.replace({
        pathname,
        query: newQuery,
      });
    };
    return (
      <PageHeaderLayout
        breadcrumbList={BREADCRUMB_LIST}
        title={BREADCRUMB_LIST[BREADCRUMB_LIST.length - 1].title}
      >
        <Card className={styles.formCard}>
          <Form className={styles.form} form={form} onFinish={onFinish}>
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
                    {[
                      ...(!isUnit
                        ? [
                            {
                              name: 'company',
                              label: '单位名称',
                              children: (
                                <Select
                                  placeholder="请选择"
                                  labelInValue
                                  notFoundContent={
                                    loadingCompanyList ? <Spin size="small" /> : undefined
                                  }
                                  showSearch
                                  filterOption={false}
                                  allowClear
                                  onSearch={onCompanySelectSearch}
                                  onChange={onCompanySelectChange}
                                  onPopupScroll={
                                    !appending &&
                                    companyList &&
                                    companyList.pagination &&
                                    companyList.pagination.total >
                                      companyList.pagination.pageNum *
                                        companyList.pagination.pageSize
                                      ? ({ target: { scrollTop, offsetHeight, scrollHeight } }) => {
                                          if (scrollTop + offsetHeight === scrollHeight) {
                                            const {
                                              pagination: { pageNum },
                                            } = companyList;
                                            setAppending(true);
                                            getCompanyList(
                                              {
                                                pageNum: pageNum + 1,
                                              },
                                              () => {
                                                setTimeout(() => {
                                                  setAppending(false);
                                                });
                                              }
                                            );
                                          }
                                        }
                                      : undefined
                                  }
                                  dropdownRender={children => (
                                    <div className={styles.dropdownSpinContainer}>
                                      {children}
                                      {appending && <Spin className={styles.dropdownSpin} />}
                                    </div>
                                  )}
                                >
                                  {(!loadingCompanyList || appending) &&
                                  companyList &&
                                  companyList.list
                                    ? companyList.list.map(item => <Option {...item} />)
                                    : []}
                                </Select>
                              ),
                              getValueFromEvent: getSelectValueFromEvent,
                              col: LIST_PAGE_COL,
                            },
                          ]
                        : []),
                      {
                        name: 'name',
                        label: '名称',
                        children: <Input placeholder="请输入" maxLength={50} allowClear />,
                        col: LIST_PAGE_COL,
                      },
                      {
                        name: 'department',
                        label: '所属部门',
                        children: (
                          <TreeSelect
                            placeholder="请选择"
                            treeData={values.company ? departmentTree : undefined}
                            labelInValue
                            notFoundContent={
                              loadingDepartmentTree ? <Spin size="small" /> : undefined
                            }
                            showSearch
                            treeNodeFilterProp="title"
                            allowClear
                          />
                        ),
                        getValueFromEvent: getSelectValueFromEvent,
                        col: LIST_PAGE_COL,
                      },
                      {
                        name: 'range',
                        label: '时间',
                        children: (
                          <RangePicker
                            className={styles.rangePicker}
                            placeholder={RANGE_PICKER_PLACEHOLDER}
                            format={FORMAT}
                            separator="~"
                            ranges={ranges}
                            allowClear
                          />
                        ),
                        col: LIST_PAGE_COL,
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
                            <Button
                              type="primary"
                              href={`#${ADD_PATH}${queryString ? `?${queryString}` : ''}`}
                              disabled={!hasAddAuthority}
                            >
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
                    ].map(({ name, col, ...item }, index) => (
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
        <Card className={styles.tableCard}>
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
