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
  const { fileList, setFileList, modalVisible, form, setdbUrl, setConfirmLoading, handleAdd, handleUpdate,
    handleModalVisible, confirmLoading, currentRecord, dbUrl } = props;
  const operationUpdate = !!currentRecord;

  // 点击确定（此时downloadUrl为上传成功后保存的dbUrl）
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if (operationUpdate) {
        handleUpdate({ ...fieldsValue, downloadUrl: dbUrl });
      } else {
        handleAdd({ ...fieldsValue, downloadUrl: dbUrl });
      }
      setdbUrl(''); // 点击确定时，将url清空
      setFileList();
    });
  };
  const cancelHandle = () => {
    handleModalVisible();
    setdbUrl('');
    setFileList();
  };

  // console.log(getToken());
  const token = getToken();
  const uploadProps = {
    name: 'files',
    fileList: fileList,
    action: '/acloud_new/v2/mobileVersion/uploadAPKFile',
    headers: {
      'JA-Token': token,
    },
    onChange(info) {
      console.log('info', info);
      setFileList(info.fileList.slice(-1))
      if (info.file.status === 'uploading') {
        setConfirmLoading(true);
      } else if (info.file.status === 'done') {
        if (info.file.response && info.file.response.code && info.file.response.code === 200) {
          // 上传成功回调拿到data包含webUrl（显示所需） 和dbUrl（上传配置所需）
          form.setFieldsValue({ downloadUrl: info.file.response.data.webUrl })
          // 保存dbUrl到父级
          setdbUrl(info.file.response.data.dbUrl);
          setConfirmLoading(false);
          message.success(`${info.file.name}文件上传成功`);
        } else message.error('文件上传失败');
      } else if (info.file.status === 'error') {
        setConfirmLoading(false);
        message.error(`${info.file.name}文件上传失败`);
      } else if (info.file.status === 'removed') {
        setConfirmLoading(false);
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
        {form.getFieldDecorator('versionName', {
          initialValue: operationUpdate ? currentRecord.versionName : '',
          rules: [
            { required: true, whitespace: true, message: '请输入版本名称' },
          ],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="版本编号">
        {form.getFieldDecorator('versionCode', {
          initialValue: operationUpdate ? currentRecord.versionCode : '',
          rules: [
            { required: true, whitespace: true, message: '请输入版本编号' },
          ],
        })(<Input placeholder="请输入" />)}
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
        {form.getFieldDecorator('downloadUrl', {
          initialValue: operationUpdate ? currentRecord.downloadUrl : '',
          rules: [
            { required: true, message: '请上传安装文件' },
          ],
        })(<Input disabled={true} placeholder="上传后自动补全" />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ app, loading }) => ({
  app,
  loading: loading.effects['app/fetch'],
}))
@Form.create()
export default class AppManagement extends PureComponent {
  state = {
    fileList: [],
    modalVisible: false,
    currentRecord: null,
    selectedRows: [],
    dbUrl: '',
    confirmLoading: false,
    mobileSystemType: '1', // 要设置成字符串，不能是数字1，因为设定select里面的value="1"，而不是value={1}
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'app/fetch',
      payload: {
        pageNum: 1,
        pageSize: 10,
        type: 1,
      },
      callback(code, msg) {
        if (code !== 200) {
          message.error(`code=${code}, msg=${msg}`);
        }
      },
    });
  }

  setdbUrl = (url) => {
    this.setState({ dbUrl: url });
  };

  setFileList = list => {
    this.setState({ fileList: list || [] })
  }

  setConfirmLoading = (confirmLoading) => {
    this.setState({ confirmLoading });
  };

  handleStandardTableChange = (pagination) => {
    // console.log('table', pagination);
    this.props.dispatch({
      type: 'app/fetch',
      payload: {
        pageNum: pagination.current,
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
      dbUrl: currentRecord ? currentRecord.dbUrl : '',
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
      callback(code, msg, paginationPayload) {
        // console.log('callback', code, msg);
        if (code === 200) {
          message.success('添加成功');
          that.setState({ modalVisible: false });
          dispatch({
            type: 'app/fetch',
            payload: paginationPayload,
          });
        } else if (code !== 200) {
          message.error(`服务器出问题了，code=${code}`);
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
    const { currentRecord: { id }, mobileSystemType } = this.state;
    dispatch({
      type: 'app/update',
      payload: {
        ...fields,
        id,
        upload: null,
        isPublish: fields.isPublish ? 1 : 0,
        isForce: fields.isForce ? 1 : 0,
        type: parseInt(mobileSystemType, 10),
      },
      pagination,
      callback(code, msg, paginationPayload) {
        // console.log('callback', code, msg);
        if (code === 200) {
          message.success('修改成功');
          that.setState({ modalVisible: false });
          dispatch({
            type: 'app/fetch',
            payload: paginationPayload,
          });
        } else if (code !== 200) {
          message.error(`服务器出问题了，code=${code}`);
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
        pageNum: 1,
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
    const { dispatch, app: { data: { list, pagination: { pageNum, pageSize } } } } = this.props;
    // 当前页面的项目都删除且当前页不为1时，应该请求前一个页面，不然会显示当前页面为空，但下面的页码显示的是前一个页面的
    if (list.length === selectedRows.length && pageNum !== 1) {
      nextCurrentPage = pageNum - 1;
      // 不然当删除项目小于当前页面项目数量(不论当前页是否为1的2种情况)时，请求当前页，还一种情况就是全删除时当前页为1时，则还是只能请求页面1，即也为当前页
    } else {
      nextCurrentPage = pageNum;
    }
    const listToBeRemoved = selectedRows.map(row => row.id);
    dispatch({
      type: 'app/remove',
      payload: {
        ids: listToBeRemoved,
        type: parseInt(this.state.mobileSystemType, 10),
      },
      pagination: {
        pageNum: nextCurrentPage,
        pageSize,
      },
      callback(code, msg, paginationPayload) {
        if (code === 200) {
          that.setState({ selectedRows: [] });
          message.success('删除成功');
          dispatch({
            type: 'app/fetch',
            payload: paginationPayload,
          });
        } else {
          message.error(`删除失败，code=${code}, msg=${msg}`);
        }
      },
    });
  };

  render() {
    const { app: { data }, loading } = this.props;
    // 后台返回的response.result赋值app中的data属性上，而后台返回的response.result.pagination中不包含current属性
    // standardTable中传入data.pagination，但是data.pagination只有currengPage属性，不含current属性，所以要增加一个current属性

    data.pagination.current = data.pagination.pageNum;
    // console.log('render', data.pagination);
    const list = data.list.map(li => {
      return {
        ...li,
        key: li.id,
        isPublishChinese: li.isPublish === '1' ? '是' : '否',
        isForceChinese: li.isForce === '1' ? '是' : '否',
      }
    });
    data.list = list

    const { fileList, selectedRows, modalVisible, currentRecord,
      dbUrl, confirmLoading, mobileSystemType } = this.state;

    const columns = [
      {
        title: '版本名称',
        dataIndex: 'versionName',
        key: 'versionName',
      },
      {
        title: '版本编号',
        dataIndex: 'versionCode',
        key: 'versionCode',
      },
      {
        title: '版本说明',
        dataIndex: 'versionRemark',
        key: 'versionRemark',
      },
      {
        title: '是否发布',
        dataIndex: 'isPublishChinese',
        key: 'isPublishChinese',
      },
      {
        title: '强制更新',
        dataIndex: 'isForceChinese',
        key: 'isForceChinese',
      },
      {
        title: '下载地址',
        dataIndex: 'downloadUrl',
        key: 'downloadUrl',
        render: link => <a href={link}>{link}</a>,
      },
      {
        title: '操作',
        key: '操作',
        render: (val, record) => <a onClick={() => this.handleModalVisible(true, record)}>配置</a>,
      },
    ];

    const parentMethods = {
      setFileList: this.setFileList,
      handleAdd: this.handleAdd,
      handleUpdate: this.handleUpdate,
      handleModalVisible: this.handleModalVisible,
      setdbUrl: this.setdbUrl,
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
              rowKey="id"
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
          dbUrl={dbUrl}
          confirmLoading={confirmLoading}
          fileList={fileList}
        />
      </PageHeaderLayout>
    );
  }
}
