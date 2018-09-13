import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Table, Divider, Button, Badge } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles from './VideoDetail.less';

const { Description } = DescriptionList;
const statusMap = ['default', 'success', 'error', 'processing'];
const status = ['关闭', '正常', '异常', '缓慢'];
const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '设备管理', name: '设备管理' },
  { title: '海康视频树', name: '海康视频树' },
  { title: '视频列表', name: '视频列表', href: '/video-surveillance/hik-video-tree/videoList' },
  { title: '视频详情', name: '视频详情' },
];

@connect(({ video, loading }) => ({
  video,
  loading: loading.effects['video/fetchDetail'],
}))
export default class VideoDetail extends Component {
  state = {
    records: [
      {
        title: '维修时间',
        dataIndex: 'time',
        key: 'time',
      },
      {
        title: '维修公司',
        dataIndex: 'company',
        key: 'company',
      },
      {
        title: '维修人员',
        dataIndex: 'staff',
        key: 'staff',
      },
      {
        title: '维修内容',
        dataIndex: 'content',
        key: 'content',
      },
    ],
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'video/fetchDetail',
      payload: {
        videoId: this.props.match.params.id,
      },
    });
  }

  handleAddRecord() {
    if (this.props.onClick) {
      this.props.onClick();
    }
  }

  render() {
    const { video: { detail }, loading } = this.props;
    return (
      <PageHeaderLayout title="视频详情" breadcrumbList={breadcrumbList} >
        <Card bordered={false}>
          <DescriptionList size="large" title="视频基础信息" style={{ marginBottom: 32 }}>
            <Description term="视频名称">{detail.name}</Description>
            <Description term="视频编号">{detail.indexCode}</Description>
            <Description term="所属目录">{detail.dirName}</Description>
            <Description term="摄像头类型">{detail.type || <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>}</Description>
            <Description term="设备IP地址">{detail.innerIp}</Description>
            <Description term="所属区域">{detail.dirName}</Description>
            <Description term="经度">{detail.longitude === 'null' ? <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span> : (detail.longitude || detail.longitude)}</Description>
            <Description term="纬度">{detail.latitude === 'null' ? <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span> : (detail.latitude || detail.latitude)}</Description>
            <Description term="视频状态">
              <Badge status={statusMap[detail.status]} text={status[detail.status]} />
            </Description>
          </DescriptionList>
          {/* <Divider style={{ marginBottom: 32 }} />
          {detail.repairCompany ? (
            <DescriptionList size="large" title="维保信息" style={{ marginBottom: 32 }}>
              <Description term="维保公司">{detail.repairCompany.company}</Description>
              <Description term="联系电话">{detail.repairCompany.phone}</Description>
              <Description term="公司地址">{detail.repairCompany.address}</Description>
              <Description term="联系人">{detail.repairCompany.contact}</Description>
            </DescriptionList>
          ) :
            (
              <DescriptionList size="large" title="维保信息" style={{ marginBottom: 32 }}>
                <div style={{ padding: '16px', fontSize: '14px', color: 'rgba(0,0,0,0.45)', textAlign: 'center' }}>暂无数据</div>
              </DescriptionList>
            )} */}
          {/* <Divider style={{ marginBottom: 32 }} /> */}
          {/* <div className={styles.titleWrapper}>
            <div className={styles.title} style={{ display: 'inline-block', width: '50%', verticalAlign: 'top' }}>维修记录</div>
            <div style={{ display: 'inline-block', marginBottom: '8px', width: '50%', textAlign: 'right', verticalAlign: 'top' }}>
              <Button
                icon="plus"
                type="primary"
                onClick={this.handleAddRecord.bind(this)}
                style={{ display: 'none' }}
              >
                新建
              </Button>
            </div>
          </div> */}
          {/* <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            loading={loading}
            dataSource={detail.records}
            columns={this.state.records}
            rowKey="id"
            bordered
          /> */}
        </Card>
      </PageHeaderLayout>
    );
  }
}
