import React from 'react';
import { Card, Carousel, Empty } from 'antd';
import { Icon } from '@ant-design/compatible';
import EmptyText from '@/jingan-components/View/EmptyText';
import Link from '@/jingan-components/View/Link';
import moment from 'moment';
import { toFixed } from '@/utils/utils';
import styles from './index.less';
const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss';

const Gas = ({
  data: {
    id,
    equipmentTypeLogoWebUrl,
    name,
    warnStatus,
    areaLocation,
    videoList,
    noFinishWarningProcessId,
    allMonitorParam,
  } = {},
  hasAlarmWorkOrderAuthority,
  hasMonitorTrendAuthority,
  onVideoClick,
}) => {
  const renderParamValue = ({ realValue, limitValue, status }) => {
    if (!+status) {
      return (
        <div className={styles.paramValueWrapper}>
          <div className={styles.paramValue}>{realValue}</div>
        </div>
      );
    } else if (+status === 1) {
      return (
        <div className={styles.paramValueWrapper}>
          <div className={styles.alarmParamValue}>{realValue}</div>
          <div className={styles.paramTrendWrapper}>
            <Icon className={styles.paramTrendIcon} type="caret-up" style={{ color: '#f5222d' }} />
            <div className={styles.paramTrendValue}>
              {toFixed(Math.abs(realValue - limitValue))}
            </div>
            <div className={styles.paramTrendDescription}>超过预警阈值</div>
          </div>
        </div>
      );
    } else if (+status === 2) {
      return (
        <div className={styles.paramValueWrapper}>
          <div className={styles.alarmParamValue}>{realValue}</div>
          <div className={styles.paramTrendWrapper}>
            <Icon className={styles.paramTrendIcon} type="caret-up" style={{ color: '#f5222d' }} />
            <div className={styles.paramTrendValue}>
              {toFixed(Math.abs(realValue - limitValue))}
            </div>
            <div className={styles.paramTrendDescription}>超过告警阈值</div>
          </div>
        </div>
      );
    }
  };
  const renderParam = item => {
    const { id, linkStatus, linkStatusUpdateTime, dataUpdateTime, paramDesc, paramUnit } = item;
    const isLoss = +linkStatus === -1;
    const updateTime = isLoss ? linkStatusUpdateTime : dataUpdateTime;
    return (
      <div className={styles.paramWrapper} key={id}>
        <div className={styles.paramName}>{`${paramDesc}${
          paramUnit ? `（${paramUnit}）` : ''
        }`}</div>
        {isLoss ? <div className={styles.paramValue}>--</div> : renderParamValue(item)}
        <div className={styles.updateTime}>
          <div>最近更新时间：</div>
          <div>{updateTime && moment(updateTime).format(DEFAULT_FORMAT)}</div>
        </div>
      </div>
    );
  };

  return (
    <Card className={styles.container}>
      <div className={styles.top}>
        <div
          className={styles.basicInfoWrapper}
          style={{ backgroundImage: `url(${equipmentTypeLogoWebUrl})` }}
        >
          <div className={styles.nameWrapper}>
            <div className={styles.nameLabel}>监测设备名称：</div>
            <div className={styles.nameValue}>
              {name}
              {+warnStatus === -1 && <div className={styles.isAlarm} />}
            </div>
          </div>
          <div className={styles.addressWrapper}>
            <Icon type="environment" className={styles.addressIcon} title="监测设备地址" />
            <div className={styles.addressValue}>
              {areaLocation || <EmptyText />}
              {videoList &&
                videoList.length > 0 && (
                  <div
                    className={styles.video}
                    onClick={() => onVideoClick && onVideoClick(videoList)}
                  />
                )}
            </div>
          </div>
        </div>
        <div className={styles.workOrderJumperWrapper}>
          {noFinishWarningProcessId && (
            <Link
              to={`/company-iot/alarm-work-order/detail/${noFinishWarningProcessId}`}
              disabled={!hasAlarmWorkOrderAuthority}
            >
              当前报警工单>>
            </Link>
          )}
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.monitorTrendJumperWrapper}>
          <Link
            to={`/company-iot/alarm-work-order/monitor-trend/${id}`}
            disabled={!hasMonitorTrendAuthority}
          >
            监测趋势>>
          </Link>
        </div>
        {allMonitorParam && allMonitorParam.length ? (
          <Carousel className={styles.carousel}>{allMonitorParam.map(renderParam)}</Carousel>
        ) : (
          <Empty className={styles.emptyParam} image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
    </Card>
  );
};

export default Gas;
