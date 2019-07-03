import React, { PureComponent } from 'react';
import { Modal } from 'antd';
import styles from './index.less';
import Thumbnail from '@/components/Thumbnail';
import dot from './dot.png';
/**
 * 四色图坐标定位
 */
export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      position: null,
      index: 0,
      pageNum: 1,
    };
    this.tempState = null;
  }

  componentDidUpdate({ visible: prevVisible }) {
    const { visible, xNum, yNum, isImgSelect, urls, imgIdCurrent } = this.props;

    // const imgId = urls.map(item => item.id);
    // const imgIndex = imgId.indexOf(imgIdCurrent);
    // console.log('urls', urls);
    // console.log('imgId', imgId);
    // console.log('imgIdCurrent', imgIdCurrent);
    // console.log('imgIndex', imgIndex);

    if (!prevVisible && visible) {
      if (this.tempState === null) {
        if (isImgSelect === false) {
          this.setState({
            position: null,
            index: 0,
            pageNum: 1,
          });
        } else {
          this.setState({
            position: {
              x: xNum ? parseFloat(xNum) : null,
              y: yNum ? parseFloat(yNum) : null,
            },
            index: 0,
            pageNum: 1,
          });
        }
      } else {
        this.setState(this.tempState);
      }
    }
  }

  /**
   * 显示坐标点
   */
  handleShowPoint = e => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = e.target.getBoundingClientRect();
    this.setState({
      position: {
        x: (clientX - left) / width,
        y: (clientY - top) / height,
      },
    });
  };

  /**
   * 缩略图切换
   */
  handleSwitch = index => {
    this.setState({
      position: null,
      index,
    });
  };

  /**
   * 切换分页
   */
  hanldePage = pageNum => {
    this.setState({
      pageNum,
    });
  };

  /**
   * 确认
   */
  handleOk = () => {
    const { onOk, urls } = this.props;
    const { position, index } = this.state;
    if (onOk) {
      onOk(position, urls[index]);
    }
  };

  render() {
    const {
      // 标题
      title = '四色图坐标定位',
      // 弹窗是否显示
      visible,
      // 图片地址
      urls,
      // 确定按钮点击事件
      // onOk,
      // 取消按钮点击事件
      onCancel,
      footer,
      width,
      ratio = '75%',
      noClick = true,
    } = this.props;

    const { position, index, pageNum } = this.state;

    return (
      urls.length > 0 && (
        <Modal
          title={title}
          centered
          footer={footer}
          width={width}
          maskClosable={false}
          visible={visible}
          onOk={this.handleOk}
          onCancel={onCancel}
        >
          <div className={styles.container}>
            <div
              className={styles.pictureContainer}
              style={{
                paddingBottom: ratio,
              }}
            >
              <div
                className={styles.picture}
                style={{
                  backgroundImage: `url(${urls[index].webUrl})`,
                }}
                onClick={this.handleShowPoint}
              />
              {/* 坐标点 */
              noClick &&
                position && (
                  <div
                    className={styles.point}
                    style={{
                      left: `calc(${position.x * 100}% - 16px)`,
                      top: `calc(${position.y * 100}% - 20px)`,
                      backgroundImage: `url(${dot})`,
                    }}
                  />
                )}
            </div>
            <Thumbnail
              ratio={ratio}
              urls={urls}
              onClick={this.handleSwitch}
              onPage={this.hanldePage}
              index={index}
              number={4}
              pageNum={pageNum}
            />
          </div>
        </Modal>
      )
    );
  }
}
