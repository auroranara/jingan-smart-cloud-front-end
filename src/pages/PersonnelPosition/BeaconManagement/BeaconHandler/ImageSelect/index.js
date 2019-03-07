import React, { PureComponent, Fragment } from 'react';
import {
  Row,
  Col,
  Modal,
  Radio,
} from 'antd';
// 引入样式文件
import styles from './index.less';

export default class ImageSelect extends PureComponent {
  state = {
    // 是否显示图片选择弹出框
    visible: false,
    // 当前选中的地图id
    currentMapId: undefined,
  };

  // 显示图片弹出框
  handleShowImageModal = () => {
    const { value } = this.props;
    this.setState({ visible: true, currentMapId: value });
  }

  // 确定选择图片
  handleImageModalOk = () => {
    const { onChange } = this.props;
    const { currentMapId } = this.state;
    this.setState({ visible: false });
    if (onChange) {
      onChange(currentMapId);
    }
  }

  // 取消选择图片
  handleImageModalCancel = () => {
    this.setState({ visible: false });
  }

  render() {
    const { value, images=[], imagesMap={} } = this.props;
    const { currentMapId, visible } = this.state;
    const image = imagesMap[value] && JSON.parse(imagesMap[value].mapPhoto);

    return (
      <Fragment>
        <div
          className={styles.imageSelect}
          style={{ background: image?`url(${image.url}) no-repeat center / contain`:`url('data:image/svg+xml;charset=utf8,${encodeURI('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" t="1551947157327" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" p-id="1105" width="48" height="48"><defs><style type="text/css"/></defs><path d="M469.333333 469.333333V170.666667h85.333334v298.666666h298.666666v85.333334h-298.666666v298.666666h-85.333334v-298.666666H170.666667v-85.333334h298.666666z" fill="#999999" p-id="1106"/></svg>')}') no-repeat center / 36px` }}
          onClick={this.handleShowImageModal}
        />
        <Modal
          title="所属地图"
          visible={visible}
          width={800}
          onCancel={this.handleImageModalCancel}
          onOk={this.handleImageModalOk}
        >
          {images.length > 0 ? (
            <Row gutter={16}>
              {images.map(({ id, mapName, mapPhoto }) => {
                const image = JSON.parse(mapPhoto);
                return (
                <Col span={12} key={id}>
                  <div className={styles.imageWrapper} style={{ backgroundImage: `url(${image && image.url})` }} />
                  <div className={styles.radioWrapper}>
                    <Radio
                      value={id}
                      onChange={() => this.setState({ currentMapId: id })}
                      checked={id === currentMapId}
                    >
                      {mapName}
                    </Radio>
                  </div>
                </Col>
              )
            })}
            </Row>
          ) : (
            <div className={styles.empty}>暂无数据</div>
          )}
        </Modal>
      </Fragment>
    );
  }
}
