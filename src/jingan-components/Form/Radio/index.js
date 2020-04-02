import React, { useEffect } from 'react';
import { Radio } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import EmptyText from '@/jingan-components/View/EmptyText';
import { connect } from 'dva';
// import styles from './index.less';

const FIELDNAMES = {
  key: 'key',
  value: 'value',
};

const FormRadio = ({
  value,
  onChange,
  buttonStyle,
  mode,
  fieldNames,
  list,
  emtpy = <EmptyText />,
  ellipsis = true,
  getList,
  ...rest
}) => {
  const { key: k, value: v } = { ...FIELDNAMES, ...fieldNames };
  useEffect(() => {
    getList && getList();
  }, []);
  if (mode !== 'detail') {
    const handleChange = ({ target: { value, data } }) => {
      onChange && onChange(value, data);
    };
    const Item = buttonStyle ? Radio.Button : Radio;
    return (
      <Radio.Group value={value} onChange={handleChange} buttonStyle={buttonStyle} {...rest}>
        {list &&
          list.map(item => (
            <Item key={item[k]} value={item[k]} title={item[v]} data={item}>
              {item[v]}
            </Item>
          ))}
      </Radio.Group>
    );
  } else {
    const label = list && (list.find(item => item[k] === value) || {})[v];
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
};

FormRadio.getRules = ({ label }) => [
  {
    required: true,
    whitespace: true,
    message: `${label || ''}不能为空`,
  },
];

export default connect(
  (state, { mapper, list }) => {
    const { namespace, list: l } = mapper || {};
    return {
      list: namespace && l ? state[namespace][l] : list,
    };
  },
  (dispatch, { mapper, params, getList, callback }) => {
    const { namespace, getList: gl } = mapper || {};
    return {
      getList:
        namespace && gl
          ? () => {
              dispatch({
                type: `${namespace}/${gl}`,
                payload: params,
                callback,
              });
            }
          : getList,
    };
  },
  (stateProps, dispatchProps, { mapper, params, list, getList, callback, ...ownProps }) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
  }),
  {
    areStatesEqual: () => false,
    areOwnPropsEqual: () => false,
    areStatePropsEqual: () => false,
    areMergedPropsEqual: (props, nextProps) => {
      return (
        props.value === nextProps.value &&
        props.list === nextProps.list &&
        props.mode === nextProps.mode
      );
    },
  }
)(FormRadio);
