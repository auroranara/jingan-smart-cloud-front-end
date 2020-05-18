import { PureComponent, Fragment } from 'react';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Row,
  Col,
  Button,
  message,
  Input,
  Select,
  Card,
  Upload,
  Tooltip,
  Radio,
  Spin,
  TreeSelect,
  // AutoComplete,
} from 'antd';
import debounce from 'lodash/debounce';
import { connect } from 'dva';
import router from 'umi/router';

import styles from './CompanyList.less';
import styles1 from '@/components/ToolBar/index.less';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import { getToken } from '@/utils/authority';
import { phoneReg } from '@/utils/validate';
import { AuthA } from '@/utils/customAuth';
import { RedoOutlined } from '@ant-design/icons';
import codes from '@/utils/codes';
// import PIC from '@/assets/picExample.png';

const { TreeNode: TreeSelectNode } = TreeSelect;
const FormItem = Form.Item;
const { Option } = Select;

const PIC = 'http://data.jingan-china.cn/v2/chem/assets/picExample.png';
// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';
const colLayout = { lg: 8, md: 12, sm: 24 };
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const DEGREES = [
  { key: '0', label: '初中' },
  { key: '1', label: '高中' },
  { key: '2', label: '中专' },
  { key: '3', label: '大专' },
  { key: '4', label: '本科' },
  { key: '5', label: '硕士' },
  { key: '6', label: '博士' },
];

function treeData (data) {
  return data.map(item => {
    if (item.children) {
      return (
        <TreeSelectNode title={item.name || item.text} key={item.id} value={item.id}>
          {treeData(item.children)}
        </TreeSelectNode>
      );
    }
    return <TreeSelectNode title={item.name || item.text} key={item.id} value={item.id} />;
  });
}
@Form.create()
@connect(({ realNameCertification, user, department, postManagement, loading }) => ({
  realNameCertification,
  user,
  department,
  postManagement,
  submitting:
    loading.effects['realNameCertification/addPerson'] ||
    loading.effects['realNameCertification/editPerson'],
}))
export default class PersonnelAdd extends PureComponent {
  constructor(props) {
    super(props);
    this.handleICSearch = debounce(this.handleICSearch, 300);
    this.handleSNSearch = debounce(this.handleSNSearch, 300);
    this.state = {
      diplomaLoading: false, // 学历证书是否上传中
      photoLoading: false, // 人脸照片是否上传中
      // 详情
      detail: {
        photoDetails: [],
        educationCertificateDetails: [],
      },
      sexValue: '0', // 默认性别为男
      perType: '1', // 人员选择类型
      curCompanyName: '', // 当前单位
      curLabelList: [],
      postList: [], // 岗位列表
    };
  }

  componentDidMount () {
    const {
      dispatch,
      match: {
        params: { id },
      },
      location: {
        query: { companyId, companyName },
      },
      user: {
        currentUser: { unitType, companyName: routerCompanyName, companyId: unitCompantId },
      },
      form: { setFieldsValue },
    } = this.props;
    const { perType } = this.state;
    this.fetchDepartment();
    this.fetchPostList();
    this.setState({
      curCompanyName: unitType !== 4 ? companyName : routerCompanyName,
      curCompanyId: unitType !== 4 ? companyId : unitCompantId,
    });
    if (id) {
      // 如果编辑
      dispatch({
        type: 'realNameCertification/fetchDetail',
        payload: { id, pageNum: 1, pageSize: 0 },
        callback: detail => {
          this.setState({ detail, perType: detail.personType });
          const photoDetails = detail.photoDetails || [];
          const educationCertificateDetails = detail.educationCertificateDetails || [];
          setFieldsValue({
            photoDetails: photoDetails.map(item => ({
              ...item,
              uid: item.id,
              url: item.webUrl,
            })),
            educationCertificateDetails: educationCertificateDetails.map(item => ({
              ...item,
              uid: item.id,
              url: item.webUrl,
            })),
          });
          this.fetchTagCard(
            {
              companyId: companyId || unitCompantId,
              personType: detail.personType,
              status: 1,
            },
            res => {
              const { list } = res.data;
              this.setState({ curLabelList: list });
            }
          );
        },
      });
    } else {
      this.fetchTagCard(
        { companyId: companyId || unitCompantId, status: 1, personType: perType },
        res => {
          const { list } = res.data;
          this.setState({ curLabelList: list });
        }
      );
    }
  }

  // 提交
  handleSubmit = () => {
    const {
      dispatch,
      match: {
        params: { id },
      },
      form: { validateFieldsAndScroll },
      location: {
        query: { companyId },
      },
    } = this.props;
    const { diplomaLoading, detail, photoLoading, curCompanyName } = this.state;
    if (diplomaLoading || photoLoading) {
      message.warning('上传暂未结束');
      return;
    }
    const tag = id ? '编辑' : '新增';
    const callback = (success, msg) => {
      if (success) {
        message.success(`${tag}人员成功`);
        router.push(
          `/real-name-certification/personnel-management/person-list/${companyId}?companyName=${curCompanyName}`
        );
      } else {
        message.error(msg || `${tag}人员失败`);
      }
    };
    validateFieldsAndScroll((err, values) => {
      if (err) return;
      if (!companyId) return;
      const { icnumber, entranceNumber, ...resValues } = values;
      const payload = {
        ...resValues,
        icnumber: icnumber ? icnumber.label : undefined,
        entranceNumber: entranceNumber ? entranceNumber.label : undefined,
        companyId,
      };
      if (id) {
        // 如果编辑
        dispatch({
          type: 'realNameCertification/editPerson',
          payload: { ...payload, id, employeeId: detail.employeeId },
          callback,
        });
      } else {
        dispatch({
          type: 'realNameCertification/addPerson',
          payload,
          callback,
        });
      }
    });
  };

  // 上传人脸招联前的回调
  handleBeforeUploadPhoto = file => {
    const { photoLoading } = this.state;
    // 判断是否图片
    const isImage = file.type === 'image/jpeg' || file.type === 'image/png';
    if (photoLoading) {
      message.error('尚未上传结束');
    }
    if (!isImage) {
      message.error('请上传jpg格式照片');
    }
    return isImage && !photoLoading;
  };

  // 上传人脸招联前的回调
  handleBeforeUploadDiploma = file => {
    const { diplomaLoading } = this.state;
    // 判断是否图片
    const isImage = file.type === 'image/jpeg' || file.type === 'image/png';
    if (diplomaLoading) {
      message.error('尚未上传结束');
    }
    if (!isImage) {
      message.error('请上传jpg格式照片');
    }
    return isImage && !diplomaLoading;
  };

  // 人脸照片上传
  handlePhotoUploadChange = ({ file, fileList }) => {
    const {
      form: { setFieldsValue },
    } = this.props;
    const error = () => {
      this.setState({ photoLoading: false });
      setFieldsValue({ photoDetails: [] });
    };
    if (file.status === 'uploading') {
      this.setState({ photoLoading: true });
      setFieldsValue({ photoDetails: fileList });
    } else if (file.status === 'done') {
      if (file.response && file.response.code === 200) {
        const {
          data: {
            list: [result],
          },
        } = file.response;
        setFieldsValue({
          photoDetails: fileList.map(item => {
            if (!item.url && item.response) {
              return {
                ...result,
                uid: item.uid,
                url: result.webUrl,
              };
            }
            return item;
          }),
        });
      } else {
        error();
      }
      this.setState({ photoLoading: false });
    } else if (file.status === 'removed') {
      setFieldsValue({
        photoDetails: fileList.filter(item => {
          return item.status !== 'removed';
        }),
      });
      this.setState({ photoLoading: false });
    } else {
      error();
    }
  };

  /* 去除左右两边空白 */
  handleTrim = e => e.target.value.trim();

  // 学历证书上传
  handleDiplomaUploadChange = ({ file, fileList }) => {
    const {
      form: { resetFields, setFieldsValue },
    } = this.props;
    const error = () => {
      resetFields(['educationCertificateDetails']);
    };
    if (file.status === 'uploading') {
      this.setState({ diplomaLoading: true });
    } else if (file.status === 'done') {
      if (file.response && file.response.code === 200) {
        const {
          data: {
            list: [result],
          },
        } = file.response;
        setFieldsValue({
          educationCertificateDetails: [{ ...result, webUrl: result.webUrl, dbUrl: result.dbUrl }],
        });
      } else {
        error();
      }
      this.setState({ diplomaLoading: false });
    } else if (file.status === 'removed') {
      resetFields(['educationCertificateDetails']);
    } else {
      error();
    }
  };

  handleSexTypeChange = i => {
    this.setState({ sexValue: i });
  };

  // 获取部门列表
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

  // 获取岗位列表
  fetchPostList = () => {
    const {
      dispatch,
      location: {
        query: { companyId },
      },
    } = this.props;
    dispatch({
      type: 'postManagement/fetchPostList',
      payload: { companyId, pageNum: 1, pageSize: 0 },
      callback: (data) => {
        this.setState({ postList: data && Array.isArray(data.list) ? data.list : [] });
      },
    });
  };

  handlePersonType = id => {
    const {
      form: { setFieldsValue },
    } = this.props;
    const { curCompanyId } = this.state;
    this.setState({ perType: id });
    setFieldsValue({ personCompany: undefined, icnumber: undefined, entranceNumber: undefined });
    this.fetchTagCard({ companyId: curCompanyId, status: 1, personType: id }, res => {
      const { list } = res.data;
      this.setState({ curLabelList: list });
    });
  };

  // 获取标签卡列表
  fetchTagCard = ({ ...params }, callback) => {
    const { dispatch } = this.props;
    // 根据输入值获取列表
    dispatch({
      type: 'realNameCertification/fetchTagCardList',
      payload: {
        ...params,
        pageNum: 1,
        pageSize: 30,
        personCar: 1,
      },
      callback,
    });
  };

  handleICSearch = value => {
    const { curCompanyId, perType } = this.state;
    // 根据输入值获取列表
    this.fetchTagCard(
      { icNumber: value && value.trim(), companyId: curCompanyId, status: 1, personType: perType },
      res => {
        const { list } = res.data;
        this.setState({ curLabelList: list });
      }
    );
  };

  handleICChange = value => {
    const {
      form: { setFieldsValue },
    } = this.props;
    const { curLabelList } = this.state;
    if (value === undefined) {
      this.handleICSearch();
      setFieldsValue({
        icnumber: undefined,
        entranceNumber: undefined,
      });
    } else {
      const sn = curLabelList.find(item => item.id === value.key).snNumber;
      const snId = curLabelList.find(item => item.id === value.key).id;
      setFieldsValue({
        entranceNumber: { key: snId, label: sn },
      });
    }
  };

  handleSNSearch = value => {
    const { curCompanyId, perType } = this.state;
    // 根据输入值获取列表
    this.fetchTagCard(
      { snNumber: value && value.trim(), companyId: curCompanyId, status: 1, personType: perType },
      res => {
        const { list } = res.data;
        this.setState({ curLabelList: list });
      }
    );
  };

  handleSNChange = value => {
    const {
      form: { setFieldsValue },
    } = this.props;
    const { curLabelList } = this.state;
    // 根据value判断是否是手动输入
    if (value === undefined) {
      this.handleSNSearch();
      setFieldsValue({
        icnumber: undefined,
        entranceNumber: undefined,
      });
    } else {
      const ic = curLabelList.find(item => item.id === value.key).icNumber;
      const icId = curLabelList.find(item => item.id === value.key).id;
      setFieldsValue({
        icnumber: { key: icId, label: ic },
      });
    }
  };

  render () {
    const {
      loading,
      submitting, // 提交状态
      match: {
        params: { id },
      },
      location: {
        query: { companyName: routerCompanyName, companyId },
      },
      user: {
        currentUser: { companyName },
      },
      department: {
        data: { list: departmentList = [] },
      },
      form: { getFieldDecorator, getFieldValue },
      realNameCertification: { personTypeDict },
    } = this.props;
    const treeList = treeData(departmentList);

    const { photoLoading, sexValue, detail, diplomaLoading, curLabelList, perType, postList } = this.state;
    const educationCertificateDetails = getFieldValue('educationCertificateDetails') || [];
    const photoDetails = getFieldValue('photoDetails') || [];
    // console.log('detail', detail);
    const title = id ? '编辑人员信息' : '新增人员信息';
    const hasCompanyName = perType === '1';
    const noCompanyName = perType === '2' || perType === '3';
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
      {
        title: '人员管理',
        name: '人员管理',
        href: `/real-name-certification/personnel-management/person-list/${companyId}?companyName=${routerCompanyName ||
          companyName}`,
      },
      {
        title,
        name: title,
      },
    ];
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        <Card title="基本信息">
          <Form layout="horizontal">
            <Row gutter={16}>
              <Col {...colLayout}>
                <FormItem label="姓名" {...formItemLayout}>
                  {getFieldDecorator('name', {
                    initialValue: id ? detail.name : undefined,
                    getValueFromEvent: this.handleTrim,
                    rules: [{ required: true, message: '请输入姓名' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem label="职工号" {...formItemLayout}>
                  {getFieldDecorator('workerNumber', {
                    getValueFromEvent: this.handleTrim,
                    initialValue: id ? detail.workerNumber : undefined,
                  })(<Input placeholder="请输入" maxLength={10} />)}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem label="性别" {...formItemLayout}>
                  {getFieldDecorator('sex', {
                    initialValue: id ? detail.sex : sexValue,
                    //rules: [{ required: true, message: '请选择性别' }],
                  })(
                    <Radio.Group onChange={this.handleSexTypeChange} buttonStyle="solid">
                      <Radio.Button value="0">男</Radio.Button>
                      <Radio.Button value="1">女</Radio.Button>
                    </Radio.Group>
                  )}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem label="手机号" {...formItemLayout}>
                  {getFieldDecorator('telephone', {
                    initialValue: id ? detail.telephone : undefined,
                    getValueFromEvent: this.handleTrim,
                    rules: [
                      { whitespace: true },
                      { pattern: phoneReg, message: '联系电话格式不正确' },
                    ],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem label="人员类型" {...formItemLayout}>
                  {getFieldDecorator('personType', {
                    initialValue: id ? detail.personType : perType,
                    rules: [{ required: true, message: '请选择人员类型' }],
                  })(
                    <Select placeholder="请选择" onSelect={this.handlePersonType}>
                      {personTypeDict.map(({ key, value }) => (
                        <Select.Option key={key} value={key}>
                          {value}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              {hasCompanyName && (
                <Fragment>
                  <Col {...colLayout}>
                    <FormItem label="部门" {...formItemLayout}>
                      {getFieldDecorator('partId', {
                        initialValue: id ? detail.partId : undefined,
                      })(
                        <TreeSelect
                          allowClear
                          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                          placeholder="请选择所属部门"
                        >
                          {treeList}
                        </TreeSelect>
                      )}
                    </FormItem>
                  </Col>
                  <Col {...colLayout}>
                    <FormItem label="岗位" {...formItemLayout}>
                      {getFieldDecorator('companyJob', {
                        initialValue: id ? detail.companyJob : undefined,
                        // rules: [{ required: true, message: '请选择岗位' }],
                      })(
                        <Select
                          placeholder="请选择岗位"
                          allowClear
                          notFoundContent={(
                            <div>
                              <span style={{ marginRight: '1em' }}>暂无数据</span>
                              <AuthA
                                style={{ marginRight: '1em' }}
                                code={codes.personnelManagement.postManagement.view}
                                onClick={() => { window.open(`${window.publicPath}#/personnel-management/post-management/${companyId}/list`, `_blank`) }}>
                                去新增岗位
                              </AuthA>
                              <RedoOutlined
                                onClick={() => { this.fetchPostList() }}
                                style={{ color: '#1890ff', cursor: 'pointer' }}
                              />
                            </div>
                          )}
                        >
                          {postList.map(({ id, jobName }) => (
                            <Select.Option key={id} value={id}>
                              {jobName}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Fragment>
              )}
              {noCompanyName && (
                <Col {...colLayout}>
                  <FormItem label="单位名称" {...formItemLayout}>
                    {getFieldDecorator('personCompany', {
                      getValueFromEvent: this.handleTrim,
                      initialValue: id ? detail.personCompany : undefined,
                      rules: [{ required: true, message: '请输入单位名称' }],
                    })(<Input placeholder="请输入" />)}
                  </FormItem>
                </Col>
              )}
            </Row>
          </Form>
        </Card>
        <Card title="卡号信息" style={{ marginTop: 5 }}>
          <Form layout="horizontal" className={styles1.form}>
            <Row gutter={16}>
              <Col {...colLayout}>
                <FormItem
                  label={
                    <span>
                      IC卡号&nbsp;
                      <Tooltip title="门禁">
                        <LegacyIcon style={{ color: '#1890ff' }} type="question-circle" />
                      </Tooltip>
                    </span>
                  }
                  {...formItemLayout}
                >
                  {getFieldDecorator('icnumber', {
                    initialValue: id ? { key: detail.lableId, label: detail.icnumber } : undefined,
                  })(
                    <Select
                      allowClear
                      showSearch
                      labelInValue
                      showArrow={false}
                      filterOption={false}
                      placeholder="请选择IC卡号"
                      notFoundContent={loading ? <Spin size="small" /> : '暂无数据'}
                      onSearch={this.handleICSearch}
                      onChange={this.handleICChange}
                    >
                      {curLabelList.map(({ icNumber, id }) => (
                        <Option value={id} key={id}>
                          {icNumber}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem
                  label={
                    <span>
                      SN卡号&nbsp;
                      <Tooltip title="人员定位使用">
                        <LegacyIcon style={{ color: '#1890ff' }} type="question-circle" />
                      </Tooltip>
                    </span>
                  }
                  {...formItemLayout}
                >
                  {getFieldDecorator('entranceNumber', {
                    initialValue: id
                      ? { key: detail.lableId, label: detail.entranceNumber }
                      : undefined,
                  })(
                    <Select
                      allowClear
                      showSearch
                      labelInValue
                      showArrow={false}
                      filterOption={false}
                      placeholder="请选择SN卡号"
                      notFoundContent={loading ? <Spin size="small" /> : '暂无数据'}
                      onSearch={this.handleSNSearch}
                      onChange={this.handleSNChange}
                    >
                      {curLabelList.map(({ snNumber, id }) => (
                        <Option value={id} key={id}>
                          {snNumber}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={24} className={styles.lableLayout}>
                <FormItem
                  style={{ marginLeft: '2%' }}
                  label={
                    <span>
                      人脸照&nbsp;&nbsp;
                      <span className={styles.labelColor}>
                        （确保照片是正脸，且足够清晰，最多3张同一人员注册照）
                      </span>
                    </span>
                  }
                >
                  {getFieldDecorator('photoDetails', {
                    //rules: [{ validator: this.validatePhoto }],
                  })(
                    <Fragment>
                      <div className={styles.uploadStyle}>
                        <Upload
                          name="files"
                          listType="picture-card"
                          headers={{ 'JA-Token': getToken() }}
                          accept=".jpg,.png" // 接收的文件格式
                          data={{ folder: 'realName' }} // 附带的参数
                          fileList={photoDetails}
                          action={uploadAction} // 上传地址
                          beforeUpload={this.handleBeforeUploadPhoto}
                          onChange={this.handlePhotoUploadChange}
                        >
                          {photoDetails.length < 3 ? (
                            <div>
                              <LegacyIcon type={photoLoading ? 'loading' : 'plus'} />
                              <div className="ant-upload-text">上传</div>
                            </div>
                          ) : null}
                        </Upload>
                        {/* <div className={styles.labelColor}>
                          <div className={styles.labelFirst}>照片命名示例:</div>
                          <div>姓名_ID卡号</div>
                          <div className={styles.labelSecond}>张三_FF000000011B</div>
                        </div> */}
                      </div>
                    </Fragment>
                  )}
                </FormItem>
              </Col>
              <Col span={24} className={styles.lableLayout}>
                <FormItem label="注册照片示例" style={{ marginLeft: '2%' }}>
                  <Fragment>
                    <img src={PIC} width="450px" height="100px" alt="" />
                    <div className={styles.labelColor} style={{ width: '450px', lineHeight: '2em', marginTop: '10px' }}>
                      照片要求：1.小于400K；2.面部区域像素不低于128x128，人脸大小占整张照片1/3以上；3.确保所有注册人员为同一人员，否则无法成功注册
                    </div>
                  </Fragment>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="学历信息" style={{ marginTop: 5 }}>
          <Form layout="horizontal">
            <Row gutter={16}>
              <Col {...colLayout}>
                <FormItem label="学历" {...formItemLayout}>
                  {getFieldDecorator('education', {
                    initialValue: id ? detail.education : undefined,
                  })(
                    <Select placeholder="请选择" allowClear>
                      {DEGREES.map(({ key, label }) => (
                        <Select.Option value={key} key={key}>
                          {label}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem label="学历证书" {...formItemLayout}>
                  {getFieldDecorator('educationCertificateDetails')(
                    <Fragment>
                      <Upload
                        name="files"
                        listType="picture-card"
                        headers={{ 'JA-Token': getToken() }}
                        accept=".jpg,.png" // 接收的文件格式
                        data={{ folder: 'realName' }} // 附带的参数
                        showUploadList={false}
                        action={uploadAction} // 上传地址
                        beforeUpload={this.handleBeforeUploadDiploma}
                        onChange={this.handleDiplomaUploadChange}
                      >
                        {educationCertificateDetails && educationCertificateDetails.length > 0 ? (
                          <img
                            src={educationCertificateDetails.map(item => item.webUrl).join('')}
                            alt="照片"
                            style={{ width: '86px', height: '86px', objectFit: 'contain' }}
                          />
                        ) : (
                            <div>
                              <LegacyIcon type={diplomaLoading ? 'loading' : 'plus'} />
                              <div className="ant-upload-text">上传</div>
                            </div>
                          )}
                      </Upload>
                    </Fragment>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div style={{ textAlign: 'center' }}>
            <Button
              onClick={() => {
                router.goBack();
              }}
              style={{ marginRight: '24px' }}
            >
              返回
            </Button>
            <Button disabled={submitting} type="primary" onClick={this.handleSubmit}>
              {submitting && <LegacyIcon type="loading" />}
              提交
            </Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
