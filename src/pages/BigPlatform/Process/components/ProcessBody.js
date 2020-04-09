import React, { PureComponent } from 'react';

import styles from './ProcessBody.less';
import Label from './Label';
import ProcessTable from './ProcessTable';
import { getProcessTables } from '../utils';

// const PARAMS = [
//   { name: 'pressure', label: '压力', value: -0.01, unit: 'MPa' },
//   { name: 'tempeture', label: '夹套', value: 35.0, unit: '℃' },
//   { name: 'tempeture1', label: '釜中', value: 35.7, unit: '℃' },
//   { name: 'tempeture2', label: '釜底', value: 35.5, unit: '℃' },
// ];

export default class ProcessBody extends PureComponent {
  render() {
    const { processes, valves, monitorList } = this.props;
    const processTables = getProcessTables(monitorList);

    return (
      <div className={styles.container}>
        <div className={styles.process}>
          <img className={styles.img} src="http://data.jingan-china.cn/v2/chem/bg/process3.png" alt="process" />
          {processes.map((item, index) => (
            <Label
              key={index}
              color="#0FF"
              direction="center"
              {...item}
            >
              {item.name}
            </Label>
          ))}
          {valves.map((item, index) => <Label key={index} {...item}>{item.name}</Label>)}
          {/* <Label color="black" position={[1580, 1520]} direction="left">
            <div className={styles.number}>0</div>
          </Label>
          <Label color="black" position={[2430, 1520]} direction="right">
            <div className={styles.number}>0</div>
          </Label> */}
          {processTables.map(({ title, position, width, params, showLabel }, index) => (
            <ProcessTable key={index} title={title} position={position} width={width} params={params} showLabel={showLabel} />
          ))}
          {/* <ProcessTable title={['丁二烯', '计量罐']} position={[978,390]} width={208} params={PARAMS.slice(0, 2)} />
          <ProcessTable title={['苯乙烯', '计量罐']} position={[482,390]} width={208} params={PARAMS.slice(0, 2)} />
          <ProcessTable title={['水相', '计量罐']} position={[1444,390]} width={208} params={PARAMS.slice(0, 2)} />
          <ProcessTable title="油相釜" position={[558,1160]} width={208} params={PARAMS.slice(0, 2)} />
          <ProcessTable title="1#反应釜" showLabel position={[1160,1160]} width={350} params={PARAMS} />
          <ProcessTable title="2#反应釜" showLabel position={[1936,1160]} width={350} params={PARAMS} /> */}
        </div>
      </div>
    );
  }
}
