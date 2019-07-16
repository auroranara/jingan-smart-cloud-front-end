import React, { PureComponent } from 'react';

import styles from './WaterSystem.less';
import { Section } from './Components';
import { PolarBar, WaterTank } from '../components/Components';

export default class WaterSystem extends PureComponent {
  state = { deep: 0 };

  componentDidMount() {
    setInterval(() => {
      this.setState({ deep: Math.floor(Math.random() * 50) / 10 });
    }, 5000);
  }

  render() {
    const { onClick } = this.props;
    const { deep } = this.state;
    const clicks = [101, 102, 103].map((type, i) => e => onClick(i, type));

    return (
      <Section title="水系统">
        <div className={styles.container} onClick={clicks[2]}>
          <PolarBar />
          {/* <WaterTank
            className={styles.tank}
            dy={30}
            width={200}
            height={200}
            value={deep}
            size={[100, 150]}
            limits={[1, 4]}
            range={5}
          /> */}
        </div>
      </Section>
    );
  }
}
