import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Input, Popconfirm, Table, Divider, Cascader } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import Lightbox from 'react-images';
import ToolBar from '@/components/ToolBar';
import { hasAuthority } from '@/utils/customAuth';
import codes from '@/utils/codes';

// 标题
const title = '典型事故案例';

// 权限
const {
  safetyKnowledgeBase: {
    typicalAccidentCase: { add: addAuth, edit: editAuth, delete: deleteAuth },
  },
} = codes;

//面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '安全生产知识库',
    name: '安全生产知识库',
  },
  {
    title,
    name: '典型事故案例',
  },
];

const spanStyle = { md: 8, sm: 12, xs: 24 };

/* root下的div */
const getRootChild = () => document.querySelector('#root>div');

/* session前缀 */
// const sessionPrefix = 'typical_accident_list';

@connect(({ typicalAccidentCase, user, company, loading }) => ({
  typicalAccidentCase,
  user,
  company,
  loading: loading.models.typicalAccidentCase,
}))
@Form.create()
export default class CaseList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      imgUrl: [], // 附件图片列表
      currentImage: 0, // 展示附件大图下标
    };
  }

  // 挂载后
  componentDidMount() {
    const { dispatch } = this.props;
    // 获取行政区域
    dispatch({
      type: 'company/fetchIndustryType',
    });
  }

  // 查询
  handleSearch = () => {};

  // 重置
  handleReset = () => {};

  handlePageChange = () => {};

  // 查看附件
  handleShowModal = files => {
    const newFiles = files.map(({ webUrl }) => {
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

  // 渲染表格
  renderTable = () => {
    const {
      loading,
      typicalAccidentCase: {
        data: {
          list = [],
          pagination: { pageNum, pageSize, total },
        },
      },
      user: {
        currentUser: { permissionCodes },
      },
    } = this.props;

    // 权限
    const editCode = hasAuthority(editAuth, permissionCodes);
    const deleteCode = hasAuthority(deleteAuth, permissionCodes);

    const columns = [
      {
        title: '案例名称',
        dataIndex: 'expName',
        align: 'center',
        width: 200,
      },
      {
        title: '行业类别',
        dataIndex: 'industyCategory',
        align: 'center',
        width: 300,
      },
      {
        title: '关键字',
        dataIndex: 'keyWords',
        align: 'center',
        width: 200,
      },
      {
        title: '事故概述',
        dataIndex: 'abstractDesc',
        align: 'center',
        width: 200,
      },
      {
        title: '附件',
        dataIndex: 'area',
        align: 'center',
        width: 200,
        render: (val, record) => {
          const { accidProcess, deriReason, inderiReason, otherFile } = record;
          return (
            <Fragment>
              {[
                { label: '事故经过', value: accidProcess },
                { label: '直接原因', value: deriReason },
                { label: '间接原因', value: inderiReason },
                { label: '其他附件', value: otherFile },
              ].map(({ label, value }) => {
                return value && value.length ? (
                  <p
                    onClick={() => {
                      this.handleShowModal(value);
                    }}
                  >
                    {label}:<a>查看附件</a>
                  </p>
                ) : (
                  <p>
                    {label}: <span style={{ color: '#aaa' }}>查看附件</span>
                  </p>
                );
              })}
            </Fragment>
          );
        },
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        width: 150,
        render: (val, row) => (
          <Fragment>
            {editCode ? (
              <Link to={`/base-info/major-hazard/edit/${row.id}`}>编辑</Link>
            ) : (
              <span style={{ cursor: 'not-allowed', color: 'rgba(0, 0, 0, 0.25)' }}>编辑</span>
            )}
            <Divider type="vertical" />
            {deleteCode ? (
              <Popconfirm title="确认要删除数据吗？" onConfirm={() => this.handleDelete(row.id)}>
                <a>删除</a>
              </Popconfirm>
            ) : (
              <span style={{ cursor: 'not-allowed', color: 'rgba(0, 0, 0, 0.25)' }}>删除</span>
            )}
          </Fragment>
        ),
      },
    ];
    return list && list.length ? (
      <Card style={{ marginTop: '24px' }}>
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={list}
          bordered
          scroll={{ x: 1300 }}
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
        />
      </Card>
    ) : (
      <div style={{ textAlign: 'center', padding: '70px' }}> 暂无数据</div>
    );
  };

  render() {
    const {
      company: { industryCategories },
      user: {
        currentUser: { permissionCodes },
      },
      typicalAccidentCase: {
        data: { list = [] },
      },
    } = this.props;

    const { visible, imgUrl, currentImage } = this.state;

    // 权限
    const addCode = hasAuthority(addAuth, permissionCodes);

    const fields = [
      {
        id: 'name',
        label: '案例名称',
        span: spanStyle,
        render: () => <Input placeholder="请输入案例名称" />,
        transform: v => v.trim(),
      },
      {
        id: 'code',
        label: '关键字',
        span: spanStyle,
        render: () => <Input placeholder="请输入关键字" />,
        transform: v => v.trim(),
      },
      {
        id: 'area',
        label: '行业类别',
        span: spanStyle,
        render: () => (
          <Cascader
            options={industryCategories}
            fieldNames={{
              value: 'type_id',
              label: 'gs_type_name',
              children: 'children',
            }}
            allowClear
            changeOnSelect
            notFoundContent
            placeholder="请选择行业类别"
            getPopupContainer={getRootChild}
          />
        ),
        transform: v => v.trim(),
      },
    ];

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            <span>
              共计：
              {list.length}
            </span>
          </div>
        }
      >
        <Card>
          <ToolBar
            fields={fields}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
            action={
              <Button
                type="primary"
                disabled={!addCode}
                href={`#/safety-knowledge-base/typical-accident-case/add`}
              >
                新增案例
              </Button>
            }
            wrappedComponentRef={this.setFormReference}
          />
        </Card>
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
        {this.renderTable()}
      </PageHeaderLayout>
    );
  }
}
