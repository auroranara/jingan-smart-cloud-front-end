import React, { PureComponent } from 'react';
import Section from '../Section';

/**
 * description: 点位巡查统计
 * author: sunkai
 * date: 2018年12月03日
 */
export default class App extends PureComponent {
  render() {
    const {
      model,
    } = this.props;

    return (
      <Section title="点位巡查统计">
        <div style={{ height: 500 }}>123\</div>
      </Section>
    );
  }
}
