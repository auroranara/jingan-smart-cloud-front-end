import React, { PureComponent, Fragment } from 'react';
import { Tooltip } from 'antd';
import { Section2 as CustomSection } from '@/jingan-components/CustomSection';
import Ellipsis from '@/components/Ellipsis';
import { vaguePhone } from '@/pages/BigPlatform/NewUnitFireControl/utils';
import styles from './CompanyInfo.less';
import defaultGasStationIcon from '../imgs/default-gas-station-icon.png';
import { iconCheck, iconHd } from '../imgs/links';

export default class CompanyInfo extends PureComponent {
  render() {
    const {
      handleViewCurrentDanger,
      handleCheckDrawer,
      model: {
        checkCount: { all, overTime },
        companyMessage: {
          companyMessage: { companyName = '' },
        },
        currentHiddenDanger: { overRectifyNum, totalNum },
        maintenanceCompany: {
          PrincipalName = '', //安全管理员
          PrincipalPhone = '',
        },
      },
      phoneVisible,
    } = this.props;

    return (
      <CustomSection
        title="基本信息"
        className={styles.container}
      >
        <div className={styles.top}>
          <div className={styles.topLeft}>
            <div className={styles.topLeftItem} style={{ backgroundImage: `url(${defaultGasStationIcon})` }} />
          </div>
          <div className={styles.topRight}>
            <div className={styles.topRightTop}>
              <Ellipsis className={styles.topRightTopItem} lines={2}>{companyName}</Ellipsis>
            </div>
            <div className={styles.topRightBottom}>
              <div className={styles.topRightBottomItem}>
                <div className={styles.topRightBottomItemLabel}>安全管理员：</div>
                <div className={styles.topRightBottomItemValue}>{PrincipalName}</div>
              </div>
              <div className={styles.topRightBottomItem}>
                <div className={styles.topRightBottomItemLabel} style={{ letterSpacing: '0.25em' }}>联系方式：</div>
                <div className={styles.topRightBottomItemValue}>{vaguePhone(PrincipalPhone, phoneVisible)}</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <Tooltip
            overlayClassName={styles.tooltip}
            placement="bottomRight"
            title={(
              <Fragment>
                <div className={styles.tooltipItem}>
                  <div className={styles.tooltipItemIcon} style={{ backgroundColor: '#f83329' }} />
                  <div className={styles.tooltipItemValue}>
                    超期数
                  </div>
                </div>
                <div className={styles.tooltipItem}>
                  <div className={styles.tooltipItemIcon} style={{ backgroundColor: '#02fcfa' }} />
                  <div className={styles.tooltipItemValue}>
                    总数
                  </div>
                </div>
              </Fragment>
            )}
          >
            <div className={styles.bottomItem} onClick={handleCheckDrawer}>
              <div className={styles.bottomItemIcon} style={{ backgroundImage: `url(${iconCheck})` }} />
              <div className={styles.bottomItemRight}>
                <div className={styles.bottomItemLabel}>检查点</div>
                  <div className={styles.bottomItemValue}><span className={styles.bottomItemValueAlarm}>{overTime}</span>/{all}</div>
              </div>
            </div>
          </Tooltip>
          <Tooltip
            overlayClassName={styles.tooltip}
            placement="bottomRight"
            title={(
              <Fragment>
                <div className={styles.tooltipItem}>
                  <div className={styles.tooltipItemIcon} style={{ backgroundColor: '#f83329' }} />
                  <div className={styles.tooltipItemValue}>
                    超期数
                  </div>
                </div>
                <div className={styles.tooltipItem}>
                  <div className={styles.tooltipItemIcon} style={{ backgroundColor: '#02fcfa' }} />
                  <div className={styles.tooltipItemValue}>
                    当前
                  </div>
                </div>
              </Fragment>
            )}
          >
            <div className={styles.bottomItem} onClick={handleViewCurrentDanger}>
              <div className={styles.bottomItemIcon} style={{ backgroundImage: `url(${iconHd})` }} />
              <div className={styles.bottomItemRight}>
                <div className={styles.bottomItemLabel}>当前隐患</div>
                  <div className={styles.bottomItemValue}><span className={styles.bottomItemValueAlarm}>{overRectifyNum}</span>/{totalNum}</div>
              </div>
            </div>
          </Tooltip>
        </div>
      </CustomSection>
    );
  }
}
