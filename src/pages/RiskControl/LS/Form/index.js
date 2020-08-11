import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { message, Card, Skeleton, Form, Row, Col, Input, DatePicker, Button, Radio } from 'antd';
import Upload from '@/jingan-components/Form/Upload';
import PagingSelect from '@/jingan-components/PagingSelect';
import router from 'umi/router';
import { connect } from 'dva';
import moment from 'moment';
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
  possibilityList,
  severityList,
  RiskLevel,
  Color,
} from '../config';
import {
  dateFormat,
  getSelectValueFromEvent,
  Text,
  labelCol,
  wrapperCol,
  col,
  buttonWrapperCol,
  hiddenCol,
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
// 根据LS获取计算值
const getCalculatedValueByLS = (L, S) => {
  const evaluateValue = L * S;
  const riskLevel = 4 - Math.floor(Math.min(evaluateValue, 15) / 4);
  return {
    evaluateValue,
    riskLevel,
    inherentRiskLevel: riskLevel,
  };
};
// 根据detail获取values（用于初始化）
const getValuesByDetail = ({
  companyId,
  companyName,
  areaId,
  areaName,
  areaCode,
  areaHeadId,
  areaHead,
  belongPartId,
  belongPart,
  tel,
  accidentPossibility,
  accidentResultSeverity,
  riskLevel,
  evaluatePer,
  evaluateDate,
  otherFileList,
}) => ({
  ...getCalculatedValueByLS(accidentPossibility, accidentResultSeverity),
  company: companyId ? { key: companyId, value: companyId, label: companyName } : undefined,
  area: areaId ? { key: areaId, value: areaId, label: areaName } : undefined,
  areaCode: areaCode || undefined,
  areaHead: areaHeadId ? { key: areaHeadId, value: areaHeadId, label: areaHead } : undefined,
  belongPart: belongPartId
    ? { key: belongPartId, value: belongPartId, label: belongPart }
    : undefined,
  tel: tel || undefined,
  accidentPossibility: isNumber(accidentPossibility) ? accidentPossibility : undefined,
  accidentResultSeverity: isNumber(accidentResultSeverity) ? accidentResultSeverity : undefined,
  riskLevel: isNumber(riskLevel) ? riskLevel : undefined,
  evaluatePer: evaluatePer || undefined,
  evaluateDate: evaluateDate ? moment(evaluateDate) : undefined,
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
// 根据values获取payload（用于提交）
const getPayloadByValues = ({
  company,
  area,
  accidentPossibility,
  accidentResultSeverity,
  riskLevel,
  evaluatePer,
  evaluateDate,
  otherFileList,
}) => ({
  companyId: company && company.key,
  areaId: area && area.key,
  accidentPossibility,
  accidentResultSeverity,
  riskLevel,
  evaluatePer: evaluatePer && evaluatePer.trim(),
  evaluateDate: evaluateDate && evaluateDate.format(dateFormat),
  otherFileList,
});
// 获取表单配置
const getFields = ({
  isUnit,
  values,
  name,
  search,
  adding,
  editing,
  companyList,
  loadingCompanyList,
  setCompanyPayload,
  onCompanySelectChange,
  riskyAreaList,
  loadingRiskyAreaList,
  setRiskyAreaPayload,
  onRiskyAreaSelectChange,
  onPossibilityChange,
  onSeverityChange,
}) => [
  {
    name: 'company',
    label: '单位名称',
    children:
      name !== 'detail' ? (
        <PagingSelect
          options={companyList.list}
          loading={loadingCompanyList}
          disabled={isUnit || name === 'edit'}
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
      ) : (
        <Text type="Select" labelInValue />
      ),
    getValueFromEvent: getSelectValueFromEvent,
    rules: name !== 'detail' ? [{ required: true, message: '请选择单位名称' }] : undefined,
    col: !isUnit ? col : hiddenCol,
  },
  {
    name: 'area',
    label: '风险区域名称',
    children:
      name !== 'detail' ? (
        <PagingSelect
          options={values.company ? riskyAreaList.list : []}
          loading={loadingRiskyAreaList}
          hasMore={
            riskyAreaList.pagination &&
            riskyAreaList.pagination.total >
              riskyAreaList.pagination.pageNum * riskyAreaList.pagination.pageSize
          }
          onSearch={name => setRiskyAreaPayload(payload => ({ ...payload, pageNum: 1, name }))}
          loadMore={() =>
            setRiskyAreaPayload(payload => ({ ...payload, pageNum: payload.pageNum + 1 }))
          }
          onChange={onRiskyAreaSelectChange}
        />
      ) : (
        <Text type="Select" labelInValue />
      ),
    getValueFromEvent: getSelectValueFromEvent,
    rules: name !== 'detail' ? [{ required: true, message: '请选择风险区域名称' }] : undefined,
    col,
  },
  {
    name: 'areaCode',
    label: '区域编号',
    children: <Text />,
    col: values.area ? col : hiddenCol,
  },
  {
    name: 'areaHead',
    label: '区域负责人',
    children: <Text type="Select" labelInValue />,
    col: values.area ? col : hiddenCol,
  },
  {
    name: 'belongPart',
    label: '所属部门',
    children: <Text type="TreeSelect" labelInValue />,
    col: values.area ? col : hiddenCol,
  },
  {
    name: 'tel',
    label: '联系电话',
    children: <Text />,
    col: values.area ? col : hiddenCol,
  },
  {
    label: <span className={styles.bold}>固有区域分析（LS）</span>,
    colon: false,
    col,
  },
  {
    name: 'accidentPossibility',
    label: '事故发生的可能性（L）',
    children:
      name !== 'detail' ? (
        <Radio.Group options={possibilityList} onChange={onPossibilityChange} />
      ) : (
        <Text type="Radio" options={possibilityList} />
      ),
    rules:
      name !== 'detail' ? [{ required: true, message: '请选择事故发生的可能性（L）' }] : undefined,
    col,
  },
  {
    name: 'accidentResultSeverity',
    label: '事故后果的严重性（S）',
    children:
      name !== 'detail' ? (
        <Radio.Group options={severityList} onChange={onSeverityChange} />
      ) : (
        <Text type="Radio" options={severityList} />
      ),
    rules:
      name !== 'detail' ? [{ required: true, message: '请选择事故后果的严重性（S）' }] : undefined,
    col,
  },
  {
    name: 'evaluateValue',
    label: '评估风险值（R）',
    children: <Text />,
    col,
  },
  {
    name: 'riskLevel',
    label: '风险级别',
    children: <RiskLevel />,
    col,
  },
  {
    name: 'inherentRiskLevel',
    label: '固有风险等级',
    children: <Color />,
    col,
  },
  {
    label: <span className={styles.bold}>区域固有风险矩阵准则</span>,
    children: (
      <table className={styles.table}>
        <tbody>
          <tr>
            <td rowSpan="2" colSpan="2">
              风险矩阵（R）
            </td>
            <td colSpan="4">事故后果的严重性（S）</td>
          </tr>
          <tr>
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td>4</td>
          </tr>
          <tr>
            <td rowSpan="4">事故发生的可能性（L）</td>
            <td>1</td>
            <td className={styles.blue}>IV</td>
            <td className={styles.blue}>IV</td>
            <td className={styles.blue}>IV</td>
            <td className={styles.yellow}>III</td>
          </tr>
          <tr>
            <td>2</td>
            <td className={styles.blue}>IV</td>
            <td className={styles.yellow}>III</td>
            <td className={styles.yellow}>III</td>
            <td className={styles.orange}>II</td>
          </tr>
          <tr>
            <td>3</td>
            <td className={styles.blue}>IV</td>
            <td className={styles.yellow}>III</td>
            <td className={styles.orange}>II</td>
            <td className={styles.orange}>II</td>
          </tr>
          <tr>
            <td>4</td>
            <td className={styles.yellow}>III</td>
            <td className={styles.orange}>II</td>
            <td className={styles.red}>I</td>
            <td className={styles.red}>I</td>
          </tr>
        </tbody>
      </table>
    ),
    colon: false,
    wrapperCol: col,
    col,
  },
  {
    name: 'evaluatePer',
    label: '评估人员',
    children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
    rules:
      name !== 'detail'
        ? [
            { required: true, message: '请输入评估人员' },
            { whitespace: true, message: '评估人员不能为空格' },
          ]
        : undefined,
    col,
  },
  {
    name: 'evaluateDate',
    label: '评估日期',
    children:
      name !== 'detail' ? (
        <DatePicker
          className={styles.datePicker}
          placeholder="请选择"
          format={dateFormat}
          allowClear={false}
        />
      ) : (
        <Text type="DatePicker" format={dateFormat} />
      ),
    rules: name !== 'detail' ? [{ required: true, message: '请选择评估日期' }] : undefined,
    col,
  },
  {
    name: 'otherFileList',
    label: '附件',
    children: name !== 'detail' ? <Upload /> : <Text type="Upload" />,
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
      dict: { companyList, riskyAreaList },
      [modelName]: { [detailName]: detail },
      loading: {
        effects: {
          [detailApi]: loading,
          [addApi]: adding,
          [editApi]: editing,
          'dict/getCompanyList': loadingCompanyList,
          'dict/getRiskyAreaList': loadingRiskyAreaList,
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
      riskyAreaList,
      loadingRiskyAreaList,
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
              message.error('新增失败，请稍后重试！');
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
              message.error('编辑失败，请稍后重试！');
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
      getRiskyAreaList(payload, callback) {
        dispatch({
          type: 'dict/getRiskyAreaList',
          payload,
          callback(success, data) {
            if (!success) {
              message.error('获取风险区域列表数据失败，请稍后重试！');
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
        props.riskyAreaList === nextProps.riskyAreaList &&
        props.loadingRiskyAreaList === nextProps.loadingRiskyAreaList &&
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
    riskyAreaList,
    loadingRiskyAreaList,
    getDetail,
    add,
    edit,
    getCompanyList,
    getRiskyAreaList,
  }) => {
    // 创建表单引用
    const [form] = Form.useForm();
    // 创建表单初始值
    const [initialValues] = useState({
      ...getCalculatedValueByLS(possibilityList[0].key, severityList[0].key),
      company: isUnit ? { key: unitId, value: unitId, label: unitName } : undefined,
      accidentPossibility: possibilityList[0].key,
      accidentResultSeverity: severityList[0].key,
    });
    // 创建单位列表接口对应的payload（通过监听payload的变化来请求接口）
    const [companyPayload, setCompanyPayload] = useState(undefined);
    // 创建风险区域列表接口对应的payload（同上）
    const [riskyAreaPayload, setRiskyAreaPayload] = useState(undefined);
    // 获取search（用于路由跳转）
    const search = useMemo(
      () => unsafeSearch && (unsafeSearch.startsWith('?') ? unsafeSearch : `?${unsafeSearch}`),
      []
    );
    // 获取面包屑
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
                const { companyId } = data;
                // 设置初始值
                form.setFieldsValue(getValuesByDetail(data));
                // 如果companyId存在或者当前账号是单位账号，则获取风险区域列表
                if (companyId || isUnit) {
                  setRiskyAreaPayload({ pageNum: 1, pageSize: 10, companyId: companyId || unitId });
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
          // 如果当前账号是单位账号，则获取风险区域列表
          if (isUnit) {
            setRiskyAreaPayload({ pageNum: 1, pageSize: 10, companyId: unitId });
          }
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
    // 当riskyAreaPayload发生变化时获取风险区域列表
    useEffect(
      () => {
        if (riskyAreaPayload) {
          getRiskyAreaList(riskyAreaPayload);
        }
      },
      [riskyAreaPayload]
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
    // 单位选择器change事件
    const onCompanySelectChange = useCallback(company => {
      // 如果已选择单位，则获取风险区域列表
      if (company) {
        setRiskyAreaPayload({ pageNum: 1, pageSize: 10, companyId: company.key });
      }
      // 清空风险区域名称字段值
      form.setFieldsValue({
        area: undefined,
      });
    }, []);
    // 风险区域选择器change事件
    const onRiskyAreaSelectChange = useCallback(
      (_, { data: { areaCode, areaHeader, areaHeaderName, partId, partName, tel } }) => {
        // 清空风险区域名称字段值
        form.setFieldsValue({
          areaCode: areaCode || undefined,
          areaHead: areaHeader
            ? { key: areaHeader, value: areaHeader, label: areaHeaderName }
            : undefined,
          belongPart: partId ? { key: partId, value: partId, label: partName } : undefined,
          tel: tel || undefined,
        });
      },
      []
    );
    // 事故发生的可能性（L）change事件
    const onPossibilityChange = useCallback(({ target: { value } }) => {
      const severity = form.getFieldValue('accidentResultSeverity');
      form.setFieldsValue(getCalculatedValueByLS(value, severity));
    }, []);
    // 事故发生的严重性（S）change事件
    const onSeverityChange = useCallback(({ target: { value } }) => {
      const possibility = form.getFieldValue('accidentPossibility');
      form.setFieldsValue(getCalculatedValueByLS(possibility, value));
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
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              onFinish={onFinish}
            >
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, values) =>
                  ['company', 'area'].some(
                    dependency => prevValues[dependency] !== values[dependency]
                  )
                }
              >
                {({ getFieldsValue }) => {
                  const values = getFieldsValue();
                  return (
                    <Row gutter={24}>
                      {getFields({
                        isUnit,
                        values,
                        name,
                        search,
                        adding,
                        editing,
                        companyList,
                        loadingCompanyList,
                        setCompanyPayload,
                        onCompanySelectChange,
                        riskyAreaList,
                        loadingRiskyAreaList,
                        setRiskyAreaPayload,
                        onRiskyAreaSelectChange,
                        onPossibilityChange,
                        onSeverityChange,
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
          )}
        </Card>
      </PageHeaderLayout>
    );
  }
);
