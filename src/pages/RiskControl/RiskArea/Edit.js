import React, { Component, Fragment } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { message, Spin, Card, Row, Col, Button, Checkbox, InputNumber, Tag } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Select from '@/jingan-components/Form/Select';
import Input from '@/jingan-components/Form/Input';
import FengMap from './components/Map/FengMap';
import JoySuchMap from './components/Map/JoySuchMap';
import NoData from '@/pages/BigPlatform/ChemicalV2/components/NoData';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import {
  NAMESPACE,
  DETAIL_API,
  ADD_API,
  MAP_API,
  EDIT_API,
  SAVE_API,
  EDIT_CODE,
  PERSON_API,
  BREADCRUMB_LIST_PREFIX,
  COMPANY_LIST_MAPPER,
  COMPANY_LIST_FIELDNAMES,
  LIST_PATH,
} from './utils';
import styles from './Edit.less';

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};

@connect(
  ({
    user: {
      currentUser: { unitType, unitId, unitName, permissionCodes },
    },
    [NAMESPACE]: { detail, map, personList },
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
    personList,
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
      getPersonList(payload, callback) {
        dispatch({
          type: PERSON_API,
          payload: {
            ...payload,
          },
          callback: (success, data) => {
            if (!success) {
              message.error('获取人员数据失败，请稍后重试！');
            }
            callback && callback(success, data);
          },
        });
      },
    };
  }
)
@Form.create()
export default class RiskAreaEdit extends Component {
  state = {};

  componentDidMount() {
    const { getDetail, getMapInfo, isUnit, unitId, getPersonList } = this.props;
    getDetail({}, (success, detail) => {
      const { companyId } = detail || {};
      setTimeout(() => {
        this.forceUpdate();
      });
      const cId = isUnit ? unitId : companyId;
      cId && getMapInfo({ companyId: cId });
      cId && getPersonList({ unitId: cId });
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
        const { company, areaHeader, coordinate, ...fields } = values;
        const payload = {
          ...fields,
          companyId: company ? company.key : unitId,
          areaHeader: areaHeader && areaHeader.key,
          coordinate: JSON.stringify(coordinate),
        };
        console.log('payload', payload);
        // return;
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
      getPersonList,
    } = this.props;
    if (name) {
      setFieldsValue({
        applyCompanyName: name,
      });
    }
    companyId && getMapInfo({ companyId });
    companyId && getPersonList({ unitId: companyId });
  };

  onRef = ref => {
    this.childMap = ref;
  };

  // 模糊搜索个人列表
  handlePersonSearch = value => {
    const {
      getPersonList,
      form: { getFieldsValue },
    } = this.props;
    const { company } = getFieldsValue();
    if (!company || !company.key) return;
    // 根据输入值获取列表
    getPersonList({ userName: value && value.trim(), unitId: company.key });
  };

  handleAreaHeaderChange = (
    _,
    {
      props: {
        data: { phoneNumber },
      },
    }
  ) => {
    const {
      form: { setFieldsValue },
    } = this.props;
    if (phoneNumber) {
      setFieldsValue({ tel: phoneNumber });
    }
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
      personList,
    } = this.props;
    const isNotDetail = mode !== 'detail';
    const values = getFieldsValue();
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
        key: 'areaCode',
        label: '区域编号',
        component: <Input mode={mode} />,
        options: {
          rules: [{ required: true, message: '区域编号不能为空' }],
        },
      },
      {
        key: 'areaName',
        label: '风险区域名称',
        component: <Input mode={mode} />,
        options: {
          rules: [{ required: true, message: '风险区域名称不能为空' }],
        },
      },
      {
        key: 'areaHeader',
        label: '区域负责人',
        component: (
          <Select
            list={personList}
            fieldNames={{ key: 'userId', value: 'userName' }}
            mode={mode}
            showSearch
            labelInValue
            onSearch={this.handlePersonSearch}
            onChange={this.handleAreaHeaderChange}
          />
        ),
        options: {
          rules: [{ required: true, message: '区域负责人不能为空' }],
        },
      },
      // {
      //   key: 'partName',
      //   label: '所属部门',
      //   component: <Input mode={mode} disabled />,
      // },
      {
        key: 'tel',
        label: '联系电话',
        component: <Input mode={mode} disabled />,
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
                      !mapInfo || !mapInfo.remarks ? (
                        <NoData
                          msg={'请先选择单位或添加地图配置'}
                          style={{ filter: 'grayscale(1)', opacity: 0.8 }}
                        />
                      ) : +mapInfo.remarks === 1 ? (
                        <FengMap onRef={this.onRef} mapInfo={mapInfo} mode={mode} />
                      ) : (
                        <JoySuchMap onRef={this.onRef} mapInfo={mapInfo} mode={mode} />
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
