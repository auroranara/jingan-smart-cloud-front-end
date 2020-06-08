import React from 'react';
import Link from 'umi/link';
import classNames from 'classnames';
import styles from './index.less';

const ViewLink = props => {
  return (
    <Link
      to="/"
      {...props}
      className={classNames(styles.link, props.className)}
      onClick={e => {
        e.stopPropagation();
        if (props.disabled) {
          e.preventDefault();
        } else if (props.onClick) {
          e.preventDefault();
          props.onClick(e);
        }
      }}
    />
  );
};

export default ViewLink;
