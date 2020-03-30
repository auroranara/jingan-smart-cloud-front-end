import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Row, Col, Select, Input, Button, Badge } from 'antd';
import FooterToolbar from '@/components/FooterToolbar';
import { routerRedux } from 'dva/router';
import DescriptionList from '@/components/DescriptionList';
import Ellipsis from '@/components/Ellipsis';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
// import Ellipsis from '@/components/Ellipsis';
import styles from './CameraDetail.less';

const { Option } = Select;
const { Description } = DescriptionList;

/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

@connect(({ securityManage, personnelPosition, riskPointManage, loading }) => ({
  securityManage,
  personnelPosition,
  riskPointManage,
  loading: loading.models.securityManage,
}))
@Form.create()
export default class CameraDetail extends PureComponent {
  state = {
    picList: [],
  };

  /* 生命周期函数 */
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
      location: {
        query: { faceDataBaseId, companyId },
      },
    } = this.props;

    // 获取视频设备信息详情
    dispatch({
      type: 'securityManage/fetchFaceCameraList',
      payload: {
        monitorSceneId: faceDataBaseId,
        pageSize: 18,
        pageNum: 1,
      },
      callback: response => {
        const { list } = response;
        const currentList = list.find(item => item.id === id) || {};
        const { buildingId, floorId, pointFixInfoList } = currentList;

        const buildingList = pointFixInfoList.filter(item => item.imgType === 2);

        this.setState(
          {
            picList: pointFixInfoList.map(item => {
              return {
                ...item,
              };
            }),
            buildingId: buildingId,
            floorId: floorId,
          },
          () => {
            if (buildingList.length > 0) {
              dispatch({
                type: 'personnelPosition/fetchBuildings',
                payload: {
                  company_id: companyId,
                  pageSize: 0,
                  pageNum: 1,
                },
              });
              dispatch({
                type: 'personnelPosition/fetchFloors',
                payload: {
                  building_id: buildingId,
                  pageSize: 0,
                  pageNum: 1,
                },
              });
            }
          }
        );
      },
    });
  }

  // 返回到列表页面
  goToBack = () => {
    const {
      dispatch,
      location: {
        query: { id: pagesId, faceDataBaseId, companyId, companyName },
      },
    } = this.props;
    dispatch(
      routerRedux.push(
        `/security-manage/entrance-and-exit-monitor/face-recognition-camera/${pagesId}?faceDataBaseId=${faceDataBaseId}&&companyId=${companyId}&&companyName=${companyName}`
      )
    );
  };

  // 跳转到编辑页面
  goToEdit = id => {
    const {
      dispatch,
      location: {
        query: { id: pagesId, faceDataBaseId, companyId, companyName },
      },
    } = this.props;
    dispatch(
      routerRedux.push(
        `/security-manage/entrance-and-exit-monitor/camera-edit/${id}?id=${pagesId}&&faceDataBaseId=${faceDataBaseId}&&companyId=${companyId}&&companyName=${companyName}`
      )
    );
  };

  // 渲染单位详情
  renderUnitInfo() {
    const {
      form: { getFieldDecorator, getFieldValue },
      riskPointManage: { picType },
      match: {
        params: { id },
      },
      securityManage: {
        faceCameraData: { list },
      },
      personnelPosition: {
        map: { buildings = [], floors = [] },
      },
      location: {
        query: { companyName },
      },
    } = this.props;

    const { picList, buildingId, floorId } = this.state;

    const currentList = list.find(item => item.id === id) || {};
    const {
      name,
      number,
      locationType,
      buildingInfo,
      floorInfo,
      videoCameraArea,
      location,
      state,
      equipmentNo,
      videoCameraNo,
      videoCameraUrl,
    } = currentList;

    const { buildingName } = buildingInfo || {};
    const { floorName } = floorInfo || {};

    return (
      <Card title="摄像机设备信息详情" bordered={false}>
        <DescriptionList col={3}>
          <Description term="单位名称">{companyName || getEmptyData()}</Description>
          <Description term="名称">{name || getEmptyData()}</Description>
          <Description term="编号">{number || getEmptyData()}</Description>
          <Description term="摄像机区域-位置">
            {+locationType === 1 ? '选择建筑物-楼层' : '手填' || getEmptyData()}
          </Description>
          {+locationType === 1 && (
            <Description term="所属建筑楼层">
              {buildingName + floorName || getEmptyData()}
            </Description>
          )}
          <Description term="所在区域">{videoCameraArea || getEmptyData()}</Description>
          <Description term="位置详情">{location || getEmptyData()}</Description>
          <Description term="设备ID">{equipmentNo || getEmptyData()}</Description>
          <Description term="摄像头ID">{videoCameraNo || getEmptyData()}</Description>
          <Description term="视频URL" style={{ height: '38px' }}>
            <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
              {videoCameraUrl || getEmptyData()}
            </Ellipsis>
          </Description>
          <Description term="视频监控状态">
            <Badge color={+state === 1 ? 'green' : 'red'} />
            {+state === 1 ? '启用' : '禁用' || getEmptyData()}
          </Description>
        </DescriptionList>
        <DescriptionList col={12} style={{ marginTop: 16 }}>
          <Description term="平面图定位">
            <Row className={styles.row} style={{ width: 1000, marginLeft: '-50px' }}>
              {picList.length > 0
                ? picList.map((item, index) => {
                    return (
                      <Col span={24} key={index} style={{ marginTop: 8 }}>
                        <Col span={4}>
                          {getFieldDecorator(`type${index}`, {
                            initialValue: item.imgType,
                          })(
                            <Select
                              allowClear
                              placeholder="请选择平面图类型"
                              onChange={this.getImgInfo}
                              onSelect={() => this.handleImgIndex(index)}
                              disabled
                              style={{ width: 160 }}
                            >
                              {picType.map(({ key, value }) => (
                                <Option value={key} key={key}>
                                  {value}
                                </Option>
                              ))}
                            </Select>
                          )}
                        </Col>
                        {getFieldValue(`type${index}`) === 2 && (
                          <Col span={4}>
                            {getFieldDecorator(`buildingName${index}`, {
                              initialValue: buildingId,
                            })(
                              <Select
                                allowClear
                                placeholder="请选择建筑物名称"
                                disabled
                                onSelect={() => this.handleBuildingSelect(index)}
                                onChange
                                style={{ width: 160 }}
                              >
                                {buildings.map(({ buildingName, id }) => (
                                  <Option value={id} key={id}>
                                    {buildingName}
                                  </Option>
                                ))}
                              </Select>
                            )}
                          </Col>
                        )}
                        {getFieldValue(`type${index}`) === 2 && (
                          <Col span={4}>
                            {getFieldDecorator(`floorName${index}`, {
                              initialValue: floorId,
                            })(
                              <Select
                                allowClear
                                placeholder="请选择楼层名称"
                                disabled
                                onChange={this.getFloorPic}
                                onSelect={() => this.handleFloorSelect(index)}
                                style={{ width: 160 }}
                              >
                                {floors.map(({ floorName, id }) => (
                                  <Option value={id} key={id}>
                                    {floorName}
                                  </Option>
                                ))}
                              </Select>
                            )}
                          </Col>
                        )}

                        <Col span={4}>
                          {getFieldDecorator(`xnum${index}`, { initialValue: item.xnum })(
                            <Input placeholder="x轴" disabled style={{ width: 160 }} />
                          )}
                        </Col>
                        <Col span={4}>
                          {getFieldDecorator(`ynum${index}`, { initialValue: item.ynum })(
                            <Input placeholder="y轴" disabled style={{ width: 160 }} />
                          )}
                        </Col>
                      </Col>
                    );
                  })
                : '暂无数据'}
            </Row>
          </Description>
        </DescriptionList>
      </Card>
    );
  }

  /* 渲染底部工具栏 */
  renderFooterToolbar() {
    const {
      match: {
        params: { id },
      },
    } = this.props;

    return (
      <FooterToolbar>
        <Button
          size="large"
          onClick={() => {
            this.goToBack(id);
          }}
        >
          返回
        </Button>
        <Button
          size="large"
          type="primary"
          onClick={() => {
            this.goToEdit(id);
          }}
        >
          编辑
        </Button>
      </FooterToolbar>
    );
  }

  render() {
    const {
      match: {
        params: { id },
      },
      securityManage: {
        faceCameraData: { list },
      },
      location: {
        query: { id: pagesId, faceDataBaseId, companyName, companyId },
      },
    } = this.props;

    const currentList = list.find(item => item.id === id) || {};
    const { videoCameraArea, location } = currentList;

    //面包屑
    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '出入口监测',
        name: '出入口监测',
        href: '/security-manage/entrance-and-exit-monitor/company-list',
      },
      {
        title: '人脸识别摄像机',
        name: '人脸识别摄像机',
        href: `/security-manage/entrance-and-exit-monitor/face-recognition-camera/${pagesId}?faceDataBaseId=${faceDataBaseId}&&companyId=${companyId}&&companyName=${companyName}`,
      },
      {
        title: '摄像机详情',
        name: '摄像机详情',
      },
    ];
    return (
      <PageHeaderLayout title={videoCameraArea + location} breadcrumbList={breadcrumbList}>
        {this.renderUnitInfo()}
        {this.renderFooterToolbar()}
      </PageHeaderLayout>
    );
  }
}
