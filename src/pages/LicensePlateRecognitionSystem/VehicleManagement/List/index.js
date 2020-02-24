import React, { Component } from 'react';
import { Input, Card } from 'antd';
import ListPage from '@/templates/ListPage';
import Ellipsis from '@/components/Ellipsis';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import ImagePreview from '@/jingan-components/ImagePreview';
import EmptyData from '@/jingan-components/EmptyData';
import Company from '../../Company';
import { connect } from 'dva';
import styles from './index.less';
const { Meta } = Card;

export const STATUSES = [{ key: '1', value: '正常' }, { key: '0', value: '停用' }];
export const VEHICLE_TYPES = [{ key: '0', value: '小车' }, { key: '1', value: '大车' }];
export const LICENCE_PLATE_TYPES = [
  { key: '0', value: '临时车' },
  { key: '1', value: '月租车' },
  { key: '2', value: '充值车' },
  { key: '3', value: '贵宾车' },
  { key: '4', value: '免费车' },
  { key: '8', value: '收费月租车' },
];
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
export default class VehicleList extends Component {
  state = {
    images: null,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.match.params.unitId !== this.props.match.params.unitId || nextState !== this.state
    );
  }

  transform = ({ unitId, ...props }) => ({
    companyId: unitId, // 这个接接口时重点关注一下
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
    // {
    //   id: 'name',
    //   transform: v => v.trim(),
    //   render: ({ onSearch }) => (
    //     <Input placeholder="请输入所属单位" maxLength={50} onPressEnter={onSearch} />
    //   ),
    // },
    {
      id: 'carNumber',
      transform: v => v.trim(),
      render: ({ onSearch }) => (
        <Input placeholder="请输入车牌号" maxLength={50} onPressEnter={onSearch} />
      ),
    },
    {
      id: 'status',
      render: () => <SelectOrSpan placeholder="请选择状态" list={STATUSES} allowClear />,
    },
  ];

  // getAction = ({ renderAddButton }) => renderAddButton({ name: '新增车辆' });

  renderItem = (
    { id, carNumber, carType, cardType, carUserName, carUserTel, status },
    { renderDetailButton, renderEditButton, renderDeleteButton }
  ) => {
    const vehicleType = (VEHICLE_TYPES.find(({ key }) => key === `${carType}`) || {}).value;
    const licensePlateType = (LICENCE_PLATE_TYPES.find(({ key }) => key === `${cardType}`) || {})
      .value;
    return (
      <Card
        title={
          <Ellipsis className={styles.ellipsis} lines={1} tooltip>
            {carNumber}
          </Ellipsis>
        }
        className={styles.card}
        // actions={[renderDetailButton(id), renderEditButton(id), renderDeleteButton(id)]}
        hoverable
      >
        {/* <Meta
          avatar={
            <img
              className={styles.avatar}
              src={image}
              alt=""
              onClick={() => this.setState({ images: [image] })}
            />
          }
          title={
            <Ellipsis className={styles.ellipsis} lines={1} tooltip>
              {carNumber}
            </Ellipsis>
          }
          description={
            <div className={styles.cardContent}>
              <div className={styles.cardRow}>
                <div>车辆类型：</div>
                <div>
                  {vehicleType ? (
                    <Ellipsis lines={1} tooltip>
                      {vehicleType}
                    </Ellipsis>
                  ) : (
                    <EmptyData />
                  )}
                </div>
              </div>
              <div className={styles.cardRow}>
                <div>车牌类型：</div>
                <div>
                  {licensePlateType ? (
                    <Ellipsis lines={1} tooltip>
                      {licensePlateType}
                    </Ellipsis>
                  ) : (
                    <EmptyData />
                  )}
                </div>
              </div>
              <div className={styles.cardRow}>
                <div>驾驶员：</div>
                <div>
                  {carUserName ? (
                    <Ellipsis lines={1} tooltip>
                      {carUserName}
                    </Ellipsis>
                  ) : (
                    <EmptyData />
                  )}
                </div>
              </div>
              <div className={styles.cardRow}>
                <div>联系电话：</div>
                <div>
                  {carUserTel ? (
                    <Ellipsis lines={1} tooltip>
                      {carUserTel}
                    </Ellipsis>
                  ) : (
                    <EmptyData />
                  )}
                </div>
              </div>
            </div>
          }
        /> */}
        <div className={styles.cardContent}>
          <div className={styles.cardRow}>
            <div>车辆类型：</div>
            <div>
              {vehicleType ? (
                <Ellipsis lines={1} tooltip>
                  {vehicleType}
                </Ellipsis>
              ) : (
                <EmptyData />
              )}
            </div>
          </div>
          <div className={styles.cardRow}>
            <div>车牌类型：</div>
            <div>
              {licensePlateType ? (
                <Ellipsis lines={1} tooltip>
                  {licensePlateType}
                </Ellipsis>
              ) : (
                <EmptyData />
              )}
            </div>
          </div>
          <div className={styles.cardRow}>
            <div>驾驶员：</div>
            <div>
              {carUserName ? (
                <Ellipsis lines={1} tooltip>
                  {carUserName}
                </Ellipsis>
              ) : (
                <EmptyData />
              )}
            </div>
          </div>
          <div className={styles.cardRow}>
            <div>联系电话：</div>
            <div>
              {carUserTel ? (
                <Ellipsis lines={1} tooltip>
                  {carUserTel}
                </Ellipsis>
              ) : (
                <EmptyData />
              )}
            </div>
          </div>
        </div>
        <SelectOrSpan
          className={styles.statusLabel}
          style={{ backgroundColor: status > 0 ? '#1890ff' : '#d9d9d9' }}
          type="span"
          list={STATUSES}
          value={`${status}`}
        />
      </Card>
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
    const { images } = this.state;
    const props = {
      route,
      location,
      match,
    };

    return unitType === 4 || unitId ? (
      <ListPage
        key={unitId}
        breadcrumbList={this.getBreadcrumbList}
        content={this.getContent}
        fields={this.getFields}
        action={this.getAction}
        renderItem={this.renderItem}
        mapper={MAPPER}
        withUnitId
        {...props}
      >
        <ImagePreview images={images} />
      </ListPage>
    ) : (
      <Company
        name="车辆"
        breadcrumbList={BREADCRUMB_LIST.concat({
          title: '单位车辆信息',
          name: '单位车辆信息',
        })}
        mapper={COMPANY_MAPPER}
        addEnable={false}
        {...props}
      />
    );
  }
}
