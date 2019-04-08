import React, { Fragment, PureComponent } from 'react';

import styles from './MaintenanceDrawer.less';
import Slider from '../components/Slider';
import DrawerContainer from '../components/DrawerContainer';
import SwitchHead from '../components/SwitchHead';
import FireDynamicCard from '../components/FireDynamicCard';

const ID = 'maintenance-drawer';

export default class MaintenanceDrawer extends PureComponent {
  state = { index: 0 };

  handleLeftClick = () => {
    this.setState(({ index }) => ({ index: index - 1 }));
  };

  handleRightClick = () => {
    this.setState(({ index }) => ({ index: index + 1 }));
  };

  render() {
    const { title, type, data, companyName, onClose, ...restProps } = this.props;
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
          <FireDynamicCard type={type} data={list[0]} />
        ) : (
          <Fragment>
            <SwitchHead
              index={index}
              title={type === 'fault' ? '故障' : '火警'}
              lastIndex={length - 1}
              handleLeftClick={this.handleLeftClick}
              handleRightClick={this.handleRightClick}
            />
            <div className={styles.sliderContainer}>
              <Slider index={index} length={length} size={1}>
                {list.map((item, i) => (
                  <FireDynamicCard
                    key={i}
                    type={type}
                    data={item}
                    style={{ width: `calc(100% / ${length})` }}
                  />
                ))}
              </Slider>
            </div>
          </Fragment>
        );

    return (
      <DrawerContainer
        id={ID}
        title={title}
        zIndex={2000}
        subTitle={companyName}
        width={535}
        left={left}
        onClose={() => {
          this.setState({ index: 0 });
          onClose();
        }}
        {...restProps}
      />
    );
  }
}
