import React, { PureComponent } from 'react';
import { Modal, Input, message } from 'antd';
import { Map, Marker } from 'react-amap';

import styles from './index.less';

const { Search } = Input;

/**
 * 地图定位模态框
 */
export default class App extends PureComponent {
  /**
   * 搜索按钮点击事件
   */
  handleSearch = value => {
    const { onSearch } = this.props;
    if (value) {
      /* eslint-disable */
      AMap.plugin('AMap.Geocoder', () => {
        const geocoder = new AMap.Geocoder();
        geocoder.getLocation(value, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            const { lng: longitude, lat: latitude } = result.geocodes[0].location;
            onSearch({
              longitude,
              latitude,
            });
          } else {
            message.warning('您输入的地址没有解析到结果!');
          }
        });
      });
      /* eslint-enable */
    }
  };

  /**
   * 重置按钮点击事件
   */
  handleReset = () => {
    const { onReset } = this.props;
    // 清空搜索输入框
    this.input.input.input.value = '';
    // 调用传入的重置函数
    onReset();
  }

  render() {
    const {
      // 标题
      title='地图定位',
      // 模态框是否显示
      visible,
      // 确定按钮点击事件
      onOk,
      // 关闭按钮点击事件
      onCancel,
      // 地图点击事件
      onClick,
      // 地图中心
      center,
      // 地图选中点坐标
      point,
    } = this.props;

    return (
      <Modal
        className={styles.mapModal}
        title={title}
        width="80%"
        visible={visible}
        okText="确认"
        onOk={onOk}
        okButtonProps={{ disabled: !point }}
        cancelText="重置"
        onCancel={onCancel}
        cancelButtonProps={{ onClick: this.handleReset }}
        // footer={null}
        maskClosable={false}
        keyboard={false}
        destroyOnClose
      >
        <Map
          amapkey="08390761c9e9bcedbdb2f18a2a815541"
          plugins={['Scale', { name: 'ToolBar', options: { locate: false } }]}
          status={{
            keyboardEnable: false,
          }}
          center={center}
          useAMapUI
          events={{
            click: e => {
              const { lng: longitude, lat: latitude } = e.lnglat;
              onClick({
                longitude,
                latitude,
              });
            },
          }}
        >
          <div style={{ position: 'absolute', top: 10, left: 10, backgroundColor: 'transparent' }}>
            <Search placeholder="请输入地址" enterButton onSearch={this.handleSearch} ref={input => {this.input=input;}} />
          </div>
          {point && (
            <Marker
              position={point}
              // events={{
              //   click: () => {
              //     /* eslint-disable */
              //     AMap.plugin('AMap.Geocoder', () => {
              //       const { longitude, latitude } = point;
              //       const geocoder = new AMap.Geocoder();
              //       geocoder.getAddress([longitude, latitude], (status, result) => {
              //         if (status === 'complete' && result.info === 'OK') {
              //           confirm({
              //             title: '您确定要选择当前地址吗？',
              //             content: `当前地址：${result.regeocode.formattedAddress}`,
              //             okText: '确定',
              //             cancelText: '取消',
              //             onOk: () => {
              //               const {
              //                 form: { setFieldsValue },
              //               } = this.props;
              //               setFieldsValue({
              //                 coordinate: `${longitude},${latitude}`,
              //               });
              //               this.handleHideMap();
              //             },
              //           });
              //         } else {
              //           message.warning('未匹配到您当前选中的地址！');
              //         }
              //       });
              //     });
              //     /* eslint-enable */
              //   },
              // }}
            />
          )}
        </Map>
      </Modal>
    );
  }
}
