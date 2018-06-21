import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Icon, Spin } from 'antd';
import DescriptionList from 'components/DescriptionList';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import styles from './UserTransmissionDeviceDetail.less';

import DeviceDetailCard from './DeviceDetailCard';
import ModalForm from './ModalForm';

const { Description } = DescriptionList;

const description = (
  <DescriptionList size="small">
    <Description term="企业状态">正常</Description>
    <Description term="社会信用代码">HV3131</Description>
    <Description term="行业类别">制造业</Description>
    <Description term="营业执照类型">企业法人代表</Description>
    <Description term="注册地址">江苏省无锡市</Description>
    <Description term="经济类型">民营公司</Description>
    <Description term="规模状况">中上</Description>
    <Description term="实际经营地址">江苏省无锡市新吴区新安街道</Description>
    <Description term="成立时间">2015-6-14</Description>
  </DescriptionList>
);

const deviceModalFormItems = [
  {
    label: '装置名称',
    name: 'deviceName',
    options: { rules: [{ required: true, message: 'input' }] },
  },
  {
    label: '装置编号',
    name: 'deviceCode',
    options: { rules: [{ required: true, message: 'input' }] },
  },
  { label: '品牌', name: 'brand', options: { rules: [{ required: true, message: 'input' }] } },
  { label: '型号', name: 'model', options: { rules: [{ required: true, message: 'input' }] } },
  {
    label: '安装位置',
    name: 'installLocation',
    options: { rules: [{ required: true, message: 'input' }] },
  },
  { label: '生产日期', name: 'productionDate' },
];

const hostModalFormItems = [
  {
    label: '传输装置编号',
    name: 'deviceId',
    options: { rules: [{ required: true, message: 'input' }] },
  },
  {
    label: '传输接口',
    name: 'transmissionInterface',
    options: { rules: [{ required: true, message: 'input' }] },
  },
  {
    label: '主机编号',
    name: 'deviceCode',
    options: { rules: [{ required: true, message: 'input' }] },
  },
  { label: '品牌', name: 'brand', options: { rules: [{ required: true, message: 'input' }] } },
  { label: '型号', name: 'model', options: { rules: [{ required: true, message: 'input' }] } },
  {
    label: '安装位置',
    name: 'installLocation',
    options: { rules: [{ required: true, message: 'input' }] },
  },
  { label: '生产日期', name: 'productionDate' },
];

@connect(({ transmission, loading }) => ({
  transmission,
  loading: loading.effects['transmission/fetchDetail'],
}))
export default class UserTransmissionDeviceDetail extends Component {
  state = {
    deviceModalVisible: false,
    hostModalVisible: false,
    operation: 'add',
    deviceRecord: null,
    hostRecord: null,
  };

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    // console.log(id);
    dispatch({
      type: 'transmission/fetchDetail',
      payload: id,
    });
  }

  downloadPointPositionTemplate = () => {};
  importPointPositionClick = () => {};
  exportPointPositionClick = () => {};

  handleDeviceModalVisible = flag => {
    this.setState({ deviceModalVisible: !!flag });
  };

  // 带click的方法，表示传入card中用来button点击时触发，正在处理数据的方法中不带click
  handleDeviceAddClick = () => {
    this.setState({ deviceModalVisible: true, operation: 'add', deviceRecord: null });
  };

  // 带入了一个参数record，是为了从card中对应的地方获取数据同步到其父组件的state中，进行变量提升，
  // 这样modal中的form才能从当前共同父组件中获取从card中传上来的数据
  handleDeviceUpdateClick = record => {
    this.setState({ deviceModalVisible: true, operation: 'update', deviceRecord: record });
  };

  handleDeviceDeleteClick = () => {};

  handleHostModalVisible = flag => {
    this.setState({ hostModalVisible: !!flag });
  };

  handleHostAddClick = () => {
    this.setState({ hostModalVisible: true, operation: 'add', hostRecord: null });
  };

  handleHostUpdateClick = record => {
    this.setState({ hostModalVisible: true, operation: 'update', hostRecord: record });
  };

  handleHostDeleteClick = () => {};

  render() {
    const {
      transmission: { deviceList },
      loading,
    } = this.props;

    const {
      deviceModalVisible,
      hostModalVisible,
      operation,
      deviceRecord,
      hostRecord,
    } = this.state;

    const action = (
      <Fragment>
        <Button type="primary" onClick={this.handleDeviceAddClick}>
          新增用户传输装置
        </Button>
        <Button type="primary" onClick={this.downloadPointPositionTemplate}>
          下载点位模板
        </Button>
        <Button type="primary" onClick={this.exportPointPositionClick}>
          导出点位数据
        </Button>
      </Fragment>
    );

    const cardParentMethods = {};
    const methodNames = [
      'handleDeviceUpdateClick',
      'handleDeviceDeleteClick',
      'handleHostAddClick',
      'handleHostUpdateClick',
      'handleHostDeleteClick',
      'importPointPositionClick',
    ];
    methodNames.forEach(method => {
      cardParentMethods[method] = this[method];
    });

    // console.log('detailList in render', deviceList);
    // console.log('transmission', this.props.transmission);
    const cards = deviceList.map((device, index) => (
      <DeviceDetailCard key={device.id} index={index} deviceData={device} {...cardParentMethods} />
    ));

    const deviceParentMethods = { handleModalVisible: this.handleDeviceModalVisible };
    const hostParentMethods = { handleModalVisible: this.handleHostModalVisible };

    return (
      <PageHeaderLayout
        title="常熟市鑫博伟纺织有限公司"
        logo={<Icon type="apple" />}
        action={action}
        content={description}
      >
        <Spin spinning={loading}>{cards}</Spin>
        <ModalForm
          {...deviceParentMethods}
          modalVisible={deviceModalVisible}
          title="用户传输装置"
          operation={operation}
          items={deviceModalFormItems}
          initialValues={deviceRecord}
        />
        <ModalForm
          {...hostParentMethods}
          modalVisible={hostModalVisible}
          title="消防主机"
          operation={operation}
          items={hostModalFormItems}
          initialValues={hostRecord}
        />
      </PageHeaderLayout>
    );
  }
}
