import { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Button,
  Form,
  Input,
  Select,
  Upload,
  DatePicker,
  Icon,
  message,
} from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import urls from '@/utils/urls';
import titles from '@/utils/titles';
import router from 'umi/router';
import { getToken } from '@/utils/authority';
import moment from 'moment';
import { phoneReg } from '@/utils/validate';
// 选择单位弹窗
import CompanyModal from '@/pages/BaseInfo/Company/CompanyModal';

const FormItem = Form.Item;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const {
  home: homeUrl,
  baseInfo: {
    specialEquipmentOperators: { list: listUrl },
  },
} = urls;

const {
  home: homeTitle,
  specialEquipmentOperators: { menu: menuTitle, list: listTitle },
} = titles;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const itemStyles = { style: { width: 'calc(70%)', marginRight: '10px' } };
/* root下的div */
const getRootChild = () => document.querySelector('#root>div');
// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';

@Form.create()
@connect(({ baseInfo, sensor, loading }) => ({
  baseInfo,
  sensor,
  companyLoading: loading.effects['sensor/fetchModelList'], // 单位列表加载状态
}))
export default class SpecialEquipmentOperatorsHandle extends PureComponent {

  state = {
    frontPhotoList: [], // 操作证正面
    backPhotoList: [], // 操作证反面
    forntLoading: false,
    backLoading: false,
    selectedCompany: {}, // 选中的单位 { id, name }
    companyModalVisible: false, // 选择单位弹窗是否可见
    detail: {}, // 详情
    workProjectOptions: [], // 作业项目选项
    workTypeOptions: [], // 作业种类
  }

  componentDidMount () {
    const {
      dispatch,
      match: { params: { id } },
      form: { setFieldsValue },
    } = this.props;
    // 获取作业项目
    this.fetchDict({
      payload: { type: 'workProject', parentId: 0 },
      callback: list => { this.setState({ workTypeOptions: list }) },
    })
    if (id) {
      // 如果编辑
      dispatch({
        type: 'baseInfo/fetchSpecialEquipPerson',
        payload: { id, pageNum: 1, pageSize: 10 },
        callback: ({ list }) => {
          const detail = list[0] || {};
          const { workType, companyId, companyName, certificatePositiveFileList, certificateReverseFileList } = detail;
          this.setState({
            detail,
            selectedCompany: { id: companyId, name: companyName },
            frontPhotoList: Array.isArray(certificatePositiveFileList) ? certificatePositiveFileList.map(item => ({
              ...item,
              uid: item.id,
              url: item.webUrl,
              name: item.fileName,
            })) : [],
            backPhotoList: Array.isArray(certificateReverseFileList) ? certificateReverseFileList.map(item => ({
              ...item,
              uid: item.id,
              url: item.webUrl,
              name: item.fileName,
            })) : [],
          });
          // 获取作业项目选项
          workType && this.fetchDict({
            payload: { type: 'workProject', parentId: workType },
            callback: list => { this.setState({ workProjectOptions: list }) },
          });
          setFieldsValue({ companyId });
        },
      })
    }
  }

  /**
  * 获取企业列表（弹窗）
  */
  fetchCompany = actions => {
    const { dispatch } = this.props;
    dispatch({ type: 'sensor/fetchModelList', ...actions });
  };

  // 获取字典
  fetchDict = actions => {
    const { dispatch } = this.props;
    dispatch({
      type: 'baseInfo/fetchDict',
      ...actions,
    })
  }

  /**
   * 打开选择单位弹窗
   */
  handleViewCompanyModal = () => {
    this.setState({ companyModalVisible: true });
    this.fetchCompany({
      payload: {
        pageSize: 10,
        pageNum: 1,
      },
    });
  };

  /**
   * 选择企业
   */
  handleSelectCompany = selectedCompany => {
    const {
      form: { setFieldsValue },
    } = this.props;
    const companyId = selectedCompany.id
    this.setState({ selectedCompany, companyModalVisible: false });
    setFieldsValue({ companyId });
  };


  // 作业种类改变
  handleWorkTypeChange = (workType) => {
    const { form: { setFieldsValue } } = this.props;
    if (workType) {
      this.fetchDict({
        payload: { type: 'workProject', parentId: workType },
        callback: list => { this.setState({ workProjectOptions: list }) },
      })
    } else this.setState({ workProjectOptions: [] });
    setFieldsValue({ workProject: undefined })
  }

  getTime = obj => obj ? obj.startOf('day').unix() * 1000 : obj

  /**
   * 提交表单
   */
  handleSubmit = () => {
    const {
      dispatch,
      form: { validateFields },
      match: { params: { id } },
    } = this.props;
    const { frontPhotoList, backPhotoList } = this.state;
    validateFields((err, values) => {
      if (err) return;
      const { effectiveDate, birthday, firstDate, reviewDate, ...resValues } = values;
      const [startDate, endDate] = effectiveDate;
      const payload = {
        ...resValues,
        startDate: this.getTime(startDate),
        endDate: endDate ? endDate.endOf('day').unix() * 1000 : endDate,
        birthday: this.getTime(birthday),
        firstDate: this.getTime(firstDate),
        reviewDate: this.getTime(reviewDate),
        certificatepositiveFile: frontPhotoList && frontPhotoList.length ? JSON.stringify(frontPhotoList) : '',
        certificatereverseFile: backPhotoList && backPhotoList.length ? JSON.stringify(backPhotoList) : '',
      };
      const tag = id ? '编辑' : '新增';
      const success = () => {
        message.success(`${tag}成功`);
        router.push(listUrl);
      };
      const error = res => { message.error(res ? res.msg : `${tag}失败`) };
      if (id) {
        dispatch({
          type: 'baseInfo/editSpecialEquipPerson',
          payload: { ...payload, id },
          success,
          error,
        })
      } else {
        dispatch({
          type: 'baseInfo/addSpecialEquipPerson',
          payload,
          success,
          error,
        })
      }
    })
  }
  handleFrontChange = ({ file, fileList }) => {
    if (file.status === 'uploading') {
      this.setState({ forntLoading: true, frontPhotoList: fileList })
    } else if (file.status === 'done') {
      if (file.response && file.response.code === 200) {
        const result = file.response.data.list[0]
        const list = fileList.map((item, index) => {
          if (index === fileList.length - 1) {
            return {
              ...result,
              uid: item.uid,
              url: result.webUrl,
              name: result.fileName,
            }
          } else return item
        })
        this.setState({
          forntLoading: false,
          frontPhotoList: list,
        })
      } else {
        message.error('上传失败！');
        this.setState({
          frontPhotoList: fileList.filter(item => {
            return !item.response || item.response.code !== 200;
          }),
        });
      }
      this.setState({
        forntLoading: false,
      });
    } else if (file.status === 'removed') {
      // 删除
      this.setState({
        frontPhotoList: fileList.filter(item => {
          return item.status !== 'removed';
        }),
        forntLoading: false,
      });
    } else {
      message.error('上传失败')
      this.setState({ forntLoading: false })
    }
  };

  handleBackChange = ({ file, fileList }) => {
    if (file.status === 'uploading') {
      this.setState({ backLoading: true, backPhotoList: fileList })
    } else if (file.status === 'done') {
      if (file.response && file.response.code === 200) {
        const result = file.response.data.list[0]
        const list = fileList.map((item, index) => {
          if (index === fileList.length - 1) {
            return {
              ...result,
              uid: item.uid,
              url: result.webUrl,
              name: result.fileName,
            }
          } else return item
        })
        this.setState({
          backLoading: false,
          backPhotoList: list,
        })
      } else {
        message.error('上传失败！');
        this.setState({
          backPhotoList: fileList.filter(item => {
            return !item.response || item.response.code !== 200;
          }),
        });
      }
      this.setState({
        backLoading: false,
      });
    } else if (file.status === 'removed') {
      // 删除
      this.setState({
        backPhotoList: fileList.filter(item => {
          return item.status !== 'removed';
        }),
        backLoading: false,
      });
    } else {
      message.error('上传失败')
      this.setState({ backLoading: false })
    }
  }

  /**
   * 渲染表单
   */
  renderForm = () => {
    const {
      match: { params: { id } },
      form: { getFieldDecorator },
    } = this.props
    const {
      frontPhotoList,
      backPhotoList,
      selectedCompany,
      forntLoading,
      backLoading,
      detail,
      workProjectOptions,
      workTypeOptions,
    } = this.state
    return (
      <Card>
        <Form>
          <FormItem label="单位名称" {...formItemLayout}>
            {getFieldDecorator('companyId', {
              rules: [{ required: true, message: '请选择单位' }],
            })(
              <Fragment>
                <Input value={selectedCompany.name} {...itemStyles} disabled placeholder="请选择" />
                <Button onClick={this.handleViewCompanyModal} type="primary">选择单位</Button>
              </Fragment>
            )}
          </FormItem>
          <FormItem label="姓名" {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: id ? detail.name : undefined,
              rules: [{ required: true, message: '请输入' }],
            })(
              <Input placeholder="请输入" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="性别" {...formItemLayout}>
            {getFieldDecorator('sex', {
              initialValue: id ? detail.sex : undefined,
              rules: [{ required: true, message: '请选择性别' }],
            })(
              <Select placeholder="请选择" {...itemStyles}>
                {[{ key: '1', label: '男' }, { key: '2', label: '女' }].map(({ key, label }) => (
                  <Select.Option key={key} label={label}>{label}</Select.Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="出生年月" {...formItemLayout}>
            {getFieldDecorator('birthday', {
              initialValue: id && detail.birthday ? moment(detail.birthday) : undefined,
              rules: [{ required: true, message: '请选择出生年月' }],
            })(
              <DatePicker
                placeholder="请选择"
                getCalendarContainer={getRootChild}
              />
            )}
          </FormItem>
          <FormItem label="联系电话" {...formItemLayout}>
            {getFieldDecorator('telephone', {
              initialValue: id ? detail.telephone : undefined,
              rules: [
                { required: true, message: '请输入联系电话' },
                { pattern: phoneReg, message: '联系电话格式不正确' },
              ],
            })(
              <Input placeholder="请输入" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="作业种类" {...formItemLayout}>
            {getFieldDecorator('workType', {
              initialValue: id ? detail.workType : undefined,
              rules: [{ required: true, message: '请选择作业种类' }],
            })(
              <Select placeholder="请选择" {...itemStyles} onChange={this.handleWorkTypeChange}>
                {workTypeOptions.map(({ id, label }) => (
                  <Select.Option key={id} value={id}>{label}</Select.Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="作业项目" {...formItemLayout}>
            {getFieldDecorator('workProject', {
              initialValue: id ? detail.workProject : undefined,
              rules: [{ required: true, message: '请选择作业项目' }],
            })(
              <Select placeholder="请选择" {...itemStyles}>
                {workProjectOptions.map(({ id, label }) => (
                  <Select.Option key={id} value={id}>{label}</Select.Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="连续从事本工作时间" {...formItemLayout}>
            {getFieldDecorator('contineWorktime', {
              initialValue: id ? detail.contineWorktime : undefined,
            })(
              <Input placeholder="请输入" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="准操项目" {...formItemLayout}>
            {getFieldDecorator('mustholdProject', {
              initialValue: id ? detail.mustholdProject : undefined,
              rules: [{ required: true, message: '请输入准操项目' }],
            })(
              <TextArea rows={5} placeholder="请输入" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="作业人员证证号" {...formItemLayout}>
            {getFieldDecorator('operapersonNumber', {
              initialValue: id ? detail.mustholdProject : undefined,
              rules: [{ required: true, message: '请输入作业人员证证号' }],
            })(
              <Input placeholder="请输入" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="初领日期" {...formItemLayout}>
            {getFieldDecorator('firstDate', {
              initialValue: id && detail.firstDate ? moment(detail.firstDate) : undefined,
            })(
              <DatePicker
                placeholder="请选择"
                getCalendarContainer={getRootChild}
              />
            )}
          </FormItem>
          <FormItem label="有效日期" {...formItemLayout}>
            {getFieldDecorator('effectiveDate', {
              initialValue: id ? [moment(detail.startDate), moment(detail.endDate)] : undefined,
              rules: [{ required: true, message: '请选择有效日期' }],
            })(
              <RangePicker
                getCalendarContainer={getRootChild}
              />
            )}
          </FormItem>
          <FormItem label="复审日期" {...formItemLayout}>
            {getFieldDecorator('reviewDate', {
              initialValue: id && detail.reviewDate ? moment(detail.reviewDate) : undefined,
            })(
              <DatePicker
                placeholder="请选择"
                getCalendarContainer={getRootChild}
              />
            )}
          </FormItem>
          <FormItem label="证件正面附件" {...formItemLayout}>
            {getFieldDecorator('certificatepositiveFile')(
              <Fragment>
                <Upload
                  name="files"
                  headers={{ 'JA-Token': getToken() }}
                  accept="image/*" // 接收的文件格式
                  data={{ folder: 'securityManageInfo' }} // 附带的参数
                  action={uploadAction}
                  fileList={frontPhotoList}
                  onChange={this.handleFrontChange}
                >
                  <Button>
                    <Icon type={forntLoading ? 'loading' : "upload"} />
                    点击上传
                </Button>
                </Upload>
              </Fragment>
            )}
          </FormItem>
          <FormItem label="证件反面附件" {...formItemLayout}>
            {getFieldDecorator('certificatereverseFile')(
              <Fragment>
                <Upload
                  name="files"
                  headers={{ 'JA-Token': getToken() }}
                  accept="image/*" // 接收的文件格式
                  data={{ folder: 'securityManageInfo' }} // 附带的参数
                  action={uploadAction}
                  fileList={backPhotoList}
                  onChange={this.handleBackChange}
                >
                  <Button>
                    <Icon type={backLoading ? 'loading' : "upload"} />
                    点击上传
                </Button>
                </Upload>
              </Fragment>
            )}
          </FormItem>
        </Form>
      </Card>
    )
  }

  render () {
    const {
      companyLoading,
      match: { params: { id } },
      sensor: { companyModal }, // companyModal { list , pagination:{} }
    } = this.props;
    const { companyModalVisible } = this.state;
    const title = id ? "编辑特种设备作业人员" : "新增特种设备作业人员"
    const breadcrumbList = [
      {
        title: homeTitle,
        name: homeTitle,
        href: homeUrl,
      },
      {
        title: menuTitle,
        name: menuTitle,
      },
      {
        title: listTitle,
        name: listTitle,
        href: listUrl,
      },
      {
        title,
        name: title,
      },
    ];
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        {this.renderForm()}
        <Button style={{ marginLeft: '50%', transform: 'translateX(-50%)', marginTop: '24px' }} type="primary" onClick={this.handleSubmit}>提交</Button>
        {/* 选择企业弹窗 */}
        <CompanyModal
          title="选择单位"
          loading={companyLoading}
          visible={companyModalVisible}
          modal={companyModal}
          fetch={this.fetchCompany}
          onSelect={this.handleSelectCompany}
          onClose={() => {
            this.setState({ companyModalVisible: false });
          }}
        />
      </PageHeaderLayout>
    )
  }
}
