import React, { PureComponent } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { hiddenDangerSource } from '@/utils/dict';
import Ellipsis from '@/components/Ellipsis';
import environment from '@/assets/environment.png';
import fireControl from '@/assets/fire-control.png';
import hygiene from '@/assets/hygiene.png';
import safety from '@/assets/safety.png';

import styles from './index.less';

// 默认字段
const FIELDNAMES = {
  status: 'status', // 隐患状态
  type: 'type', // 隐患类型
  description: 'description', // 隐患描述
  src: 'src', // 图片地址
  name: 'name', // 点位名称
  source: 'source', // 来源
  reportPerson: 'reportPerson', // 上报人
  reportTime: 'reportTime', // 上报时间
  planRectificationPerson: 'planRectificationPerson', // 计划整改人
  planRectificationTime: 'planRectificationTime', // 计划整改时间
  actualRectificationPerson: 'actualRectificationPerson', // 实际整改人
  actualRectificationTime: 'actualRectificationTime', // 实际整改时间
  designatedReviewPerson: 'designatedReviewPerson', // 指定复查人
};
// 时间格式
const TIME_FORMAT = 'YYYY-MM-DD';
// 隐患类型图标映射
const TYPE_ICONS = {
  1: safety,
  2: fireControl,
  3: environment,
  4: hygiene,
};

export default class HiddenDangerCard extends PureComponent {
  /**
   * 渲染隐患状态标签
   * @param {string} status 隐患状态
   */
  renderStatus(status) {
    let label, backgroundColor;
    switch(+status) {
      case 1:
      case 2:
      label = '未超期';
      backgroundColor = '#0967D3';
      break;
      case 7:
      label = '已超期';
      backgroundColor = '#FF4848';
      break;
      case 3:
      label = '待复查';
      backgroundColor = '#0967D3';
      break;
      default:
      break;
    }
    return label && (
      <div className={styles.status} style={{ backgroundColor }}>
        {label}
      </div>
    );
  }

  /**
   * 渲染字段
   */
  renderField({ label, value, value2, className }) {
    return (
      <div className={classNames(styles.row, className)} key={label}>
        <div className={styles.label}><span className={styles.labelWrapper}>{label}</span>：</div>
        <div className={styles.value}>{value}{value2 && <span className={styles.value2}>{value2}</span>}</div>
      </div>
    );
  }

  render() {
    const {
      className, // 容器类名
      style, // 容器样式
      data, // 源数据
      fieldNames, // 自定义字段
    } = this.props;
    const {
      status,
      type,
      description,
      src,
      name,
      source,
      reportPerson,
      reportTime,
      planRectificationPerson,
      planRectificationTime,
      actualRectificationPerson,
      actualRectificationTime,
      designatedReviewPerson,
    } = { ...FIELDNAMES, ...fieldNames };
    const fields = [
      {
        label: '点位名称',
        value: data[name],
      },
      {
        label: '来源',
        value: hiddenDangerSource[data[source]],
        className: styles.twoCharacter,
      },
      {
        label: '上报',
        value: data[reportPerson],
        value2: data[reportTime] && moment(+data[reportTime]).format(TIME_FORMAT),
        className: styles.twoCharacter,
      },
    ];
    if (+data[status] === 7) {
      fields.push({
        label: '计划整改',
        value: data[planRectificationPerson],
        value2: data[planRectificationTime] && moment(+data[planRectificationTime]).format(TIME_FORMAT),
        className: styles.planRectification,
      });
    } else if (+data[status] === 3) {
      fields.push({
        label: '实际整改',
        value: data[actualRectificationPerson],
        value2: data[actualRectificationTime] && moment(+data[actualRectificationTime]).format(TIME_FORMAT),
      }, {
        label: '指定复查',
        value: data[designatedReviewPerson],
      });
    } else if (+data[status] === 1 || +data[status] === 2) {
      fields.push({
        label: '计划整改',
        value: data[planRectificationPerson],
        value2: data[planRectificationTime] && moment(+data[planRectificationTime]).format(TIME_FORMAT),
      });
    }

    return (
      <section
        className={classNames(styles.container, className)}
        style={{ ...style }}
      >
        {data[status] && this.renderStatus(data[status])}
        <div className={styles.titleWrapper}>
          <div className={styles.titleIcon} style={{ backgroundImage: `url(${TYPE_ICONS[data[type]]})` }} />
          <div className={styles.title}><Ellipsis className={styles.ellipsisTitle} lines={1} tooltip>{data[description]}</Ellipsis></div>
        </div>
        <div className={styles.wrapper}>
            <div className={styles.imageWrapper}>
              <div className={styles.image} style={{ backgroundImage: `url(${data[src]})` }} />
            </div>
            <div className={styles.fieldsWrapper}>
              {fields.map(this.renderField)}
            </div>
          </div>
      </section>
    );
  }
}
