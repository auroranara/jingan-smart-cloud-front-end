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
import {
  NAMESPACE,
  DETAIL_NAME,
  DETAIL_API,
  ADD_API,
  EDIT_API,
  LIST_PATH,
  FORMAT,
  GET_VALUE_FROM_EVENT,
} from '../config';
import { EmptyText, RENDER_DEPARTMENT_LIST } from '../List';
import styles from './index.less';
const { Option } = Select;

const LABEL_COL = {
  span: 6,
};
const WRAPPER_COL = {
  span: 12,
};
const COL = {
  span: 24,
};
const BUTTON_WRAPPER_COL = {
  offset: 6,
};
const GET_VALUES_BY_DETAIL = ({
  name,
  companyId,
  companyName,
  departmentId,
  departmentName,
  personId,
  personName,
  evaluateTime,
  fileList,
}) => ({
  name: name || undefined,
  company: companyId ? { key: companyId, value: companyId, label: companyName } : undefined,
  department: departmentId
    ? { key: departmentId, value: departmentId, label: departmentName }
    : undefined,
  person: personId ? { key: personId, value: personId, label: personName } : undefined,
  evaluateTime: evaluateTime ? moment(evaluateTime) : undefined,
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
const GET_PAYLOAD_BY_VALUES = ({ name, company, department, person, evaluateTime, fileList }) => ({
  name: name && name.trim(),
  companyId: company && company.key,
  departmentId: department && department.key,
  personId: person && person.key,
  evaluateTime: evaluateTime && evaluateTime.format(FORMAT),
  fileList,
});

export default connect(
  state => state,
  null,
  (
    {
      user: {
        currentUser: { unitId, unitType },
      },
      common: { companyList, departmentList, personList },
      [NAMESPACE]: { [DETAIL_NAME]: detail },
      loading: {
        effects: {
          [DETAIL_API]: loading,
          [ADD_API]: adding,
          [EDIT_API]: editing,
          'common/getCompanyList': loadingCompanyList,
          'common/getDepartmentList': loadingDepartmentList,
          'common/appendPersonList': loadingPersonList,
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
      detail,
      loading,
      adding,
      editing,
      companyList,
      loadingCompanyList,
      departmentList,
      loadingDepartmentList,
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
          type: 'common/getCompanyList',
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
      getDepartmentList(payload, callback) {
        dispatch({
          type: 'common/getDepartmentList',
          payload,
          callback(success, data) {
            if (!success) {
              message.error('获取部门列表数据失败，请稍后重试！');
            }
            callback && callback(success, data);
          },
        });
      },
      setDepartmentList() {
        dispatch({
          type: 'common/save',
          payload: {
            departmentList: [],
          },
        });
      },
      getPersonList(payload, callback) {
        dispatch({
          type: 'common/appendPersonList',
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
      setPersonList() {
        dispatch({
          type: 'common/save',
          payload: {
            personList: [],
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
        props.departmentList === nextProps.departmentList &&
        props.loadingDepartmentList === nextProps.loadingDepartmentList &&
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
    location: { query },
    unitId,
    isUnit, // detail,
    loading,
    adding,
    editing,
    companyList,
    loadingCompanyList,
    departmentList,
    loadingDepartmentList,
    personList,
    loadingPersonList,
    getDetail,
    add,
    edit,
    getCompanyList,
    getDepartmentList,
    setDepartmentList,
    getPersonList,
    setPersonList,
  }) => {
    const [form] = Form.useForm();
    const [appendingCompanyList, setAppendingCompanyList] = useState(false);
    const [appendingPersonList, setAppendingPersonList] = useState(false);
    const [initialValues, setInitialValues] = useState(undefined);
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
                const { companyId, departmentId } = data;
                // 重置初始值
                setInitialValues(GET_VALUES_BY_DETAIL(data));
                // 如果companyId存在或者当前账号是单位账号，则获取部门列表
                if (companyId || isUnit) {
                  getDepartmentList({
                    companyId: companyId || unitId,
                  });
                } else {
                  setDepartmentList();
                }
                // 如果departmentId存在，则获取人员列表
                if (departmentId) {
                  getPersonList({
                    departmentId,
                  });
                } else {
                  setPersonList();
                }
              } else {
                // 重置初始值
                setInitialValues(undefined);
                // 如果当前账号是单位账号，则获取部门列表
                if (isUnit) {
                  getDepartmentList({
                    companyId: unitId,
                  });
                } else {
                  setDepartmentList();
                }
                setPersonList();
              }
            }
          );
        } else {
          // 重置初始值
          setInitialValues(undefined);
          // 如果当前账号是单位账号，则获取部门列表
          if (isUnit) {
            getDepartmentList({
              companyId: unitId,
            });
          } else {
            setDepartmentList();
          }
          setPersonList();
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
          detail: '危险与可操作性分析详情',
          add: '新增危险与可操作性分析',
          edit: '编辑危险与可操作性分析',
        }[name];
        return [
          { title: '首页', name: '首页', href: '/' },
          { title: '风险分级管控', name: '风险分级管控' },
          {
            title: '危险与可操作性分析（HAZOP）',
            name: '危险与可操作性分析（HAZOP）',
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
        const payload = GET_PAYLOAD_BY_VALUES(values);
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
      [id, name]
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
      // 如果已选择单位，则获取部门列表，否则清空部门列表
      if (company) {
        getDepartmentList({
          companyId: company.key,
        });
      } else {
        setDepartmentList();
      }
      // 清空部门和人员字段值
      form.setFieldsValue({
        department: undefined,
        person: undefined,
      });
    }, []);
    // 部门选择器change事件
    const onDepartmentSelectChange = useCallback(department => {
      // 如果已选择部门，则获取人员列表，否则清空人员列表
      if (department) {
        getPersonList({
          departmentId: department.key || department.value,
        });
      } else {
        setPersonList();
      }
      // 清空人员字段值
      form.setFieldsValue({
        person: undefined,
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
              userName: value && value.trim(),
            });
          }
        }, 300);
      };
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
              <Row gutter={24}>
                {[
                  {
                    name: 'name',
                    label: '工艺名称/分析节点',
                    children: <Input placeholder="请输入" maxLength={50} />,
                    rules: [
                      { required: true, massage: '请输入工艺名称/分析节点' },
                      { whitespace: true, message: '工艺名称/分析节点不能为空格' },
                    ],
                    col: COL,
                  },
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
                                  {appendingCompanyList && <Spin className={styles.dropdownSpin} />}
                                </div>
                              )}
                            >
                              {(!loadingCompanyList || appendingCompanyList) &&
                              companyList &&
                              companyList.list
                                ? companyList.list.map(item => (
                                    <Option key={item.id} value={item.id} title={item.name}>
                                      {item.name}
                                    </Option>
                                  ))
                                : []}
                            </Select>
                          ),
                          getValueFromEvent: GET_VALUE_FROM_EVENT,
                          rules: [{ required: true, message: '请选择单位名称' }],
                          col: COL,
                        },
                      ]
                    : []),
                  {
                    name: 'department',
                    label: '所属部门',
                    children: (
                      <TreeSelect
                        placeholder="请选择"
                        labelInValue
                        notFoundContent={loadingDepartmentList ? <Spin size="small" /> : undefined}
                        showSearch
                        treeNodeFilterProp="title"
                        onChange={onDepartmentSelectChange}
                      >
                        {!loadingDepartmentList && RENDER_DEPARTMENT_LIST(departmentList)}
                      </TreeSelect>
                    ),
                    getValueFromEvent: GET_VALUE_FROM_EVENT,
                    rules: [{ required: true, message: '请选择所属部门' }],
                    col: COL,
                  },
                  {
                    name: 'person',
                    label: '负责人',
                    children: (
                      <Select
                        placeholder="请选择"
                        labelInValue
                        notFoundContent={loadingPersonList ? <Spin size="small" /> : undefined}
                        showSearch
                        filterOption={false}
                        onSearch={onPersonSelectSearch}
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
                            {appendingPersonList && <Spin className={styles.dropdownSpin} />}
                          </div>
                        )}
                      >
                        {(!loadingPersonList || appendingPersonList) &&
                        personList &&
                        personList.list
                          ? personList.list.map(item => (
                              <Option key={item.id} value={item.id} title={item.userName}>
                                {item.userName}
                              </Option>
                            ))
                          : []}
                      </Select>
                    ),
                    getValueFromEvent: GET_VALUE_FROM_EVENT,
                    rules: [{ required: true, message: '请选择负责人' }],
                    col: COL,
                  },
                  {
                    name: 'evaluateTime',
                    label: '评定时间',
                    children: (
                      <DatePicker
                        className={styles.rangePicker}
                        placeholder="请选择"
                        format={FORMAT}
                      />
                    ),
                    rules: [{ required: true, message: '请选择评定时间' }],
                    col: COL,
                  },
                  {
                    name: 'fileList',
                    label: '分析报告附件',
                    children: <Upload folder="HAZOP" />,
                    rules: [
                      { required: true, type: 'array', min: 1, message: '请上传分析报告附件' },
                    ],
                    col: COL,
                  },
                  {
                    children: (
                      <div className={styles.buttonContainer}>
                        {(name === 'add' || name === 'edit') && (
                          <Button type="primary" htmlType="submit" loading={adding || editing}>
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
            </Form>
          )}
        </Card>
      </PageHeaderLayout>
    );
  }
);
