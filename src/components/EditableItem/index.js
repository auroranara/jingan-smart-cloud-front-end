import React, { PureComponent } from 'react';
import { Input, Icon } from 'antd';
import styles from './index.less';

export default class EditableItem extends PureComponent {
<<<<<<< HEAD
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      editable: false,
    };
  }

=======
  state = {
    value: this.props.value,
    editable: false,
  };
>>>>>>> init
  handleChange = e => {
    const { value } = e.target;
    this.setState({ value });
  };
<<<<<<< HEAD

  check = () => {
    this.setState({ editable: false });
    const { value } = this.state;
    const { onChange } = this.state;
    if (onChange) {
      onChange(value);
    }
  };

  edit = () => {
    this.setState({ editable: true });
  };

=======
  check = () => {
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  };
  edit = () => {
    this.setState({ editable: true });
  };
>>>>>>> init
  render() {
    const { value, editable } = this.state;
    return (
      <div className={styles.editableItem}>
        {editable ? (
          <div className={styles.wrapper}>
            <Input value={value} onChange={this.handleChange} onPressEnter={this.check} />
            <Icon type="check" className={styles.icon} onClick={this.check} />
          </div>
        ) : (
          <div className={styles.wrapper}>
            <span>{value || ' '}</span>
            <Icon type="edit" className={styles.icon} onClick={this.edit} />
          </div>
        )}
      </div>
    );
  }
}
