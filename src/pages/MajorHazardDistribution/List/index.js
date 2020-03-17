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
import styles from './index.less';

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
  };

  componentDidMount() {
    this.handleTypeChange(TYPES[0].key);
  }

  componentDidUpdate({ unitId: prevUnitId }) {
    const { unitId } = this.props;
    if (unitId !== prevUnitId && unitId) {
      const { type } = this.state;
      this.handleTypeChange(type);
    }
  }

  handleTypeChange = type => {
    const { getMapList, getList } = this.props;
    this.setState({
      type,
    });
    if (type === TYPES[0].key) {
      getMapList();
    }
    getList();
  };

  handleItemClick = (e, v) => {
    console.log(e);
    console.log(v);
  };

  renderMap() {
    const { mapList: [options] = [] } = this.props;

    return <Map options={options} />;
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
