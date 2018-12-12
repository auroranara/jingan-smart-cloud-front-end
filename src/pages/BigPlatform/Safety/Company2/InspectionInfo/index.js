import React, { PureComponent } from 'react';
import Section from '@/components/Section';


/**
 * description: 单位巡查信息
 * author: sunkai
 * date: 2018年12月10日
 */
export default class InspectionInfo extends PureComponent {
  render() {
    const {
      // 样式
      style,
      // 类名
      className,
      // 模型
      model,
      // 点击事件
      onClick,
    } = this.props;

    return (
      <Section className={className} style={style}>
        <div>123</div>
      </Section>
    );
  }
}
