import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Checkbox,
  Card,
  Form,
  Input,
  Icon,
  Select,
  Button,
  Modal,
  Upload,
  message,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './AppManagementList.less';
import { getToken } from 'utils/authority';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

const CreateForm = Form.create()((props) => {
  const { modalVisible, form, setDownloadUrl, setConfirmLoading, handleAdd, handleUpdate,
    handleModalVisible, confirmLoading, currentRecord, downloadUrl } = props;
  const operationUpdate = !!currentRecord;
  // console.log('current record', currentRecord);
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if (operationUpdate) {
        handleUpdate(fieldsValue);
      } else {
        handleAdd(fieldsValue);
      }
      setDownloadUrl(''); // 点击确定时，将url清空
    });
  };
  const cancelHandle = () => {
    handleModalVisible();
    setDownloadUrl('');
  };

  // console.log(getToken());
  const token = getToken();
  const uploadProps = {
    name: 'files',
    action: '/eye/api/uploadAPKFile',
    headers: {
      'Ja-Token': token,
    },
    onChange(info) {
      if (info.file.status === 'uploading') {
        setConfirmLoading(true);
      }
      if (info.file.status === 'done') {
        // console.log('done', info.file.response);
        setDownloadUrl(info.file.response.result);
        setConfirmLoading(false);
        message.success(`${info.file.name}文件上传成功`);
      } else if (info.file.status === 'error') {
        setConfirmLoading(false);
        message.error(`${info.file.name}文件上传失败`);
      }
    },
  };

  return (
    <Modal
      title={operationUpdate ? '修改手机软件信息' : '新增手机软件信息'}
      visible={modalVisible}
      confirmLoading={confirmLoading}
      onOk={okHandle}
      onCancel={cancelHandle}
      destroyOnClose
    >
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="版本名称">
        {form.getFieldDecorator('versionName', { initialValue: operationUpdate ? currentRecord.versionName : '' })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="版本编号">
        {form.getFieldDecorator('versionCode', { initialValue: operationUpdate ? currentRecord.versionCode : '' })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="版本说明">
        {form.getFieldDecorator('versionRemark', { initialValue: operationUpdate ? currentRecord.versionRemark : '' })(<TextArea placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="是否发布">
        {form.getFieldDecorator('isPublish', { valuePropName: 'checked', initialValue: operationUpdate ? currentRecord.isPublish === '1' : false })(<Checkbox>发布</Checkbox>)}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="是否强制更新">
        {form.getFieldDecorator('isForce', { valuePropName: 'checked', initialValue: operationUpdate ? currentRecord.isForce === '1' : false })(<Checkbox>强制更新</Checkbox>)}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="上传安装文件">
        {form.getFieldDecorator('upload')(<Upload {...uploadProps}><Button><Icon type="upload" />上传文件</Button></Upload>)}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="下载地址">
        {form.getFieldDecorator('downloadUrl', { initialValue: operationUpdate ? currentRecord.downloadUrl : downloadUrl })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ app, loading }) => ({
  app,
  loading: loading.models.app,
}))
@Form.create()
export default class AppManagement extends PureComponent {
  state = {
    modalVisible: false,
    currentRecord: null,
    selectedRows: [],
    downloadUrl: '',
    confirmLoading: false,
    mobileSystemType: '1', // 要设置成字符串，不能是数字1，因为设定select里面的value="1"，而不是value={1}
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'app/fetch',
      payload: {
        currentPage: 1,
        pageSize: 10,
        type: 1,
      },
      callback(status, msg) {
        if (status !== 200 || msg !== '成功') {
          message.error(`status=${status}, msg=${msg}`);
        }
      },
    });
  }

  setDownloadUrl = (downloadUrl) => {
    this.setState({ downloadUrl });
  };

  setConfirmLoading = (confirmLoading) => {
    this.setState({ confirmLoading });
  };

  handleStandardTableChange = (pagination) => {
    // console.log('table', pagination);
    this.props.dispatch({
      type: 'app/fetch',
      payload: {
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
        type: parseInt(this.state.mobileSystemType, 10),
      },
    });
  };

  handleSelectRows = (rows) => {
    // console.log(rows);
    this.setState({
      selectedRows: rows,
    });
  };

  handleModalVisible = (flag, currentRecord) => {
    this.setState({
      modalVisible: !!flag,
      currentRecord,
    });
  };

  handleAdd = (fields) => {
    // console.log(fields);
    const that = this;
    const { dispatch, app: { data: { pagination } } } = this.props;
    console.log(pagination);
    // console.log(this.state.mobileSystemType, typeof (this.state.mobileSystemType));
    dispatch({
      type: 'app/add',
      payload: {
        ...fields,
        upload: null,
        isPublish: fields.isPublish ? 1 : 0,
        isForce: fields.isForce ? 1 : 0,
        type: parseInt(this.state.mobileSystemType, 10),
      },
      pagination,
      callback(status, msg, paginationPayload) {
        // console.log('callback', status, msg);
        if (status === 200 && msg === '成功') {
          message.success('添加成功');
          that.setState({ modalVisible: false });
          dispatch({
            type: 'app/fetch',
            payload: paginationPayload,
          });
        } else if (status !== 200) {
          message.error(`服务器出问题了，status=${status}`);
        } else if (msg !== '成功') {
          message.error(`添加失败，msg=${msg}`);
        }
      },
    });
  };

  handleUpdate = (fields) => {
    const that = this;
    // console.log('update', fields);
    const { dispatch, app: { data: { pagination } } } = this.props;
    const { currentRecord: { updateId }, mobileSystemType } = this.state;
    dispatch({
      type: 'app/update',
      payload: {
        ...fields,
        updateId,
        upload: null,
        isPublish: fields.isPublish ? 1 : 0,
        isForce: fields.isForce ? 1 : 0,
        type: parseInt(mobileSystemType, 10),
      },
      pagination,
      callback(status, msg, paginationPayload) {
        // console.log('callback', status, msg);
        if (status === 200 && msg === '成功') {
          message.success('修改成功');
          that.setState({ modalVisible: false });
          dispatch({
            type: 'app/fetch',
            payload: paginationPayload,
          });
        } else if (status !== 200) {
          message.error(`服务器出问题了，status=${status}`);
        } else if (msg !== '成功') {
          message.error(`修改失败，msg=${msg}`);
        }
      },
    });
  };

  handleSystemChange = (system) => {
    // console.log(system, typeof (system)); // string
    this.props.dispatch({
      type: 'app/fetch',
      payload: {
        currentPage: 1,
        pageSize: 10,
        type: system,
      },
    });

    this.setState({ mobileSystemType: system });
  };

  handleRemove = () => {
    const that = this;
    let nextCurrentPage;
    const { selectedRows } = this.state;
    const { dispatch, app: { data: { list, pagination: { currentPage, pageSize } } } } = this.props;
    // 当前页面的项目都删除且当前页不为1时，应该请求前一个页面，不然会显示当前页面为空，但下面的页码显示的是前一个页面的
    if (list.length === selectedRows.length && currentPage !== 1) {
      nextCurrentPage = currentPage - 1;
      // 不然当删除项目小于当前页面项目数量(不论当前页是否为1的2种情况)时，请求当前页，还一种情况就是全删除时当前页为1时，则还是只能请求页面1，即也为当前页
    } else {
      nextCurrentPage = currentPage;
    }
    const listToBeRemoved = selectedRows.map(row => row.updateId);
    dispatch({
      type: 'app/remove',
      payload: {
        updateIds: listToBeRemoved,
        type: parseInt(this.state.mobileSystemType, 10),
      },
      pagination: {
        currentPage: nextCurrentPage,
        pageSize,
      },
      callback(status, msg, paginationPayload) {
        if (status === 200 && msg === '成功') {
          that.setState({ selectedRows: [] });
          message.success('删除成功');
          dispatch({
            type: 'app/fetch',
            payload: paginationPayload,
          });
        } else {
          message.error(`删除失败，status=${status}, msg=${msg}`);
        }
      },
    });
  };

  render() {
    const { app: { data }, loading } = this.props;
    // 后台返回的response.result赋值app中的data属性上，而后台返回的response.result.pagination中不包含current属性
    // standardTable中传入data.pagination，但是data.pagination只有currengPage属性，不含current属性，所以要增加一个current属性
    data.pagination.current = data.pagination.currentPage;
    // console.log('render', data.pagination);
    const list = data.list.map(li => {
      return {
        ...li,
        key: li.updateId,
        isPublishChinese: li.isPublish === '1' ? '是' : '否',
        isForceChinese: li.isForce === '1' ? '是' : '否',
      }
    });
    data.list = list

    const { selectedRows, modalVisible, currentRecord,
      downloadUrl, confirmLoading, mobileSystemType } = this.state;

    const columns = [
      {
        title: '版本名称',
        dataIndex: 'versionName',
      },
      {
        title: '版本编号',
        dataIndex: 'versionCode',
      },
      {
        title: '版本说明',
        dataIndex: 'versionRemark',
      },
      {
        title: '是否发布',
        dataIndex: 'isPublishChinese',
      },
      {
        title: '强制更新',
        dataIndex: 'isForceChinese',
      },
      {
        title: '下载地址',
        dataIndex: 'downloadUrl',
        render: link => <a href={link}>{link}</a>,
      },
      {
        title: '操作',
        render: (val, record) => <a onClick={() => this.handleModalVisible(true, record)}>配置</a>,
      },
    ];

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleUpdate: this.handleUpdate,
      handleModalVisible: this.handleModalVisible,
      setDownloadUrl: this.setDownloadUrl,
      setConfirmLoading: this.setConfirmLoading,
    };

    return (
      <PageHeaderLayout title="手机软件管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <span style={{ lineHeight: '32px', marginRight: 20 }}>所属平台:</span>
              <Select placeholder="请选择" style={{ width: 100 }} value={mobileSystemType} onChange={this.handleSystemChange}>
                <Option value="1">android</Option>
                <Option value="2">ios</Option>
              </Select>
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button onClick={this.handleRemove}>删除</Button>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          modalVisible={modalVisible}
          currentRecord={currentRecord}
          downloadUrl={downloadUrl}
          confirmLoading={confirmLoading}
        />
      </PageHeaderLayout>
    );
  }
}
