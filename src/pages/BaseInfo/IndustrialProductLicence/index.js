import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Button, Input, Select, Table, Divider, Popconfirm, message } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import ToolBar from '@/components/ToolBar';
import moment from 'moment';
import Lightbox from 'react-images';
import { hasAuthority } from '@/utils/customAuth';
import codes from '@/utils/codes';
const { Option } = Select;

// 标题
const title = '工业产品生产许可证';

//面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '单位证照管理',
    name: '单位证照管理',
  },
  {
    title,
    name: '工业产品生产许可证',
  },
];

// 权限
const {
  baseInfo: {
    industrialProductLicence: { add: addAuth, edit: editAuth, delete: deleteAuth },
  },
} = codes;

const certificateState = {
  1: '现用',
  2: '吊销',
  3: '注销',
  4: '暂扣',
  5: '曾用',
};

const paststatusVal = {
  0: '未到期',
  1: '即将到期',
  2: '已过期',
};

const spanStyle = { md: 8, sm: 12, xs: 24 };

/* session前缀 */
const sessionPrefix = 'industrial_licence_list_';

@connect(({ reservoirRegion, user, loading }) => ({
  reservoirRegion,
  user,
  loading: loading.models.reservoirRegion,
}))
export default class IndustriallicenceList extends PureComponent {
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

  getColorVal = status => {
    switch (+status) {
      case 0:
        return 'rgba(0, 0, 0, 0.65)';
      case 1:
        return 'rgb(250, 173, 20)';
      case 2:
        return '#f5222d';
      default:
        return;
    }
  };

  // 获取列表
  fetchList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reservoirRegion/fetchIndustrialList',
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
      type: 'reservoirRegion/fetchIndustrialDelete',
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
    const {
      dispatch,
      user: {
        currentUser: { id },
      },
    } = this.props;

    const payload = JSON.parse(sessionStorage.getItem(`${sessionPrefix}${id}`)) || {
      pageNum: 1,
      pageSize: 10,
    };
    dispatch({
      type: 'reservoirRegion/fetchIndustrialList',
      payload: {
        ...payload,
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
        industrialData: {
          list = [],
          pagination: { total = 0, pageNum = 1, pageSize = 10 },
        },
      },
      user: {
        currentUser: { permissionCodes, unitType },
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
        render: (val, text) => {
          const { licenceOffice, licenceDate, licenceCode } = text;
          return (
            <div>
              {/* <p>
                种类:
                {code}
              </p> */}
              <p>
                发证机关:
                {licenceOffice}
              </p>
              <p>
                发证日期:
                {moment(licenceDate).format('YYYY-MM-DD')}
              </p>
              <p>
                证书编号:
                {licenceCode}
              </p>
            </div>
          );
        },
      },
      {
        title: '证件状态',
        dataIndex: 'status',
        align: 'center',
        width: 200,
        render: val => {
          return <span>{certificateState[val]}</span>;
        },
      },
      {
        title: '有效期至',
        dataIndex: 'endDate',
        align: 'center',
        width: 200,
        render: (val, record) => {
          const { endDate, pastStatus } = record;
          return (
            <div>
              <span>{moment(endDate).format('YYYY-MM-DD')}</span>
              {/* <span style={{ color: this.getColorVal(pastStatus), paddingLeft: 10 }}>
                {paststatusVal[pastStatus]}
              </span> */}
            </div>
          );
        },
      },
      {
        title: '有效期状态',
        dataIndex: 'pastStatus',
        width: 120,
        align: 'center',
        render: pastStatus => (
          <span style={{ color: this.getColorVal(pastStatus) }}>
            {paststatusVal[pastStatus]}
          </span>
        ),
      },
      {
        title: '证照附件',
        dataIndex: 'location',
        align: 'center',
        width: 200,
        render: (val, record) => {
          const { accessoryDetails } = record;
          return (
            <Fragment>
              {accessoryDetails && accessoryDetails.length ? (
                <a
                  onClick={() => {
                    this.handleShowModal(accessoryDetails);
                  }}
                >
                  查看附件
                </a>
              ) : (
                <span style={{ color: '#aaa' }}>查看附件</span>
              )}
            </Fragment>
          );
        },
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        fixed: 'right',
        width: 120,
        render: (val, row) => (
          <Fragment>
            {editCode ? (
              <Link to={`/unit-license/industrial-product-licence/edit/${row.id}`}>编辑</Link>
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
          columns={unitType === 4 ? columns.slice(1, columns.length) : columns}
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
        industrialData: {
          pagination: { total },
        },
        msg,
        issuingTypeList,
        expirationStatusList,
        certificateStateList,
      },
      user: {
        currentUser: { permissionCodes, unitType },
      },
    } = this.props;
    const { visible, imgUrl, currentImage } = this.state;
    const addCode = hasAuthority(addAuth, permissionCodes);

    const fields = [
      // {
      //   id: 'name',
      //   label: '证书种类',
      //   span: spanStyle,
      //   render: () => (
      //     <Select allowClear placeholder="请选择证书种类">
      //       {issuingTypeList.map(({ key, value }) => (
      //         <Option key={key} value={value}>
      //           {value}
      //         </Option>
      //       ))}
      //     </Select>
      //   ),
      //   transform: v => v.trim(),
      // },
      {
        id: 'licenceCode',
        label: '证书编号',
        span: spanStyle,
        render: () => <Input placeholder="请输入证书编号" />,
        transform: v => v.trim(),
      },
      {
        id: 'pastStatus',
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
        id: 'status',
        label: '证件状态',
        span: spanStyle,
        render: () => (
          <Select allowClear placeholder="请选择证件状态">
            {certificateStateList.map(({ key, value }) => (
              <Option key={key} value={key}>
                {value}
              </Option>
            ))}
          </Select>
        ),
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
              {msg}
            </span>
            <span style={{ paddingLeft: 20 }}>
              许可证数量：
              {total}
            </span>
          </div>
        }
      >
        <Card>
          <ToolBar
            fields={unitType === 4 ? fields.slice(0, 3) : fields}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
            action={
              <Button
                type="primary"
                disabled={!addCode}
                href={`#/unit-license/industrial-product-licence/add`}
              >
                新增许可证
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
