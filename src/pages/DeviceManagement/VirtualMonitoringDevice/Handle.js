import { Component, Fragment } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  message,
  Radio,
  DatePicker,
  TreeSelect,
  Upload,
  Icon,
  Tooltip,
} from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import router from 'umi/router';
import { AuthButton } from '@/utils/customAuth';
import codesMap from '@/utils/codes';
import moment from 'moment';
import { phoneReg } from '@/utils/validate';
import CompanySelect from '@/jingan-components/CompanySelect';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const itemStyles = { style: { width: 'calc(70%)', marginRight: '10px' } };

@Form.create()
@connect(({ device, personnelPosition }) => ({
  device,
  personnelPosition,
}))
export default class HandleVirtualMonitoringDevice extends Component {

  componentDidMount () {
    const {
      dispatch,
      match: { params: { id } },
      form: { setFieldsValue },
    } = this.props;
    // 获取类型选项
    this.fetchMonitoringDeviceTypes();
    if (id) {
      // 如果编辑，获取详情
      dispatch({
        type: 'device/fetchVirtualMonitoringDeviceDetail',
        payload: { id },
        callback: ({
          companyId,
          companyName,
          locationType,
          area,
          location,
          buildingId,
          floorId,
        }) => {
          setFieldsValue({ company: { key: companyId, label: companyName } });
          setTimeout(() => {
            if (+locationType === 1) {
              setFieldsValue({
                area,
                location,
                locationType,
              })
            } else {
              setFieldsValue({
                buildingId,
                floorId,
                location,
                locationType,
              })
            }
          }, 0);
          companyId && this.fetchBuildings({ payload: { pageNum: 1, pageSize: 0, company_id: companyId } });
          buildingId && this.fetchFloors({ payload: { pageNum: 1, pageSize: 0, building_id: buildingId } });
        },
      })
    }
  }

  // 获取类型选项
  fetchMonitoringDeviceTypes = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'device/fetchAllDeviceTypes',
      payload: { targetRealStatus: 0, type: 3 },
    })
  }

  /**
   * 获取所属建筑列表
   */
  fetchBuildings = actions => {
    const { dispatch } = this.props;
    dispatch({
      type: 'personnelPosition/fetchBuildings',
      ...actions,
    });
  };

  /**
   * 获取楼层
   */
  fetchFloors = actions => {
    const { dispatch } = this.props;
    dispatch({
      type: 'personnelPosition/fetchFloors',
      ...actions,
    });
  };

  /**
   * 清空楼层列表
   */
  resetFloors = actions => {
    const { dispatch } = this.props;
    dispatch({
      type: 'personnelPosition/saveFloors',
      ...actions,
    });
  };

  handleCompanyChange = (value) => {
    const {
      form: { setFieldsValue },
    } = this.props;
    if (value && value.key && value.key !== value.label) {
      this.fetchBuildings({ payload: { pageNum: 1, pageSize: 0, company_id: value.key } });
      setTimeout(() => {
        setFieldsValue({ locationType: 0 });
      }, 0);
    }
  }

  // 所属建筑物改变
  handleBuildingChange = value => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ floorId: undefined });
    if (!value) {
      // 清空楼层下拉
      this.resetFloors({ payload: [] });
      return;
    }
    // 获取楼层
    this.fetchFloors({ payload: { pageNum: 1, pageSize: 0, building_id: value } });
  };

  /**
   * 刷新建筑物楼层图下拉
   */
  handleRefreshBuilding = () => {
    const {
      form: { setFieldsValue, getFieldValue },
    } = this.props;
    const company = getFieldValue('company');
    const companyId = company ? company.key : undefined;
    // 清空选择建筑物和楼层
    setFieldsValue({ buildingId: undefined, floorId: undefined });
    // 获取建筑物下拉 清空楼层下拉
    this.fetchBuildings({ payload: { pageNum: 1, pageSize: 0, company_id: companyId } });
    this.resetFloors({ payload: [] });
  };

  validateBuildingFloor = (rule, value, callback) => {
    const { getFieldsValue } = this.props.form;
    const { buildingId, floorId } = getFieldsValue();
    if (buildingId && floorId) {
      callback();
    } else callback('请选择建筑物楼层');
  }

  // 点击确定
  handleSubmit = () => {
    const {
      dispatch,
      match: {
        params: { id },
      },
      form: { validateFields },
    } = this.props;
    validateFields((err, values) => {
      if (err) return;
      const { company, buildingFloor, ...resValues } = values;
      const payload = {
        ...resValues,
        companyId: company ? company.key : undefined,
      };
      const tag = id ? '编辑' : '新增';
      const success = () => {
        message.success(`${tag}成功`);
        router.push('/device-management/virtual-monitoring-device/list');
      };
      const error = res => { message.error(res ? res.msg : `${tag}失败`) };
      if (id) {
        dispatch({
          type: 'device/editVirtualMonitoringDevice',
          payload: { ...payload, id },
          success,
          error,
        })
      } else {
        dispatch({
          type: 'device/addVirtualMonitoringDevice',
          payload,
          success,
          error,
        })
      }
    })
  }

  /**
   * 渲染表单
   */
  renderForm = () => {
    const {
      match: { params: { id } },
      form: { getFieldDecorator, getFieldsValue },
      device: {
        // 类型
        deviceType: { list: deviceTypeOptions },
        virtualMonitoringDeviceDetail: detail,
      },
      personnelPosition: {
        map: {
          buildings = [], // 建筑物列表
          floors = [], // 楼层列表
        },
      },
    } = this.props;
    const { locationType, company } = getFieldsValue();
    return (
      <Fragment>
        <Card>
          <FormItem label="所属单位" {...formItemLayout}>
            {getFieldDecorator('company', {
              rules: [{ required: true, message: '请选择单位' }],
            })(<CompanySelect type={id ? 'span' : undefined} {...itemStyles} onChange={this.handleCompanyChange} />)}
          </FormItem>
          <FormItem label="设备类型" {...formItemLayout}>
            {getFieldDecorator('type', {
              initialValue: id ? detail.type : undefined,
              rules: [{ required: true, message: '请选择设备类型' }],
            })(
              <Select placeholder="请选择" {...itemStyles} disabled={!!id}>
                {deviceTypeOptions.map(({ id, name }) => (
                  <Select.Option key={id} value={id}>
                    {name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="设备名称" {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: id ? detail.name : undefined,
              rules: [{ required: true, message: '请输入设备名称' }],
            })(<Input placeholder="请输入" {...itemStyles} />)}
          </FormItem>
          <FormItem label="设备编号" {...formItemLayout}>
            {getFieldDecorator('code', {
              initialValue: id ? detail.code : undefined,
              rules: [{ required: true, message: '请输入设备编号' }],
            })(<Input placeholder="请输入" {...itemStyles} />)}
          </FormItem>
          {company && company.key && company.key !== company.label && (
            <Fragment>
              <FormItem label="区域位置录入方式" {...formItemLayout}>
                {getFieldDecorator('locationType', {
                  rules: [{ required: true, message: '请选择区域位置录入方式' }],
                })(
                  <Radio.Group onChange={e => this.handleRefreshBuilding()}>
                    <Radio value={0}>选择建筑物-楼层</Radio>
                    <Radio value={1}>手填</Radio>
                  </Radio.Group>
                )}
              </FormItem>
              {(!locationType || locationType === 0) && (
                <Fragment>
                  <FormItem label="所属建筑物楼层" {...formItemLayout}>
                    {getFieldDecorator('buildingFloor', {
                      rules: [{ required: true, validator: this.validateBuildingFloor }],
                    })(
                      <Fragment>
                        <Col span={5} style={{ marginRight: '10px' }}>
                          {getFieldDecorator('buildingId')(
                            <Select
                              placeholder="建筑物"
                              style={{ width: '100%' }}
                              onChange={this.handleBuildingChange}
                              allowClear
                            >
                              {buildings.map((item, i) => (
                                <Select.Option key={i} value={item.id}>
                                  {item.buildingName}
                                </Select.Option>
                              ))}
                            </Select>
                          )}
                        </Col>
                        <Col span={5} style={{ marginRight: '10px' }}>
                          {getFieldDecorator('floorId')(
                            <Select
                              placeholder="楼层"
                              style={{ width: '100%' }}
                              allowClear
                            >
                              {floors.map((item, i) => (
                                <Select.Option key={i} value={item.id}>
                                  {item.floorName}
                                </Select.Option>
                              ))}
                            </Select>
                          )}
                        </Col>
                        <Tooltip title="刷新建筑物楼层">
                          <Button
                            onClick={() => this.handleRefreshBuilding(true)}
                            style={{ marginRight: '10px' }}
                          >
                            <Icon type="reload" />
                          </Button>
                        </Tooltip>
                        <AuthButton
                          onClick={this.jumpToBuildingManagement}
                          code={codesMap.company.buildingsInfo.add}
                          type="primary"
                        >
                          新增建筑物楼层
                          </AuthButton>
                      </Fragment>
                    )}
                  </FormItem>
                  <FormItem label="详细位置" {...formItemLayout}>
                    {getFieldDecorator('location')(
                      <Input placeholder="请输入" {...itemStyles} />
                    )}
                  </FormItem>
                </Fragment>
              )}
              {locationType === 1 && (
                <Fragment>
                  <FormItem label="所在区域" {...formItemLayout}>
                    {getFieldDecorator('area')(
                      <Input placeholder="请输入" {...itemStyles} />
                    )}
                  </FormItem>
                  <FormItem label="位置详情" {...formItemLayout}>
                    {getFieldDecorator('location')(
                      <Input placeholder="请输入" {...itemStyles} />
                    )}
                  </FormItem>
                </Fragment>
              )}
            </Fragment>
          )}
        </Card>
        <Row style={{ textAlign: 'center', marginTop: '24px' }}>
          <Button
            style={{ marginRight: '10px' }}
            onClick={() => {
              router.goBack();
            }}
          >
            取消
          </Button>
          <Button type="primary" onClick={this.handleSubmit}>
            确定
          </Button>
        </Row>
      </Fragment>
    )
  }

  render () {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    const title = id ? '编辑虚拟监测对象' : '新增虚拟监测对象';
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '物联设备管理', name: '物联设备管理' },
      {
        title: '虚拟监测对象管理',
        name: '虚拟监测对象管理',
        href: '/device-management/virtual-monitoring-device/list',
      },
      { title, name: title },
    ];
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderForm()}
      </PageHeaderLayout>
    )
  }
}
