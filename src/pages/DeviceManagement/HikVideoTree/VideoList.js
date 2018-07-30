import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
// import { Link } from 'dva/router';
import { Row, Col, Card, Form, Input, Button, Table, Badge, Checkbox, Divider, Modal, Select } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import FolderTree from './FolderTree';

import styles from './VideoList.less';
import { AuthLink } from '../../../utils/customAuth';
import buttonsMap from '../../../utils/codes';

const PAGE_SIZE = 20;

const statusMap = ['default', 'success', 'error', 'processing'];
const status = ['关闭', '正常', '异常', '缓慢'];
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const FormItem = Form.Item;
const { Search } = Input;

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '设备管理', name: '设备管理'},
  { title: '海康视频树', name: '海康视频树' },
  { title: '视频列表', name: '视频列表' },
];

@connect(({ video, loading }) => ({
  video,
  loading: loading.effects['video/fetch'],
}))
@Form.create()
export default class VideoList extends PureComponent {
  state = {
    folderId: '',
    formValues: {
      isShowAll: true,
    },
    // timer: null,
    filteredInfo: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { folderId, formValues } = this.state;
    dispatch({
      type: 'video/fetch',
      payload: {
        currentPage: 1,
        pageSize: PAGE_SIZE,
        folderId,
        ...formValues,
      },
    });
    // 清空videoUrl
    this.props.dispatch({
      type: 'video/saveVideoUrl',
      payload: null,
    });
  }

  timer = null;

  handleFormReset = (folderId) => {
    const { dispatch, form } = this.props;
    form.resetFields();
    this.clearFilters();
    this.setState({
      folderId,
    });
    dispatch({
      type: 'video/fetch',
      payload: {
        folderId: folderId || '',
        isShowAll: true,
      },
    });
  };

  handleTableChange = (pagination, filtersArg) => {
    const { formValues, folderId } = this.state;
    const { dispatch } = this.props;

    const filteredInfo = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    this.setState({
      filteredInfo,
    });

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filteredInfo,
      folderId: folderId || '',
    };

    dispatch({
      type: 'video/fetch',
      payload: params,
    });
  };

  clearFilters = () => {
    this.setState({ filteredInfo: {} });
  };

  handleSearch = (e) => {
    e.preventDefault();
    e.persist();

    const { dispatch, form } = this.props;
    const { folderId, filteredInfo } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      this.setState({
        formValues: fieldsValue,
      });

      dispatch({
        type: 'video/fetch',
        payload: {
          folderId: folderId || '',
          ...fieldsValue,
          ...filteredInfo,
        },
      });
    });
  };

  handleTreeSearch = (e) => {
    console.log(e);
  };

  handlePlayButtonClick = (id) => {
    if (this.timer !== null) {
      return;
    }
    const url = 'http://p92lxg7ga.bkt.clouddn.com/VideoClientSetup.exe.zip';
    this.props.dispatch({
      type: 'video/fetchVideoUrl',
      payload: {
        id,
      },
      callback: () => {
        this.timer = setTimeout(() => {
          Modal.warning({
            title: '请安装播放器！',
            content: (<a href={url} style={{ textDecoration: 'none' }}>点击下载</a>),
            okText: '关闭',
          });
        }, 1000);
      },
    });
  }

  /* 播放按钮失焦事件 */
  handlePlayButtonBlur = () => {
    // const { timer } = this.state;
    clearTimeout(this.timer);
    this.timer = null;
    this.props.dispatch({
      type: 'video/deleteVideoUrl',
    });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    const { folderId } = this.state;

    const { Option } = Select;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col span={7}>
            <FormItem label="视频名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择">
                  <Option value="0">关闭</Option>
                  <Option value="1">正常</Option>
                  <Option value="2">异常</Option>
                  <Option value="3">缓慢</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem>
              {getFieldDecorator('isShowAll',
                { valuePropName: 'checked', initialValue: true })(
                  <Checkbox>显示所有下级视频</Checkbox>
                )}
            </FormItem>
          </Col>
          <Col span={5}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={() => this.handleFormReset(folderId)}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }

  renderRightTable() {
    const {
      video: {
        data: { list, pagination },
      },
      loading,
    } = this.props;
    const { filteredInfo } = this.state;

    const statusFilter = filteredInfo && filteredInfo.status ? filteredInfo.status.split(',') : [];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: pagination ? pagination.currentPage : undefined,
      ...pagination,
    };
    const columns = [
      {
        title: '视频名称',
        dataIndex: 'name',
      },
      {
        title: '所属目录',
        dataIndex: 'dirName',
      },
      {
        title: '状态',
        dataIndex: 'status',
        filters: [
          {
            text: status[0],
            value: '0',
          },
          {
            text: status[1],
            value: '1',
          },
          {
            text: status[2],
            value: '2',
          },
          {
            text: status[3],
            value: '3',
          },
        ],
        filteredValue: statusFilter || null,
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '操作',
        render: (val, record) => (
          <Fragment>
            {/* <Link to={`/video/${record.id}/detail`}>查看</Link> */}
            <AuthLink code={buttonsMap.deviceManagement.hikVideoTree.detail} to={`/device-management/hik-video-tree/video-detail/${record.id}`}>查看</AuthLink>
            <Divider type="vertical" />
            <button
              className={styles.playButton}
              onClick={() => this.handlePlayButtonClick(record.id)}
              onBlur={this.handlePlayButtonBlur}
            >
              播放
            </button>
          </Fragment>
        ),
      },
    ];
    return (
      <Card title="视频列表" bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
        </div>
        <Table
          columns={columns}
          dataSource={list}
          loading={loading}
          pagination={paginationProps}
          rowKey={record => record.id}
          onChange={this.handleTableChange}
        />
      </Card>
    );
  }

  render() {
    const { video: { videoUrl } } = this.props;
    return (
      <PageHeaderLayout title="视频管理" breadcrumbList={breadcrumbList}>
        <Row gutter={16}>
          <Col span={6}>
            <Card title="视频组目录" id="folder-list">
              <Search style={{ marginBottom: 8 }} placeholder="请输入视频组或视频名称" onChange={this.handleTreeSearch} />
              <FolderTree handleFormReset={folderId => this.handleFormReset(folderId)} />
            </Card>
          </Col>
          <Col span={18}>{this.renderRightTable()}</Col>
        </Row>
        <iframe src={videoUrl} title="视频播放" style={{ display: 'none' }} frameBorder="0" width="0" height="0" />
      </PageHeaderLayout>
    );
  }
}
