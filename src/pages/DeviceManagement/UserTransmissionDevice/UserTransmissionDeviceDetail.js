import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Spin, message } from 'antd';
// import { Button, Modal, Spin, message } from 'antd';
import DescriptionList from '@/components/DescriptionList';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles from './UserTransmissionDeviceDetail.less';

import DeviceDetailCard from './DeviceDetailCard';
import ModalForm from './ModalForm';
import { AuthButton } from '@/utils/customAuth';
import buttonCodes from '@/utils/codes';
import router from 'umi/router';

const { Description } = DescriptionList;
// const { confirm } = Modal;
const ButtonGroup = Button.Group;

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '设备管理', name: '设备管理' },
  { title: '用户传输装置', name: '用户传输装置', href: '/device-management/user-transmission-device/list' },
  { title: '详情页', name: '详情页' },
];

// const DEVICE_ADD_CODE = 'fireControl.userTransmissionDevice.add';

// 若顺序不是按照当前顺序的话，改成数组
const DESCRIP_MAP = {
  companyStatusLabel: '企业状态',
  code: '社会信用代码',
  industryCategoryLabel: '行业类别',
  licenseTypeLabel: '营业执照类型',
  registerAddress: '注册地址',
  economicTypeLabel: '经济类型',
  scaleLabel: '规模',
  practicalAddress: '实际经营地址',
  praticalAddress: '实际经营地址',
  createTime: '成立时间', // response中传过来的值是个毫秒数，所以需要定义一个函数转成日期字符串
};

const deviceModalFormItems = [
  {
    label: '装置名称',
    name: 'deviceName',
    options: { rules: [{ required: true, whitespace: true, message: '请输入用户传输装置名称' }] },
  },
  {
    label: '装置编号',
    name: 'deviceCode',
    // type: 'inputNumber',
    // deviceCode为数字，则要设置type=number，不然默认为string，下面主机中的两个deviceCode同理
    // options: { rules: [{ required: true, type: 'number', message: '请输入用户传输装置编号' }] },
    options: {
      rules: [
        { required: true, whitespace: true, message: '请输入用户传输装置编号' },
        { pattern: /^\d+$/, message: '装置编号请输入纯数字' },
      ],
    },
  },
  {
    label: '品牌',
    name: 'brand',
    options: { rules: [{ required: true, whitespace: true, message: '请输入用户传输装置品牌' }] },
  },
  {
    label: '型号',
    name: 'model',
    options: { rules: [{ required: true, whitespace: true, message: '请输入用户传输装置型号' }] },
  },
  {
    label: '安装位置',
    name: 'installLocation',
    options: { rules: [{ required: true, whitespace: true, message: '请输入用户传输装置安装位置' }] },
  },
  { label: '生产日期', type: 'date-picker', placehoder: '请选择日期', name: 'productionDate' },
];

const hostModalFormItems = [
  {
    label: '传输装置编号',
    name: 'transmissionDeviceCode',
    disabled: true,
    // type: 'inputNumber',
    // options: { rules: [{ required: true, type: 'number', message: '请输入消防主机对应的用户传输装置编号' }] },
    options: { rules: [{ required: true, whitespace: true, message: '请输入消防主机对应的用户传输装置编号' }] },
  },
  {
    label: '传输接口',
    name: 'transmissionInterface',
    options: { rules: [{ required: true, whitespace: true, message: '请输入消防主机的传输接口' }] },
  },
  {
    label: '主机编号',
    name: 'deviceCode',
    placeholder: '第一个消防主机编号请与装置编号相同',
    // deviceCode为数字，则要设置type=number，不然默认为string
    // type: 'inputNumber',
    // options: { rules: [{ required: true, type: 'number', message: '请输入消防主机编号' }] },
    options: {
      rules: [
        { required: true, whitespace: true, message: '请输入消防主机编号' },
        { pattern: /^\d+$/, message: '主机编号请输入纯数字' },
      ],
    },
  },
  {
    label: '品牌',
    name: 'brand',
    options: { rules: [{ required: true, whitespace: true, message: '请输入消防主机品牌' }] },
  },
  {
    label: '型号',
    name: 'model',
    options: { rules: [{ required: true, whitespace: true, message: '请输入消防主机型号' }] },
  },
  {
    label: '安装位置',
    name: 'installLocation',
    options: { rules: [{ required: true, whitespace: true, message: '请输入消防主机安装位置' }] },
  },
  { label: '生产日期', type: 'date-picker', placehoder: '请选择日期', name: 'productionDate' },
  { type: 'checkbox', name: 'reset', placeholder: '接收不到复位信息', labelCol: { span: 0 }, wrapperCol: { span: 15, offset: 5 }, options: { valuePropName: 'checked' } },
];

const hostModalFormItemsUpdate = hostModalFormItems;
// const hostModalFormItemsUpdate = disableDeviceCode(hostModalFormItems);
const deviceModalFormItemsUpdate = deviceModalFormItems;
// const deviceModalFormItemsUpdate = disableDeviceCode(deviceModalFormItems);

// 添加用户传输装置/消防主机时，装置编号不可修改
function disableDeviceCode(items) {
  return items.map(item => {
    if (item.name === 'deviceCode')
      return { ...item, disabled: true };
    return item;
  });
}

function dispatchCallback(code, successMsg, failMsg, msg) {
  if (code === 200)
    message.success(successMsg);
  else
    message.error(msg || failMsg);
}

function convertMsToString(ms) {
  const date = new Date(ms);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

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
    // 当点击添加消防主机时在父组件设定当前消防主机所在用户传输装置的id，以此让在modal中点击确定时，能定位到对应的用户传输装置
    currentTransmissionId: null,
  };

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { companyId },
      },
    } = this.props;
    // console.log(id);
    dispatch({ type: 'transmission/fetchDetail', payload: companyId });
    dispatch({ type: 'transmission/fetchCompanyDetail', payload: companyId });
  }

  downloadPointPositionTemplate = () => {
    // message.info('小姐姐，这个功能暂未开放哦');
    message.info('这个功能暂未开放');
  };
  // importPointPositionClick = () => {};
  exportPointPositionClick = () => {
    // message.info('小姐姐，这个功能暂未开放哦');
    message.info('这个功能暂未开放');
  };

  hideDeviceModal = () => {
    this.setState({ deviceModalVisible: false, deviceRecord: null });
  };

  /* 带click的方法，表示传入card中用来button点击时触发，正在处理数据的方法中不带click
   * 在这里，add和update时是在Modal中操作的，而addClick,updateClick时是是在Table中触发跳出Modal，
   * 并不能直接进行add/update操作，所以造成了数据分离，所以要将其分开，并将部分数据同步到共同的父组件，
   * 而deleteClick时却可以通过confirm执行delete操作，所以数据不用同步，传个参就可以
   */
  handleDeviceAddClick = () => {
    const {
      transmission: { companyDetail: { id, name } },
    } = this.props
    // this.setState({ deviceModalVisible: true, operation: 'add' });
    // 跳转到新增网关设备页面（设备类型：用户传输装置）
    router.push(`/device-management/gateway/add?equipmentType=201&companyId=${id}&companyName=${name}`)
  };

  handleDeviceAdd = fieldsValue => {
    const {
      dispatch,
      match: {
        params: { companyId },
      },
    } = this.props;
    dispatch({ type: 'transmission/deviceAddAsync', payload: { companyId, data: fieldsValue }, callback: dispatchCallback });
  };

  // 带入了一个参数record，是为了从card中对应的地方获取数据同步到其父组件的state中，进行变量提升，
  // 这样modal中的form才能从当前共同父组件中获取从card中传上来的数据
  handleDeviceUpdateClick = deviceData => {
    // this.setState({ deviceModalVisible: true, operation: 'update', deviceRecord: deviceData });
    // 跳转到编辑网关页面
    router.push(`/device-management/gateway/edit/${deviceData.id}`)
  };

  handleDeviceUpdate = fieldsValue => {
    const {
      dispatch,
      match: {
        params: { companyId },
      },
    } = this.props;
    const {
      deviceRecord: { id: transmissionId },
    } = this.state;
    // console.log(this.state.deviceRecord);
    dispatch({
      type: 'transmission/deviceUpdateAsync',
      payload: { companyId, transmissionId, data: fieldsValue },
      callback: dispatchCallback,
    });
  };

  handleDeviceDeleteClick = () => {
    message.warn('删除功能暂未开放');
  };

  // handleDeviceDeleteClick = deviceId => {
  //   const that = this;
  //   confirm({
  //     title: '确定删除当前用户传输装置？',
  //     onOk() {
  //       that.handleDeviceDelete(deviceId);
  //     },
  //   });
  // };

  handleDeviceDelete = deviceId => {
    const {
      dispatch,
      match: {
        params: { companyId },
      },
    } = this.props;
    dispatch({
      type: 'transmission/deviceDeleteAsync',
      payload: { companyId, transmissionId: deviceId },
      callback: dispatchCallback,
    });
  };

  hideHostModal = () => {
    this.setState({ hostModalVisible: false, hostRecord: null });
  };

  // 添加主机时，消防传输装置的deviceCode是固定的
  handleHostAddClick = (transmissionId, transmissionDeviceCode) => {
    const {
      match: { params: { companyId } },
    } = this.props
    // this.setState({
    //   hostModalVisible: true,
    //   operation: 'add',
    //   hostRecord: { transmissionDeviceCode },
    //   currentTransmissionId: transmissionId,
    // });
    // 跳转到新增处理设备页面（消防主机 type=101）
    router.push(`/device-management/data-processing/101/add?companyId=${companyId}&gatewayCode=${transmissionDeviceCode}&gatewayId=${transmissionId}`)
  };

  handleHostAdd = fieldsValue => {
    const {
      dispatch,
      match: {
        params: { companyId },
      },
    } = this.props;
    const { currentTransmissionId: transmissionId } = this.state;
    dispatch({
      type: 'transmission/hostAddAsync',
      payload: { companyId, transmissionId, data: fieldsValue },
      callback: dispatchCallback,
    });
  };

  handleHostUpdateClick = record => {
    const {
      match: { params: { companyId } },
    } = this.props;
    // this.setState({ hostModalVisible: true, operation: 'update', hostRecord: record });
    // 跳转到编辑处理设备页面（消防主机 type=101）
    router.push(`/device-management/data-processing/101/edit/${record.id}?companyId=${companyId}&gatewayCode=${record.transmissionDeviceCode}&gatewayId=${record.id}`)
  };

  handleHostUpdate = fieldsValue => {
    const {
      dispatch,
      match: {
        params: { companyId },
      },
    } = this.props;
    // 这里不需要从state中取transmissionId，直接在hostRecord中传了的
    const {
      hostRecord: { transmissionId, id: hostId },
    } = this.state;
    dispatch({
      type: 'transmission/hostUpdateAsync',
      payload: { companyId, transmissionId, hostId, data: fieldsValue },
      callback: dispatchCallback,
    });
  };

  handleHostDeleteClick = () => {
    message.warn('删除功能暂未开放');
  }

  // handleHostDeleteClick = (transmissionId, hostId) => {
  //   const that = this;
  //   confirm({
  //     title: '确认删除当前消防主机？',
  //     onOk() {
  //       that.handleHostDelete(transmissionId, hostId);
  //     },
  //   });
  // };

  handleHostDelete = (transmissionId, hostId) => {
    const {
      dispatch,
      match: {
        params: { companyId },
      },
    } = this.props;
    dispatch({
      type: 'transmission/hostDeleteAsync',
      payload: { companyId, transmissionId, hostId },
      callback: dispatchCallback,
    });
  };

  render() {
    const {
      transmission: { deviceList, companyDetail },
      // user: { currentUser: { permissionCodes: codes } },
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
        <ButtonGroup>
          <Button onClick={this.downloadPointPositionTemplate}>
            下载点位模板
          </Button>
          <Button onClick={this.exportPointPositionClick}>
            导出点位数据
          </Button>
        </ButtonGroup>
        <AuthButton type="primary" code={buttonCodes.deviceManagement.transmission.add} onClick={this.handleDeviceAddClick}>
          新增传输装置
        </AuthButton>
      </Fragment>
    );

    const description = (
      <DescriptionList size="small" col={3}>
        {Object.keys(DESCRIP_MAP).map(
          k =>
            // 兼容实际地址 practical pratical
            companyDetail[k] === undefined ? null : (
              <Description key={k} term={DESCRIP_MAP[k]}>
                {companyDetail[k] === null ? '暂无信息' : k.toLowerCase().includes('time') ? convertMsToString(companyDetail[k]) : companyDetail[k].toString()}
              </Description>
            )
        )}
      </DescriptionList>
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

    // let cards = (
    //   <Card style={{ textAlign: 'center', fontSize: 16 }}>
    //     暂无数据，您现在可以
    //     <Button type="primary" onClick={this.handleDeviceAddClick} icon="plus" style={{ fontSize: 16, marginLeft: 5 }}>
    //       新增传输装置
    //     </Button>
    //   </Card>
    // );

    let cards = <div style={{ fontSize: 20, textAlign: 'center' }}>暂无数据</div>;

    if (deviceList.length)
      cards = deviceList.map((device, index) => (
        <DeviceDetailCard key={device.id} index={index} deviceData={device} companyId={this.props.match.params.companyId} {...cardParentMethods} />
      ));

    const deviceParentMethods = {
      hideModal: this.hideDeviceModal,
      handleAdd: this.handleDeviceAdd,
      handleUpdate: this.handleDeviceUpdate,
    };
    const hostParentMethods = {
      hideModal: this.hideHostModal,
      handleAdd: this.handleHostAdd,
      handleUpdate: this.handleHostUpdate,
    };

    return (
      <PageHeaderLayout
        title={companyDetail.name}
        breadcrumbList={breadcrumbList}
        // logo={<Icon type="apple" />}
        action={action}
        content={description}
      >
        <Spin spinning={loading}>{cards}</Spin>
        <ModalForm
          {...deviceParentMethods}
          modalVisible={deviceModalVisible}
          title="用户传输装置"
          className={styles.modalForm}
          operation={operation}
          items={operation === 'add' ? deviceModalFormItems : deviceModalFormItemsUpdate}
          initialValues={deviceRecord}
        />
        <ModalForm
          {...hostParentMethods}
          modalVisible={hostModalVisible}
          title="消防主机"
          className={styles.modalForm}
          operation={operation}
          items={operation === 'add' ? hostModalFormItems : hostModalFormItemsUpdate}
          initialValues={hostRecord}
        />
      </PageHeaderLayout>
    );
  }
}
