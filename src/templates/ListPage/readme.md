## 说明

content 页面头部内容
error=true 接口报错时是否提示
fields 控件栏配置对象
action 控件栏其余按钮
columns 表格配置对象
transform 转换控件值以后作为接口参数
withUnitId 是否将unitId作为参数传入getList接口
otherOperation 其他操作按钮

## 示例

```javascript
import React, { Component } from 'react';
import { Input, Card } from 'antd';
import ListPage from '@/templates/ListPage';
import Ellipsis from '@/components/Ellipsis';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import ImagePreview from '@/jingan-components/ImagePreview';
import { BREADCRUMB_LIST, URL_PREFIX, EmptyData, STATUSES } from '..';
import styles from '../index.less';

const { Meta } = Card;
const MAPPER = {
  namespace: 'licensePlateRecognitionSystem',
  list: 'vehicleList',
  getList: 'getVehicleList',
  remove: 'deleteVehicle',
  reloadList: 'reloadVehicleList',
};

export default class Vehicle extends Component {
  state = {
    images: null,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return nextState !== this.state;
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
      {total}
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
            <Ellipsis className={styles.ellipsis} style={{ fontWeight: 'bold' }} lines={1} tooltip>
              {licencePlate}
            </Ellipsis>
          }
          description={
            <div
              className={styles.cardContent}
              style={{ paddingRight: 0, color: 'rgba(0, 0, 0, 0.65)' }}
            >
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
    const { images } = this.state;

    return (
      <ListPage
        breadcrumbList={this.getBreadcrumbList}
        content={this.getContent}
        fields={this.getFields}
        action={this.getAction}
        renderItem={this.renderItem}
        mapper={MAPPER}
        {...this.props}
      >
        <ImagePreview images={images} />
      </ListPage>
    );
  }
}

```
