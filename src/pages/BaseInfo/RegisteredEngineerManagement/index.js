import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Button, Input, Select, Table, Divider, Popconfirm, message } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import ToolBar from '@/components/ToolBar';
import moment from 'moment';
import { hasAuthority } from '@/utils/customAuth';
import Lightbox from 'react-images';
import codes from '@/utils/codes';
const { Option } = Select;

// 标题
const title = '注册安全工程师管理';

//面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '一企一档',
    name: '一企一档',
  },
  {
    title,
    name: '注册安全工程师管理',
  },
];

// 权限
const {
  baseInfo: {
    registeredEngineerManagement: { add: addAuth, edit: editAuth, delete: deleteAuth },
  },
} = codes;

const spanStyle = { md: 8, sm: 12, xs: 24 };

/* session前缀 */
const sessionPrefix = 'product_licence_list_';

const categoryList = {
  0: '煤矿安全',
  1: '金属非金属矿山安全',
  2: '化工安全',
  3: '金属冶炼安全',
  4: '建筑施工安全',
  5: '道路运输安全',
  6: '其他安全（不包括消防安全）',
};
@connect(({ reservoirRegion, user, loading }) => ({
  reservoirRegion,
  user,
  loading: loading.models.reservoirRegion,
}))
export default class RegSafetyEngList extends PureComponent {
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
    const {
      user: {
        currentUser: { id },
      },
    } = this.props;
    // 从sessionStorage中获取存储的控件值
    const sessionData = JSON.parse(sessionStorage.getItem(`${sessionPrefix}${id}`));
    const payload = JSON.parse(sessionStorage.getItem(`${sessionPrefix}${id}`)) || {
      pageNum: 1,
      pageSize: 10,
    };
    this.fetchList({ ...payload });
    if (sessionData) {
      this.form.setFieldsValue({ ...payload });
    }
  }

  // 获取列表
  fetchList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reservoirRegion/fetchSafetyEngList',
      payload: {
        ...params,
        pageNum: 1,
        pageSize: 10,
      },
    });
  };

  setFormReference = toobar => {
    this.form = toobar && toobar.props && toobar.props.form;
  };

  // 查询
  handleSearch = () => {
    const {
      user: {
        currentUser: { id },
      },
    } = this.props;
    const { ...rest } = this.form.getFieldsValue();
    const payload = { ...rest };
    this.fetchList(payload);
    sessionStorage.setItem(`${sessionPrefix}${id}`, JSON.stringify(payload));
  };

  // 重置
  handleReset = () => {
    this.fetchList();
    sessionStorage.clear();
  };

  // 删除
  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reservoirRegion/fetchSafetyEngDelete',
      payload: { ids: id },
      success: () => {
        this.fetchList();
        message.success('删除成功！');
      },
      error: () => {
        message.error('删除失败!');
      },
    });
  };

  // 分页变动
  handlePageChange = (pageNum, pageSize) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reservoirRegion/fetchSafetyEngList',
      payload: {
        pageSize,
        pageNum,
      },
    });
  };

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
      reservoirRegion: {
        safetyEngData: {
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
        title: '单位名称',
        dataIndex: 'companyName',
        align: 'center',
        width: 200,
      },
      {
        title: '基本信息',
        dataIndex: 'info',
        align: 'center',
        width: 300,
        render: (val, record) => {
          const { name, sex, birth, phone } = record;
          return (
            <div>
              <p>
                姓名:
                {name}
              </p>
              <p>
                性别:
                {+sex === 1 ? '男生' : '女生'}
              </p>
              <p>
                出生年月:
                {moment(birth).format('YYYY-MM-DD')}
              </p>
              <p>
                联系电话:
                {phone}
              </p>
            </div>
          );
        },
      },
      {
        title: '执业资格证',
        dataIndex: 'desc',
        align: 'center',
        width: 200,
        render: (val, record) => {
          const { level, category, requirementsCode } = record;
          return (
            <div>
              <p>
                工程师级别:
                {+level === 0 ? '初级' : +level === 1 ? '中级' : '高级'}
              </p>
              <p>
                专业类别:
                {categoryList[category]}
              </p>
              <p>
                执业资格证书编号:
                {requirementsCode}
              </p>
            </div>
          );
        },
      },
      {
        title: '注册证',
        dataIndex: 'unitChemiclaNumDetail',
        align: 'center',
        width: 200,
        render: (val, record) => {
          const { regDate, regCode, endDate } = record;
          return (
            <div>
              <p>即将到期</p>
              <p>
                注册日期:
                {moment(regDate).format('YYYY-MM-DD')}
              </p>
              <p>
                注册证书编号:
                {regCode}
              </p>
              <p>
                注册有效日期:
                {moment(endDate).format('YYYY-MM-DD')}
              </p>
            </div>
          );
        },
      },
      {
        title: '证照附件',
        dataIndex: 'location',
        align: 'center',
        width: 200,
        render: (val, record) => {
          const { requirementsFilesList, regFilesList } = record;
          return (
            <Fragment>
              {[
                {
                  label: '执业资格证书附件',
                  value: requirementsFilesList,
                },
                {
                  label: '注册证书附件',
                  value: regFilesList,
                },
              ].map(({ label, value, id }) => {
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
        render: (val, record) => (
          <Fragment>
            {editCode ? (
              <Link to={`/base-info/registered-engineer-management/edit/${record.id}`}>编辑</Link>
            ) : (
              <span style={{ cursor: 'not-allowed', color: 'rgba(0, 0, 0, 0.25)' }}>编辑</span>
            )}
            <Divider type="vertical" />
            {deleteCode ? (
              <Popconfirm title="确认要删除数据吗？" onConfirm={() => this.handleDelete(record.id)}>
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
      reservoirRegion: {
        safetyEngData: {
          pagination: { total },
        },
        expirationStatusList,
        engineerLevelList,
      },
      user: {
        currentUser: { permissionCodes },
      },
    } = this.props;

    const addCode = hasAuthority(addAuth, permissionCodes);
    const { visible, imgUrl, currentImage } = this.state;
    const fields = [
      {
        id: 'name',
        label: '姓名',
        span: spanStyle,
        render: () => <Input placeholder="请输入姓名" />,
        transform: v => v.trim(),
      },
      {
        id: 'requirementsCode',
        label: '执业资格证编号',
        span: spanStyle,
        render: () => <Input placeholder="请输入执业资格证编号" />,
        transform: v => v.trim(),
      },
      {
        id: 'area',
        label: '到期状态',
        span: spanStyle,
        render: () => (
          <Select allowClear placeholder="请选择到期状态">
            {expirationStatusList.map(({ key, value }) => (
              <Option key={key} value={key}>
                {value}
              </Option>
            ))}
          </Select>
        ),
        transform: v => v.trim(),
      },
      {
        id: 'level',
        label: '工程师级别',
        span: spanStyle,
        render: () => (
          <Select allowClear placeholder="请选择工程师级别">
            {engineerLevelList.map(({ key, value }) => (
              <Option key={key} value={key}>
                {value}
              </Option>
            ))}
          </Select>
        ),
      },
      {
        id: 'regCode',
        label: '注册证书编号',
        span: spanStyle,
        render: () => <Input placeholder="请输入注册证书编号" />,
        transform: v => v.trim(),
      },
      {
        id: 'companyName',
        label: '单位名称',
        span: spanStyle,
        render: () => <Input placeholder="请输入单位名称" />,
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
              单位数量：
              {total}
            </span>
            <span style={{ paddingLeft: 20 }}>
              安全工程师数量：
              <span>{total}</span>
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
                href={`#/base-info/registered-engineer-management/add`}
              >
                新增人员
              </Button>
            }
            wrappedComponentRef={this.setFormReference}
          />
        </Card>
        {this.renderTable()}
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
      </PageHeaderLayout>
    );
  }
}