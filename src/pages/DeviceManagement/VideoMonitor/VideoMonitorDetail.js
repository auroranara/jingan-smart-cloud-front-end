import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card } from 'antd';
import FooterToolbar from '@/components/FooterToolbar';
import { routerRedux } from 'dva/router';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Ellipsis from '@/components/Ellipsis';
// 地图定位
import MapMarkerSelect from '@/components/MapMarkerSelect';

import { AuthButton } from '@/utils/customAuth';
import codesMap from '@/utils/codes';

const { Description } = DescriptionList;

/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

@connect(({ videoMonitor, loading }) => ({
  videoMonitor,
  loading: loading.models.videoMonitor,
}))
@Form.create()
export default class VideoMonitorDetail extends PureComponent {
  state = {
    buildingName: '',
    floorName: '',
  };

  /* 生命周期函数 */
  componentDidMount () {
    const {
      dispatch,
      match: {
        params: { id, companyId },
      },
    } = this.props;

    // 获取视频设备信息详情
    dispatch({
      type: 'videoMonitor/fetchVideoDetail',
      payload: { id },
      callback: ({ buildingId, floorId }) => {
        // 获取建筑列表
        dispatch({
          type: 'personnelPosition/fetchBuildings',
          payload: { pageNum: 1, pageSize: 0, company_id: companyId },
          callback: list => {
            const { buildingName = null } = list.find(item => item.id === buildingId) || {};
            this.setState({ buildingName });
          },
        });
        dispatch({
          type: 'personnelPosition/fetchFloors',
          payload: { pageNum: 1, pageSize: 0, building_id: buildingId },
          callback: list => {
            const { floorName } = list.find(item => item.id === floorId) || {};
            this.setState({ floorName });
          },
        });
      },
    });
  }

  // 跳转到编辑页面
  goToEdit = id => {
    const {
      dispatch,
      match: { params: { companyId } },
    } = this.props;
    dispatch(
      routerRedux.push(`/device-management/video-monitor/edit/${id}?companyId=${companyId}`)
    );
  };

  // 渲染单位详情
  renderUnitInfo () {
    const {
      match: { params: { companyId } },
      videoMonitor: {
        detail: {
          data: {
            deviceId,
            keyId,
            // name,
            rtspAddress,
            photoAddress,
            isInspection,
            // xnum,
            // ynum,
            // xfire,
            // yfire,
            pointFixInfoList,
          },
        },
      },
    } = this.props;
    const { buildingName, floorName } = this.state;
    let mapLocation = {};
    if (pointFixInfoList && pointFixInfoList.length) {
      let { xnum, ynum, znum, groupId, areaId } = pointFixInfoList[0];
      const coord = { x: +xnum, y: +ynum, z: +znum };
      groupId = +groupId;
      mapLocation = { groupId, coord, areaId };
    }

    return (
      <Card title="视频设备信息详情" bordered={false}>
        <DescriptionList col={3}>
          <Description term="设备ID">{deviceId || getEmptyData()}</Description>
          <Description term="摄像头ID">{keyId || getEmptyData()}</Description>
          {/* <Description term="视频所属区域">{name || getEmptyData()}</Description> */}
          <Description term="所属建筑楼层">
            {buildingName + floorName || getEmptyData()}
          </Description>
          <Description term="视频URL">
            <Ellipsis tooltip lines={1}>
              {rtspAddress || getEmptyData()}
            </Ellipsis>
          </Description>

          <Description term="图片地址">{photoAddress || getEmptyData()}</Description>
          <Description term="是否用于查岗">
            {isInspection === 1 ? '是' : '否' || getEmptyData()}
          </Description>
          {/* <Description term="四色图坐标-X">{xnum || getEmptyData()}</Description>
          <Description term="四色图坐标-Y">{ynum || getEmptyData()}</Description>
          <Description term="消防平面图坐标-X">{xfire || getEmptyData()}</Description>
          <Description term="消防平面图坐标-Y">{yfire || getEmptyData()}</Description> */}
          <Description term="地图定位" colWrapper={{ xs: 24 }} style={{ display: 'flex' }}>
            <MapMarkerSelect value={mapLocation} readonly={true} companyId={companyId} />
          </Description>
        </DescriptionList>
      </Card>
    );
  }

  /* 渲染底部工具栏 */
  renderFooterToolbar () {
    const {
      match: {
        params: { id },
      },
    } = this.props;

    return (
      <FooterToolbar>
        <AuthButton
          code={codesMap.deviceManagement.videoMonitor.edit}
          size="large"
          type="primary"
          onClick={() => {
            this.goToEdit(id);
          }}
        >
          编辑
        </AuthButton>
      </FooterToolbar>
    );
  }

  render () {
    const {
      videoMonitor: {
        detail: {
          data: { name },
        },
      },
      location: {
        query: { name: companyName },
      },
      match: {
        params: { companyId },
      },
    } = this.props;

    //面包屑
    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '物联设备管理',
        name: '物联设备管理',
      },
      {
        title: '监控摄像头',
        name: '监控摄像头',
        href: '/device-management/video-monitor/list',
      },
      {
        title: '监控摄像头列表',
        name: '监控摄像头列表',
        href: `/device-management/video-monitor/video-equipment/${companyId}?name=${companyName}`,
      },
      {
        title: '视频设备详情',
        name: '视频设备详情',
      },
    ];
    return (
      <PageHeaderLayout title={name} breadcrumbList={breadcrumbList}>
        {this.renderUnitInfo()}
        {this.renderFooterToolbar()}
      </PageHeaderLayout>
    );
  }
}
