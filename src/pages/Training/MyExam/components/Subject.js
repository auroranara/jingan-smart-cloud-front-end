import React, { PureComponent } from 'react';
import { Checkbox, Radio } from 'antd';

import styles from './Subject.less';

const { Group: CheckboxGroup } = Checkbox;
const { Group: RadioGroup } = Radio;
const CHOICES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const HEIGHT = 40;
const CHOICE_STYLE = { display: 'block', fontSize: 16, height: HEIGHT, lineHeight: `${HEIGHT}px`, margin: '0 0 0 20px' };

export default class Subject extends PureComponent {
  render() {
    const { index=0, question, choices, type='single', onChange, value='', ...restProps } = this.props;
    const isSingle = type === 'single';
    const Group = isSingle ? RadioGroup : CheckboxGroup;
    const Choice = isSingle ? Radio : Checkbox;

    return (
      <div className={styles.container} {...restProps}>
        <p className={styles.p}>{`${index + 1}、${question}：(`}<span className={styles.backspace} />)</p>
        <Group onChange={e => onChange(isSingle ? e.target.value : e)} value={value}>
          {choices.map((c, i) => <Choice key={i} value={i} style={CHOICE_STYLE}>{`${CHOICES[i]}、${c}`}</Choice>)}
        </Group>
      </div>
    );
  }
}
