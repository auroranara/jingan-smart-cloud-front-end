import { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button, Card, message, Row, Checkbox, Tag } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import {
  BREADCRUMBLIST,
  LIST_URL,
  ENV_FUNCTIONAL_AREA,
  PATH,
  generateChemicalLabels,
  editCode,
} from './List';
import CompanySelect from '@/jingan-components/CompanySelect';
import CompanyModal from '@/pages/BaseInfo/Company/CompanyModal';
import Map from '@/pages/RiskControl/FourColorImage/Map';
import JoySuchMap from '@/pages/RiskControl/FourColorImage/JoySuchMap';
// import { AuthButton } from '@/utils/customAuth';
import styles from './Add.less';
import { genGoBack } from '@/utils/utils';

const FormItem = Form.Item;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const itemStyles = { style: { width: '70%', marginRight: '10px' } };
const numberReg = /^\d*\.?\d*$/;

@connect(({ baseInfo, user, materials, loading, map }) => ({
  baseInfo,
  user,
  materials,
  chemicalLoading: loading.effects['materials/fetchMaterialsList'],
  map,
}))
@Form.create()
export default class StorageEdit extends PureComponent {
  constructor(props) {
    super(props);
    this.goBack = genGoBack(this.props, LIST_URL);
  }

  state = {
    company: undefined, // 当前单位 { value,label,key }
    detail: {}, // 详情
    chemicalVisible: false, // 涉及主要危险化学品弹窗可见
    selectedChemical: [], // 选择的主要危险化学品
    points: [], // 地图定位坐标点
    groupId: '', // 地图当前楼层
    pointList: [], // 地图列表
    buildingId: [], // 区域Id列表
    modelIds: '', // 当前选中区域id列表
    expandId: false, // 所选建筑物是否展开
  };

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
      form: { setFieldsValue },
      user: { isCompany, currentUser },
    } = this.props;

    if (id) {
      dispatch({
        type: 'baseInfo/fetchWorkSiteDetail',
        payload: { id },
        callback: detail => {
          const {
            companyId,
            companyName,
            spaceCode,
            unitName,
            location,
            environmentFunction,
            fixedAssets,
            floorSpace,
            personNum,
            material,
            materialName,
            areaCoordinate: { coordinate, groupId, modelIds } = {},
          } = detail;
          const materialLabels = materialName ? materialName.split(',') : undefined;
          /edit/.test(window.location.href) &&
            setFieldsValue({
              companyId: { value: companyId, label: companyName },
              spaceCode,
              unitName,
              location,
              environmentFunction: environmentFunction ? environmentFunction.split(',') : undefined,
              fixedAssets,
              floorSpace,
              personNum,
              material,
            });
          const points = coordinate
            ? JSON.parse(coordinate).map(item => ({
                x: +item.x,
                y: +item.y,
                z: +item.z,
                groupID: groupId,
              }))
            : [];
          this.setState(
            {
              detail,
              selectedChemical:
                material && materialLabels
                  ? material
                      .split(',')
                      .map((item, i) => ({ id: item, chineName: materialLabels[i] }))
                  : [],
              company: { value: companyId, label: companyName },
              points,
              pointList: [{ zoneLevel: '4', coordinateList: points, groupId, modelIds }],
              groupId,
              modelIds,
            },
            () => {
              this.fetchMap({ companyId }, mapInfo => {
                if (!mapInfo.mapId) return;
                this.childMap.initMap({ ...mapInfo });
              });
            }
          );
        },
      });
    } else if (isCompany) {
      // 如果是单位用户并且是新增
      const { companyId, companyName } = currentUser || {};
      this.setState({ company: { value: companyId, label: companyName } });
      this.fetchMap({ companyId }, mapInfo => {
        if (!mapInfo.mapId) return;
        this.childMap.initMap({ ...mapInfo });
      });
    }
  }

  // 获取地图
  fetchMap = (params, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'map/fetchMapList',
      payload: { ...params },
      callback,
    });
  };

  // 获取危险化学品列表
  fetchMaterials = ({ payload = {} } = {}) => {
    const { dispatch } = this.props;
    const { company } = this.state;
    dispatch({
      type: 'materials/fetchMaterialsList',
      payload: {
        pageNum: 1,
        pageSize: 10,
        ...payload,
        companyId: company.value,
      },
    });
  };

  onCompanyChange = company => {
    this.setState({ company });
    if (company && company.value) {
      this.fetchMap({ companyId: company.value }, mapInfo => {
        if (!mapInfo.mapId) return;
        this.childMap.initMap({ ...mapInfo });
      });
    }
  };

  handleSubmit = e => {
    const {
      dispatch,
      match: {
        params: { id },
      },
      form: { validateFields },
    } = this.props;
    const { company, groupId, points, buildingId } = this.state;
    e.preventDefault();
    if (/view/.test(location.href)) return;
    validateFields((err, values) => {
      if (err) return;
      const { environmentFunction, areaCoordinate, ...resValues } = values;
      let payload = {
        ...resValues,
        companyId: company.value,
        environmentFunction: Array.isArray(environmentFunction)
          ? environmentFunction.join(',')
          : undefined,
        areaCoordinate: {
          groupId,
          coordinate:
            points.length > 0
              ? JSON.stringify(points.map(({ x, y, z, groupID }) => ({ x, y, z, groupID })))
              : undefined,
          modelIds: buildingId
            .filter(item => item.selected === true)
            .map(item => item.areaId)
            .join(','),
        },
      };

      // console.log('submit', payload);
      const callback = (success, msg) => {
        if (success) {
          message.success('操作成功！');
          setTimeout(this.goBack, 1000);
        } else {
          message.error(msg || '操作失败！');
        }
      };
      if (id) {
        // 编辑
        dispatch({
          type: 'baseInfo/editWorkSite',
          payload: { ...payload, id },
          callback,
        });
      } else {
        // 新增
        dispatch({
          type: 'baseInfo/addWorkSite',
          payload,
          callback,
        });
      }
    });
  };

  // 去除左右两边空白
  handleTrim = e => e.target.value.trim();

  // 打开选择危险化学品弹窗
  handleMaterialsModal = () => {
    const { company } = this.state;
    if (company && company.value) {
      // 获取危险化学品列表
      this.fetchMaterials();
      this.setState({ chemicalVisible: true });
    } else {
      message.warning('请先选择单位！');
    }
  };

  // 选择主要危险化学品
  handleSelectChemical = selectedChemical => {
    if (Array.isArray(selectedChemical)) {
      const {
        form: { setFieldsValue },
      } = this.props;
      this.setState({ selectedChemical, chemicalVisible: false });
      setFieldsValue({ material: selectedChemical.map(item => item.id).join(',') });
    }
  };

  // 地图重置
  handleReset = () => {
    this.childMap.setRestMap();
    this.setState({ buildingId: [] });
  };

  onRef = ref => {
    this.childMap = ref;
  };

  // 获取地图上的坐标
  getPoints = (groupId, points) => {
    this.setState({ groupId, points });
  };

  // 获取地图所画建筑物id
  getBuilding = (buildingId, s) => {
    const { modelIds } = this.state;
    const modeIdList = modelIds ? modelIds.split(',') : [];
    const areaList = buildingId.filter(item => item).map((item, index) => ({
      key: index,
      areaId: item.buildingId,
      point: item.points,
      selected: true,
    }));
    if (s === 0) {
      areaList.forEach(element => {
        if (!modeIdList.includes(element.areaId)) {
          element.selected = !element.selected;
        }
      });
      this.setState({ buildingId: areaList });
    } else {
      this.setState({ buildingId: areaList });
    }
  };

  // 点击建筑物id
  handleTagClick = (areaId, point, selected) => {
    if (/view/.test(location.href)) return;
    const { points, groupId, buildingId } = this.state;
    this.childMap.handleModelEdit(groupId, points, point, selected);
    const filterList = buildingId.reduce((res, item) => {
      if (item.areaId === areaId) {
        item.selected = !item.selected;
      }
      return [...res, item];
    }, []);
    this.setState({
      buildingId: filterList,
    });
  };

  renderBuildingId = () => {
    const { expandId, buildingId } = this.state;

    // 是否展开
    const list = expandId ? buildingId : buildingId.slice(0, 5);
    return (
      <div style={{ display: 'flex' }}>
        <div style={{ width: '550px' }}>
          {list.map(({ key, areaId, point, selected }) => (
            <Tag
              color={!selected ? '' : '#555252'}
              key={key}
              onClick={() => this.handleTagClick(areaId, point, selected)}
            >
              {areaId}
            </Tag>
          ))}
        </div>
        {buildingId.length >= 3 && (
          <div className={styles.iconContainer} onClick={() => this.handleExpand()}>
            <a>{expandId ? '收起' : '展开'}</a>
            <LegacyIcon className={expandId ? styles.expandIcon : styles.icon} type="down" />
          </div>
        )}
      </div>
    );
  };

  handleExpand = () => {
    this.setState(({ expandId }) => ({ expandId: !expandId }));
  };

  // 跳转到编辑页面
  jumpToEdit = () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    router.push(`${PATH}/edit/${id}`);
  };

  render() {
    const {
      chemicalLoading,
      form: { getFieldDecorator },
      user: { isCompany },
      materials,
      map: { mapInfo: { remarks } = {} },
    } = this.props;
    const {
      company,
      detail,
      chemicalVisible,
      selectedChemical,
      isDrawing,
      points,
      pointList,
      groupId,
      modelIds,
    } = this.state;
    const companyId = company && company.value ? company.value : undefined;
    const isView = /view/.test(location.href);
    const isEdit = /edit/.test(location.href);
    const isAdd = /add/.test(location.href);
    const tag = (isAdd && '新增') || (isEdit && '编辑') || (isView && '查看') || '';
    const breadcrumbList = [...BREADCRUMBLIST, { title: tag, name: tag }];
    const chemicalColumns = [
      {
        title: '统一编码',
        dataIndex: 'unifiedCode',
        key: 'unifiedCode',
      },
      {
        title: '品名',
        dataIndex: 'chineName',
        key: 'chineName',
      },
      {
        title: 'CAS号',
        dataIndex: 'casNo',
        key: 'casNo',
      },
    ];
    const chemicalFields = [
      {
        id: 'casNo',
        render() {
          return <Input placeholder="CAS号" />;
        },
        transform(value) {
          return value.trim();
        },
      },
      {
        id: 'chineName',
        render() {
          return <Input placeholder="品名" />;
        },
        transform(value) {
          return value.trim();
        },
      },
    ];

    console.log(this.goBack);

    return (
      <PageHeaderLayout title={tag} breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <Form style={{ marginTop: 8 }} onSubmit={this.handleSubmit}>
            {!isCompany && (
              <FormItem {...formItemLayout} label="单位名称">
                {getFieldDecorator('companyId', {
                  rules: isView ? [] : [{ required: true, message: '请输入单位名称' }],
                })(
                  isView ? (
                    <span>{companyId ? company.label : ''}</span>
                  ) : (
                    <CompanySelect
                      onChange={this.onCompanyChange}
                      {...itemStyles}
                      placeholder="请输入"
                    />
                  )
                )}
              </FormItem>
            )}
            <FormItem {...formItemLayout} label="场所编号">
              {isView ? (
                <span>{detail.spaceCode}</span>
              ) : (
                getFieldDecorator('spaceCode', {
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入场所编号' }],
                })(<Input {...itemStyles} placeholder="请输入" />)
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="单元名称">
              {isView ? (
                <span>{detail.unitName}</span>
              ) : (
                getFieldDecorator('unitName', {
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入单元名称' }],
                })(<Input {...itemStyles} placeholder="请输入" />)
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="区域位置">
              {isView ? (
                <span>{detail.location}</span>
              ) : (
                getFieldDecorator('location', {
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入区域位置' }],
                })(<Input {...itemStyles} placeholder="请输入" />)
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="所处环境功能区">
              {isView ? (
                <span>{generateChemicalLabels(detail.environmentFunction)}</span>
              ) : (
                getFieldDecorator('environmentFunction', {
                  rules: [{ required: true, message: '请选择所处环境功能区' }],
                })(<Checkbox.Group options={ENV_FUNCTIONAL_AREA} />)
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="固定资产总值（万元）">
              {isView ? (
                <span>{detail.fixedAssets}</span>
              ) : (
                getFieldDecorator('fixedAssets', {
                  getValueFromEvent: this.handleTrim,
                  rules: [
                    { required: true, message: '请输入固定资产总值' },
                    { pattern: numberReg, message: '请输入数字' },
                  ],
                })(<Input {...itemStyles} placeholder="请输入" />)
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="占地面积（㎡）">
              {isView ? (
                <span>{detail.floorSpace}</span>
              ) : (
                getFieldDecorator('floorSpace', {
                  getValueFromEvent: this.handleTrim,
                  rules: [
                    { required: true, message: '请输入占地面积' },
                    { pattern: numberReg, message: '请输入数字' },
                  ],
                })(<Input {...itemStyles} placeholder="请输入" />)
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="正常当班人数">
              {isView ? (
                <span>{detail.personNum}</span>
              ) : (
                getFieldDecorator('personNum', {
                  getValueFromEvent: this.handleTrim,
                  rules: [
                    { required: true, message: '请输入正常当班人数' },
                    { pattern: numberReg, message: '请输入数字' },
                  ],
                })(<Input {...itemStyles} placeholder="请输入" />)
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="涉及主要危险化学品">
              {isView ? (
                <span>{detail.materialName}</span>
              ) : (
                getFieldDecorator('material', {
                  rules: [{ required: true, message: '请选择涉及主要危险化学品' }],
                })(
                  <Fragment>
                    <TextArea
                      {...itemStyles}
                      disabled
                      rows={4}
                      placeholder="请选择涉及主要危险化学品"
                      value={selectedChemical.map(item => item.chineName).join('，')}
                    />
                    <Button type="primary" onClick={this.handleMaterialsModal}>
                      选择
                    </Button>
                  </Fragment>
                )
              )}
            </FormItem>
            {companyId && (
              <FormItem {...formItemLayout} label="地图定位">
                {getFieldDecorator('areaCoordinate')(
                  <div style={{ border: '1px dashed #c3c3c3', width: '70%' }}>
                    {!isView && (
                      <Row>
                        <Button
                          style={{ marginLeft: 40 }}
                          onClick={() => {
                            if (!!isDrawing && points.length <= 2)
                              return message.error('区域至少三个坐标点！');
                            this.setState({ isDrawing: !isDrawing });
                          }}
                        >
                          {!isDrawing ? '开始画' : '结束画'}
                        </Button>
                        <Button
                          style={{ marginLeft: 10 }}
                          disabled={!!isDrawing}
                          onClick={this.handleReset}
                        >
                          重置
                        </Button>
                      </Row>
                    )}

                    {+remarks === 1 ? (
                      <Map
                        isDrawing={isDrawing}
                        groupId={groupId}
                        onRef={this.onRef}
                        getPoints={this.getPoints}
                        getBuilding={this.getBuilding}
                        pointList={pointList}
                        modelIds={modelIds}
                        style={{ height: '45vh', width: '65vh' }}
                      />
                    ) : (
                      <JoySuchMap
                        isDrawing={isDrawing}
                        groupId={groupId}
                        onRef={this.onRef}
                        getPoints={this.getPoints}
                        getBuilding={this.getBuilding}
                        pointList={pointList}
                        modelIds={modelIds}
                        style={{ height: '45vh', width: '100%' }}
                      />
                    )}
                  </div>
                )}
              </FormItem>
            )}
            {companyId && (
              <FormItem label="所选建筑物" {...formItemLayout}>
                {this.renderBuildingId()}
              </FormItem>
            )}
            <FormItem wrapperCol={{ span: 24, offset: 10 }}>
              {(isEdit || isAdd) && (
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              )}
              {/* {isView && (
                <AuthButton code={editCode} type="primary" onClick={this.jumpToEdit}>
                  编辑
                </AuthButton>
              )} */}
              <Button onClick={this.goBack} style={{ marginLeft: 20 }}>
                返回
              </Button>
            </FormItem>
          </Form>
        </Card>

        {/* 涉及主要危险化学品 */}
        <CompanyModal
          title="涉及主要危险化学品"
          multiSelect
          rowSelection={{ type: 'checkbox' }}
          columns={chemicalColumns}
          field={chemicalFields}
          butonStyles={{ width: 'auto' }}
          loading={chemicalLoading}
          visible={chemicalVisible}
          modal={materials}
          fetch={this.fetchMaterials}
          onSelect={this.handleSelectChemical}
          onClose={() => {
            this.setState({ chemicalVisible: false });
          }}
        />
      </PageHeaderLayout>
    );
  }
}
