import React, { PureComponent } from 'react';
import { connect } from 'dva';

import ProcessHead from './components/ProcessHead';
import ProcessBody from './components/ProcessBody';
import styles from './index.less';
import { PROCESSES, VALVES } from './utils';

@connect(({ process, user, loading }) => ({
  process,
  user,
  loading: loading.models.process,
}))
export default class Process extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      match: { params: { companyId } },
    } = this.props;
    dispatch({
      type: 'process/fetchProcessList',
      payload: { companyId, pageNum: 1, pageSize: 0 },
      callback: list => {
        if (list.length)
          this.getProcessDetail(list[0].id);
      },
    });
  }

  getProcessDetail = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'process/fetchProcessDetail',
      payload: { id },
    });
  };

  render() {
    const {
      process: { list, detail },
    } = this.props;

    return (
      <div className={styles.container}>
        <ProcessHead
          title="重点监管危险化工工艺"
          list={list}
          data={detail}
        />
        <ProcessBody
          processes={PROCESSES}
          valves={VALVES}
        />
      </div>
    );
  }
}
