import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Table, message, Upload, DatePicker, Input, Modal, Button } from 'antd';
import CompanySelect from '@/jingan-components/CompanySelect';
import { getToken } from 'utils/authority';
import Lightbox from 'react-images';
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
    handleBeforeUpload,
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
      const { certificateNumber, inspectDate, usePeriodDate, inspectUnit } = fieldsValue;
      const payload = {
        certificateNumber,
        inspectDate: inspectDate ? inspectDate.format('YYYY-MM-DD') : undefined,
        usePeriodDate: usePeriodDate ? usePeriodDate.format('YYYY-MM-DD') : undefined,
        // inspectUnit: inspectUnit ? inspectUnit.key : undefined,
        inspectUnit: inspectUnit || undefined,
        reportFileList:
          fileList.length > 0
            ? fileList.map(({ name, url, dbUrl }) => ({ name, webUrl: url, dbUrl }))
            : undefined,
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
      confirmLoading={uploading}
    >
      <Form>
        <Form.Item {...formItemCol} label="报告编号">
          {getFieldDecorator('certificateNumber', {
            getValueFromEvent: e => e.target.value.trim(),
            // initialValue: detail.certificateNumber,
            // rules: [{ required: true, message: '请输入报告编号' }],
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
            // })(<CompanySelect placeholder="请选择" />)}
          })(<Input placeholder="请输入检验单位" />)}
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
              beforeUpload={handleBeforeUpload}
            >
              <Button type="dashed" style={{ width: '96px', height: '96px' }} disabled={uploading}>
                <LegacyIcon type="plus" style={{ fontSize: '32px' }} />
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
@connect(({ safeFacilities, user, loading }) => ({
  safeFacilities,
  user,
  loading: loading.models.safeFacilities,
}))
export default class InspectionReport extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false, // 弹窗是否可见
      uploading: false,
      fileList: [],
      fileVisible: false, // 附件弹窗是否可见
      imgUrl: [], // 附件图片列表
      currentImage: 0, // 展示附件大图下标
    };
    this.pageNum = 1;
    this.pageSize = 10;
  }

  componentDidMount() {
    this.fetchList();
  }

  // 获取列表
  fetchList = (pageNum = 1, pageSize = 10, params = {}) => {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch({
      type: 'safeFacilities/fetchReportList',
      payload: {
        safeId: id,
        ...params,
        pageSize,
        pageNum,
      },
    });
  };

  handlePageChange = (pageNum, pageSize) => {
    this.pageNum = pageNum;
    this.pageSize = pageSize;
    this.fetchList(pageNum, pageSize);
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
    } else if (file.status === 'error') {
      // error
      this.setState({
        fileList: [],
        uploading: false,
      });
    }
  };

  handleBeforeUpload = file => {
    const { uploading } = this.state;
    const isImage = file.type === 'image/jpeg' || file.type === 'image/png';
    if (uploading) {
      message.error('尚未上传结束');
    }
    if (!isImage) {
      message.error('上传失败，请上传jpg格式或者png格式图片');
    }
    return isImage && !uploading;
  };

  handleModalAdd = formData => {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch({
      type: 'safeFacilities/fetchReportAdd',
      payload: { safeId: id, ...formData },
      callback: response => {
        if (response && response.code === 200) {
          this.handleModalClose();
          this.fetchList();
          this.setState({ fileList: [] });
          message.success('新建成功！');
        } else message.error(response.msg);
      },
    });
  };

  handleShowFile = files => {
    const newFiles = files.map(({ webUrl }) => {
      return {
        src: webUrl,
      };
    });
    this.setState({
      fileVisible: true,
      imgUrl: newFiles,
      currentImage: 0,
    });
  };

  handleFileClose = () => {
    this.setState({
      fileVisible: false,
    });
  };

  gotoPrevious = () => {
    let { currentImage } = this.state;
    if (currentImage <= 0) return;
    this.setState({ currentImage: --currentImage });
  };

  gotoNext = () => {
    let { currentImage, imgUrl } = this.state;
    if (currentImage >= imgUrl.length - 1) return;
    this.setState({ currentImage: ++currentImage });
  };

  handleClickThumbnail = i => {
    const { currentImage } = this.state;
    if (currentImage === i) return;
    this.setState({ currentImage: i });
  };

  render() {
    const {
      loading = false,
      safeFacilities: {
        reportData: {
          list = [],
          pagination: { total, pageNum, pageSize },
        },
      },
    } = this.props;
    const { modalVisible, uploading, fileList, imgUrl, fileVisible, currentImage } = this.state;

    const columns = [
      {
        title: '报告编号',
        dataIndex: 'certificateNumber',
        key: 'certificateNumber',
        align: 'center',
      },
      {
        title: '检验日期',
        dataIndex: 'inspectDate',
        key: 'inspectDate',
        align: 'center',
        render: val => {
          return val === null ? '' : moment(+val).format('YYYY-MM-DD');
        },
      },
      {
        title: '检验有效期至',
        dataIndex: 'usePeriodDate',
        key: 'usePeriodDate',
        align: 'center',
        render: val => {
          return val === null ? '' : moment(+val).format('YYYY-MM-DD');
        },
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
        render: val => {
          return moment(+val).format('YYYY-MM-DD');
        },
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
        render: val => {
          return val.length > 0 ? (
            <a
              onClick={() => {
                this.handleShowFile(val);
              }}
            >
              查看附件
            </a>
          ) : (
            <span style={{ color: '#aaa' }}>查看附件</span>
          );
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
      handleBeforeUpload: this.handleBeforeUpload,
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
              rowKey="id"
              loading={loading}
              columns={columns}
              dataSource={list}
              pagination={{
                current: pageNum,
                pageSize,
                total,
                showQuickJumper: true,
                showSizeChanger: true,
                // pageSizeOptions: ['5', '10', '15', '20'],
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
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Button
            // href={`#/facility-management/safety-facilities/list`}
            onClick={e => window.close()}
          >
            返回
          </Button>
        </div>
        <ReportModal {...modalData} />
        <Lightbox
          images={imgUrl}
          isOpen={fileVisible}
          currentImage={currentImage}
          onClickPrev={this.gotoPrevious}
          onClickNext={this.gotoNext}
          onClose={this.handleFileClose}
          showThumbnails
          onClickThumbnail={this.handleClickThumbnail}
          imageCountSeparator="/"
        />
      </PageHeaderLayout>
    );
  }
}
