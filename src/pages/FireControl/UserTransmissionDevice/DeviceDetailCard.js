import React, { Component, Fragment } from 'react';
import { Button, Card, Dropdown, Menu, Icon, Table } from 'antd';
import { Link } from 'react-router-dom';
import DescriptionList from 'components/DescriptionList';

import styles from './DeviceDetailCard.less';
import { getDisabled, getOnClick } from '../../../utils/customAuth';

const DEVICE_UPDATE_CODE = 'fireControl.userTransmissionDevice.edit';
const DEVICE_DELETE_CODE = 'fireControl.userTransmissionDevice.delete';
const HOST_ADD_CODE = 'fireControl.userTransmissionDevice.host.add';
const HOST_UPDATE_CODE = 'fireControl.userTransmissionDevice.host.edit';
const HOST_DELETE_CODE = 'fireControl.userTransmissionDevice.host.delete';
const HOST_IMPORT_CODE = 'fireControl.userTransmissionDevice.host.importPointPosition';

const { Description } = DescriptionList;
const ButtonGroup = Button.Group;
const MenuItem = Menu.Item;

const hostTableAStyle = { marginRight: 10 };
// const deviceButtonStyle = { marginRight: 8 };
// const hostColumnsActionPStyle = { marginBottom: 0 };

function setColumnAlign(columns, align = 'center') {
  return columns.map(column => ({ ...column, align }));
}

const deviceCardStyle = { marginBottom: 20 };

export default class DeviceDetailCard extends Component {
  renderDeviceExtra() {
    const { codes, deviceData, handleDeviceUpdateClick, handleDeviceDeleteClick } = this.props;

    return (
      <ButtonGroup>
        <Button
          // type="primary"
          // style={deviceButtonStyle}
          disabled={getDisabled(DEVICE_UPDATE_CODE, codes)}
          onClick={() =>{ handleDeviceUpdateClick(deviceData); } }
        >
          编辑
        </Button>
        <Button
          // type="primary"
          // style={deviceButtonStyle}
          disabled={getDisabled(DEVICE_DELETE_CODE, codes)}
          onClick={() => handleDeviceDeleteClick(deviceData.id)}
        >
          删除
        </Button>
      </ButtonGroup>
    );
  }

  renderHostExtra() {
    const { codes, deviceData, handleHostAddClick } = this.props;

    return (
      <Button
        type="primary"
        disabled={getDisabled(HOST_ADD_CODE, codes)}
        onClick={() => handleHostAddClick(deviceData.id, deviceData.deviceCode)}
      >
        新增主机
      </Button>
    );
  }

  renderDeviceInfo() {
    const { deviceData: deviceInfo } = this.props;
    return (
      <DescriptionList size="small" col={3}>
        <Description term="装置编号" key="deviceCode">
          {deviceInfo.deviceCode}
        </Description>
        <Description term="品牌" key="brand">
          {deviceInfo.brand}
        </Description>
        <Description term="型号" key="model">
          {deviceInfo.model}
        </Description>
        <Description term="安装位置" key="installLocation">
          {deviceInfo.installLocation}
        </Description>
        <Description term="生产日期" key="productionDate">
          {deviceInfo.productionDate}
        </Description>
        <Description term="接入主机数量" key="hostList">
          {deviceInfo.hostList ? deviceInfo.hostList.length.toString() : '0'}
        </Description>
      </DescriptionList>
    );
  }

  renderHostTable() {
    const {
      codes,
      companyId,
      deviceData,
      handleHostUpdateClick,
      handleHostDeleteClick,
      // importPointPositionClick,
    } = this.props;
    const { hostList, deviceCode, id } = deviceData;

    const hostColumns = [
      {
        title: '主机编号',
        dataIndex: 'deviceCode',
        key: 'deviceCode',
      },
      {
        title: '品牌',
        dataIndex: 'brand',
        key: 'brand',
      },
      {
        title: '型号',
        dataIndex: 'model',
        key: 'model',
      },
      {
        title: '传输接口',
        dataIndex: 'transmissionInterface',
        key: 'transmissionInterface',
        width: 88,
      },
      {
        title: '安装位置',
        dataIndex: 'installLocation',
        key: 'installLocation',
      },
      {
        title: '生产日期',
        dataIndex: 'productionDate',
        key: 'productionDate',
      },
      {
        title: '操作',
        key: 'action',
        width: 110,
        render(text, record, index) {
          const menu = (
            <Menu>
              <MenuItem>
                <a onClick={getOnClick(HOST_DELETE_CODE, codes, () => handleHostDeleteClick(id, record.id))}>删除</a>
              </MenuItem>
              <MenuItem>
                <Link
                  to={{
                    pathname: `/fire-control/user-transmission-device/${companyId}/import-point-position/${
                      record.id
                    }`,
                  }}
                  onClick={getOnClick(HOST_IMPORT_CODE, codes)}
                >
                  导入点位
                </Link>
              </MenuItem>
            </Menu>
          );

          return (
            <Fragment>
              <a
                style={hostTableAStyle}
                onClick={getOnClick(HOST_UPDATE_CODE, codes, () =>
                  handleHostUpdateClick({
                    ...hostList[index],
                    transmissionDeviceCode: deviceCode,
                    transmissionId: id,
                  }))
                }
              >
                编辑
              </a>
              <Dropdown overlay={menu}>
                <a>
                  更多<Icon type="down" />
                </a>
              </Dropdown>
            </Fragment>
          );
        },
      },
    ];

    return (
      <Table
        pagination={false}
        columns={setColumnAlign(hostColumns)}
        dataSource={hostList || []}
        rowKey="id"
      />
    );
  }

  render() {
    const {
      deviceData: { deviceName },
    } = this.props;

    return (
      <Card className={styles.outerCard}>
        <Card
          type="inner"
          title={deviceName}
          bordered={false}
          extra={this.renderDeviceExtra()}
          style={deviceCardStyle}
        >
          {this.renderDeviceInfo()}
        </Card>
        <Card type="inner" title="关联消防主机" bordered={false} extra={this.renderHostExtra()}>
          {this.renderHostTable()}
        </Card>
      </Card>
    );
  }
}
