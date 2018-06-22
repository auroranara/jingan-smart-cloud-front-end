import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Icon, Spin } from 'antd';
import DescriptionList from 'components/DescriptionList';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import styles from './UserTransmissionDeviceDetail.less';

import DeviceDetailCard from './DeviceDetailCard';
import ModalForm from './ModalForm';

const { Description } = DescriptionList;

// 若顺序不是按照当前顺序的话，改成数组
const DESCRIP_MAP = {
  companyStatus: '企业状态',
  code: '社会信用代码',
  industryCategory: '行业类别',
  licenseType: '营业执照类型',
  registerAddress: '注册地址',
  economicType: '经济类型',
  scale: '规上',
  practicalAddress: '实际经营地址',
  createDate: '成立时间',
};

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
    name: 'transmissionDeviceCode',
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

// 添加消防主机时，用户传输装置是对应好的，所以在表单中用户传输装置编号不需要显示
const hostModalFormItemsAdd = hostModalFormItems.filter(
  item => item.name !== 'transmissionDeviceCode'
);

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

  downloadPointPositionTemplate = () => {};
  importPointPositionClick = () => {};
  exportPointPositionClick = () => {};

  handleDeviceModalVisible = flag => {
    this.setState({ deviceModalVisible: !!flag });
  };

  /* 带click的方法，表示传入card中用来button点击时触发，正在处理数据的方法中不带click
   * 在这里，add和update时是在Modal中操作的，而addClick,updateClick时是是在Table中触发跳出Modal，并不能直接进行add/update操作，
   * 所以造成了数据分离，所以要将其分开，并将部分数据同步到共同的父组件，而deleteClick时却可以直接执行delete操作，所以数据不用同步，传个参就可以
   */
  handleDeviceAddClick = () => {
    this.setState({ deviceModalVisible: true, operation: 'add', deviceRecord: null });
  };

  handleDeviceAdd = fieldsValue => {
    const {
      dispatch,
      match: {
        params: { companyId },
      },
    } = this.props;
    dispatch({ type: 'transmission/deviceAddAsync', payload: { companyId, data: fieldsValue } });
  };

  // 带入了一个参数record，是为了从card中对应的地方获取数据同步到其父组件的state中，进行变量提升，
  // 这样modal中的form才能从当前共同父组件中获取从card中传上来的数据
  handleDeviceUpdateClick = deviceData => {
    this.setState({ deviceModalVisible: true, operation: 'update', deviceRecord: deviceData });
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
    });
  };

  handleDeviceDeleteClick = deviceId => {
    this.handleDeviceDelete(deviceId);
  };

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
    });
  };

  handleHostModalVisible = flag => {
    this.setState({ hostModalVisible: !!flag });
  };

  handleHostAddClick = transmissionId => {
    this.setState({
      hostModalVisible: true,
      operation: 'add',
      hostRecord: null,
      currentTransmissionId: transmissionId,
    });
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
    });
  };

  handleHostUpdateClick = record => {
    this.setState({ hostModalVisible: true, operation: 'update', hostRecord: record });
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
    });
  };

  handleHostDeleteClick = (transmissionId, hostId) => {
    this.handleHostDelete(transmissionId, hostId);
  };

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
    });
  };

  render() {
    const {
      transmission: { deviceList, companyDetail },
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

    const description = (
      <DescriptionList size="small">
        {Object.keys(DESCRIP_MAP).map(k => (
          <Description key={k} term={DESCRIP_MAP[k]}>
            {companyDetail[k]}
          </Description>
        ))}
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
    const cards = deviceList.map((device, index) => (
      <DeviceDetailCard key={device.id} index={index} deviceData={device} {...cardParentMethods} />
    ));

    const deviceParentMethods = {
      handleModalVisible: this.handleDeviceModalVisible,
      handleAdd: this.handleDeviceAdd,
      handleUpdate: this.handleDeviceUpdate,
    };
    const hostParentMethods = {
      handleModalVisible: this.handleHostModalVisible,
      handleAdd: this.handleHostAdd,
      handleUpdate: this.handleHostUpdate,
    };

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
          items={operation === 'add' ? hostModalFormItemsAdd : hostModalFormItems}
          initialValues={hostRecord}
        />
      </PageHeaderLayout>
    );
  }
}
