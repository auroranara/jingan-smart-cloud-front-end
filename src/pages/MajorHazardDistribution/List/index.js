import React, { Component } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { message, Spin, List, Card } from 'antd';
import Map from '@/jingan-components/Form/Map';
import Radio from '@/jingan-components/Form/Radio';
import { connect } from 'dva';
import router from 'umi/router';
import {
  BREADCRUMB_LIST_PREFIX,
  MAP_LIST_API,
  LIST_API,
  DETAIL_CODE,
  SECURITY_CODE,
  TYPES,
  LIST_GRID,
} from '../config';
import iconVideo from '../assets/icon-video.png';
import iconToxicGas from '../assets/icon-toxic-gas.png';
import iconCombustibleGas from '../assets/icon-combustible-gas.png';
import styles from './index.less';

const MAP_BUTTON_OPTIONS = [
  { label: '视频监控', icon: iconVideo },
  { label: '可燃气体', icon: iconCombustibleGas },
  { label: '有毒气体', icon: iconToxicGas },
];

@connect(
  (
    {
      user: {
        currentUser: { unitType, unitId: unitId1, permissionCodes },
      },
      common: { mapList },
      majorHazardDistribution: { list },
      loading: {
        effects: { [MAP_LIST_API]: loadingMapList, [LIST_API]: loadingList },
      },
    },
    {
      match: {
        params: { unitId: unitId2 },
      },
    }
  ) => {
    const isUnit = unitType === 4;
    return {
      isUnit,
      unitId: isUnit ? unitId1 : unitId2,
      breadcrumbList: BREADCRUMB_LIST_PREFIX.concat(
        [
          !isUnit && {
            title: '单位列表',
            name: '单位列表',
            href: '/monitoring-and-early-warning/major-hazard-distribution/list',
          },
          { title: '重大危险源分布', name: '重大危险源分布' },
        ].filter(v => v)
      ),
      mapList,
      list,
      loadingMapList,
      loadingList,
      hasDetailAuthority: permissionCodes.includes(DETAIL_CODE),
      hasSecurityAuthority: permissionCodes.includes(SECURITY_CODE),
    };
  },
  null,
  (stateProps, { dispatch }, ownProps) => {
    const { unitId } = stateProps;
    return {
      ...stateProps,
      ...ownProps,
      getMapList(payload, callback) {
        dispatch({
          type: MAP_LIST_API,
          payload: {
            ...payload,
            companyId: unitId,
          },
          callback(success, data) {
            if (!success) {
              message.error('获取地图数据失败，请稍后重试！');
            }
            callback && callback(success, data);
          },
        });
      },
      getList(payload, callback) {
        dispatch({
          type: LIST_API,
          payload: {
            ...payload,
            companyId: unitId,
          },
          callback(success, data) {
            if (!success) {
              message.error('获取列表数据失败，请稍后重试！');
            }
            callback && callback(success, data);
          },
        });
      },
    };
  }
)
export default class MajorHazardDistribution extends Component {
  state = {
    type: undefined,
    disabledMapButtonIndexList: undefined,
  };

  componentDidMount() {
    // const { unitId } = this.props;
    // if (unitId) {
    //   this.handleTypeChange(TYPES[0].key);
    // }
    this.handleTypeChange(TYPES[0].key);
  }

  componentDidUpdate({ unitId: prevUnitId }) {
    const { unitId } = this.props;
    if (unitId !== prevUnitId && unitId) {
      this.handleTypeChange(TYPES[0].key);
    }
  }

  handleTypeChange = type => {
    const { getMapList, getList } = this.props;
    this.setState({
      type,
      disabledMapButtonIndexList: undefined,
    });
    if (type === TYPES[0].key) {
      getMapList();
    }
    getList();
  };

  handleItemClick = e => {
    console.log(e);
  };

  renderMap() {
    const { mapList: [options] = [] } = this.props;
    const { disabledMapButtonIndexList = [] } = this.state;
    console.log(disabledMapButtonIndexList);

    return (
      <Map options={options}>
        <div className={styles.mapButtonContainer}>
          {MAP_BUTTON_OPTIONS.map(({ label, icon }, index) => {
            const disabled = disabledMapButtonIndexList.includes(index);
            return (
              <div
                className={styles.mapButton}
                key={label}
                style={disabled ? { color: 'gray' } : undefined}
                onClick={() =>
                  this.setState({
                    disabledMapButtonIndexList: disabled
                      ? disabledMapButtonIndexList.filter(i => i !== index)
                      : disabledMapButtonIndexList.concat(index),
                  })
                }
              >
                <img
                  src={icon}
                  alt=""
                  style={{ filter: disabled ? 'grayscale(100%)' : undefined }}
                />
                {label}
              </div>
            );
          })}
        </div>
      </Map>
    );
  }

  renderList() {
    const { list, loadingList } = this.props;

    return (
      <List
        grid={LIST_GRID}
        loading={loadingList}
        dataSource={list}
        renderItem={item => (
          <List.Item>
            <Card hoverable onClick={this.handleItemClick} data={item}>
              123
            </Card>
          </List.Item>
        )}
      />
    );
  }

  render() {
    const { breadcrumbList } = this.props;
    const { type } = this.state;

    return (
      <PageHeaderLayout
        breadcrumbList={breadcrumbList}
        title={breadcrumbList[breadcrumbList.length - 1].title}
        action={
          <Radio list={TYPES} value={type} onChange={this.handleTypeChange} buttonStyle="solid" />
        }
      >
        {type === TYPES[0].key && this.renderMap()}
        {type === TYPES[1].key && this.renderList()}
      </PageHeaderLayout>
    );
  }
}
