import React, { PureComponent, Fragment } from 'react';
import { Select } from 'antd';
import moment from 'moment';
import { Marker } from 'react-leaflet';
import ImageDraw, { L } from '@/components/ImageDraw';
import VideoPlay from '../../FireControl/section/VideoPlay.js';

// import newPointNormal from '@/assets/new-point-normal.png';
// import newPointAbnormal from '@/assets/new-point-abnormal.png';
import newVideo from '@/assets/new-video2.png';
// import newLegendVideo from '@/assets/new-legend-video2.png';
// import newLegendPoint from '@/assets/new-legend-point.png';
// import newLegendAbnormal from '@/assets/new-legend-abnormal.png';
import ponit from '../imgs/ponit.png';
import pointDot from '../imgs/pointDot.png';
import videoDot from '../imgs/videoDot.png';

import styles from './index.less';

const { Option } = Select;

/**
 * description: 点位巡查统计
 * author: sunkai
 * date: 2018年12月03日
 */
export default class FourColor extends PureComponent {
  state = {
    videoVisible: false,
    videoKeyId: '',
    data: [],
    // 当前选中的四色图
    selectedFourColorImg: {},
    // 当前图上的points源数据
    points: [],
  };

  componentDidUpdate({
    model: {
      companyMessage: prevCompanyMessage,
      firePoint: prevFirePoint,
      videoFireList: prevVideoFireList,
    },
    latestHiddenDangerId: prevLatestHiddenDangerId,
  }) {
    const {
      model: { companyMessage, firePoint, videoFireList },
      latestHiddenDangerId,
    } = this.props;
    // 当四色图或数据源发生变化，重置state中的data
    if (
      companyMessage !== prevCompanyMessage ||
      firePoint !== prevFirePoint ||
      videoFireList !== prevVideoFireList
    ) {
      // 初始化选中第一张图
      const { fireIchnographyUrl = [] } = companyMessage;
      this.setSelectedFourColorImg(fireIchnographyUrl[0]);
    }
    if (latestHiddenDangerId !== prevLatestHiddenDangerId) {
      // 找到对应的点位
      const point = firePoint.find(({ item_id }) => item_id === latestHiddenDangerId);
      if (point) {
        // 找到对应的图片
        const { fix_fire_id } = point;
        const { fireIchnographyUrl = [] } = companyMessage;
        const image = fireIchnographyUrl.find(({ id }) => id === fix_fire_id);
        const { selectedFourColorImg } = this.state;
        if (image !== selectedFourColorImg) {
          this.setSelectedFourColorImg(image);
        }
      }
    }
  }

  /**
   * 设置选中的四色图并筛选出对应的点位和视频
   */
  setSelectedFourColorImg = (selectedFourColorImg = {}) => {
    const { id } = selectedFourColorImg;
    const {
      model: { firePoint = [], videoFireList = [] },
    } = this.props;
    // 更新选中的四色图和对应视频列表
    const points = firePoint
      .filter(({ fix_fire_id }) => fix_fire_id && fix_fire_id === id)
      .map(item => ({
        ...item,
        type: 'marker',
        name: item.object_title,
        latlng: { lat: 1 - item.y_fire, lng: +item.x_fire },
        render: this.renderPoint,
      }));
    const videos = videoFireList
      .filter(({ fix_fire_id }) => fix_fire_id && fix_fire_id === id)
      .map(item => ({
        ...item,
        type: 'marker',
        name: item.name,
        latlng: { lat: 1 - item.y_fire, lng: +item.x_fire },
        render: this.renderVideo,
      }));
    this.setState({
      points,
      data: [...points, ...videos],
      selectedFourColorImg,
    });
  };

  handleShowVideo = videoKeyId => {
    this.setState({ videoVisible: true, videoKeyId });
  };

  handleHideVideo = () => {
    this.setState({ videoVisible: false });
  };

  handleClickMarker = ({ target: layer }) => {
    const {
      options: {
        data: { render, item_id, status, object_title, key_id },
      },
    } = layer;
    if (render === this.renderPoint) {
      const { handleShowPointDetail } = this.props;
      handleShowPointDetail(item_id, status, object_title);
    } else if (render === this.renderVideo) {
      this.handleShowVideo(key_id);
    }
  };

  handleAddVideo = ({ target: layer }) => {
    const {
      options: {
        data: { name },
      },
    } = layer;
    layer.bindTooltip(name, { direction: 'top', offset: [0, -48] /* , permanent: true */ });
  };

  handleClickMarkerToolTip = ({
    originalEvent: { target },
    target: {
      options: {
        data: { item_id },
      },
    },
  }) => {
    if (target.tagName === 'SPAN') {
      const { handleShowHiddenDanger, tips } = this.props;
      handleShowHiddenDanger(item_id, tips[item_id]);
    }
  };

  /**
   * 自动移动到有隐患的点位
   */
  handleAddMarkerTooltip = ({
    target: {
      _map: map,
      _latlng: latlng,
      options: {
        data: { item_id },
      },
    },
  }) => {
    const { latestHiddenDangerId } = this.props;
    if (item_id === latestHiddenDangerId) {
      map.panTo(latlng);
    }
  };

  handlePointMouseOver = ({ target: layer }) => {
    const {
      options: {
        data: { item_id: prevItemId },
      },
    } = layer;
    const { object_title, checkName, check_date, dangerCount, originalStatus } =
      this.state.points.find(({ item_id }) => prevItemId === item_id) || {};
    // 是否为异常状态
    const isAbnormal = +originalStatus === 2;
    // 是否已检查
    const isChecked = !!originalStatus;
    layer
      .bindTooltip(
        `
      <div>
        <div>
          点位名称：${object_title}
        </div>
        ${
          isChecked
            ? `
          <div>
            有无隐患：${isAbnormal ? '<span style="color: #ff4848">有隐患</span>' : '无隐患'}
          </div>
        `
            : ''
        }
        ${
          isChecked
            ? `
          <div>
            最近检查：${checkName ? checkName : '暂无数据'} ${
                check_date ? moment(check_date).format('YYYY-MM-DD') : ''
              }
          </div>
        `
            : ''
        }
        ${
          isAbnormal
            ? `
          <div>
            隐患数量：${dangerCount ? dangerCount : 0}
          </div>
        `
            : ''
        }
      </div>
    `,
        { direction: 'right', offset: [24, 0] }
      )
      .openTooltip();
  };

  handlePointMouseLeave = ({ target: layer }) => {
    layer.unbindTooltip();
  };

  /**
   * 下拉框选择事件
   */
  handleSelect = (id, { props: { data } }) => {
    this.setSelectedFourColorImg(data);
  };

  /**
   * 下拉框
   */
  renderSelect() {
    const {
      model: {
        // 企业信息中获取四色图
        companyMessage: { fireIchnographyUrl = [] } = {},
      },
    } = this.props;
    //  从state中获取当前选中的四色图id
    const {
      selectedFourColorImg: { id: selectedFourColorImgId },
    } = this.state;
    // 当四色图的数量大于1时才显示下拉框
    return fireIchnographyUrl.length > 1 ? (
      <Select
        value={selectedFourColorImgId}
        onSelect={this.handleSelect}
        className={styles.fourColorImgSelect}
        dropdownClassName={styles.fourColorImgSelectDropDown}
      >
        {fireIchnographyUrl.map(item => {
          const { id, fileName = '未命名' } = item;
          const isSelected = selectedFourColorImgId === id;
          return (
            <Option key={id} value={id} data={item} style={{ color: isSelected && '#00ffff' }}>
              {fileName.split('.')[0]}
            </Option>
          );
        })}
      </Select>
    ) : null;
  }

  renderPoint = (item, other) => {
    const { item_id, originalStatus } = item;
    const { position } = other;
    const { tips = {} } = this.props;
    const isAbnormal = +originalStatus === 2;
    const showTip = !!tips[item_id];

    return (
      <Fragment key={item_id}>
        <Marker
          key={item_id}
          data={item}
          icon={L.icon({
            iconUrl: ponit,
            iconSize: [33, 43],
            iconAnchor: [16.5, 43],
            shadowUrl: showTip
              ? `
              data:image/svg+xml;utf8,<svg width="120px" height="120px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" preserveAspectRatio="xMidYMid" class="lds-book">
                <circle cx="60" cy="60" r="0" stroke="red" stroke-width="0" fill="rgba(255,0,0,0.6)">
                  <animate attributeName="r" calcMode="linear" from="0" to="60" dur="2s" repeatCount="indefinite"></animate>
                  <animate attributeName="fill" calcMode="linear" from="rgba(255,0,0,0.6)" to="rgba(255,0,0,0.1)" dur="2s" repeatCount="indefinite"></animate>
                </circle>
                <circle cx="60" cy="60" r="0" stroke="red" stroke-width="0" fill="rgba(255,0,0,0.6)">
                  <animate attributeName="r" calcMode="linear" from="0" to="60" dur="2s" begin="1s" repeatCount="indefinite"></animate>
                  <animate attributeName="fill" calcMode="linear" from="rgba(255,0,0,0.6)" to="rgba(255,0,0,0.1)" dur="2s" begin="1s" repeatCount="indefinite"></animate>
                </circle>
              </svg>
            `
              : null,
            shadowSize: [100, 100],
            shadowAnchor: [50, 76.5],
          })}
          {...other}
          /* 下面的不能换位置，为了覆盖other中的同名函数 */
          onAdd={undefined}
          onmouseover={this.handlePointMouseOver}
          onmouseout={this.handlePointMouseLeave}
        />
        <Marker
          data={item}
          position={position}
          icon={L.divIcon({
            className: isAbnormal || showTip ? styles.iconbg : '',
            iconSize: [33, 28],
            iconAnchor: [-10, 20],
          })}
        />
        {showTip && (
          <Marker
            data={item}
            position={position}
            icon={L.divIcon({
              className: styles.tooltipMarker,
              html: `有一条新的隐患！<span class="${styles.alarm}">详情>></span>`,
            })}
            onClick={this.handleClickMarkerToolTip}
            onAdd={this.handleAddMarkerTooltip}
          />
        )}
      </Fragment>
    );
  };

  renderVideo = (item, other) => {
    return (
      <Marker
        key={item.id}
        data={item}
        icon={L.icon({
          iconUrl: newVideo,
          iconSize: [33, 43],
          iconAnchor: [16.5, 43],
        })}
        {...other}
        /* 下面的不能换位置，为了覆盖other中的同名函数 */
        onAdd={this.handleAddVideo}
      />
    );
  };

  render() {
    const {
      model: {
        // 视频列表
        videoFireList = [],
      },
      tips = {},
    } = this.props;
    const { videoVisible, videoKeyId, data, selectedFourColorImg: { webUrl } = {} } = this.state;

    return (
      <div className={styles.container}>
        <ImageDraw
          url={webUrl}
          className={styles.imageContainer}
          data={data}
          zoomControlProps={{ position: 'topright' }}
          onClick={this.handleClickMarker}
          maxBoundsRatio={1.5}
          tips={tips}
          mapProps={{ scrollWheelZoom: false }}
        />
        {this.renderSelect()}
        <div className={styles.legendWrapper}>
          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <div
                className={styles.legendItemIcon}
                style={{ backgroundImage: `url(${videoDot})` }}
              />
              <div>视频监控点</div>
            </div>
            <div className={styles.legendItem}>
              <div
                className={styles.legendItemIcon}
                style={{ backgroundImage: `url(${pointDot})` }}
              />
              <div>检查点</div>
            </div>
            {/* <div className={styles.legendItem}>
              <div
                className={styles.legendItemIcon}
                style={{ backgroundImage: `url(${newLegendAbnormal})` }}
              />
              <div>异常检查点</div>
            </div> */}
          </div>
        </div>
        <VideoPlay
          style={{ position: 'fixed' }}
          showList={false}
          videoList={videoFireList}
          visible={videoVisible}
          keyId={videoKeyId} // keyId
          handleVideoClose={this.handleHideVideo}
        />
      </div>
    );
  }
}
