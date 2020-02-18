import React, { Component, Fragment } from 'react';
import { message, Spin, Button, Empty } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import CustomForm from '@/jingan-components/CustomForm';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import InputOrSpan from '@/jingan-components/InputOrSpan';
import SwitchOrSpan from '@/jingan-components/SwitchOrSpan';
import Company from '../../Company';
import { connect } from 'dva';
import router from 'umi/router';
import styles from './index.less';

export const BREADCRUMB_LIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '人员在岗在位管理', name: '人员在岗在位管理' },
  { title: '车牌识别系统', name: '车牌识别系统' },
  { title: '参数配置', name: '参数配置' },
];
const GET_CHANNEL_LIST_API = 'licensePlateRecognitionSystem/getChannelList';
const GET_CONFIG_API = 'licensePlateRecognitionSystem/getDisplayAndVoiceConfig';
const SET_CONFIG_API = 'licensePlateRecognitionSystem/setDisplayAndVoiceConfig';
const FIELDNAMES = {
  key: 'id',
  value: 'name',
};
const COLORS = [
  { key: '1', value: '单双色' },
  { key: '2', value: '炫彩屏' },
  { key: '3', value: '红色' },
  { key: '4', value: '绿色' },
];
const TYPES = [
  { key: '1', value: '二屏', length: 2 },
  { key: '2', value: '四屏', length: 4 },
  { key: '3', value: '竖屏', length: 1 },
];
const VOICES = [{ key: '1', value: '真实语音' }];
const VOLUMES = [
  { key: '1', value: '高' },
  { key: '2', value: '中' },
  { key: '3', value: '低' },
  { key: '4', value: '静音' },
];
const MODES = [
  { key: '1', value: '滚动' },
  { key: '2', value: '上翻' },
  { key: '3', value: '下翻' },
];
const SWITCHES = [{ key: '1', value: '是' }, { key: '0', value: '否' }];
const NUMBERS = ['一', '二', '三', '四'];
const STYLE = {
  marginBottom: undefined,
  padding: undefined,
};

@connect(
  ({ user, licensePlateRecognitionSystem, loading }) => ({
    user,
    licensePlateRecognitionSystem,
    loadingChannelList: loading.effects[GET_CHANNEL_LIST_API],
    loadingConfig: loading.effects[GET_CONFIG_API],
    submitting: loading.effects[SET_CONFIG_API],
  }),
  dispatch => ({
    getChannelList(payload, callback) {
      dispatch({
        type: GET_CHANNEL_LIST_API,
        payload: {
          // pageNum: 1,
          // pageSize: 0,
          ...payload,
        },
        callback: (success, data) => {
          if (!success) {
            message.error('获取通道列表失败，请稍候重试！');
          }
          callback && callback(success, data);
        },
      });
    },
    getConfig(payload, callback) {
      dispatch({
        type: GET_CONFIG_API,
        payload,
        callback: (success, data) => {
          if (!success) {
            message.error('获取配置失败，请稍候重试！');
          }
          callback && callback(success, data);
        },
      });
    },
    setConfig(payload, callback) {
      dispatch({
        type: SET_CONFIG_API,
        payload,
        callback: (success, data) => {
          if (success) {
            message.success('应用配置成功！');
          } else {
            message.error('应用配置失败，请稍候重试！');
          }
          callback && callback(success, data);
        },
      });
    },
  })
)
export default class DisplayAndVoice extends Component {
  state = {
    channelId: undefined,
  };

  componentDidMount() {
    const {
      user: {
        currentUser: { unitType, unitId: unitId1 },
      },
      match: {
        params: { unitId: unitId2 },
      },
    } = this.props;
    const unitId = +unitType === 4 ? unitId1 : unitId2;
    if (unitId) {
      const { getChannelList } = this.props;
      getChannelList({
        // unitId,
      });
    }
  }

  componentDidUpdate({
    match: {
      params: { unitId: prevUnitId },
    },
  }) {
    const {
      match: {
        params: { unitId },
      },
    } = this.props;
    if (unitId !== prevUnitId && unitId) {
      const { getChannelList } = this.props;
      getChannelList({
        // unitId,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.licensePlateRecognitionSystem !== this.props.licensePlateRecognitionSystem ||
      nextProps.loadingChannelList !== this.props.loadingChannelList ||
      nextProps.loadingConfig !== this.props.loadingConfig ||
      nextProps.submitting !== this.props.submitting ||
      nextProps.match.params.unitId !== this.props.match.params.unitId ||
      nextState !== this.state
    );
  }

  setFormReference = form => {
    this.form = form;
  };

  refresh = () => {
    setTimeout(() => {
      this.forceUpdate();
    }, 0);
  };

  handleFilterOption = (input, option) =>
    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;

  handleSelect = channelId => {
    const { getConfig } = this.props;
    getConfig({
      channelId,
    });
    this.setState({
      channelId,
    });
  };

  handleSubmitButtonClick = () => {
    const { channelId } = this.state;
    const { validateFieldsAndScroll } = this.form;
    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        const { setConfig } = this.props;
        const payload = {
          channelId,
          ...values,
        };
        setConfig(payload);
      }
    });
  };

  renderConfig() {
    const {
      route: { path },
      user: { currentUser: { unitType } = {} },
      licensePlateRecognitionSystem: {
        channelList: { list = [] } = {},
        displayAndVoiceConfig = {},
      },
      loadingChannelList = false,
      loadingConfig = false,
      submitting = false,
    } = this.props;
    const { channelId } = this.state;
    const breadcrumbList = BREADCRUMB_LIST.concat(
      [
        +unitType !== 4 && {
          title: '单位信息',
          name: '单位信息',
          href: path.replace(/\/:[^\/]*/g, ''),
        },
        { title: '显示与语音配置', name: '显示与语音配置' },
      ].filter(v => v)
    );
    const { type } = this.form ? this.form.getFieldsValue() : {};
    const { length } = TYPES.find(({ key }) => key === type) || {};
    const fields = [
      {
        key: '-1',
        title: '基本参数',
        fields: [
          {
            id: 'color',
            label: '屏颜色类型',
            style: STYLE,
            render: () => <SelectOrSpan list={COLORS} placeholder="请选择屏颜色类型" />,
            options: {
              rules: [{ required: true, message: '请选择屏颜色类型' }],
              initialValue: displayAndVoiceConfig.color || undefined,
            },
          },
          {
            id: 'type',
            label: '屏类型',
            style: STYLE,
            render: () => (
              <SelectOrSpan list={TYPES} placeholder="请选择屏类型" onChange={this.refresh} />
            ),
            options: {
              rules: [{ required: true, message: '请选择屏类型' }],
              initialValue: displayAndVoiceConfig.type || undefined,
            },
          },
          {
            id: 'voice',
            label: '语音类型',
            style: STYLE,
            render: () => <SelectOrSpan list={VOICES} placeholder="请选择语音类型" />,
            options: {
              rules: [{ required: true, message: '请选择语音类型' }],
              initialValue: displayAndVoiceConfig.voice || undefined,
            },
          },
          {
            id: 'volume',
            label: '音量大小',
            style: STYLE,
            render: () => <SelectOrSpan list={VOLUMES} placeholder="请选择音量大小" />,
            options: {
              rules: [{ required: true, message: '请选择音量大小' }],
              initialValue: displayAndVoiceConfig.volume || undefined,
            },
          },
        ],
      },
    ].concat(
      [...Array(length || 0).keys()].map(i => ({
        key: `${i}`,
        title: `屏${NUMBERS[i]}设置`,
        fields: [
          {
            id: `message${i}`,
            label: '广告词',
            style: STYLE,
            render: () => <InputOrSpan placeholder="请输入广告词" />,
            options: {
              rules: [{ required: true, whitespace: true, message: '请输入广告词' }],
              initialValue: displayAndVoiceConfig[`message${i}`] || undefined,
            },
          },
          {
            id: `color${i}`,
            label: '颜色',
            style: STYLE,
            render: () => <SelectOrSpan list={COLORS} placeholder="请选择颜色" />,
            options: {
              rules: [{ required: true, message: '请选择颜色' }],
              initialValue: displayAndVoiceConfig[`color${i}`] || undefined,
            },
          },
          {
            id: `mode${i}`,
            label: '动作',
            style: STYLE,
            render: () => <SelectOrSpan list={MODES} placeholder="请选择动作" />,
            options: {
              rules: [{ required: true, message: '请选择动作' }],
              initialValue: displayAndVoiceConfig[`mode${i}`] || undefined,
            },
          },
          {
            id: `showSpace${i}`,
            label: '显示剩余车位数',
            style: STYLE,
            render: () => <SwitchOrSpan list={SWITCHES} />,
            options: {
              rules: [{ required: true, message: '请选择是否显示剩余车位数' }],
              initialValue: displayAndVoiceConfig[`showSpace${i}`] || SWITCHES[1].key,
            },
          },
          {
            id: `showTime${i}`,
            label: '显示时间',
            style: STYLE,
            render: () => <SwitchOrSpan list={SWITCHES} />,
            options: {
              rules: [{ required: true, message: '请选择是否显示时间' }],
              initialValue: displayAndVoiceConfig[`showTime${i}`] || SWITCHES[1].key,
            },
          },
        ],
      }))
    );

    return (
      <PageHeaderLayout
        breadcrumbList={breadcrumbList}
        title={breadcrumbList[breadcrumbList.length - 1].title}
        content={
          <Fragment>
            选择通道：
            <SelectOrSpan
              style={{ width: 200 }}
              placeholder="请选择通道"
              fieldNames={FIELDNAMES}
              list={list}
              value={channelId}
              onChange={this.handleChange}
              onSelect={this.handleSelect}
              onSearch={this.handleSearch}
              filterOption={this.handleFilterOption}
              showSearch
            />
          </Fragment>
        }
      >
        <Spin spinning={loadingChannelList || loadingConfig}>
          {channelId ? (
            <CustomForm
              mode="multiple"
              layout="vertical"
              fields={fields}
              searchable={false}
              resetable={false}
              action={
                <Button type="primary" onClick={this.handleSubmitButtonClick} loading={submitting}>
                  应用
                </Button>
              }
              ref={this.setFormReference}
            />
          ) : (
            <Empty description="请先选择通道" />
          )}
        </Spin>
      </PageHeaderLayout>
    );
  }

  renderCompany() {
    const { route, location, match } = this.props;
    const props = {
      route,
      location,
      match,
    };

    return (
      <Company
        breadcrumbList={BREADCRUMB_LIST.concat({
          title: '单位信息',
          name: '单位信息',
        })}
        {...props}
      />
    );
  }

  render() {
    const {
      user: { currentUser: { unitType } = {} },
      match: {
        params: { unitId },
      },
    } = this.props;

    return unitType === 4 || unitId ? this.renderConfig() : this.renderCompany();
  }
}
