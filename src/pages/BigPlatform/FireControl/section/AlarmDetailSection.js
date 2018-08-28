import React, { PureComponent } from 'react';
import moment from 'moment';

import FcSection from './FcSection';
import styles from './AlarmDetialSection.less';
import backIcon from '../img/back.png';

const KEYS = ['sysName', 'typeName', 'installAddress', 'status', 'reportName', 'reportTime'];
const KEYS_CN = ['所属系统', '设备名称', '位置', '状态', '上报人', '上报时间'];

const NONE = '暂无信息';
const ABNORMAL = '异常';

export default class AlarmDetailSection extends PureComponent {
  renderTable() {
    const { detail={} } = this.props;
    return (
      <table className={styles.table}>
        <tbody>
          {KEYS.map((key, index) => {
            let val = detail[key];
            let v = val;

            if (key === 'status' && val === ABNORMAL)
              v = <span className={styles.abnormal}>{val}</span>;
            else if (key.toLowerCase().includes('time'))
              v = moment(val).format('YYYY-MM-DD HH:MM');

            return (
              <tr key={key}>
                <th>{KEYS_CN[index]}</th>
                <td>{val ? v : NONE}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    )
  }

  render() {
    const { handleReverse } = this.props;

    return (
      <FcSection title="警情详情" style={{ position: 'relative' }} isBack>
        <div className={styles.container} style={{ height: 'calc(100% - 58px)' }}>{this.renderTable()}</div>
        <img src={backIcon} alt="返回" width="29" height="23" onClick={handleReverse} className={styles.backIcon} />
      </FcSection>
    );
  }
}
