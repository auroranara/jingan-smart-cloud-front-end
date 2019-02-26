import React, { Fragment, PureComponent } from 'react';

import styles from './PersonDrawer.less';
import {
  DrawerContainer,
} from '../components/Components';

const PERSONS = [...Array(5).keys()].map(i => ({ id: i, name: '张三', phone: '13222228888' }));

function PersonCard(props) {
  const { name, url, phone, ...restProps } = props;

  return (
    <div className={styles.cardContainer} {...restProps}>
      <div className={styles.head} style={{ backgroundImage: `url(${url})` }} />
      <span>{name}</span>
      <span>{phone}</span>
    </div>
  );
}

export default class PersonDrawer extends PureComponent {
  handleCloseDrawer = () => {
    const { handleClose } = this.props;
    handleClose('personDrawer');
  };

  render() {
    const { visible } = this.props;
    const left = (
      <Fragment>
        {PERSONS.map(({ id, name, url, phone }) => <PersonCard key={id} name={name} url={url} phone={phone} />)}
      </Fragment>
    );

    return (
      <DrawerContainer
        width={500}
        title="人员列表"
        visible={visible}
        left={left}
        placement="right"
        onClose={this.handleCloseDrawer}
      />
    );
  }
}
