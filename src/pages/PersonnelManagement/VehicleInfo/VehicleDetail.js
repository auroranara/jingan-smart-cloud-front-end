import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Button } from 'antd';
import { routerRedux } from 'dva/router';

import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import { hasAuthority } from '@/utils/customAuth';
import codes from '@/utils/codes';
import moment from 'moment';
import styles from '../PersonnelInfo/PersonnelList.less';

const { Description } = DescriptionList;

// 标题
const title = '查看车辆信息';

// 获取code
const {
  personnelManagement: {
    vehicleInfo: { edit: editCode },
  },
} = codes;

const stateList = {
  1: '正常',
  2: '停用',
};

// 获取无数据
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

@connect(({ personnelInfo, user, loading }) => ({
  personnelInfo,
  user,
  loading: loading.models.personnelInfo,
}))
@Form.create()
export default class VehicleDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      uploadPic: [], // 上传的照片
      detailList: {}, // 当前详情列表
      showImg: false,
      picList: [],
    };
  }

  /* 生命周期函数 */
  componentDidMount() {
    const {
      match: {
        params: { id },
      },
      dispatch,
      location: {
        query: { listId },
      },
    } = this.props;
    dispatch({
      type: 'personnelInfo/fetchVehicleInfoList',
      payload: {
        pageSize: 18,
        pageNum: 1,
        companyId: listId,
      },
      callback: res => {
        const { list } = res;
        const currentList = list.find(item => item.id === id) || {};
        const { photoDetails } = currentList;
        this.setState({
          uploadPic: photoDetails,
          detailList: currentList,
        });
      },
    });
  }

  // 返回
  goBack = () => {
    const {
      dispatch,
      location: {
        query: { listId },
      },
    } = this.props;
    dispatch(routerRedux.push(`/personnel-management/vehicle-info/vehicle-list/${listId}`));
  };

  // 编辑
  goToEdit = () => {
    const {
      match: {
        params: { id },
      },
      location: {
        query: { listId },
      },
      dispatch,
    } = this.props;
    dispatch(
      routerRedux.push(`/personnel-management/vehicle-info/vehicle-edit/${id}?listId=${listId}`)
    );
  };

  handleMorePic = picList => {
    this.setState({ showImg: true, picList: picList });
  };

  handleCloseImg = () => {
    this.setState({ showImg: false });
  };

  /* 渲染详情 */
  renderDetail() {
    const {
      user: {
        currentUser: { permissionCodes },
      },
    } = this.props;

    const { detailList, uploadPic } = this.state;
    const {
      number,
      brand,
      model,
      type,
      produceDate,
      buyDate,
      load,
      carCompany,
      driver,
      driverTel,
      supercargo,
      supercargoTel,
      state,
    } = detailList;

    // 是否有编辑权限
    const editAuth = hasAuthority(editCode, permissionCodes);

    return (
      <Card title="车辆信息详情" bordered={false} className={styles.cardDetail}>
        <DescriptionList col={3} style={{ marginBottom: 16 }}>
          <Description term="车牌号">{number || getEmptyData()}</Description>
          <Description term="品牌">{brand || getEmptyData()}</Description>
          <Description term="型号">{model || getEmptyData()}</Description>
          <Description term="车辆类型">{type || getEmptyData()}</Description>
          <Description term="生产日期">
            {produceDate ? moment(produceDate).format('YYYY-MM-DD') : getEmptyData()}
          </Description>
          <Description term="购买日期">
            {buyDate ? moment(buyDate).format('YYYY-MM-DD') : getEmptyData()}
          </Description>
          <Description term="载重">{load || getEmptyData()}</Description>
          <Description term="所属公司">{carCompany || getEmptyData()}</Description>
          <Description term="驾驶员">{driver || getEmptyData()}</Description>
          <Description term="联系电话">{driverTel || getEmptyData()}</Description>
          <Description term="押运员">{supercargo || getEmptyData()}</Description>
          <Description term="联系电话">{supercargoTel || getEmptyData()}</Description>
          <Description term="当前状态">{stateList[state] || getEmptyData()}</Description>
        </DescriptionList>
        <DescriptionList col={3} style={{ marginBottom: 16 }}>
          <Description term="车辆照片">
            {uploadPic.length > 0 ? (
              <div
                onClick={() => this.handleMorePic(uploadPic)}
                className={styles.imgSection}
                style={{
                  backgroundImage: `url(${uploadPic.map(item => item.webUrl).join('')})`,
                  backgroundSize: 'cover',
                }}
              />
            ) : (
              getEmptyData()
            )}
          </Description>
        </DescriptionList>
        <div style={{ textAlign: 'center' }}>
          <Button onClick={this.goBack} style={{ marginRight: '24px' }}>
            返回
          </Button>
          <Button type="primary" disabled={!editAuth} onClick={this.goToEdit}>
            编辑
          </Button>
        </div>
      </Card>
    );
  }

  render() {
    const {
      location: {
        query: { listId },
      },
    } = this.props;

    const { showImg, picList } = this.state;

    // 面包屑
    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '人员在岗在位管理',
        name: '人员在岗在位管理',
      },
      {
        title: '车辆基本信息',
        name: '车辆基本信息',
        href: `/personnel-management/vehicle-info/vehicle-list/${listId}`,
      },
      {
        title,
        name: title,
      },
    ];
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderDetail()}
        <div
          className={styles.magnify}
          onClick={this.handleCloseImg}
          style={{ display: showImg ? 'block' : 'none' }}
        >
          <LegacyIcon type="close" onClick={this.handleCloseImg} className={styles.iconClose} />
          <img
            className={styles.imgStyle}
            src={picList.map(item => item.webUrl).join('')}
            alt="照片"
            onClick={e => e.stopPropagation()}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
