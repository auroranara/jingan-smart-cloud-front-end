import React, { PureComponent } from 'react';
import { connect } from 'dva';
import FengMap from './FengMap';
import JoySuchMap from './JoySuchMap';

@connect(({ map }) => ({
  map,
}))
export default class MapMarkerSelect extends PureComponent {
  state = {};

  componentDidMount() {
    this.handleUpdateMap(true);
  }

  /**
   * 更新地图
   * @param {boolean} isInit 是否初始化
   **/
  handleUpdateMap = (isInit = false) => {
    const { dispatch, companyId } = this.props;
    // 获取地图列表
    dispatch({
      type: 'map/fetchMapList',
      payload: { companyId },
    });
  };

  render() {
    const {
      map: { mapInfo: { remarks } = {}, mapInfo },
      ...restProps
    } = this.props;
    let ThreeDMap;
    // const ThreeDMap = +remarks === 1 ? FengMap : JoySuchMap;
    if (+remarks === 1) ThreeDMap = FengMap;
    else if (+remarks === 2) ThreeDMap = JoySuchMap;
    else return null;
    return <ThreeDMap {...restProps} mapInfo={mapInfo} />;
  }
}
