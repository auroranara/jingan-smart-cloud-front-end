import React, { PureComponent } from 'react';

import ProcessHead from './components/ProcessHead';
import ProcessBody from './components/ProcessBody';
import styles from './index.less';
import { DATA, PROCESSES, VALVES } from './utils';

export default class Process extends PureComponent {
  render() {
    return (
      <div className={styles.container}>
        <ProcessHead
          title="重点监管危险化工工艺"
          data={DATA}
        />
        <ProcessBody
          processes={PROCESSES}
          valves={VALVES}
        />
      </div>
    );
  }
}
