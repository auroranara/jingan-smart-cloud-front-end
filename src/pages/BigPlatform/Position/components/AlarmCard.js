import React, { PureComponent } from 'react';
import { Button, Icon } from 'antd';
import moment from 'moment';

import styles from './AlarmCard.less';

const TYPES = ['SOS', '越界', '长时间逗留', '超员', '缺员'];
const STATUS = ['待处理', '已处理', '已处理'];
const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export default class AlarmCard extends PureComponent {
    render() {
        const { areaInfo, checked, data, onClick, handleShowSubmit, ...restProps } = this.props;
        const { id, areaId, areaName, type, warningTime, executeTime, executeStatus, executeDesc } = data;

        return (
            <div className={styles.card} {...restProps}>
                <div className={styles.inner} onClick={onClick}>
                    {checked ? <Icon className={styles.check} type="check" /> : <span className={styles.check} />}
                    <div className={styles.flag}>{STATUS[executeStatus]}</div>
                    <div className={styles.type}>超员</div>
                    <p>报警时间：{moment(warningTime).format(TIME_FORMAT)}</p>
                    <p>报警信息：{TYPES[+type - 1]}</p>
                    <p>报警位置：{areaInfo[areaId].fullName}</p>
                    <p>处理时间：{moment(executeTime).format(TIME_FORMAT)}</p>
                    <p>处理信息：{executeDesc}</p>
                    <Button className={styles.handle} onClick={e => handleShowSubmit(id)}>处理</Button>
                </div>
            </div>
        );
    }
}