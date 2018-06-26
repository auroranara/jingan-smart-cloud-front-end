import React, { Component, Fragment } from 'react';
import { Button, Card, Table } from 'antd';
import { Link } from 'react-router-dom';
import DescriptionList from 'components/DescriptionList';

const { Description } = DescriptionList;

// const INDEX_CHINESE = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
const hostTableAStyle = { marginRight: 10 };
const deviceButtonStyle = { marginRight: 8 };
const hostColumnsActionPStyle = { marginBottom: 0 };

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
      handleHostAddClick,
    } = this.props;

    return (
      <Fragment>
        <Button
          type="primary"
          style={deviceButtonStyle}
          onClick={() => handleDeviceUpdateClick(deviceData)}
        >
          编辑
        </Button>
        <Button
          type="primary"
          style={deviceButtonStyle}
          onClick={() => handleDeviceDeleteClick(deviceData.id)}
        >
          删除
        </Button>
        <Button type="primary" onClick={() => handleHostAddClick(deviceData.id)}>
          新增消防主机
        </Button>
      </Fragment>
    );
  }

  renderDeviceInfo() {
    const deviceInfo = this.props.deviceData;
    return (
      <DescriptionList size="small">
        <Description term="装置编号">{deviceInfo.deviceCode}</Description>
        <Description term="品牌">{deviceInfo.brand}</Description>
        <Description term="型号">{deviceInfo.model}</Description>
        <Description term="安装位置">{deviceInfo.installLocation}</Description>
        <Description term="生产日期">{deviceInfo.productionDate}</Description>
        <Description term="接入主机数量">
          {deviceInfo.hostList ? deviceInfo.hostList.length.toString() : 0}
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
        width: 98,
        render: (text, record, index) => (
          <Fragment>
            <p style={hostColumnsActionPStyle}>
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
              <a onClick={() => handleHostDeleteClick(id, record.id)}>删除</a>
            </p>
            <p style={hostColumnsActionPStyle}>
              <Link to={`/fire-control/import-point-position/${record.id}`}>导入点位</Link>
            </p>
          </Fragment>
        ),
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
      <Card style={{ marginBottom: 30 }}>
        <Card
          type="inner"
          title={deviceName}
          bordered={false}
          extra={this.renderDeviceExtra()}
          style={deviceCardStyle}
        >
          {this.renderDeviceInfo()}
        </Card>
        <Card type="inner" title="关联消防主机" bordered={false}>
          {this.renderHostTable()}
        </Card>
      </Card>
    );
  }
}
