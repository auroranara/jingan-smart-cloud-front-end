import React, { Component } from 'react';
import styles from './TotalInfo.less';

export default class TotalInfo extends Component {
  state = { active: 0 };

  componentDidMount() {
    const { index } = this.props;
    this.setState({ active: index });
  }

  componentDidUpdate(prevProps, prevState) {
    const { index: prevIndex, titleIndex: prevTitleIndex } = prevProps;
    const { index, titleIndex } = this.props;
    // console.log(`prevTitleIndex[${prevTitleIndex}], titleIndex[${titleIndex}]  prevIndex[${prevIndex}], index[${index}]`);
    // console.log(`prevActive[${prevState.active}], active[${this.state.active}]`);
    if (index !== prevIndex || titleIndex !== prevTitleIndex) {
      // console.log(index);
      this.setState({ active: index });
    }
  }

  render() {
    const { data = [], loading = false, handleClick, style = {} } = this.props;
    const { active } = this.state;
    // console.log(this.props, this.state);
    return (
      <div className={styles.totalInfo} style={style}>
        {data.map((item, index) => {
          const { color, name, value } = item;
          return (
            <div
              className={active === index ? styles.active : styles.infoItem}
              onClick={() => {
                if (loading || active === index) return null;
                handleClick(index);
              }}
              key={index}
              style={{ cursor: loading ? 'wait' : 'pointer' }}
            >
              {name}
              <span className={styles.infoNum} style={{ color }}>
                （{value}）
              </span>
            </div>
          );
        })}
      </div>
    );
  }
}
