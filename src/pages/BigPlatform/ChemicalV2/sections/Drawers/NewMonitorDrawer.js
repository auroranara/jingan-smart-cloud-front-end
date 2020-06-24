import React, { PureComponent, Fragment } from 'react';
import { Input, Spin } from 'antd';
import DrawerContainer from '../../components/DrawerContainer';
import { CardItem, MonitorBtns, NoData } from '../../components/Components';
import { MonitorConfig } from '../../utils';
import styles from './NewMonitorDrawer.less';

const { Search } = Input;
export default class NewMonitorDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchVisible: false,
      inputValue: '',
    };
  }

  handleClickMonitorDetail = id => {
    const { monitorType } = this.props;
    const { detailUrl } = MonitorConfig[monitorType] || {};
    detailUrl && id && window.open(`${window.publicPath}#/${detailUrl}/${id}`);
  };

  handleSearchClick = () => {
    const { searchVisible } = this.state;
    this.setState({ searchVisible: !searchVisible, inputValue: '' });
  };

  handleSearch = e => {
    this.setState({ inputValue: e });
  };

  render() {
    const {
      visible,
      onClose,
      monitorData,
      handleClickMonitorDetail,
      monitorType,
      handleShowVideo,
      loading,
      onSecurityClick,
    } = this.props;
    const { inputValue, searchVisible } = this.state;
    const {
      title,
      fields,
      icon,
      iconStyle,
      labelStyle,
      btnStyles,
      moreStyle,
      drawerIcon,
      filters,
      filtersPlaceholder,
    } = MonitorConfig[monitorType] || {};
    const list = monitorData[monitorType] || [];
    const filterList = list.filter(item => {
      if (!filters) return true;
      else return filters(item, inputValue);
    });

    return (
      <DrawerContainer
        title={`${title} (${filterList.length})`}
        visible={visible}
        onClose={() => {
          setTimeout(() => {
            this.setState({ searchVisible: false, inputValue: '' });
          }, 300);
          onClose();
        }}
        width={535}
        destroyOnClose={true}
        zIndex={1299}
        icon={drawerIcon}
        onSearchClick={filters ? this.handleSearchClick : undefined}
        left={
          <div className={styles.container}>
            <Spin spinning={loading} wrapperClassName={styles.spin}>
              {searchVisible && (
                <div className={styles.radioBtn}>
                  <div className={styles.input}>
                    <Search
                      style={{ width: '100%' }}
                      placeholder={filtersPlaceholder}
                      onSearch={this.handleSearch}
                      enterButton
                    />
                  </div>
                </div>
              )}

              {filterList.length > 0 ? (
                filterList.map((item, index) => {
                  const {
                    monitorParams,
                    allMonitorParam,
                    videoList,
                    meList,
                    id,
                    name,
                    tankName,
                  } = item;
                  const newItem = {
                    ...item,
                    icon: typeof icon === 'function' ? icon(item) : icon,
                  };
                  const paramList = monitorParams || allMonitorParam || {};
                  const { id: monitorEquipmentId } = meList[0] || {};
                  const noFinishWarningProcessId = !meList.every(item => {
                    const { noFinishWarningProcessId } = item;
                    return !noFinishWarningProcessId;
                  });

                  return (
                    <CardItem
                      key={index}
                      data={newItem}
                      fields={fields}
                      iconStyle={iconStyle}
                      labelStyle={{ color: '#8198b4', ...labelStyle }}
                      fieldsStyle={{ lineHeight: '32px' }}
                      style={{ border: '1px solid #1C5D90' }}
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
                          {/* <div className={styles.detail} onClick={() => handleClickMonitorDetail(item)}> */}
                          {monitorType !== '302' && (
                            <div
                              className={styles.detail}
                              onClick={() => this.handleClickMonitorDetail(item.id)}
                              style={{ ...moreStyle }}
                            >
                              详情>>
                            </div>
                          )}
                        </Fragment>
                      }
                      onSecurityClick={onSecurityClick}
                    />
                  );
                })
              ) : (
                <NoData
                  style={{
                    height: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'center',
                    color: '#4f6793',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                  }}
                />
              )}
            </Spin>
          </div>
        }
      />
    );
  }
}
