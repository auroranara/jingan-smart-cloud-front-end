import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import router from 'umi/router';
// import Link from 'umi/link';
import moment from 'moment';
import { Card, Table, message, Upload, DatePicker, Icon, Input, Modal, Button, Form } from 'antd';
import CompanySelect from '@/jingan-components/CompanySelect';
import { getToken } from 'utils/authority';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';

const title = '检验报告';

const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
  },
  {
    title: '设备设施管理',
    name: '设备设施管理',
  },
  {
    title: '安全设施',
    name: '安全设施',
    href: '/facility-management/safety-facilities/list',
  },
  {
    title,
    name: title,
  },
];
// 上传文件夹
const folder = 'safetyFacilities';
// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';

const ReportModal = Form.create()(props => {
  const {
    modalVisible,
    form: { getFieldDecorator, validateFields, resetFields },
    title = '新增检验报告',
    uploading,
    fileList,
    handleUploadChange,
    handleModalClose,
    handleModalAdd,
  } = props;

  const formItemCol = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 15,
    },
  };

  const onConfirm = () => {
    validateFields((err, fieldsValue) => {
      const { targetName, checkFrequency, companyId } = fieldsValue;
      const payload = {
        targetName,
        checkFrequency,
        companyId: companyId.key,
      };
      if (err) return;
      resetFields();
      return handleModalAdd(payload);
    });
  };

  const handleClose = () => {
    resetFields();
    handleModalClose();
  };
  return (
    <Modal
      title={title}
      closable={false}
      visible={modalVisible}
      onCancel={handleClose}
      onOk={onConfirm}
    >
      <Form>
        <Form.Item {...formItemCol} label="证书编号">
          {getFieldDecorator('certificateNumber', {
            getValueFromEvent: e => e.target.value.trim(),
            // initialValue: detail.certificateNumber,
            // rules: [{ required: true, message: '请输入证书编号' }],
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item {...formItemCol} label="检验日期">
          {getFieldDecorator('inspectDate', {
            // initialValue: detail.inspectDate ? moment(+detail.inspectDate) : undefined,
            // rules: [{ required: true, message: '请输入检验日期' }],
          })(<DatePicker showToday={false} format="YYYY-MM-DD" placeholder="请选择" />)}
        </Form.Item>
        <Form.Item {...formItemCol} label="检验有效期至">
          {getFieldDecorator('usePeriodDate', {
            // initialValue: detail.usePeriodDate ? moment(+detail.usePeriodDate) : undefined,
            rules: [{ required: true, message: '请选择检验有效期至' }],
          })(<DatePicker showToday={false} format="YYYY-MM-DD" placeholder="请选择" />)}
        </Form.Item>
        <Form.Item {...formItemCol} label="检验单位">
          {getFieldDecorator('inspectUnit', {
            rules: [
              {
                // required: true,
                message: '请选择检验单位',
                transform: value => value && value.label,
              },
            ],
          })(<CompanySelect placeholder="请选择" />)}
        </Form.Item>
        <Form.Item {...formItemCol} label="检验报告">
          {getFieldDecorator('reportFileList', {})(
            <Upload
              name="files"
              accept=".jpg,.png"
              headers={{ 'JA-Token': getToken() }}
              data={{ folder }} // 附带参数
              action={uploadAction} // 上传地址
              fileList={fileList}
              onChange={handleUploadChange}
            >
              <Button type="dashed" style={{ width: '96px', height: '96px' }} disabled={uploading}>
                <Icon type="plus" style={{ fontSize: '32px' }} />
                <div style={{ marginTop: '8px' }}>点击上传</div>
              </Button>
            </Upload>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
});

@Form.create()
@connect(({ targetResponsibility, user, loading }) => ({
  targetResponsibility,
  user,
  loading: loading.models.targetResponsibility,
}))
export default class CheckDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false, // 弹窗是否可见
      uploading: false,
      fileList: [],
    };
  }

  componentDidMount() {
    this.fetchList();
  }

  // 获取列表
  fetchList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'safeFacilities/fetchReportList',
      payload: {
        ...params,
        pageNum: 1,
        pageSize: 10,
      },
    });
  };

  handleModalShow = () => {
    this.setState({ modalVisible: true });
  };

  handleModalClose = () => {
    this.setState({ modalVisible: false });
  };

  handleUploadChange = ({ file, fileList }) => {
    if (file.status === 'uploading') {
      this.setState({
        fileList: fileList,
        uploading: true,
      });
    } else if (file.status === 'done' && file.response.code === 200) {
      const {
        data: {
          list: [result],
        },
      } = file.response;
      if (result) {
        this.setState({
          fileList: fileList.map(item => {
            if (!item.url && item.response) {
              return {
                ...item,
                url: result.webUrl,
                dbUrl: result.dbUrl,
              };
            }
            return item;
          }),
          uploading: false,
        });
        message.success('上传成功！');
      }
    } else if (file.status === 'removed') {
      // 删除
      this.setState({
        fileList: fileList.filter(item => {
          return item.status !== 'removed';
        }),
        uploading: false,
      });
    } else {
      // error
      message.error('上传失败！');
      this.setState({
        fileList: fileList.filter(item => {
          return item.status !== 'error';
        }),
        uploading: false,
      });
    }
  };

  handleModalAdd = formData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'safeFacilities/fetchReportAdd',
      payload: { ...formData },
      callback: response => {
        if (response && response.code === 200) {
          this.handleModalClose();
          this.fetchList();
          message.success('新建成功！');
        } else message.error(response.msg);
      },
    });
  };

  render() {
    const {
      loading = false,
      safeFacilities: {
        reportData: { list = [] },
      },
    } = this.props;
    const { modalVisible, uploading, fileList } = this.state;

    const columns = [
      {
        title: '证书编号',
        dataIndex: 'certificateNumber',
        key: 'certificateNumber',
        align: 'center',
      },
      {
        title: '检验日期',
        dataIndex: 'inspectDate',
        key: 'inspectDate',
        align: 'center',
      },
      {
        title: '检验有效期至',
        dataIndex: 'usePeriodDate',
        key: 'usePeriodDate',
        align: 'center',
      },
      {
        title: '检验单位',
        dataIndex: 'inspectUnit',
        key: 'inspectUnit',
        align: 'center',
      },
      {
        title: '上传日期',
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'center',
      },
      {
        title: '上传人',
        dataIndex: 'createPerson',
        key: 'createPerson',
        align: 'center',
      },
      {
        title: '检验报告',
        dataIndex: 'reportFileList',
        key: 'reportFileList',
        align: 'center',
        render: () => {
          return <a>查看附件</a>;
        },
      },
    ];

    const modalData = {
      modalVisible,
      uploading,
      fileList,
      handleUploadChange: this.handleUploadChange,
      handleModalClose: this.handleModalClose,
      handleModalAdd: this.handleModalAdd,
    };

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <Button type="primary" onClick={this.handleModalShow}>
            新增检验报告
          </Button>
        }
      >
        <div className={styles1.container} style={{ padding: '14px 10px 30px' }}>
          {list.length > 0 ? (
            <Table
              bordered
              rowKey="targetId"
              loading={loading}
              columns={columns}
              dataSource={list}
              // onChange={this.onTableChange}
              pagination={false}
            />
          ) : (
            <Card bordered={false} style={{ textAlign: 'center' }}>
              <span>暂无数据</span>
            </Card>
          )}
          <div style={{ textAlign: 'right', marginTop: 20 }}>
            <Button href={``}>返回</Button>
          </div>
        </div>

        <ReportModal {...modalData} />
      </PageHeaderLayout>
    );
  }
}
