import React, { PureComponent } from 'react';

import SubSide from './SubSide';
import styles from './MultiSubSide.less';

export default class MultiSubSide extends PureComponent {
  state = { spreadStates: [] };

  componentDidMount() {
    const { categories=[] } = this.props;
    this.setState({ spreadStates: [...Array(categories.length).keys()].map(i => !i) });
  }

  handleSpreadClick = i => {
    const { categories } = this.props;
    this.setState(({ spreadStates }) => {
      const cloned = [...spreadStates];
      cloned[i] = !spreadStates[i];
      return { spreadStates: cloned };
    });
  };

  render() {
    const { handleClick, colors, categories=[] } = this.props;
    const { spreadStates } = this.state;

    let count = 0;

    return (
      <div className={styles.container}>
        {categories.map(({ title, size }, i) => {
          const temp = count;
          count += size;

          return (
            <SubSide
              key={title}
              colors={colors}
              quantity={size}
              startIndex={temp}
              state={spreadStates[i]}
              handleClick={handleClick}
              onClick={e => this.handleSpreadClick(i)}
            >
              {title}
            </SubSide>
          );
        })}
      </div>
    )
  }
}
