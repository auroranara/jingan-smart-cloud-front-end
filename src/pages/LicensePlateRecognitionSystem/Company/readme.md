```javascript
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

export const URL_PREFIX = '/license-plate-recognition-system/vehicle-management/index';
export const STATUSES = [{ key: '1', value: '正常' }, { key: '0', value: '停用' }];
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

  getBreadcrumbList = ({ isUnit }) =>
    BREADCRUMB_LIST.concat(
      [
        !isUnit && { title: '单位车辆信息', name: '单位车辆信息', href: `${URL_PREFIX}/list` },
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
      id: 'number',
      transform: v => v.trim(),
      render: ({ onSearch }) => (
        <Input placeholder="请输入车牌号" maxLength={50} onPressEnter={onSearch} />
      ),
    },
    {
      id: 'status',
      render: () => <SelectOrSpan placeholder="请选择状态" list={STATUSES} />,
    },
  ];

  getAction = ({ renderAddButton }) => renderAddButton({ name: '新增车辆' });

  renderItem = (
    {
      id,
      licencePlate = '苏B1234',
      brand,
      model,
      name,
      phone,
      status = '1',
      image = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    },
    { renderDetailButton, renderEditButton, renderDeleteButton }
  ) => {
    return (
      <Card
        className={styles.card}
        actions={[renderDetailButton(id), renderEditButton(id), renderDeleteButton(id)]}
        hoverable
      >
        <Meta
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
              {licencePlate}
            </Ellipsis>
          }
          description={
            <div className={styles.cardContent}>
              <div className={styles.cardRow}>
                <div>品牌：</div>
                <div>
                  {brand ? (
                    <Ellipsis lines={1} tooltip>
                      {brand}
                    </Ellipsis>
                  ) : (
                    <EmptyData />
                  )}
                </div>
              </div>
              <div className={styles.cardRow}>
                <div>型号：</div>
                <div>
                  {model ? (
                    <Ellipsis lines={1} tooltip>
                      {model}
                    </Ellipsis>
                  ) : (
                    <EmptyData />
                  )}
                </div>
              </div>
              <div className={styles.cardRow}>
                <div>驾驶员：</div>
                <div>
                  {name ? (
                    <Ellipsis lines={1} tooltip>
                      {name}
                    </Ellipsis>
                  ) : (
                    <EmptyData />
                  )}
                </div>
              </div>
              <div className={styles.cardRow}>
                <div>联系电话：</div>
                <div>
                  {phone ? (
                    <Ellipsis lines={1} tooltip>
                      {phone}
                    </Ellipsis>
                  ) : (
                    <EmptyData />
                  )}
                </div>
              </div>
            </div>
          }
        />
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
        breadcrumbList={this.getBreadcrumbList}
        content={this.getContent}
        fields={this.getFields}
        action={this.getAction}
        renderItem={this.renderItem}
        mapper={MAPPER}
        {...props}
      >
        <ImagePreview images={images} />
      </ListPage>
    ) : (
      <Company
        name="车辆"
        urlPrefix={URL_PREFIX}
        breadcrumbList={BREADCRUMB_LIST.concat({
          title: '单位车辆信息',
          name: '单位车辆信息',
        })}
        {...props}
      />
    );
  }
}

```
