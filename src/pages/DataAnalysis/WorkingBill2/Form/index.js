import React, { Fragment, useState, useEffect, useMemo, useCallback } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import FooterToolbar from '@/components/FooterToolbar';
import { message, Card, Skeleton, Form, Row, Col, Button, Empty } from 'antd';
import FengMap from '../components/Map/FengMap';
import JoySuchMap from '../components/Map/JoySuchMap';
import router from 'umi/router';
import { connect } from 'dva';
import moment from 'moment';
import {
  modelName,
  detailName,
  mapName,
  detailApi,
  addApi,
  editApi,
  mapApi,
  listPath,
  parentLocale,
  listLocale,
  detailLocale,
  addLocale,
  editLocale,
  reapplyLocale,
  typeList,
  companyTypeList,
  workingStatusList,
  yesOrNo,
  getValuesByDetailMap,
  getPayloadByValuesMap,
  getFormFieldsMap,
} from '../config';
import { pagination, getRanges, col } from '@/utils';
import styles from './index.less';

// 获取面包屑
const getBreadcrumbList = ({ name, search }) => {
  const title = {
    detail: detailLocale,
    add: addLocale,
    edit: editLocale,
    reapply: reapplyLocale,
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

export default connect(
  state => state,
  null,
  (
    {
      user: {
        currentUser: { unitId, unitName, unitType },
      },
      dict: {
        companyList,
        departmentTree,
        departmentTree2,
        personList,
        contractorList,
        specialOperatorList,
        contractorPersonnelQualificationList,
      },
      [modelName]: { [detailName]: detail, [mapName]: map },
      loading: {
        effects: {
          [detailApi]: loading,
          [addApi]: adding,
          [editApi]: editing,
          'dict/getCompanyList': loadingCompanyList,
          'dict/getDepartmentTree': loadingDepartmentTree,
          'dict/getDepartmentTree2': loadingDepartmentTree2,
          'dict/getPersonList': loadingPersonList,
          'dict/getContractorList': loadingContractorList,
          'dict/getSpecialOperatorList': loadingSpecialOperatorList,
          'dict/getContractorPersonnelQualificationList': loadingContractorPersonnelQualificationList,
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
      map,
      adding,
      editing,
      companyList,
      loadingCompanyList,
      departmentTree,
      loadingDepartmentTree,
      departmentTree2,
      loadingDepartmentTree2,
      personList,
      loadingPersonList,
      contractorList,
      loadingContractorList,
      specialOperatorList,
      loadingSpecialOperatorList,
      contractorPersonnelQualificationList,
      loadingContractorPersonnelQualificationList,
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
      getMap(payload, callback) {
        dispatch({
          type: mapApi,
          payload,
          callback(success, data) {
            if (!success) {
              message.error('获取地图数据失败，请稍后重试！');
            }
            callback && callback(success, data);
          },
        });
      },
      add(payload, callback) {
        dispatch({
          type: addApi,
          payload,
          callback,
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
      getDepartmentTree2(payload, callback) {
        dispatch({
          type: 'dict/getDepartmentTree2',
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
      getContractorList(payload, callback) {
        dispatch({
          type: 'dict/getContractorList',
          payload: {
            certificateExpireStatus: 4,
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
      getSpecialOperatorList(payload, callback) {
        dispatch({
          type: 'dict/getSpecialOperatorList',
          payload: {
            paststatus: 3,
            ...payload,
          },
          callback(success, data) {
            if (!success) {
              message.error('获取特种作业操作证人员列表数据失败，请稍后重试！');
            }
            callback && callback(success, data);
          },
        });
      },
      getContractorPersonnelQualificationList(payload, callback) {
        dispatch({
          type: 'dict/getContractorPersonnelQualificationList',
          payload: {
            paststatus: 3,
            ...payload,
          },
          callback(success, data) {
            if (!success) {
              message.error('获取承包商人员资质列表数据失败，请稍后重试！');
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
        props.map === nextProps.map &&
        props.adding === nextProps.adding &&
        props.editing === nextProps.editing &&
        props.companyList === nextProps.companyList &&
        props.loadingCompanyList === nextProps.loadingCompanyList &&
        props.departmentTree === nextProps.departmentTree &&
        props.loadingDepartmentTree === nextProps.loadingDepartmentTree &&
        props.departmentTree2 === nextProps.departmentTree2 &&
        props.loadingDepartmentTree2 === nextProps.loadingDepartmentTree2 &&
        props.personList === nextProps.personList &&
        props.loadingPersonList === nextProps.loadingPersonList &&
        props.contractorList === nextProps.contractorList &&
        props.loadingContractorList === nextProps.loadingContractorList &&
        props.specialOperatorList === nextProps.specialOperatorList &&
        props.loadingSpecialOperatorList === nextProps.loadingSpecialOperatorList &&
        props.contractorPersonnelQualificationList ===
          nextProps.contractorPersonnelQualificationList &&
        props.loadingContractorPersonnelQualificationList ===
          nextProps.loadingContractorPersonnelQualificationList &&
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
    location: { pathname, search: unsafeSearch, query },
    unitId,
    unitName,
    isUnit,
    // detail = {},
    loading,
    map,
    adding,
    editing,
    companyList,
    loadingCompanyList,
    departmentTree,
    loadingDepartmentTree,
    departmentTree2,
    loadingDepartmentTree2,
    personList,
    loadingPersonList,
    contractorList,
    loadingContractorList,
    specialOperatorList,
    loadingSpecialOperatorList,
    contractorPersonnelQualificationList,
    loadingContractorPersonnelQualificationList,
    getDetail,
    getMap,
    add,
    edit,
    getCompanyList,
    getDepartmentTree,
    getDepartmentTree2,
    getPersonList,
    getContractorList,
    getSpecialOperatorList,
    getContractorPersonnelQualificationList,
  }) => {
    // 创建表单引用
    const [form] = Form.useForm();
    // 创建单位列表接口对应的payload（通过监听payload的变化来请求接口）
    const [companyPayload, setCompanyPayload] = useState(undefined);
    // 创建人员列表接口对应的payload（同上）
    const [personPayload, setPersonPayload] = useState(undefined);
    // 创建承包商列表接口对应的payload（同上）
    const [contractorPayload, setContractorPayload] = useState(undefined);
    // 创建特种作业操作证人员列表接口对应的payload（同上）
    const [specialOperatorPayload, setSpecialOperatorPayload] = useState(undefined);
    // 创建承包商人员资质列表接口对应的payload（同上）
    const [
      contractorPersonnelQualificationPayload,
      setContractorPersonnelQualificationPayload,
    ] = useState(undefined);
    // 获取search（用于路由跳转）
    const search = useMemo(
      () => unsafeSearch && (unsafeSearch.startsWith('?') ? unsafeSearch : `?${unsafeSearch}`),
      [unsafeSearch]
    );
    // 获取面包屑
    const breadcrumbList = useMemo(() => getBreadcrumbList({ name, search }), [name, search]);
    // 今天初始时间戳
    const today = +moment().startOf('day');
    // 获取表单初始值
    const initialValues = useMemo(
      () => ({
        company: isUnit ? { key: unitId, value: unitId, label: unitName } : undefined,
        billType: query.billType || typeList[0].key,
        applyDate: moment(),
        workingCompanyType: companyTypeList[0].key,
        workingStatus: workingStatusList[0].key,
        isSetWarn: yesOrNo[1].key,
      }),
      [today]
    );
    // 获取时间范围选择器的快捷选项
    const ranges = useMemo(() => getRanges(['今天', '最近一周', '最近一个月', '最近三个月']), [
      today,
    ]);
    // 表单finish事件
    const onFinish = useCallback(
      values => {
        const payload = getPayloadByValuesMap[values.billType](values);
        if (name === 'add') {
          add(payload, (success, data) => {
            if (success) {
              message.success('新增成功！');
              router.push(`${listPath}?billType=${values.billType}`);
            } else {
              message.error(`新增失败，${data || '请稍后重试'}！`);
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
        } else if (name === 'reapply') {
          add(
            {
              overId: id,
              ...payload,
            },
            (success, data) => {
              if (success) {
                message.success('重新申请成功！');
                router.push(`${listPath}?billType=${values.billType}`);
              } else {
                message.error(`重新申请失败，${data || '请稍后重试'}！`);
              }
            }
          );
        }
      },
      [pathname]
    );
    // 单位选择器change事件
    const onCompanySelectChange = useCallback(company => {
      // 如果已选择单位，则获取人员列表、部门列表、承包商列表、特种作业操作证人员列表、地图数据
      if (company) {
        setPersonPayload({ ...pagination, companyId: company.key });
        getDepartmentTree({
          companyId: company.key,
        });
        getDepartmentTree2({ companyId: company.key });
        setContractorPayload({ ...pagination, companyId: company.key });
        setSpecialOperatorPayload({ ...pagination, companyId: company.key });
        getMap({ companyId: company.key });
      }
      // 清空申请部门、申请人、作业单位名称、作业人、作业区域划分
      form.setFieldsValue({
        applyUser: undefined,
        applyDepartment: undefined,
        workingCompany: undefined,
        workingPersonnel: undefined,
        mapAddress: undefined,
      });
    }, []);
    // 人员选择器change事件
    const onPersonSelectChange = useCallback(
      (_, { data: { companyName, departmentId, departmentName } }) => {
        // 设置申请单位、申请部门
        form.setFieldsValue({
          workingCompanyName: companyName || undefined,
          applyDepartment: departmentId
            ? { key: departmentId, value: departmentId, label: departmentName }
            : undefined,
        });
      },
      []
    );
    // 承包商选择器change事件
    const onContractorSelectChange = useCallback(contractor => {
      // 如果已选择承包商，则获取承包商人员资质列表
      if (contractor) {
        setContractorPersonnelQualificationPayload({ ...pagination, companyId: contractor.key });
      }
      // 清空作业人
      form.setFieldsValue({
        workingPersonnel: undefined,
      });
    }, []);
    // 提交按钮点击事件
    const onSubmitButtonClick = useCallback(() => {
      form.submit();
    }, []);
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
                const { billType, companyId, workingCompanyId } = data;
                // 设置初始值
                form.setFieldsValue(getValuesByDetailMap[billType](data));
                // 如果companyId存在或者当前账号是单位账号，则获取人员列表、部门列表、承包商列表、特种作业操作证人员列表、地图数据
                if (companyId || isUnit) {
                  setPersonPayload({ ...pagination, companyId: companyId || unitId });
                  getDepartmentTree({
                    companyId: companyId || unitId,
                  });
                  getDepartmentTree2({ companyId: companyId || unitId });
                  setContractorPayload({ ...pagination, companyId: companyId || unitId });
                  setSpecialOperatorPayload({ ...pagination, companyId: companyId || unitId });
                  getMap({ companyId: companyId || unitId });
                }
                // 如果workingCompanyId存在，则获取承包商人员资质列表
                if (workingCompanyId) {
                  setContractorPersonnelQualificationPayload({
                    ...pagination,
                    companyId: workingCompanyId,
                  });
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
          // 如果当前账号是单位账号，则获取人员列表、部门列表、承包商列表、特种作业操作证人员列表、地图数据
          if (isUnit) {
            setPersonPayload({ ...pagination, companyId: unitId });
            getDepartmentTree({
              companyId: unitId,
            });
            getDepartmentTree2({ companyId: unitId });
            setContractorPayload({ ...pagination, companyId: unitId });
            setSpecialOperatorPayload({ ...pagination, companyId: unitId });
            getMap({ companyId: unitId });
          }
        }
        // 如果当前账号不是单位账号时，则获取单位列表
        if (!isUnit) {
          setCompanyPayload({ ...pagination });
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
    // 当contractorPayload发生变化时获取承包商列表
    useEffect(
      () => {
        // 当前账号是单位账号或者已选择单位时才请求接口
        if (contractorPayload && contractorPayload.companyId) {
          getContractorList(contractorPayload);
        }
      },
      [contractorPayload]
    );
    // 当specialOperatorPayload发生变化时获取特种作业操作证人员列表
    useEffect(
      () => {
        // 当前账号是单位账号或者已选择单位时才请求接口
        if (specialOperatorPayload && specialOperatorPayload.companyId) {
          getSpecialOperatorList(specialOperatorPayload);
        }
      },
      [specialOperatorPayload]
    );
    // 当contractorPersonnelQualificationPayload发生变化时获取承包商人员资质列表
    useEffect(
      () => {
        // 已选择承包商时才请求接口
        if (
          contractorPersonnelQualificationPayload &&
          contractorPersonnelQualificationPayload.companyId
        ) {
          getContractorPersonnelQualificationList(contractorPersonnelQualificationPayload);
        }
      },
      [contractorPersonnelQualificationPayload]
    );
    return (
      <PageHeaderLayout
        key={`${name}${search}`}
        breadcrumbList={breadcrumbList}
        title={breadcrumbList[breadcrumbList.length - 1].title}
      >
        <Form
          form={form}
          layout={name !== 'detail' ? 'vertical' : undefined}
          initialValues={initialValues}
          onFinish={onFinish}
        >
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, values) =>
              [
                'company',
                'billType',
                'workingCompanyType',
                'workingCompany',
                'approveStatus',
                'workingStatus',
                'isSetWarn',
              ].some(dependency => prevValues[dependency] !== values[dependency])
            }
          >
            {({ getFieldsValue }) => {
              const values = { ...initialValues, ...getFieldsValue() };
              return (
                <Fragment>
                  <Card title="作业票信息">
                    {loading ? (
                      <Skeleton active />
                    ) : (
                      <Row className={styles.row} gutter={24}>
                        {getFormFieldsMap[values.billType]({
                          isUnit,
                          values,
                          name,
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
                          departmentTree2,
                          loadingDepartmentTree2,
                          contractorList,
                          loadingContractorList,
                          setContractorPayload,
                          onContractorSelectChange,
                          specialOperatorList,
                          loadingSpecialOperatorList,
                          setSpecialOperatorPayload,
                          contractorPersonnelQualificationList,
                          loadingContractorPersonnelQualificationList,
                          setContractorPersonnelQualificationPayload,
                          ranges,
                        }).map(({ name, col, ...item }, index) => (
                          <Col key={name || index} {...col}>
                            <Form.Item name={name} {...item} />
                          </Col>
                        ))}
                      </Row>
                    )}
                  </Card>
                  {values.isSetWarn === yesOrNo[0].key && (
                    <Card className={styles.card} title="作业区域划分">
                      {values.company ? (
                        <Row className={styles.row} gutter={24}>
                          {[
                            {
                              name: 'mapAddress',
                              children:
                                `${map.remarks}` === '1' ? (
                                  <FengMap mapInfo={map} mode={name} />
                                ) : (
                                  <JoySuchMap mapInfo={map} mode={name} />
                                ),
                              col,
                            },
                          ].map(({ name, col, ...item }, index) => (
                            <Col key={name || index} {...col}>
                              <Form.Item name={name} {...item} />
                            </Col>
                          ))}
                        </Row>
                      ) : (
                        <Empty description="请先选择单位名称" />
                      )}
                    </Card>
                  )}
                </Fragment>
              );
            }}
          </Form.Item>
        </Form>
        <FooterToolbar>
          <Button size="large" href={`#${listPath}${search}`}>
            返回
          </Button>
          {name !== 'detail' && (
            <Button
              className={styles.submitButton}
              size="large"
              type="primary"
              loading={adding || editing}
              onClick={onSubmitButtonClick}
            >
              提交
            </Button>
          )}
        </FooterToolbar>
      </PageHeaderLayout>
    );
  }
);
