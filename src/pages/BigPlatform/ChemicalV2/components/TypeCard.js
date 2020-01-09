import React, { PureComponent } from 'react';
import moment from 'moment';

import styles from './TypeCard.less';
import TypeCardHead from './TypeCardHead';
import TypeCardBody from './TypeCardBody';

const TYPE_LABELS = {
  304: ['库房名称', '区域位置', '所属库区', '设计储量(t)'], //库房
  404: ['储罐名称', '位号', '区域位置', '实时储量'], // 储罐
  408: ['装置名称', '区域位置', '是否关键装置', '设计压力(KPa)'], // 生产装置
  409: ['气柜名称', '区域位置', '设计柜容(m3)', '设计压力(KPa)'], // 气柜
};

const TYPE_IMGS = {
  304: 'http://data.jingan-china.cn/v2/chem/screen/warehouse.png',
  404: 'http://data.jingan-china.cn/v2/chem/chemScreen/storage.png',
  408: 'http://data.jingan-china.cn/v2/chem/screen/productDevice.png',
  409: 'http://data.jingan-china.cn/v2/chem/screen/gasometer.png',
};

const STORAGE = [
  { name: '温度', unit: '℃', value: 30, status: 1, time: +moment() },
  { name: '液位', unit: 'cm', value: 23, status: 0, time: +moment() },
  { name: '压力', unit: 'MPa', value: 0.15, status: 0, time: +moment() },
];
const PARAMLIST = [
  { name: '1号储罐', paramList: STORAGE },
  { name: '2号储罐', paramList: STORAGE },
];

function getLabelList(type, values) {
  return TYPE_LABELS[type].map((label, i) => [label, values[i]]);
}

export default class TypeCard extends PureComponent {
  render() {
    const { data } = this.props;
    const { list=PARAMLIST, type=404 } = data;

    return (
      <div className={styles.container}>
        <TypeCardHead
          alarming={1}
          labelList={getLabelList(404, ['液氯储罐', '4305A', '1号楼1车间', '6t'])}
        />
        {Array.isArray(list) ? list.map(item => <TypeCardBody url={TYPE_IMGS[type]} data={item} />) : null}
      </div>
    );
  }
}
