import React, { useState, useEffect } from 'react';
import { Skeleton } from 'antd';
import { Link } from '@/jingan-components/View';
import { connect } from 'dva';
import { isEqual } from 'lodash';
import { stringify } from 'qs';
import moment from 'moment';
import { toFixed } from '@/utils/utils';
import iconDevice from '@/pages/IoT/MajorHazard/imgs/icon-device.png';
import styles from './index.less';

const API = 'gasMonitor/getHistoryDetail';

export default connect(
  ({
    gasMonitor: { historyDetail },
    loading: {
      effects: { [API]: loading },
    },
  }) => ({
    historyDetail,
    loading,
  }),
  (dispatch, { params }) => ({
    getHistoryDetail(payload, callback) {
      dispatch({
        type: API,
        payload: {
          ...params,
          ...payload,
        },
        callback,
      });
    },
  }),
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
  }),
  {
    areStatesEqual: () => false,
    areOwnPropsEqual: () => false,
    areStatePropsEqual: () => false,
    areMergedPropsEqual: (props, nextProps) => {
      return (
        props.historyDetail === nextProps.historyDetail &&
        props.loading === nextProps.loading &&
        isEqual(props.params, nextProps.params) &&
        props.companyName === nextProps.companyName
      );
    },
  }
)(({ className, historyDetail, loading, getHistoryDetail, params, companyName }) => {
  const [prevParams, setPrevParams] = useState(undefined);
  useEffect(
    () => {
      if (!isEqual(params, prevParams)) {
        setPrevParams(params);
        getHistoryDetail();
      }
    },
    [params]
  );
  const {
    equipmentCount,
    warningCount,
    trueWarningCount,
    falseWarningCount,
    endProcessPercent,
    waitProcessCount,
    ingProcessCount,
    endProcessCount,
    suspectedWarningCount,
  } = historyDetail || {};
  const total = (waitProcessCount || 0) + (ingProcessCount || 0) + (endProcessCount || 0);
  return (
    <div className={className}>
      {!loading ? (
        <div className={styles.countContainer}>
          <div>
            <div className={styles.countItem} style={{ backgroundImage: `url(${iconDevice})` }}>
              <div className={styles.countLabel}>监测设备（个）</div>
              <div className={styles.countValue}>
                <Link
                  to={`/device-management/monitoring-device/list?${stringify({
                    equipmentType: params && params.equipmentTypes,
                    companyName: companyName && encodeURIComponent(companyName),
                  })}`}
                  target="_blank"
                  disabled={!equipmentCount}
                >
                  {equipmentCount || 0}
                </Link>
              </div>
            </div>
          </div>
          <div>
            <div className={styles.countItem}>
              <div className={styles.countLabel}>报警（次）</div>
              <div className={styles.countValue}>{warningCount || 0}</div>
            </div>
            <div className={styles.countItem}>
              <div className={styles.countLabel}>真实警情（次）</div>
              <div className={styles.countValue}>{trueWarningCount || 0}</div>
            </div>
            <div className={styles.countItem}>
              <div className={styles.countLabel}>误报警情（次）</div>
              <div className={styles.countValue}>{falseWarningCount || 0}</div>
            </div>
            <div className={styles.countItem}>
              <div className={styles.countLabel}>疑似警情（次）</div>
              <div className={styles.countValue}>{suspectedWarningCount || 0}</div>
            </div>
            <div className={styles.countItem}>
              <div className={styles.countLabel}>工单总数（张）</div>
              <div className={styles.countValue}>
                <Link
                  to={`/company-iot/alarm-work-order/list?${stringify({
                    reportType: params && params.equipmentTypes,
                    companyName: companyName && encodeURIComponent(companyName),
                    queryCreateStartDate: params && +moment(params.startTime),
                    queryCreateEndDate: params && +moment(params.endTime),
                  })}`}
                  target="_blank"
                  disabled={!total}
                >
                  {total || 0}
                </Link>
              </div>
            </div>
            <div className={styles.countItem}>
              <div className={styles.countLabel}>工单完成率</div>
              <div className={styles.countValue}>{`${toFixed(endProcessPercent || 0)}%`}</div>
            </div>
          </div>
        </div>
      ) : (
        <Skeleton active paragraph={{ rows: 1 }} />
      )}
    </div>
  );
});
