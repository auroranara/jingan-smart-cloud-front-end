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
  Cascader,
  message,
} from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import urls from '@/utils/urls';
import { getToken } from '@/utils/authority';
import titles from '@/utils/titles';
import router from 'umi/router';
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
    specialoPerationPermit: { list: listUrl },
  },
} = urls;

const {
  home: homeTitle,
  specialoPerationPermit: { menu: menuTitle, list: listTitle },
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
export default class SpecialoPerationPermitHandle extends PureComponent {
  state = {
    frontPhotoList: [], // 操作证正面
    backPhotoList: [], // 操作证反面
    forntLoading: false,
    backLoading: false,
    operationCategory: [], // 作业类别选项
    selectedCompany: {}, // 选中的单位 { id, name }
    companyModalVisible: false, // 选择单位弹窗是否可见
    detail: {}, // 详情
  };

  componentDidMount () {
    const {
      dispatch,
      match: { params: { id } },
      form: { setFieldsValue },
    } = this.props
    // 获取作业类别
    this.fetchOperationCategory({
      payload: { type: 'workType', parentId: 0 },
      callback: list => {
        this.setState({ operationCategory: this.generateOperationCategory(list) })
      },
    })
    if (id) {
      // 如果编辑
      dispatch({
        type: 'baseInfo/fetchSpecialWorkPerson',
        payload: { id, pageNum: 1, pageSize: 10 },
        callback: ({ list }) => {
          const detail = list[0] || {};
          const { companyId, companyName, certificatePositiveFileList, certificateReverseFileList } = detail;
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
          })
          setFieldsValue({ companyId })
        },
      })
    }
  }

  // 获取作业类别
  fetchOperationCategory = actions => {
    const { dispatch } = this.props;
    dispatch({
      type: 'baseInfo/fetchOperationCategory',
      ...actions,
    })
  }

  /**
  * 获取企业列表（弹窗）
  */
  fetchCompany = actions => {
    const { dispatch } = this.props;
    dispatch({ type: 'sensor/fetchModelList', ...actions });
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

  getTime = obj => obj.startOf('day').unix() * 1000

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
      const { workType, effectiveDate, birthday, firstDate, reviewDate, ...resValues } = values;
      const [startDate, endDate] = effectiveDate;
      const payload = {
        ...resValues,
        workType: workType && workType.length ? workType.join(',') : '',
        startDate: this.getTime(startDate),
        endDate: endDate.endOf('day').unix() * 1000,
        birthday: this.getTime(birthday),
        firstDate: this.getTime(firstDate),
        reviewDate: this.getTime(reviewDate),
        certificatePositiveFile: frontPhotoList && frontPhotoList.length ? JSON.stringify(frontPhotoList) : '',
        certificateReverseFile: backPhotoList && backPhotoList.length ? JSON.stringify(backPhotoList) : '',
      };
      console.log('submit', payload);
      const tag = id ? '编辑' : '新增';
      const success = () => {
        message.success(`${tag}成功`);
        router.push(listUrl);
      };
      const error = res => { message.error(res ? res.msg : `${tag}失败`) };
      if (id) {
        dispatch({
          type: 'baseInfo/editSpecialWorkPerson',
          payload: { ...payload, id },
          success,
          error,
        })
      } else {
        dispatch({
          type: 'baseInfo/addSpecialWorkPerson',
          payload,
          success,
          error,
        })
      }
    })
  };

  // 格式化作业列别选项
  generateOperationCategory = list => list.length ? list.map(({ id, label, hasChild }) => ({ value: id, label, isLeaf: !Number(hasChild) })) : []

  // 加载作业类别下级选项
  loadOperationCategory = selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    this.fetchOperationCategory({
      payload: { type: 'workType', parentId: targetOption.value },
      callback: list => {
        const children = this.generateOperationCategory(list);
        targetOption.loading = false;
        targetOption.children = children;
        this.setState({ operationCategory: [...this.state.operationCategory] })
      },
    })
  }

  /**
   * 渲染表单
   */
  renderForm = () => {
    const {
      match: { params: { id } },
      form: { getFieldDecorator },
    } = this.props;
    const {
      frontPhotoList,
      backPhotoList,
      operationCategory,
      forntLoading,
      backLoading,
      selectedCompany,
      detail,
    } = this.state;
    return (
      <Card>
        <Form>
          <FormItem label="单位名称" {...formItemLayout}>
            {getFieldDecorator('companyId', {
              rules: [{ required: true, message: '请选择单位' }],
            })(
              <Fragment>
                <Input value={selectedCompany.name} {...itemStyles} disabled placeholder="请选择单位" />
                <Button onClick={this.handleViewCompanyModal} type="primary">选择单位</Button>
              </Fragment>
            )}
          </FormItem>
          <FormItem label="姓名" {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: id ? detail.name : undefined,
              rules: [{ required: true, message: '请输入' }],
            })(<Input placeholder="请输入" {...itemStyles} />)}
          </FormItem>
          <FormItem label="性别" {...formItemLayout}>
            {getFieldDecorator('sex', {
              initialValue: id ? detail.sex : undefined,
              rules: [{ required: true, message: '请输入性别' }],
            })(
              <Select placeholder="请选择" {...itemStyles}>
                {[{ key: '1', label: '男' }, { key: '2', label: '女' }].map(({ key, label }) => (
                  <Select.Option key={key} label={label}>
                    {label}
                  </Select.Option>
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
            })(<Input placeholder="请输入" {...itemStyles} />)}
          </FormItem>
          <FormItem label="作业类别" {...formItemLayout}>
            {getFieldDecorator('workType', {
              initialValue: id && detail.workType ? detail.workType.split(',') : undefined,
              rules: [{ required: true, message: '请选择作业类别' }],
            })(
              <Cascader
                placeholder="作业类别"
                options={operationCategory}
                loadData={this.loadOperationCategory}
                changeOnSelect
                {...itemStyles}
              />
            )}
          </FormItem>
          <FormItem label="连续从事本工作时间" {...formItemLayout}>
            {getFieldDecorator('continueWorkTime', {
              initialValue: id ? detail.continueWorkTime : undefined,
            })(<Input placeholder="请输入" {...itemStyles} />)}
          </FormItem>
          <FormItem label="准操项目" {...formItemLayout}>
            {getFieldDecorator('mustholdProject', {
              initialValue: id ? detail.mustholdProject : undefined,
              rules: [{ required: true, message: '请选输入准操项目' }],
            })(<TextArea rows={5} placeholder="请输入" {...itemStyles} />)}
          </FormItem>
          <FormItem label="操作证证号" {...formItemLayout}>
            {getFieldDecorator('certificateNumber', {
              initialValue: id ? detail.certificateNumber : undefined,
              rules: [{ required: true, message: '请输入操作证证号' }],
            })(<Input placeholder="请输入" {...itemStyles} />)}
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
          <FormItem label="操作证正面扫描件" {...formItemLayout}>
            {getFieldDecorator('certificatePositiveFile')(
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
            )}
          </FormItem>
          <FormItem label="操作证反面扫描件" {...formItemLayout}>
            {getFieldDecorator('certificateReverseFile')(
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
            )}
          </FormItem>
        </Form>
      </Card>
    );
  };

  render () {
    const {
      companyLoading,
      match: { params: { id } },
      sensor: { companyModal }, // companyModal { list , pagination:{} }
    } = this.props;
    const { companyModalVisible } = this.state;
    const title = id ? '编辑特种作业操作证人员' : '新增特种作业操作证人员';
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
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderForm()}
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
        <Button
          style={{ marginLeft: '50%', transform: 'translateX(-50%)', marginTop: '24px' }}
          type="primary"
          onClick={this.handleSubmit}
        >
          提交
        </Button>
      </PageHeaderLayout>
    );
  }
}
