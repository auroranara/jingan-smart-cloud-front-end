import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import moment from 'moment';

import { Form, Card } from 'antd';
import { routerRedux } from 'dva/router';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import Lightbox from 'react-images';
import styles from './FloorManagement.less';

const { Description } = DescriptionList;

/* 标题*/
const title = '楼层详情';

/* 表单标签 */
const fieldLabels = {
  floorName: '楼层名称',
  floorNumber: '楼层编号',
  floorUrl: '楼层平面图',
};

/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

@connect(({ buildingsInfo, loading }) => ({
  buildingsInfo,
  loading: loading.models.buildingsInfo,
}))
@Form.create()
export default class FloorManagementDetail extends PureComponent {
  state = {
    magIndex: 0,
    showImg: false,
    visible: false,
    imgUrl: [], // 附件图片列表
    currentImage: 0, // 展示附件大图下标
  };

  /* 挂载后 */
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;

    // 获取详情
    dispatch({
      type: 'buildingsInfo/fetchFloorList',
      payload: {
        floorId: id,
        pageSize: 10,
        pageNum: 1,
      },
    });
  }

  // 跳转到列表页面
  goToList = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/data-analysis/maintenance-record/list`));
  };

  // 查看图片
  handleClickImg = (i, files) => {
    const newFiles = files.map(({ webUrl }) => {
      return {
        src: webUrl,
      };
    });
    this.setState({
      visible: true,
      imgUrl: newFiles,
      currentImage: i,
    });
  };

  // 关闭查看图片弹窗
  handleModalClose = () => {
    this.setState({
      visible: false,
    });
  };

  // 图片的点击翻入上一页
  gotoPrevious = () => {
    let { currentImage } = this.state;
    if (currentImage <= 0) return;
    this.setState({ currentImage: --currentImage });
  };

  // 图片的点击翻入下一页
  gotoNext = () => {
    let { currentImage, imgUrl } = this.state;
    if (currentImage >= imgUrl.length - 1) return;
    this.setState({ currentImage: ++currentImage });
  };

  // 图片点击下方缩略图
  handleClickThumbnail = i => {
    const { currentImage } = this.state;
    if (currentImage === i) return;
    this.setState({ currentImage: i });
  };

  /* 渲染详情*/
  renderDetail() {
    const {
      match: {
        params: { id },
      },
      buildingsInfo: {
        floorData: { list },
      },
    } = this.props;

    const { visible, imgUrl, currentImage } = this.state;

    const floorDetail = list.find(d => d.id === id) || {};

    const { floorName, floorNumber, floorWebUrl = [] } = floorDetail;

    const imgs = floorWebUrl.map(({ webUrl }, i) => (
      <div
        key={i}
        className={styles.imgSection}
        style={{
          backgroundImage: `url(${webUrl})`,
          backgroundSize: '100% 100%',
        }}
        onClick={() => this.handleClickImg(i, floorWebUrl)}
      />
    ));

    return (
      <Card className={styles.card} bordered={false}>
        <DescriptionList col={1}>
          <Description term={fieldLabels.floorName}>{floorName || getEmptyData()}</Description>
          <Description term={fieldLabels.floorNumber}>{floorNumber || getEmptyData()}</Description>
          <Description term={fieldLabels.floorUrl} style={{ width: '100%' }}>
            {imgs}
          </Description>
        </DescriptionList>

        <Lightbox
          images={imgUrl}
          isOpen={visible}
          currentImage={currentImage}
          onClickPrev={this.gotoPrevious}
          onClickNext={this.gotoNext}
          onClose={this.handleModalClose}
          showThumbnails
          onClickThumbnail={this.handleClickThumbnail}
          imageCountSeparator="/"
        />
      </Card>
    );
  }

  render() {
    const {
      location: {
        query: { buildingId, companyId, name: companyName },
      },
    } = this.props;
    console.log('this.propsthis.props', this.props);
    /* 面包屑*/
    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '人员定位',
        name: '人员定位',
      },
      {
        title: '楼层管理列表',
        name: '楼层管理列表',
        href: `/personnel-position/buildings-info/floor/list/${buildingId}?companyId=${companyId}&&name=${companyName}`,
      },
      {
        title,
        name: '楼层详情',
      },
    ];
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderDetail()}
      </PageHeaderLayout>
    );
  }
}
