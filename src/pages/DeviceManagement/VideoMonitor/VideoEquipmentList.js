import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, List, Card, Button, Input, BackTop, Col, Row, Switch, message } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import codesMap from '@/utils/codes';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import {
  // hasAuthority,
  AuthButton,
  AuthLink,
} from '@/utils/customAuth';

import styles from './VideoEquipmentList.less';
import VideoPlay from '../../BigPlatform/FireControl/section/VideoPlay';

import videoIcon from './videoIcon.png';

const FormItem = Form.Item;

//面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '设备管理',
    name: '设备管理',
  },
  {
    title: '视频监控',
    name: '视频监控',
    href: '/device-management/video-monitor/list',
  },
  {
    title: '视频监控列表',
    name: '视频监控列表',
  },
];

// 默认页面显示数量
const pageSize = 18;
// 默认表单值
const defaultFormData = {
  name: undefined,
};

/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

@connect(({ videoMonitor, user, loading }) => ({
  videoMonitor,
  user,
  loading: loading.models.videoMonitor,
}))
@Form.create()
export default class VideoEquipmentList extends PureComponent {
  constructor(props) {
    super(props);
    this.formData = defaultFormData;
  }

  state = {
    total: 0,
    videoVisible: false,
    keyId: undefined,
    checkedArray: [],
    loadingArray: [],
  };

  // 生命周期函数
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { companyId },
      },
    } = this.props;
    // 获取视频设备列表
    dispatch({
      type: 'videoMonitor/fetchEquipmentList',
      payload: {
        companyId,
        pageSize,
        pageNum: 1,
      },
      callback: list => {
        if (list.length === 0) return;
        const checkedArray = list.reduce((prev, next) => {
          const { isInspection } = next;
          prev.push(!!isInspection);
          return prev;
        }, []);
        this.setState({
          total: list.length,
          checkedArray,
          loadingArray: Array(list.length).fill(false),
        });
      },
    });
  }

  // 查岗按钮开关点击事件
  switchOnChange = (index, checked) => {
    this.handleChangeStateArray(index, 'checkedArray', 'loadingArray');
  };

  handleChangeStateArray = (index, ...keys) => {
    this.setState(state =>
      keys.reduce((prev, next) => {
        const oldArray = state[next];
        const newArray = Array.from(oldArray);
        newArray[index] = !oldArray[index];
        prev[next] = newArray;
        return prev;
      }, {})
    );
  };

  /* 查询按钮点击事件 */
  handleClickToQuery = () => {
    const {
      form: { getFieldsValue },
      match: {
        params: { companyId },
      },
    } = this.props;
    const data = getFieldsValue();
    // 修改表单数据
    this.formData = data;
    // 重新请求数据
    this.props.dispatch({
      type: 'videoMonitor/fetchEquipmentList',
      payload: {
        companyId,
        ...data,
      },
    });
  };

  /* 重置按钮点击事件 */
  handleClickToReset = () => {
    const {
      form: { resetFields },
      match: {
        params: { companyId },
      },
    } = this.props;
    // 清除筛选条件
    resetFields();
    // 修改表单数据
    this.formData = defaultFormData;
    // 重新请求数据
    this.props.dispatch({
      type: 'videoMonitor/fetchEquipmentList',
      payload: {
        companyId,
      },
    });
  };

  // 显示视频模态框
  videoOnClick = keyId => {
    this.setState({ videoVisible: true, keyId: keyId });
  };

  // 关闭视频模态框
  handleVideoClose = () => {
    this.setState({ videoVisible: false, keyId: undefined });
  };

  /* 渲染form表单 */
  renderForm() {
    const {
      form: { getFieldDecorator },
      user: {
        currentUser: { permissionCodes: codes },
      },
      location: {
        query: { name },
      },
      match: {
        params: { companyId },
      },
    } = this.props;

    console.log(this.props);
    return (
      <Card>
        <Form layout="inline">
          <FormItem>
            {getFieldDecorator('name', {
              initialValue: defaultFormData.name,
              getValueFromEvent: e => e.target.value.trim(),
            })(<Input placeholder="请输入视频所属区域" />)}
          </FormItem>
          <FormItem>
            <Button type="primary" onClick={this.handleClickToQuery}>
              查询
            </Button>
          </FormItem>
          <FormItem>
            <Button onClick={this.handleClickToReset}>重置</Button>
          </FormItem>
          <FormItem style={{ float: 'right' }}>
            <AuthButton
              code={codesMap.deviceManagement.videoMonitor.add}
              codes={codes}
              type="primary"
              href={`#/device-management/video-monitor/add?companyId=${companyId}&name=${name}`}
            >
              新增视频
            </AuthButton>
          </FormItem>
        </Form>
      </Card>
    );
  }

  /* 渲染列表 */
  renderList() {
    const {
      videoMonitor: {
        videoData: { list },
      },
      user: {
        currentUser: { permissionCodes: codes },
      },
      location: {
        query: { name: equipmentListName },
      },
      dispatch,
    } = this.props;

    const { checkedArray, loadingArray } = this.state;

    return (
      <div className={styles.cardList} style={{ marginTop: '24px' }}>
        <List
          rowKey="id"
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={(item, index) => {
            const { id, name, companyId, deviceId, keyId } = item;
            return (
              <List.Item key={id}>
                <Card
                  title={name}
                  className={styles.card}
                  actions={[
                    <AuthLink
                      code={codesMap.deviceManagement.videoMonitor.view}
                      codes={codes}
                      to={`/device-management/video-monitor/${companyId}/detail/${id}?name=${equipmentListName}`}
                    >
                      查看
                    </AuthLink>,
                    <AuthLink
                      code={codesMap.deviceManagement.videoMonitor.edit}
                      codes={codes}
                      to={`/device-management/video-monitor/edit/${id}?name=${equipmentListName}`}
                    >
                      编辑
                    </AuthLink>,
                  ]}
                >
                  <Row>
                    <Col span={16}>
                      <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                        设备ID:
                        {deviceId || getEmptyData()}
                      </Ellipsis>
                      <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                        摄像头ID：
                        {keyId || getEmptyData()}
                      </Ellipsis>
                      <p>
                        是否用于查岗：
                        <Switch
                          loading={loadingArray[index]}
                          checked={checkedArray[index]}
                          checkedChildren="是"
                          unCheckedChildren="否"
                          onChange={checked => {
                            // 修改本地状态，并显示为正在加载
                            this.switchOnChange(index, checked);
                            dispatch({
                              type: 'videoMonitor/updateVideoDevice',
                              payload: {
                                companyId,
                                videoId: id,
                                // keyId,
                                isInspection: checkedArray[index] ? 0 : 1,
                              },
                              callback: code => {
                                if (code === 200)
                                  this.handleChangeStateArray(index, 'loadingArray');
                                else {
                                  message.error('修改失败');
                                  this.handleChangeStateArray(
                                    index,
                                    'checkedArray',
                                    'loadingArray'
                                  );
                                }
                              },
                            });
                          }}
                        />
                      </p>
                    </Col>
                    <Col span={8} style={{ cursor: 'pointer' }}>
                      <span
                        onClick={() => {
                          this.videoOnClick(keyId);
                        }}
                        className={styles.quantity}
                        style={{ backgroundImage: `url(${videoIcon})` }}
                      />
                    </Col>
                  </Row>
                </Card>
              </List.Item>
            );
          }}
        />
      </div>
    );
  }

  render() {
    const {
      videoMonitor: {
        videoData: { list = [] },
      },
      location: {
        query: { name: equipmentListName },
      },
    } = this.props;

    const { total, videoVisible, keyId } = this.state;

    const content =
      list && list.length ? (
        <span>
          视频总数：
          {total}
        </span>
      ) : (
        <span>视频总数：0</span>
      );

    return (
      <PageHeaderLayout title={equipmentListName} breadcrumbList={breadcrumbList} content={content}>
        <BackTop />
        {this.renderForm()}
        {this.renderList()}
        <VideoPlay
          draggable={false}
          style={{ position: 'fixed' }}
          visible={videoVisible}
          showList={false}
          videoList={[]}
          keyId={keyId}
          handleVideoClose={this.handleVideoClose}
        />
      </PageHeaderLayout>
    );
  }
}
