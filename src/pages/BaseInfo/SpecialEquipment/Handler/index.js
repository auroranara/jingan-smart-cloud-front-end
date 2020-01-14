import { PureComponent, Fragment } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Radio,
  Row,
  Col,
  message,
  InputNumber,
  DatePicker,
  Tooltip,
  Icon,
  Cascader,
  Upload,
} from 'antd';
import { connect } from 'dva';
import { getToken } from 'utils/authority';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import router from 'umi/router';
import moment from 'moment';
import { AuthButton } from '@/utils/customAuth';
import { getFileList } from '@/pages/BaseInfo/utils';
// import FlatPic from '@/pages/DeviceManagement/Components/FlatPic';
import CompanyModal from '@/pages/BaseInfo/Company/CompanyModal';
import codesMap from '@/utils/codes';
// 地图定位
import MapMarkerSelect from '@/components/MapMarkerSelect';

// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';
// 上传文件夹
const folder = 'emergency';
const defaultUploadProps = {
  name: 'files',
  data: { folder },
  multiple: true,
  action: uploadAction,
  headers: { 'JA-Token': getToken() },
};
const FormItem = Form.Item;
const Option = Select.Option;
/* root下的div */
const getRootChild = () => document.querySelector('#root>div');
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const listUrl = '/facility-management/special-equipment/list';

const itemStyles = { style: { width: 'calc(70%)', marginRight: '10px' } };
const brandPayload = { type: '3', epuipmentType: '306' };

@Form.create()
@connect(
  ({
    loading,
    personnelPosition,
    riskPointManage,
    device,
    user,
    emergencyManagement,
    specialEquipment,
    company,
  }) => ({
    personnelPosition,
    riskPointManage,
    device,
    user,
    companyLoading: loading.effects['company/fetchModelList'],
    emergencyManagement,
    specialEquipment,
    company,
  })
)
export default class SpecialEquipment extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // 选择企业弹窗
      compayModalVisible: false,
      // 选中的企业
      selectedCompany: {},
      pointFixInfoList: [], // 平面图标志
      editingIndex: undefined, // 当前编辑的平面图标志下标
      picModalVisible: false,
      isImgSelect: true,
      imgIdCurrent: '',
      code: '',
      userSettingVisible: false,
      fileList: [],
    };
  }

  componentDidMount() {
    const {
      form: { setFieldsValue },
      match: { params: { id = null } = {} },
      user: {
        currentUser: { companyId, unitType, companyName },
      },
    } = this.props;
    this.fetchDict({ type: 'specialEquipment' });
    this.fetchBrand(brandPayload);
    if (unitType === 4) {
      this.setState({ selectedCompany: { id: companyId, name: companyName } });
      this.fetchBuildings({ payload: { pageNum: 1, pageSize: 0, company_id: companyId } });
    }
    if (!id) return;
    this.fetchList(1, 10, { id }, res => {
      const {
        list: [
          {
            companyId,
            companyName,
            code, //代码
            // kind, //种类
            category, //类别
            // varieties, //品种
            brand, //品牌
            specification, //规格型号
            factoryNumber, //出厂编号
            equipName, //设备名称
            certificateNumber, //使用证编号
            usePart, //使用部位
            number, //数量
            contact, //联系人
            phone, //联系电话
            productUnitName, //生产单位名称
            productUnitPhone, //生产单位电话
            productDate, //生产日期
            // endDate, //截止日期
            useDate, //投入使用日
            usePeriod, //使用期限
            locationType,
            buildingId,
            floorId,
            area,
            location,
            paststatus, //到期状态  0：未到期 1：即将到期 2：已过期
            pointFixInfoList,
            registrationNumber,
            detectUnit,
            detectReport,
            detectReportFile,
          },
        ],
      } = res.data;
      setFieldsValue({
        companyId,
        code, //代码
        category: category ? category.split(',') : [], //类别
        brand, //品牌
        specification, //规格型号
        factoryNumber, //出厂编号
        equipName, //设备名称
        certificateNumber, //使用证编号
        usePart, //使用部位
        number, //数量
        contact, //联系人
        phone, //联系电话
        productUnitName, //生产单位名称
        productUnitPhone, //生产单位电话
        productDate: productDate && moment(productDate), //生产日期
        useDate: useDate === null ? undefined : moment(useDate),
        usePeriod: usePeriod || undefined, //使用期限
        locationType,
        paststatus, //到期状态  0：未到期 1：即将到期 2：已过期
        registrationNumber,
        detectUnit,
        detectReport,
      });
      this.fetchModel({ ...brandPayload, brand });
      if (unitType !== 4) {
        this.fetchBuildings({ payload: { pageNum: 1, pageSize: 0, company_id: companyId } });
      }
      if (buildingId) {
        this.fetchFloors({ payload: { pageNum: 1, pageSize: 0, building_id: buildingId } });
      }
      this.setState(
        {
          selectedCompany: { id: companyId, name: companyName },
          code,
          pointFixInfoList,
          userSettingVisible: locationType === 1,
          fileList: detectReportFile.map(({ id, dbUrl, webUrl, fileName }, index) => ({
            uid: id || index,
            fileName,
            status: 'done',
            name: fileName,
            url: webUrl,
            dbUrl,
          })),
        },
        () => {
          setFieldsValue({
            buildingId,
            floorId,
            area,
            location,
          });
          if (pointFixInfoList && pointFixInfoList.length) {
            let { xnum, ynum, znum, groupId, areaId } = pointFixInfoList[0];
            const coord = { x: +xnum, y: +ynum, z: +znum };
            groupId = +groupId;
            setFieldsValue({ mapLocation: { groupId, coord, areaId } });
          }
        }
      );
    });
  }

  fetchList = (pageNum = 1, pageSize = 10, filters = {}, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'specialEquipment/fetchSpecialEquipList',
      payload: {
        pageNum,
        pageSize,
        ...filters,
      },
      callback,
    });
  };

  handleSubmit = () => {
    const {
      dispatch,
      user: {
        currentUser: { unitType, companyId },
      },
      form: { validateFields },
      match: {
        params: { id },
      },
    } = this.props;
    const { code, pointFixInfoList, fileList } = this.state;

    validateFields((error, { mapLocation, ...resData }) => {
      if (!error) {
        const payload = {
          ...resData,
          companyId: unitType === 4 ? companyId : resData.companyId,
          category: resData.category.join(','),
          code,
          area: +resData.locationType === 1 ? resData.area : '',
          pointFixInfoList,
          usePeriod: resData.usePeriod || null,
          detectReport: JSON.stringify(
            fileList.map(({ name, url, dbUrl }) => ({
              fileName: name,
              webUrl: url,
              dbUrl,
              name,
            }))
          ),
        };
        if (mapLocation && mapLocation.groupId && mapLocation.coord) {
          const { coord, ...resMap } = mapLocation;
          payload.pointFixInfoList = [
            { imgType: 5, xnum: coord.x, ynum: coord.y, znum: coord.z, ...resMap },
          ];
        }
        const success = () => {
          message.success(id ? '编辑成功！' : '新增成功！');
          router.push(listUrl);
        };
        const error = () => {
          message.error(id ? '编辑失败' : '新增失败！');
        };
        if (id) {
          dispatch({
            type: 'specialEquipment/editSpecialEquip',
            payload: { ...payload, id },
            success,
            error,
          });
        } else {
          dispatch({
            type: 'specialEquipment/addSpecialEquip',
            payload,
            success,
            error,
          });
        }
      }
    });
  };

  /**
   * 获取企业列表（弹窗）
   */
  fetchCompany = ({ payload }) => {
    const { dispatch } = this.props;
    dispatch({ type: 'company/fetchModelList', payload });
  };

  /**
   * 选择企业
   */
  handleSelectCompany = selectedCompany => {
    const {
      form: { setFieldsValue },
    } = this.props;
    this.setState({ selectedCompany, companyModalVisible: false });
    setFieldsValue({ companyId: selectedCompany.id });
    this.fetchBuildings({ payload: { pageNum: 1, pageSize: 0, company_id: selectedCompany.id } });
  };

  /**
   * 打开选择单位弹窗
   */
  handleViewCompanyModal = () => {
    this.setState({ companyModalVisible: true });
    this.fetchCompany({
      payload: {
        pageSize: 10,
        pageNum: 1,
      },
    });
  };

  fetchBrand = (payload, callback) => {
    const { dispatch } = this.props;
    dispatch({ type: 'specialEquipment/fetchBrandList', payload, callback });
  };

  fetchModel = (payload, callback) => {
    const { dispatch } = this.props;
    dispatch({ type: 'specialEquipment/fetchModelList', payload, callback });
  };

  fetchDict = (payload, success, error) => {
    const { dispatch } = this.props;
    dispatch({ type: 'emergencyManagement/fetchDicts', payload, success, error });
  };

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
   * 刷新建筑物楼层图下拉
   * @param {Boolean} weatherFetch 是否重新获取建筑物选项下拉
   */
  handleRefreshBuilding = (weatherFetch = false) => {
    const {
      form: { setFieldsValue },
    } = this.props;
    const { selectedCompany } = this.state;
    const companyId = selectedCompany.id;
    // 清空选择建筑物和楼层
    setFieldsValue({
      buildingId: undefined,
      floorId: undefined,
    });
    // 获取建筑物下拉 清空楼层下拉
    weatherFetch &&
      companyId &&
      this.fetchBuildings({ payload: { pageNum: 1, pageSize: 0, company_id: companyId } });
    this.resetFloors({ payload: [] });
    // 改变 平面图标注--楼层平面定位信息
    this.changeFlatPicBuildingNum();
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

  /**
   * 验证建筑物或者楼层是否已选择
   */
  validateBuildingFloor = (rule, value, callback) => {
    const {
      form: { getFieldsValue },
    } = this.props;
    const { buildingId, floorId } = getFieldsValue();
    if (buildingId && floorId) {
      callback();
    } else callback('请选择所属建筑物楼层');
  };

  // 选择所属建筑物
  handleSelectBuilding = value => {
    const {
      form: { setFieldsValue },
    } = this.props;
    // 获取楼层
    this.fetchFloors({ payload: { pageNum: 1, pageSize: 0, building_id: value } });
    setFieldsValue({ floorId: undefined });
  };

  /**
   * 改变 平面图标注--楼层平面定位信息
   */
  changeFlatPicBuildingNum = (xnum = undefined, ynum = undefined) => {
    const { pointFixInfoList, editingIndex } = this.state;
    // 从保存的平面图标注列表中找类型为 楼层平面图的，如果找到 清空定位信息,并且该条平面图标注需要重新编辑
    const i = pointFixInfoList.findIndex(item => +item.imgType === 2);
    // 如果未找到，或者当前正在编辑平面图标注为楼层平面图类型
    if (i < 0 || +editingIndex === i) return;
    message.warning('请重新编辑平面图标注中楼层平面图');
    const item = pointFixInfoList[i];
    this.handleChangeCoordinate(item, xnum, i, 'xnum');
    this.handleChangeCoordinate(item, ynum, i, 'ynum');
    this.setState({ editingIndex: i });
  };

  /**
   * 新平面图标志--坐标轴改变
   */
  handleChangeCoordinate = (item, value, i, key) => {
    if (value && isNaN(value)) {
      message.warning('坐标轴为数字');
      return;
    }
    item[key] = value;
    this.setState(({ pointFixInfoList }) => {
      let temp = [...pointFixInfoList];
      temp.splice(i, 1, item);
      return { pointFixInfoList: temp };
    });
  };

  /**
   * 刷新建筑物楼层图下拉
   * @param {Boolean} weatherFetch 是否重新获取建筑物选项下拉
   */
  handleRefreshBuilding = (weatherFetch = false) => {
    const {
      form: { setFieldsValue },
    } = this.props;
    const { selectedCompany } = this.state;
    const companyId = selectedCompany.id;
    // 清空选择建筑物和楼层
    setFieldsValue({ buildingId: undefined, floorId: undefined });
    // 获取建筑物下拉 清空楼层下拉
    weatherFetch &&
      companyId &&
      this.fetchBuildings({ payload: { pageNum: 1, pageSize: 0, company_id: companyId } });
    this.resetFloors({ payload: [] });
    // 改变 平面图标注--楼层平面定位信息
    this.changeFlatPicBuildingNum();
  };

  /**
   * 跳转到建筑物管理页面
   */
  jumpToBuildingManagement = () => {
    const win = window.open(`${window.publicPath}#/base-info/buildings-info/list`, '_blank');
    win.focus();
  };

  /**
   * 添加平面图标志
   */
  handleAddFlatGraphic = () => {
    this.setState(({ pointFixInfoList }) => ({
      editingIndex: pointFixInfoList.length,
      pointFixInfoList: [
        ...pointFixInfoList,
        { imgType: undefined, ynum: undefined, xnum: undefined, fixImgId: undefined },
      ],
    }));
  };

  handleChangeCategory = value => {
    const {
      emergencyManagement: { specialEquipment = [] },
    } = this.props;
    let treeData = specialEquipment;
    const codes = value.map(id => {
      const val = treeData.find(item => item.id === id) || {};
      treeData = val.children;
      return val.value;
    });
    this.setState({ code: codes[codes.length - 1] });
  };

  handleBrandChange = brand => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ specification: undefined });
    this.fetchModel({ ...brandPayload, brand });
  };

  /* 去除左右两边空白 */
  handleTrim = e => e.target.value.trim();

  handleChangeLocType = e => {
    const {
      form: { setFieldsValue },
    } = this.props;
    this.setState({ userSettingVisible: e.target.value === 1 }, () => {
      setFieldsValue({
        location: undefined,
        area: undefined,
      });
    });
    this.handleRefreshBuilding();
  };

  handleFileChange = ({ fileList, file }) => {
    if (file.status === 'done') {
      let fList = [...fileList];
      if (file.response.code === 200) {
        // if (fList.length > 1) fList.splice(0, 1);
        message.success('上传成功');
      } else {
        message.error('上传失败');
        fList.splice(-1, 1);
      }
      fList = getFileList(fList);
      this.setState({ fileList: fList, uploading: false });
    } else {
      if (file.status === 'uploading') this.setState({ uploading: true });
      // 其他情况，直接用原文件数组
      fileList = getFileList(fileList);
      this.setState({ fileList });
    }
    return fileList;
  };

  /**
   * 渲染表单
   */
  renderForm = isDetail => {
    const {
      dispatch,
      match: {
        params: { id },
      },
      form,
      form: { getFieldDecorator, getFieldsValue },
      personnelPosition: {
        map: {
          buildings = [], // 建筑物列表
          floors = [], // 楼层列表
        },
      },
      riskPointManage: {
        imgData: { list: imgList = [] },
      },
      device: {
        flatGraphic, // 平面图类型选项
      },
      emergencyManagement: { specialEquipment = [] },
      specialEquipment: { brandList = [], modelList = [] },
      user: {
        currentUser: { unitType },
      },
    } = this.props;
    const {
      selectedCompany,
      editingIndex,
      pointFixInfoList,
      picModalVisible,
      isImgSelect,
      imgIdCurrent,
      code,
      userSettingVisible,
      fileList,
    } = this.state;
    const companyId = selectedCompany.id;
    const { locationType, brand } = getFieldsValue();
    // const FlatPicProps = {
    //   visible: picModalVisible,
    //   onCancel: () => {
    //     this.setState({ picModalVisible: false });
    //   },
    //   form,
    //   buildings, // 建筑物列表
    //   floors, // 楼层列表
    //   imgList, // 定位图列表
    //   pointFixInfoList, // 平面图标注列表
    //   editingIndex,
    //   isImgSelect,
    //   imgIdCurrent,
    //   flatGraphic,
    //   setState: newState => {
    //     this.setState(newState);
    //   },
    //   dispatch,
    //   companyId,
    //   handleBuildingChange: this.handleBuildingChange,
    //   changeFlatPicBuildingNum: this.changeFlatPicBuildingNum,
    // };
    return (
      <Card>
        <Form>
          {unitType !== 4 && (
            <FormItem label="单位名称" {...formItemLayout}>
              {getFieldDecorator('companyId', {
                rules: [{ required: true, message: '请选择单位名称' }],
              })(
                <Fragment>
                  <Input
                    {...itemStyles}
                    disabled
                    value={selectedCompany.name}
                    placeholder="请选择单位名称"
                  />
                  <Button type="primary" onClick={this.handleViewCompanyModal}>
                    选择单位
                  </Button>
                </Fragment>
              )}
            </FormItem>
          )}
          <FormItem label="分类" {...formItemLayout}>
            {getFieldDecorator('category', {
              rules: [{ required: true, message: '请选择分类' }],
            })(
              <Cascader
                options={specialEquipment}
                fieldNames={{
                  value: 'id',
                  label: 'label',
                  children: 'children',
                  isLeaf: 'isLeaf',
                }}
                changeOnSelect
                placeholder="请选择分类"
                allowClear
                onChange={this.handleChangeCategory}
                {...itemStyles}
              />
            )}
          </FormItem>
          <FormItem label="代码" {...formItemLayout}>
            {getFieldDecorator('code', {
              // rules: [{ required: true, message: '请选择代码' }],
            })(<span>{code}</span>)}
          </FormItem>
          {/* <FormItem label="种类" {...formItemLayout}>
            {getFieldDecorator('kind', {
              rules: [{ required: true, message: '请选择种类' }],
            })(
              <Select placeholder="请选择种类" {...itemStyles}>
                {}
              </Select>
            )}
          </FormItem>
          <FormItem label="类别" {...formItemLayout}>
            {getFieldDecorator('category', {
              rules: [{ required: true, message: '请选择类别' }],
            })(
              <Select placeholder="请选择类别" {...itemStyles}>
                {}
              </Select>
            )}
          </FormItem>
          <FormItem label="品种" {...formItemLayout}>
            {getFieldDecorator('varieties', {
              rules: [{ required: true, message: '请选择品种' }],
            })(
              <Select placeholder="请选择品种" {...itemStyles}>
                {}
              </Select>
            )}
          </FormItem> */}
          <FormItem label="品牌" {...formItemLayout}>
            {getFieldDecorator('brand', {
              // rules: [{ required: true, message: '请选择品牌' }],
            })(
              // <Select
              //   placeholder="请选择品牌"
              //   {...itemStyles}
              //   onChange={this.handleBrandChange}
              //   allowClear
              // >
              //   {brandList.map(({ id, name }) => (
              //     <Option key={id} value={id}>
              //       {name}
              //     </Option>
              //   ))}
              // </Select>
              <Input placeholder="请输入品牌" style={{ width: '70%' }} allowClear />
            )}
          </FormItem>
          <FormItem label="规格型号" {...formItemLayout}>
            {getFieldDecorator('specification', {
              rules: [{ required: true, message: '请选择规格型号' }],
            })(
              // <Select placeholder="请选择规格型号" {...itemStyles} allowClear>
              //   {brand &&
              //     modelList.map(({ id, name }) => (
              //       <Option key={id} value={id}>
              //         {name}
              //       </Option>
              //     ))}
              // </Select>
              <Input placeholder="请输入规格型号" style={{ width: '70%' }} allowClear />
            )}
          </FormItem>
          <FormItem label="出厂编号" {...formItemLayout}>
            {getFieldDecorator('factoryNumber', {
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请输入出厂编号' }],
            })(<Input placeholder="请输入出厂编号" {...itemStyles} />)}
          </FormItem>
          <FormItem label="设备名称" {...formItemLayout}>
            {getFieldDecorator('equipName', {
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请输入设备名称' }],
            })(<Input placeholder="请输入设备名称" {...itemStyles} />)}
          </FormItem>
          <FormItem label="使用证编号" {...formItemLayout}>
            {getFieldDecorator('certificateNumber', { getValueFromEvent: this.handleTrim })(
              <Input placeholder="请输入使用证编号" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="注册登记号" {...formItemLayout}>
            {getFieldDecorator('registrationNumber', { getValueFromEvent: this.handleTrim })(
              <Input placeholder="请输入注册登记号" {...itemStyles} />
            )}
          </FormItem>
          {/* <FormItem label="检测单位" {...formItemLayout}>
            {getFieldDecorator('detectUnit', { getValueFromEvent: this.handleTrim })(
              <Input placeholder="请输入检测单位" {...itemStyles} />
            )}
          </FormItem> */}
          {/* <FormItem label="检验报告" {...formItemLayout}>
            {getFieldDecorator('detectReport')(
              <Upload {...defaultUploadProps} fileList={fileList} onChange={this.handleFileChange}>
                <Button type="dashed" style={{ width: '96px', height: '96px' }}>
                  <Icon type="plus" style={{ fontSize: '32px' }} />
                  <div style={{ marginTop: '8px' }}>点击上传</div>
                </Button>
              </Upload>
            )}
          </FormItem> */}
          <FormItem label="使用部位" {...formItemLayout}>
            {getFieldDecorator('usePart', { getValueFromEvent: this.handleTrim })(
              <Input placeholder="请输入使用部位" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="数量" {...formItemLayout}>
            {getFieldDecorator('number')(
              <InputNumber
                {...itemStyles}
                min={0}
                placeholder="请输入数量"
                formatter={value => (!value || isNaN(value) ? '' : Math.round(value))}
                parser={value => (!value || isNaN(value) ? '' : Math.round(value))}
              />
            )}
          </FormItem>
          <FormItem label="联系人" {...formItemLayout}>
            {getFieldDecorator('contact', { getValueFromEvent: this.handleTrim })(
              <Input placeholder="请输入联系人" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="联系电话" {...formItemLayout}>
            {getFieldDecorator('phone', { getValueFromEvent: this.handleTrim })(
              <Input placeholder="请输入联系电话" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="生产单位名称" {...formItemLayout}>
            {getFieldDecorator('productUnitName', { getValueFromEvent: this.handleTrim })(
              <Input placeholder="请输入生产单位名称" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="生产单位电话" {...formItemLayout}>
            {getFieldDecorator('productUnitPhone', { getValueFromEvent: this.handleTrim })(
              <Input placeholder="请输入生产单位电话" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="生产日期" {...formItemLayout}>
            {getFieldDecorator('productDate')(
              <DatePicker
                placeholder="请选择生产日期"
                getCalendarContainer={getRootChild}
                {...itemStyles}
              />
            )}
          </FormItem>
          <FormItem label="投入使用日" {...formItemLayout}>
            {getFieldDecorator('useDate')(
              <DatePicker
                placeholder="请选择投入使用日"
                getCalendarContainer={getRootChild}
                {...itemStyles}
              />
            )}
          </FormItem>
          <FormItem label="使用期限（月）" {...formItemLayout}>
            {getFieldDecorator('usePeriod')(
              <InputNumber
                {...itemStyles}
                min={0}
                placeholder="请输入使用期限"
                formatter={value => (!value || isNaN(value) ? '' : Math.round(value))}
                parser={value => (!value || isNaN(value) ? '' : Math.round(value))}
              />
            )}
          </FormItem>
          <FormItem label="区域位置录入方式" {...formItemLayout}>
            {getFieldDecorator('locationType', {
              rules: [{ required: true, message: '请选择区域位置录入方式' }],
            })(
              <Radio.Group onChange={this.handleChangeLocType}>
                <Radio value={0}>选择建筑物-楼层</Radio>
                <Radio value={1}>手填</Radio>
              </Radio.Group>
            )}
          </FormItem>
          {companyId &&
            locationType === 0 && (
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
                            onChange={this.handleSelectBuilding}
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
                            onChange={() => this.changeFlatPicBuildingNum()}
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
                          style={{ marginRight: 10 }}
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
                  {getFieldDecorator('location', {
                    getValueFromEvent: this.handleTrim,
                    // initialValue: id ? detail.location : undefined,
                  })(<Input placeholder="请输入详细位置" {...itemStyles} />)}
                </FormItem>
              </Fragment>
            )}
          {companyId &&
            userSettingVisible && (
              <Fragment>
                <FormItem label="所在区域" {...formItemLayout}>
                  {getFieldDecorator('area', {
                    getValueFromEvent: this.handleTrim,
                    rules: [{ required: true, message: '请输入所在区域' }],
                  })(<Input placeholder="请输入所在区域" {...itemStyles} />)}
                </FormItem>
                <FormItem label="位置详情" {...formItemLayout}>
                  {getFieldDecorator('location', {
                    getValueFromEvent: this.handleTrim,
                    rules: [{ required: true, message: '请输入位置详情' }],
                  })(<Input placeholder="请输入位置详情" {...itemStyles} />)}
                </FormItem>
              </Fragment>
            )}
          {companyId && (
            <FormItem label="地图定位" {...formItemLayout}>
              {/* <Button
                type="primary"
                style={{ padding: '0 12px' }}
                onClick={this.handleAddFlatGraphic}
                disabled={
                  !isNaN(editingIndex) || (pointFixInfoList && pointFixInfoList.length >= 4)
                }
              >
                新增
              </Button>
              <FlatPic {...FlatPicProps} /> */}
              {getFieldDecorator('mapLocation')(<MapMarkerSelect companyId={companyId} />)}
            </FormItem>
          )}
        </Form>
        <Row style={{ textAlign: 'center', marginTop: '24px' }}>
          {isDetail ? (
            <Button
              type="primary"
              style={{ marginLeft: '10px' }}
              onClick={e => router.push(`/facility-management/special-equipment/edit/${id}`)}
            >
              编辑
            </Button>
          ) : (
            <Button type="primary" style={{ marginLeft: '10px' }} onClick={this.handleSubmit}>
              提交
            </Button>
          )}
        </Row>
      </Card>
    );
  };

  render() {
    const {
      companyLoading,
      match: { params: { id = null } = {} },
      route: { name },
      company: { companyModal },
    } = this.props;
    const { companyModalVisible } = this.state;

    const isDetail = name === 'detail';
    const title = id ? (isDetail ? '详情' : '编辑') : '新增';
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '设备设施管理', name: '设备设施管理' },
      { title: '特种设备管理', name: '特种设备管理', href: listUrl },
      { title, name: title },
    ];
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderForm(isDetail)}
        {/* 选择企业弹窗 */}
        <CompanyModal
          title="选择单位"
          loading={companyLoading}
          visible={companyModalVisible}
          modal={companyModal}
          fetch={this.fetchCompany}
          onSelect={this.handleSelectCompany}
          onClose={() => {
            this.setState({ companyModalVisible: false });
          }}
        />
      </PageHeaderLayout>
    );
  }
}
