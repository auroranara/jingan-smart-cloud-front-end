import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card, Table, Upload, Modal, Icon, message, Form, Divider } from 'antd';

import { getToken } from 'utils/authority';
import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';
import { AuthA, AuthPopConfirm } from '@/utils/customAuth';
import codes from '@/utils/codes';
import {
  BREADCRUMBLIST,
  ROUTER,
  SEARCH_FIELDS as FIELDS,
  TABLE_COLUMNS as COLUMNS,
  DetailModal,
} from './utils';

// 权限
const {
  twoInformManagement: {
    safetyRiskList: { view: viewAuth, delete: deleteAuth, import: importAuth, export: exportAuth },
  },
} = codes;

const url =
  'http://data.jingan-china.cn/v2/chem/file1/%E5%AE%89%E5%85%A8%E9%A3%8E%E9%99%A9%E5%88%86%E7%BA%A7%E7%AE%A1%E6%8E%A7%E6%B8%85%E5%8D%95.xls';

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
      modalVisible: false, // 导入弹框是否可见
      fileList: [], // 导入的数据列表
      importLoading: false, // 导入状态
      detailVisible: false, // 清单弹框是否可见
      currentPage: 1,
      detailId: '', // 查看清单ID
    };
    this.pageNum = 1;
    this.pageSize = 10;
  }

  componentDidMount() {
    this.fetchList();
  }

  // 获取风险分区列表
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

  // 获取清单列表
  fetchSafetyList = (pageNum = 1, pageSize = 10, params = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'twoInformManagement/fetchSafetyList',
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

  // 删除
  handleDeleteClick = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'twoInformManagement/fetchSafetyDel',
      payload: { areaId: id },
      callback: res => {
        if (res && res.code === 200) {
          this.fetchList();
          message.success(res.data);
        } else message.success(res.msg);
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
  handleImportShow = (id, companyId) => {
    this.setState({ modalVisible: true, areaId: id, companyId });
  };

  handleImportChange = info => {
    const fileList = info.fileList.slice(-1);
    this.setState({ fileList });
    if (info.file.status === 'uploading') {
      this.setState({ importLoading: true });
    }
    if (info.file.status === 'removed') {
      message.success('删除成功');
      return;
    }
    if (info.file.response) {
      if (info.file.response.code && info.file.response.code === 200) {
        if (info.file.response.data.faultNum === 0) {
          message.success('导入成功');
        } else if (info.file.response.data.faultNum > 0) {
          message.error('导入失败！' + info.file.response.data.message);
        }
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

  handleImportClose = () => {
    this.setState({ modalVisible: false, fileList: [] });
  };

  // 导出
  handleExportShow = (id, companyId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'twoInformManagement/fetchSafetyExport',
      payload: { areaId: id },
    });
  };

  // 显示清单弹框
  handleDetailModal = id => {
    this.setState({ detailVisible: true, detailId: id });
    this.fetchSafetyList(1, this.pageSize, { areaId: id });
  };

  handleTableData = (list = [], indexBase) => {
    return list.map((item, index) => {
      return {
        ...item,
        index: indexBase + index + 1,
      };
    });
  };

  handleDetailPageChange = (pageNum, pageSize) => {
    const { detailId } = this.state;
    this.pageNum = pageNum;
    this.pageSize = pageSize;
    this.fetchSafetyList(pageNum, pageSize, { areaId: detailId });
  };

  handleDetailClose = () => {
    this.setState({ detailVisible: false });
  };

  render() {
    const {
      loading = false,
      twoInformManagement: {
        safetyData: { list = [], pagination },
      },
      fourColorImage: {
        data: {
          a: numberUnit,
          list: riskList = [],
          pagination: { pageNum, pageSize, total },
        },
      },
      user: {
        currentUser: { unitType },
      },
    } = this.props;

    const {
      fileList,
      modalVisible,
      currentPage,
      areaId,
      companyId,
      detailVisible,
      importLoading,
    } = this.state;

    const uploadExportButton = <Icon type={importLoading ? 'loading' : 'upload'} />;

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };

    const extraColumns = [
      {
        title: '附件',
        dataIndex: 'file',
        key: 'file',
        align: 'center',
        render: (val, text) => {
          return (
            <AuthA code={viewAuth} onClick={() => this.handleDetailModal(text.id)}>
              查看清单
            </AuthA>
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        align: 'center',
        render: (val, text) => {
          return (
            <Fragment>
              <AuthA
                code={importAuth}
                onClick={() => this.handleImportShow(text.id, text.companyId)}
              >
                导入数据
              </AuthA>
              <Divider type="vertical" />
              <AuthPopConfirm
                code={deleteAuth}
                title="确定删除当前该内容吗？"
                onConfirm={() => this.handleDeleteClick(text.id)}
                okText="确定"
                cancelText="取消"
              >
                删除
              </AuthPopConfirm>
              <Divider type="vertical" />
              <AuthA
                code={exportAuth}
                onClick={() => this.handleExportShow(text.id, text.companyId)}
              >
                导出数据
              </AuthA>
            </Fragment>
          );
        },
      },
    ];

    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title: '列表', name: '列表' });

    const toolBarAction = (
      <Button type="primary" style={{ marginTop: '8px' }}>
        <a href={url}>下载模板</a>
      </Button>
    );

    const modalData = {
      detailVisible,
      currentPage,
      list,
      pagination,
      modalTitle: '查看清单',
      handleDetailClose: this.handleDetailClose,
      handleTableData: this.handleTableData,
      handleDetailPageChange: this.handleDetailPageChange,
    };

    return (
      <PageHeaderLayout
        title={BREADCRUMBLIST[BREADCRUMBLIST.length - 1].title}
        breadcrumbList={breadcrumbList}
        content={
          <p className={styles1.total}>
            单位数量：
            {numberUnit}
          </p>
        }
      >
        <Card style={{ marginBottom: 15 }}>
          <ToolBar
            fields={unitType === 4 ? FIELDS.slice(1, FIELDS.length) : FIELDS}
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
                  ? [...COLUMNS.slice(1, COLUMNS.length), ...extraColumns]
                  : [...COLUMNS, ...extraColumns]
              }
              dataSource={riskList}
              onChange={this.onTableChange}
              // scroll={{ x: 'max-content' }}
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
          closable={false}
          footer={[
            <Button disabled={importLoading} onClick={this.handleImportClose}>
              返回
            </Button>,
          ]}
        >
          <Form>
            <Form.Item {...formItemLayout} label="导入数据">
              <Upload
                name="file"
                accept=".xls"
                headers={{ 'JA-Token': getToken() }}
                action={`/acloud_new/v2/ci/doubleBill/importSafetyControl/${areaId}/${companyId}`} // 上传地址
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
        <DetailModal {...modalData} />
      </PageHeaderLayout>
    );
  }
}
