import React, { Component } from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Input, Modal, Tooltip, AutoComplete } from 'antd';
import { Map, Marker } from 'react-amap';
import { isNumber } from '@/utils/utils';
import { debounce, bind } from 'lodash-decorators';
import styles from './index.less';
const { Option } = AutoComplete;

export default class MapCoordinate extends Component {
  state = {
    position: undefined,
    visible: false,
    options: [],
    searchValue: undefined,
  }

  unClicked = true

  @bind
  @debounce(300)
  setOptions() {
    /* eslint-disable */
    AMap.plugin('AMap.Autocomplete', () => {
      const { searchValue } = this.state;
      new AMap.Autocomplete({
        //city 限定城市，默认全国
        city: '全国',
      }).search(searchValue, (status, result) => {
        if (status === 'complete') {
          const options = result.tips;
          this.setState({
            options,
          });
        }
      })
    })
    /* eslint-enable */
  }

  handleSearchSelect = (_, { props: { data: { district, name, location } } }) => {
    if (location && isNumber(location.lng) && isNumber(location.lat)) {
      const position = [location.lng, location.lat];
      this.setState({
        position,
      });
      this.map && this.map.setFitView(new AMap.Marker({ position })); // eslint-disable-line
    } else {
      /* eslint-disable */
      AMap.plugin('AMap.Geocoder', () => {
        new AMap.Geocoder({
          //city 限定城市，默认全国
          city: '全国',
        }).getLocation(`${district}${name}`, (status, result) => {
          if (status === 'complete' && result.geocodes.length) {
            const location = result.geocodes[0].location;
            const position = [location.lng, location.lat];
            this.setState({
              position,
            });
            this.map && this.map.setFitView(new AMap.Marker({ position }));
          }
        })
      })
      /* eslint-enable */
    }
  }

  handleShowModal = () => {
    const { value } = this.props;
    const [longitude, latitude] = (value || '').split(',');
    const position = isNumber(longitude) && isNumber(latitude) ? [longitude, latitude] : undefined;
    this.unClicked = true;
    this.setState({
      position,
      visible: true,
      options: [],
      searchValue: undefined,
    });
  }

  handleOk = () => {
    const { position } = this.state;
    const { onChange } = this.props;
    const [longitude, latitude] = position;
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

  handleMapCreated = (map) => {
    this.map = map;
  }

  handleMapClick = ({ lnglat }) => {
    const longitude = lnglat.getLng();
    const latitude = lnglat.getLat();
    this.unClicked = false;
    this.setState({
      position: [longitude, latitude],
    });
  }

  handleMarkerCreated = () => {
    if (this.unClicked) {
      this.map.setFitView(
        this.map.getAllOverlays().filter(d => d.CLASS_NAME === 'AMap.Marker')
      );
    }
  }

  handleInputChange = ({ target: { value } }) => {
    const { onChange } = this.props;
    onChange && onChange(value);
  }

  handleSearchChange = (searchValue) => {
    this.setState({
      searchValue,
    });
    this.setOptions(searchValue);
  }

  render() {
    const {
      className,
      value,
      disabled,
    } = this.props;
    const { visible, position, options, searchValue } = this.state;

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
                <LegacyIcon className={styles.icon} type="environment" onClick={this.handleShowModal} />
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
              created: this.handleMapCreated,
              click: !disabled ? this.handleMapClick : undefined,
            }}
            status={{
              keyboardEnable: false,
            }}
            center={position}
          >
            {position && (
              <Marker
                position={position}
                events={{
                  created: this.handleMarkerCreated,
                }}
              />
            )}
            {!disabled && (
              <AutoComplete
                className={styles.autoComplete}
                placeholder="请输入搜索位置"
                value={searchValue}
                onChange={this.handleSearchChange}
                onSelect={this.handleSearchSelect}
                optionLabelProp="name"
                dropdownMatchSelectWidth={false}
              >
                {options && options.map(option => (
                  <Option key={option.id || `${option.district}${option.name}`} name={option.name} data={option}>
                    {option.name}<span className={styles.optionTip}>{option.district}</span>
                  </Option>
                ))}
              </AutoComplete>
            )}
          </Map>
        </Modal>
      </div>
    );
  }
}
