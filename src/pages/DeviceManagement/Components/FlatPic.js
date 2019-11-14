import { Fragment } from 'react';
import {
  Row,
  Col,
  Select,
  Form,
  Input,
  Button,
  Popconfirm,
  message,
} from 'antd';
import Coordinate from '@/pages/RiskControl/RiskPointManage/Coordinate/index';

const Option = Select.Option;
const FormItem = Form.Item;

// 平面图标注
const FlatInfo = (props) => {
  const {
    form: { getFieldsValue, getFieldDecorator },
    floors = [],      // 楼层列表
    buildings = [], // 建筑物列表
    pointFixInfoList = [],
    editingIndex, // 当前编辑的下标
    visible, // 定位弹窗可见
    isImgSelect,
    imgIdCurrent, // 定位弹窗当前选择图片下标
    onCancel,  // 关闭定位弹窗
    imgList, // 定位弹窗图标选择列表
    flatGraphic, // 平面图类型选项
    setState,
    dispatch,
    companyId,
    handleBuildingChange,
    handleFloorIdChange,
  } = props
  // 地址录入方式 0 选择 1 手填
  const { locationType, buildingId, floorId } = getFieldsValue()
  const editingItem = pointFixInfoList.length ? pointFixInfoList[editingIndex] : {}
  /**
  * 保存定位信息
  */
  const handleCoordinateOk = (value, fourColorImg) => {
    const fixImgId = fourColorImg.id
    if (!value || !value.x || !value.y) return message.warning('请选择坐标')
    // 当前编辑的平面图标注
    let editingItem = pointFixInfoList[editingIndex]
    const newItem = {
      ...editingItem,
      xnum: value.x.toFixed(3),
      ynum: value.y.toFixed(3),
      fixImgId,
    }
    pointFixInfoList.splice(editingIndex, 1, newItem)
    setState({
      editingIndex,
      pointFixInfoList,
      picModalVisible: false,
      isImgSelect: true,
    })
  }

  /**
 * 新平面图标志--平面图类型改变
 */
  const handleChangeImageType = (item, i) => {
    const type = +item.imgType
    if (type === 1 || type === 3 || type === 4) {
      dispatch({
        type: 'riskPointManage/fetchFixImgInfo',
        payload: {
          companyId,
          type,
        },
      });
    }
    if (type === 2) {
      dispatch({
        type: 'buildingsInfo/fetchBuildingList',
        payload: {
          company_id: companyId,
          pageSize: 0,
          pageNum: 1,
        },
      });
    }
    let temp = [...pointFixInfoList]
    temp.splice(i, 1, item)
    setState({
      pointFixInfoList: temp,
      picModalVisible: false,
      isImgSelect: false,
    })
  }

  /**
     * 显示定位模态框
     */
  const showModalCoordinate = (index, item) => {
    const { buildingId, floorId } = getFieldsValue()
    // 当前编辑的平面图标注
    const { imgType, fixImgId } = item
    const callback = payload => {
      if (payload.list && payload.list.length) {
        setState({
          picModalVisible: true,
          imgIdCurrent: fixImgId, // 当前选择的定位图片id
        });
      } else message.error('该单位暂无图片！');
    }
    // 如果没有选择平面图类型
    if (!imgType) return message.error('请先选择平面图类型!');
    // 如果是楼层平面图，需要选择建筑物和楼层后才能定位
    if (+imgType === 2) {
      if (!buildingId) return message.error('请选择所属建筑物!');
      if (!floorId) return message.error('请选择所属楼层!');
      dispatch({
        type: 'riskPointManage/fetchFixImgInfo',
        payload: {
          companyId,
          type: imgType,
          buildingId: buildingId,
          floorId: floorId,
        },
        callback,
      });
    } else {
      // 如果平面图是其他类型
      dispatch({
        type: 'riskPointManage/fetchFixImgInfo',
        payload: {
          companyId,
          type: imgType,
        },
        callback,
      });
    }
  }


  /**
   * 新平面图标志--保存
   */
  const handleSavePointFix = (oldIndex = undefined, i, item) => {
    // 如果正在编辑且点击其他项
    if (i !== oldIndex) {
      message.warning('请先保存')
      return
    }
    if (isNaN(item.imgType)) {
      message.warning('请填写平面图类型')
      return
    }
    if (isNaN(item.xnum) || isNaN(item.ynum)) {
      message.warning('请完善坐标位置')
      return
    }
    setState({ editingIndex: undefined })
  }

  /**
   * 新平面图标志--编辑
   */
  const handleEditPointFix = (oldIndex = undefined, i) => {
    if (!isNaN(oldIndex)) {
      message.warning('请先保存')
      return
    }
    setState({ editingIndex: i })
  }

  /**
   * 新平面图标志--删除
   */
  const handleDeletePointFix = (i) => {
    let temp = [...pointFixInfoList]
    temp.splice(i, 1)
    setState({ pointFixInfoList: temp, editingIndex: undefined })
  }

  /**
  * 新平面图标志--坐标轴改变
  */
  const handleChangeCoordinate = (item, value, i, key) => {
    if (value && isNaN(value)) {
      message.warning('坐标轴为数字')
      return
    }
    item[key] = value
    let temp = [...pointFixInfoList]
    temp.splice(i, 1, item)
    setState({ pointFixInfoList: temp })
  }

  return (
    <Row gutter={{ lg: 24, md: 12 }} style={{ position: 'relative' }}>
      {pointFixInfoList.map((item, index) => (
        <Col span={24} key={index} style={{ marginBottom: +item.imgType === 2 ? '-23px' : '' }}>
          <Row gutter={12}>
            <Col span={4}>
              <Select
                allowClear
                placeholder="平面图类型"
                onChange={(imgType) => handleChangeImageType({ ...item, imgType, xnum: undefined, ynum: undefined }, index)}
                disabled={editingIndex !== index}
                value={item.imgType}
              >
                {flatGraphic.map(({ key, value }) => (
                  <Option value={key} key={key} disabled={pointFixInfoList.some(row => row.imgType === key)}>
                    {value}
                  </Option>
                ))}
              </Select>
            </Col>
            {/* 如果平面图选择楼层平面图 */}
            {+item.imgType === 2 && (
              <Fragment>
                <Col span={4}>
                  <FormItem>
                    {+locationType === 0 ? (
                      <Select value={buildingId} disabled placeholder="所属建筑" style={{ width: '100%' }} allowClear>
                        {buildings.map((item, i) => (
                          <Select.Option key={i} value={item.id}>{item.buildingName}</Select.Option>
                        ))}
                      </Select>
                    ) : (
                        getFieldDecorator('buildingId')(
                          <Select placeholder="所属建筑" style={{ width: '100%' }} onChange={handleBuildingChange} allowClear>
                            {buildings.map((item, i) => (
                              <Select.Option key={i} value={item.id}>{item.buildingName}</Select.Option>
                            ))}
                          </Select>
                        )
                      )}
                  </FormItem>
                </Col>
                <Col span={4}>
                  <FormItem>
                    {+locationType === 0 ? (
                      <Select value={floorId} disabled placeholder="所属楼层" style={{ width: '100%' }} allowClear>
                        {floors.map((item, i) => (
                          <Select.Option key={i} value={item.id}>{item.floorName}</Select.Option>
                        ))}
                      </Select>
                    ) : (
                        getFieldDecorator('floorId')(
                          <Select placeholder="所属楼层" style={{ width: '100%' }} onChange={handleFloorIdChange} allowClear>
                            {floors.map((item, i) => (
                              <Select.Option key={i} value={item.id}>{item.floorName}</Select.Option>
                            ))}
                          </Select>
                        )
                      )}
                  </FormItem>
                </Col>
              </Fragment>
            )}
            <Col span={3}>
              <Input placeholder="X轴" disabled={editingIndex !== index} value={item.xnum} onChange={e => { handleChangeCoordinate(item, e.target.value, index, 'xnum') }} />
            </Col>
            <Col span={3}>
              <Input placeholder="Y轴" disabled={editingIndex !== index} value={item.ynum} onChange={e => { handleChangeCoordinate(item, e.target.value, index, 'ynum') }} />
            </Col>
            <Col span={6}>
              <Button
                style={{ marginRight: '10px' }}
                onClick={() => showModalCoordinate(index, item)}
                disabled={editingIndex !== index}
              >
                定位
                </Button>
              {editingIndex === index ? (
                <span>
                  <a style={{ marginRight: '10px' }} onClick={() => handleSavePointFix(editingIndex, index, item)}>保存</a>
                  <Popconfirm
                    title="确认要删除该内容吗？"
                    onConfirm={() => handleDeletePointFix(index)}
                    okText="确认"
                    cancelText="取消"
                  >
                    <a>删除</a>
                  </Popconfirm>
                </span>
              ) : (
                  <span>
                    <a onClick={() => handleEditPointFix(editingIndex, index)}>编辑</a>
                  </span>
                )}
            </Col>
          </Row>
        </Col>
      ))}
      <Coordinate
        width="920px"
        visible={visible}
        urls={imgList}
        onOk={handleCoordinateOk}
        onCancel={onCancel}
        xNum={editingItem ? editingItem.xnum : ''}
        yNum={editingItem ? editingItem.ynum : ''}
        imgIdCurrent={imgIdCurrent}
        isImgSelect={isImgSelect}
      />
    </Row>
  )
}

export default FlatInfo
