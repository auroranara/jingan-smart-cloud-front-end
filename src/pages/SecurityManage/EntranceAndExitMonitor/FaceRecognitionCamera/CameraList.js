import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { List, Card, Button, Input, BackTop, Col, Row, Switch, message, Select, Spin, Popconfirm } from 'antd';
import { Link, routerRedux } from 'dva/router';
import Ellipsis from '@/components/Ellipsis';
import InfiniteScroll from 'react-infinite-scroller';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
// import { AuthButton } from '@/utils/customAuth';
// import codesMap from '@/utils/codes';

import styles from './CameraList.less';
import VideoPlay from '../../../BigPlatform/FireControl/section/VideoPlay';

import videoIcon from '../images/videoIcon.png';

// const { confirm } = modal;
const FormItem = Form.Item;
const { Option } = Select;

const title = '人脸识别摄像机';

//面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '安防管理',
    name: '安防管理',
  },
  {
    title: '出入口监测',
    name: '出入口监测',
    href: '/security-manage/entrance-and-exit-monitor/company-list',
  },
  {
    title,
    name: '人脸识别摄像机',
  },
];

// 默认页面显示数量
const pageSize = 18;

// 默认表单值
const defaultFormData = {
  videoCameraArea: undefined,
  location: undefined,
};

/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

@connect(({ securityManage, user, loading }) => ({
  securityManage,
  user,
  loading: loading.models.securityManage,
}))
@Form.create()
export default class CameraList extends PureComponent {
  constructor(props) {
    super(props);
    this.formData = defaultFormData;
  }

  state = {
    total: 0,
    videoVisible: false,
    keyId: undefined,
    checkedArray: [],
    deviceId: undefined,
    videoCameraUrl: undefined,
  };

  // 生命周期函数
  componentDidMount() {
    const {
      dispatch,
      location: {
        query: { faceDataBaseId },
      },
    } = this.props;
    // 获取视频设备列表
    dispatch({
      type: 'securityManage/fetchFaceCameraList',
      payload: {
        monitorSceneId: faceDataBaseId,
        pageSize,
        pageNum: 1,
      },
      callback: response => {
        const { list } = response;
        if (list.length === 0) return;
        const checkedArray = list.reduce((prev, next) => {
          const { state } = next;
          prev.push(+state === 1 ? true : false);
          return prev;
        }, []);
        this.setState({
          checkedArray,
        });
      },
    });
  }

  // 按钮开关点击事件
  switchOnChange = (index, checked) => {
    this.handleChangeStateArray(index, 'checkedArray');
  };

  handleChangeStateArray = (index, ...keys) => {
    const {
      dispatch,
      location: {
        query: { faceDataBaseId },
      },
    } = this.props;
    this.setState(state =>
      keys.reduce((prev, next) => {
        const oldArray = state[next];
        const newArray = Array.from(oldArray);
        newArray[index] = !oldArray[index];
        prev[next] = newArray;
        return prev;
      }, {})
    );
    setTimeout(() => {
      dispatch({
        type: 'securityManage/fetchFaceCameraList',
        payload: {
          monitorSceneId: faceDataBaseId,
          pageSize,
          pageNum: 1,
        },
      });
    }, 500);
  };

  /* 查询按钮点击事件 */
  handleClickToQuery = () => {
    const {
      dispatch,
      form: { getFieldsValue },
      location: {
        query: { faceDataBaseId },
      },
    } = this.props;
    const data = getFieldsValue();
    // 修改表单数据
    this.formData = data;
    // 重新请求数据
    dispatch({
      type: 'securityManage/fetchFaceCameraList',
      payload: {
        monitorSceneId: faceDataBaseId,
        ...data,
      },
    });
  };

  /* 重置按钮点击事件 */
  handleClickToReset = () => {
    const {
      dispatch,
      form: { resetFields },
      location: {
        query: { faceDataBaseId },
      },
    } = this.props;
    // 清除筛选条件
    resetFields();
    // 修改表单数据
    this.formData = defaultFormData;
    // 重新请求数据
    dispatch({
      type: 'securityManage/fetchFaceCameraList',
      payload: {
        monitorSceneId: faceDataBaseId,
      },
    });
  };

  handleLoadMore = () => {
    const {
      dispatch,
      securityManage: { isLast },
      location: {
        query: { faceDataBaseId },
      },
    } = this.props;
    if (isLast) {
      return;
    }
    const {
      securityManage: { pageNum },
    } = this.props;
    // 请求数据
    dispatch({
      type: 'securityManage/fetchFaceCameraListMore',
      payload: {
        monitorSceneId: faceDataBaseId,
        pageSize,
        pageNum: pageNum + 1,
        ...this.formData,
      },
    });
  };

  handleCardDelete = id => {
    const {
      dispatch,
      // location: {
      //   query: { faceDataBaseId },
      // },
    } = this.props;
    dispatch({
      type: 'securityManage/fetchCameraDelete',
      payload: {
        id,
      },
      success: () => {
        message.success('删除成功！');
        const {
          securityManage: {
            faceCameraData: { list },
          },
        } = this.props;
        const checkedArray = list.reduce((prev, next) => {
          const { state } = next;
          prev.push(+state === 1 ? true : false);
          return prev;
        }, []);
        this.setState({
          checkedArray,
        });
      },
      error: msg => {
        message.error(msg);
      },
    });
  };

  // 显示视频模态框
  videoOnClick = (equipmentNo, videoCameraNo, videoCameraUrl) => {
    this.setState({
      videoVisible: true,
      keyId: videoCameraNo,
      deviceId: equipmentNo,
      videoCameraUrl: videoCameraUrl,
    });
  };

  // 关闭视频模态框
  handleVideoClose = () => {
    this.setState({
      videoVisible: false,
      keyId: undefined,
      deviceId: undefined,
      videoCameraUrl: undefined,
    });
  };

  handleAdd = id => {
    const {
      dispatch,
      location: {
        query: { companyName, companyId, faceDataBaseId },
      },
    } = this.props;
    dispatch(
      routerRedux.push(
        `/security-manage/entrance-and-exit-monitor/camera-add?id=${id}&&faceDataBaseId=${faceDataBaseId}&&companyId=${companyId}&&companyName=${companyName}`
      )
    );
  };

  /* 渲染form表单 */
  renderForm() {
    const {
      form: { getFieldDecorator },
      match: {
        params: { id },
      },
      // user: {
      //   currentUser: { permissionCodes: codes },
      // },
    } = this.props;

    return (
      <Card>
        <Form layout="inline">
          <FormItem>
            {getFieldDecorator('videoCameraArea', {
              initialValue: defaultFormData.videoCameraArea,
            })(<Input placeholder="请输入视频所属区域" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('location', {
              initialValue: defaultFormData.location,
            })(<Input placeholder="请输入视频所属位置" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('state', {
              initialValue: defaultFormData.state,
            })(
              <Select
                allowClear
                placeholder="请选择视频监控状态"
                getPopupContainer={() => document.querySelector('#root>div')}
                style={{ width: '180px' }}
              >
                <Option value={'0'} key={'0'}>
                  禁用
                </Option>
                <Option value={'1'} key={'1'}>
                  启用
                </Option>
              </Select>
            )}
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
            <Button type="primary" onClick={() => this.handleAdd(id)}>
              新增摄像机
            </Button>
          </FormItem>
        </Form>
      </Card>
    );
  }

  /* 渲染列表 */
  renderList() {
    const {
      securityManage: {
        faceCameraData: { list },
      },
      match: {
        params: { id: pagesId },
      },
      location: {
        query: { companyName, faceDataBaseId, companyId },
      },
      dispatch,
    } = this.props;

    const { checkedArray } = this.state;

    return (
      <div className={styles.cardList} style={{ marginTop: '24px' }}>
        <List
          rowKey="id"
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={(item, index) => {
            const {
              id,
              name,
              number,
              state,
              videoCameraArea,
              location,
              equipmentNo,
              videoCameraNo,
              videoCameraUrl,
            } = item;
            const title = videoCameraArea + location;

            return (
              <List.Item key={id}>
                <Card
                  title={title}
                  className={styles.card}
                  actions={[
                    <Link
                      to={`/security-manage/entrance-and-exit-monitor/camera-detail/${id}?id=${pagesId}&&faceDataBaseId=${faceDataBaseId}&&companyId=${companyId}&&companyName=${companyName}`}
                      target="_blank"
                    >
                      查看
                    </Link>,
                    <Link
                      to={`/security-manage/entrance-and-exit-monitor/camera-edit/${id}?id=${pagesId}&&faceDataBaseId=${faceDataBaseId}&&companyId=${companyId}&&companyName=${companyName}`}
                      target="_blank"
                    >
                      编辑
                    </Link>,
                    <Popconfirm
                      title="确认要删除该摄像机吗？"
                      onConfirm={() => this.handleCardDelete(id)}
                    >
                      <span>删除</span>
                    </Popconfirm>,
                  ]}
                >
                  <Row>
                    <Col span={16}>
                      <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                        名称: {''} {name || getEmptyData()}
                      </Ellipsis>
                      <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                        编号：
                        {number || getEmptyData()}
                      </Ellipsis>
                      <p>
                        监控状态：
                        <Switch
                          checked={checkedArray[index]}
                          checkedChildren="启用"
                          unCheckedChildren="禁用"
                          onChange={checked => {
                            // 修改本地状态，并显示为正在加载
                            this.switchOnChange(index, checked);
                            dispatch({
                              type: 'securityManage/fetchFaceCameraEdit',
                              payload: {
                                id,
                                state: checkedArray[index] ? 0 : 1,
                              },
                              callback: code => {
                                if (code === 200) this.handleChangeStateArray(index);
                                else {
                                  message.error('修改失败');
                                  this.handleChangeStateArray(index, 'checkedArray');
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
                          this.videoOnClick(equipmentNo, videoCameraNo, videoCameraUrl);
                        }}
                        className={styles.iconStyles}
                        style={{ backgroundImage: `url(${videoIcon})` }}
                      />
                    </Col>
                  </Row>
                  {+state === 0 && <div className={styles.disable}>已禁用</div>}
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
      loading,
      securityManage: {
        isLast,
        faceCameraData: { list = [] },
      },
      location: {
        query: { companyName },
      },
    } = this.props;

    const { videoVisible, keyId, deviceId, videoCameraUrl } = this.state;

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            <p>{companyName}</p>
            <p>
              视频总数：
              {list.length}
            </p>
          </div>
        }
      >
        <BackTop />
        {this.renderForm()}
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={() => {
            // 防止多次加载
            !loading && this.handleLoadMore();
          }}
          hasMore={!isLast}
          loader={
            <div className="loader" key={0}>
              {loading && (
                <div style={{ paddingTop: '50px', textAlign: 'center' }}>
                  <Spin />
                </div>
              )}
            </div>
          }
        >
          {this.renderList()}
        </InfiniteScroll>
        <VideoPlay
          draggable={false}
          style={{ position: 'fixed' }}
          visible={videoVisible}
          showList={false}
          videoList={[]}
          keyId={keyId}
          deviceId={deviceId}
          videoCameraUrl={videoCameraUrl}
          handleVideoClose={this.handleVideoClose}
        />
      </PageHeaderLayout>
    );
  }
}
