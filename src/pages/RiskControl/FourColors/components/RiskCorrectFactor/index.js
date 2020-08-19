import React, { Component, Fragment } from 'react';
import Radio from '@/jingan-components/Form/Radio';
import TextArea from '@/jingan-components/Form/TextArea';
import styles from './index.less';

export default class SafetyMeasure extends Component {
  handleRadioChange = val => {
    const { onChange, value = [] } = this.props;
    onChange([val, undefined]);
  };

  handleTextChange = e => {
    const { onChange, value = [] } = this.props;
    onChange([value[0], e.target.value]);
  };

  render() {
    const { value = [], mode } = this.props;
    const [radioValue, textValue] = value;
    const isNotDetail = mode !== 'detail';

    return (
      <Fragment>
        <Radio
          value={radioValue || 0}
          onChange={this.handleRadioChange}
          mode={mode}
          list={[{ key: 0, value: '无' }, { key: 1, value: '需调整' }]}
        />
        {radioValue === 1 && (
          <TextArea mode={mode} value={textValue} onChange={this.handleTextChange} />
        )}
      </Fragment>
    );
  }
}
