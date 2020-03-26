import React from 'react';
import { Card, Row, Col, Tooltip } from 'antd';
import EmptyText from '@/jingan-components/View/EmptyText';
import Ellipsis from '@/components/Ellipsis';
import Link from '@/jingan-components/View/Link';
import { stringify } from 'qs';
import moment from 'moment';
import { toFixed } from '@/utils/utils';
import { FORMAT } from '../../config';
import styles from './index.less';

const GRID = {
  xxl: 12,
  sm: 24,
  xs: 24,
};

const Tank = ({
  data: {
    id,
    name,
    storageMaterialNames,
    reserves,
    warnStatus,
    allMonitorParam,
    dangerSource,
    videoList = [],
    type,
    dangerSourceId,
    noFinishWarnProcessCount,
  } = {},
  securityUrl,
  hasAlarmWorkOrderAuthority,
  hasTankAuthority,
  hasSecurityAuthority,
  onVideoClick,
  majorHazardName,
}) => {
  const isAlarm = +warnStatus === -1;
  return (
    <Card className={styles.container}>
      <div
        className={styles.wrapper}
        style={{
          backgroundImage: `url(${
            isAlarm
              ? 'http://data.jingan-china.cn/v2/icons/icon-tank-alarm.png'
              : 'http://data.jingan-china.cn/v2/icons/icon-tank-normal.png'
          })`,
        }}
      >
        <div className={styles.paramList}>
          {allMonitorParam &&
            allMonitorParam.map(
              ({
                id,
                sensorId,
                paramDesc,
                paramUnit,
                realValue,
                status,
                linkStatus,
                linkStatusUpdateTime,
                dataUpdateTime,
                condition,
                limitValue,
                warnLevel,
              }) => (
                <div className={styles.paramItem} key={`${id}${sensorId}`}>
                  <div className={styles.paramItemName}>{paramDesc}</div>
                  <Tooltip
                    title={
                      +linkStatus !== -1 ? (
                        status > 0 ? (
                          <div>
                            <div>{`${condition === '>=' ? '超过' : '低于'}${
                              +status === 1 ? '预' : '告'
                            }警阈值 ${toFixed(Math.abs(realValue - limitValue))} ${paramUnit ||
                              ''}`}</div>
                            <div>{`最近更新时间：${moment(dataUpdateTime).format(FORMAT)}`}</div>
                          </div>
                        ) : (
                          `最近更新时间：${moment(dataUpdateTime).format(FORMAT)}`
                        )
                      ) : (
                        `失联时间：${moment(linkStatusUpdateTime).format(FORMAT)}`
                      )
                    }
                  >
                    <div
                      className={styles.paramItemValue}
                      style={{ color: status > 0 ? '#f5222d' : undefined }}
                    >
                      {+linkStatus !== -1 ? realValue : '--'}
                    </div>
                  </Tooltip>
                  <div className={styles.paramItemUnit}>{paramUnit}</div>
                </div>
              )
            )}
        </div>
        {isAlarm && (
          <div className={styles.alarmWrapper}>
            {noFinishWarnProcessCount > 0 && (
              <Link
                className={styles.alarmHandler}
                to={`/company-iot/alarm-work-order/list?${stringify({
                  monitorObjectType: type,
                  monitorObject: id,
                  monitorObjectName: name,
                  isMajorHazard: '1',
                  majorHazardId: dangerSourceId,
                  majorHazardName,
                  status: '2,0',
                })}`}
                disabled={!hasAlarmWorkOrderAuthority}
              >
                处理报警
              </Link>
            )}
          </div>
        )}
        <div className={styles.fieldContainer}>
          {videoList &&
            videoList.length > 0 && (
              <div
                className={styles.videoIcon}
                onClick={() => {
                  onVideoClick && onVideoClick(videoList);
                }}
              />
            )}
          {[
            {
              key: '储罐',
              value: name,
            },
            { key: '存储物质', value: storageMaterialNames },
            { key: '设计储量', value: reserves !== null && `${reserves}t` },
            {
              key: '是否高危储罐',
              value: +dangerSource === 1 ? '是' : '否',
            },
          ].map(({ key, value }) => (
            <div className={styles.fieldWrapper} key={key}>
              <div className={styles.fieldName}>{key}：</div>
              <div className={styles.fieldValue}>
                {value ? (
                  <Ellipsis lines={1} tooltip>
                    {value}
                  </Ellipsis>
                ) : (
                  <EmptyText />
                )}
              </div>
            </div>
          ))}
        </div>
        <Row>
          <Col className={styles.col} {...GRID}>
            <Link
              to={`/major-hazard-info/storage-management/edit/${id}`}
              disabled={!hasTankAuthority}
            >
              储罐基础信息>>
            </Link>
          </Col>
          <Col className={styles.col} {...GRID}>
            <Link to={`${securityUrl}/${id}`} disabled={!hasSecurityAuthority}>
              查看安防措施>>
            </Link>
          </Col>
        </Row>
      </div>
    </Card>
  );
};

export default Tank;
