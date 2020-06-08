import React, { useEffect } from 'react';
import { Radio } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import { EmptyText, Badge } from '@/jingan-components/View';
import { connect } from 'dva';
// import styles from './index.less';

const FIELDNAMES = {
  key: 'key',
  value: 'value',
  status: 'status',
  color: 'color',
};

const FormRadio = ({
  value,
  onChange,
  buttonStyle,
  mode,
  fieldNames,
  list,
  empty = <EmptyText />,
  ellipsis = true,
  getList,
  ...rest
}) => {
  const map = { ...FIELDNAMES, ...fieldNames };
  const { key: k, value: v, status: s, color: c } = map;
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
    const item = (list || []).find(item => item[k] === value);
    return item ? (
      item[s] || item[c] ? (
        <Badge fieldNames={map} list={list} value={value} />
      ) : ellipsis ? (
        <Ellipsis lines={1} tooltip {...ellipsis}>
          {item[v]}
        </Ellipsis>
      ) : (
        <span>{item[v]}</span>
      )
    ) : (
      empty
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
