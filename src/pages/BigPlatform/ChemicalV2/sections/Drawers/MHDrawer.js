import React, { PureComponent, Fragment } from 'react';
import DrawerContainer from '../../components/DrawerContainer';
import TypeCard from '../../components/TypeCard';
import { Warehouse, CardItem, MonitorBtns, NoData } from '../../components/Components';
import { MonitorConfig } from '../../utils';
import styles from './MHDrawer.less';

import positionIcon from '../../imgs/drawer/drawer-position.png';

const NO_DATA = '暂无数据';

export default class PoisonDrawer extends PureComponent {
  handleClickTankDetail = id => {
    const { detailUrl } = MonitorConfig['302'] || {};
    detailUrl && id && window.open(`${window.publicPath}#/${detailUrl}/${id}`);
  };

  render() {
    const {
      visible,
      handleClose,
      mhList = [{}],
      chemicalDetail: { chineName, casNo },
      chemicalDetail,
      handleShowVideo,
      handleShowChemicalDetail,
    } = this.props;

    return (
      <DrawerContainer
        title="重点监管危化品生产存储场所"
        visible={visible}
        onClose={handleClose}
        width={535}
        destroyOnClose
        zIndex={1322}
        icon={positionIcon}
        left={
          <div className={styles.container}>
            <div className={styles.head}>
              <p style={{ position: 'relative' }}>
                <span className={styles.cyan}>重点监管危险化学品：</span>
                {chineName}
                <div
                  className={styles.detail}
                  onClick={() => handleShowChemicalDetail(chemicalDetail)}
                  style={{ right: 0 }}
                >
                  安全措施和应急处置措施>>
                </div>
              </p>
              <p>
                <span className={styles.cyan}>CAS号：</span>
                {casNo || NO_DATA}
              </p>
            </div>
            <div className={styles.cards}>
              {mhList.length > 0 ? (
                mhList.map((item, index) => {
                  const { target } = item;
                  let content;
                  switch (+item.type) {
                    case 302:
                      // 储罐
                      const monitorType = '302';
                      const { fields, icon, iconStyle, labelStyle, btnStyles, moreStyle } =
                        MonitorConfig[monitorType] || {};
                      const { videoList, meList, id, name, tankName } = target;
                      const newItem = {
                        ...target,
                        icon: typeof icon === 'function' ? icon(target) : icon,
                      };
                      const { noFinishWarningProcessId, id: monitorEquipmentId } = meList[0] || {};

                      content = (
                        <CardItem
                          key={index}
                          data={newItem}
                          fields={fields.filter(item => item.value !== 'chineName')}
                          iconStyle={iconStyle}
                          labelStyle={{ ...labelStyle }}
                          fieldsStyle={{ lineHeight: '32px' }}
                          style={{ margin: '15px 0' }}
                          extraBtn={
                            <Fragment>
                              <MonitorBtns
                                videoList={videoList}
                                onVideoClick={handleShowVideo}
                                noFinishWarningProcessId={noFinishWarningProcessId}
                                monitorEquipmentId={monitorEquipmentId}
                                style={{ top: 15, ...btnStyles }}
                                targetId={id}
                                targetType={monitorType}
                                targetName={monitorType === '302' ? tankName : name}
                              />
                              {/* <div
                                className={styles.detail}
                                onClick={() => this.handleClickTankDetail(target.id)}
                                style={{ ...moreStyle }}
                              >
                                详情>>
                              </div> */}
                            </Fragment>
                          }
                        />
                      );
                      break;
                    case 304:
                      // 库房
                      content = (
                        <Warehouse
                          data={target}
                          key={index}
                          style={{ margin: '15px 0' }}
                          handleShowVideo={handleShowVideo}
                          outBorder
                          isChemical
                        />
                      );
                      break;
                    default:
                      content = (
                        <TypeCard
                          data={item}
                          key={index}
                          style={{ margin: '15px 0' }}
                          handleShowVideo={handleShowVideo}
                        />
                      );
                      break;
                  }
                  return content;
                })
              ) : (
                <NoData />
              )}
            </div>
          </div>
        }
      />
    );
  }
}
