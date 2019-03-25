import React, { PureComponent } from 'react';
import { Button, Checkbox } from 'antd';
import moment from 'moment';

import styles from './AlarmCard.less';

const TYPES = ['SOS', '越界', '长时间逗留', '超员', '缺员'];
const STATUS = ['待处理', '已忽略', '已处理'];
const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export default class AlarmCard extends PureComponent {
    render() {
        const { areaInfo, batch, checked, data, onClick, handleShowSubmit, ...restProps } = this.props;
        const { id, areaId, type, warningTime, executeTime, executeStatus, executeDesc } = data;
        const typeName = TYPES[+type - 1];
        const handled = +executeStatus;

        return (
            <div className={styles.card} {...restProps}>
                <div className={styles.inner}>
                    <div className={styles.info} onClick={onClick}>
                      {batch && !handled && <Checkbox checked={checked} className={styles.check} />}
                      <div className={styles[`flag${handled ? 1 : ''}`]}>{STATUS[executeStatus]}</div>
                      <div className={styles.type}>{typeName}</div>
                      <p>报警时间：{moment(warningTime).format(TIME_FORMAT)}</p>
                      <p>报警信息：{typeName}</p>
                      <p>报警位置：{areaInfo[areaId].fullName}</p>
                      <p>处理时间：{executeTime ? moment(executeTime).format(TIME_FORMAT) : '-'}</p>
                      <p>处理信息：{executeDesc || '-'}</p>
                    </div>
                    <Button
                      disabled={handled}
                      className={styles[`btn${handled ? 1 : ''}`]}
                      onClick={e => handleShowSubmit(id)}
                    >
                      {STATUS[executeStatus]}
                    </Button>
                </div>
            </div>
        );
    }
}
