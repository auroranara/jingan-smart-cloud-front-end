import React, { useState, useMemo, useEffect, useCallback, Fragment } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import {
  message,
  Card,
  Form,
  Row,
  Col,
  Table,
  Button,
  Modal,
  DatePicker,
  Radio,
  Input,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import {
  modelName,
  listName,
  pendingApproveCountName,
  workingCountName,
  approveCountName,
  listApi,
  pendingApproveCountApi,
  workingCountApi,
  deleteApi,
  approveApi,
  signatureApi,
  approveCountApi,
  detailCode,
  addCode,
  editCode,
  deleteCode,
  approveCode,
  parentLocale,
  listLocale,
  typeList,
  approveOpinionList,
  getPayloadByQueryMap,
  getQueryByPayloadMap,
  getSearchByPayloadMap,
  transformPayloadMap,
  transformValuesMap,
  getListFieldsMap,
  getColumnsMap,
  Signature,
} from '../config';
import { getRanges, showTotal, Text, minuteFormat, labelCol } from '@/utils';
import styles from './index.less';

// 面包屑
const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: parentLocale, name: parentLocale },
  { title: listLocale, name: listLocale },
];

export default connect(
  state => state,
  null,
  (
    {
      user: {
        currentUser: { userId, userName, unitId, unitName, unitType, permissionCodes },
      },
      dict: { companyList, departmentTree },
      [modelName]: {
        [listName]: list,
        [pendingApproveCountName]: pendingApproveCount,
        [workingCountName]: workingCount,
        [approveCountName]: approveCount,
      },
      loading: {
        effects: {
          [listApi]: loading,
          [deleteApi]: deleting,
          [approveApi]: approving,
          [signatureApi]: loadingSignature,
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
      userId,
      userName,
      unitId,
      unitName,
      isUnit: unitType === 4,
      hasDetailAuthority: permissionCodes.includes(detailCode),
      hasAddAuthority: permissionCodes.includes(addCode),
      hasEditAuthority: permissionCodes.includes(editCode),
      hasDeleteAuthority: permissionCodes.includes(deleteCode),
      hasApproveAuthority: permissionCodes.includes(approveCode),
      list,
      loading,
      pendingApproveCount,
      workingCount,
      approveCount,
      deleting,
      approving,
      loadingSignature,
      companyList,
      loadingCompanyList,
      departmentTree,
      loadingDepartmentTree,
      getList(payload, callback) {
        dispatch({
          type: listApi,
          payload,
          callback(success, data) {
            if (!success) {
              message.error('获取列表数据失败，请稍后重试！');
            }
            callback && callback(success, data);
          },
        });
      },
      getPendingApproveCount(payload, callback) {
        dispatch({
          type: pendingApproveCountApi,
          payload,
          callback(success, data) {
            if (!success) {
              message.error('获取待审批统计数据失败，请稍后重试！');
            }
            callback && callback(success, data);
          },
        });
      },
      getWorkingCount(payload, callback) {
        dispatch({
          type: workingCountApi,
          payload,
          callback(success, data) {
            if (!success) {
              message.error('获取作业中统计数据失败，请稍后重试！');
            }
            callback && callback(success, data);
          },
        });
      },
      getApproveCount(payload, callback) {
        dispatch({
          type: approveCountApi,
          payload,
          callback(success, data) {
            if (!success) {
              message.error('获取近半年情况统计数据失败，请稍后重试！');
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
      approve(payload, callback) {
        dispatch({
          type: approveApi,
          payload,
          callback(success, data) {
            if (success) {
              message.success('审批成功！');
            } else {
              message.error(`审批失败，${data || '请稍后重试'}！`);
            }
            callback && callback(success, data);
          },
        });
      },
      getSignature(payload, callback) {
        dispatch({
          type: signatureApi,
          payload,
          callback(success, data) {
            if (!success) {
              message.error('获取手写签名失败，请稍后重试！');
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
        props.pendingApproveCount === nextProps.pendingApproveCount &&
        props.workingCount === nextProps.workingCount &&
        props.approveCount === nextProps.approveCount &&
        props.deleting === nextProps.deleting &&
        props.approving === nextProps.approving &&
        props.loadingSignature === nextProps.loadingSignature &&
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
    userId,
    userName,
    unitId,
    unitName,
    isUnit,
    hasDetailAuthority,
    hasAddAuthority,
    hasEditAuthority,
    hasDeleteAuthority,
    hasApproveAuthority,
    list: { list = [], pagination: { total, pageNum, pageSize } = {} } = {},
    loading,
    pendingApproveCount,
    workingCount,
    approveCount,
    deleting,
    approving,
    loadingSignature,
    companyList,
    loadingCompanyList,
    departmentTree,
    loadingDepartmentTree,
    getList,
    getPendingApproveCount,
    getWorkingCount,
    getApproveCount,
    deleteList,
    approve,
    getSignature,
    getCompanyList,
    getDepartmentTree,
  }) => {
    // 创建表单引用
    const [form] = Form.useForm();
    // 创建表单初始值
    const [initialValues] = useState({
      company: isUnit ? { key: unitId, value: unitId, label: unitName } : undefined,
    });
    // 创建预审批模态框表单引用
    const [modalForm] = Form.useForm();
    // 创建预审批模态框是否显示控制变量
    const [visible, setVisible] = useState(false);
    // 创建当前选中的tab
    const [tabActiveKey, setTabActiveKey] = useState(query.billType || typeList[0].key);
    // 创建当前选中的tag
    const [tagActiveKey, setTagActiveKey] = useState(undefined);
    // 创建列表接口对应的payload（通过监听payload的变化来请求接口）
    const [payload, setPayload] = useState(undefined);
    // 创建单位列表接口对应的payload（同上）
    const [companyPayload, setCompanyPayload] = useState(undefined);
    // 获取tab列表
    const tabList = useMemo(
      () => {
        if (tagActiveKey) {
          if (tagActiveKey === '0') {
            return typeList.map(item => ({
              key: item.key,
              tab: `${item.label}（${pendingApproveCount[item.key] || 0}）`,
            }));
          } else {
            return typeList.map(item => ({
              key: item.key,
              tab: `${item.label}（${workingCount[item.key] || 0}）`,
            }));
          }
        }
        return typeList.map(item => ({
          key: item.key,
          tab: item.label,
        }));
      },
      [tagActiveKey, pendingApproveCount, workingCount]
    );
    // 根据payload获取search（用于路由跳转）
    const search = useMemo(() => payload && getSearchByPayloadMap[payload.billType](payload), [
      payload,
    ]);
    // 审批按钮点击事件
    const onApproveButtonClick = useCallback(e => {
      e.preventDefault();
      const {
        target: {
          dataset: { id },
        },
      } = e;
      // 打开模态框
      setVisible(true);
      // 获取手写签名
      getSignature({ id: userId }, (success, data) => {
        if (success) {
          modalForm.setFieldsValue({
            signature: data || undefined,
          });
        }
      });
      // 设置初始值
      modalForm.setFieldsValue({
        id,
        approveUser: { key: userId, value: userId, label: userName },
        approveTime: moment(),
        approveStatus: approveOpinionList[0].key,
        aging: undefined,
        signature: undefined,
      });
    }, []);
    // 获取表格配置
    const columns = useMemo(
      () =>
        payload &&
        getColumnsMap[payload.billType]({
          isUnit,
          search,
          hasDetailAuthority,
          hasAddAuthority,
          hasEditAuthority,
          hasDeleteAuthority,
          hasApproveAuthority,
          deleteList,
          setPayload,
          onApproveButtonClick,
        }),
      [search]
    );
    // 获取时间范围选择器的快捷选项
    const ranges = useMemo(() => getRanges(['今天', '最近一周', '最近一个月', '最近三个月']), [
      +moment().startOf('day'),
    ]);
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
      values =>
        setPayload(payload => ({
          ...payload,
          ...transformValuesMap[payload.billType](values),
          pageNum: 1,
        })),
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
    // tab的change事件
    const onTabChange = useCallback(tabActiveKey => setTabActiveKey(tabActiveKey), []);
    // tag的change事件
    const onTagChange0 = useCallback(
      () => setTagActiveKey(tagActiveKey => (tagActiveKey !== '0' ? '0' : undefined)),
      []
    );
    const onTagChange1 = useCallback(
      () => setTagActiveKey(tagActiveKey => (tagActiveKey !== '1' ? '1' : undefined)),
      []
    );
    // 模态框ok事件
    const onModalOk = useCallback(() => modalForm.submit(), []);
    // 模态框cancel事件
    const onModalCancel = useCallback(() => setVisible(false), []);
    // 模态框表单finish事件
    const onModalFormFinish = useCallback(({ approveUser, approveTime, ...rest }) => {
      // 审批
      approve(
        {
          ...rest,
          approveUser: approveUser && approveUser.key,
          approveTime: approveTime && approveTime.format('YYYY/MM/DD HH:mm:00'),
        },
        success => {
          if (success) {
            // 关闭模态框
            setVisible(false);
            // 重新加载表格当前页数据
            setPayload(payload => ({ ...payload }));
          }
        }
      );
    }, []);
    // 当tabActiveKey发生变化时初始化
    useEffect(
      () => {
        // 获取payload
        const newPayload = getPayloadByQueryMap[tabActiveKey]({
          ...getQueryByPayloadMap[tabActiveKey](initialValues),
          ...(!payload && query),
          billType: tabActiveKey,
        });
        // 获取列表
        setPayload(newPayload);
        // 如果当前账号不是单位账号，则获取单位列表
        if (!isUnit) {
          setCompanyPayload({ pageNum: 1, pageSize: 10 });
        }
        // 如果当前账号是单位账号或者已选择单位，则获取部门列表
        if (isUnit || newPayload.company) {
          getDepartmentTree({
            companyId: isUnit ? unitId : newPayload.company.key,
          });
        }
      },
      [tabActiveKey]
    );
    // 当payload发生变化时获取列表
    useEffect(
      () => {
        if (payload) {
          // 请求接口
          getList(transformPayloadMap[payload.billType](payload));
          getPendingApproveCount();
          getWorkingCount();
          getApproveCount();
          // 获取values
          const { pageNum, pageSize, billType, ...values } = payload;
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
    return (
      <PageHeaderLayout
        className={styles.layout}
        breadcrumbList={breadcrumbList}
        title={breadcrumbList[breadcrumbList.length - 1].title}
        content={
          <Fragment>
            <Button
              className={styles.buttonTag}
              type={tagActiveKey === '0' ? 'primary' : 'default'}
              onClick={onTagChange0}
            >
              待审批：
              {pendingApproveCount.total || 0}
            </Button>
            <Button type={tagActiveKey === '1' ? 'primary' : 'default'} onClick={onTagChange1}>
              作业中：
              {workingCount.total || 0}
            </Button>
          </Fragment>
        }
        extraContent={
          <div className={styles.countList}>
            <span className={styles.countTitle}>近半年情况统计：</span>
            <div className={styles.countItem}>
              <div className={styles.countItemLabel}>完成</div>
              <div className={styles.countItemValue}>
                <span>{(approveCount && approveCount.countPass) || 0}</span>
              </div>
            </div>
            <div className={styles.countItem}>
              <div className={styles.countItemLabel}>办票时效</div>
              <div className={styles.countItemValue}>
                <span>{(approveCount && approveCount.avgAging) || 0}</span>
                分钟
              </div>
            </div>
            <div className={styles.countItem}>
              <div className={styles.countItemLabel}>一次通过率</div>
              <div className={styles.countItemValue}>
                <span>{(approveCount && approveCount.passRate) || 0}</span>%
              </div>
            </div>
          </div>
        }
        tabList={tabList}
        tabActiveKey={tabActiveKey}
        onTabChange={onTabChange}
        tabsProps={{ animated: false }}
      >
        {payload && (
          <Fragment>
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
                        {getListFieldsMap[payload.billType]({
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
          </Fragment>
        )}
        <Modal
          className={styles.modal}
          title="预审批"
          visible={visible}
          onOk={onModalOk}
          onCancel={onModalCancel}
          zIndex={1009}
          confirmLoading={approving}
        >
          <Form form={modalForm} onFinish={onModalFormFinish} labelCol={labelCol}>
            {[
              {
                name: 'id',
                children: <Text />,
                hidden: true,
              },
              {
                name: 'approveUser',
                label: '审批人',
                children: <Text type="Select" labelInValue />,
                rules: [{ required: true, message: '请选择审批人' }],
              },
              {
                name: 'approveTime',
                label: '审批时间',
                children: (
                  <DatePicker
                    className={styles.datePicker}
                    placeholder="请选择"
                    format={minuteFormat}
                    showTime
                    allowClear={false}
                  />
                ),
                rules: [{ required: true, message: '请选择审批时间' }],
              },
              {
                name: 'approveStatus',
                label: '审批意见',
                children: <Radio.Group options={approveOpinionList} />,
                rules: [{ required: true, message: '请选择审批意见' }],
              },
              {
                name: 'aging',
                label: '办票时效',
                children: <Input placeholder="请输入" addonAfter="分钟" />,
                getValueFromEvent: ({ target: { value } }) =>
                  value && value.replace(/^\D*(\d*).*$/, '$1'),
                rules: [
                  {
                    required: true,
                    validator(_, value) {
                      if (!value) {
                        return Promise.reject('请输入办票时效');
                      } else if (value <= 0) {
                        return Promise.reject('办票时效必须大于0');
                      } else {
                        return Promise.resolve();
                      }
                    },
                  },
                ],
              },
              {
                name: 'signature',
                label: '手写签名',
                children: <Signature loading={loadingSignature} />,
                extra: '说明：如果没有手写签名，请在app端 我的 手写签名中进行设置。',
              },
            ].map(({ name, col, ...item }, index) => (
              <Form.Item key={name || index} name={name} {...item} />
            ))}
          </Form>
        </Modal>
      </PageHeaderLayout>
    );
  }
);
