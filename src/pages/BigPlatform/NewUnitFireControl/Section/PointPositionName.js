import React, { PureComponent, Fragment } from 'react';
import { Col, Table } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import moment from 'moment';
import ImageCard from '@/components/ImageCard';

import styles from './PointPositionName.less';
import DrawerContainer from '../components/DrawerContainer';
import PointError from '../imgs/pointError.png';
import lastCheckPoint from '../imgs/lastCheckPoint.png';
import normalCheckPoint from '../imgs/normalCheckPoint.png';
import waitCheckPoint from '../imgs/waitCheckPoint.png';

const columns = [
  {
    title: '巡查日期',
    dataIndex: 'check_date',
    key: 'check_date',
    align: 'center',
    render: time => {
      return moment(time).format('YYYY-MM-DD');
    },
  },
  {
    title: '巡查人',
    dataIndex: 'user_name',
    key: 'user_name',
    align: 'center',
  },
  {
    title: '巡查状态',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    render: val => {
      return +val === 1 ? <span>正常</span> : <span style={{ color: '#ff4848' }}>异常</span>;
    },
  },
  {
    title: '处理结果',
    dataIndex: 'data',
    key: 'data',
    align: 'center',
    width: '50',
    render: val => {
      const { finish, overTime, rectifyNum, reviewNum } = val;
      const resultStatus = ['已超期', '待整改', '待复查', '已关闭'];
      const nums = [overTime, rectifyNum, reviewNum, finish];
      return (
        <div className={+val.status === 1 ? null : styles.resultError}>
          <Ellipsis length={5} tooltip>
            {resultStatus
              .map((data, index) => {
                return nums[index] ? `${data} ${nums[index]}` : '';
              })
              .filter(data => data)
              .join('/')}
          </Ellipsis>
        </div>
      );
    },
  },
];

export default class PointPositionName extends PureComponent {
  handleStatusPhoto = status => {
    //2待整改   3待复查, 7  超期未整改
    switch (+status) {
      case 2:
        return 'http://data.jingan-china.cn/v2/big-platform/safety/com/wcq.png';
      case 3:
        return 'http://data.jingan-china.cn/v2/big-platform/safety/com/dfc.png';
      case 7:
        return 'http://data.jingan-china.cn/v2/big-platform/safety/com/ycq.png';
      default:
        return '';
    }
  };

  render() {
    const {
      visible,
      pointRecordLists,
      checkAbnormal,
      count,
      checkStatus,
      currentHiddenDanger: { list = [] },
      checkItemId,
      checkPointName,
      handlePointDangerDetail,
      ...restProps
    } = this.props;
    const dangerList = list.filter(item => item.item_id === checkItemId);

    const currentStatus =
      (+checkStatus === 2 && PointError) ||
      (+checkStatus === 1 && normalCheckPoint) ||
      (+checkStatus === 4 && lastCheckPoint) ||
      (+checkStatus === 3 && waitCheckPoint) ||
      null;

    const cards = dangerList.map((item, index) => {
      const {
        desc,
        report_user_name,
        report_time,
        rectify_user_name,
        item_name,
        plan_rectify_time,
        real_rectify_time,
        status,
        hiddenDangerRecordDto,
      } = item;
      return (
        <ImageCard
          key={index}
          style={{ marginBottom: '1em' }}
          extraStyle={true}
          showRightIcon={true}
          showStatusLogo={true}
          isCardClick={true}
          onCardClick={() => {
            handlePointDangerDetail(item);
          }}
          contentList={[
            { label: '隐患描述', value: desc || '暂无数据' },
            {
              label: '上报',
              value: (
                <Fragment>
                  {report_user_name}
                  <span className={styles.text}>{moment(+report_time).format('YYYY-MM-DD')}</span>
                </Fragment>
              ),
            },
            {
              label: +status === 3 ? '实际整改' : '计划整改',
              value:
                +status === 3 ? (
                  <Fragment>
                    {rectify_user_name}
                    <span className={styles.text}>
                      {moment(+real_rectify_time).format('YYYY-MM-DD')}
                    </span>
                  </Fragment>
                ) : (
                  <Fragment>
                    {rectify_user_name}
                    <span className={+status === 7 ? styles.warningText : styles.text}>
                      {moment(+plan_rectify_time).format('YYYY-MM-DD')}
                    </span>
                  </Fragment>
                ),
            },
            { label: '检查点', value: <span>{item_name || '暂无数据'}</span> },
          ]}
          statusLogo={this.handleStatusPhoto(status)}
          photo={hiddenDangerRecordDto[0].fileWebUrl.split(',')[0]}
        />
      );
    });

    const left = (
      <div className={styles.container}>
        <div className={styles.circleContainer}>
          <Col span={10} className={styles.currentTitle}>
            <span>当前状态</span>
          </Col>
          <Col span={14} className={styles.statusIcon}>
            <div
              className={styles.icon}
              style={{
                backgroundImage: `url(${currentStatus})`,
              }}
            />
          </Col>
        </div>

        {+checkStatus !== 1 &&
          dangerList &&
          dangerList.length > 0 && (
            <div className={styles.cardsTitle}>
              <p className={styles.titleP}>
                当前隐患
                <span className={styles.titleSpan}>({dangerList.length})</span>
              </p>
            </div>
          )}

        {+checkStatus !== 1 &&
          dangerList &&
          dangerList.length > 0 && (
            <div className={styles.cards}>
              <div className={styles.cardsMain}>
                {dangerList.length ? (
                  cards
                ) : (
                  <div style={{ textAlign: 'center', color: '#fff' }}>{'暂无数据'}</div>
                )}
              </div>
            </div>
          )}

        <div className={styles.recordTitle}>
          <p className={styles.titleP}>
            巡查记录
            <span className={styles.titleSpan}>
              (共
              {count}
              次，异常
              {checkAbnormal}
              次)
            </span>
          </p>
        </div>
        <div className={styles.record}>
          <div className={styles.recordTable}>
            <Table rowKey="check_id" columns={columns} dataSource={pointRecordLists} pageSize="5" />
          </div>
        </div>
      </div>
    );

    return (
      <DrawerContainer
        title={checkPointName}
        destroyOnClose={true}
        zIndex={2000}
        width={485}
        visible={visible}
        left={left}
        placement="right"
        {...restProps}
      />
    );
  }
}
