import { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Button, Input, Select, Upload, DatePicker, Cascader, message } from 'antd';

import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import urls from '@/utils/urls';
import { getToken } from '@/utils/authority';
import titles from '@/utils/titles';
import { phoneReg } from '@/utils/validate';
import CompanyModal from '@/pages/BaseInfo/Company/CompanyModal';
import { genGoBack } from '@/utils/utils';

const FormItem = Form.Item;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const {
  home: homeUrl,
  baseInfo: {
    specialOperationPermit: { list: listUrl },
  },
} = urls;

const {
  home: homeTitle,
  specialOperationPermit: { menu: menuTitle, list: listTitle },
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
const BUTTON_STYLE = { marginLeft: '50%', transform: 'translateX(-50%)', marginTop: '24px' };

@Form.create()
@connect(({ baseInfo, sensor, user, loading }) => ({
  baseInfo,
  sensor,
  user,
  companyLoading: loading.effects['sensor/fetchModelList'], // 单位列表加载状态
}))
export default class specialOperationPermitHandle extends PureComponent {
  constructor(props) {
    super(props);
    this.goBack = genGoBack(props, listUrl);
  }

  state = {
    frontPhotoList: [], // 操作证正面
    backPhotoList: [], // 操作证反面
    frontLoading: false,
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
      user: { isCompany, currentUser },
    } = this.props
    // 获取作业类别
    this.fetchDict({
      payload: { type: 'workType', parentId: 0 },
      callback: list => {
        this.setState({ operationCategory: list })
      },
    })
    if (id) {
      // 如果编辑
      dispatch({
        type: 'baseInfo/fetchSpecialWorkPerson',
        payload: { id, pageNum: 1, pageSize: 10 },
        callback: ({ list }) => {
          const detail = list[0] || {};
          const { companyId, companyName, certificatePositiveFileList, certificateReverseFileList, workType } = detail;
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
          setFieldsValue({ companyId });
          const temp = workType ? workType.split(',') : [];
          // 获取作业类别
          this.fetchDict({
            payload: { type: 'workType' },
            callback: list => {
              const children = temp.length > 1 ? list.filter(item => item.parentId === temp[0]) : undefined;
              const root = list.reduce((arr, item) => {
                if (item.parentId === '0') {
                  return temp.length > 1 && item.id === temp[0] ? [...arr, { ...item, isLeaf: !Number(item.hasChild), children }] : [...arr, { ...item, isLeaf: !Number(item.hasChild) }]
                } else return arr;
              }, [])
              this.setState({ operationCategory: root });
            },
          })
        },
      })
    } else if (isCompany) {
      // 如果企业账号
      const { companyId, companyName } = currentUser;
      this.setState({ selectedCompany: { id: companyId, name: companyName } })
      // setFieldsValue({ companyId })
    }
  }

  // 获取字典
  fetchDict = actions => {
    const { dispatch } = this.props;
    dispatch({
      type: 'baseInfo/fetchDict',
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
      this.setState({ frontLoading: true, frontPhotoList: fileList })
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
          frontLoading: false,
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
        frontLoading: false,
      });
    } else if (file.status === 'removed') {
      // 删除
      this.setState({
        frontPhotoList: fileList.filter(item => {
          return item.status !== 'removed';
        }),
        frontLoading: false,
      });
    } else {
      message.error('上传失败')
      this.setState({ frontLoading: false })
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

  getTime = obj => obj ? obj.startOf('day').unix() * 1000 : obj;

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
      const { workType, effectiveDate, birthday, firstDate, reviewDate, ...resValues } = values;
      const [startDate, endDate] = effectiveDate;
      const payload = {
        ...resValues,
        companyId: selectedCompany.id,
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
        // router.push(listUrl);
        setTimeout(this.goBack, 1000);
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
  // generateOperationCategory = list => list.length ? list.map(({ id, label, hasChild }) => ({ value: id, label, isLeaf: !Number(hasChild) })) : []

  // 加载作业类别下级选项
  loadOperationCategory = selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    this.fetchDict({
      payload: { type: 'workType', parentId: targetOption.id },
      callback: list => {
        const children = list;
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
      user: { isCompany },
    } = this.props;
    const {
      frontPhotoList,
      backPhotoList,
      operationCategory,
      frontLoading,
      backLoading,
      selectedCompany,
      detail,
    } = this.state;
    return (
      <Form>
        {!isCompany && (
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
        )}
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
            // rules: [{ required: true, message: '请选择出生年月' }],
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
              // { required: true, message: '请输入联系电话' },
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
              fieldNames={{ value: 'id' }}
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
                  <LegacyIcon type={frontLoading ? 'loading' : "upload"} />
                  点击上传
              </Button>
              </Upload>
            </Fragment>
          )}
        </FormItem>
        <FormItem label="操作证反面扫描件" {...formItemLayout}>
          {getFieldDecorator('certificateReverseFile')(
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
                  <LegacyIcon type={backLoading ? 'loading' : "upload"} />
                  点击上传
              </Button>
              </Upload>
            </Fragment>
          )}
        </FormItem>
      </Form>
    );
  };

  render () {
    const {
      companyLoading,
      match: { params: { id } },
      route: { name },
      sensor: { companyModal }, // companyModal { list , pagination:{} }
    } = this.props;
    const { companyModalVisible } = this.state;

    const isDetail = name === 'view';
    const title = id ? isDetail ? '详情' : '编辑' : '新增';
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
        <Card>
          {this.renderForm()}
          <div style={{ textAlign: 'center' }}>
            {isDetail ? (
              // <Button
              //   style={BUTTON_STYLE}
              //   type="primary"
              //   onClick={e => router.push(`/operation-safety/special-operation-permit/edit/${id}`)}
              // >
              //   编辑
              // </Button>
              null
            ) : (
                <Button
                  // style={BUTTON_STYLE}
                  type="primary"
                  onClick={this.handleSubmit}
                >
                  提交
                </Button>
              )}
            <Button
              style={{ marginLeft: 20 }}
              onClick={this.goBack}
            >
              返回
            </Button>
          </div>
        </Card>


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
    );
  }
}
