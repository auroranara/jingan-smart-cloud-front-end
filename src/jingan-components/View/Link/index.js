import React from 'react';
import Link from 'umi/link';
import classNames from 'classnames';
import styles from './index.less';

const ViewLink = props => {
  return (
    <Link
      {...props}
      className={classNames(styles.link, props.className)}
      onClick={props.disabled ? e => e.preventDefault() : props.onClick}
    />
  );
};

export default ViewLink;
