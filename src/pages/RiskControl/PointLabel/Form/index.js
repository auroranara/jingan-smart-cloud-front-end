import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import PagingSelect from '@/jingan-components/PagingSelect';
import { message, Card, Skeleton, Form, Row, Col, Input, Select, Button } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
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
  typeList,
} from '../config';
import {
  Text,
  labelCol,
  wrapperCol,
  col,
  buttonWrapperCol,
  hiddenCol,
  getSelectValueFromEvent,
} from '@/utils';
import { isNumber } from '@/utils/utils';
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
  locationCode,
  qrCode,
  nfcCode,
  itemType,
}) => ({
  company: companyId ? { key: companyId, value: companyId, label: companyName } : undefined,
  locationCode: locationCode || undefined,
  qrCode: qrCode || undefined,
  nfcCode: nfcCode || undefined,
  itemType: isNumber(itemType) ? `${itemType}` : undefined,
});
// 根据values获取payload（用于提交）
const getPayloadByValues = ({
  company,
  locationCode,
  qrCode,
  nfcCode,
  itemType,
}) => ({
  companyId: company && company.key,
  locationCode,
  qrCode,
  nfcCode,
  itemType,
});
// 获取表单配置
const getFields = ({
  isUnit,
  name,
  search,
  adding,
  editing,
  companyList,
  loadingCompanyList,
  setCompanyPayload,
}) => [
  {
    name: 'company',
    label: '单位名称',
    children:
      name !== 'detail' ? (
        <PagingSelect
          options={companyList.list}
          loading={loadingCompanyList}
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
        />
      ) : (
        <Text type="Select" labelInValue />
      ),
    getValueFromEvent: getSelectValueFromEvent,
    rules: name !== 'detail' ? [{ required: true, message: '请选择单位名称' }] : undefined,
    col: !isUnit ? col : hiddenCol,
  },
  {
    name: 'locationCode',
    label: '标签编号：',
    children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
    rules:
      name !== 'detail'
        ? [
            { required: true, message: '请输入标签编号' },
            { whitespace: true, message: '标签编号不能为空格' },
          ]
        : undefined,
    col,
  },
  {
    name: 'qrCode',
    label: '二维码：',
    children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
    rules: name !== 'detail' ? [{ whitespace: true, message: '二维码不能为空格' }] : undefined,
    col,
  },
  {
    name: 'nfcCode',
    label: 'NFC：',
    children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
    rules: name !== 'detail' ? [{ whitespace: true, message: 'NFC不能为空格' }] : undefined,
    col,
  },
  {
    name: 'itemType',
    label: '类型',
    children: name !== 'detail' ? <Select placeholder="请选择" options={typeList} /> : <Text type="Select" options={typeList} />,
    rules: name !== 'detail' ? [{ required: true, message: '请选择类型' }] : undefined,
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
      dict: { companyList },
      [modelName]: { [detailName]: detail },
      loading: {
        effects: {
          [detailApi]: loading,
          [addApi]: adding,
          [editApi]: editing,
          'dict/getCompanyList': loadingCompanyList,
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
              message.error(`编辑失败，${data || '请稍后重试'}！`);
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
              message.error(`编辑失败，${data || '请稍后重试'}！`);
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
    getDetail,
    add,
    edit,
    getCompanyList,
  }) => {
    const [form] = Form.useForm();
    const [initialValues] = useState({
      company: isUnit ? { key: unitId, value: unitId, label: unitName } : undefined,
      itemType: typeList[0].key,
    });
    const search = useMemo(
      () => unsafeSearch && (unsafeSearch.startsWith('?') ? unsafeSearch : `?${unsafeSearch}`),
      []
    );
    // 单位列表接口的参数
    const [companyPayload, setCompanyPayload] = useState(undefined);
    // 表单配置
    const fields = useMemo(
      () =>
        getFields({
          isUnit,
          name,
          search,
          adding,
          editing,
          companyList,
          loadingCompanyList,
          setCompanyPayload,
        }),
      [name, adding, editing, companyList, loadingCompanyList]
    );
    // 面包屑
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
                // 设置初始值
                form.setFieldsValue(getValuesByDetail(data));
              } else {
                // 重置初始值
                form.resetFields();
              }
            }
          );
        } else {
          // 重置初始值
          form.resetFields();
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
              <Row gutter={24}>
                {fields.map(({ name, col, ...item }, index) => (
                  <Col key={name || index} {...col}>
                    <Form.Item name={name} {...item} />
                  </Col>
                ))}
              </Row>
            </Form>
          )}
        </Card>
      </PageHeaderLayout>
    );
  }
);
