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
  Radio,
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
// const { RangePicker } = DatePicker;

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
const BTN_STYLE = { marginLeft: '50%', transform: 'translateX(-50%)', marginTop: '24px' };

@Form.create()
@connect(({ baseInfo, sensor, user, emergencyManagement, loading }) => ({
  baseInfo,
  sensor,
  user,
  emergencyManagement,
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
    projectCodeOptions: [], // 项目代号选项
    workProjectOptionsAll: [],
  }

  componentDidMount () {
    const {
      dispatch,
      match: { params: { id } },
      form: { setFieldsValue },
      user: {
        isCompany, // 是否企业账号
        currentUser,
      },
    } = this.props;
    // 获取作业项目
    this.fetchDict({
      payload: { type: 'workProject' },
      callback: list => {
        this.setState({
          workProjectOptionsAll: list,
          projectCodeOptions: list.filter(item => item.parentId !== '0'),
        });
      },
    })
    // 获取作业种类
    // this.fetchTypeOptions();
    if (id) {
      // 如果编辑
      dispatch({
        type: 'baseInfo/fetchSpecialEquipPerson',
        payload: { id, pageNum: 1, pageSize: 10 },
        callback: ({ list }) => {
          const detail = list[0] || {};
          const { companyId, companyName, certificatePositiveFileList, certificateReverseFileList, choose, projectCode, workTypeName, workProjectName } = detail;
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
          // workType && this.fetchDict({
          //   payload: { type: 'workProject', parentId: workType },
          //   callback: list => { this.setState({ workProjectOptions: list }) },
          // });
          console.log('workTypeName', workTypeName)
          setFieldsValue({ companyId, choose });
          setTimeout(() => {
            setFieldsValue({ projectCode, workTypeName, workProjectName });
          }, 0);
        },
      })
    } else if (isCompany) {
      // 如果企业账号
      const { companyId, companyName } = currentUser;
      this.setState({ selectedCompany: { id: companyId, name: companyName } });
      // setFieldsValue({ companyId });
    }
  }

  // 获取分类
  fetchTypeOptions = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'emergencyManagement/fetchDicts',
      payload: { type: 'specialEquipment' },
    });
  };

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
  // handleWorkTypeChange = (workType) => {
  //   const { form: { setFieldsValue } } = this.props;
  //   if (workType) {
  //     this.fetchDict({
  //       payload: { type: 'workProject', parentId: workType },
  //       callback: list => { this.setState({ workProjectOptions: list }) },
  //     })
  //   } else this.setState({ workProjectOptions: [] });
  //   setFieldsValue({ workProject: undefined })
  // }

  getTime = obj => obj ? obj.startOf('day').unix() * 1000 : obj

  handleProjectCodeChange = (projectCode, item) => {
    console.log('change');

    const {
      form: { setFieldsValue },
    } = this.props;
    const { parentId, label } = item.props;
    const type = this.state.workProjectOptionsAll.find(item => item.id === parentId);
    setFieldsValue({
      workTypeName: type ? type.label : undefined,
      workProjectName: label,
    })
  }

  /**
   * 提交表单
   */
  handleSubmit = () => {
    const {
      dispatch,
      form: { validateFields },
      match: { params: { id } },
    } = this.props;
    const { frontPhotoList, backPhotoList, selectedCompany } = this.state;
    validateFields((err, values) => {
      if (err) return;
      const { endDate, birthday, firstDate, reviewDate, workTypeName, workProjectName, ...resValues } = values;
      const payload = {
        ...resValues,
        companyId: selectedCompany.id,
        // startDate: this.getTime(startDate),
        endDate: endDate ? endDate.endOf('day').unix() * 1000 : endDate,
        birthday: this.getTime(birthday),
        firstDate: this.getTime(firstDate),
        reviewDate: this.getTime(reviewDate),
        certificatepositiveFile: frontPhotoList && frontPhotoList.length ? JSON.stringify(frontPhotoList) : '',
        certificatereverseFile: backPhotoList && backPhotoList.length ? JSON.stringify(backPhotoList) : '',
        workType: workTypeName,
        workProject: workProjectName,
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
      form: { getFieldDecorator, getFieldValue, setFieldsValue },
      user: { isCompany },
      // emergencyManagement: { specialEquipment = [] },
    } = this.props;
    const {
      frontPhotoList,
      backPhotoList,
      selectedCompany,
      forntLoading,
      backLoading,
      detail,
      projectCodeOptions, // 项目代号选项
      // workProjectOptions,
      // workTypeOptions,
    } = this.state;
    // 项目代号输入方式
    const choose = getFieldValue('choose');
    return (
      <Card>
        <Form>
          {!isCompany && (
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
          )}
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
          <FormItem label="项目代号输入方式" {...formItemLayout}>
            {getFieldDecorator('choose', {
              rules: [{ required: true, message: '请选择项目代号输入方式' }],
            })(
              <Radio.Group onChange={() => { setFieldsValue({ workTypeName: undefined, workProjectName: undefined, projectCode: undefined }) }}>
                <Radio value={'0'}>选择</Radio>
                <Radio value={'1'}>手填</Radio>
              </Radio.Group>
            )}
          </FormItem>
          {/* 输入方式：选择 */}
          {+choose === 0 && (
            <Fragment>
              <FormItem label="项目代号" {...formItemLayout}>
                {getFieldDecorator('projectCode', {
                  rules: [{ required: true, message: '请选择项目代号' }],
                })(
                  <Select placeholder="请选择" onChange={this.handleProjectCodeChange} {...itemStyles}>
                    {projectCodeOptions.map(({ id, value, label, parentId }) => (
                      <Select.Option key={id} value={id} label={label} parentId={parentId}>{value}</Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
              <FormItem label="作业种类" {...formItemLayout}>
                {getFieldDecorator('workTypeName', {
                  rules: [{ required: true, message: '请选择作业种类' }],
                })(
                  <Input disabled placeholder="请选择" {...itemStyles} />
                )}
              </FormItem>
              <FormItem label="作业项目" {...formItemLayout}>
                {getFieldDecorator('workProjectName', {
                  rules: [{ required: true, message: '请选择作业项目' }],
                })(
                  <Input disabled placeholder="请选择" {...itemStyles} />
                )}
              </FormItem>
            </Fragment>
          )}
          {/* 输入方式：手填 */}
          {+choose === 1 && (
            <Fragment>
              <FormItem label="项目代号" {...formItemLayout}>
                {getFieldDecorator('projectCode', {
                  rules: [{ required: true, message: '请选择项目代号' }],
                })(<Input placeholder="请输入" allowClear {...itemStyles} />)}
              </FormItem>
              <FormItem label="作业种类" {...formItemLayout}>
                {getFieldDecorator('workTypeName', {
                  rules: [{ required: true, message: '请选择作业种类' }],
                })(
                  <Select placeholder="请选择" {...itemStyles} allowClear>
                    {['特种设备焊接作业'].map(item => (
                      <Select.Option key={item} value={item}>{item}</Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
              <FormItem label="作业项目" {...formItemLayout}>
                {getFieldDecorator('workProjectName', {
                  rules: [{ required: true, message: '请选择作业项目' }],
                })(
                  <Select placeholder="请选择" {...itemStyles} allowClear>
                    {['非金属焊接操作', '金属焊接操作'].map(item => (
                      <Select.Option key={item} value={item}>{item}</Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Fragment>
          )}
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
            })(
              <TextArea rows={5} placeholder="请输入" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="证件编号" {...formItemLayout}>
            {getFieldDecorator('operapersonNumber', {
              initialValue: id ? detail.operapersonNumber : undefined,
              rules: [{ required: true, message: '请输入证件编号' }],
            })(
              <Input placeholder="请输入" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="档案编号" {...formItemLayout}>
            {getFieldDecorator('archiveNumber', {
              initialValue: id ? detail.archiveNumber : undefined,
              rules: [{ required: true, message: '请输入档案编号' }],
            })(
              <Input placeholder="请输入" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="发证机关" {...formItemLayout}>
            {getFieldDecorator('licenseUnit', {
              initialValue: id ? detail.licenseUnit : undefined,
            })(
              <Input placeholder="请输入" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="批准日期" {...formItemLayout}>
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
            {getFieldDecorator('endDate', {
              initialValue: id && detail.endDate ? moment(detail.endDate) : undefined,
              rules: [{ required: true, message: '请选择有效日期' }],
            })(
              <DatePicker
                placeholder="请选择"
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
      route: { name },
      sensor: { companyModal }, // companyModal { list , pagination:{} }
    } = this.props;
    const { companyModalVisible } = this.state;
    const isDetail = name === 'view';
    const title = id ? isDetail ? '详情' : "编辑" : "新增";
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
        {isDetail ? (
          <Button type="primary" style={BTN_STYLE} onClick={e => router.push(`/operation-safety/special-equipment-operators/edit/${id}`)}>
            编辑
          </Button>
        ) : (
            <Button type="primary" style={BTN_STYLE} onClick={this.handleSubmit}>
              提交
          </Button>
          )}
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
