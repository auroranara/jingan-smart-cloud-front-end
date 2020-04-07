import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card, Upload, Empty, Modal, Table, message } from 'antd';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { getToken } from 'utils/authority';

import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';
import { BREADCRUMBLIST, ROUTER, getSearchFields, getTableColumns } from '../Other/utils';
import { hasAuthority } from '@/utils/customAuth';
import codes from '@/utils/codes';

// 权限
const {
  personnelManagement: {
    tagCardManagement: { add: addCode, import: importCode, export: exportCode },
  },
} = codes;

const url =
  'http://data.jingan-china.cn/v2/chem/file2/%E6%A0%87%E7%AD%BE%E5%8D%A1%E6%A8%A1%E6%9D%BF.xls';

@connect(({ user, realNameCertification, loading }) => ({
  user,
  realNameCertification,
  loading: loading.models.realNameCertification,
}))
export default class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      modalVisible: false,
      importLoading: false,
      fileList: [], // 导入的数据列表
      selectedRowKeys: [],
    };
    this.pageNum = 1;
    this.pageSize = 10;
  }

  componentDidMount() {
    this.fetchList();
  }

  fetchList = (pageNum = 1, pageSize = 10, params = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'realNameCertification/fetchTagCardList',
      payload: {
        ...params,
        pageSize,
        pageNum,
      },
    });
  };

  handleSearch = values => {
    this.setState({ formData: { ...values } });
    this.fetchList(1, this.pageSize, { ...values });
  };

  handleReset = () => {
    this.setState({ formData: {} });
    this.fetchList(1, this.pageSize);
  };

  handleAdd = () => {
    router.push(`${ROUTER}/add`);
  };

  handlePageChange = (pageNum, pageSize) => {
    const { formData } = this.state;
    this.pageNum = pageNum;
    this.pageSize = pageSize;
    this.fetchList(pageNum, pageSize, { ...formData });
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'realNameCertification/fetchTagCardDel',
      payload: { id: id },
      callback: (success, msg) => {
        if (success) {
          message.success(`删除成功`);
          this.fetchList();
        } else {
          message.error(msg || `删除失败`);
        }
      },
    });
  };

  onSelectChange = value => {
    this.setState({ selectedRowKeys: value });
  };

  // 跳转到人员列表
  handlePesonListClick = id => {
    router.push(`${ROUTER}/person-list/${id}`);
  };

  handleImportShow = () => {
    this.setState({ modalVisible: true });
  };

  handleImportClose = () => {
    this.setState({ modalVisible: false, fileList: [] });
  };

  handleImportChange = info => {
    const fileList = info.fileList.slice(-1);
    const res = info.file.response;
    this.setState({ fileList });
    if (info.file.status === 'uploading') {
      this.setState({ importLoading: true });
    }
    if (info.file.status === 'removed') {
      message.success('删除成功');
      return;
    }
    if (info.file.status === undefined) {
      this.setState({ importLoading: false, fileList: [] });
    }
    if (res) {
      if (res.code && res.code === 200) {
        message.success(res.msg);
        this.handleImportClose();
        this.fetchList();
        this.setState({
          importLoading: false,
        });
      } else {
        res.data.errorMasssge.length === 0
          ? message.error(res.msg)
          : Modal.error({
              title: '错误信息',
              content: res.data.errorMasssge,
              okText: '确定',
            });
        this.setState({
          importLoading: false,
        });
      }
    }
  };

  handleExportShow = () => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length === 0) {
      return message.warning('请在列表中选择需要导出的标签卡');
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'realNameCertification/fetchTagExport',
      payload: { ids: selectedRowKeys.join(',') },
    });
  };

  handleBeforeUpload = file => {
    const { importLoading } = this.state;
    const isExcel =
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel';
    if (importLoading) {
      message.error('尚未上传结束');
    }
    if (!isExcel) {
      message.error('上传失败，请上传.xls或者.xlsx格式');
    }
    return isExcel && !importLoading;
  };

  render() {
    const {
      loading,
      user: {
        currentUser: { permissionCodes, unitType },
      },
      realNameCertification: {
        tagCardData: {
          list = [],
          pagination: { total, pageNum, pageSize },
        },
      },
    } = this.props;

    const { modalVisible, importLoading, fileList, selectedRowKeys } = this.state;

    const addAuth = hasAuthority(addCode, permissionCodes);
    const importAuth = hasAuthority(importCode, permissionCodes);
    const exportAuth = hasAuthority(exportCode, permissionCodes);

    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title: '列表', name: '列表' });

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const toolBarAction = (
      <Button
        disabled={!addAuth}
        type="primary"
        onClick={this.handleAdd}
        style={{ marginTop: '8px' }}
      >
        新增
      </Button>
    );

    const fields = getSearchFields(unitType);
    const columns = getTableColumns(this.handleDelete, unitType, this.handlePesonListClick);

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };

    const uploadExportButton = <LegacyIcon type={importLoading ? 'loading' : 'upload'} />;

    return (
      <PageHeaderLayout
        title={BREADCRUMBLIST[BREADCRUMBLIST.length - 1].title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            <span>标签总数 ：{total}</span>
            <Button
              onClick={this.handleExportShow}
              type="primary"
              style={{ float: 'right', marginRight: '10px' }}
              disabled={!exportAuth}
            >
              批量导出
            </Button>
            <Button
              type="primary"
              style={{ float: 'right', marginRight: '10px' }}
              onClick={this.handleImportShow}
              disabled={!importAuth}
            >
              批量导入
            </Button>
            <Button type="primary" style={{ float: 'right', marginRight: '10px' }}>
              <a href={url}>模板下载</a>
            </Button>
          </div>
        }
      >
        <Card style={{ marginBottom: 15 }}>
          <ToolBar
            fields={fields}
            action={toolBarAction}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
          />
        </Card>
        <div className={styles1.container}>
          {list.length ? (
            <Table
              rowKey="id"
              bordered
              loading={loading}
              columns={columns}
              dataSource={list}
              onChange={this.onTableChange}
              scroll={{ x: 'max-content' }}
              rowSelection={rowSelection}
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
            <Empty />
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
                accept=".xls,.xlsx"
                headers={{ 'JA-Token': getToken() }}
                action={`/acloud_new/v2/HGFace/importLabel`} // 上传地址
                fileList={fileList}
                onChange={this.handleImportChange}
                beforeUpload={this.handleBeforeUpload}
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
