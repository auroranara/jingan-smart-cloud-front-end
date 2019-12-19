import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Form, Modal, Input, Button, Card, DatePicker, Select, message, Tag } from 'antd';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import ToolBar from '@/components/ToolBar';
import CompanyModal from '../../BaseInfo/Company/CompanyModal';
import TableTransFer from './TabTransfer';
import styles from './MajorHazardEdit.less';

const { TextArea } = Input;
const { Option } = Select;
const FormItem = Form.Item;
const spanStyle = { md: 8, sm: 12, xs: 24 };

// 编辑页面标题
const editTitle = '编辑重大危险源';
// 添加页面标题
const addTitle = '新增重大危险源';

@connect(
  ({
    reservoirRegion,
    productionEquipments,
    storageAreaManagement,
    gasometer,
    videoMonitor,
    account,
    user,
    loading,
  }) => ({
    reservoirRegion,
    user,
    videoMonitor,
    account,
    storageAreaManagement,
    productionEquipments,
    gasometer,
    loading: loading.models.reservoirRegion,
    // personModalLoading:
  })
)
@Form.create()
export default class MajorHazardEdit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      companyVisible: false,
      submitting: false,
      detailList: {}, // 详情列表
      resourseVisible: false,
      dangerModalVisible: false, // 重大危险源弹框是否可见
      editCompanyId: '', // 编辑时的companyId
      dangerType: '1', // 重大危险源弹框选择器默认值
      targetKeys: [], // 穿梭框右侧数据keys
      tankIds: '', // 危险源-储罐区选中Id
      areaIds: '', // 危险源-库区选中Id
      productIds: '', // 危险源-生产装置选择Id
      gasometerIds: '', // 危险源-气柜选择Id
      tankAreaList: [], // 储罐区选中列表
      wareHouseAreaList: [], // 库区选中列表
      gasHolderManageList: [], // 气柜选中列表
      productList: [], // 生产装置选中列表
      personModalVisible: false, // 重大危险源责任人弹框是否可见
    };
  }

  // 挂载后
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
      form: { setFieldsValue },
    } = this.props;

    if (id) {
      // 获取列表
      dispatch({
        type: 'reservoirRegion/fetchSourceList',
        payload: {
          pageSize: 18,
          pageNum: 1,
        },
        callback: res => {
          const { list } = res;
          const currentList = list.find(item => item.id === id) || {};
          const { companyId, dangerSourceList } = currentList;
          const { tankArea, wareHouseArea, gasHolderManage, productDevice } =
            dangerSourceList || {};

          const tankAreaIds = tankArea.map(item => item.id) || [];
          const wareHouseAreaIds = wareHouseArea.map(item => item.id) || [];
          const gasHolderManageIds = gasHolderManage.map(item => item.id) || [];
          const productDeviceIds = productDevice.map(item => item.id) || [];

          const allSelectedKeys = tankAreaIds.concat(
            wareHouseAreaIds,
            gasHolderManageIds,
            productDeviceIds
          );

          this.setState({
            detailList: currentList,
            editCompanyId: companyId,
            targetKeys: allSelectedKeys,
            tankIds: tankAreaIds.join(','),
            areaIds: wareHouseAreaIds.join(','),
            gasometerIds: gasHolderManageIds.join(','),
            productIds: productDeviceIds.join(','),
            tankAreaList: tankArea,
            wareHouseAreaList: wareHouseArea,
            gasHolderManageList: gasHolderManage,
            productList: productDevice,
          });
          setFieldsValue({ dangerSourceList: allSelectedKeys });
        },
      });
    }
  }

  /* 去除左右两边空白 */
  handleTrim = e => e.target.value.trim();

  goBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/major-hazard-info/major-hazard/list`));
  };

  // 提交
  handleClickValidate = () => {
    const {
      form: { validateFieldsAndScroll },
      match: {
        params: { id },
      },
      dispatch,
      user: {
        currentUser: { companyId },
      },
    } = this.props;

    validateFieldsAndScroll((error, values) => {
      if (!error) {
        this.setState({
          submitting: true,
        });

        const { tankIds, areaIds, gasometerIds, productIds, editCompanyId } = this.state;

        const {
          companyName,
          code,
          name,
          desc,
          manageType,
          memoryPlace,
          antiStatic,
          dangerTechnology,
          location,
          useDate,
          r,
          dangerLevel,
          chemiclaNature,
          industryArea,
          environmentType,
          environmentName,
          environmentNum,
          dangerDistance,
          safetyDistance,
          linkman,
          linkmanTel,
        } = values;

        const payload = {
          companyId: this.companyId || companyId || editCompanyId,
          companyName,
          code,
          name,
          desc,
          manageType,
          memoryPlace,
          antiStatic,
          dangerTechnology,
          location,
          useDate: useDate && useDate.format('YYYY-MM-DD'),
          r,
          dangerLevel,
          tankIds,
          areaIds,
          gasometerIds,
          productIds,
          chemiclaNature,
          industryArea,
          environmentType,
          environmentName,
          environmentNum,
          dangerDistance,
          safetyDistance,
          linkman,
          linkmanTel,
        };

        const success = () => {
          const msg = id ? '编辑成功' : '新增成功';
          message.success(msg, 1, this.goBack());
        };

        const error = () => {
          const msg = id ? '编辑失败' : '新增失败';
          message.error(msg, 1);
          this.setState({
            submitting: false,
          });
        };
        // 如果id存在的话，为编辑
        if (id) {
          dispatch({
            type: 'reservoirRegion/fetchSourceEdit',
            payload: {
              id,
              ...payload,
            },
            success,
            error,
          });
        }
        // 不存在id,则为新增
        else {
          dispatch({
            type: 'reservoirRegion/fetchSourceAdd',
            payload,
            success,
            error,
          });
        }
      }
    });
  };

  // 显示企业弹框
  handleCompanyModal = () => {
    this.setState({ companyVisible: true });
    const payload = { pageSize: 10, pageNum: 1 };
    this.fetchCompany({ payload });
  };

  // 获取企业列表
  fetchCompany = ({ payload }) => {
    const { dispatch } = this.props;
    dispatch({ type: 'videoMonitor/fetchModelList', payload });
  };

  // 关闭企业弹框
  handleClose = () => {
    this.setState({ companyVisible: false });
  };

  // 选择企业
  handleSelect = item => {
    const {
      form: { setFieldsValue },
    } = this.props;
    const { id, name } = item;
    setFieldsValue({
      companyId: name,
      dangerSourceList: [],
    });
    this.companyId = id;
    this.handleClose();
    this.setState({
      targetKeys: [],
      tankAreaList: [],
      wareHouseAreaList: [],
      gasHolderManageList: [],
      productList: [],
    });
  };

  // 渲染企业模态框
  renderModal() {
    const {
      videoMonitor: { modal },
      loading,
    } = this.props;
    const { companyVisible } = this.state;
    return (
      <CompanyModal
        loading={loading}
        visible={companyVisible}
        modal={modal}
        fetch={this.fetchCompany}
        onSelect={this.handleSelect}
        onClose={this.handleClose}
      />
    );
  }

  // 获取储罐区列表
  fetchStorageAreaList = ({ ...payload }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'storageAreaManagement/fetchTankAreaList',
      payload: {
        pageNum: 1,
        pageSize: 10,
        ...payload,
      },
    });
  };

  // 获取库区列表
  fetchReservoirAreaList = ({ ...payload }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reservoirRegion/fetchAreaList',
      payload: {
        pageNum: 1,
        pageSize: 10,
        ...payload,
      },
    });
  };

  // 获取生产装置列表
  fetchProductList = ({ ...payload }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'productionEquipments/fetchProEquipList',
      payload: {
        pageNum: 1,
        pageSize: 10,
        ...payload,
      },
    });
  };

  // 获取气柜列表
  fetchGasList = ({ ...payload }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'gasometer/getList',
      payload: {
        pageNum: 1,
        pageSize: 10,
        ...payload,
      },
    });
  };

  // 显示危险源弹框
  handleDangerModal = () => {
    const {
      user: {
        currentUser: { companyId },
      },
    } = this.props;

    const { editCompanyId } = this.state;

    const fixedCompanyId = this.companyId || editCompanyId || companyId;
    if (fixedCompanyId) {
      this.fetchStorageAreaList({ companyId: fixedCompanyId });
      this.fetchReservoirAreaList({ companyId: fixedCompanyId });
      this.fetchGasList({ companyId: fixedCompanyId });
      this.fetchProductList({ companyId: fixedCompanyId });
      this.setState({ dangerModalVisible: true });
    } else {
      message.warning('请先选择单位！');
    }
  };

  onDangerTypeSelect = i => {
    this.setState({ dangerType: i });
  };

  // 获取穿梭框数据的keys
  onTargetKeysClick = i => {
    this.setState({ targetKeys: i });
  };

  // 选中的重大危险源数据
  handleDangerOk = () => {
    const {
      storageAreaManagement: { list: storageList = [] },
      reservoirRegion: {
        areaData: { list: areaList = [] },
      },
      gasometer: {
        list: { list: gasList = [] },
      },
      form: { setFieldsValue },
      productionEquipments: {
        proData: { list: proEquipList = [] },
      },
    } = this.props;
    const { targetKeys } = this.state;

    const storageNameArray = storageList.reduce((arr, { id, areaName }) => {
      return targetKeys.includes(id) ? [...arr, { id, areaName }] : arr;
    }, []);
    const reserviorNameArrray = areaList.reduce((arr, { id, name }) => {
      return targetKeys.includes(id) ? [...arr, { id, name }] : arr;
    }, []);
    const gasNameArrray = gasList.reduce((arr, { id, gasholderName }) => {
      return targetKeys.includes(id) ? [...arr, { id, gasholderName }] : arr;
    }, []);
    const productNameArrray = proEquipList.reduce((arr, { id, name }) => {
      return targetKeys.includes(id) ? [...arr, { id, name }] : arr;
    }, []);

    const storageId = storageNameArray.map(item => item.id).join(',');
    const reserviorId = reserviorNameArrray.map(item => item.id).join(',');
    const gasId = gasNameArrray.map(item => item.id).join(',');
    const productId = productNameArrray.map(item => item.id).join(',');

    const allSelectedKeys = storageId.concat(reserviorId, gasId, productId);

    setFieldsValue({ dangerSourceList: allSelectedKeys });

    this.setState({
      dangerModalVisible: false,
      tankIds: storageId,
      areaIds: reserviorId,
      gasometerIds: gasId,
      productIds: productId,
      tankAreaList: storageNameArray,
      wareHouseAreaList: reserviorNameArrray,
      gasHolderManageList: gasNameArrray,
      productList: productNameArrray,
    });
  };

  // 打开责任人弹框
  handlePersonModal = () => {
    const {
      user: {
        currentUser: { companyId },
      },
    } = this.props;
    const { editCompanyId } = this.state;
    const fixedCompanyId = this.companyId || editCompanyId || companyId;
    if (fixedCompanyId) {
      this.fetchPersonModalList({ companyId: fixedCompanyId });
      this.setState({ personModalVisible: true });
    } else {
      message.warning('请先选择单位！');
    }
  };

  // 获取责任人列表
  fetchPersonModalList = () => {
    const {
      dispatch,
      user: {
        currentUser: { companyId },
      },
    } = this.props;
    dispatch({
      type: 'account/fetch',
      payload: {
        unitId: this.companyId || companyId,
        pageSize: 10,
        pageNum: 1,
      },
    });
  };

  // 选中责任人数据
  handlePersonModalSelect = item => {
    console.log('item', item.map(item => item.userName + '' + item.phoneNumber).join(','));
    const {
      form: { setFieldsValue },
    } = this.props;
    this.setState({ personModalVisible: false });
    setFieldsValue({
      dangerPerson: item.map(item => item.userName + '' + item.phoneNumber).join(','),
    });
  };

  renderInfo() {
    const {
      form: { getFieldDecorator, getFieldValue },
      reservoirRegion: {
        dangerTypeList,
        // productTypeList,
        // dangerChemicalsList,
        // memoryPlaceList,
        antiStaticList,
      },
      user: {
        currentUser: { unitType },
      },
    } = this.props;

    const {
      detailList,
      tankAreaList,
      wareHouseAreaList,
      gasHolderManageList,
      productList,
    } = this.state;
    const {
      companyName,
      code,
      name,
      desc,
      // manageType,
      // memoryPlace,
      antiStatic,
      dangerTechnology,
      location,
      useDate,
      r,
      dangerLevel,
      // chemiclaNature,
      // industryArea,
      environmentType,
      environmentName,
      environmentNum,
      dangerDistance,
      safetyDistance,
      linkman,
      linkmanTel,
    } = detailList;
    // const dangerSourceList = getFieldValue('dangerSourceList') || [];

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const itemStyles = { style: { width: '70%', marginRight: '10px' } };

    return (
      <Card className={styles.card} bordered={false}>
        <Form style={{ marginTop: 8 }}>
          {unitType !== 4 && (
            <FormItem {...formItemLayout} label="单位名称">
              {getFieldDecorator('companyId', {
                initialValue: companyName,
                rules: [
                  {
                    required: true,
                    message: '请选择单位',
                  },
                ],
              })(
                <Input
                  {...itemStyles}
                  ref={input => {
                    this.CompanyIdInput = input;
                  }}
                  disabled
                  placeholder="请选择单位"
                />
              )}
              <Button type="primary" onClick={this.handleCompanyModal}>
                {' '}
                选择单位
              </Button>
            </FormItem>
          )}
          <FormItem {...formItemLayout} label="统一编码">
            {getFieldDecorator('code', {
              initialValue: code,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入统一编码',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入统一编码" maxLength={15} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="重大危险源名称">
            {getFieldDecorator('name', {
              initialValue: name,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入重大危险源名称',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入重大危险源名称" maxLength={15} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="重大危险源描述">
            {getFieldDecorator('desc', {
              initialValue: desc,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入重大危险源描述',
                },
              ],
            })(
              <TextArea
                {...itemStyles}
                placeholder="请输入重大危险源描述"
                rows={4}
                maxLength="500"
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="R值">
            {getFieldDecorator('r', {
              initialValue: r,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入R值',
                },
              ],
            })(
              <Fragment>
                <Input
                  {...itemStyles}
                  placeholder="请填入此重大危险源由专家评估的R值"
                  maxLength={15}
                />
                <div style={{ color: '#999' }}>
                  重大危险源评估，请参照GB 18218-2018 危险化学品重大危险源辨识
                </div>
              </Fragment>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="重大危险源等级">
            {getFieldDecorator('dangerLevel', {
              initialValue: dangerLevel,
              rules: [
                {
                  required: true,
                  message: '请选择重大危险源等级',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择重大危险源等级">
                {dangerTypeList.map(({ key, value }) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="选择重大危险源范围">
            {getFieldDecorator('dangerSourceList', {
              // initialValue: dangerSourceList,
              rules: [
                {
                  required: true,
                  message: '请选择重大危险源范围',
                },
              ],
            })(
              <Fragment>
                <div {...itemStyles}>
                  <span className={styles.label}>
                    {tankAreaList.map(item => (
                      <Tag key={item.id}>{item.areaName}</Tag>
                    ))}
                    {wareHouseAreaList.map(item => (
                      <Tag key={item.id}>{item.name}</Tag>
                    ))}
                    {gasHolderManageList.map(item => (
                      <Tag key={item.id}>{item.gasholderName}</Tag>
                    ))}
                    {productList.map(item => (
                      <Tag key={item.id}>{item.name}</Tag>
                    ))}
                  </span>
                  <Button type="primary" size="small" onClick={this.handleDangerModal}>
                    选择
                  </Button>
                </div>
              </Fragment>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="备案日期">
            {getFieldDecorator('recordDate', {
              initialValue: useDate ? moment(+useDate) : undefined,
              rules: [
                {
                  required: true,
                  message: '请选择备案日期',
                },
              ],
            })(
              <DatePicker
                {...itemStyles}
                showToday={false}
                format="YYYY-MM-DD"
                placeholder="请选择备案日期"
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="重大危险源责任人">
            {getFieldDecorator('dangerPerson', {
              initialValue: dangerTechnology,
              rules: [
                {
                  required: true,
                  message: '请输入重大危险源责任人',
                },
              ],
            })(
              <TextArea
                {...itemStyles}
                placeholder="请选择重大危险源责任人"
                rows={3}
                disabled
                maxLength="2000"
              />
            )}
            <Button type="primary" size="small" onClick={this.handlePersonModal}>
              选择
            </Button>
          </FormItem>
          <FormItem {...formItemLayout} label="防雷防静电设施是否定期接受检测">
            {getFieldDecorator('antiStatic', {
              initialValue: antiStatic,
              rules: [
                {
                  required: true,
                  message: '请选择',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择">
                {antiStaticList.map(({ key, value }) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="涉及危险工艺">
            {getFieldDecorator('dangerTechnology', {
              initialValue: dangerTechnology,
              getValueFromEvent: this.handleTrim,
            })(
              <TextArea
                {...itemStyles}
                placeholder="请输入涉及危险工艺"
                rows={4}
                maxLength="2000"
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="区域位置">
            {getFieldDecorator('location', {
              initialValue: location,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入区域位置',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入区域位置" maxLength={15} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="投用日期">
            {getFieldDecorator('useDate', {
              initialValue: useDate ? moment(+useDate) : undefined,
              rules: [
                {
                  required: true,
                  message: '请选择投用日期',
                },
              ],
            })(
              <DatePicker
                {...itemStyles}
                showToday={false}
                format="YYYY-MM-DD"
                placeholder="请选择投用日期"
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="重大危险源周边安全间距">
            {getFieldDecorator('safetyDistance', {
              initialValue: safetyDistance,
              getValueFromEvent: this.handleTrim,
            })(<Input {...itemStyles} placeholder="请填入专家评估算出的距离" maxLength={10} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="周边500米内常住人口数量">
            {getFieldDecorator('safetyDistance', {
              rules: [
                {
                  required: true,
                  message: '请填入周边500米内常住人口数量',
                },
              ],
              initialValue: safetyDistance,
              getValueFromEvent: this.handleTrim,
            })(
              <Input {...itemStyles} placeholder="请填入周边500米内常住人口数量" maxLength={10} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="周边环境类型">
            {getFieldDecorator('environmentType', {
              initialValue: environmentType,
              getValueFromEvent: this.handleTrim,
            })(
              <TextArea
                {...itemStyles}
                placeholder="请输入周边环境类型"
                rows={4}
                maxLength="2000"
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="周边环境名称">
            {getFieldDecorator('environmentName', {
              initialValue: environmentName,
              getValueFromEvent: this.handleTrim,
            })(
              <TextArea
                {...itemStyles}
                placeholder="请输入周边环境名称"
                rows={4}
                maxLength="2000"
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="周边环境人数">
            {getFieldDecorator('environmentNum', {
              initialValue: environmentNum,
              getValueFromEvent: this.handleTrim,
            })(<Input {...itemStyles} placeholder="请输入周边环境人数" />)}
          </FormItem>

          {/* <FormItem {...formItemLayout} label="生产经营活动类型">
            {getFieldDecorator('manageType', {
              initialValue: manageType,
              rules: [
                {
                  required: true,
                  message: '请选择生产经营活动类型',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择生产经营活动类型">
                {productTypeList.map(({ key, value }) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem> */}
          {/* <FormItem {...formItemLayout} label="生产存储场所产权">
            {getFieldDecorator('memoryPlace', {
              initialValue: memoryPlace,
              rules: [
                {
                  required: true,
                  message: '请选择生产存储场所产权',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择生产存储场所产权">
                {memoryPlaceList.map(({ key, value }) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem> */}
          {/* <FormItem {...formItemLayout} label="危险化学品性质">
            {getFieldDecorator('chemiclaNature', {
              initialValue: chemiclaNature,
              rules: [
                {
                  required: true,
                  message: '请选择危险化学品性质',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择危险化学品性质">
                {dangerChemicalsList.map(({ key, value }) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem> */}
          {/* <FormItem {...formItemLayout} label="所处装置或区域">
            {getFieldDecorator('industryArea', {
              initialValue: industryArea,
              getValueFromEvent: this.handleTrim,
            })(
              <TextArea
                {...itemStyles}
                placeholder="请输入所处装置或区域"
                rows={4}
                maxLength="2000"
              />
            )}
          </FormItem> */}
          <FormItem {...formItemLayout} label="周边环境与危险源最近距离">
            {getFieldDecorator('dangerDistance', {
              initialValue: dangerDistance,
              getValueFromEvent: this.handleTrim,
            })(
              <Input {...itemStyles} placeholder="请输入周边环境与危险源最近距离" maxLength={10} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="周边环境联系人">
            {getFieldDecorator('linkman', {
              initialValue: linkman,
              getValueFromEvent: this.handleTrim,
            })(<Input {...itemStyles} placeholder="请输入周边环境联系人" maxLength={10} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="周边环境联系人电话">
            {getFieldDecorator('linkmanTel', {
              initialValue: linkmanTel,
              getValueFromEvent: this.handleTrim,
            })(<Input {...itemStyles} placeholder="请输入周边环境联系人电话" maxLength={15} />)}
          </FormItem>
        </Form>
      </Card>
    );
  }

  /* 渲染底部工具栏 */
  renderFooterToolbar() {
    const { submitting } = this.state;
    return (
      <FooterToolbar>
        <Button type="primary" size="large" loading={submitting} onClick={this.handleClickValidate}>
          提交
        </Button>
        <Button size="large" onClick={this.goBack}>
          返回
        </Button>
      </FooterToolbar>
    );
  }

  // 渲染页面所有信息
  render() {
    const {
      personModalLoading,
      match: {
        params: { id },
      },
      storageAreaManagement: { list: storageList = [] },
      reservoirRegion: {
        areaData: { list: areaList = [] },
        dangerResourceTypeList,
        // personModal,
      },
      gasometer: { list: { list: gasList = [] } = {} },
      productionEquipments: {
        proData: { list: proEquipList = [] },
      },
      account: { data: personData = {} },
    } = this.props;

    const { dangerType, targetKeys, personModalVisible } = this.state;

    const title = id ? editTitle : addTitle;

    // 面包屑
    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '重大危险源基本信息',
        name: '重大危险源基本信息',
      },
      {
        title: '重大危险源',
        name: '重大危险源',
        href: '/major-hazard-info/major-hazard/list',
      },
      {
        title,
        name: title,
      },
    ];

    const fileds = [
      {
        id: 'type',
        label: '类别',
        span: spanStyle,
        options: {
          initialValue: dangerType,
        },
        render: () => (
          <Select allowClear placeholder="请选择类别" onSelect={this.onDangerTypeSelect}>
            {dangerResourceTypeList.map(({ key, value }) => (
              <Option key={key} value={key}>
                {value}
              </Option>
            ))}
          </Select>
        ),
      },
    ];

    const personFields = [
      {
        id: 'name',
        render() {
          return <Input placeholder="请输入姓名" />;
        },
        transform(value) {
          return value.trim();
        },
      },
    ];

    const personColumns = [
      {
        title: '姓名',
        dataIndex: 'userName',
        key: 'userName',
        align: 'center',
      },
      {
        title: '手机号',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        align: 'center',
      },
      {
        title: '所属部门',
        dataIndex: 'departmentName',
        key: 'departmentName',
        align: 'center',
        render: (val, row) => {
          const { users } = row;
          return <span>{users.map(item => item.departmentName).join('')}</span>;
        },
      },
    ];

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderInfo()}
        {this.renderFooterToolbar()}
        {this.renderModal()}

        {/** 选择重大危险源 */}
        <Modal
          title="选择重大危险源"
          width={900}
          visible={this.state.dangerModalVisible}
          onOk={this.handleDangerOk}
          onCancel={() => {
            this.setState({ dangerModalVisible: false });
          }}
        >
          <ToolBar fields={fileds} searchable={false} resetable={false} />
          <TableTransFer
            areaList={areaList}
            storageList={storageList}
            gasList={gasList}
            dangerType={dangerType}
            proEquipList={proEquipList}
            targetKeys={targetKeys}
            onTargetKeysClick={this.onTargetKeysClick}
            onTargetKeysChange={this.onTargetKeysChange}
          />
        </Modal>

        {/** 选择重大危险源责任人 */}
        <CompanyModal
          title="选择重大危险源责任人"
          multiSelect
          rowKey={'loginId'}
          rowSelection={{ type: 'checkbox' }}
          loading={personModalLoading}
          visible={personModalVisible}
          modal={personData}
          columns={personColumns}
          field={personFields}
          fetch={this.fetchPersonModalList}
          onSelect={this.handlePersonModalSelect}
          onClose={() => {
            this.setState({ personModalVisible: false });
          }}
        />
      </PageHeaderLayout>
    );
  }
}
