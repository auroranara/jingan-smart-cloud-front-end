import React, { PureComponent } from 'react';
// import moment from 'moment';

import styles from './TypeCard.less';
import TypeCardHead from './TypeCardHead';
import TypeCardBody from './TypeCardBody';

const NO_DATA = '暂无数据';
const TYPE_LABELS = {
  304: ['库房名称', '区域位置', '所属库区'], //库房
  302: ['储罐名称', '位号', '区域位置'], // 储罐
  311: ['装置名称', '区域位置', '是否关键装置', '设计压力(KPa)'], // 生产装置
  312: ['气柜名称', '区域位置', '设计柜容(m³)', '设计压力(KPa)'], // 气柜
  314: ['管道名称', '是否危化品管道', '是否压力管道', '设计压力(KPa)'], // 管道
};

const TYPE_IMGS = {
  304: 'http://data.jingan-china.cn/v2/chem/screen/warehouse.png',
  302: 'http://data.jingan-china.cn/v2/chem/chemScreen/storage.png',
  311: 'http://data.jingan-china.cn/v2/chem/screen/productDevice.png',
  312: 'http://data.jingan-china.cn/v2/chem/screen/gasometer.png',
  314: 'http://data.jingan-china.cn/v2/chem/screen/pipeline.png',
};

function getLabelList(type, values) {
  return TYPE_LABELS[type].map((label, i) => [label, values[i]]);
}

export default class TypeCard extends PureComponent {
  render() {
    const { data, handleShowVideo } = this.props;
    const { target, type = 404 } = data;
    const {
      tankName,
      number,
      buildingName,
      floorName,
      area,
      location,
      position,
      aname,
      name,
      keyDevice,
      pressure,
      gasholderName,
      regionalLocation,
      designCapacity,
      designKpa,
      dangerPipeline,
      designPressure,
      warnStatus,
      meList,
    } = target;

    const TYPE_VALUES = {
      304: [name, position, aname || NO_DATA],
      302: [
        tankName,
        number,
        `${buildingName || ''}${floorName || ''}${area || ''}${location || ''}` || NO_DATA,
      ],
      311: [name, location, +keyDevice === 1 ? '是' : '否', pressure],
      312: [gasholderName, regionalLocation, designCapacity, designKpa],
      314: [
        name,
        +dangerPipeline === 1 ? '是' : '否',
        +pressure === 1 ? '是' : '否',
        designPressure,
      ],
    };

    return (
      <div className={styles.container}>
        <TypeCardHead
          alarming={+warnStatus === -1}
          labelList={getLabelList(type, TYPE_VALUES[type])}
          type={type}
          data={target}
        />
        {Array.isArray(meList)
          ? meList.map((item, index) => (
              <TypeCardBody
                key={index}
                url={TYPE_IMGS[type]}
                data={item}
                handleShowVideo={handleShowVideo}
              />
            ))
          : null}
      </div>
    );
  }
}
