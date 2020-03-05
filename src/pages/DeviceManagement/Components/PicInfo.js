import { Fragment } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Row, Col, Select, Input, Button, Popconfirm } from 'antd';
import Coordinate from '@/pages/RiskControl/RiskPointManage/Coordinate/index';

const Option = Select.Option;
const FormItem = Form.Item;

// 平面图标注
const PicInfo = (props) => {
  const {
    form: { getFieldsValue, getFieldDecorator },
    floors = [],      // 楼层列表
    buildings = [], // 建筑物列表
    pointFixInfoList = [],
    editingIndex, // 当前编辑的下标
    visible,
    isImgSelect,
    imgIdCurrent,
    onCancel,
    imgList,
    flatGraphic,
    handleCoordinateOk,
    handleChangeImageType,
    handleSelectBuilding,
    showModalCoordinate,
    handleSavePointFix,
    handleDeletePointFix,
    handleChangeCoordinate,
    handleEditPointFix,
  } = props
  // 地址录入方式 0 选择 1 手填
  const { locationType, buildingId, floorId } = getFieldsValue()
  const editingItem = pointFixInfoList.length ? pointFixInfoList[editingIndex] : {}

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
                      <Select value={buildingId} disabled placeholder="所属建筑" style={{ width: '100%' }} onSelect={handleSelectBuilding} allowClear>
                        {buildings.map((item, i) => (
                          <Select.Option key={i} value={item.id}>{item.buildingName}</Select.Option>
                        ))}
                      </Select>
                    ) : (
                        getFieldDecorator('buildingId')(
                          <Select placeholder="所属建筑" style={{ width: '100%' }} onSelect={handleSelectBuilding} allowClear>
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
                          <Select placeholder="所属楼层" style={{ width: '100%' }} allowClear>
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

export default PicInfo
