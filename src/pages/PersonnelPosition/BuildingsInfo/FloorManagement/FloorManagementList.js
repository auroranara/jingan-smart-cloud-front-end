import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Input, Table, InputNumber, Divider, Col, Popconfirm } from 'antd';
import { routerRedux } from 'dva/router';

import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';

import Lightbox from 'react-images';
import codesMap from '@/utils/codes';
import { AuthA, AuthButton } from '@/utils/customAuth';

const FormItem = Form.Item;

// 默认表单值
const defaultFormData = {
  floorName: undefined,
  floorNumber: undefined,
};

// const PAGE_SIZE = 10;

@connect(({ buildingsInfo, user, loading }) => ({
  buildingsInfo,
  user,
  loading: loading.models.buildingsInfo,
}))
@Form.create()
export default class FloorManagementList extends PureComponent {
  constructor(props) {
    super(props);
    this.formData = defaultFormData;
  }
  state = {
    visible: false,
    imgUrl: [], // 附件图片列表
    currentImage: 0, // 展示附件大图下标
  };

  // 挂载后
  componentDidMount() {
    const {
      dispatch,
      buildingsInfo: {
        floorData: {
          pagination: { pageSize },
        },
      },
      match: {
        params: { id },
      },
    } = this.props;
    // 获取列表
    dispatch({
      type: 'buildingsInfo/fetchFloorList',
      payload: {
        building_id: id,
        pageSize,
        pageNum: 1,
      },
    });
  }

  // 跳转到详情页面
  goFloorDetail = id => {
    const {
      dispatch,
      location: {
        query: { name },
      },
      match: {
        params: { id: buildingId },
      },
    } = this.props;
    dispatch(
      routerRedux.push(
        `/personnel-position/buildings-info/floor/detail/${id}?buildingId=${buildingId}&&companyId=${id}&&name=${name}`
      )
    );
  };

  // 跳转到编辑页面
  goFloorEdit = id => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/personnel-position/buildings-info/floor/edit/${id}`));
  };

  // 查看附件
  handleShowModal = floorWebUrl => {
    const newFiles = floorWebUrl.map(({ webUrl }) => {
      return {
        src: webUrl,
      };
    });
    this.setState({
      visible: true,
      imgUrl: newFiles,
      currentImage: 0,
    });
  };

  // 关闭查看附件弹窗
  handleModalClose = () => {
    this.setState({
      visible: false,
    });
  };

  // 附件图片的点击翻入上一页
  gotoPrevious = () => {
    let { currentImage } = this.state;
    if (currentImage <= 0) return;
    this.setState({ currentImage: --currentImage });
  };

  // 附件图片的点击翻入下一页
  gotoNext = () => {
    let { currentImage, imgUrl } = this.state;
    if (currentImage >= imgUrl.length - 1) return;
    this.setState({ currentImage: ++currentImage });
  };

  // 附件图片点击下方缩略图
  handleClickThumbnail = i => {
    const { currentImage } = this.state;
    if (currentImage === i) return;
    this.setState({ currentImage: i });
  };

  /* 查询按钮点击事件 */
  handleClickToQuery = () => {
    const {
      dispatch,
      form: { getFieldsValue },
      buildingsInfo: {
        floorData: {
          pagination: { pageSize },
        },
      },
      match: {
        params: { id },
      },
    } = this.props;
    const data = getFieldsValue();
    // 修改表单数据
    this.formData = data;
    // 重新请求数据
    dispatch({
      type: 'buildingsInfo/fetchFloorList',
      payload: {
        building_id: id,
        pageSize,
        pageNum: 1,
        ...data,
      },
    });
  };

  /* 重置按钮点击事件 */
  handleClickToReset = () => {
    const {
      dispatch,
      form: { resetFields },
      buildingsInfo: {
        floorData: {
          pagination: { pageSize },
        },
      },
      match: {
        params: { id },
      },
    } = this.props;
    // 清除筛选条件
    resetFields();
    this.formData = defaultFormData;
    dispatch({
      type: 'buildingsInfo/fetchFloorList',
      payload: {
        building_id: id,
        pageSize,
        pageNum: 1,
      },
    });
  };

  /* 删除 */
  handleDelete = id => {
    // const {
    //   dispatch,
    //   buildingsInfo: {
    //     floorData: {
    //       pagination: { pageSize },
    //     },
    //   },
    // } = this.props;
    // dispatch({
    //   type: 'buildingsInfo/removeFloor',
    //   payload: { id },
    //   callback: response => {
    //     if (response && response.code === 200) {
    //       dispatch({
    //         type: 'buildingsInfo/fetchFloorList',
    //         payload: {
    //           pageSize,
    //           pageNum: 1,
    //         },
    //       });
    //       message.success('删除成功！');
    //     } else message.warning('删除失败！');
    //   },
    // });
  };

  // 处理翻页
  handlePageChange = (pageNum, pageSize) => {
    const {
      dispatch,
      form: { getFieldsValue },
    } = this.props;
    const data = getFieldsValue();
    dispatch({
      type: 'buildingsInfo/fetchFloorList',
      payload: {
        pageSize,
        pageNum,
        ...data,
      },
    });
  };

  /* 渲染form表单 */
  renderForm() {
    const {
      form: { getFieldDecorator },
      location: {
        query: { name, companyId },
      },
      match: {
        params: { id },
      },
    } = this.props;
    return (
      <Card>
        <Form layout="inline">
          <Col>
            <FormItem>
              {getFieldDecorator('floorName', {
                initialValue: defaultFormData.floorName,
                getValueFromEvent: e => e.target.value.trim(),
              })(<Input placeholder="请输入楼层名称" />)}
            </FormItem>
            <FormItem>
              {getFieldDecorator('floorNumber', {})(
                <InputNumber style={{ width: '100%' }} placeholder="请选择楼层编号" />
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
              <AuthButton
                type="primary"
                code={codesMap.personnelPosition.buildingsInfo.add}
                href={`#/personnel-position/buildings-info/floor/add?id=${id}&&name=${name}&&companyId=${companyId}`}
              >
                新增
              </AuthButton>
            </FormItem>
          </Col>
        </Form>
      </Card>
    );
  }

  /* 渲染table */
  renderTable() {
    const {
      tableLoading,
      buildingsInfo: {
        floorData: {
          list,
          pagination: { total, pageSize, pageNum },
        },
      },
    } = this.props;
    const { visible, imgUrl, currentImage } = this.state;
    /* 配置描述 */
    const COLUMNS = [
      {
        title: '楼层名称',
        dataIndex: 'floorName',
        key: 'floorName',
        align: 'center',
        width: '35%',
      },
      {
        title: '楼层编号',
        dataIndex: 'floorNumber',
        key: 'floorNumber',
        align: 'center',
        width: '15%',
      },
      {
        title: '平面图',
        dataIndex: 'floorUrl',
        key: 'floorUrl',
        align: 'center',
        width: '30%',
        render: (val, record) => {
          const { floorWebUrl } = record;
          return (
            <Fragment>
              {floorWebUrl && floorWebUrl.length ? (
                <AuthA
                  code={codesMap.personnelPosition.buildingsInfo.view}
                  onClick={() => {
                    this.handleShowModal(floorWebUrl);
                  }}
                >
                  查看附件
                </AuthA>
              ) : (
                <span style={{ color: '#aaa' }}>查看附件</span>
              )}
            </Fragment>
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        align: 'center',
        render: (record, rows) => (
          <span>
            <AuthA
              code={codesMap.lawEnforcement.laws.detail}
              onClick={() => this.goFloorDetail(rows.id)}
            >
              查看
            </AuthA>
            <Divider type="vertical" />
            <AuthA
              code={codesMap.lawEnforcement.laws.edit}
              onClick={() => this.goFloorEdit(rows.id)}
            >
              编辑
            </AuthA>
            <Divider type="vertical" />
            <Popconfirm
              title="确认要删除该法律法规吗？"
              onConfirm={() => this.handleDelete(rows.id)}
            >
              <AuthA code={codesMap.lawEnforcement.laws.delete}>删除</AuthA>
            </Popconfirm>
          </span>
        ),
      },
    ];

    return (
      <Card style={{ marginTop: '20px' }}>
        {list && list.length ? (
          <Table
            loading={tableLoading}
            rowKey="id"
            columns={COLUMNS}
            dataSource={list}
            pagination={{
              current: pageNum,
              pageSize,
              total,
              showQuickJumper: true,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '15', '20'],
              onChange: this.handlePageChange,
              onShowSizeChange: (num, size) => {
                this.handlePageChange(1, size);
              },
            }}
            bordered
          />
        ) : (
          <div style={{ textAlign: 'center' }}>暂无数据</div>
        )}
        <Lightbox
          images={imgUrl}
          isOpen={visible}
          currentImage={currentImage}
          onClickPrev={this.gotoPrevious}
          onClickNext={this.gotoNext}
          onClose={this.handleModalClose}
          showThumbnails
          onClickThumbnail={this.handleClickThumbnail}
          imageCountSeparator="/"
        />
      </Card>
    );
  }

  render() {
    const {
      buildingsInfo: {
        floorData: { list },
      },
      location: {
        query: { name, companyId },
      },
    } = this.props;

    //面包屑
    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '建筑物信息列表',
        name: '建筑物信息列表',
        href: `/personnel-position/buildings-info/detail/${companyId}?name=${name}`,
      },
      {
        title: '楼层管理列表',
        name: '楼层管理列表',
      },
    ];

    return (
      <PageHeaderLayout
        title="楼层管理"
        breadcrumbList={breadcrumbList}
        content={
          <div>
            列表记录：
            {list.length}{' '}
          </div>
        }
      >
        {this.renderForm()}
        {this.renderTable()}
      </PageHeaderLayout>
    );
  }
}
