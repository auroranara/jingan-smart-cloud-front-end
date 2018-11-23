import React, { PureComponent } from 'react';
import { Checkbox, Radio } from 'antd';

import styles from './Subject.less';

const { Group: CheckboxGroup } = Checkbox;
const { Group: RadioGroup } = Radio;
const CHOICES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const HEIGHT = 40;
const DEFAULT_HEIGHT = 32;
const CHOICE_STYLE = { display: 'block', fontSize: 16, height: HEIGHT, lineHeight: `${HEIGHT}px`, margin: '0 0 0 20px' };
const DEFAULT_CHOICE_STYLE = { fontSize: 16, height: DEFAULT_HEIGHT, lineHeight: `${DEFAULT_HEIGHT}px`, margin: '0 0 0 30px' };

export default class Subject extends PureComponent {
  render() {
    const { index=0, question, choices=[], type='single', onChange, value=[], ...restProps } = this.props;
    // console.log(index, type);

    let ccs = null;

    switch(type) {
      case 'single':
        ccs = (
          <RadioGroup onChange={e => onChange([e.target.value])} value={value[0]}>
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
          <RadioGroup onChange={e => onChange([e.target.value])} value={value[0]}>
            {choices.map((c, i) => <Radio key={i} value={i} style={CHOICE_STYLE}>{c}</Radio>)}
          </RadioGroup>
        );
        break;
      default:
        ccs = (
          <div>
            {choices.map((c, i) => <p key={i} style={DEFAULT_CHOICE_STYLE}>{`${CHOICES[i]}、${c}`}</p>)}
          </div>
        )
    }

    return (
      <div className={styles.container} {...restProps}>
        <p className={styles.p}>{`${index + 1}、${question}`}</p>
        {/* <p className={styles.p}>{`${index + 1}、${question}(`}<span className={styles.backspace} />)</p> */}
          {ccs}
      </div>
    );
  }
}
