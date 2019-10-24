import React, { Component, Fragment } from 'react';
import { Row, Col, Button, Input, Popconfirm, Select, message } from 'antd';
import CustomCoordinate from '@/jingan-components/CustomCoordinate';
import { connect } from 'dva';
import styles from './index.less';

const { Option } = Select;
const ichnographyTypeList = [
  {
    key: '1',
    value: '单位平面图',
  },
  {
    key: '2',
    value: '楼层平面图',
  },
  {
    key: '3',
    value: '安全四色图',
  },
  {
    key: '4',
    value: '消防平面图',
  },
];

@connect(({
  gateway,
}) => ({
  gateway,
}), (dispatch) => ({
  // getIchnographyTypeList() {
  //   dispatch({
  //     type: 'gateway/fetchIchnographyTypeList',
  //   });
  // },
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
  getPictureList(payload, callback) {
    dispatch({
      type: 'gateway/fetchPictureList',
      payload,
      callback,
    });
  },
}))
export default class MarkerSelect extends Component {
  state = {
    buildingOpen: false,
    floorOpen: false,
    coordinateProps: {
      title: '',
      visible: false,
      position: undefined,
      index: 0,
      urls: [],
    },
  }

  componentDidMount() {
    const { getBuildingList, getFloorList, companyId, value } = this.props;
    if (companyId) {
      getBuildingList({
        pageNum: 1,
        pageSize: 0,
        company_id: companyId,
      });
    }
    (value || []).forEach(({ ichnographyType, buildingId }) => {
      if (ichnographyType === '2') {
        getFloorList({
          pageNum: 1,
          pageSize: 0,
          building_id: buildingId,
        });
      }
    });
  }

  componentDidUpdate({ isBuildingFloorEntryForm: prevIsBuildingFloorEntryForm, buildingFloor: prevBuildingFloor }) {
    const { isBuildingFloorEntryForm, buildingFloor, value, onChange } = this.props;
    const [prevBuilding, prevFloor] = prevBuildingFloor || [];
    const [buildingId, floorId] = buildingFloor || [];
    if (prevIsBuildingFloorEntryForm && isBuildingFloorEntryForm && (prevBuilding !== buildingId || prevFloor !== floorId)) {
      const index = (value || []).findIndex(({ ichnographyType }) => ichnographyType === '2');
      if (index > -1) {
        onChange && onChange(value.map((item, i) => i === index ? { ...item, buildingId, floorId } : item));
      }
    }
  }

  handleBuildingDropdownVisibleChange = (buildingOpen) => {
    this.setState({
      buildingOpen,
    });
  }

  handleFloorDropdownVisibleChange = (floorOpen, index) => {
    const { value } = this.props;
    const { buildingId } = value[index];
    if (!buildingId && floorOpen) {
      this.setState({
        buildingOpen: true,
      });
    } else {
      this.setState({
        floorOpen,
      });
    }
  }

  handleLocateButtonClick = (e) => {
    const { value, companyId, getPictureList } = this.props;
    const { index } = e.currentTarget.dataset;
    this.index = +index;
    const { xNum, yNum, ichnographyType, buildingId, floorId, id: key } = value[+index];
    const title = ichnographyTypeList.filter(({ key }) => key === ichnographyType)[0].value;
    getPictureList({
      companyId,
      type: ichnographyType,
      buildingId,
      floorId,
    }, (urls) => {
      if (urls.length > 0) {
        this.setState({
          coordinateProps: {
            title: `${title}定位`,
            visible: true,
            position: { xNum, yNum },
            index: Math.max(urls.findIndex(({ id }) => id === key), 0),
            urls,
          },
        });
      } else {
        message.error(`暂无${title}`);
      }
    });
  }

  handleAddButtonClick = () => {
    const { value, onChange } = this.props;
    onChange && onChange((value || []).concat({ key: Math.random(), editing: true }));
  }

  handleDeleteConfirm = (index) => {
    const { value, onChange } = this.props;
    onChange && onChange((value || []).filter((_, i) => i !== index));
  }

  handleEditButtonClick = (e) => {
    const { index } = e.currentTarget.dataset;
    const { value, onChange } = this.props;
    onChange && onChange((value || []).map((item, i) => i === +index ? { ...item, editing: true } : item));
  }

  handleSaveButtonClick = (e) => {
    const { index } = e.currentTarget.dataset;
    const { value, onChange } = this.props;
    onChange && onChange((value || []).map((item, i) => i === +index ? { ...item, editing: false } : item));
  }

  handleBuildingChange = (buildingId, { props: { index } }) => {
    const { getFloorList, value, onChange } = this.props;
    getFloorList({
      pageNum: 1,
      pageSize: 0,
      building_id: buildingId,
    });
    onChange && onChange((value || []).map((item, i) => i === index ? { ...item, buildingId, floorId: undefined } : item));
  }

  handleFloorChange = (floorId, { props: { index } }) => {
    const { onChange, value } = this.props;
    onChange && onChange((value || []).map((item, i) => i === index ? { ...item, floorId } : item));
  }

  handleIchnographyTypeChange = (ichnographyType, { props: { index } }) => {
    const { value, onChange, buildingFloor } = this.props;
    const [buildingId, floorId] = buildingFloor || [];
    const rest = ichnographyType === '2' && { buildingId, floorId };
    onChange && onChange((value || []).map((item, i) => i === index ? { ...item, ichnographyType, ...rest } : item));
  }

  handleCoordinateChange = (index) => {
    this.setState(({ coordinateProps }) => ({
      coordinateProps: {
        ...coordinateProps,
        index,
        position: undefined,
      },
    }));
  }

  handleCoordinateClick = (position) => {
    this.setState(({ coordinateProps }) => ({
      coordinateProps: {
        ...coordinateProps,
        position,
      },
    }));
  }

  handleCoordinateOk = () => {
    const { value, onChange } = this.props;
    const { coordinateProps: { position, urls, index } } = this.state;
    const { xNum, yNum } = position || {};
    if (xNum && yNum) {
      this.setState(({ coordinateProps }) => ({
        coordinateProps: {
          ...coordinateProps,
          visible: false,
        },
      }));
      onChange && onChange((value || []).map((item, i) => i === this.index ? { ...item, xNum: xNum.toFixed(3), yNum: yNum.toFixed(3), id: urls[index].id } : item));
      return;
    }
    message.error('请先选择定位点');
  }

  handleCoordinateCancel = () => {
    this.setState(({ coordinateProps }) => ({
      coordinateProps: {
        ...coordinateProps,
        visible: false,
      },
    }));
  }

  render() {
    const {
      gateway: {
        buildingList=[],
        floorList=[],
      },
      isBuildingFloorEntryForm,
      value,
      readonly,
    } = this.props;
    const { buildingOpen, floorOpen, coordinateProps } = this.state;
    const disabled = (value || []).some(({ editing }) => editing);

    return (
      <div className={styles.container}>
        {readonly ? (
          (value || []).map(({ key, ichnographyType, buildingId, floorId, xNum, yNum }, index) => {
            const isFloorIchnographyType = ichnographyType === '2';
            return (
              <div key={key || index}>
                <span className={styles.item}>平面图类型：{(ichnographyTypeList.filter(({ key }) => key === ichnographyType)[0] || {}).value}</span>
                {isFloorIchnographyType && <span className={styles.item}>建筑物名称：{(buildingList.filter(({ id }) => id === buildingId)[0] || {}).buildingName}</span>}
                {isFloorIchnographyType && <span className={styles.item}>楼层名称：{(floorList.filter(({ id }) => id === floorId)[0] || {}).floorName}</span>}
                <span className={styles.item}>定位坐标：<Button className={styles.axis} type="link" data-index={index} onClick={this.handleLocateButtonClick}>{`${xNum},${yNum}`}</Button></span>
              </div>
            );
          })
        ) : (
          <Fragment>
            <div>
              <Button type="primary" onClick={this.handleAddButtonClick} disabled={disabled}>新增</Button>
            </div>
            {(value || []).map(({ key, ichnographyType, buildingId, floorId, xNum, yNum, editing }, index) => {
              const isFloorIchnographyType = ichnographyType === '2';
              return (
                <Row gutter={16} key={key || index}>
                  <Col span={!isFloorIchnographyType ? 6 : 4}>
                    <Select
                      className={styles.ichnographyTypeSelect}
                      placeholder="平面图类型"
                      value={ichnographyType}
                      disabled={!editing}
                      data-index={index}
                      onChange={this.handleIchnographyTypeChange}
                    >
                      {ichnographyTypeList.map(({ key, value }) => <Option index={index} key={key}>{value}</Option>)}
                    </Select>
                  </Col>
                  {isFloorIchnographyType && (
                    <Fragment>
                      <Col span={4}>
                        <Select
                          className={styles.buildingSelect}
                          placeholder="建筑物名称"
                          value={buildingId}
                          onChange={this.handleBuildingChange}
                          open={buildingOpen}
                          onDropdownVisibleChange={this.handleBuildingDropdownVisibleChange}
                          disabled={!editing || isBuildingFloorEntryForm}
                        >
                          {buildingList.map(({ id, buildingName }) => <Option index={index} key={id}>{buildingName}</Option>)}
                        </Select>
                      </Col>
                      <Col span={4}>
                        <Select
                          className={styles.floorSelect}
                          placeholder="楼层名称"
                          value={floorId}
                          onChange={this.handleFloorChange}
                          open={floorOpen}
                          onDropdownVisibleChange={(open) => this.handleFloorDropdownVisibleChange(open, index)}
                          disabled={!editing || isBuildingFloorEntryForm}
                        >
                          {floorList.map(({ id, floorName }) => <Option index={index} key={id}>{floorName}</Option>)}
                        </Select>
                      </Col>
                    </Fragment>
                  )}
                  <Col span={!isFloorIchnographyType ? 6 : 3}>
                    <Input
                      className={styles.xNumInput}
                      value={xNum}
                      placeholder="x轴"
                      maxLength={50}
                      disabled
                    />
                  </Col>
                  <Col span={!isFloorIchnographyType ? 6 : 3}>
                    <Input
                      className={styles.yNumInput}
                      value={yNum}
                      placeholder="y轴"
                      maxLength={50}
                      disabled
                    />
                  </Col>
                  <Col span={6}>
                    <Button className={styles.locateButton} data-index={index} onClick={this.handleLocateButtonClick} disabled={!editing || !ichnographyType}>定位</Button>
                    {editing ? (
                      <Button className={styles.saveButton} type="link" data-index={index} onClick={this.handleSaveButtonClick} disabled={!ichnographyType || (isFloorIchnographyType && (!buildingId || !floorId)) || !xNum || !yNum}>保存</Button>
                    ) : (
                      <Button className={styles.editButton} type="link" data-index={index} onClick={this.handleEditButtonClick} disabled={disabled}>编辑</Button>
                    )}
                    <Popconfirm title="你确定要删除吗？" onConfirm={() => this.handleDeleteConfirm(index)}>
                      <Button className={styles.deleteButton} type="link">删除</Button>
                    </Popconfirm>
                  </Col>
                </Row>
              );
            })}
          </Fragment>
        )}
        <CustomCoordinate
          onClick={this.handleCoordinateClick}
          onChange={this.handleCoordinateChange}
          onOk={this.handleCoordinateOk}
          onCancel={this.handleCoordinateCancel}
          disabled={readonly}
          zIndex={1009}
          {...coordinateProps}
        />
      </div>
    );
  }
}
