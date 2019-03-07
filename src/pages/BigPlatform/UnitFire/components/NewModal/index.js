import React,{PureComponent} from 'react';
import {Modal} from 'antd';
import styles from './index.less';

export default class NewModal extends PureComponent{

  
  render(){
    const {
      title,
      visible,
      width,
      onCancel,
      hasIcon=true,
      ...others
    }=this.props
    const renderTitle = (
      <div className={styles.modalTitle}>
        {hasIcon&&(<div className={styles.sectionTitleIcon} />)}
        {title}
      </div>
    );
    return(
      <Modal
      className={styles.modalContainer}
      width={width}
      title={renderTitle}
      visible={visible}
      onCancel={onCancel}
      footer={false}
      afterClose={this.handleAfterClose}
      {...others}
    />
    )
  }
}