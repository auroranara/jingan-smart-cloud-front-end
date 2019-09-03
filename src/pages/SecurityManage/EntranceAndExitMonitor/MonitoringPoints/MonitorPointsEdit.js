import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, Button, Card, message } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import CompanyModal from '../../../BaseInfo/Company/CompanyModal';
import styles from './MonitorPointsEdit.less';

const FormItem = Form.Item;

// 编辑页面标题
const editTitle = '编辑监测点';
// 添加页面标题
const addTitle = '新增监测点';

// 表单标签
const fieldLabels = {
  pointName: '名称',
  pointArea: '位置',
  cameraNum: '摄像机编号',
};

@connect(({ securityManage, user, loading }) => ({
  securityManage,
  user,
  loading: loading.models.securityManage,
}))
@Form.create()
export default class MonitorPointsEdit extends PureComponent {
  state = {
    visible: false,
    videoCameraId: '',
    cameraInfo: {}, // 保存摄像机选择的信息
  };

  // 挂载后
  componentDidMount() {
    const {
      match: {
        params: { id },
      },
      dispatch,
      location: {
        query: { id: monitorSceneId },
      },
    } = this.props;
    const payload = { pageSize: 10, pageNum: 1 };

    this.fetchCameraList({ payload });

    if (id) {
      // 获取设备列表
      dispatch({
        type: 'securityManage/fetchMonitorDotList',
        payload: {
          monitorSceneId,
          pageSize: 18,
          pageNum: 1,
        },
        callback: response => {
          const { list } = response;
          const deatilList = list.find(item => item.id === id) || {};
          const { videoCameras = [] } = deatilList;
          this.setState({ videoCameraId: videoCameras.map(item => item.id).join(',') });
        },
      });
    } else {
      dispatch({
        type: 'securityManage/clearMonitorDotDetail',
      });
    }
  }

  /* 去除左右两边空白 */
  handleTrim = e => e.target.value.trim();

  goBack = () => {
    const {
      dispatch,
      location: {
        query: { id, companyName, faceDataBaseId },
      },
    } = this.props;
    dispatch(
      routerRedux.push(
        `/security-manage/entrance-and-exit-monitor/monitoring-points-list/${id}?companyName=${companyName}&&faceDataBaseId=${faceDataBaseId}`
      )
    );
  };

  // 点击提交按钮验证表单信息
  handleClickValidate = () => {
    const {
      match: {
        params: { id },
      },
      dispatch,
      form: { validateFieldsAndScroll },
      location: {
        query: { id: monitorId },
      },
    } = this.props;

    const { videoCameraId } = this.state;

    const success = () => {
      const msg = id ? '编辑成功' : '新增成功';
      // 获取列表
      message.success(msg, 1, this.goBack());
    };

    const error = () => {
      message.error(id ? '编辑失败' : '新增失败');
    };

    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        const { monitorDotName, monitorDotPlace, number } = values;
        const payload = {
          monitorDotName,
          monitorDotPlace,
          monitorSceneId: monitorId,
          number,
          state: 1,
          videoCameraId,
        };

        if (id) {
          dispatch({
            type: 'securityManage/fetchMonitorDotEdit',
            payload: {
              id,
              ...payload,
            },
            success,
            error,
          });
        } else {
          dispatch({
            type: 'securityManage/fetcMonitorDotAdd',
            payload,
            success,
            error,
          });
        }
      }
    });
  };

  handleCameraModal = () => {
    this.setState({ visible: true });
  };

  fetchCameraList = ({ payload }) => {
    const {
      dispatch,
      location: {
        query: { faceDataBaseId },
      },
    } = this.props;
    dispatch({
      type: 'securityManage/fetchFaceCameraList',
      payload: {
        monitorSceneId: faceDataBaseId,
        ...payload,
      },
    });
  };

  handleSelect = value => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      number: value.map(item => item.number).join(','),
    });
    this.setState({ videoCameraId: value.map(item => item.id).join(',') });
    this.handleClose();
  };

  handleSelectedKeys = keys => {
    console.log('keys', keys);
    this.setState({ cameraInfo: keys });
    console.log('1233', this.state.cameraInfo);
  };

  handleClose = () => {
    this.setState({ visible: false });
  };

  // 渲染模态框
  renderModal() {
    const {
      loading,
      securityManage: { faceCameraData },
    } = this.props;

    const { visible } = this.state;

    const COLUMNS = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
      },
      {
        title: '编号',
        dataIndex: 'number',
        key: 'number',
        align: 'center',
      },
      {
        title: '所属建筑物楼层',
        dataIndex: 'hasBuliding',
        key: 'hasBuliding',
        align: 'center',
        render: (val, text) => {
          const { buildingInfo = {}, floorInfo = {}, videoCameraArea, location } = text;
          return (
            <span>
              {buildingInfo !== null
                ? buildingInfo.buildingName + floorInfo.floorName
                : videoCameraArea + location}
            </span>
          );
        },
      },
    ];

    const setField = [
      {
        id: 'number',
        render() {
          return <Input placeholder="请输入编号" />;
        },
      },
    ];

    return (
      <CompanyModal
        title="选择摄像机编号"
        loading={loading}
        visible={visible}
        columns={COLUMNS}
        modal={faceCameraData}
        fetch={this.fetchCameraList}
        onSelect={this.handleSelect}
        onClose={this.handleClose}
        handleSelectedKeys={this.handleSelectedKeys}
        rowSelection={{ type: 'checkbox ' }}
        field={setField}
        multiSelect={true}
        cameraKeys
      />
    );
  }

  // 渲染摄像机弹框
  renderCameraModal = () => {};

  // 渲染信息
  renderInfo() {
    const {
      form: { getFieldDecorator },
      match: {
        params: { id },
      },
      location: {
        query: { id: monitorId, companyName, faceDataBaseId },
      },
      securityManage: {
        monitorDotData: { list },
      },
    } = this.props;

    const deatilList = list.find(item => item.id === id) || {};
    const { monitorDotName, monitorDotPlace, videoCameras = [] } = deatilList;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const itemStyles = { style: { width: '70%', marginRight: '10px' } };

    return (
      <Card className={styles.card} bordered={false}>
        <Form style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label={fieldLabels.pointName}>
            {getFieldDecorator('monitorDotName', {
              initialValue: monitorDotName,
              rules: [
                {
                  required: true,
                  message: '请输入监测点名称',
                },
              ],
            })(<Input placeholder="请输入监测点名称" {...itemStyles} />)}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.pointArea}>
            {getFieldDecorator('monitorDotPlace', {
              initialValue: monitorDotPlace,
              rules: [
                {
                  required: true,
                  message: '请输入监测点位置',
                },
              ],
            })(<Input placeholder="请输入监测点位置" {...itemStyles} />)}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.cameraNum}>
            {getFieldDecorator('number', {
              initialValue: videoCameras.map(item => item.number).join(','),
              rules: [
                {
                  required: true,
                  message: '请选择摄像机编号',
                },
              ],
            })(<Input placeholder="请选择摄像机编号" {...itemStyles} />)}
            <Button type="primary" onClick={this.handleCameraModal}>
              选择
            </Button>
          </FormItem>
        </Form>

        <div style={{ textAlign: 'center' }}>
          <Button type="primary" size="large" onClick={this.handleClickValidate}>
            提交
          </Button>
          <Button
            size="large"
            href={`#/security-manage/entrance-and-exit-monitor/monitoring-points-list/${monitorId}?faceDataBaseId=${faceDataBaseId}&&companyName=${companyName}`}
            style={{ marginLeft: '10px' }}
          >
            返回
          </Button>
        </div>
      </Card>
    );
  }

  // 渲染页面所有信息
  render() {
    const {
      match: {
        params: { id },
      },
      location: {
        query: { id: monitorId, companyName, faceDataBaseId },
      },
    } = this.props;
    const title = id ? editTitle : addTitle;

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
        title: '监测点',
        name: '监测点',
        href: `/security-manage/entrance-and-exit-monitor/monitoring-points-list/${monitorId}?companyName=${companyName}&&faceDataBaseId=${faceDataBaseId}`,
      },
      {
        title,
        name: title,
      },
    ];
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderInfo()}
        {this.renderModal()}
        {this.renderCameraModal()}
      </PageHeaderLayout>
    );
  }
}
