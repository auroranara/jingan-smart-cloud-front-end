import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card, Table, Upload, Modal, Icon, message, Form, Popconfirm, Divider } from 'antd';
import Link from 'umi/link';

import { getToken } from 'utils/authority';
import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';
import { hasAuthority } from '@/utils/customAuth';
import codes from '@/utils/codes';
import {
  BREADCRUMBLIST,
  ROUTER,
  SEARCH_FIELDS as FIELDS,
  SEARCH_FIELDS_COMPANY as COMPANYFIELDS,
  TABLE_COLUMNS as COLUMNS,
  TABLE_COLUMNS_COMPANY as COMPANYCOLUMNS,
} from './utils';

// 权限
const {
  twoInformManagement: {
    safetyRiskList: { view: viewAuth, delete: deleteAuth, sync: syncAuth },
  },
} = codes;

// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';

@connect(({ twoInformManagement, fourColorImage, user, loading }) => ({
  twoInformManagement,
  fourColorImage,
  user,
  loading: loading.models.twoInformManagement,
}))
@Form.create()
export default class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      modalVisible: false, // 弹框是否可见
      fileList: [], // 导入的数据列表
      importLoading: false,
      submittingModal: false,
    };
    this.pageNum = 1;
    this.pageSize = 10;
  }

  componentDidMount() {
    this.fetchList();
  }

  // 获取列表
  fetchList = (pageNum = 1, pageSize = 10, params = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'fourColorImage/fetchList',
      payload: {
        ...params,
        pageSize,
        pageNum,
      },
    });
  };

  // 查询
  handleSearch = values => {
    this.setState({ formData: { ...values } });
    this.fetchList(1, this.pageSize, { ...values });
  };

  // 重置
  handleReset = () => {
    this.setState({ formData: {} });
    this.fetchList(1, this.pageSize);
  };

  // 重置
  handleDeleteClick = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'twoInformManagement/fetchSafetyDel',
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

  handleAdd = () => {
    router.push(`${ROUTER}/add`);
  };

  // 分页变动
  handlePageChange = (pageNum, pageSize) => {
    const { formData } = this.state;
    this.pageNum = pageNum;
    this.pageSize = pageSize;
    this.fetchList(pageNum, pageSize, { ...formData });
  };

  // 导入
  handleImportShow = id => {
    this.setState({ modalVisible: true, areaId: id });
  };

  handleImportChange = info => {
    const fileList = info.fileList.slice(-1);
    this.setState({ fileList });
    console.log('info', info);

    if (info.file.status === 'uploading') {
      this.setState({ importLoading: true });
    }
    if (info.file.response) {
      if (info.file.response.code && info.file.response.code === 200) {
        if (info.file.response.data) {
          this.setState({
            importLoading: false,
          });
        }
      } else {
        this.setState({
          importLoading: false,
        });
      }
    }
  };

  // handleImportSubmit = () => {
  //   const {
  //     dispatch,
  //     form: { validateFieldsAndScroll },
  //   } = this.props;
  //   const { fileList, areaId } = this.state;

  //   const status = fileList.map(item => item.status);
  //   const hasUploading = status.includes('uploading');
  //   if (hasUploading === true) {
  //     return message.warning('还在上传中，请等待！');
  //   }

  //   if (fileList.length === 0) {
  //     return message.error('请先上传！');
  //   }

  //   validateFieldsAndScroll((errors, values) => {
  //     if (!errors) {
  //       const success = () => {
  //         message.success('导入成功');
  //         this.setState({ modalVisible: false, fileList: [], submittingModal: false });
  //         this.fetchList(1, this.pageSize);
  //       };
  //       const error = () => {
  //         message.error('导入失败');
  //         this.setState({ modalVisible: true, submittingModal: false });
  //       };

  //       this.setState({ submittingModal: true });

  //       const payload = {
  //         areaId,
  //         // file: fileList.map(item => item.dbUrl).join(','),
  //       };

  //       // dispatch({
  //       //   type: 'twoInformManagement/fetchDataImport',
  //       //   payload,
  //       //   success,
  //       //   error,
  //       // });
  //     }
  //   });
  // };

  handleImportClose = () => {
    this.setState({ modalVisible: false });
  };

  render() {
    const {
      loading = false,
      twoInformManagement: {
        safetyData: {
          // list = [],
          pagination: { pageNum, pageSize, total },
        },
        msgSafety,
      },
      fourColorImage: {
        data: { list: riskList = [] },
      },
      user: {
        currentUser: { permissionCodes, unitType },
      },
    } = this.props;

    const { fileList, modalVisible, areaId, importLoading, submittingModal } = this.state;

    // 权限
    const viewCode = hasAuthority(viewAuth, permissionCodes);
    const deleteCode = hasAuthority(deleteAuth, permissionCodes);
    const syncCode = hasAuthority(syncAuth, permissionCodes);

    const uploadExportButton = <Icon type={importLoading ? 'loading' : 'upload'} />;

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };

    const extraColumns = [
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'right',
        align: 'center',
        render: (val, text) => {
          return (
            <Fragment>
              {viewCode ? (
                <a onClick={() => this.handleImportShow(text.id)}>导入数据</a>
              ) : (
                <span style={{ cursor: 'not-allowed', color: 'rgba(0, 0, 0, 0.25)' }}>查看</span>
              )}
              <Divider type="vertical" />
              {viewCode ? (
                <Link to={`${ROUTER}/safety-risk-list/view/${text.id}`}>查看</Link>
              ) : (
                <span style={{ cursor: 'not-allowed', color: 'rgba(0, 0, 0, 0.25)' }}>查看</span>
              )}
              <Divider type="vertical" />
              {deleteCode ? (
                <Popconfirm
                  title="确定删除当前该内容吗？"
                  onConfirm={() => this.handleDeleteClick(text.id)}
                  okText="确定"
                  cancelText="取消"
                >
                  <span className={styles1.delete}>删除</span>
                </Popconfirm>
              ) : (
                <span style={{ cursor: 'not-allowed', color: 'rgba(0, 0, 0, 0.25)' }}>删除</span>
              )}
            </Fragment>
          );
        },
      },
    ];

    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title: '列表', name: '列表' });
    const toolBarAction = (
      <Button
        type="primary"
        style={{ marginTop: '8px' }}
        disabled={!syncCode}
        onClick={this.handleClickSync}
      >
        下载模板
      </Button>
    );

    return (
      <PageHeaderLayout
        title={BREADCRUMBLIST[BREADCRUMBLIST.length - 1].title}
        breadcrumbList={breadcrumbList}
        content={
          <p className={styles1.total}>
            单位数量：
            {msgSafety}
          </p>
        }
      >
        <Card style={{ marginBottom: 15 }}>
          <ToolBar
            fields={unitType === 4 ? [...FIELDS] : [...COMPANYFIELDS, ...FIELDS]}
            action={toolBarAction}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
          />
        </Card>
        <div className={styles1.container}>
          {riskList.length > 0 ? (
            <Table
              bordered
              rowKey="id"
              loading={loading}
              columns={
                unitType === 4
                  ? [...COLUMNS, ...extraColumns]
                  : [...COMPANYCOLUMNS, ...COLUMNS, ...extraColumns]
              }
              dataSource={riskList}
              onChange={this.onTableChange}
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
          ) : (
            <Card bordered={false} style={{ textAlign: 'center' }}>
              <span>暂无数据</span>
            </Card>
          )}
        </div>
        <Modal
          title="导入"
          visible={modalVisible}
          onCancel={this.handleImportClose}
          onOk={this.handleImportSubmit}
          confirmLoading={importLoading || submittingModal}
        >
          <Form>
            <Form.Item {...formItemLayout} label="导入数据">
              <Upload
                name="file"
                accept=".xls"
                headers={{ 'JA-Token': getToken() }}
                action={`/acloud_new/v2/ci/doubleBill/importSafetyControl/${areaId}`} // 上传地址
                fileList={fileList}
                onChange={this.handleImportChange}
              >
                <Button disabled={importLoading}>
                  {uploadExportButton}
                  点击
                </Button>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
