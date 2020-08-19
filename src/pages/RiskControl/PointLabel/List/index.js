import React, { useState, useMemo, useEffect, useCallback, Fragment, Component } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import {
  message,
  Card,
  Form,
  Row,
  Col,
  Input,
  Select,
  Button,
  Table,
  Divider,
  Popconfirm,
} from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
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
  importCode,
  detailPath,
  addPath,
  editPath,
  parentLocale,
  listLocale,
  typeList,
  statusList,
} from '../config';
import {
  showTotal,
  EmptyText,
  listPageCol,
  hiddenCol,
} from '@/utils';
import { isNumber } from '@/utils/utils';
import styles from './index.less';
import ImportModal from '@/components/ImportModal';

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
  bindStatus,
}) => ({
  pageNum: pageNum > 0 ? +pageNum : 1,
  pageSize: pageSize > 0 ? +pageSize : 10,
  bindStatus,
});
// 根据payload获取search（用于路由跳转）
const getSearchByPayload = ({ pageNum, pageSize }) => {
  const query = {
    pageNum,
    pageSize,
  };
  const search = stringify(query);
  return search && `?${search}`;
};
// 转换payload为接口需要的格式
const transformPayload = ({ ...payload }) => {
  return {
    ...payload,
  };
};
// 转换values为payload需要的格式（基本上只对输入框的值进行trim操作）
const transformValues = ({ ...rest }) => ({
  ...rest,
});
// 获取表单配置
const getFields = ({
  isUnit,
  form,
  search,
  hasAddAuthority,
}) => [
    {
      name: 'companyName',
      label: '单位名称',
      children: (
        <Input placeholder="请输入" maxLength={50} allowClear />
      ),
      col: !isUnit ? listPageCol : hiddenCol,
    },
    {
      name: 'itemType',
      label: '类型',
      children: (
        <Select placeholder="请选择" options={typeList} allowClear />
      ),
      col: listPageCol,
    },
    {
      name: 'locationCode',
      label: '标签编号',
      children: <Input placeholder="请输入" maxLength={50} allowClear />,
      col: listPageCol,
    },
    {
      name: 'bindStatus',
      label: '绑定状态',
      children: (
        <Select placeholder="请选择" options={statusList} allowClear />
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
        } : {
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
}) => {
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
      dataIndex: 'locationCode',
      title: '标签编号',
      render: value => value || <EmptyText />,
    },
    {
      dataIndex: 'qrCode',
      title: '二维码',
      render: value => value || <EmptyText />,
    },
    {
      dataIndex: 'nfcCode',
      title: 'NFC',
      render: value => value || <EmptyText />,
    },
    {
      dataIndex: 'itemType',
      title: '类型',
      render: value => (value === 1 || value === '1') ? '监督点' : '风险点',
    },
    {
      dataIndex: 'bindPointCount',
      title: '绑定状态',
      render: value => isNumber(value) ? (value > 0 ? '已绑定' : '未绑定') : <EmptyText />,
    },
    {
      dataIndex: 'bindPointCount',
      title: '绑定点位数量',
      render: value => isNumber(value) ? value : <EmptyText />,
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
};

export default connect(
  state => state,
  null,
  (
    {
      user: {
        currentUser: { unitType, permissionCodes },
      },
      [modelName]: { [listName]: list },
      loading: {
        effects: {
          [listApi]: loading,
          [deleteApi]: deleting,
        },
      },
    },
    { dispatch },
    ownProps
  ) => {
    return {
      ...ownProps,
      isUnit: unitType === 4,
      hasDetailAuthority: permissionCodes.includes(detailCode),
      hasAddAuthority: permissionCodes.includes(addCode),
      hasEditAuthority: permissionCodes.includes(editCode),
      hasDeleteAuthority: permissionCodes.includes(deleteCode),
      list,
      loading,
      deleting,
      getList (payload, callback) {
        dispatch({
          type: listApi,
          payload: transformPayload(payload),
          callback (success, data) {
            if (!success) {
              message.error('获取列表数据失败，请稍后重试！');
            }
            callback && callback(success, data);
          },
        });
      },
      deleteList (payload, callback) {
        dispatch({
          type: deleteApi,
          payload,
          callback (success, data) {
            if (success) {
              message.success('删除成功！');
            } else {
              message.error('删除失败，请稍后重试！');
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
        props.deleting === nextProps.deleting
      );
    },
  }
)(
  ({
    location: { query },
    isUnit,
    hasDetailAuthority,
    hasAddAuthority,
    hasEditAuthority,
    hasDeleteAuthority,
    list: { list = [], pagination: { total, pageNum, pageSize } = {} } = {},
    loading,
    deleting,
    getList,
    deleteList,
  }) => {
    const [form] = Form.useForm();
    // 列表接口的参数
    const [payload, setPayload] = useState(getPayloadByQuery(query));
    const search = useMemo(() => getSearchByPayload(payload), [payload]);
    // 表单配置
    const fields = useMemo(() => getFields({
      isUnit,
      form,
      search,
      hasAddAuthority,
    }), []);
    // 表格配置
    const columns = useMemo(
      () =>
        getColumns({
          search,
          hasDetailAuthority,
          hasEditAuthority,
          hasDeleteAuthority,
          deleteList,
          setPayload,
        }),
      [search]
    );
    // 当payload发生变化时重新请求接口
    useEffect(
      () => {
        // 请求接口
        getList(payload);
        // 获取values
        const { pageNum, pageSize, ...values } = payload;
        // 设置表单
        form.setFieldsValue(values);
      },
      [payload]
    );
    // 表单finish事件
    const onFinish = useCallback(values => {
      // 设置payload
      setPayload(payload => ({ ...payload, ...transformValues(values), pageNum: 1 }));
    }, []);
    // 表格change事件
    const onTableChange = useCallback(({ current: pageNum, pageSize }) => {
      // 设置payload
      setPayload(payload => ({
        ...payload,
        pageNum: pageSize === payload.pageSize ? pageNum : 1,
        pageSize,
      }));
    }, []);
    return (
      <PageHeaderLayout
        breadcrumbList={breadcrumbList}
        title={breadcrumbList[breadcrumbList.length - 1].title}
      >
        <Card className={styles.formCard}>
          <Form form={form} onFinish={onFinish}>
            <Row gutter={24}>
              {fields.map(({ name, col, ...item }, index) => (
                <Col key={name || index} {...col}>
                  <Form.Item name={name} {...item} />
                </Col>
              ))}
            </Row>
          </Form>
        </Card>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <Button
              style={{ marginRight: '10px' }}
              type="primary"
              href={`#${addPath}${search}`}
              disabled={!hasAddAuthority}>
              新增
            </Button>
            <Button
              href="http://data.jingan-china.cn/v2/chem/file1/点位标签库模板.xls"
              target="_blank"
              style={{ marginRight: '10px' }}
            >
              模板下载
            </Button>
            <ImportModal
              action={(companyId) => `/acloud_new/v2/label/import/${companyId}`}
              onUploadSuccess={() => getList({ ...payload, pageNum: 1 })}
              code={importCode}
            />
          </div>
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
