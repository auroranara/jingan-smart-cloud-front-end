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
  Select,
  TreeSelect,
  DatePicker,
  Button,
} from 'antd';
import Upload from '@/jingan-components/Form/Upload';
import router from 'umi/router';
import { connect } from 'dva';
import moment from 'moment';
import { stringify } from 'qs';
import { NAMESPACE, DETAIL_NAME, DETAIL_API, ADD_API, EDIT_API, LIST_PATH } from '../config';
import {
  FORMAT,
  getSelectValueFromEvent,
  EmptyText,
  LABEL_COL,
  WRAPPER_COL,
  COL,
  BUTTON_WRAPPER_COL,
  HIDDEN_COL,
} from '@/utils';
import styles from './index.less';
const { Option } = Select;

const GET_VALUES_BY_DETAIL = ({
  companyId,
  companyName,
  name,
  departmentId,
  departmentName,
  principal,
  principalName,
  assessmentDate,
  otherFileList,
}) => ({
  company: companyId ? { key: companyId, value: companyId, label: companyName } : undefined,
  name: name || undefined,
  department: departmentId
    ? { key: departmentId, value: departmentId, label: departmentName }
    : undefined,
  principal: principal ? { key: principal, value: principal, label: principalName } : undefined,
  assessmentDate: assessmentDate ? moment(assessmentDate) : undefined,
  otherFileList: otherFileList
    ? otherFileList.map((item, index) => ({
        ...item,
        url: item.webUrl,
        status: 'done',
        uid: -index - 1,
        name: item.fileName,
      }))
    : undefined,
});
const GET_PAYLOAD_BY_VALUES = ({
  company,
  name,
  department,
  principal,
  assessmentDate,
  otherFileList,
}) => ({
  companyId: company && company.key,
  name: name && name.trim(),
  departmentId: department && department.key,
  principal: principal && principal.key,
  assessmentDate: assessmentDate && assessmentDate.format(FORMAT),
  otherFileList,
});

export default connect(
  state => state,
  null,
  (
    {
      user: {
        currentUser: { unitId, unitName, unitType },
      },
      dict: { companyList, departmentTree, personList },
      [NAMESPACE]: { [DETAIL_NAME]: detail },
      loading: {
        effects: {
          [DETAIL_API]: loading,
          [ADD_API]: adding,
          [EDIT_API]: editing,
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
          type: DETAIL_API,
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
          type: ADD_API,
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
          type: EDIT_API,
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
      getPersonList(payload, callback) {
        dispatch({
          type: 'dict/getPersonList',
          payload: {
            pageNum: 1,
            pageSize: 10,
            ...payload,
          },
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
    location: { pathname, query },
    unitId,
    unitName,
    isUnit,
    detail = {},
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
    const [form] = Form.useForm();
    const [appendingCompanyList, setAppendingCompanyList] = useState(false);
    const [appendingPersonList, setAppendingPersonList] = useState(false);
    const [initialValues] = useState({
      company: isUnit ? { key: unitId, value: unitId, label: unitName } : undefined,
    });
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
                // 重置初始值
                form.setFieldsValue(GET_VALUES_BY_DETAIL(data));
                // 如果companyId存在或者当前账号是单位账号，则获取部门列表和人员列表
                if (companyId || isUnit) {
                  getDepartmentTree({
                    companyId: companyId || unitId,
                  });
                  getPersonList({
                    companyId: companyId || unitId,
                  });
                }
              } else {
                // 重置初始值
                form.resetFields();
                // 如果当前账号是单位账号，则获取部门列表和人员列表
                if (isUnit) {
                  getDepartmentTree({
                    companyId: unitId,
                  });
                  getPersonList({
                    companyId: unitId,
                  });
                }
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
            getPersonList({
              companyId: unitId,
            });
          }
        }
        // 如果当前账号不是单位账号时，则获取单位列表
        if (!isUnit) {
          getCompanyList();
        }
      },
      [id]
    );
    // 面包屑
    const breadcrumbList = useMemo(
      () => {
        const title = {
          detail: '保护层分析详情',
          add: '新增保护层分析',
          edit: '编辑保护层分析',
        }[name];
        return [
          { title: '首页', name: '首页', href: '/' },
          { title: '风险分级管控', name: '风险分级管控' },
          {
            title: '保护层分析（LOPA）',
            name: '保护层分析（LOPA）',
            href: `${LIST_PATH}${query ? `?${stringify(query)}` : ''}`,
          },
          { title: title, name: title },
        ];
      },
      [name]
    );
    // 表单finish事件
    const onFinish = useCallback(
      values => {
        const payload = GET_PAYLOAD_BY_VALUES({
          ...values,
          company: isUnit ? { key: unitId } : values.company,
        });
        if (name === 'add') {
          add(payload, success => {
            if (success) {
              router.replace(LIST_PATH);
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
                router.replace({
                  pathname: LIST_PATH,
                  query,
                });
              }
            }
          );
        }
      },
      [pathname]
    );
    // 单位选择器search事件
    const onCompanySelectSearch = useMemo(() => {
      let timer;
      return value => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          getCompanyList({
            name: value && value.trim(),
          });
        }, 300);
      };
    }, []);
    // 单位选择器change事件
    const onCompanySelectChange = useCallback(company => {
      // 如果已选择单位，则获取部门列表和人员列表
      if (company) {
        getDepartmentTree({
          companyId: company.key,
        });
        getPersonList({
          companyId: company.key,
        });
      }
      // 清空部门和人员字段值
      form.setFieldsValue({
        department: undefined,
        principal: undefined,
      });
    }, []);
    // 人员选择器search事件
    const onPersonSelectSearch = useMemo(() => {
      let timer;
      return value => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          const { department } = form.getFieldsValue();
          if (department) {
            getPersonList({
              departmentId: department.key,
              name: value && value.trim(),
            });
          }
        }, 300);
      };
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
              labelCol={LABEL_COL}
              wrapperCol={WRAPPER_COL}
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
                      {[
                        {
                          name: 'company',
                          label: '单位名称',
                          children:
                            name !== 'detail' ? (
                              <Select
                                placeholder="请选择"
                                labelInValue
                                notFoundContent={
                                  loadingCompanyList ? <Spin size="small" /> : undefined
                                }
                                showSearch
                                filterOption={false}
                                disabled={name === 'edit' || isUnit}
                                onSearch={onCompanySelectSearch}
                                onChange={onCompanySelectChange}
                                onPopupScroll={
                                  !appendingCompanyList &&
                                  companyList &&
                                  companyList.pagination &&
                                  companyList.pagination.total >
                                    companyList.pagination.pageNum * companyList.pagination.pageSize
                                    ? ({ target: { scrollTop, offsetHeight, scrollHeight } }) => {
                                        if (scrollTop + offsetHeight === scrollHeight) {
                                          const {
                                            pagination: { pageNum },
                                          } = companyList;
                                          setAppendingCompanyList(true);
                                          getCompanyList(
                                            {
                                              pageNum: pageNum + 1,
                                            },
                                            () => {
                                              setTimeout(() => {
                                                setAppendingCompanyList(false);
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
                                    {appendingCompanyList && (
                                      <Spin className={styles.dropdownSpin} />
                                    )}
                                  </div>
                                )}
                              >
                                {(!loadingCompanyList || appendingCompanyList) &&
                                companyList &&
                                companyList.list
                                  ? companyList.list.map(item => <Option {...item} />)
                                  : []}
                              </Select>
                            ) : detail.companyName ? (
                              <span>{detail.companyName}</span>
                            ) : (
                              <EmptyText />
                            ),
                          getValueFromEvent: getSelectValueFromEvent,
                          rules: [{ required: true, message: '请选择单位名称' }],
                          col: !isUnit ? COL : HIDDEN_COL,
                        },
                        {
                          name: 'name',
                          label: '名称',
                          children:
                            name !== 'detail' ? (
                              <Input placeholder="请输入" maxLength={50} />
                            ) : detail.name ? (
                              <span>{detail.name}</span>
                            ) : (
                              <EmptyText />
                            ),
                          rules: [
                            { required: true, massage: '请输入名称' },
                            { whitespace: true, message: '名称不能为空格' },
                          ],
                          col: COL,
                        },
                        {
                          name: 'principal',
                          label: '负责人',
                          children:
                            name !== 'detail' ? (
                              <Select
                                placeholder="请选择"
                                labelInValue
                                notFoundContent={
                                  loadingPersonList ? <Spin size="small" /> : undefined
                                }
                                showSearch
                                filterOption={false}
                                onSearch={onPersonSelectSearch}
                                onChange={onPersonSelectChange}
                                onPopupScroll={
                                  !appendingPersonList &&
                                  personList &&
                                  personList.pagination &&
                                  personList.pagination.total >
                                    personList.pagination.pageNum * personList.pagination.pageSize
                                    ? ({ target: { scrollTop, offsetHeight, scrollHeight } }) => {
                                        if (scrollTop + offsetHeight === scrollHeight) {
                                          const {
                                            pagination: { pageNum },
                                          } = personList;
                                          const { department } = form.getFieldsValue();
                                          setAppendingPersonList(true);
                                          getPersonList(
                                            {
                                              departmentId: department.key,
                                              pageNum: pageNum + 1,
                                            },
                                            () => {
                                              setTimeout(() => {
                                                setAppendingPersonList(false);
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
                                    {appendingPersonList && (
                                      <Spin className={styles.dropdownSpin} />
                                    )}
                                  </div>
                                )}
                              >
                                {(!loadingPersonList || appendingPersonList) &&
                                values.company &&
                                personList &&
                                personList.list
                                  ? personList.list.map(item => <Option {...item} />)
                                  : []}
                              </Select>
                            ) : detail.principalName ? (
                              <span>{detail.principalName}</span>
                            ) : (
                              <EmptyText />
                            ),
                          getValueFromEvent: getSelectValueFromEvent,
                          rules: [{ required: true, message: '请选择负责人' }],
                          col: COL,
                        },
                        {
                          name: 'department',
                          label: '所属部门',
                          children:
                            name !== 'detail' ? (
                              <TreeSelect
                                placeholder="请选择"
                                treeData={values.company ? departmentTree : undefined}
                                labelInValue
                                notFoundContent={
                                  loadingDepartmentTree ? <Spin size="small" /> : undefined
                                }
                                showSearch
                                treeNodeFilterProp="title"
                              />
                            ) : detail.departmentName ? (
                              <span>{detail.departmentName}</span>
                            ) : (
                              <EmptyText />
                            ),
                          getValueFromEvent: getSelectValueFromEvent,
                          col: COL,
                        },
                        {
                          name: 'assessmentDate',
                          label: '评定时间',
                          children:
                            name !== 'detail' ? (
                              <DatePicker
                                className={styles.rangePicker}
                                placeholder="请选择"
                                format={FORMAT}
                                allowClear={false}
                              />
                            ) : detail.assessmentDate ? (
                              <span>{moment(detail.assessmentDate).format(FORMAT)}</span>
                            ) : (
                              <EmptyText />
                            ),
                          rules: [{ required: true, message: '请选择评定时间' }],
                          col: COL,
                        },
                        {
                          name: 'otherFileList',
                          label: '分析报告附件',
                          children:
                            name !== 'detail' ? (
                              <Upload folder="HAZOP" />
                            ) : detail.otherFileList && detail.otherFileList.length ? (
                              <div className={styles.fileList}>
                                {detail.otherFileList.map((item, index) => (
                                  <div key={index}>
                                    <a href={item.webUrl} target="_blank" rel="noopener noreferrer">
                                      {item.fileName}
                                    </a>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <EmptyText />
                            ),
                          rules: [
                            {
                              required: true,
                              type: 'array',
                              min: 1,
                              message: '请上传分析报告附件',
                            },
                          ],
                          col: COL,
                        },
                        {
                          children: (
                            <div className={styles.buttonContainer}>
                              {(name === 'add' || name === 'edit') && (
                                <Button
                                  type="primary"
                                  htmlType="submit"
                                  loading={adding || editing}
                                >
                                  提交
                                </Button>
                              )}
                              <Button
                                onClick={() => {
                                  router.replace({
                                    pathname: LIST_PATH,
                                    query,
                                  });
                                }}
                              >
                                返回
                              </Button>
                            </div>
                          ),
                          wrapperCol: BUTTON_WRAPPER_COL,
                          col: COL,
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
          )}
        </Card>
      </PageHeaderLayout>
    );
  }
);
