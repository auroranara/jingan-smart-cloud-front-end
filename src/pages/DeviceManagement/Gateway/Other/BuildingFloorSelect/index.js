import React, { Component } from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Select, Button, Tooltip } from 'antd';
import { connect } from 'dva';
import styles from './index.less';

const { Option } = Select;

@connect(
  ({ gateway }) => ({
    gateway,
  }),
  dispatch => ({
    getBuildingList(payload) {
      dispatch({
        type: 'gateway/fetchBuildingList',
        payload,
      });
    },
    getFloorList(payload) {
      dispatch({
        type: 'gateway/fetchFloorList',
        payload,
      });
    },
    setBuildingList() {
      dispatch({
        type: 'gateway/save',
        payload: {
          buildingList: [],
        },
      });
    },
    setFloorList() {
      dispatch({
        type: 'gateway/save',
        payload: {
          floorList: [],
        },
      });
    },
  })
)
export default class BuildingFloorSelect extends Component {
  state = {
    buildingOpen: false,
    floorOpen: false,
  };

  componentDidMount() {
    const { getBuildingList, getFloorList, companyId, marker, onChange, value } = this.props;
    const [buildingId] = value || [];
    (marker || []).forEach(({ ichnographyType, buildingId, floorId }) => {
      if (ichnographyType === '2') {
        // getFloorList({
        //   pageNum: 1,
        //   pageSize: 0,
        //   building_id: buildingId,
        // });
        onChange && onChange([buildingId, floorId]);
      }
    });
    if (companyId) {
      getBuildingList({
        pageNum: 1,
        pageSize: 0,
        company_id: companyId,
      });
    }
    if (buildingId) {
      getFloorList({
        pageNum: 1,
        pageSize: 0,
        building_id: buildingId,
      });
    }
  }

  componentDidUpdate({ companyId: prevCompanyId }) {
    const { companyId } = this.props;
    if (companyId !== prevCompanyId) {
      this.handleReload();
    }
  }

  handleBuildingChange = building_id => {
    const { getFloorList, onChange } = this.props;
    getFloorList({
      pageNum: 1,
      pageSize: 0,
      building_id,
    });
    onChange && onChange([building_id]);
  };

  handleBuildingDropdownVisibleChange = buildingOpen => {
    this.setState({
      buildingOpen,
    });
  };

  handleFloorChange = floorId => {
    const { onChange, value } = this.props;
    onChange && onChange([value ? value[0] : undefined, floorId]);
  };

  handleFloorDropdownVisibleChange = floorOpen => {
    const { value } = this.props;
    const [building] = value || [];
    if (!building && floorOpen) {
      this.setState({
        buildingOpen: true,
      });
    } else {
      this.setState({
        floorOpen,
      });
    }
  };

  handleReload = () => {
    const {
      setBuildingList,
      setFloorList,
      companyId,
      getBuildingList,
      onChange,
      value,
    } = this.props;
    setBuildingList();
    setFloorList();
    if (companyId) {
      getBuildingList({
        pageNum: 1,
        pageSize: 0,
        company_id: companyId,
      });
    }
    if (value && (value[0] || value[1])) {
      onChange && onChange([]);
    }
  };

  render() {
    const {
      gateway: { buildingList = [], floorList = [] },
      value,
    } = this.props;
    const { buildingOpen, floorOpen } = this.state;
    const [building, floor] = value || [];

    return (
      <div className={styles.container}>
        <Select
          className={styles.buildingSelect}
          placeholder="请选择建筑物名称"
          value={building}
          onChange={this.handleBuildingChange}
          open={buildingOpen}
          onDropdownVisibleChange={this.handleBuildingDropdownVisibleChange}
        >
          {buildingList.map(({ id, buildingName }) => (
            <Option key={id}>{buildingName}</Option>
          ))}
        </Select>
        <Select
          className={styles.floorSelect}
          placeholder="请选择楼层名称"
          value={floor}
          onChange={this.handleFloorChange}
          open={floorOpen}
          onDropdownVisibleChange={this.handleFloorDropdownVisibleChange}
        >
          {floorList.map(({ id, floorName }) => (
            <Option key={id}>{floorName}</Option>
          ))}
        </Select>
        <Button
          className={styles.addButton}
          type="primary"
          href="/#/base-info/buildings-info/list"
          target="_blank"
          style={{ marginTop: 4 }}
        >
          新增建筑物楼层
        </Button>
        <Tooltip title="刷新建筑物列表">
          <LegacyIcon className={styles.reloadIcon} style={{ marginTop: 4 }} type="reload" onClick={this.handleReload} />
        </Tooltip>
      </div>
    );
  }
}
