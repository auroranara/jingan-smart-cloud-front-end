import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import Ellipsis from 'components/Ellipsis';

import DrawerContainer from '../components/DrawerContainer';

import styles from './ResetHostsDrawer.less';

import fireHostIcon from '../../UnitFire/images/fireHostIcon.png';
import hostIcon from '../../UnitFire/images/hostIcon.png';
import resetKeyIcon from '../../UnitFire/images/resetKey.png';
import resetKeyPressIcon from '../../UnitFire/images/resetKeyPress.png';

/**
 * 复位主机
 */
const Host = ({ data, onClick }) => {
  const { id, deviceCode, installLocation, isReset, isFire } = data;
  const hostInfoItemClassName =
    +isFire && !isReset ? `${styles.hostInfoItem} ${styles.fireHostInfoItem}` : styles.hostInfoItem;
  return (
    <div className={styles.hostContainer} key={id}>
      <div className={styles.hostIconContainer}>
        <img src={+isFire && !isReset ? fireHostIcon : hostIcon} alt="" />
      </div>
      <div className={styles.hostInfoContainer}>
        <div className={hostInfoItemClassName}>
          <span>主机编号：</span>
          <span>{deviceCode}</span>
        </div>
        <div className={hostInfoItemClassName}>
          <span>安装位置：</span>
          <span>{installLocation}</span>
        </div>
      </div>
      <div
        className={styles.hostResetButton}
        style={{ cursor: isReset ? 'not-allowed' : 'pointer' }}
        onClick={isReset ? undefined : onClick}
      >
        <img src={isReset ? resetKeyPressIcon : resetKeyIcon} alt="" />
      </div>
    </div>
  );
};

export default class ResetHostsDrawer extends PureComponent {
  state = {};

  componentDidMount() {}

  render() {
    const { visible, hosts, handleResetSingleHost, handleResetAllHosts } = this.props;
    const isResetAll = hosts.filter(({ isReset }) => isReset).length === hosts.length;

    const left = (
      <div className={styles.content}>
        {hosts.length !== 0 ? (
          <div className={styles.scrollContainer}>
            {hosts.map(item => {
              const { id } = item;
              return (
                <Host
                  key={id}
                  data={item}
                  onClick={() => {
                    handleResetSingleHost(id);
                  }}
                />
              );
            })}
            <div className={styles.hostSectionBottom}>
              <div className={styles.hostNumber}>
                <span>主机数量：</span>
                <span>{hosts.length}</span>
              </div>
              <div
                className={styles.resetAllHostsButton}
                style={{
                  cursor: isResetAll ? 'not-allowed' : undefined,
                  backgroundColor: isResetAll ? '#0D3473' : undefined,
                  color: isResetAll ? '#0967d3' : undefined,
                }}
                onClick={isResetAll ? undefined : handleResetAllHosts}
              >
                全部复位
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.hostIsEmpty}>
            <span>暂无主机</span>
          </div>
        )}
      </div>
    );

    return (
      <DrawerContainer
        style={{ overflow: 'hidden' }}
        destroyOnClose={true}
        title={'一键复位'}
        width={535}
        visible={visible}
        left={left}
        placement="right"
        onClose={() => {
          this.props.onClose();
        }}
      />
    );
  }
}
