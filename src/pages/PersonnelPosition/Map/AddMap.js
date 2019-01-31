import { PureComponent, Fragment } from 'react';
import { Card, Button, Input, Select, Form, Icon, Modal, message, Col, Radio, Row } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import ImageDraw from '@/components/ImageDraw';
import styles from './AddMap.less';

const FormItem = Form.Item;

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}
const itemStyles = { style: { width: 'calc(70%)', marginRight: '10px' } }
const typeInfo = [
  { label: '单位平面图', value: '1' },
  { label: '楼层平面图', value: '2' },
]


@Form.create()
@connect(({ personnelPosition }) => ({
  personnelPosition,
}))
export default class addMap extends PureComponent {
  state = {
    modalVisible: false,
    modaltype: 'unit',         // 弹窗类型'unit' 选择单位平面图    'floor' 选择楼层平面图
    modalList: [],             // 选择图片数据（获取数据后callback内设置）
    points: [],                // 画的坐标数组
    unitMapUrl: undefined,     // 单位图地址（用于关联地图）
    mapHierarchy: undefined,   // 当前选择的地图层级
    floorMap: {},
  }

  componentDidMount() {
    const {
      match: { params: { companyId, id } },
      form: { setFieldsValue },
    } = this.props
    if (id) {
      // 获取地图详情
      this.fetchMapDetail({
        payload: { companyMap: id },
        callback: ({ mapName, mapHierarchy, companyMapUrl, buildingId, floorId, mapPhoto, jsonMap, actualRange }) => {
          if (mapHierarchy === '1') {
            // 如果是单位图
            setFieldsValue({
              mapName,
              mapHierarchy,
              unitMap: mapPhoto ? JSON.parse(mapPhoto) : {},
              actualRange,
            })
          } else {
            const unitMap = companyMapUrl ? JSON.parse(companyMapUrl) : {}
            const floorMap = mapPhoto ? JSON.parse(mapPhoto) : {}
            // 如果是楼层图，获取建筑列表和楼层列表
            this.fetchBuildings({ payload: { pageNum: 1, pageSize: 0, company_id: companyId } })
            this.fetchFloors({ payload: { pageNum: 1, pageSize: 0, building_id: buildingId } })
            this.setState({ mapHierarchy, floorMap }, () => {
              setFieldsValue({
                mapName,
                mapHierarchy,
                actualRange,
                buildingId,
                unitMap,
                floorMap,
                floorId,
                jsonMap,
              })
            })
            setTimeout(() => {
              this.setState({ unitMapUrl: unitMap.url, points: jsonMap ? [JSON.parse(jsonMap)] : [] })
            }, 500);
          }
        },
      })

    }
  }

  // 获取地图详情
  fetchMapDetail = (actions) => {
    const { dispatch } = this.props
    dispatch({
      type: 'personnelPosition/fetchMapDetail',
      ...actions,
    })
  }

  // 获取选择地图列表
  fetchMapForSelect = (actions) => {
    const { dispatch } = this.props
    dispatch({
      type: 'personnelPosition/fetchMapForSelect',
      ...actions,
    })
  }

  // 当地图层级是楼层平面图时，获取地图列表（mapHierarchy地图层级）
  fetchMaps = (actions) => {
    const { dispatch } = this.props
    dispatch({
      type: 'personnelPosition/fetchMaps',
      ...actions,
    })
  }

  // 获取所属建筑列表
  fetchBuildings = (actions) => {
    const { dispatch } = this.props
    dispatch({
      type: 'personnelPosition/fetchBuildings',
      ...actions,
    })
  }

  // 获取楼层
  fetchFloors = (actions) => {
    const { dispatch } = this.props
    dispatch({
      type: 'personnelPosition/fetchFloors',
      ...actions,
    })
  }

  // 选择地图层级
  handleHierarchyChange = mapHierarchy => {
    const {
      match: { params: { companyId } },
      form: { setFieldsValue },
    } = this.props
    if (mapHierarchy === '2') {
      // 如果选择楼层平面图 获取所属建筑列表
      this.fetchBuildings({ payload: { pageNum: 1, pageSize: 0, company_id: companyId } })
    }
    // 清空选择的地图和展示用的数据
    setFieldsValue({ unitMap: {}, floorMap: {}, jsonMap: undefined })
    this.setState({ unitMapUrl: undefined, mapHierarchy, floorMap: {}, points: [] })
  }

  // 选择所属楼层
  handleSelectFloor = floorId => {
    const {
      form: { setFieldsValue },
    } = this.props
    this.setState({ floorMap: {}, unitMapUrl: undefined, points: [] })
    setFieldsValue({ jsonMap: undefined, floorMap: {} })
  }

  // 选择所属建筑物
  handleSelectBuilding = (value) => {
    const {
      form: { setFieldsValue },
    } = this.props
    // 获取楼层
    this.fetchFloors({ payload: { pageNum: 1, pageSize: 0, building_id: value } })
    setFieldsValue({ floorId: undefined, floorMap: {}, jsonMap: undefined })
    this.setState({ floorMap: {}, points: [], unitMapUrl: undefined })
  }

  // 点击打开选择单位平面图
  handleToSelectUnitMap = mapHierarchy => {
    const {
      match: { params: { companyId } },
    } = this.props
    const callback = (modalList) => {
      this.setState({ modalList })
    }
    if (mapHierarchy === '1') {
      this.fetchMapForSelect({ payload: { companyId, type: '1' }, callback })
    } else if (mapHierarchy === '2') {
      this.fetchMaps({
        payload: { companyId, mapHierarchy: '1' },
        callback: list => {
          // 处理数据
          const modalList = list.map(({ mapPhoto, mapName, id }) => ({ ...JSON.parse(mapPhoto), mapName, id }))
          this.setState({ modalList })
        },
      })
    } else {
      message.warning('请选择地图层级！')
      return
    }
    this.setState({ modalVisible: true, modaltype: 'unit' })
  }

  // 点击打开选择楼层平面图
  handleToSelectFloor = () => {
    const {
      match: { params: { companyId } },
      form: { getFieldsValue },
    } = this.props
    const { floorId, unitMap = {} } = getFieldsValue()
    if (!unitMap.url) {
      message.warning('请先选择单位平面图')
      return
    }
    if (!floorId) {
      message.warning('请先选择所属楼层')
      return
    }
    this.fetchMapForSelect({
      payload: { companyId, type: '2', floorId },
      callback: modalList => {
        this.setState({ modalVisible: true, modaltype: 'floor', modalList })
      },
    })
  }

  // 点击勾选地图
  handleSelectMap = (item, mapHierarchy) => {
    const { form: { setFieldsValue, getFieldValue } } = this.props
    const { modaltype } = this.state
    if (modaltype === 'unit') {
      // 如果是选择单位图
      if (mapHierarchy === '2') {
        this.setState({ points: [], floorMap: {}, unitMapUrl: undefined })
        setFieldsValue({ unitMap: item, jsonMap: undefined, floorMap: {} })
      } else {
        setFieldsValue({ unitMap: item })
      }
    } else {
      // 如果是选择楼层图 清空关联地图数据
      setFieldsValue({ floorMap: item, jsonMap: undefined })
      this.setState({ floorMap: item, points: [], unitMapUrl: undefined })
      // 必须等地图组件渲染之后再设置地图图片，不然报错
      setTimeout(() => {
        const unitMap = getFieldValue('unitMap')
        // unitMapUrl一定要最后一个设值，不然组件会报错
        this.setState({ unitMapUrl: unitMap ? unitMap.url : '' })
      }, 500);
    }
  }

  // 关联地图时更新坐标的回调
  onUpdate = ([item]) => {
    const { setFieldsValue } = this.props.form
    if (item) {
      const newItem = { ...item, name: '楼层平面图' }
      this.setState({ points: [newItem] })
      setFieldsValue({ jsonMap: JSON.stringify(newItem) })
    } else {
      this.setState({ points: [] })
      setFieldsValue({ jsonMap: '' })
    }
  }

  validateFloorMap = (rule, value, callback) => {
    if (value && value.url) {
      callback()
    } else callback('请选择楼层平面图')
  }

  validateUnitMap = (rule, value, callback) => {
    if (value && value.url) {
      callback()
    } else callback('请选择单位平面图')
  }

  // 点击确定（新增、编辑操作）
  handleSubmit = () => {
    const {
      dispatch,
      form: { validateFields },
      match: { params: { companyId, id } },
    } = this.props
    // TODO:如果选择楼层平面图，但是没有画坐标，提示
    validateFields((errors, values) => {
      if (errors) return
      const success = () => {
        message.success(id ? '编辑成功' : '新增成功')
        router.push(`/personnel-position/map-management/company-map/${companyId}`)
      }
      const error = () => {
        message.error(id ? '编辑失败' : '新增失败')
      }
      const { mapHierarchy, unitMap, floorMap, ...others } = values
      let payload = { mapRange: '1', companyId, mapHierarchy }
      if (mapHierarchy === '1') {
        // 单位平面图
        payload = { ...payload, ...others, mapPhoto: JSON.stringify(unitMap) }
      } else {
        // 楼层图
        payload = { ...payload, ...others, mapPhoto: JSON.stringify(floorMap), companyMap: unitMap.id }
      }
      if (id) {
        payload = { ...payload, id }
        // 编辑
        dispatch({
          type: 'personnelPosition/editMap',
          payload,
          success,
          error,
        })
      } else {
        // 新增
        dispatch({
          type: 'personnelPosition/addMap',
          payload,
          success,
          error,
        })
      }

    })
  }

  // 返回
  handleToBack = () => {
    const { match: { params: { companyId } } } = this.props
    router.push(`/personnel-position/map-management/company-map/${companyId}`)
  }

  handleCloseModal = () => {
    this.setState({ modalVisible: false })
  }

  isChecked = ({ modaltype, unitMap, floorMap, item, mapHierarchy }) => {
    if (modaltype === 'unit') {
      if (mapHierarchy === '1') {
        return unitMap.url === item.url
      } else {
        return unitMap.id === item.id
      }
    } else {
      return floorMap.url === item.url
    }
  }

  render() {
    const {
      match: { params: { companyId, id } },
      form: { getFieldDecorator, getFieldsValue },
      personnelPosition: {
        map: {
          buildings = [], // 建筑物列表
          floors = [],      // 楼层列表
          detail = {},         // 地图详情
        },
      },
    } = this.props
    const { modalVisible, modaltype, modalList, points, unitMapUrl, mapHierarchy, floorMap } = this.state
    const title = id ? '编辑地图' : '新增地图'
    const breadcrumbList = [
      { name: '首页', title: '首页', href: '/' },
      { name: '人员定位', title: '人员定位' },
      { name: '地图管理', title: '地图管理', href: '/personnel-position/map-management/list' },
      { name: '地图列表', title: '地图列表', href: `/personnel-position/map-management/company-map/${companyId}` },
      { name: title, title },
    ]

    // 地图层级 '1' 单位平面图  '2' 楼层平面图
    const { unitMap = {} } = getFieldsValue()

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        <Card className={styles.addMapContainer}>
          <Form>
            <FormItem label="地图名称" {...formLayout}>
              {getFieldDecorator('mapName', {
                rules: [{ required: true, message: '请输入地图名称' }],
              })(
                <Input placeholder="请输入" {...itemStyles} />
              )}
            </FormItem>
            <FormItem label="地图层级" {...formLayout}>
              {getFieldDecorator('mapHierarchy', {
                rules: [{ required: true, message: '请选择地图层级' }],
              })(
                <Select placeholder="请选择" {...itemStyles} onSelect={this.handleHierarchyChange}>
                  {typeInfo.map(({ label, value }, i) => (
                    <Select.Option key={i} value={value}>{label}</Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem label="单位平面图" {...formLayout}>
              {getFieldDecorator('unitMap', {
                rules: [{ required: true, validator: this.validateUnitMap }],
              })(
                <Fragment>
                  {unitMap && unitMap.url ? (
                    <div className={styles.selectMapWithUrl} onClick={() => this.handleToSelectUnitMap(mapHierarchy)}>
                      <img src={unitMap.url} alt={unitMap.name} />
                    </div>
                  ) : (
                      <div className={styles.selectMap} onClick={() => this.handleToSelectUnitMap(mapHierarchy)}>
                        <Icon type="plus" />
                      </div>
                    )}
                </Fragment>
              )}
            </FormItem>
            <FormItem label="比例尺" {...formLayout}>
              {getFieldDecorator('actualRange', {
                getValueFromEvent: e => Number(e.target.value.replace(/\D?/g, '')),
                rules: [
                  { required: !mapHierarchy || mapHierarchy === '1', message: '请输入比例尺' },
                  { min: 1, type: 'number', message: '请输入大于0的整数' },
                ],
              })(
                <Input addonBefore="1(cm)：" addonAfter="(m)" {...itemStyles} />
              )}
            </FormItem>
            {mapHierarchy === '2' && (
              <FormItem label="所属建筑" {...formLayout}>
                {getFieldDecorator('buildingId', {
                  rules: [{ required: true, message: '请选择所属建筑' }],
                })(
                  <Select placeholder="请选择" onSelect={this.handleSelectBuilding} {...itemStyles} >
                    {buildings.map((item, i) => (
                      <Select.Option key={i} value={item.id}>{item.buildingName}</Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            )}
            {mapHierarchy === '2' && (
              <FormItem label="所属楼层" {...formLayout}>
                {getFieldDecorator('floorId', {
                  rules: [{ required: true, message: '请选择所属楼层' }],
                })(
                  <Select placeholder="请选择" {...itemStyles} onSelect={this.handleSelectFloor}>
                    {floors.map((item, i) => (
                      <Select.Option key={i} value={item.id}>{item.floorName}</Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            )}
            {mapHierarchy === '2' && (
              <FormItem label="楼层平面图" {...formLayout}>
                {getFieldDecorator('floorMap', {
                  rules: [{ required: true, validator: this.validateFloorMap }],
                })(
                  <Fragment>
                    {floorMap && floorMap.url ? (
                      <div className={styles.selectMapWithUrl} onClick={() => this.handleToSelectFloor()}>
                        <img src={floorMap.url} alt={floorMap.name} />
                      </div>
                    ) : (
                        <div className={styles.selectMap} onClick={() => this.handleToSelectFloor()}>
                          <Icon type="plus" />
                        </div>
                      )}
                  </Fragment>
                )}
              </FormItem>
            )}
            {floorMap && floorMap.url && (
              <FormItem label="关联地图" {...formLayout}>
                {getFieldDecorator('jsonMap', {
                  rules: [{ required: true, message: '请指定楼层所在位置' }],
                })(
                  <ImageDraw
                    className={styles.drawerContainer}
                    url={unitMapUrl}
                    data={points}
                    onUpdate={this.onUpdate}
                    limit={1}
                    drawable={true}
                    namable={false}
                    maxBoundsRatio={1.5}
                    color="#044786"
                  />
                )}
              </FormItem>
            )}
          </Form>
          <Row style={{ textAlign: 'center', marginTop: '24px' }}>
            <Button style={{ marginRight: '20px' }} onClick={this.handleToBack}>返回</Button>
            <Button type="primary" onClick={this.handleSubmit}>确定</Button>
          </Row>
        </Card>
        {/* 单位平面图 */}
        <Modal
          width={800}
          title={modaltype === 'unit' ? '选择单位平面图' : '选择楼层平面图'}
          visible={modalVisible}
          onCancel={this.handleCloseModal}
          footer={null}
        >
          {modalList.length > 0 ? (
            <div className={styles.imgItem}>
              {modalList.map((item, i) => (
                <Col span={12} key={i} style={{ padding: '5px' }}>
                  <img className={styles.img} src={item.url} alt={item.name} />
                  <div style={{ padding: '5px' }}>
                    <Radio value={item.url} onChange={() => this.handleSelectMap(item, mapHierarchy)} checked={this.isChecked({ modaltype, unitMap, floorMap, mapHierarchy, item })}>{modaltype === 'unit' && mapHierarchy === '2' ? item.mapName : item.name}</Radio>
                  </div>
                </Col>
              ))}
            </div>
          ) : (<div className={styles.emptyContent}><span>暂无数据</span></div>)}
        </Modal>
      </PageHeaderLayout>
    )
  }
}
