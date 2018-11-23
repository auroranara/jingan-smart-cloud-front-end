import React, { PureComponent } from 'react';

import SubSide from './SubSide';
import styles from './MultiSubSide.less';

export default class MultiSubSide extends PureComponent {
  // state = { spreadStates: [] };

  // componentDidMount() {
  //   const { categories=[] } = this.props;
  //   this.setState({ spreadStates: [...Array(categories.length).keys()].map(i => !i) });
  // }

  // handleSpreadClick = i => {
  //   const { categories } = this.props;
  //   this.setState({ spreadStates: [...Array(categories.length).keys()].map(index => index === i ? true : false) });
  //   // this.setState(({ spreadStates }) => ({ spreadStates: [...Array(categories.length).keys()].map(index => index === i ? !spreadStates[index] : spreadStates[index]) }));
  // };

  render() {
    const { colors, categories=[], states, handleClick, handleSpreadClick } = this.props;
    // const { spreadStates } = this.state;
    // let states = spreadStates;
    // 如果categories已获取，且spreadStates未初始化，还是空数组，则默认展开第一个
    // if (categories.length && !spreadStates.length)
    //   states = [...Array(categories.length).keys()].map(i => !i);

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
              state={states[i]}
              handleClick={handleClick}
              onClick={e => handleSpreadClick(i)}
              // onClick={e => this.handleSpreadClick(i)}
            >
              {title}
            </SubSide>
          );
        })}
      </div>
    )
  }
}
