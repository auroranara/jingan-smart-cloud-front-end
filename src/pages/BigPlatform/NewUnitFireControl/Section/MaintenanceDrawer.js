import React, { Fragment, PureComponent } from 'react';

import styles from './MaintenanceDrawer.less';
import Slider from '../components/Slider';
import DrawerContainer from '../components/DrawerContainer';
import SwitchHead from '../components/SwitchHead';
import MaintenanceCard from '../components/MaintenanceCard';

const ID = 'maintenance-drawer';

export default class MaintenanceDrawer extends PureComponent {
  state = { index: 0 };

  handleLeftClick = () => {
    const { handleParentChange, data } = this.props;
    const { index } = this.state;
    const list = Array.isArray(data) ? data : [];
    const videoList = list[index - 1].cameraMessage || [];
    this.setState(({ index }) => ({ index: index - 1 }));
    handleParentChange({ videoList });
  };

  handleRightClick = () => {
    const { handleParentChange, data } = this.props;
    const { index } = this.state;
    const list = Array.isArray(data) ? data : [];
    const videoList = list[index + 1].cameraMessage || [];
    this.setState(({ index }) => ({ index: index + 1 }));
    handleParentChange({ videoList });
  };

  render() {
    const { title, type, data, phoneVisible, ...restProps } = this.props;
    const { index } = this.state;
    const list = Array.isArray(data) ? data : [];
    const length = list.length;

    // 判断是否是维保处理，维保处理动态时，显示流程图，故障处理动态时不显示流程图
    // const isMaintenance = title.includes('维保');

    // 维保只有一个，故障可能是一个或多个
    let left = null;
    if (length)
      left =
        length === 1 ? (
          <MaintenanceCard type={type} phoneVisible={phoneVisible} data={list[0]} />
        ) : (
          <Fragment>
            <SwitchHead
              index={index}
              title="故障"
              lastIndex={length - 1}
              handleLeftClick={this.handleLeftClick}
              handleRightClick={this.handleRightClick}
            />
            <div className={styles.sliderContainer}>
              <Slider index={index} length={length} size={1}>
                {list.map((item, i) => (
                  <MaintenanceCard
                    key={i}
                    type={type}
                    data={item}
                    phoneVisible={phoneVisible}
                    style={{ width: `calc(100% / ${length})` }}
                  />
                ))}
              </Slider>
            </div>
          </Fragment>
        );

    return <DrawerContainer id={ID} title={title} width={535} left={left} {...restProps} />;
  }
}
