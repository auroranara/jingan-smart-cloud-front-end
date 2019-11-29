import React, { Component } from 'react';
import { Input, Modal, Icon, Tooltip } from 'antd';
import { Map, Marker } from 'react-amap';
import { isNumber } from '@/utils/utils';
import styles from './index.less';

export default class MapCoordinate extends Component {
  state = {
    position: undefined,
    visible: false,
  }

  handleShowModal = () => {
    const { value } = this.props;
    const [longitude, latitude] = (value || '').split(',');
    const position = isNumber(longitude) && isNumber(latitude) ? { longitude, latitude } : undefined;
    this.setState({
      position,
      visible: true,
    });
  }

  handleOk = () => {
    const { position } = this.state;
    const { onChange } = this.props;
    const { longitude, latitude } = position;
    this.setState({
      visible: false,
    });
    onChange && onChange(`${longitude},${latitude}`);
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  handleMapClick = ({ lnglat }) => {
    const longitude = lnglat.getLng();
    const latitude = lnglat.getLat();
    this.setState({
      position: {
        longitude,
        latitude,
      },
    });
  }

  handleInputChange = ({ target: { value } }) => {
    const { onChange } = this.props;
    onChange && onChange(value);
  }

  handleSearchChange = ({ target: { value } }) => {
    if (value) {
      /* eslint-disable */
      AMap.plugin('AMap.Autocomplete', () => {
        const autoComplete = new AMap.Autocomplete({
          city: '全国'
        });
        autoComplete.search(value, (status, result) => {
          console.log(status);
          console.log(result);
        })
      })
      /* eslint-enable */
    }
  }

  render() {
    const {
      className,
      value,
      disabled,
    } = this.props;
    const { visible, position } = this.state;

    return (
      <div className={className}>
        {!disabled ? (
          <Input
            className={styles.input}
            value={value}
            onChange={this.handleInputChange}
            placeholder="请输入经纬度"
            addonAfter={(
              <Tooltip title="打开地图">
                <Icon className={styles.icon} type="environment" onClick={this.handleShowModal} />
              </Tooltip>
            )}
          />
        ) : (
          <span className={styles.clickable} onClick={this.handleShowModal}>{value}</span>
        )}
        <Modal
          className={styles.modal}
          title="经纬度"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width="80%"
          okButtonProps={{
            disabled: !position,
          }}
          zIndex={1009}
          destroyOnClose
          footer={disabled ? null : undefined}
        >
          <Map
            amapkey="08390761c9e9bcedbdb2f18a2a815541"
            plugins={['Scale', { name: 'ToolBar', options: { locate: false } }]}
            events={{
              click: !disabled ? this.handleMapClick : undefined,
            }}
            center={position}
          >
            {position && <Marker position={position} />}
            {!disabled && (
              <Input
                className={styles.search}
                onChange={this.handleSearchChange}
                placeholder="请输入搜索位置"
              />
            )}
          </Map>
        </Modal>
      </div>
    );
  }
}
