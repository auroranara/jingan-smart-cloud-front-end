import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import ToolBar from '@/components/ToolBar';
import {
  Card,
  Button,
  BackTop,
  Select,
  message,
  Table,
  Divider,
  Input,
  Modal,
  Upload,
  Empty,
  // Icon,
} from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import codes from '@/utils/codes';
import { getToken } from '@/utils/authority';
import { AuthButton, AuthA, AuthPopConfirm } from '@/utils/customAuth';
import router from 'umi/router';
import { stringify } from 'qs';
import { SEXES } from '@/pages/RoleAuthorization/AccountManagement/utils';
import ImagePreview from '@/jingan-components/ImagePreview';
import { hasAuthority } from '@/utils/customAuth';
import styles from './CompanyList.less';
const {
  realNameCertification: {
    personnelManagement: {
      add: addCode,
      edit: editCode,
      delete: deleteCode,
      view: viewCode,
      import: importCode,
      importPhoto: importPhotoCode,
      export: exportCode,
    },
  },
} = codes;

const title = '人员列表';
const defaultPageSize = 10;

const DEFAULT_SPAN = {
  md: 8,
  sm: 12,
  xs: 24,
};

// const getPersonType = {
//   2: '外协人员',
//   3: '临时人员',
//   4: '操作人员',
//   5: '管理人员',
//   6: '安全巡查人员',
// };

const exportList = [
  { id: '1', label: '导出选中' },
  { id: '2', label: '导出搜索结果' },
  { id: '3', label: '导出全部' },
];

const url = 'http://data.jingan-china.cn/v2/chem/file3/%E4%BA%BA%E5%91%98%E6%A8%A1%E6%9D%BF.xls';
@connect(({ realNameCertification, department, user, loading }) => ({
  realNameCertification,
  department,
  user,
  loading: loading.effects['realNameCertification/fetchPersonList'],
}))
@Form.create()
export default class PersonnelList extends PureComponent {
  state = {
    images: [],
    currentImage: 0,
    curCompanyName: '',
    personVisible: false,
    personLoading: false,
    imgVisible: false,
    imgLoading: false,
    imgFileList: [], // 导入的数据列表
    personFileList: [],
    selectedRowKeys: [],
    expand: false,
  };

  componentDidMount () {
    const {
      location: {
        query: { companyName: routerCompanyName },
      },
      user: {
        currentUser: { companyName },
      },
      match: {
        params: { companyId },
      },
      dispatch,
    } = this.props;
    this.fetchDepartment();
    dispatch({
      type: 'realNameCertification/fetchPersonList',
      payload: { pageNum: 1, pageSize: 10, companyId },
    });
    this.setState({ curCompanyName: companyName || routerCompanyName });
  }

  // 查询列表，获取人员列表
  handleQuery = () => {
    const {
      dispatch,
      match: {
        params: { companyId },
      },
    } = this.props;
    const values = this.form.getFieldsValue();
    dispatch({
      type: 'realNameCertification/fetchPersonList',
      payload: { ...values, pageNum: 1, pageSize: 10, companyId },
    });
    this.setState({ selectedRowKeys: [] });
  };

  fetchDepartment = () => {
    const {
      dispatch,
      location: {
        query: { companyId },
      },
    } = this.props;
    dispatch({
      type: 'department/fetchDepartmentList',
      payload: { companyId },
    });
  };

  // 重置查询
  handleReset = () => {
    this.form.resetFields();
    this.handleQuery();
  };

  // 分页变动
  handlePageChange = (pageNum, pageSize) => {
    const {
      dispatch,
      match: {
        params: { companyId },
      },
    } = this.props;
    const values = this.form.getFieldsValue();
    dispatch({
      type: 'realNameCertification/fetchPersonList',
      payload: {
        ...values,
        pageSize,
        pageNum,
        companyId,
      },
    });
  };

  // 删除人员
  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'realNameCertification/deletePerson',
      payload: { id },
      callback: success => {
        if (success) {
          message.success('删除人员成功');
          this.handleQuery();
        } else {
          message.error('删除人员失败');
        }
      },
    });
  };

  handleToEdit = id => {
    const {
      match: {
        params: { companyId },
      },
    } = this.props;
    const { curCompanyName } = this.state;
    // router.push(
    //   `/real-name-certification/personnel-management/edit/${id}?companyId=${companyId}&&companyName=${curCompanyName}`
    // );
    window.open(`${window.publicPath}#/real-name-certification/personnel-management/edit/${id}?companyId=${companyId}&&companyName=${curCompanyName}`);
  };

  handleToDetail = id => {
    const {
      match: {
        params: { companyId },
      },
    } = this.props;
    const { curCompanyName } = this.state;
    // router.push(
    //   `/real-name-certification/personnel-management/detail/${id}?companyId=${companyId}&&companyName=${curCompanyName}`
    // );
    window.open(`${window.publicPath}#/real-name-certification/personnel-management/detail/${id}?companyId=${companyId}&&companyName=${curCompanyName}`);
  };

  // 标签
  handleExpand = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  };

  setFormReference = toobar => {
    this.form = toobar && toobar.props && toobar.props.form;
  };

  hanldlePersonModal = () => {
    this.setState({ personVisible: true });
  };

  handlePersonClose = () => {
    this.setState({ personVisible: false, personFileList: [] });
  };

  handlePersonExChange = info => {
    const fileList = info.fileList.slice(-1);
    const res = info.file.response;
    this.setState({ personFileList: fileList });
    if (info.file.status === 'uploading') {
      this.setState({ personLoading: true });
    }
    if (info.file.status === 'removed') {
      message.success('删除成功');
      return;
    }
    if (info.file.status === undefined) {
      this.setState({ personLoading: false, personFileList: [] });
    }
    if (info.file.status === 'done' && res) {
      if (res.code && res.code === 200) {
        message.success(res.msg);
        this.handlePersonClose();
      } else {
        res.data.errorMasssge.length === 0
          ? message.error(res.msg)
          : Modal.error({
            title: '错误信息',
            content: res.data.errorMasssge,
            okText: '确定',
          });
      }
      this.handleQuery();
      this.setState({ personLoading: false });
    }
  };

  handlePersonBefore = file => {
    const { personLoading } = this.state;
    const isExcel = /xls|xlsx/.test(file.name);
    if (personLoading) {
      message.error('尚未上传结束');
    }
    if (!isExcel) {
      message.error('上传失败，请上传.xls或者.xlsx格式');
    }
    return !personLoading || isExcel;
  };

  hanldleImgModal = () => {
    this.setState({ imgVisible: true });
  };

  handleImgClose = () => {
    this.setState({ imgVisible: false, imgFileList: [] });
  };

  handleImgChange = info => {
    const fileList = info.fileList.slice(-1);
    const res = info.file.response;
    this.setState({ imgFileList: fileList });
    if (info.file.status === 'uploading') {
      this.setState({ imgLoading: true });
    }
    if (info.file.status === 'removed') {
      message.success('删除成功');
      return;
    }
    if (info.file.status === undefined) {
      this.setState({ imgLoading: false, imgFileList: [] });
    }
    if (res) {
      if (res.code && res.code === 200) {
        message.success(res.data);
        this.handleImgClose();
        this.handleQuery();
        this.setState({
          imgLoading: false,
        });
      } else {
        message.error(res.msg);
        this.setState({
          imgLoading: false,
        });
      }
    }
  };

  handleImgBefore = file => {
    const { imgLoading } = this.state;
    // const isZip = file.type === 'application/x-zip-compressed';
    if (imgLoading) {
      message.error('尚未上传结束');
    }
    // if (!isZip) {
    //   message.error('上传失败，请上传.zip格式');
    // }
    return !imgLoading;
  };

  // 跳转到批量导入记录页面
  hanldleImgRecord = () => {
    const {
      match: {
        params: { companyId },
      },
    } = this.props;
    const { curCompanyName } = this.state;
    router.push(
      `/real-name-certification/personnel-management/record/${companyId}?companyName=${curCompanyName}`
    );
  };

  // 列表选中id
  onSelectChange = val => {
    this.setState({ selectedRowKeys: val });
  };

  // 导出
  handleExportChange = i => {
    const {
      dispatch,
      match: {
        params: { companyId },
      },
    } = this.props;
    const { selectedRowKeys } = this.state;
    const values = this.form.getFieldsValue();
    if (+i === 1) {
      if (selectedRowKeys.length === 0) {
        return message.warning('请在列表中选择需要导出的人员列表');
      }
      dispatch({
        type: 'realNameCertification/fetchPersonExport',
        payload: { ids: selectedRowKeys.join(',') },
      });
    }
    if (+i === 2) {
      dispatch({
        type: 'realNameCertification/fetchPersonExport',
        payload: { ...values, status: 1, companyId },
      });
    }
    if (+i === 3) {
      dispatch({
        type: 'realNameCertification/fetchPersonExport',
        payload: { status: 1, companyId },
      });
    }
  };

  // 批量删除
  handleBatchDelete = () => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys && selectedRowKeys.length) {
      const { dispatch } = this.props;
      dispatch({
        type: 'realNameCertification/deletePerson',
        payload: { id: selectedRowKeys.join(',') },
        callback: success => {
          if (success) {
            message.success('删除人员成功');
            this.handleQuery();
          } else {
            message.error('删除人员失败');
          }
        },
      });
    } else {
      message.warning('请选择人员');
    }
  }

  // 渲染筛选栏
  renderFilter = () => {
    const {
      realNameCertification: { personTypeDict },
      department: {
        data: { list: departmentList = [] },
      },
    } = this.props;
    const { expand } = this.state;

    const fields = [
      {
        id: 'name',
        label: '姓名',
        span: DEFAULT_SPAN,
        render: ({ handleSearch }) => (
          <Input placeholder="请输入" onPressEnter={handleSearch} maxLength={100} />
        ),
      },
      {
        id: 'workerNumber',
        label: '职工号',
        span: DEFAULT_SPAN,
        render: ({ handleSearch }) => (
          <Input placeholder="请输入" onPressEnter={handleSearch} maxLength={100} />
        ),
      },
      {
        id: 'telephone',
        label: '手机号',
        span: DEFAULT_SPAN,
        render: ({ handleSearch }) => (
          <Input placeholder="请输入" onPressEnter={handleSearch} maxLength={100} />
        ),
      },
      {
        id: 'personType',
        label: '人员类型',
        span: DEFAULT_SPAN,
        render: () => <SelectOrSpan placeholder="请选择" list={personTypeDict} allowClear />,
      },
      // {
      //   id: 'department',
      //   label: '部门',
      //   span: DEFAULT_SPAN,
      //   render: () => <SelectOrSpan placeholder="请选择" list={filterDepart} allowClear />,
      // },
      {
        id: 'icnumber',
        label: 'IC卡号',
        span: DEFAULT_SPAN,
        render: ({ handleSearch }) => (
          <Input placeholder="请输入" onPressEnter={handleSearch} maxLength={100} />
        ),
      },
      {
        id: 'entranceNumber',
        label: 'SN卡号',
        span: DEFAULT_SPAN,
        render: ({ handleSearch }) => (
          <Input placeholder="请输入" onPressEnter={handleSearch} maxLength={100} />
        ),
      },
    ];

    const filterField = expand ? fields : fields.slice(0, 3);

    return (
      <Card>
        <ToolBar
          fields={filterField}
          searchable={false}
          resetable={false}
          wrappedComponentRef={this.setFormReference}
        />
        <div style={{ textAlign: 'right' }}>
          <Button style={{ marginRight: '10px' }} type="primary" onClick={this.handleQuery}>
            查询
          </Button>
          <Button style={{ marginRight: '10px' }} onClick={this.handleReset}>
            重置
          </Button>
          <span className={styles.iconContainer} onClick={() => this.handleExpand()}>
            <a>{expand ? '收起' : '展开'}</a>
            <LegacyIcon className={expand ? styles.expandIcon : styles.icon} type="down" />
          </span>
        </div>
      </Card>
    );
  };

  // 渲染列表
  renderList = () => {
    const {
      loading,
      match: {
        params: { companyId },
      },
      realNameCertification: {
        person: {
          list = [],
          pagination: { pageNum = 1, pageSize = defaultPageSize, total = 0 },
        },
        personTypeDict,
      },
      user: {
        currentUser: { permissionCodes },
      },
    } = this.props;
    const { selectedRowKeys, curCompanyName } = this.state;
    const exportAuth = hasAuthority(exportCode, permissionCodes);
    const importAuth = hasAuthority(importCode, permissionCodes);

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const columns = [
      {
        title: '职工号',
        dataIndex: 'workerNumber',
        align: 'center',
        width: 120,
      },
      {
        title: '姓名',
        dataIndex: 'name',
        align: 'center',
        width: 120,
      },
      {
        title: '性别',
        dataIndex: 'sex',
        align: 'center',
        width: 80,
        render: val => {
          const target = SEXES.find(item => +item.key === +val);
          return target ? target.label : '';
        },
      },
      {
        title: '电话',
        dataIndex: 'telephone',
        align: 'center',
        width: 160,
      },
      {
        title: '人员类型',
        dataIndex: 'personType',
        align: 'center',
        width: 150,
        render: val => (
          <SelectOrSpan
            placeholder="请选择"
            value={val}
            list={personTypeDict}
            type={'span'}
            allowClear
          />
        ),
      },
      {
        title: (
          <span>
            IC卡号&nbsp;
            <span style={{ color: '#ccc' }}>（门禁）</span>
          </span>
        ),
        dataIndex: 'icnumber',
        align: 'center',
        width: 160,
      },
      {
        title: (
          <span>
            SN号&nbsp;
            <span style={{ color: '#ccc' }}>（定位）</span>
          </span>
        ),
        dataIndex: 'entranceNumber',
        align: 'center',
        width: 160,
      },
      {
        title: '照片',
        dataIndex: 'photoDetails',
        align: 'center',
        width: 250,
        render: val =>
          Array.isArray(val) ? (
            <div>
              {val !== null &&
                val.map((item, i) => (
                  <img
                    onClick={() => {
                      this.setState({ images: val.map(item => item.webUrl), currentImage: i });
                    }}
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'contain',
                      cursor: 'pointer',
                      margin: '5px',
                    }}
                    key={i}
                    src={item.webUrl}
                    alt="照片"
                  />
                ))}
            </div>
          ) : (
              ''
            ),
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        fixed: 'right',
        width: 180,
        render: (val, record) => (
          <Fragment>
            <AuthA code={viewCode} onClick={() => this.handleToDetail(record.id)}>
              查看
            </AuthA>
            <Divider type="vertical" />
            <AuthA code={editCode} onClick={() => this.handleToEdit(record.id)}>
              编辑
            </AuthA>
            <Divider type="vertical" />
            <AuthPopConfirm
              code={deleteCode}
              title="确认要删除该人员吗?删除人员后，将删除人员信息及人员所有授权信息。"
              onConfirm={() => this.handleDelete(record.id)}
            >
              删除
            </AuthPopConfirm>
          </Fragment>
        ),
      },
    ];

    return (
      <Card
        style={{ marginTop: '24px' }}
        title="人员列表"
        extra={
          <div>
            <AuthButton
              code={addCode}
              type="primary"
              style={{ marginRight: '10px' }}
              onClick={() => {
                router.push(
                  `/real-name-certification/personnel-management/add?${stringify({
                    companyId,
                  })}&&companyName=${curCompanyName}`
                );
              }}
            >
              新增
            </AuthButton>
            <AuthButton
              code={importCode}
              style={{ marginRight: '10px' }}
              onClick={this.hanldlePersonModal}
            >
              导入人员
            </AuthButton>
            <AuthButton
              code={importPhotoCode}
              style={{ marginRight: '10px' }}
              onClick={this.hanldleImgModal}
            >
              批量导入照片
            </AuthButton>
            <Select
              style={{ width: '130px', marginRight: '10px' }}
              disabled={!exportAuth}
              placeholder="导出"
              defaultValue="导出"
              onSelect={i => this.handleExportChange(i)}
            >
              {exportList.map(({ id, label }) => (
                <Select.Option value={id} key={id}>
                  {label}
                </Select.Option>
              ))}
            </Select>
            <AuthButton
              style={{ marginRight: '10px' }}
              type="primary"
              code={deleteCode}
              onClick={this.handleBatchDelete}
            >
              批量删除
            </AuthButton>
            {importAuth ? (
              <a onClick={this.hanldleImgRecord}>导入记录</a>
            ) : (
                <span style={{ cursor: 'not-allowed', color: 'rgba(0, 0, 0, 0.25)' }}>导入记录</span>
              )}
          </div>
        }
      >
        {list && list.length ? (
          <Table
            rowKey="id"
            loading={loading}
            columns={columns}
            dataSource={list}
            bordered
            scroll={{ x: 'max-content' }}
            rowSelection={rowSelection}
            pagination={{
              current: pageNum,
              pageSize,
              total,
              showQuickJumper: true,
              showSizeChanger: true,
              showTotal: t => `共 ${t} 条记录`,
              // pageSizeOptions: ['5', '10', '15', '20'],
              onChange: this.handlePageChange,
              onShowSizeChange: (num, size) => {
                this.handlePageChange(1, size);
              },
            }}
          />
        ) : (
            <Empty />
          )}
      </Card>
    );
  };

  render () {
    const {
      user: { isCompany },
      match: {
        params: { companyId },
      },
    } = this.props;

    const {
      images,
      currentImage,
      personVisible,
      personLoading,
      imgLoading,
      imgFileList,
      imgVisible,
      personFileList,
    } = this.state;

    const uploadExportButton = <LegacyIcon type={personLoading ? 'loading' : 'upload'} />;

    const uploadPicButton = <LegacyIcon type={imgLoading ? 'loading' : 'upload'} />;
    //面包屑
    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '实名制认证系统',
        name: '实名制认证系统',
      },
      ...(isCompany
        ? []
        : [
          {
            title: '人员管理',
            name: '人员管理',
            href: '/real-name-certification/personnel-management/company-list',
          },
        ]),
      {
        title,
        name: title,
      },
    ];
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        <BackTop />
        {this.renderFilter()}
        {this.renderList()}
        <ImagePreview images={images} currentImage={currentImage} />
        <Modal
          title="批量导入"
          visible={personVisible}
          closable={false}
          footer={[
            <Button disabled={personLoading} onClick={this.handlePersonClose}>
              返回
            </Button>,
          ]}
        >
          <Form>
            <Form.Item>
              <Upload
                name="file"
                accept=".xls,.xlsx"
                headers={{ 'JA-Token': getToken() }}
                action={`/acloud_new/v2/ci/HGFace/importPerson/${companyId}`} // 上传地址
                fileList={personFileList}
                onChange={this.handlePersonExChange}
                beforeUpload={this.handlePersonBefore}
              >
                <Button disabled={personLoading}>
                  {uploadExportButton}
                  上传文件(.xls/.xlsx)
                </Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Button>
                <a href={url}>下载模板</a>
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="批量导入照片"
          visible={imgVisible}
          closable={false}
          footer={[
            <Button disabled={imgLoading} onClick={this.handleImgClose}>
              返回
            </Button>,
          ]}
        >
          <Form>
            <Form.Item>
              <Upload
                name="file"
                accept="application/x-zip-compressed"
                headers={{ 'JA-Token': getToken() }}
                action={`/acloud_new/v2/ci/HGFace/importPersonPhoto/${companyId}`} // 上传地址
                fileList={imgFileList}
                onChange={this.handleImgChange}
                beforeUpload={this.handleImgBefore}
              >
                <Button disabled={imgLoading}>
                  {uploadPicButton}
                  选择文件(.zip)
                </Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              <div>注意：</div>
              <div>1、仅支持上传.zip文件</div>
              <div>2、压缩包内图片名称命名方式：</div>
              <div>命名方式（1）：职工号_姓名 </div>
              <div>命名方式（2）：如果一人多张图片，则：职工号_姓名_1</div>
            </Form.Item>
          </Form>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
