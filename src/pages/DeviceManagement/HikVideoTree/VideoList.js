import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
// import { Link } from 'dva/router';
import { Row, Col, Card, Form, Input, Button, Table, Badge, Checkbox, Divider, Modal, Select } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import FolderTree from './FolderTree';

import styles from './VideoList.less';
import { AuthLink, AuthBtn } from '../../../utils/customAuth';
import buttonMap from '../../../utils/codes';

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

// 遍历函数,list形如[{a:0, children: [...]}, { a: 1, children: [...] }],handle为处理各节点的函数
function traverse(list, handle) {
  // console.log(list);
  list.forEach(item => {
    handle(item);
    const { children } = item;
    if (children)
      traverse(children, handle);
  });
}


// 节流函数,不然每次计算,网页太卡
function throttle(fn, ms) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

// 判断是否能被JSON.parse转成对象 '{ o: 1 }'
function isObjectStr(o) {
  return o[0] === '{' && o[o.length - 1] === '}';
}

// 判断能否被JSON.parse转成数组 '[0, 1]'
function isArrayStr(a) {
  return a[0] === '[' && a[a.length - 1] === ']';
}

@connect(({ video, loading }) => ({
  video,
  loading: loading.effects['video/fetch'],
}))
@Form.create()
export default class VideoList extends PureComponent {
  constructor(props) {
    super(props);
    const ssFolderId = sessionStorage.getItem('folderId');
    const ssFormValues = sessionStorage.getItem('formValues');
    const ssFilteredInfo = sessionStorage.getItem('filteredInfo');
    const ssSValue = sessionStorage.getItem('sValue');
    const ssExpandedKeys = sessionStorage.getItem('expandedKeys');
    const ssSelectedKeys = sessionStorage.getItem('selectedKeys');

    this.state = {
      folderId: ssFolderId || '',
      formValues: ssFormValues && isObjectStr(ssFormValues) ? JSON.parse(ssFormValues) : { isShowAll: true },
      filteredInfo: ssFilteredInfo && isObjectStr(ssFilteredInfo) ? JSON.parse(ssFilteredInfo) : {},
      sValue: ssSValue || '',
      searchValue: ssSValue || '',
      expandedKeys: ssExpandedKeys && isArrayStr(ssExpandedKeys) ? JSON.parse(ssExpandedKeys) : [],
      autoExpandParent: true,
      selectedKeys: ssSelectedKeys && isArrayStr(ssSelectedKeys) ? JSON.parse(ssSelectedKeys) : [],
    };
  }

  componentDidMount() {
    const { dispatch, form } = this.props;
    const { setFieldsValue } = form;
    const { folderId, formValues, filteredInfo } = this.state;
    dispatch({
      type: 'video/fetch',
      payload: {
        currentPage: 1,
        pageSize: PAGE_SIZE,
        folderId,
        ...formValues,
        ...filteredInfo,
      },
    });
    // 清空videoUrl
    this.props.dispatch({
      type: 'video/saveVideoUrl',
      payload: null,
    });

    setFieldsValue({ ...formValues });
  }

  componentWillUnmount() {
    const state = this.state;
    Object.entries(state).forEach(([key, val]) => {
      // console.log(key);
      if (key === 'autoExpandParent' || key === 'searchValue')
        return;

      sessionStorage.setItem(key, typeof val === 'object' ? JSON.stringify(val) : val);
    });
  }

  timer = null;
  // 生成节流函数,以防止网页太卡
  throttleFn = throttle((folderList, value, expandedKeys) => {
    traverse(folderList, ({ name, parentId }) => {
      // 不是空字符串 && name包含当前字符串 && expandedKeys数组中还没有其对应的parentId
      if (value && name.includes(value) && !expandedKeys.includes(parentId))
          expandedKeys.push(parentId);
    });
    this.setState({ expandedKeys, searchValue: value, autoExpandParent: true });
  }, 800);

  handleFormReset = (folderId) => {
    const { dispatch, form } = this.props;
    form.resetFields();
    this.clearFilters();
    this.setState({ folderId });

    dispatch({
      type: 'video/fetch',
      payload: {
        folderId: folderId || '',
        isShowAll: true,
      },
    });
  };

  handleTreeSearch = (e) => {
    const { target: { value } } = e;
    const { video: { folderList } } = this.props;
    const expandedKeys = [];
    this.setState({ sValue: value });
    // console.log('folderList', folderList);
    this.throttleFn(folderList, value, expandedKeys);
  };

  handleExpand = (expandedKeys, autoExpandParent) => {
    // console.log('handleExpand', expandedKeys);
    this.setState({ expandedKeys, autoExpandParent });
  };

  handleSelect = (selectedKeys) => {
    // console.log('handleSelect', selectedKeys);
    this.setState({ selectedKeys });
    this.handleFormReset(selectedKeys[0]);
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
  };

  /* 播放按钮失焦事件 */
  handlePlayButtonBlur = () => {
    console.log('blur');
    clearTimeout(this.timer);
    this.timer = null;
    this.props.dispatch({
      type: 'video/saveVideoUrl',
      payload: null,
    });
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    const { folderId } = this.state;

    // const { Option } = Select;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {/* <Col span={7}> */}
          <Col span={12}>
            <FormItem label="视频名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          {/* <Col span={5}>
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
          </Col> */}
          <Col span={6}>
            <FormItem>
              {getFieldDecorator('isShowAll',
                { valuePropName: 'checked', initialValue: true })(
                  <Checkbox>显示所有下级视频</Checkbox>
                )}
            </FormItem>
          </Col>
          {/* <Col span={5}> */}
          <Col span={6}>
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
            <AuthLink code={buttonMap.deviceManagement.hikVideoTree.detail} to={`/device-management/hik-video-tree/video-detail/${record.id}`}>查看</AuthLink>
            <Divider type="vertical" />
            {/* <button
              code={buttonMap.deviceManagement.hikVideoTree.play}
              className={styles.playButton}
              onClick={() => this.handlePlayButtonClick(record.id)}
              onBlur={this.handlePlayButtonBlur}
            >
              播放
            </button> */}
            <AuthBtn
              code={buttonMap.deviceManagement.hikVideoTree.play}
              className={styles.playButton}
              onClick={() => this.handlePlayButtonClick(record.id)}
              onBlur={this.handlePlayButtonBlur}
            >
              播放
            </AuthBtn>
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
    const { sValue, searchValue, expandedKeys, autoExpandParent, selectedKeys } = this.state;
    return (
      <PageHeaderLayout title="视频管理" breadcrumbList={breadcrumbList}>
        <Row gutter={16}>
          <Col span={6}>
            <Card title="视频组目录" id="folder-list">
              <Search style={{ marginBottom: 8 }} placeholder="请输入视频组或视频名称" value={sValue} onChange={this.handleTreeSearch} />
              <FolderTree
                searchValue={searchValue}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                selectedKeys={selectedKeys}
                handleExpand={this.handleExpand}
                handleSelect={this.handleSelect}
                // handleFormReset={folderId => this.handleFormReset(folderId)}
              />
            </Card>
          </Col>
          <Col span={18}>{this.renderRightTable()}</Col>
        </Row>
        <iframe src={videoUrl} title="视频播放" style={{ display: 'none' }} frameBorder="0" width="0" height="0" />
      </PageHeaderLayout>
    );
  }
}
