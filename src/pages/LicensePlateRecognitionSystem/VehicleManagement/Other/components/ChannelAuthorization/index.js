import React, { Component } from 'react';
import { List, Checkbox } from 'antd';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import { connect } from 'dva';
import styles from './index.less';

const GRID = {
  gutter: 24,
  xl: 3,
  lg: 2,
  sm: 1,
  xs: 1,
};
const API = 'licensePlateRecognitionSystem/getChannelAuthorizationTree';
const TYPES = [{ key: '0', value: '全部通道' }, { key: '1', value: '部分通道' }];

@connect(
  ({
    licensePlateRecognitionSystem: { channelAuthorizationTree },
    loading: {
      effects: { [API]: loading },
    },
  }) => ({
    channelAuthorizationTree,
    loading,
  }),
  (dispatch, { unitId }) => ({
    getChannelAuthorizationTree(payload, callback) {
      dispatch({
        type: API,
        payload: {
          companyId: unitId,
          parkStatus: '1',
          ...payload,
        },
        callback,
      });
    },
  })
)
export default class ChannelAuthorization extends Component {
  componentDidMount() {
    const { getChannelAuthorizationTree } = this.props;
    getChannelAuthorizationTree();
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.channelAuthorizationTree !== this.props.channelAuthorizationTree ||
      nextProps.loading !== this.props.loading ||
      nextProps.value !== this.props.value
    );
  }

  renderItem({ parkId, parkName, gateInfoList }) {
    const { onChange } = this.props;
    let { value } = this.props;
    value = value || [];
    const v = value.find(item => item.id === parkId);
    const checked = !!v;
    const type = (v && v.type) || TYPES[0].key;
    const disabled = type === TYPES[0].key;
    const channelList = gateInfoList || [];
    const checkedChannelList = disabled ? channelList : (v && v.children) || [];

    return (
      <div>
        <div className={styles.wrapper}>
          <Checkbox
            checked={checked}
            onChange={({ target: { checked } }) =>
              onChange(
                checked
                  ? value.concat({ id: parkId, type: TYPES[0].key })
                  : value.filter(item => item !== v)
              )
            }
          >
            {parkName}
          </Checkbox>
        </div>
        <div className={styles.wrapper}>
          <SelectOrSpan
            style={{ width: 'auto' }}
            disabled={!checked}
            list={TYPES}
            value={type}
            onChange={type => onChange(value.map(item => (item === v ? { ...v, type } : item)))}
          />
        </div>
        {channelList.map(channel => {
          const { id, gateName } = channel;
          const checkedChannel = checkedChannelList.find(item => item.id === id);
          return (
            <div className={styles.wrapper} key={id}>
              <Checkbox
                disabled={!checked || disabled}
                checked={!!checkedChannel}
                onChange={({ target: { checked } }) =>
                  onChange(
                    value.map(
                      item =>
                        item === v
                          ? {
                              ...v,
                              children: checked
                                ? checkedChannelList.concat(channel)
                                : checkedChannelList.filter(item => item !== checkedChannel),
                            }
                          : item
                    )
                  )
                }
              >
                {gateName}
              </Checkbox>
            </div>
          );
        })}
      </div>
    );
  }

  renderItem2({ id, type, children }) {
    let { channelAuthorizationTree } = this.props;
    channelAuthorizationTree = channelAuthorizationTree || [];
    const { parkName, gateInfoList } =
      channelAuthorizationTree.find(item => item.parkId === id) || {};
    const channelList = gateInfoList || [];
    const checkedChannelList =
      type === TYPES[0].key
        ? channelList
        : (children || []).map(({ id }) => channelList.find(item => item.id === id)).filter(v => v);

    return (
      <div>
        <div className={styles.fieldWrapper}>
          <div className={styles.fieldName}>车场：</div>
          <div className={styles.fieldValue}>
            {parkName}（<SelectOrSpan list={TYPES} value={`${type}`} type="span" />）
          </div>
        </div>
        <div className={styles.fieldWrapper}>
          <div className={styles.fieldName}>通道：</div>
          <div className={styles.fieldValue}>
            {checkedChannelList.map(({ id, gateName }) => (
              <div key={id}>{gateName}</div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { channelAuthorizationTree, loading, type, value } = this.props;

    return type !== 'span' ? (
      <List
        className={styles.list}
        grid={GRID}
        loading={loading}
        dataSource={channelAuthorizationTree}
        renderItem={item => <List.Item>{this.renderItem(item)}</List.Item>}
      />
    ) : (
      <List
        className={styles.list}
        grid={GRID}
        loading={loading}
        dataSource={value}
        renderItem={item => <List.Item>{this.renderItem2(item)}</List.Item>}
      />
    );
  }
}
