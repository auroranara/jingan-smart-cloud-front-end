import React, { PureComponent, Fragment } from 'react';
// import { Tooltip } from 'antd';
import moment from 'moment';
import { Marker, Popup } from 'react-leaflet';
import ImageDraw, { L } from '@/components/ImageDraw';
import VideoPlay from '../../FireControl/section/VideoPlay.js';

import newPointNormal from '@/assets/new-point-normal.png';
import newPointAbnormal from '@/assets/new-point-abnormal.png';
import newVideo from '@/assets/new-video2.png';
import newLegendVideo from '@/assets/new-legend-video2.png';
import newLegendPoint from '@/assets/new-legend-point.png';
import newLegendAbnormal from '@/assets/new-legend-abnormal.png';

import styles from './index.less';

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
  };

  componentDidUpdate({ model: { companyMessage: prevCompanyMessage, firePoint: prevFirePoint, videoFireList: prevVideoFireList } }) {
    const { model: { companyMessage, firePoint, videoFireList } } = this.props;
    // 当四色图或数据源发生变化，重置state中的data
    if (companyMessage !== prevCompanyMessage || firePoint !== prevFirePoint || videoFireList !== prevVideoFireList) {
      const { fireIchnographyUrl: [{ id } = {}] = [] } = companyMessage;
      const points = firePoint.filter(({ fix_fire_id }) => fix_fire_id && fix_fire_id === id).map(item => ({ ...item, type: 'marker', name: item.object_title, latlng: { lat: 1 - item.y_fire, lng: +item.x_fire }, render: this.renderPoint }));
      const videos = videoFireList.filter(({ fix_fire_id }) => fix_fire_id && fix_fire_id === id).map(item => ({ ...item, type: 'marker', name: item.name, latlng: { lat: 1 - item.y_fire, lng: +item.x_fire }, render: this.renderVideo }));
      this.setState({
        data: points.concat(videos),
      });
    }
  }

  handleShowVideo = videoKeyId => {
    this.setState({ videoVisible: true, videoKeyId });
  };

  handleHideVideo = () => {
    this.setState({ videoVisible: false });
  };

  handleClickMarker = ({ target: layer }) => {
    const { options: { data: { render, item_id, status, object_title, key_id } } } = layer
    if (render === this.renderPoint) {
      const { handleShowPointDetail } = this.props;
      handleShowPointDetail(item_id, status, object_title);
    }
    else if (render === this.renderVideo){
      this.handleShowVideo(key_id);
    }
  }

  handleAddPoint = ({ target: layer }) => {
    const { options: { data: { object_title, checkName, check_date, dangerCount, status } } } = layer;
    // 是否为异常状态
    const isAbnormal = status === 2;
    // 是否已检查
    const isChecked = !!status;
    layer.bindTooltip(`
      <div>
        <div>
          点位名称：${object_title}
        </div>
        ${isChecked ? `
          <div>
            状<span style="opacity: 0;">隐藏</span>态：${isAbnormal ? '<span style="color: #ff4848">异常</span>' : '正常'}
          </div>
        ` : ''}
        ${isChecked ? `
          <div>
            最近检查：${checkName ? checkName : '暂无数据'} ${check_date ? moment(check_date).format('YYYY-MM-DD') : ''}
          </div>
        ` : ''}
        ${isAbnormal ? `
          <div>
            隐患数量：${dangerCount ? dangerCount : 0}
          </div>
        ` : ''}
      </div>
    `, { direction: 'right', offset: [24, 0] });
  }

  handleAddVideo = ({ target: layer }) => {
    const { options: { data: { name } } } = layer;
    layer.bindTooltip(name, { direction: 'top', offset: [0, -48]/* , permanent: true */ });
  }

  handleClickMarkerToolTip = ({ originalEvent: { target }, target: { options: { data: { item_id } } } }) => {
    if (target.tagName === 'SPAN') {
      const { handleShowHiddenDanger, tips } = this.props;
      handleShowHiddenDanger(item_id, tips[item_id]);
    }
  }

  handleAddMarkerTooltip = ({ target: { _map: map, _latlng: latlng } }) => {
    map.panTo(latlng);
  }

  renderPoint = (item, other) => {
    const {
      item_id,
      status,
    } = item;
    const { position } = other;
    const { tips={} } = this.props;
    const isAbnormal = status === 2;
    const showTip = !!tips[item_id];
    return (
      <Fragment key={item_id}>
        <Marker
          key={item_id}
          data={item}
          icon={L.icon({
            iconUrl: isAbnormal || showTip ? newPointAbnormal : newPointNormal,
            iconSize: [33, 43],
            iconAnchor: [16.5, 43],
            shadowUrl: showTip ? `
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
            ` : null,
            shadowSize: [100, 100],
            shadowAnchor: [50, 76.5],
          })}
          {...other}
          /* 下面的不能换位置，为了覆盖other中的同名函数 */
          onAdd={this.handleAddPoint}
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
  }

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
  }

  render() {
    const {
      model: {
        companyMessage: { fireIchnographyUrl: [{ id, webUrl } = {}] = [] },
        // pointList = [],
        // firePoint = [],
        // 视频列表
        // videoList = [],
        videoFireList = [],
      },
      tips = {},
      // // 显示点位信息
      // handleShowPointDetail,
      // // 显示点位隐患
      // handleShowHiddenDanger,
    } = this.props;

    const { videoVisible, videoKeyId, data } = this.state;

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
        {/* {points.map(
          ({
            item_id,
            x_fire,
            y_fire,
            object_title,
            status,
            checkName,
            check_date,
            dangerCount,
          }) => {
            const isAbnormal = status === 2;
            const isChecked = !!status;
            const showTip = !!tips[item_id];
            // const showTip = true;
            return (
              <Tooltip
                overlayClassName={showTip ? styles.alarmTooltip : undefined}
                placement="top"
                title={
                  <div>
                    有一条新的隐患！
                    <span
                      className={styles.alarm}
                      onClick={() => {
                        handleShowHiddenDanger(item_id, tips[item_id]);
                      }}
                    >
                      详情>>
                    </span>
                  </div>
                }
                key={item_id}
                visible={showTip}
              >
                <Tooltip
                  placement="rightTop"
                  title={
                    <div>
                      <div>
                        点位名称：
                        {object_title}
                      </div>
                      {isChecked && (
                        <div>
                          状<span style={{ opacity: '0' }}>隐藏</span>
                          态：
                          {isAbnormal ? <span style={{ color: '#ff4848' }}>异常</span> : '正常'}
                        </div>
                      )}
                      {isChecked && (
                        <div>
                          最近检查：
                          {checkName} {moment(check_date).format('YYYY-MM-DD')}
                        </div>
                      )}
                      {isAbnormal && (
                        <div>
                          隐患数量：
                          {dangerCount}
                        </div>
                      )}
                    </div>
                  }
                  key={item_id}
                >
                  <div
                    key={item_id}
                    style={{
                      position: 'absolute',
                      left: `${x_fire * 100}%`,
                      bottom: `${(1 - y_fire) * 100}%`,
                      width: 33,
                      height: 43,
                      transform: 'translateX(-50%)',
                      // background: `url(${isAbnormal?newPointAbnormal:newPointNormal}) no-repeat center center / auto 100%`,
                      // borderRadius: '50%',
                      cursor: 'pointer',
                      zIndex: isAbnormal ? 2 : 1,
                    }}
                    onClick={() => {
                      handleShowPointDetail(item_id, status, object_title);
                    }}
                  >
                    <img
                      src={isAbnormal || showTip ? newPointAbnormal : newPointNormal}
                      alt=""
                      style={{ width: '100%', height: '100%', verticalAlign: 'top' }}
                    />
                    <div className={showTip ? styles.animated : undefined} />
                    <div className={showTip ? `${styles.animated} ${styles.delay}` : undefined} />
                  </div>
                </Tooltip>
              </Tooltip>
            );
          }
        )}
        {videos.map(({ id, key_id, x_fire, y_fire, name }) => (
          <Tooltip placement="top" title={name} key={id}>
            <div
              key={id}
              style={{
                position: 'absolute',
                left: `${x_fire * 100}%`,
                bottom: `${(1 - y_fire) * 100}%`,
                width: 33,
                height: 43,
                transform: 'translateX(-50%)',
                background: `url(${newVideo}) no-repeat center center / auto 100%`,
                cursor: 'pointer',
              }}
              onClick={() => {
                this.handleShowVideo(key_id);
              }}
            />
          </Tooltip>
        ))} */}
        <div className={styles.legendWrapper}>
          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <div
                className={styles.legendItemIcon}
                style={{ backgroundImage: `url(${newLegendVideo})` }}
              />
              <div>视频监控点</div>
            </div>
            <div className={styles.legendItem}>
              <div
                className={styles.legendItemIcon}
                style={{ backgroundImage: `url(${newLegendPoint})` }}
              />
              <div>正常检查点</div>
            </div>
            <div className={styles.legendItem}>
              <div
                className={styles.legendItemIcon}
                style={{ backgroundImage: `url(${newLegendAbnormal})` }}
              />
              <div>异常检查点</div>
            </div>
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
