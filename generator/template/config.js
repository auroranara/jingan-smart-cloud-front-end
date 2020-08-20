import React, { Fragment } from 'react';
import { Spin, Input, TreeSelect, DatePicker, Button, Divider, Popconfirm } from 'antd';
import PagingSelect from '@/jingan-components/PagingSelect';
import Upload from '@/jingan-components/Form/Upload';
import Link from 'umi/link';
import moment from 'moment';
import { stringify } from 'qs';
import {
  PAGE_SIZE,
  listPageCol,
  hiddenCol,
  col,
  buttonWrapperCol,
  dateFormat,
  dateRangePickerPlaceholder,
  getSelectValueFromEvent,
  EmptyText,
  Text,
} from '@/utils';
import locale from '@/locales/zh-CN';
import styles from './config.less';
const { RangePicker } = DatePicker;

/* 当前模块的model */
export const NAMESPACE = '$namespace';
/* 详情页面的权限 */
export const DETAIL_CODE = '$detailCode';
/* 新增页面的权限 */
export const ADD_CODE = '$addCode';
/* 编辑页面的权限 */
export const EDIT_CODE = '$editCode';
/* 删除页面的权限 */
export const DELETE_CODE = '$deleteCode';
/* 列表页面的路径 */
export const LIST_PATH = '$listPath';
/* 详情页面的路径 */
export const DETAIL_PATH = '$detailPath';
/* 新增页面的路径 */
export const ADD_PATH = '$addPath';
/* 编辑页面的路径 */
export const EDIT_PATH = '$editPath';
/* 上级菜单的标题 */
export const PARENT_LOCALE = locale['$parentLocale'];
/* 列表页面的标题 */
export const LIST_LOCALE = locale['$listLocale'];
/* 详情页面的标题 */
export const DETAIL_LOCALE = locale['$detailLocale'];
/* 新增页面的标题 */
export const ADD_LOCALE = locale['$addLocale'];
/* 编辑页面的标题 */
export const EDIT_LOCALE = locale['$editLocale'];
/* 列表页面的面包屑 */
export const BREADCRUMB_LIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: PARENT_LOCALE, name: PARENT_LOCALE },
  { title: LIST_LOCALE, name: LIST_LOCALE },
];
/* 根据query获取payload（用于初始化） */
export const GET_PAYLOAD_BY_QUERY = ({
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
export const GET_QUERY_BY_PAYLOAD = ({ company, name, department, range, ...rest }) => {
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
export const GET_SEARCH_BY_PAYLOAD = payload => {
  const query = GET_QUERY_BY_PAYLOAD(payload || {});
  const search = stringify(query);
  return search && `?${search}`;
};
/* 转换payload为接口需要的格式 */
export const TRANSFORM_PAYLOAD = ({ company, department, range, ...rest }) => {
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
export const TRANSFORM_VALUES = ({ name, ...rest }) => ({
  ...rest,
  name: name ? name.trim() : undefined,
});
/* 获取列表页面的表单配置 */
export const GET_LIST_FIELDS = ({
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
        showSearch
        labelInValue
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
        className={styles.block}
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
export const GET_COLUMNS = ({
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
/* 获取面包屑 */
export const GET_BREADCRUMB_LIST = ({ name, search }) => {
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
export const GET_VALUES_BY_DETAIL = ({
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
export const GET_PAYLOAD_BY_VALUES = ({ company, name, department, principal, date, ...rest }) => ({
  ...rest,
  companyId: company && company.key,
  name: name && name.trim(),
  principal: principal && principal.key,
  departmentId: department && department.key,
  date: date && date.format(dateFormat),
});
/* 获取表单页面的表单配置 */
export const GET_FORM_FIELDS = ({
  values,
  name,
  search,
  isUnit,
  loading,
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
          className={styles.block}
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
            <Button type="primary" htmlType="submit" loading={loading || adding || editing}>
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
