import React, { PureComponent, Fragment } from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Tooltip } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import DrawerContainer from '../../components/DrawerContainer';
// import styles from './MonitorDrawer.less';
import { CardItem, RadioBtns, NoData, TankArea } from '../../components/Components';
import styles from './DangerSourceDrawer.less';

import dangerSourceIcon from '../../imgs/drawer/drawer-danger-source.png';

const NO_DATA = '暂无数据';
const hasAlarm = list => {
  return !list.every(item => {
    const { monitorParams } = item;
    const alarm = monitorParams.filter(item => +item.status > 0).length;
    return alarm === 0;
  });
};
const Size = 4;
const DefaultStates = {
  active: 0,
  page: 0,
};

@connect(({ surroundEnvirInfo }) => ({ surroundEnvirInfo }))
export default class DangerSourceDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ...DefaultStates,
    };
  }

  componentDidMount() {
    this.fetchEnvirInfoList();
  }

  fetchEnvirInfoList = () => {
    const { dispatch, companyId } = this.props;
    dispatch({
      type: 'surroundEnvirInfo/fetchEnvirInfoList',
      payload: {
        pageNum: 1,
        pageSize: 0,
        companyId,
      },
    });
  };

  handleClickLvl = detail => {
    const { handleShowDangerSourceDetail, setDrawerVisible } = this.props;
    handleShowDangerSourceDetail(detail);
    setDrawerVisible('dangerSourceLvl');
  };

  handleClickRadio = val => {
    this.setState({ active: val });
  };

  handlePageChange = page => {
    this.setState({ page });
  };

  handleClickDetail = id => {
    const { companyId } = this.props;
    window.open(
      `${
        window.publicPath
      }#/monitoring-and-early-warning/major-hazard-distribution/${companyId}/detail/${id}`
    );
  };

  handleClickSurround = () => {
    const { companyId } = this.props;
    window.open(
      `${
        window.publicPath
      }#/major-hazard-info/surrounding-environment-info/list?companyId=${companyId}`
    );
  };

  render() {
    const {
      visible,
      onClose,
      dangerSourceList: list = [],
      handleShowVideo,
      surroundEnvirInfo: {
        envirData: {
          pagination: { total },
        },
      },
    } = this.props;
    const BasicFields = [
      {
        label: '等级',
        value: 'dangerLevel',
        render: val => ['一级', '二级', '三级', '四级'][val - 1],
        extra: val => (
          <div className={styles.detail} onClick={() => this.handleClickLvl(val)}>
            等级评估参考>>
          </div>
        ),
      },
      {
        label: '存储物质',
        value: 'msdsList',
        render: val => (val && val.length ? val.map(item => item.chineName).join('、') : NO_DATA),
      },
      {
        label: '责任人',
        value: 'dutyPerson',
        render: val => (val ? val.split(',').join(' ') : NO_DATA),
      },
      {
        value: 'location',
        render: val => {
          return (
            <span>
              <LegacyIcon type="environment" style={{ color: '#8198b4', marginRight: 5 }} />
              {val}
            </span>
          );
        },
        extra: ({ id }) => (
          <div className={styles.detail} onClick={() => this.handleClickDetail(id)}>
            详情>>
          </div>
        ),
      },
    ];
    const { active, page } = this.state;
    const {
      dangerSourceList: {
        gasHolderManage = [],
        industryPipeline = [],
        productDevice = [],
        tankArea = [],
        wareHouseArea = [],
      } = {},
    } = list[active] || {};
    // const next = list.slice(page * Size, (page + 1) * Size);
    // const nextIcon = hasAlarm(next) && (
    //   <div className={styles.pageBtns}>
    //     <LegacyIcon type="right" />
    //     <div className={styles.dot} />
    //   </div>
    // );
    // const prev = list.slice((page - 2) * Size, (page - 1) * Size);
    // const prevIcon = hasAlarm(prev) && (
    //   <div className={styles.pageBtns}>
    //     <LegacyIcon type="left" />
    //     <div className={styles.dot} style={{ left: 2, right: 'auto' }} />
    //   </div>
    // );

    return (
      <DrawerContainer
        title="重大危险源"
        visible={visible}
        onClose={() => {
          setTimeout(() => {
            this.setState({ ...DefaultStates });
          }, 300);
          onClose();
        }}
        width={535}
        destroyOnClose={true}
        zIndex={1222}
        icon={dangerSourceIcon}
        left={
          <div className={styles.container}>
            {list.length > 1 && (
              <div className={styles.radioBtn}>
                <RadioBtns
                  value={active}
                  onClick={this.handleClickRadio}
                  fields={list.map((item, index) => ({
                    label: item.name,
                    render: () => {
                      // const { monitorParams } = item;
                      // const alarm = monitorParams.filter(item => +item.status > 0).length;
                      const name = item.name;
                      const len = 7;
                      // const len = alarm > 0 ? 5 : 7;
                      const nameContent =
                        name && name.length > len ? (
                          <Tooltip
                            placement="bottom"
                            title={name}
                            overlayStyle={{ zIndex: 9999 }}
                          >{`${name.substr(0, len)}...`}</Tooltip>
                        ) : (
                          name
                        );
                      return (
                        <span key={index} style={{ whiteSpace: 'nowrap' }}>
                          {nameContent}
                          {/* {alarm > 0 && <span className={styles.alarmNum}>{alarm}</span>} */}
                        </span>
                      );
                    },
                  }))}
                  handlePageChange={this.handlePageChange}
                  // nextIcon={nextIcon}
                  // prevIcon={prevIcon}
                />
              </div>
            )}
            {list.length > 0 ? (
              <Fragment>
                <div className={styles.basic}>
                  <CardItem
                    data={list[active]}
                    fields={BasicFields}
                    labelStyle={{ color: '#8198b4' }}
                    fieldsStyle={{ lineHeight: '32px' }}
                    style={{ border: 'none' }}
                  />
                  <div className={styles.surround}>
                    周边环境 ({total})
                    <div
                      className={styles.detail}
                      style={{ right: 15, top: 10 }}
                      onClick={this.handleClickSurround}
                    >
                      详情>>
                    </div>
                  </div>
                </div>
                {tankArea.map((item, index) => (
                  <TankArea key={index} data={item} handleShowVideo={handleShowVideo} bordered />
                ))}
              </Fragment>
            ) : (
              <NoData />
            )}
            {/* {list.map((item, index) => (
              <CardItem
                key={index}
                data={item}
                fields={fields}
                onClick={() => this.handleClick(item)}
              />
            ))} */}
          </div>
        }
      />
    );
  }
}
