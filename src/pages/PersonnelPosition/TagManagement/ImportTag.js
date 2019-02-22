import { PureComponent } from 'react';
import { Card, Form, Select, message, Upload, Button, Icon, Table, Spin, Popover } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import Result from '@/components/Result';
import router from 'umi/router';
import { connect } from 'dva';
import { getToken } from '@/utils/authority';

const FormItem = Form.Item;
const Option = Select.Option;

// 标题
const title = '批量导入'
const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 10 },
};

@Form.create()
@connect(({ personnelPosition }) => ({
  personnelPosition,
}))
export default class ImportTag extends PureComponent {

  state = {
    fileList: [],   // 上传的文件列表
    failed: 0,       // 上传后反馈的失败数据数
    success: 0,      // 上传后反馈的成功数据数
    updated: 0,      // 上传后反馈的更新数据数
    total: 0,        // 上传后反馈的数据总数
    loading: false,  // 上传loading状态
  }

  componentDidMount() {
    const {
      dispatch,
      match: { params: { companyId } },
    } = this.props
    dispatch({
      type: 'personnelPosition/fetchSystemConfiguration',
      payload: { pageNum: 1, pageSize: 0, companyId },
    })
  }

  // 上传时多个阶段调用
  handleChange = info => {
    const fileList = info.fileList.slice(-1);
    this.setState({ fileList });
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
    }
    if (info.file.response) {
      if (info.file.response.code && info.file.response.code === 200) {
        // 上传成功
        if (!info.file.response.data) return
        const { failed, success, updated, total } = info.file.response.data;
        this.setState({
          failed,
          success,
          updated,
          total,
          showResultCard: true,
          loading: false,
          dataSource: info.file.response.data.list,
          showErrorLogo: failed > 0,
          showErrorTable: failed > 0,
          uploadStatus: 200,
        });
      } else {
        // 上传失败
        this.setState({
          failed: 0,
          success: 0,
          total: 0,
          updated: 0,
          loading: false,
          showResultCard: true,
          showErrorTable: false,
          showErrorLogo: true,
          uploadStatus: info.file.response.code,
          msg: info.file.response.msg,
        });
      }
    }
  }

  // 返回标签列表
  handleBack = () => {
    const { match: { params: { companyId } } } = this.props
    router.push(`/personnel-position/tag-management/company/${companyId}`)
  }

  render() {
    const {
      match: { params: { companyId } },
      form: { getFieldDecorator, getFieldValue },
      personnelPosition: { systemConfiguration: { list: systemList } },
    } = this.props
    const {
      uploadStatus,
      msg,
      total,
      success,
      updated,
      failed,
      showResultCard,
      loading,
      fileList,
      showErrorLogo,
      dataSource,
      showErrorTable,
    } = this.state
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '人员定位', name: '人员定位' },
      { title: '标签管理', name: '标签管理', href: '/personnel-position/tag-management/companies' },
      { title: '标签列表', name: '标签列表', href: `/personnel-position/tag-management/company/${companyId}` },
      { title, name: title },
    ]
    const sysId = getFieldValue('sysId')
    const props = {
      name: 'file',
      action: '/acloud_new/v2/accessCard/importAccessCard',
      accept: '.xls,.xlsx',
      onChange: this.handleChange,
      headers: {
        'JA-Token': getToken(),
      },
      data: { companyId, sysId },
    };

    // 表格单元格单元格
    const renderTableCell = (val, rows, key) => {
      const isError = rows.error.findIndex(item => item.key === key) > -1
      if (isError) {
        const result = rows.error.find(item => item.key === key);
        return (
          <Popover content={result.value} title="错误提示" trigger="hover">
            <Icon style={{ color: 'red', marginRight: 10 }} type="exclamation-circle-o" />
            <span style={{ color: 'red' }}>{val}</span>
          </Popover>
        );
      } else return <span>{val}</span>;
    };

    const columns = [
      {
        title: '行序号',
        dataIndex: 'row',
        key: 'row',
        align: 'center',
        render(val, rows, index) {
          return (
            <Popover
              content={<div>{rows.error.map((item, i) => (<p key={i}>（{index + 1}）{item.value}</p>))}</div>}
              title="错误提示"
              trigger="hover">
              <Icon style={{ color: 'red', marginRight: 10 }} type="exclamation-circle-o" />
              <span style={{ color: 'red' }}>{val}</span>
            </Popover>
          );
        },
      },
      {
        title: '标签号',
        dataIndex: 'code',
        key: 'code',
        align: 'center',
        render(val, rows) {
          return renderTableCell(val, rows, 'code');
        },
      },
      {
        title: '标签分类',
        dataIndex: 'type',
        key: 'type',
        align: 'center',
        render(val, rows) {
          return renderTableCell(val, rows, 'type');
        },
      },
      {
        title: '持卡人',
        dataIndex: 'userName',
        key: 'userName',
        align: 'center',
        render(val, rows) {
          return renderTableCell(val, rows, 'userName');
        },
      },
      {
        title: '联系方式',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        align: 'center',
        render(val, rows) {
          return renderTableCell(val, rows, 'phoneNumber');
        },
      },
    ]

    // 上传后的统计信息
    const message = (
      <div style={{ color: '#4d4848', fontSize: '17px' }}>
        {uploadStatus !== 200 && <span>{msg}</span>}
        {failed === 0 && uploadStatus === 200 && <span>本次导入数据共计{total}条。</span>}
        {success > 0 && <span>新建信息{success}条。</span>}
        {updated > 0 && <span>更新信息{updated}条。</span>}
        {failed > 0 && (
          <span>
            错误信息共计<span style={{ color: 'red' }}>{failed}</span>条，请核对后再试。
          </span>
        )}
        {!showErrorLogo && <span>错误信息0条。</span>}
      </div>
    );

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        <Card style={{ marginBottom: '24px' }}>
          <Form>
            <FormItem label="所属系统" {...formItemLayout}>
              {getFieldDecorator('sysId')(
                <Select notFoundContent="暂无数据" placeholder="请选择" >
                  {systemList.map(({ sysName, id }) => (
                    <Option key={id}>{sysName}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem label="批量上传" {...formItemLayout}>
              {sysId ? (
                <Upload {...props} fileList={fileList} >
                  <Button type="primary" loading={loading}><Icon type="upload" /> 选择文件</Button>
                </Upload>
              ) : (
                  <Button type="primary" onClick={() => { message.warning('请先选择所属系统！') }}>
                    <Icon type="upload" /> 选择文件
                  </Button>
                )}
            </FormItem>
          </Form>
        </Card>
        <Spin spinning={loading}>
          {showResultCard && (
            <Card>
              <Result
                style={{ fontSize: '72px' }}
                type={showErrorLogo ? 'error' : 'success'}
                title={showErrorLogo ? '校验失败' : '校验成功'}
                description={message}
              />
              {showErrorTable && (
                <div>
                  <Table
                    rowKey="row"
                    pagination={false}
                    dataSource={dataSource}
                    columns={columns}
                  />
                </div>
              )}
              <Button
                style={{ margin: '0 auto', display: 'block', marginTop: '20px' }}
                type="primary"
                onClick={this.handleBack}
              >
                返回
              </Button>
            </Card>
          )}
        </Spin>
      </PageHeaderLayout>
    )
  }
}
