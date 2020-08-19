import React, { Component, Fragment } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { message, Spin, Card, Row, Col, Button, notification } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Select from '@/jingan-components/Form/Select';
import Input from '@/jingan-components/Form/Input';
import Radio from '@/jingan-components/Form/Radio';
import TextArea from '@/jingan-components/Form/TextArea';
import DatePicker from '@/jingan-components/Form/DatePicker';
import RiskCorrectFactor from './components/RiskCorrectFactor';
import FengMap from './components/Map/FengMap';
import JoySuchMap from './components/Map/JoySuchMap';
import NoData from '@/pages/BigPlatform/ChemicalV2/components/NoData';
import { connect } from 'dva';
import router from 'umi/router';
import { isNumber } from '@/utils/utils';
import moment from 'moment';
import {
  NAMESPACE,
  DETAIL_API,
  ADD_API,
  MAP_API,
  EDIT_API,
  SAVE_API,
  EDIT_CODE,
  AREA_API,
  BREADCRUMB_LIST_PREFIX,
  COMPANY_LIST_MAPPER,
  COMPANY_LIST_FIELDNAMES,
  LIST_PATH,
  FourLvls,
} from './utils';
import styles from './Edit.less';

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};

const DefaultFeilds = {
  phoneNumber: undefined,
  zoneCode: undefined,
  zoneChargerName: undefined,
  inherentRiskLevel: undefined,
  controlRiskLevel: undefined,
  zoneLevel: undefined,
  area: undefined,
  riskCorrectFactor: undefined,
  riskCorrectLevel: undefined,
  checkCircle: undefined,
  createTime: undefined,
  coordinate: undefined,
};

const getRiskLvl = (inherentRiskLevel, controlRiskLevel) => {
  if (!inherentRiskLevel || !controlRiskLevel) return undefined;
  const score = (inherentRiskLevel || 4) * (controlRiskLevel || 4);
  if (score <= 4) return 1;
  else if (score > 4 && score <= 8) return 2;
  else if (score > 8 && score <= 12) return 3;
  else return 4;
};

@connect(
  ({
    user: {
      currentUser: { unitType, unitId, unitName, permissionCodes },
    },
    [NAMESPACE]: { detail, map, areaList },
    loading: {
      effects: { [DETAIL_API]: loading, [ADD_API]: adding, [EDIT_API]: editing },
    },
  }) => ({
    isUnit: unitType === 4,
    unitId,
    unitName,
    detail,
    loading,
    mapInfo: map,
    areaList,
    submitting: adding || editing,
    hasEditAuthority: permissionCodes.includes(EDIT_CODE),
  }),
  null,
  (
    stateProps,
    { dispatch },
    {
      match: {
        params: { id },
      },
      route: { path, name },
      location: { pathname },
    }
  ) => {
    const title = {
      detail: '风险区域划分详情',
      add: '新增风险区域',
      edit: '编辑风险区域',
    }[name];
    const goBack = () => {
      router.push(LIST_PATH);
    };
    return {
      ...stateProps,
      mode: name,
      breadcrumbList: BREADCRUMB_LIST_PREFIX.concat([
        {
          title: '风险区域划分',
          name: '风险区域划分',
          href: path.replace(/:id\?.*/, 'list'),
        },
        {
          title,
          name: title,
        },
      ]),
      getDetail(payload, callback) {
        if (id) {
          dispatch({
            type: DETAIL_API,
            payload: {
              id,
            },
            callback: (success, data) => {
              if (!success) {
                message.error('获取详情数据失败，请稍后重试！');
              }
              callback && callback(success, data);
            },
          });
        } else {
          dispatch({
            type: SAVE_API,
            payload: {
              detail: {},
            },
          });
          setTimeout(callback);
        }
      },
      add(payload, callback) {
        dispatch({
          type: ADD_API,
          payload,
          callback: (success, data) => {
            if (success) {
              message.success('新增成功！');
              // goBack();
              setTimeout(goBack, 1000);
            } else {
              message.error(`新增失败，${data}！`);
            }
            callback && callback(success, data);
          },
        });
      },
      edit(payload, callback) {
        dispatch({
          type: EDIT_API,
          payload: {
            id,
            ...payload,
          },
          callback: (success, data) => {
            if (success) {
              message.success('编辑成功！');
              // goBack();
              setTimeout(goBack, 1000);
            } else {
              message.error(`编辑失败，${data}！`);
            }
            callback && callback(success, data);
          },
        });
      },
      goBack,
      goToEdit() {
        router.push(pathname.replace(`${name}`, 'edit'));
      },
      getMapInfo(payload, callback) {
        dispatch({
          type: MAP_API,
          payload: {
            ...payload,
          },
          callback: (success, data) => {
            if (!success) {
              message.error('获取地图数据失败，请稍后重试！');
            }
            callback && callback(success, data);
          },
        });
      },
      getAreaList(payload, callback) {
        dispatch({
          type: AREA_API,
          payload: {
            pageNum: 1,
            pageSize: 10,
            isSynZone: 0,
            ...payload,
          },
          callback: (success, data) => {
            if (!success) {
              message.error('获取区域数据失败，请稍后重试！');
            }
            callback && callback(success, data);
          },
        });
      },
    };
  }
)
@Form.create()
export default class FourColorsEdit extends Component {
  state = {};

  componentDidMount() {
    const { getDetail, getMapInfo, isUnit, unitId, getAreaList } = this.props;
    getDetail({}, (success, detail) => {
      const { companyId } = detail || {};
      setTimeout(() => {
        this.forceUpdate();
      });
      const cId = isUnit ? unitId : companyId;
      cId && getMapInfo({ companyId: cId });
      cId && getAreaList({ companyId: cId });
    });
  }

  handleSubmit = () => {
    const {
      form: { validateFieldsAndScroll },
    } = this.props;

    validateFieldsAndScroll((error, values) => {
      console.log('values', values);
      const { coordinate } = values;
      if (!coordinate || !coordinate.length) {
        return message.warning('请在地图上划分区域');
      }
      if (!error) {
        const { unitId, mode, [mode]: submit } = this.props;
        const { company, area, riskCorrectFactor = [], coordinate, ...fields } = values;
        const payload = {
          ...fields,
          companyId: company ? company.key : unitId,
          areaId: area.key,
          riskCorrectFactor: riskCorrectFactor[1],
          coordinate: JSON.stringify(coordinate),
        };
        console.log('payload', payload);
        submit(payload);
      }
    });
  };

  handleCompanySelect = (
    _,
    {
      props: {
        data: { name, company_id: companyId },
      },
    }
  ) => {
    const {
      form: { setFieldsValue },
      getMapInfo,
      getAreaList,
    } = this.props;
    setFieldsValue({
      ...DefaultFeilds,
    });
    companyId && getMapInfo({ companyId });
    companyId && getAreaList({ companyId });
  };

  // 搜索区域列表
  handleAreaSearch = value => {
    const {
      getAreaList,
      form: { getFieldsValue },
    } = this.props;
    const { company } = getFieldsValue();
    if (!company || !company.key) return;
    // 根据输入值获取列表
    getAreaList({ areaName: value && value.trim(), companyId: company.key });
  };

  handleAreaChange = (_, select) => {
    const {
      form: { setFieldsValue },
    } = this.props;
    if (!select) {
      setFieldsValue({
        ...DefaultFeilds,
      });
      return;
    }
    const {
      props: {
        data: { tel, areaCode, areaHeaderName, inherentRiskLevel, controlRiskLevel, coordinate },
      },
    } = select;
    const zoneLevel = getRiskLvl(inherentRiskLevel, controlRiskLevel);
    const correctLvlList = zoneLevel ? FourLvls.slice(0, +zoneLevel) : [];
    setFieldsValue({
      phoneNumber: tel,
      zoneCode: areaCode,
      zoneChargerName: areaHeaderName,
      inherentRiskLevel: inherentRiskLevel ? +inherentRiskLevel : undefined,
      controlRiskLevel: controlRiskLevel ? +controlRiskLevel : undefined,
      zoneLevel,
      coordinate: JSON.parse(coordinate),
      riskCorrectLevel: zoneLevel ? correctLvlList[correctLvlList.length - 1].key : undefined,
    });
    if (!inherentRiskLevel || !controlRiskLevel) {
      const risks = [!inherentRiskLevel, !controlRiskLevel];
      notification.warning({
        message: '提示',
        description: (
          <div>
            该区域
            <span style={{ color: '#40a9ff' }}>
              {['固有风险等级', '控制风险等级'].filter((item, index) => risks[index]).join('、')}
            </span>
            暂未评级，请先做评级后再进行操作。
          </div>
        ),
      });
    }
  };

  // 验证风险矫正因素是否为空
  validateRiskFactor = (rule, value, callback) => {
    const [radioValue, textValue] = value || [];
    if (radioValue === 1 && (!textValue || !textValue.trim())) {
      callback('风险矫正因素不能为空');
    } else {
      callback();
    }
  };

  handleChangeRiskFactor = (val = []) => {
    const {
      form: { setFieldsValue, getFieldsValue },
    } = this.props;
    const [radioValue] = val;
    const { zoneLevel } = getFieldsValue();
    if (radioValue === 0) setFieldsValue({ riskCorrectLevel: zoneLevel });
  };

  render() {
    const {
      isUnit,
      unitId,
      unitName,
      breadcrumbList,
      mode,
      detail = {},
      loading = false,
      submitting = false,
      hasEditAuthority,
      goBack,
      goToEdit,
      form: { getFieldDecorator, getFieldsValue },
      mapInfo,
      areaList,
    } = this.props;
    const isNotDetail = mode !== 'detail';
    const values = getFieldsValue();
    const company = detail.company || values.company;
    const { riskCorrectFactor = [], zoneLevel, riskCorrectLevel } = values;
    const hasRiskFactor = riskCorrectFactor[0] === 1;
    const correctLvlList = zoneLevel ? FourLvls.slice(0, +zoneLevel) : [];
    console.log('correctLvlList', correctLvlList);
    console.log('riskCorrectLevel', detail.riskCorrectLevel);
    console.log('typeof', typeof(detail.riskCorrectLevel));
    const fields = [
      ...(isUnit
        ? []
        : [
            {
              key: 'company',
              label: '单位名称',
              component: (
                <Select
                  showSearch
                  filterOption={false}
                  labelInValue
                  mapper={COMPANY_LIST_MAPPER}
                  fieldNames={COMPANY_LIST_FIELDNAMES}
                  disabled={mode !== 'add'}
                  mode={mode}
                  onSelect={this.handleCompanySelect}
                />
              ),
              options: {
                initialValue: detail.company,
                rules: [{ type: 'object', required: true, message: '单位名称不能为空' }],
              },
            },
          ]),
      {
        key: 'area',
        label: '区域名称',
        component: (
          <Select
            list={company ? areaList : []}
            fieldNames={{ key: 'id', value: 'areaName' }}
            disabled={mode !== 'add'}
            mode={mode}
            allowClear
            showSearch
            labelInValue
            onSearch={this.handleAreaSearch}
            onChange={this.handleAreaChange}
          />
        ),
        options: {
          initialValue: detail.area,
          rules: [{ type: 'object', required: true, message: '区域名称不能为空' }],
        },
      },
      {
        key: 'zoneCode',
        label: '区域编号',
        component: <Input mode={'detail'} />,
        options: {
          rules: [{ required: true, message: '区域编号不能为空' }],
        },
      },
      {
        key: 'zoneChargerName',
        label: '区域负责人',
        component: <Input mode={'detail'} />,
        options: {
          rules: [{ required: true, message: '区域负责人不能为空' }],
        },
      },
      {
        key: 'phoneNumber',
        label: '联系电话',
        component: <Input mode={'detail'} />,
        options: {
          rules: [{ required: true, message: '联系电话不能为空' }],
        },
      },
      {
        key: 'inherentRiskLevel',
        label: '固有风险等级',
        component: <Select list={FourLvls} mode={'detail'} />,
        options: {
          rules: [{ required: true, message: '固有风险等级不能为空' }],
        },
      },
      {
        key: 'controlRiskLevel',
        label: '控制风险等级',
        component: <Select list={FourLvls} mode={'detail'} />,
        options: {
          rules: [{ required: true, message: '控制风险等级不能为空' }],
        },
      },
      {
        key: 'zoneLevel',
        label: '风险等级',
        component: <Select list={FourLvls} mode={'detail'} />,
        options: {

          rules: [{ required: true, message: '风险等级不能为空' }],
        },
      },
      {
        key: 'riskCorrectFactor',
        label: '风险矫正因素',
        component: <RiskCorrectFactor mode={mode} onChange={this.handleChangeRiskFactor} />,
        options: {
          initialValue: detail.riskCorrectFactor || [0],
          rules: [
            { required: true, message: '风险矫正因素不能为空' },
            { validator: this.validateRiskFactor },
          ],
        },
      },
      {
        key: 'riskCorrectLevel',
        label: '风险矫正等级',
        component: <Select list={correctLvlList} mode={!hasRiskFactor ? 'detail' : mode} />,
        // component: <Select list={FourLvls} mode={!hasRiskFactor ? 'detail' : mode} />,
        options: {
          rules: [{ required: true, message: '风险矫正等级不能为空' }],
        },
      },
      {
        key: 'checkCircle',
        label: '复评周期（月）',
        component: <Input mode={mode} />,
        options: {
          rules: [
            { required: true, message: '复评周期（月）不能为空' },
            {
              message: '只能输入正整数',
              pattern: /^[1-9]\d*$/,
            },
          ],
        },
      },
      {
        key: 'createTime',
        label: '开始时间',
        component: <DatePicker format={'YYYY-MM-DD'} mode={mode} />,
        options: {
          rules: [{ required: true, message: '开始时间不能为空' }],
        },
      },
    ];

    return (
      <PageHeaderLayout
        className={styles.pageHeader}
        breadcrumbList={breadcrumbList}
        title={breadcrumbList[breadcrumbList.length - 1].title}
      >
        <Spin spinning={loading}>
          <Card className={styles.card}>
            <Form className={isNotDetail ? undefined : styles.detailForm} layout={'horizontal'}>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item>
                    {getFieldDecorator('coordinate', {
                      initialValue: detail.coordinate,
                    })(
                      !company || !mapInfo || !mapInfo.remarks ? (
                        <NoData
                          msg={'请先选择单位或添加地图配置'}
                          style={{ filter: 'grayscale(1)', opacity: 0.8 }}
                        />
                      ) : +mapInfo.remarks === 1 ? (
                        <FengMap mapInfo={mapInfo} mode={'detail'} lvl={riskCorrectLevel} />
                      ) : (
                        <JoySuchMap mapInfo={mapInfo} mode={'detail'} lvl={riskCorrectLevel} />
                      )
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  {fields.map(({ key, label, component, options }) => (
                    <Form.Item key={key} label={label} {...formItemLayout}>
                      {getFieldDecorator(
                        key,
                        isNotDetail
                          ? { initialValue: detail[key], ...options }
                          : { initialValue: detail[key], ...options, rules: undefined }
                      )(component)}
                    </Form.Item>
                  ))}
                  <div className={styles.buttonContainer}>
                    <div className={styles.buttonWrapper}>
                      <Button onClick={goBack}>返回</Button>
                    </div>
                    <div className={styles.buttonWrapper}>
                      {isNotDetail ? (
                        <Button type="primary" onClick={this.handleSubmit} loading={submitting}>
                          提交
                        </Button>
                      ) : (
                        <Button type="primary" onClick={goToEdit} disabled={!hasEditAuthority}>
                          编辑
                        </Button>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </Form>
          </Card>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
