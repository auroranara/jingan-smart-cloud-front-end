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
    const { index=0, question, choices=['是', '否'], type='single', onChange, value='', ...restProps } = this.props;
    // const isSingle = type === 'single';
    // const Group = isSingle ? RadioGroup : CheckboxGroup;
    // const Choice = isSingle ? Radio : Checkbox;

    let ccs = null;

    switch(type) {
      case 'single':
        ccs = (
          <RadioGroup onChange={e => onChange(e.target.value)} value={value}>
            {choices.map((c, i) => <Radio key={i} value={i} style={CHOICE_STYLE}>{`${CHOICES[i]}、${c}`}</Radio>)}
          </RadioGroup>
        );
        break;
      case 'multi':
        ccs = (
          <CheckboxGroup onChange={vals => onChange(vals)} value={value}>
            {choices.map((c, i) => <Checkbox key={i} value={i} style={CHOICE_STYLE}>{`${CHOICES[i]}、${c}`}</Checkbox>)}
          </CheckboxGroup>
        );
        break;
      case 'judge':
        ccs = (
          <RadioGroup onChange={e => onChange(e.target.value)} value={value}>
            {choices.map((c, i) => <Radio key={i} value={i} style={CHOICE_STYLE}>{c}</Radio>)}
          </RadioGroup>
        );
        break;
      default:
        console.warn(`type[${type}] in Subject.js`);
    }

    return (
      <div className={styles.container} {...restProps}>
        <p className={styles.p}>{`${index + 1}、${question}：(`}<span className={styles.backspace} />)</p>
          {ccs}
      </div>
    );
  }
}
