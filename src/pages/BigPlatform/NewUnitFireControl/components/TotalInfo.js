import React, { PureComponent } from 'react';
import styles from './TotalInfo.less';

export default class TotalInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      active: 0,
    };
  }

  componentDidMount() {
    const { active } = this.props;
    this.setState({ active: active || 0 });
  }

  render() {
    const { data = [], loading = false, style = {} } = this.props;
    const { active } = this.state;
    return (
      <div className={styles.totalInfo} style={{ ...style }}>
        {data.map((item, index) => {
          const { color, name, value, onClick } = item;
          return (
            <div
              className={active === index ? styles.active : styles.infoItem}
              onClick={() => {
                if (loading || active === index) return null;
                this.setState({ active: index });
                onClick && onClick();
              }}
              key={index}
              style={{ cursor: loading ? 'wait' : 'pointer' }}
            >
              {name}
              <span className={styles.infoNum} style={{ color }}>
                ({value})
              </span>
            </div>
          );
        })}
      </div>
    );
  }
}
