import React, { PureComponent } from 'react';
import { connect } from 'dva';
import FengMapSelect from './FengMapSelect';
import JoySuchSelect from './JoySuchSelect';

@connect(({ map }) => ({
  map,
}))
export default class MapMarkerSelect extends PureComponent {
  state = {};

  componentDidMount() {
    this.handleUpdateMap(true);
  }

  componentDidUpdate(prevProps) {
    const { companyId: prevCompanyId } = prevProps;
    const { companyId } = this.props;
    if (companyId !== prevCompanyId) this.handleUpdateMap(true);
  }

  /**
   * 更新地图
   * @param {boolean} isInit 是否初始化
   **/
  handleUpdateMap = (isInit = false) => {
    const { dispatch, companyId } = this.props;
    if (!companyId) return;
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
    if (+remarks === 1) ThreeDMap = FengMapSelect;
    else if (+remarks === 2) ThreeDMap = JoySuchSelect;
    else return null;
    return <ThreeDMap {...restProps} mapInfo={mapInfo} />;
  }
}
