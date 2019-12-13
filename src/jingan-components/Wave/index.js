import React, { Component } from 'react';
import classNames from 'classnames';
import styles from './index.less';

export default class Wave extends Component {
  render() {
    const {
      className,
      style,
      frontStyle,
      backStyle,
    } = this.props;

    return (
      <div className={classNames(styles.waves, className)} style={style}>
      	<div className={classNames(styles.wave, styles.waveBack)} style={backStyle}>
      		<div className={styles.water}>
      			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 32" preserveAspectRatio="none"><title>wave2</title><path d="M350,17.32V32H0V17.32C116.56,65.94,175-39.51,350,17.32Z"></path></svg>
      		</div>
      		<div className={styles.water}>
      			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 32" preserveAspectRatio="none"><title>wave2</title><path d="M350,17.32V32H0V17.32C116.56,65.94,175-39.51,350,17.32Z"></path></svg>
      		</div>
      	</div>
      	<div className={classNames(styles.wave, styles.waveFront)} style={frontStyle}>
      		<div className={styles.water}>
      			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 32" preserveAspectRatio="none"><title>wave2</title><path d="M350,17.32V32H0V17.32C116.56,65.94,175-39.51,350,17.32Z"></path></svg>
      		</div>
          <div className={styles.water}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 32" preserveAspectRatio="none"><title>wave2</title><path d="M350,17.32V32H0V17.32C116.56,65.94,175-39.51,350,17.32Z"></path></svg>
          </div>
        </div>
      </div>
    );
  }
}
