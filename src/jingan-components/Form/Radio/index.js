import React, { Component } from 'react';
import { Radio } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import EmptyText from '@/jingan-components/View/EmptyText';
import { connect } from 'dva';
import styles from './index.less';

const FIELDNAMES = {
  key: 'key',
  value: 'value',
};

@connect(
  (state, { mapper }) => {
    const { namespace, list, getList } = mapper || {};
    return {
      list: namespace && list ? state[namespace][list] : [],
      loading: namespace && getList ? state.loading.effects[`${namespace}/${getList}`] : false,
    };
  },
  null,
  (stateProps, { dispatch }, { mapper, params, ...ownProps }) => {
    const { namespace, getList } = mapper || {};
    return {
      ...stateProps,
      ...ownProps,
      getList:
        namespace && getList
          ? (payload, callback) => {
              dispatch({
                type: `${namespace}/${getList}`,
                payload: {
                  ...params,
                  ...payload,
                },
                callback,
              });
            }
          : undefined,
    };
  }
)
export default class FormRadio extends Component {
  componentDidMount() {
    const { getList } = this.props;
    getList && getList();
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.value !== this.props.value ||
      nextProps.list !== this.props.list ||
      nextProps.loading !== this.props.loading ||
      nextProps.mode !== this.props.mode
    );
  }

  handleChange = ({ target: { value, data } }) => {
    const { onChange } = this.props;
    onChange && onChange(value, data);
  };

  render() {
    const {
      value,
      onChange,
      buttonStyle,
      mode = 'add',
      fieldNames,
      list = [],
      emtpy = <EmptyText />,
      ellipsis = true,
      getList,
      ...restProps
    } = this.props;
    const { key: k, value: v } = { ...FIELDNAMES, ...fieldNames };

    if (mode !== 'detail') {
      const Item = buttonStyle ? Radio.Button : Radio;
      return (
        <Radio.Group
          value={value}
          onChange={this.handleChange}
          buttonStyle={buttonStyle}
          {...restProps}
        >
          {list.map(item => (
            <Item key={item[k]} value={item[k]} data={item}>
              {item[v]}
            </Item>
          ))}
        </Radio.Group>
      );
    } else {
      const label = (list.find(item => item[k] === value) || {})[v];
      return label ? (
        ellipsis ? (
          <Ellipsis lines={1} tooltip {...ellipsis}>
            {label}
          </Ellipsis>
        ) : (
          <span>{label}</span>
        )
      ) : (
        emtpy
      );
    }
  }
}
