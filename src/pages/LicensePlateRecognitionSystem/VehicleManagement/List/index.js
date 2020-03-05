import React, { Component } from 'react';
import { Input } from 'antd';
import TablePage from '@/templates/TablePage';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import ImagePreview from '@/jingan-components/ImagePreview';
import Company from '../../Company';
import { connect } from 'dva';
import styles from './index.less';

export const STATUSES = [
  { key: '0', value: '有效' },
  { key: '-1', value: '未生效' },
  { key: '1', value: '已过期' },
];
export const VEHICLE_TYPES = [{ key: '0', value: '小车' }, { key: '1', value: '大车' }];
export const LICENCE_PLATE_TYPES = [{ key: '4', value: '固定车' }, { key: '0', value: '临时车' }];
export const BREADCRUMB_LIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '人员在岗在位管理', name: '人员在岗在位管理' },
  { title: '车牌识别系统', name: '车牌识别系统' },
  { title: '车辆管理', name: '车辆管理' },
];
const MAPPER = {
  namespace: 'licensePlateRecognitionSystem',
  list: 'vehicleList',
  getList: 'getVehicleList',
  remove: 'deleteVehicle',
  reloadList: 'reloadVehicleList',
};
const COMPANY_MAPPER = {
  namespace: 'licensePlateRecognitionSystem',
  list: 'vehicleCompanyList',
  getList: 'getVehicleCompanyList',
};

@connect(({ user }) => ({
  user,
}))
export default class ParkList extends Component {
  state = {
    images: null,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.match.params.unitId !== this.props.match.params.unitId || nextState !== this.state
    );
  }

  transform = ({ unitId, ...props }) => ({
    companyId: unitId,
    ...props,
  });

  getBreadcrumbList = ({ isUnit }) =>
    BREADCRUMB_LIST.concat(
      [
        !isUnit && {
          title: '单位车辆信息',
          name: '单位车辆信息',
          href: this.props.route.path.replace(/\/:[^\/]*/g, ''),
        },
        { title: '车辆信息', name: '车辆信息' },
      ].filter(v => v)
    );

  getContent = ({ list: { pagination: { total } = {} } = {} }) => (
    <span>
      车辆总数：
      {total || 0}
    </span>
  );

  getFields = () => [
    {
      id: 'queryCompanyName',
      transform: v => v.trim(),
      render: ({ onSearch }) => (
        <Input placeholder="请输入所属单位" maxLength={50} onPressEnter={onSearch} />
      ),
    },
    {
      id: 'carNumber',
      transform: v => v.trim(),
      render: ({ onSearch }) => (
        <Input placeholder="请输入车牌号" maxLength={50} onPressEnter={onSearch} />
      ),
    },
    {
      id: 'cardType',
      render: () => (
        <SelectOrSpan placeholder="请选择车牌类型" list={LICENCE_PLATE_TYPES} allowClear />
      ),
    },
    {
      id: 'status',
      render: () => <SelectOrSpan placeholder="请选择状态" list={STATUSES} allowClear />,
    },
  ];

  getAction = ({ renderAddButton }) => renderAddButton({ name: '新增车辆' });

  getColumns = ({ list, renderDetailButton, renderEditButton, renderDeleteButton }) => [
    {
      title: '所属单位',
      dataIndex: '所属单位',
      align: 'center',
      render: (_, { ownerType, ownerCompanyName }) => (+ownerType ? ownerCompanyName : '本单位'),
    },
    {
      title: '车牌号',
      dataIndex: 'carNumber',
      align: 'center',
    },
    {
      title: '品牌',
      dataIndex: 'brand',
      align: 'center',
    },
    {
      title: '型号',
      dataIndex: 'model',
      align: 'center',
    },
    {
      title: '驾驶员',
      dataIndex: 'driver',
      align: 'center',
    },
    {
      title: '联系电话',
      dataIndex: 'driverTel',
      align: 'center',
    },
    // {
    //   title: '定位卡号',
    //   dataIndex: 'locationCardCode',
    //   align: 'center',
    // },
    {
      title: '车牌类型',
      dataIndex: 'cardType',
      align: 'center',
      render: value => <SelectOrSpan list={STATUSES} value={`${value}`} type="span" />,
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      render: value => <SelectOrSpan list={STATUSES} value={`${value}`} type="span" />,
    },
    {
      title: '车辆照片',
      dataIndex: 'carPhotoList',
      align: 'center',
      render: value =>
        value &&
        value.length > 0 && (
          <img
            className={styles.img}
            src={value[0].webUrl}
            alt={value[0].fileName}
            onClick={() => this.setState({ images: value.map(({ webUrl }) => webUrl) })}
          />
        ),
    },
    {
      title: '操作',
      dataIndex: '操作',
      align: 'center',
      width: 148,
      fixed: list && list.length ? 'right' : undefined,
      render: (_, data) => (
        <div className={styles.buttonWrapper}>
          {renderDetailButton(data)}
          {renderEditButton(data)}
          {renderDeleteButton(data)}
        </div>
      ),
    },
  ];

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
    const { images } = this.state;
    const props = {
      route,
      location,
      match,
    };

    return unitType === 4 || unitId ? (
      <TablePage
        key={unitId}
        breadcrumbList={this.getBreadcrumbList}
        content={this.getContent}
        fields={this.getFields}
        action={this.getAction}
        columns={this.getColumns}
        transform={this.transform}
        mapper={MAPPER}
        showTotal={false}
        withUnitId
        {...props}
      >
        <ImagePreview images={images} />
      </TablePage>
    ) : (
      <Company
        name="车辆"
        breadcrumbList={BREADCRUMB_LIST.concat({
          title: '单位车辆信息',
          name: '单位车辆信息',
        })}
        mapper={COMPANY_MAPPER}
        {...props}
      />
    );
  }
}
