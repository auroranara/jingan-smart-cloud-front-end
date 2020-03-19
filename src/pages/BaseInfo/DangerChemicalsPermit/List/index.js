import { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Button, Table, Input, Select, Divider, Row, Col, message, Popconfirm } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import urls from '@/utils/urls';
import moment from 'moment';
import Lightbox from 'react-images';
import titles from '@/utils/titles';
import router from 'umi/router';
import { hasAuthority } from '@/utils/customAuth';
import codes from '@/utils/codes';

const FormItem = Form.Item;

const title = '危化品企业安全许可证';

const {
  home: homeUrl,
  baseInfo: {
    dangerChemicalsPermit: { add: addUrl },
  },
} = urls;

const {
  home: homeTitle,
  dangerChemicalsPermit: { menu: menuTitle },
} = titles;

const breadcrumbList = [
  {
    title: homeTitle,
    name: homeTitle,
    href: homeUrl,
  },
  {
    title: menuTitle,
    name: menuTitle,
  },
  {
    title,
    name: title,
  },
];
const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 };
const formItemStyle = { style: { margin: '0', padding: '4px 0' } };

// 权限
const {
  baseInfo: {
    dangerChemicalsPermit: { add: addAuth, edit: editAuth, delete: deleteAuth },
  },
} = codes;

/* session前缀 */
const sessionPrefix = 'danger_chemical_list';

const issuingList = {
  1: '生产',
  2: '经营',
  3: '使用',
};

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

@Form.create()
@connect(({ reservoirRegion, user, loading }) => ({
  reservoirRegion,
  user,
  loading: loading.models.reservoirRegion,
}))
export default class DangerChemicalList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      imgUrl: [], // 附件图片列表
      currentImage: 0, // 展示附件大图下标
    };
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
  // 挂载后
  componentDidMount() {
    const {
      user: {
        currentUser: { id },
      },
      form: { setFieldsValue },
    } = this.props;
    // 从sessionStorage中获取存储的控件值
    const session = JSON.parse(sessionStorage.getItem(`${sessionPrefix}${id}`));
    const payload = JSON.parse(sessionStorage.getItem(`${sessionPrefix}${id}`)) || {
      pageNum: 1,
      pageSize: 10,
    };
    if (session) {
      setFieldsValue({
        ...payload,
      });
    }

    this.fetchList({ ...payload });
  }

  // 获取列表
  fetchList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reservoirRegion/fetchCertificateList',
      payload: {
        ...params,
        pageNum: 1,
        pageSize: 10,
      },
    });
  };

  // 查询
  handleSearch = () => {
    const {
      user: {
        currentUser: { id },
      },
      form: { getFieldsValue },
    } = this.props;
    const { ...rest } = getFieldsValue();
    const payload = {
      ...rest,
    };
    this.fetchList(payload);
    sessionStorage.setItem(`${sessionPrefix}${id}`, JSON.stringify(payload));
  };

  // 重置
  handleReset = () => {
    const {
      form: { setFieldsValue },
    } = this.props;
    sessionStorage.clear();
    this.fetchList();
    setFieldsValue({
      issuingType: undefined,
      certificateNumber: undefined,
      paststatus: undefined,
      certificateState: undefined,
      companyName: undefined,
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
      type: 'reservoirRegion/fetchCertificateList',
      payload: {
        ...payload,
        pageSize,
        pageNum,
      },
    });
  };

  handleToAdd = () => {
    router.push(addUrl);
  };

  // 删除
  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reservoirRegion/fetchCertificateDelete',
      payload: { id: id },
      success: () => {
        this.fetchList();
        message.success('删除成功！');
      },
      error: () => {
        message.error('删除失败!');
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

  /**
   * 渲染筛选栏
   */
  renderFilter = () => {
    const {
      form: { getFieldDecorator },
      reservoirRegion: { issuingTypeList, certificateStateList, expirationStatusList },
      user: {
        currentUser: { permissionCodes, unitType },
      },
    } = this.props;

    const addCode = hasAuthority(addAuth, permissionCodes);

    return (
      <Card>
        <Form>
          <Row gutter={16}>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('issuingType')(
                  <Select placeholder="证书种类">
                    {issuingTypeList.map(({ key, value }) => (
                      <Select.Option key={key} value={key}>
                        {value}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('certificateNumber')(<Input placeholder="证书编号" />)}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('paststatus')(
                  <Select placeholder="到期状态">
                    {expirationStatusList.map(({ key, value }) => (
                      <Select.Option key={key} value={key}>
                        {value}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('certificateState')(
                  <Select placeholder="证书状态">
                    {certificateStateList.map(({ key, value }) => (
                      <Select.Option key={key} value={key}>
                        {value}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            {unitType !== 4 && (
              <Col {...colWrapper}>
                <FormItem {...formItemStyle}>
                  {getFieldDecorator('companyName')(<Input placeholder="单位名称" />)}
                </FormItem>
              </Col>
            )}

            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                <Button style={{ marginRight: '10px' }} type="primary" onClick={this.handleSearch}>
                  查询
                </Button>
                <Button style={{ marginRight: '10px' }} onClick={this.handleReset}>
                  重置
                </Button>
                <Button type="primary" onClick={this.handleToAdd} disabled={!addCode}>
                  新增
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  };

  /**
   * 渲染表格
   */
  renderTable = () => {
    const {
      loading,
      reservoirRegion: {
        cerData: {
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
        width: 300,
      },
      {
        title: '基本信息',
        dataIndex: 'name',
        align: 'center',
        width: 300,
        render: (val, text) => {
          const { issuingType, issuingOrgan, issuingDate, certificateNumber } = text;
          return (
            <div>
              <p>
                种类:
                {issuingList[issuingType]}
              </p>
              <p>
                发证机关:
                {issuingOrgan}
              </p>
              <p>
                发证日期:
                {moment(issuingDate).format('YYYY-MM-DD')}
              </p>
              <p>
                证书编号:
                {certificateNumber}
              </p>
            </div>
          );
        },
      },
      {
        title: '证件状态',
        dataIndex: 'certificateState',
        align: 'center',
        width: 100,
        render: val => {
          return <span>{certificateState[val]}</span>;
        },
      },
      {
        title: '有效期至',
        dataIndex: 'endDate',
        align: 'center',
        width: 120,
        render: (val, record) => {
          const { endDate, paststatus } = record;
          return (
            <div>
              <span>{moment(endDate).format('YYYY-MM-DD')}</span>
              {/* <span style={{ color: this.getColorVal(paststatus), paddingLeft: 10 }}>
                {paststatusVal[paststatus]}
              </span> */}
            </div>
          );
        },
      },
      {
        title: '有效期状态',
        dataIndex: 'paststatus',
        width: 120,
        align: 'center',
        render: pastStatus => (
          <span style={{ color: this.getColorVal(pastStatus) }}>
            {paststatusVal[pastStatus]}
          </span>
        ),
      },
      {
        title: '附件',
        dataIndex: 'dannex',
        align: 'center',
        width: 300,
        render: (val, record) => {
          const { certificateFileList } = record;
          return (
            <Fragment>
              {certificateFileList && certificateFileList.length ? (
                <a
                  onClick={() => {
                    this.handleShowModal(certificateFileList);
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
        render: (val, record) => (
          <Fragment>
            {editCode ? (
              <Link to={`/unit-license/danger-chemicals-permit/edit/${record.id}`}>编辑</Link>
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
          columns={unitType === 4 ? columns.slice(1, columns.length) : columns}
          dataSource={list}
          bordered
          scroll={{ x: 'max-content' }}
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
        cerData: {
          a,
          pagination: { total = 0 },
        },
      },
    } = this.props;
    const { visible, imgUrl, currentImage } = this.state;
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            <span>
              单位数量：
              {a}
            </span>
            <span style={{ paddingLeft: 20 }}>
              许可证数量：
              {total}
            </span>
          </div>
        }
      >
        {this.renderFilter()}
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
