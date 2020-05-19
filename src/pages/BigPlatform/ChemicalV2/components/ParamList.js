import React, { PureComponent, Fragment } from 'react';
import { Tooltip } from 'antd';
import { toFixed } from '@/utils/utils';
import moment from 'moment';

import styles from './ParamList.less';

const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export default class ParamList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { params = [], style = {} } = this.props;

    return (
      <div className={styles.paramList} style={style}>
        {params &&
          params.map(
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
                  overlayStyle={{ zIndex: 9999 }}
                  title={
                    +linkStatus !== -1 ? (
                      status > 0 ? (
                        <div>
                          <div>
                            {`${condition === '>=' ? '超过' : '低于'}${
                              +status === 1 ? '预' : '告'
                            }警阈值 `}
                            <span style={{ color: '#ff1325' }}>
                              {toFixed(Math.abs(realValue - limitValue))}
                            </span>
                            {` ${paramUnit || ''}`}
                          </div>
                          <div>{`最近更新时间：${moment(dataUpdateTime).format(TIME_FORMAT)}`}</div>
                        </div>
                      ) : (
                        `最近更新时间：${moment(dataUpdateTime).format(TIME_FORMAT)}`
                      )
                    ) : (
                      `失联时间：${moment(linkStatusUpdateTime).format(TIME_FORMAT)}`
                    )
                  }
                >
                  <div
                    className={styles.paramItemValue}
                    style={{ color: status > 0 ? '#ff1225' : undefined }}
                  >
                    {+linkStatus !== -1 ? realValue : '--'}
                  </div>
                </Tooltip>
                <div className={styles.paramItemUnit}>{paramUnit}</div>
              </div>
            )
          )}
      </div>
    );
  }
}
