import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './index.less';

const FIELDNAMES = {
  id: 'id',

};

export default class HiddenDangerCard extends PureComponent {
  render() {
    const {
      className,
      style,
      fieldNames,
    } = this.props;
    const { id } = { ...FIELDNAMES, ...fieldNames };

    return (
      <section
        className={classNames(styles.container, className)}
        style={{ ...style }}
      >

      </section>
    );
  }
}
