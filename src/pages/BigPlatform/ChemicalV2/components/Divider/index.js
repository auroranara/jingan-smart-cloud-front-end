import { Component } from 'react';
import styles from './index.less';

export default class Divider extends Component {
  render () {
    const { ...resProps } = this.props;
    return (
      <div className={styles.divider} {...resProps}></div>
    )
  }
}
