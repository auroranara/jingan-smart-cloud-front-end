import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card, Form, Upload, Empty, Icon, Modal, Table, message } from 'antd';

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
    tagCardManagement: { add: addCode },
  },
} = codes;

const url =
  'http://data.jingan-china.cn/v2/chem/file1/%E6%A0%87%E7%AD%BE%E5%8D%A1%E6%A8%A1%E6%9D%BF.xls';

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

  // 跳转到人员列表
  handlePesonListClick = id => {
    router.push(`${ROUTER}/person-list/${id}`);
  };

  handleImportShow = () => {
    this.setState({ modalVisible: true });
  };

  handleImportClose = () => {
    this.setState({ modalVisible: false });
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

    const { modalVisible, importLoading, fileList } = this.state;
    const addAuth = hasAuthority(addCode, permissionCodes);

    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title: '列表', name: '列表' });
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

    const uploadExportButton = <Icon type={importLoading ? 'loading' : 'upload'} />;

    return (
      <PageHeaderLayout
        title={BREADCRUMBLIST[BREADCRUMBLIST.length - 1].title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            <span>标签总数 ：{list.length}</span>
            <Button type="primary" style={{ float: 'right', marginRight: '10px' }}>
              批量导出
            </Button>
            <Button
              type="primary"
              style={{ float: 'right', marginRight: '10px' }}
              onClick={this.handleImportShow}
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
                //ction={`/acloud_new/v2/ci/doubleBill/importSafetyControl/${areaId}/${companyId}`} // 上传地址
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
