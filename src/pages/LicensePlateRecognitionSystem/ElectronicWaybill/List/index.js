import React, { Component } from 'react';
import { Input } from 'antd';
import TablePage from '@/templates/TablePage';
import CustomUpload from '@/jingan-components/CustomUpload';
import Company from '../../Company';
import { connect } from 'dva';
import styles from './index.less';

export const BREADCRUMB_LIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '人员在岗在位管理', name: '人员在岗在位管理' },
  { title: '车牌识别系统', name: '车牌识别系统' },
];
const MAPPER = {
  namespace: 'licensePlateRecognitionSystem',
  list: 'electronicWaybillList',
  getList: 'getElectronicWaybillList',
  remove: 'deleteElectronicWaybill',
};
const COMPANY_MAPPER = {
  namespace: 'licensePlateRecognitionSystem',
  list: 'electronicWaybillCompanyList',
  getList: 'getElectronicWaybillCompanyList',
};

@connect(({ user }) => ({
  user,
}))
export default class ElectronicWaybillList extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.match.params.unitId !== this.props.match.params.unitId;
  }

  transform = ({ unitId, ...props }) => ({
    companyId: unitId,
    ...props,
  });

  getBreadcrumbList = ({ isUnit }) =>
    BREADCRUMB_LIST.concat(
      [
        !isUnit && {
          title: '单位电子运单管理',
          name: '单位电子运单管理',
          href: this.props.route.path.replace(/\/:[^\/]*/g, ''),
        },
        { title: '电子运单管理', name: '电子运单管理' },
      ].filter(v => v)
    );

  getContent = ({ list: { pagination: { total } = {} } = {} }) => (
    <span>
      总数：
      {total || 0}
    </span>
  );

  getFields = () => [
    {
      id: 'queryCompanyName',
      transform: v => v.trim(),
      render: ({ onSearch }) => (
        <Input placeholder="请输入运输公司名称" maxLength={50} onPressEnter={onSearch} />
      ),
    },
  ];

  getAction = ({ renderAddButton }) => renderAddButton({ name: '新增电子运单' });

  getColumns = ({ list, renderDetailButton, renderEditButton, renderDeleteButton }) => [
    {
      title: '运单编号',
      dataIndex: 'waybillCode',
      align: 'center',
    },
    {
      title: '运输公司名称',
      dataIndex: '运输公司名称',
      align: 'center',
      render: (_, { ownerType, transitCompanyName }) =>
        +ownerType ? transitCompanyName : '本单位',
    },
    {
      title: '运输车辆',
      dataIndex: '运输车辆',
      align: 'center',
      render: (_, { carNumber }) => (
        <div className={styles.fieldWrapper}>
          <div className={styles.fieldName}>车牌号：</div>
          <div className={styles.fieldValue}>{carNumber}</div>
        </div>
      ),
    },
    {
      title: '驾驶员',
      dataIndex: '驾驶员',
      align: 'center',
      render: (_, { driver, driverTel, driverPhotoList }) => (
        <div className={styles.fieldContainer}>
          <div className={styles.fieldWrapper}>
            <div className={styles.fieldValue}>{driver}</div>
          </div>
          <div className={styles.fieldWrapper}>
            <div className={styles.fieldName}>联系方式：</div>
            <div className={styles.fieldValue}>{driverTel}</div>
          </div>
          <div className={styles.fieldWrapper}>
            <div className={styles.fieldName}>证照附件：</div>
            <div className={styles.fieldValue}>
              <CustomUpload style={{ padding: 0 }} value={driverPhotoList} type="span" />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '押运员',
      dataIndex: '押运员',
      align: 'center',
      render: (_, { supercargo, supercargoTel, supercargoPhotoList }) =>
        supercargo && (
          <div className={styles.fieldContainer}>
            <div className={styles.fieldWrapper}>
              <div className={styles.fieldValue}>{supercargo}</div>
            </div>
            <div className={styles.fieldWrapper}>
              <div className={styles.fieldName}>联系方式：</div>
              <div className={styles.fieldValue}>{supercargoTel}</div>
            </div>
            <div className={styles.fieldWrapper}>
              <div className={styles.fieldName}>证照附件：</div>
              <div className={styles.fieldValue}>
                <CustomUpload style={{ padding: 0 }} value={supercargoPhotoList} type="span" />
              </div>
            </div>
          </div>
        ),
    },
    {
      title: '纸质附件',
      dataIndex: 'fileList',
      align: 'center',
      render: value => <CustomUpload value={value} type="span" />,
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
      />
    ) : (
      <Company
        name="电子运单"
        breadcrumbList={BREADCRUMB_LIST.concat({
          title: '单位电子运单管理',
          name: '单位电子运单管理',
        })}
        mapper={COMPANY_MAPPER}
        {...props}
      />
    );
  }
}
