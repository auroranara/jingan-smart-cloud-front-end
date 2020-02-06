import React, { Component } from 'react';
import { Input, Button, Card, Popconfirm, message } from 'antd';
import UnconnectedListPage from '@/templates/UnconnectedListPage';
import Ellipsis from '@/components/Ellipsis';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import ImagePreview from '@/jingan-components/ImagePreview';
import Link from 'umi/link';
import { connect } from 'dva';
import router from 'umi/router';
import { LIST_URL, ADD_URL, DETAIL_URL, EDIT_URL, EmptyData, STATUSES } from '..';
import styles from '../index.less';

const { Meta } = Card;
const GET_API = 'licensePlateRecognitionSystem/getVehicleList';
const RELOAD_API = 'licensePlateRecognitionSystem/reloadVehicleList';
const DELETE_API = 'licensePlateRecognitionSystem/deleteVehicle';
const FIELDS = [
  {
    id: 'name',
    transform: v => v.trim(),
    render: ({ onSearch }) => (
      <Input placeholder="请输入所属单位" maxLength={50} onPressEnter={onSearch} />
    ),
  },
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
const preventDefault = e => e.preventDefault();

@connect(
  ({ licensePlateRecognitionSystem, loading }) => ({
    licensePlateRecognitionSystem,
    loading: loading.effects[GET_API],
  }),
  dispatch => ({
    getVehicleList(payload, callback) {
      dispatch({
        type: GET_API,
        payload,
        callback: (success, data) => {
          if (!success) {
            message.error('获取列表失败，请稍候重试！');
          }
          callback && callback(success, data);
        },
      });
    },
    reloadVehicleList(payload, callback) {
      dispatch({
        type: RELOAD_API,
        payload,
        callback: (success, data) => {
          if (!success) {
            message.error('刷新列表失败，请稍候重试！');
          }
          callback && callback(success, data);
        },
      });
    },
    deleteVehicle(payload, callback) {
      dispatch({
        type: DELETE_API,
        payload,
        callback: (success, data) => {
          if (success) {
            message.success('删除成功！');
          } else {
            message.error('删除失败，请稍候重试！');
          }
          callback && callback(success, data);
        },
      });
    },
  })
)
export default class Vehicle extends Component {
  state = {
    images: null,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.licensePlateRecognitionSystem !== this.props.licensePlateRecognitionSystem ||
      nextProps.loading !== this.props.loading ||
      nextState !== this.state
    );
  }
  setPageReference = page => {
    this.page = page;
  };

  handleAddButtonClick = () => {
    const { isUnit, unitId } = this.props;
    router.push(`${ADD_URL}${isUnit ? '' : `/${unitId}`}`);
  };

  handleDeleteButtonClick = id => {
    this.page.reload((payload, callback) => {
      const { deleteVehicle, reloadVehicleList } = this.props;
      deleteVehicle({ id }, success => {
        if (success) {
          reloadVehicleList(payload, callback);
        } else {
          callback();
        }
      });
    });
  };

  renderItem = ({
    id,
    licencePlate = '苏B1234',
    brand,
    model,
    name,
    phone,
    status = '1',
    image = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
  }) => {
    const { hasDetailAuthority, hasEditAuthority, hasDeleteAuthority } = this.props;
    return (
      <Card
        className={styles.card}
        actions={[
          <Link
            to={`${DETAIL_URL}/${id}`}
            disabled={!hasDetailAuthority}
            target="_blank"
            onClick={hasDetailAuthority ? undefined : preventDefault}
          >
            查看
          </Link>,
          <Link
            to={`${EDIT_URL}/${id}`}
            disabled={!hasEditAuthority}
            target="_blank"
            onClick={hasEditAuthority ? undefined : preventDefault}
          >
            编辑
          </Link>,
          hasDeleteAuthority ? (
            <Popconfirm title="您确定要删除吗？" onConfirm={() => this.handleDeleteButtonClick(id)}>
              <Link to="" onClick={preventDefault}>
                删除
              </Link>
            </Popconfirm>
          ) : (
            <Link to="" disabled onClick={preventDefault}>
              删除
            </Link>
          ),
        ]}
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
    const {
      isUnit,
      hasAddAuthority,
      licensePlateRecognitionSystem: { vehicleList },
      loading,
      getVehicleList,
    } = this.props;
    const { images } = this.state;
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '车辆管理', name: '车辆管理', href: isUnit ? undefined : LIST_URL },
      { title: '车辆基本信息', name: '车辆基本信息' },
    ];

    return (
      <UnconnectedListPage
        pageHeaderProps={{
          breadcrumbList,
          content: (
            <span>
              车辆总数：
              {0}
            </span>
          ),
        }}
        formProps={{
          fields: FIELDS,
          action: (
            <Button type="primary" onClick={this.handleAddButtonClick} disabled={!hasAddAuthority}>
              新增车辆
            </Button>
          ),
        }}
        listProps={{
          list: vehicleList,
          loading,
          getList: getVehicleList,
          renderItem: this.renderItem,
        }}
        ref={this.setPageReference}
      >
        <ImagePreview images={images} />
      </UnconnectedListPage>
    );
  }
}
