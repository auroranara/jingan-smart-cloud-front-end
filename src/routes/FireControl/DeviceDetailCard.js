import React, { Component, Fragment } from 'react';
import { Button, Card, Dropdown, Menu, Icon, Table } from 'antd';
import { Link } from 'react-router-dom';
import DescriptionList from 'components/DescriptionList';

import styles from './DeviceDetailCard.less';

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
    const {
      deviceData,
      handleDeviceUpdateClick,
      handleDeviceDeleteClick,
    } = this.props;

    return (
      <ButtonGroup>
        <Button
          // type="primary"
          // style={deviceButtonStyle}
          onClick={() => handleDeviceUpdateClick(deviceData)}
        >
          编辑
        </Button>
        <Button
          // type="primary"
          // style={deviceButtonStyle}
          onClick={() => handleDeviceDeleteClick(deviceData.id)}
        >
          删除
        </Button>
      </ButtonGroup>
    );
  }

  renderHostExtra() {
    const { deviceData, handleHostAddClick } = this.props;

    return (
      <Button
        type="primary"
        onClick={() => handleHostAddClick(deviceData.id, deviceData.deviceCode)}
      >
        新增主机
      </Button>
    );
  }

  renderDeviceInfo() {
    const deviceInfo = this.props.deviceData;
    return (
      <DescriptionList size="small" col={3}>
        <Description term="装置编号">{deviceInfo.deviceCode}</Description>
        <Description term="品牌">{deviceInfo.brand}</Description>
        <Description term="型号">{deviceInfo.model}</Description>
        <Description term="安装位置">{deviceInfo.installLocation}</Description>
        <Description term="生产日期">{deviceInfo.productionDate}</Description>
        <Description term="接入主机数量">
          {deviceInfo.hostList ? deviceInfo.hostList.length.toString() : '0'}
        </Description>
      </DescriptionList>
    );
  }

  renderHostTable() {
    const {
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
              <MenuItem><a onClick={() => handleHostDeleteClick(id, record.id)}>删除</a></MenuItem>
              <MenuItem><Link to={{ pathname: `/fire-control/import-point-position/${record.deviceId}`, query: { deviceCode: record.deviceCode } }}>导入点位</Link></MenuItem>
            </Menu>
          );

          return (
            <Fragment>
              <a
                style={hostTableAStyle}
                onClick={() =>
                  handleHostUpdateClick({
                    ...hostList[index],
                    transmissionDeviceCode: deviceCode,
                    transmissionId: id,
                  })
                }
              >
                编辑
              </a>
              <Dropdown overlay={menu}>
                <a>更多<Icon type="down" /></a>
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
        <Card
          type="inner"
          title="关联消防主机"
          bordered={false}
          extra={this.renderHostExtra()}
        >
          {this.renderHostTable()}
        </Card>
      </Card>
    );
  }
}
