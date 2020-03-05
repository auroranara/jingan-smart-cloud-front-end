import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  List,
  Card,
  Button,
  Input,
  Modal,
  BackTop,
  Spin,
  Col,
  Row,
  Select,
  DatePicker,
  Upload,
  message,
  Cascader,
  Popconfirm,
} from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import Ellipsis from '@/components/Ellipsis';
import moment from 'moment';
import { getToken } from '@/utils/authority';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';

import styles from './FaceDatabase.less';
import pic from './images/pic.png';

// const { confirm } = Modal;
const FormItem = Form.Item;
const { Option } = Select;

const title = '人脸库';

const sexList = {
  1: '男',
  2: '女',
};

const documentTypeList = {
  1: '军官证',
  2: '身份证',
};
//面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '安防管理',
    name: '安防管理',
  },
  {
    title: '出入口监测',
    name: '出入口监测',
    href: '/security-manage/entrance-and-exit-monitor/company-list',
  },
  {
    title,
    name: '人脸库',
  },
];

// 默认页面显示数量
const pageSize = 18;

// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';

// 表单label
const fieldLabels = {
  name: '姓名',
  sex: '性别',
  phone: '手机号',
  jobNum: '工号',
  provincialLevel: '籍贯',
  localMarket: '地市',
  documentType: '证件类型',
  documentNum: '证件号',
  birthStartTime: '生日起始时间',
  birthEndTime: '生日截止时间',
  birthTime: '生日',
  picArea: '照片',
  picRouter: '图片路径',
};

/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

/* root下的div */
const getRootChild = () => document.querySelector('#root>div');

@connect(({ securityManage, company, loading }) => ({
  securityManage,
  company,
  loading: loading.models.securityManage,
}))
@Form.create()
export default class FaceDatabase extends PureComponent {
  constructor(props) {
    super(props);
    // this.formData = defaultFormData;
    this.state = {
      modalVisible: false, // 弹窗是否可见
      modalTitle: '', // 弹窗标题
      modalExportVisible: false, // 导入弹框是否可见
      status: '', // 弹框标题为新增或编辑的状态
      faceLoading: false, // 照片loading
      uploadFace: [], // 上传的人脸照片
      exportList: [], // 导入的列表
      exportLoading: false, // 导入loading
      currentId: '', // 卡片当前id
      submitting: false, // 提交状态loading
    };
  }

  // 挂载后
  componentDidMount() {
    const {
      dispatch,
      location: {
        query: { faceDataBaseId },
      },
    } = this.props;

    // 获取人脸列表
    dispatch({
      type: 'securityManage/fetchFaceList',
      payload: {
        faceDatabase: faceDataBaseId,
        pageSize,
        pageNum: 1,
      },
    });

    // 获取行政区域
    dispatch({
      type: 'company/fetchArea',
      payload: {
        keys: ['registerAddress'],
      },
    });
  }

  // 查询
  handleClickToQuery = () => {
    const {
      form: { getFieldsValue },
      location: {
        query: { faceDataBaseId },
      },
      dispatch,
    } = this.props;
    const {
      name,
      sex,
      phone,
      jobNum,
      province: [registerProvince, registerCity] = [],
      doucumentType,
      doucumentNumber,
      startDate,
      endDate,
    } = getFieldsValue();
    const payload = {
      faceName: name,
      faceType: +sex === 1 ? '1' : +sex === 2 ? '2' : undefined,
      faceTel: phone,
      jobNumber: jobNum,
      province: registerProvince,
      city: registerCity,
      identityCardType: +doucumentType === 1 ? '1' : +doucumentType === 2 ? '2' : undefined,
      identityCardNo: doucumentNumber,
      startDate: startDate ? moment(startDate).format('YYYY-MM-DD') : undefined,
      endDate: endDate ? moment(endDate).format('YYYY-MM-DD') : undefined,
    };
    // 重新请求数据
    dispatch({
      type: 'securityManage/fetchFaceList',
      payload: {
        faceDatabase: faceDataBaseId,
        pageSize,
        pageNum: 1,
        ...payload,
      },
    });
  };

  // 重置
  handleClickToReset = () => {
    const {
      dispatch,
      form: { resetFields },
      location: {
        query: { faceDataBaseId },
      },
    } = this.props;
    // 清除筛选条件
    resetFields();
    // 重新请求数据
    dispatch({
      type: 'securityManage/fetchFaceList',
      payload: {
        faceDatabase: faceDataBaseId,
        pageSize,
        pageNum: 1,
      },
    });
  };

  // 滚动加载
  handleLoadMore = () => {
    const {
      dispatch,
      securityManage: { isLast },
      location: {
        query: { faceDataBaseId },
      },
    } = this.props;
    if (isLast) {
      return;
    }
    const {
      securityManage: { pageNum },
    } = this.props;
    // 请求数据
    dispatch({
      type: 'securityManage/fetchFaceListMore',
      payload: {
        faceDatabase: faceDataBaseId,
        pageSize,
        pageNum: pageNum + 1,
        ...this.formData,
      },
    });
  };

  /* 去除左右两边空白 */
  handleTrim = e => e.target.value.trim();

  // 删除
  handleCardDelete = id => {
    const {
      dispatch,
      location: {
        query: { faceDataBaseId },
      },
    } = this.props;
    dispatch({
      type: 'securityManage/fetchFaceDelete',
      payload: { ids: id },
      success: () => {
        // 获取人脸列表
        dispatch({
          type: 'securityManage/fetchFaceList',
          payload: {
            faceDatabase: faceDataBaseId,
            pageSize,
            pageNum: 1,
          },
        });
        message.success('删除成功！');
      },
      error: () => {
        message.error('已存在报警记录，删除失败!');
      },
    });
  };

  // 新增弹窗显示
  handleClickAdd = status => {
    const {
      form: { setFieldsValue },
    } = this.props;
    this.setState({
      modalVisible: true,
      modalTitle: status === 'add' && '添加人脸库信息',
      status: status,
      uploadFace: [],
    });
    setFieldsValue({
      faceName: undefined,
      faceType: undefined,
      faceTel: undefined,
      jobNumber: undefined,
      provincial: undefined,
      identityCardType: undefined,
      identityCardNo: undefined,
      faceBirthday: undefined,
    });
  };

  // 编辑-弹窗显示
  handleClickEdit = (status, item) => {
    const {
      form: { setFieldsValue },
      dispatch,
    } = this.props;
    const {
      id,
      faceDetails,
      faceName,
      faceType,
      faceTel,
      jobNumber,
      identityCardType,
      identityCardNo,
      faceBirthday,
      province: registerProvince,
      city: registerCity,
    } = item;
    setFieldsValue({
      faceUrl: faceDetails,
      faceName: faceName,
      faceType: faceType,
      faceTel: faceTel,
      jobNumber: jobNumber,
      provincial: registerProvince ? [+registerProvince, +registerCity] : [],
      identityCardType: identityCardType ? identityCardType : undefined,
      identityCardNo: identityCardNo,
      faceBirthday: faceBirthday ? moment(faceBirthday) : undefined,
    });
    this.setState({
      modalVisible: true,
      modalTitle: status === 'edit' && '编辑人脸库信息',
      status: status,
      uploadFace: faceDetails,
      currentId: id,
    });
    dispatch({
      type: 'company/fetchArea',
      payload: {
        cityIds: [registerProvince, registerCity].filter(item => item).join(','),
        keys: ['registerAddress'],
      },
    });
  };

  // 新增、编辑-弹窗关闭
  handleCloseForm = () => {
    this.setState({ modalVisible: false });
  };

  // 新增、编辑提交
  handleSubmitForm = () => {
    const {
      dispatch,
      location: {
        query: { faceDataBaseId },
      },
      form: { validateFieldsAndScroll },
    } = this.props;
    const { status, uploadFace, currentId } = this.state;

    if (!uploadFace.length) {
      return message.warning('请上传jpg格式照片，照片不能为空！');
    }

    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        this.setState({ submitting: true });
        const {
          faceName,
          faceType,
          faceTel,
          jobNumber,
          identityCardType,
          identityCardNo,
          faceBirthday = '',
          provincial: [registerProvince, registerCity] = [],
        } = values;
        const payload = {
          faceUrl: JSON.stringify(
            uploadFace.map(({ name, webUrl, dbUrl }) => ({ name, webUrl, dbUrl }))
          ),
          faceName,
          faceType,
          faceTel,
          jobNumber,
          identityCardType,
          identityCardNo,
          province: registerProvince,
          city: registerCity,
          faceBirthday: faceBirthday ? moment(faceBirthday).format('YYYY-MM-DD 00:00:00') : '',
          faceDatabase: faceDataBaseId,
        };

        const success = () => {
          message.success(status === 'edit' ? '编辑成功' : '新增成功');
          this.setState({ modalVisible: false, submitting: false });
          // 获取人脸列表
          dispatch({
            type: 'securityManage/fetchFaceList',
            payload: {
              faceDatabase: faceDataBaseId,
              pageSize,
              pageNum: 1,
            },
          });
        };

        const error = () => {
          message.error(status === 'edit' ? '编辑失败' : '新增失败');
          this.setState({ modalVisible: true, submitting: false });
        };

        if (status === 'edit') {
          dispatch({
            type: 'securityManage/fetchFaceEdit',
            payload: {
              id: currentId,
              ...payload,
            },
            success,
            error,
          });
        } else {
          dispatch({
            type: 'securityManage/fetcFaceAdd',
            payload,
            success,
            error,
          });
        }
      }
    });
  };

  // 导入-弹框显示
  handleExport = () => {
    this.setState({ modalExportVisible: true });
  };

  // 导入-弹框关闭
  handleCloseExport = () => {
    this.setState({ modalExportVisible: false, exportList: [] });
  };

  // 处理人脸照片导入
  handleFaceExportChange = ({ file, fileList }) => {
    if (file.status === 'uploading') {
      this.setState({
        exportList: fileList,
        exportLoading: true,
      });
    } else if (file.status === 'done') {
      if (file.response.code === 200) {
        const {
          data: {
            list: [result],
          },
        } = file.response;
        this.setState({
          exportList: fileList.map(item => {
            if (!item.url && item.response) {
              return {
                ...item,
                url: result.webUrl,
                dbUrl: result.dbUrl,
                status: file.status,
              };
            }
            return item;
          }),
        });
      } else {
        // code为500
        message.error('上传失败！');
        this.setState({
          exportList: fileList.filter(item => {
            return !item.response || item.response.code !== 200;
          }),
        });
      }
      this.setState({
        exportLoading: false,
      });
    } else if (file.status === 'removed') {
      // 删除
      this.setState({
        exportList: fileList.filter(item => {
          return item.status !== 'removed';
        }),
        exportLoading: false,
      });
    }
  };

  // 导入弹框确定
  handleExportSubmit = () => {
    const {
      dispatch,
      form: { validateFieldsAndScroll },
      location: {
        query: { faceDataBaseId },
      },
    } = this.props;
    const { exportList } = this.state;

    const status = exportList.map(item => item.status);
    const hasUploading = status.includes('uploading');
    if (hasUploading === true) {
      return message.warning('照片还在上传中，请等待！');
    }

    if (exportList.length === 0) {
      return message.error('请先上传jpg格式照片');
    }

    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        const success = () => {
          message.success('导入成功');
          this.setState({ modalExportVisible: false, exportList: [], submittingModal: false });
          // 获取人脸列表
          dispatch({
            type: 'securityManage/fetchFaceList',
            payload: {
              // companyId,
              faceDatabase: faceDataBaseId,
              pageSize,
              pageNum: 1,
            },
          });
        };
        const error = () => {
          message.error('导入失败');
          this.setState({ modalExportVisible: true, submittingModal: false });
        };

        this.setState({ submittingModal: true });
        const payload = {
          faceUrl: JSON.stringify(
            exportList.map(({ name, url, dbUrl }) => ({ fileName: name, webUrl: url, dbUrl }))
          ),
          faceDatabase: faceDataBaseId,
        };
        dispatch({
          type: 'securityManage/fetchFaceExport',
          payload,
          success,
          error,
        });
      }
    });
  };

  // 人脸照片上传
  handleFaceUrlChange = ({ file, fileList }) => {
    const {
      form: { resetFields },
    } = this.props;
    const error = () => {
      // message.error('上传失败');
      resetFields(['faceUrl']);
    };
    if (file.status === 'uploading') {
      this.setState({ faceLoading: true });
    } else if (file.status === 'done') {
      if (file.response && file.response.code === 200) {
        const {
          data: {
            list: [result],
          },
        } = file.response;
        this.setState({
          uploadFace: [{ ...result, webUrl: result.webUrl, dbUrl: result.dbUrl }],
        });
      } else {
        error();
      }
      this.setState({ faceLoading: false });
    } else if (file.status === 'removed') {
      resetFields(['faceUrl']);
    } else {
      error();
    }
  };

  // 上传照片之前的回调
  handleBeforeCoverLoad = file => {
    const { faceLoading } = this.state;
    // 判断是否图片
    const isImage = file.type === 'image/jpeg';
    if (faceLoading) {
      message.error('尚未上传结束');
    }
    if (!isImage) {
      message.error('请上传jpg格式照片');
    }
    return isImage && !faceLoading;
  };

  // 区域动态加载
  handleLoadData = (keys, selectedOptions) => {
    const { dispatch } = this.props;
    const cityIds = selectedOptions.map(item => item.id).splice(0, 1);
    const newCityIds = cityIds.map(item => item).join(',');
    const targetOption = selectedOptions[selectedOptions.length - 1];

    targetOption.loading = true;
    dispatch({
      type: 'company/fetchArea',
      payload: {
        cityIds: newCityIds,
        keys,
      },
      success: () => {
        targetOption.loading = false;
      },
      error: msg => {
        message.error(msg, () => {
          targetOption.loading = false;
        });
      },
    });
  };

  // 渲染form表单
  renderForm() {
    const {
      form: { getFieldDecorator },
      securityManage: { sexList, documentTypeList },
      company: { registerAddress: provincial },
    } = this.props;

    const newProvincial = provincial.map(item => {
      const { children } = item;
      return {
        ...item,
        children: children
          ? children.map(child => {
              return {
                ...child,
                isLeaf: true,
              };
            })
          : null,
      };
    });

    return (
      <Card className={styles.formCard}>
        <Form className={styles.form}>
          <Row gutter={{ md: 24 }}>
            <Col xl={6} md={12} sm={24} xs={24}>
              <FormItem label={fieldLabels.name}>
                {getFieldDecorator('name')(<Input placeholder="请输入姓名" />)}
              </FormItem>
            </Col>
            <Col xl={6} md={12} sm={24} xs={24}>
              <FormItem label={fieldLabels.sex}>
                {getFieldDecorator('sex')(
                  <Select placeholder="请选择性别" allowClear>
                    {sexList.map(({ key, value }) => (
                      <Option value={key} key={key}>
                        {value}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col xl={6} md={12} sm={24} xs={24}>
              <FormItem label={fieldLabels.phone}>
                {getFieldDecorator('phone')(<Input placeholder="请输入手机号" />)}
              </FormItem>
            </Col>
            <Col xl={6} md={12} sm={24} xs={24}>
              <FormItem label={fieldLabels.jobNum}>
                {getFieldDecorator('jobNum')(<Input placeholder="请输入工号" />)}
              </FormItem>
            </Col>
            <Col xl={12} md={12} sm={24} xs={24}>
              <FormItem label={fieldLabels.provincialLevel}>
                {getFieldDecorator('province')(
                  <Cascader
                    options={newProvincial}
                    fieldNames={{
                      value: 'id',
                      label: 'name',
                      children: 'children',
                      isLeaf: 'isLeaf',
                    }}
                    loadData={selectedOptions => {
                      this.handleLoadData(['registerAddress'], selectedOptions);
                    }}
                    changeOnSelect
                    placeholder="请选择省级地市"
                    allowClear
                    getPopupContainer={getRootChild}
                  />
                )}
              </FormItem>
            </Col>
            <Col xl={6} md={12} sm={24} xs={24}>
              <FormItem label={fieldLabels.documentType}>
                {getFieldDecorator('doucumentType')(
                  <Select placeholder="请选择证件类型" allowClear>
                    {documentTypeList.map(({ key, value }) => (
                      <Option value={key} key={key}>
                        {value}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col xl={6} md={12} sm={24} xs={24}>
              <FormItem label={fieldLabels.documentNum}>
                {getFieldDecorator('doucumentNumber')(<Input placeholder="请输入证件号" />)}
              </FormItem>
            </Col>
            <Col xl={8} md={12} sm={24} xs={24}>
              <FormItem label={fieldLabels.birthStartTime}>
                {getFieldDecorator('startDate')(
                  <DatePicker
                    // showTime
                    showToday={false}
                    format="YYYY-MM-DD"
                    placeholder="请选择生日起始时间"
                    style={{ width: 260 }}
                  />
                )}
              </FormItem>
            </Col>
            <Col xl={8} md={12} sm={24} xs={24}>
              <FormItem label={fieldLabels.birthEndTime}>
                {getFieldDecorator('endDate')(
                  <DatePicker
                    // showTime
                    showToday={false}
                    format="YYYY-MM-DD"
                    placeholder="请选择生日截止时间"
                    style={{ width: 260 }}
                  />
                )}
              </FormItem>
            </Col>
            <Col xl={8} md={12} sm={24} xs={24}>
              <FormItem style={{ float: 'right' }}>
                <Button type="primary" onClick={this.handleClickToQuery}>
                  查询
                </Button>
                <Button onClick={this.handleClickToReset} style={{ marginLeft: 20 }}>
                  重置
                </Button>
              </FormItem>
            </Col>
            <Col xl={8} md={12} sm={24} xs={24}>
              <FormItem>
                <Button type="primary" onClick={this.handleExport}>
                  导入
                </Button>
                <Button
                  type="primary"
                  onClick={() => this.handleClickAdd('add')}
                  style={{ marginLeft: 20 }}
                >
                  添加
                </Button>
                {/* <Button onClick={this.handleClickAuto} style={{ float: 'right' }}>
                  同步数据
                </Button> */}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }

  // 渲染列表
  renderList() {
    const {
      securityManage: {
        faceData: { list = [] },
      },
    } = this.props;

    return (
      <div className={styles.cardList} style={{ marginTop: '24px' }}>
        <List
          styles={{ height: '258px' }}
          rowKey="id"
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={item => {
            const {
              id,
              faceDetails,
              faceName,
              faceType,
              faceTel,
              jobNumber,
              faceBirthday,
              identityCardType,
              identityCardNo,
              cityDetail,
              provinceDetail,
            } = item;
            const city = cityDetail ? cityDetail : '';
            const province = provinceDetail ? provinceDetail : '';
            return (
              <List.Item key={''}>
                <Card
                  className={styles.card}
                  actions={[
                    <span onClick={() => this.handleClickEdit('edit', item)}>编辑</span>,
                    <Popconfirm
                      title="删除数据将无法恢复，是否继续？"
                      onConfirm={() => this.handleCardDelete(id)}
                    >
                      <span>删除</span>
                    </Popconfirm>,
                  ]}
                >
                  <Row>
                    <Col span={10}>
                      <div
                        className={styles.imgConatiner}
                        style={{
                          background:
                            faceDetails.length > 0
                              ? `url(${faceDetails
                                  .map(item => item.webUrl)
                                  .join('')}) center center / 100% 100% no-repeat`
                              : `url(${pic}) center center / 100% 100% no-repeat`,
                        }}
                      />
                    </Col>
                    <Col span={13}>
                      <Ellipsis lines={1} tooltip className={styles.title}>
                        {faceName || getEmptyData()}
                      </Ellipsis>
                      <div className={styles.line}>
                        性别：
                        {sexList[faceType] || getEmptyData()}
                      </div>
                      <div className={styles.line}>
                        手机：
                        {faceTel || getEmptyData()}
                      </div>
                      <div className={styles.line}>
                        工号：
                        {jobNumber || getEmptyData()}
                      </div>
                      <div className={styles.line}>
                        生日：
                        {faceBirthday === null
                          ? getEmptyData()
                          : moment(faceBirthday).format('YYYY-MM-DD')}
                      </div>
                      <div className={styles.line}>
                        籍贯：
                        {province + city || getEmptyData()}
                      </div>
                      <div className={styles.line}>
                        {documentTypeList[identityCardType] || '未知'} :{' '}
                        {identityCardNo || getEmptyData()}
                      </div>
                    </Col>
                  </Row>
                </Card>
              </List.Item>
            );
          }}
        />
      </div>
    );
  }

  render() {
    const {
      loading,
      form: { getFieldDecorator },
      location: {
        query: { name },
      },
      securityManage: { isLast, sexList, documentTypeList },
      company: { registerAddress: provincial },
    } = this.props;

    const newProvincial = provincial.map(item => {
      const { children } = item;
      return {
        ...item,
        children: children
          ? children.map(child => {
              return {
                ...child,
                isLeaf: true,
              };
            })
          : null,
      };
    });

    const {
      modalVisible,
      modalTitle,
      modalExportVisible,
      faceLoading,
      uploadFace,
      exportList,
      exportLoading,
      submitting,
      submittingModal,
    } = this.state;
    const uploadButton = (
      <div>
        <LegacyIcon type={faceLoading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传</div>
      </div>
    );

    const uploadExportButton = <LegacyIcon type={exportLoading ? 'loading' : 'upload'} />;

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList} content={<div>{name}</div>}>
        <BackTop />
        {this.renderForm()}
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={() => {
            // 防止多次加载
            !loading && this.handleLoadMore();
          }}
          hasMore={!isLast}
          loader={
            <div className="loader" key={0}>
              {loading && (
                <div style={{ paddingTop: '50px', textAlign: 'center' }}>
                  <Spin />
                </div>
              )}
            </div>
          }
        >
          {this.renderList()}
        </InfiniteScroll>
        <Modal
          title={modalTitle}
          visible={modalVisible}
          onCancel={this.handleCloseForm}
          onOk={this.handleSubmitForm}
          className={styles.moadFormBody}
          confirmLoading={faceLoading || submitting}
        >
          <Form className={styles.modalForm}>
            <FormItem {...formItemLayout} label={fieldLabels.picArea}>
              {getFieldDecorator('faceUrl', {
                rules: [
                  { required: modalVisible === true ? true : false, message: '请上传jpg格式照片' },
                ],
              })(
                <Upload
                  name="files"
                  listType="picture-card"
                  headers={{ 'JA-Token': getToken() }}
                  accept=".jpg" // 接收的文件格式
                  data={{ folder: 'securityManageInfo' }} // 附带的参数
                  showUploadList={false}
                  action={uploadAction} // 上传地址
                  beforeUpload={this.handleBeforeCoverLoad}
                  onChange={this.handleFaceUrlChange}
                >
                  {uploadFace.length > 0 ? (
                    <img
                      src={uploadFace.map(item => item.webUrl).join('')}
                      alt="照片"
                      style={{ width: '100%' }}
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              )}
              <span style={{ color: 'red' }}>（只能上传 jpg格式照片）</span>
            </FormItem>

            <FormItem {...formItemLayout} label={fieldLabels.name}>
              {getFieldDecorator('faceName', {
                rules: [{ required: modalVisible === true ? true : false, message: '请输入姓名' }],
                getValueFromEvent: this.handleTrim,
              })(<Input placeholder="请输入姓名" />)}
            </FormItem>

            <FormItem {...formItemLayout} label={fieldLabels.sex}>
              {getFieldDecorator('faceType', {})(
                <Select placeholder="请选择性别" allowClear>
                  {sexList.filter(item => +item.key !== 0).map(({ key, value }) => (
                    <Option value={key} key={key}>
                      {value}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label={fieldLabels.birthTime}>
              {getFieldDecorator('faceBirthday', {})(
                <DatePicker
                  // showTime
                  showToday={false}
                  // format="YYYY-MM-DD"
                  placeholder="请选择生日时间"
                  style={{ width: 315 }}
                />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label={fieldLabels.provincialLevel}>
              {getFieldDecorator('provincial', {})(
                <Cascader
                  options={newProvincial}
                  fieldNames={{
                    value: 'id',
                    label: 'name',
                    children: 'children',
                    isLeaf: 'isLeaf',
                  }}
                  loadData={selectedOptions => {
                    this.handleLoadData(['registerAddress'], selectedOptions);
                  }}
                  changeOnSelect
                  placeholder="请选择省级地市"
                  allowClear
                  getPopupContainer={getRootChild}
                  popupClassName={styles.cascaderStyle}
                />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label={fieldLabels.phone}>
              {getFieldDecorator('faceTel', { getValueFromEvent: this.handleTrim })(
                <Input placeholder="请输入手机号" />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label={fieldLabels.jobNum}>
              {getFieldDecorator('jobNumber', { getValueFromEvent: this.handleTrim })(
                <Input placeholder="请输入工号" />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label={fieldLabels.documentType}>
              {getFieldDecorator('identityCardType', {})(
                <Select placeholder="请选择证件类型" allowClear>
                  {documentTypeList.filter(item => +item.key !== 0).map(({ key, value }) => (
                    <Option value={key} key={key}>
                      {value}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label={fieldLabels.documentNum}>
              {getFieldDecorator('identityCardNo', {})(<Input placeholder="请输入证件号" />)}
            </FormItem>
          </Form>
        </Modal>
        <Modal
          title="导入"
          visible={modalExportVisible}
          onCancel={this.handleCloseExport}
          onOk={this.handleExportSubmit}
          className={styles.modalExport}
          confirmLoading={exportLoading || submittingModal}
        >
          <Form className={styles.modalForm}>
            <FormItem {...formItemLayout} label={fieldLabels.picRouter}>
              {getFieldDecorator('photoMessage')(
                <Upload
                  name="files"
                  multiple
                  headers={{ 'JA-Token': getToken() }}
                  accept=".jpg" // 接收的文件格式
                  data={{ folder: 'securityManageInfo' }} // 附带的参数
                  action={uploadAction} // 上传地址
                  fileList={exportList}
                  onChange={this.handleFaceExportChange}
                >
                  <Button disabled={exportLoading}>
                    {uploadExportButton}
                    浏览
                  </Button>
                </Upload>
              )}
            </FormItem>
          </Form>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
