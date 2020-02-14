import React, { Component } from 'react';
import { Input, message } from 'antd';
import TablePage from '@/templates/TablePage';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import Company from '../../Company';
import { connect } from 'dva';
import styles from './index.less';

export const URL_PREFIX = '/license-plate-recognition-system/park-management/device';
export const TYPES = [
  { key: '1', value: '主相机' },
  { key: '2', value: '辅相机' },
  { key: '3', value: '广告机' },
];
export const BREADCRUMB_LIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '人员在岗在位管理', name: '人员在岗在位管理' },
  { title: '车牌识别系统', name: '车牌识别系统' },
  { title: '车场管理', name: '车场管理' },
];
const MAPPER = {
  namespace: 'licensePlateRecognitionSystem',
  list: 'deviceList',
  getList: 'getDeviceList',
  remove: 'deleteDevice',
  loading: 'setMainCamera',
};

@connect(
  ({ user }) => ({
    user,
  }),
  dispatch => ({
    setMainCamera(payload, callback) {
      dispatch({
        type: 'licensePlateRecognitionSystem/setMainCamera',
        payload,
        callback(success, data) {
          if (success) {
            message.success('设置成功！');
          } else {
            message.error('设置失败，请稍后重试！');
          }
          callback && callback(success, data);
        },
      });
    },
  })
)
export default class DeviceList extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.match.params.unitId !== this.props.match.params.unitId;
  }

  setPageReference = page => {
    this.page = page && page.getWrappedInstance();
  };

  transform = ({ unitId, ...props }) => ({
    // unitId, // 这个接接口时重点关注一下
    ...props,
  });

  getBreadcrumbList = ({ isUnit }) =>
    BREADCRUMB_LIST.concat(
      [
        !isUnit && { title: '单位设备信息', name: '单位设备信息', href: `${URL_PREFIX}/list` },
        { title: '设备信息', name: '设备信息' },
      ].filter(v => v)
    );

  getContent = ({ list: { pagination: { total } = {} } = {} }) => (
    <span>
      设备总数：
      {total || 0}
    </span>
  );

  getFields = () => [
    // {
    //   id: 'name',
    //   transform: v => v.trim(),
    //   render: ({ onSearch }) => (
    //     <Input placeholder="请输入所属单位" maxLength={50} onPressEnter={onSearch} />
    //   ),
    // },
    {
      id: 'name',
      transform: v => v.trim(),
      render: ({ onSearch }) => (
        <Input placeholder="请输入设备名称" maxLength={50} onPressEnter={onSearch} />
      ),
    },
    {
      id: 'number',
      transform: v => v.trim(),
      render: ({ onSearch }) => (
        <Input placeholder="请输入序列号" maxLength={50} onPressEnter={onSearch} />
      ),
    },
  ];

  getAction = ({ renderAddButton }) => renderAddButton({ name: '新增设备' });

  getColumns = ({
    list,
    renderSetButton,
    renderDetailButton,
    renderEditButton,
    renderDeleteButton,
  }) => [
    {
      title: '所在车场',
      dataIndex: 'parkName',
      align: 'center',
    },
    {
      title: '所在区域',
      dataIndex: 'areaName',
      align: 'center',
    },
    {
      title: '所在通道',
      dataIndex: 'channelName',
      align: 'center',
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '序列号',
      dataIndex: 'number',
      align: 'center',
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      align: 'center',
    },
    {
      title: '设备类型',
      dataIndex: 'type',
      align: 'center',
      render: value => <SelectOrSpan list={TYPES} value={`${value}`} type="span" />,
    },
    {
      title: '操作',
      dataIndex: '操作',
      align: 'center',
      width: 234,
      fixed: list && list.length ? 'right' : undefined,
      render: (_, data) => (
        <div className={styles.buttonWrapper}>
          {+data.type !== 1 && renderSetButton(data)}
          {renderDetailButton(data)}
          {renderEditButton(data)}
          {renderDeleteButton(data)}
        </div>
      ),
    },
  ];

  handleSetButtonClick = ({ id }) => {
    const { setMainCamera } = this.props;
    setMainCamera(
      {
        id,
      },
      success => {
        if (success) {
          this.page && this.page.reload();
        }
      }
    );
  };

  render() {
    const {
      user: { currentUser: { unitType } = {} },
      match: {
        params: { unitId },
      },
      route,
      location,
      match,
    } = this.props;
    const props = {
      route,
      location,
      match,
    };

    return unitType === 4 || unitId ? (
      <TablePage
        breadcrumbList={this.getBreadcrumbList}
        content={this.getContent}
        fields={this.getFields}
        action={this.getAction}
        columns={this.getColumns}
        otherOperation={[
          {
            code: 'set',
            name: '设置主相机',
            onClick: this.handleSetButtonClick,
          },
        ]}
        mapper={MAPPER}
        showTotal={false}
        withUnitId
        ref={this.setPageReference}
        {...props}
      />
    ) : (
      <Company
        name="设备"
        urlPrefix={URL_PREFIX}
        breadcrumbList={BREADCRUMB_LIST.concat({
          title: '单位设备信息',
          name: '单位设备信息',
        })}
        {...props}
      />
    );
  }
}
