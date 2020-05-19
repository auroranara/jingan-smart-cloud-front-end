import React, { PureComponent, Fragment } from 'react';
import { Radio, Menu, Dropdown } from 'antd';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import styles from './RadioBtns.less';

const DEFAULT_COUNT = 4;
const DEFAULT_SIZE = 4;

export default class RadioBtns extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // active: 0,
      page: 1,
    };
  }

  componentDidMount() {
    this.init();
  }

  init = () => {
    const { btnKey, size = DEFAULT_SIZE, fields = [] } = this.props;
    if (!btnKey) return;
    const keys = fields.map(item => item.key);
    const index = keys.indexOf(btnKey);
    this.setState({ page: Math.ceil((index + 1) / size) });
  };

  componentDidUpdate = prevProps => {
    const { btnKey: prevKey } = prevProps;
    const { btnKey } = this.props;
    if (btnKey === prevKey) return;
    this.init();
  };

  handleRadioChange = v => {
    const {
      target: { value },
    } = v;
    const { onClick } = this.props;
    onClick && onClick(value);
    // this.setState({ active: value });
  };

  // handleMenuClick = ({ key }) => {
  //   const { onClick } = this.props;
  //   onClick && onClick(key);
  //   this.setState({ active: key });
  // };

  handleClickPrev = () => {
    const { page } = this.state;
    this.setState({ page: page - 1 });
  };

  handleClickNext = () => {
    const { page } = this.state;
    this.setState({ page: page + 1 });
  };

  render() {
    const {
      fields,
      style = {},
      className,
      otherIcon,
      otherIconStyles = {},
      // showCount = DEFAULT_COUNT,
      btnKey: propsKey,
      size = DEFAULT_SIZE,
    } = this.props;
    const { page } = this.state;
    const total = fields.length;
    const lastPage = Math.ceil(total / size);

    // const menu = (
    //   <Menu onClick={this.handleMenuClick}>
    //     {fields.slice(showCount).map((item, index) => {
    //       const { label, render, key } = item;
    //       return <Menu.Item key={key || index + showCount}>{render ? render() : label}</Menu.Item>;
    //     })}
    //   </Menu>
    // );

    return (
      <div className={classNames(styles.container, className)} style={{ ...style }}>
        {page !== 1 && (
          <div
            className={styles.pageWrapper}
            style={otherIconStyles}
            onClick={this.handleClickPrev}
          >
            {otherIcon ? otherIcon : <LeftOutlined />}
          </div>
        )}
        <div className={styles.radioBtns}>
          <Radio.Group
            defaultValue={propsKey || (fields[0] || {}).key || 0}
            buttonStyle="solid"
            onChange={this.handleRadioChange}
            style={{
              transform: `translate(-${(page - 1) * 100}%, 0)`,
              transition: 'transform 0.3s',
            }}
          >
            {/* {fields.slice(0, showCount).map((item, index) => { */}
            {fields.map((item, index) => {
              const { label, render, key } = item;
              return (
                <Radio.Button
                  value={key || index}
                  key={index}
                  style={{ flex: 'none', width: `${lastPage > 1 ? 100 / size : 100 / total}%` }}
                >
                  {render ? render() : label}
                </Radio.Button>
              );
            })}
          </Radio.Group>
        </div>
        {page < lastPage && (
          <div
            className={styles.pageWrapper}
            style={otherIconStyles}
            onClick={this.handleClickNext}
          >
            {otherIcon ? otherIcon : <RightOutlined />}
          </div>
        )}
        {/* {total > showCount && (
          <Dropdown
            overlay={menu}
            placement="bottomRight"
            overlayStyle={{ zIndex: 9999 }}
            overlayClassName={styles.dropdownContainer}
          >
            <div className={styles.pageWrapper} style={otherIconStyles}>
              {otherIcon ? otherIcon : <RightOutlined />}
            </div>
          </Dropdown>
        )} */}
      </div>
    );
  }
}
