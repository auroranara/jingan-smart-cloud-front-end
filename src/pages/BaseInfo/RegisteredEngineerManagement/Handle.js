import { PureComponent, useImperativeHandle } from 'react';
import { connect } from 'dva';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Button, Input, Select, Upload, DatePicker, message } from 'antd';
import router from 'umi/router';
import moment from 'moment';

import { getToken } from 'utils/authority';
import FormSelect from '@/jingan-components/Form/Select';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import FooterToolbar from '@/components/FooterToolbar';
import CompanyModal from '@/pages/BaseInfo/Company/CompanyModal';
// import SearchSelect from '@/jingan-components/SearchSelect';
import { isCompanyUser } from '@/pages/RoleAuthorization/Role/utils';
import { SEXES } from '@/pages/RoleAuthorization/AccountManagement/utils';
import styles from './index.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const itemStyles = { style: { width: 'calc(70%)', marginRight: '10px' } };

// 上传文件夹
const folder = 'safetyEngInfo';
// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';
// const COMPANY_LIST_MAPPER = {
//   namespace: 'user',
//   list: 'unitList',
//   getList: 'getUnitList',
// };

const COMPANY_LIST_FIELDNAMES = { key: 'loginId', value: 'userName' };

@Form.create()
@connect(({ reservoirRegion, videoMonitor, user, loading }) => ({
  reservoirRegion,
  videoMonitor,
  user,
  loading: loading.models.reservoirRegion,
  listLoading: loading.effects['user/fetchUserList'],
}))
export default class RegSafetyEngEdit extends PureComponent {
  state = {
    companyVisible: false, // 弹框是否显示
    requireFilesList: [],
    regFilesList: [],
    reqUploading: false, // 上传是否加载
    regUploading: false,
    editCompanyId: '',
    detailList: {},
  };

  companyId = null;

  // 挂载后
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
      form: { setFieldsValue },
    } = this.props;

    if (id) {
      dispatch({
        type: 'reservoirRegion/fetchSafetyEngList',
        payload: {
          pageSize: 48,
          pageNum: 1,
        },
        callback: res => {
          const { list } = res;
          const currentList = list.find(item => item.id === id) || {};
          const { companyId, requirementsFilesList, regFilesList } = currentList;
          const { companyName } = currentList;
          setFieldsValue({ companyId: companyName });
          this.companyId = companyId;
          this.getUserList();

          this.setState({
            editCompanyId: companyId,
            detailList: currentList,
            requireFilesList: requirementsFilesList.map(({ dbUrl, webUrl }, index) => ({
              uid: index,
              status: 'done',
              name: `附件${index + 1}`,
              url: webUrl,
              dbUrl,
            })),
            regFilesList: regFilesList.map(({ dbUrl, webUrl }, index) => ({
              uid: index,
              status: 'done',
              name: `附件${index + 1}`,
              url: webUrl,
              dbUrl,
            })),
          });
        },
      });
    } else {
      dispatch({
        type: 'reservoirRegion/clearSafetyEngDetail',
      });
      this.getUserList();
    }
  }

  goBack = () => {
    router.push('/base-info/registered-engineer-management/list');
  };

  handleSubmit = () => {
    const {
      match: {
        params: { id },
      },
      dispatch,
      form: { validateFieldsAndScroll },
      user: {
        currentUser: { companyId },
      },
    } = this.props;
    const { editCompanyId } = this.state;
    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        const { requireFilesList, regFilesList, editCompanyId } = this.state;
        const {
          user,
          sex,
          birth,
          phone,
          level,
          category,
          requirementsCode,
          regDate,
          regCode,
          period: [startTime, endTime],
        } = values;

        const { key: userId, label: name } = user || {};
        const payload = {
          id,
          companyId: this.companyId || companyId || editCompanyId,
          userId,
          name,
          sex,
          birth: birth ? birth.format('YYYY-MM-DD') : null,
          phone,
          level,
          category,
          requirementsCode,
          regDate: regDate.format('YYYY-MM-DD'),
          regCode,
          startDate: startTime.format('YYYY-MM-DD'),
          endDate: endTime.format('YYYY-MM-DD'),
          requirementsFilesList: requireFilesList.map(({ name, url, dbUrl }) => ({
            name,
            webUrl: url,
            dbUrl,
          })),
          regFilesList: regFilesList.map(({ name, url, dbUrl }) => ({ name, webUrl: url, dbUrl })),
        };

        const success = () => {
          const msg = id ? '编辑成功' : '新增成功';
          message.success(msg, 1, this.goBack());
        };

        const error = () => {
          message.error(id ? '编辑失败' : '新增失败');
        };

        if (id) {
          dispatch({
            type: 'reservoirRegion/fetchSafetyEngEdit',
            payload,
            success,
            error,
          });
        } else {
          dispatch({
            type: 'reservoirRegion/fetchSafetyEngAdd',
            payload,
            success,
            error,
          });
        }
      }
    });
  };

  // 显示企业弹框
  handleCompanyModal = () => {
    this.setState({ companyVisible: true });
    const payload = { pageSize: 10, pageNum: 1 };
    this.fetchCompany({ payload });
  };

  // 获取企业列表
  fetchCompany = ({ payload }) => {
    const { dispatch } = this.props;
    dispatch({ type: 'videoMonitor/fetchModelList', payload });
  };

  // 关闭企业弹框
  handleClose = () => {
    this.setState({ companyVisible: false });
  };

  // 选择企业
  handleSelect = item => {
    const {
      form: { setFieldsValue },
    } = this.props;
    const { id, name } = item;
    setFieldsValue({
      companyId: name,
      user: undefined,
    });
    this.companyId = id;
    this.handleClose();
    this.getUserList();
  };

  // 渲染企业模态框
  renderModal() {
    const {
      videoMonitor: { modal },
      loading,
    } = this.props;
    const { companyVisible } = this.state;
    return (
      <CompanyModal
        loading={loading}
        visible={companyVisible}
        modal={modal}
        fetch={this.fetchCompany}
        onSelect={this.handleSelect}
        onClose={this.handleClose}
      />
    );
  }

  handleUploadChange = ({ file, fileList }) => {
    if (file.status === 'uploading') {
      this.setState({
        requireFilesList: fileList,
        reqUploading: true,
      });
    } else if (file.status === 'done' && file.response.code === 200) {
      const {
        data: {
          list: [result],
        },
      } = file.response;
      if (result) {
        this.setState({
          requireFilesList: fileList.map(item => {
            if (!item.url && item.response) {
              return {
                ...item,
                url: result.webUrl,
                dbUrl: result.dbUrl,
              };
            }
            return item;
          }),
          reqUploading: false,
        });
        message.success('上传成功！');
      }
    } else if (file.status === 'removed') {
      // 删除
      this.setState({
        requireFilesList: fileList.filter(item => {
          return item.status !== 'removed';
        }),
        reqUploading: false,
      });
    } else {
      // error
      message.error('上传失败！');
      this.setState({
        requireFilesList: fileList.filter(item => {
          return item.status !== 'error';
        }),
        reqUploading: false,
      });
    }
  };

  handleRegUploadChange = ({ file, fileList }) => {
    if (file.status === 'uploading') {
      this.setState({
        regFilesList: fileList,
        regUploading: true,
      });
    } else if (file.status === 'done' && file.response.code === 200) {
      const {
        data: {
          list: [result],
        },
      } = file.response;
      if (result) {
        this.setState({
          regFilesList: fileList.map(item => {
            if (!item.url && item.response) {
              return {
                ...item,
                url: result.webUrl,
                dbUrl: result.dbUrl,
              };
            }
            return item;
          }),
          regUploading: false,
        });
        message.success('上传成功！');
      }
    } else if (file.status === 'removed') {
      // 删除
      this.setState({
        regFilesList: fileList.filter(item => {
          return item.status !== 'removed';
        }),
        regUploading: false,
      });
    } else {
      // error
      message.error('上传失败！');
      this.setState({
        regFilesList: fileList.filter(item => {
          return item.status !== 'error';
        }),
        regUploading: false,
      });
    }
  };

  getCompanyId = () => {
    const {
      // form: { getFieldValue },
      user: {
        currentUser: { unitType, companyId },
      },
    } = this.props;
    let comId = companyId;
    if (!isCompanyUser(+unitType)) comId = this.companyId;
    return comId;
  };

  getUserList = name => {
    const { dispatch } = this.props;
    const companyId = this.getCompanyId();
    companyId &&
      dispatch({
        type: 'user/fetchUserList',
        payload: { pageNum: 1, pageSize: 20, unitId: companyId, userName: name },
      });
  };

  setUserList = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'user/saveUserList', payload: [] });
  };

  handleUserSelect = (value, option) => {
    const {
      form: { setFieldsValue },
      user: { userList },
    } = this.props;
    const target = userList.find(({ loginId }) => loginId === value.key);
    console.log(userList, target);
    if (target) {
      const { sex, birth, phoneNumber } = target;
      setFieldsValue({
        sex,
        birth: typeof birth === 'number' ? moment(birth) : undefined,
        phone: phoneNumber,
      });
    }
  };

  /**
   * 渲染表单
   */
  renderForm = () => {
    const {
      listLoading,
      form: { getFieldDecorator },
      reservoirRegion: { sexList, engineerLevelList, specialityList },
      user: {
        currentUser: { unitType },
        userList,
      },
    } = this.props;
    const { reqUploading, regUploading, requireFilesList, regFilesList, detailList } = this.state;

    const {
      companyName,
      userId,
      name,
      sex,
      birth,
      phone,
      level,
      category,
      requirementsCode,
      regDate,
      regCode,
      startDate,
      endDate,
    } = detailList;
    // console.log(userList);

    // const nameInput = <Input placeholder="请输入姓名" {...itemStyles} />;
    // const nameInput = (
    //   <SearchSelect
    //     allowClear
    //     labelInValue
    //     // disabled={!this.getCompanyId()}
    //     showArrow={false}
    //     style= {{ width: '70%' }}
    //     loading={listLoading}
    //     list={userList}
    //     fieldNames={{ key: 'loginId', value: 'userName' }}
    //     getList={this.getUserList}
    //     setList={this.setUserList}
    //     placeholder="请选择人员姓名"
    //     onSelect={this.handleUserSelect}
    //   />
    // );
    const nameInput = (
      <FormSelect
        showSearch
        filterOption={false}
        labelInValue
        allowClear
        showArrow={false}
        fieldNames={COMPANY_LIST_FIELDNAMES}
        list={userList}
        loading={listLoading}
        className={styles.formSelect}
        onSearch={this.getUserList}
        onSelect={this.handleUserSelect}
      />
    );

    return (
      <Card>
        <Form>
          {unitType !== 4 && (
            <FormItem label="单位名称" {...formItemLayout}>
              {getFieldDecorator('companyId', {
                initialValue: companyName,
                rules: [{ required: true, message: '请选择单位名称' }],
              })(
                <Input
                  {...itemStyles}
                  ref={input => {
                    this.CompanyIdInput = input;
                  }}
                  disabled
                  placeholder="请选择单位名称"
                />
              )}
              <Button type="primary" onClick={this.handleCompanyModal}>
                选择单位
              </Button>
            </FormItem>
          )}

          <FormItem label="姓名" {...formItemLayout}>
            {getFieldDecorator('user', {
              initialValue: userId ? { key: userId, label: name } : undefined,
              rules: [{ required: true, message: '请选择人员姓名' }],
            })(nameInput)}
          </FormItem>
          <FormItem label="性别" {...formItemLayout}>
            {getFieldDecorator('sex', {
              initialValue: sex,
              rules: [{ required: true, message: '请选择性别' }],
            })(
              <Select placeholder="请选择性别" {...itemStyles}>
                {SEXES.map(({ key, label: value }) => (
                  <Select.Option key={key} value={key}>
                    {value}
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="生日" {...formItemLayout}>
            {getFieldDecorator('birth', {
              initialValue: typeof birth === 'number' ? moment(+birth) : undefined,
              // rules: [{ required: true, message: '请选择生日' }],
            })(<DatePicker placeholder="请选择生日" format="YYYY-MM-DD" {...itemStyles} />)}
          </FormItem>
          <FormItem label="联系电话" {...formItemLayout}>
            {getFieldDecorator('phone', {
              initialValue: phone,
              rules: [{ required: true, message: '请输入联系电话' }],
            })(<Input placeholder="请输入联系电话" {...itemStyles} />)}
          </FormItem>
          <FormItem label="工程师级别" {...formItemLayout}>
            {getFieldDecorator('level', {
              initialValue: level || '1',
              rules: [{ required: true, message: '请选择工程师级别' }],
            })(
              <Select placeholder="请选择工程师级别" {...itemStyles}>
                {engineerLevelList.map(({ key, value }) => (
                  <Select.Option key={key} value={key}>
                    {value}
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="专业类别" {...formItemLayout}>
            {getFieldDecorator('category', {
              initialValue: category,
              rules: [{ required: true, message: '请选择专业类别' }],
            })(
              <Select placeholder="请选择专业类别" {...itemStyles}>
                {specialityList.map(({ key, value }) => (
                  <Select.Option key={key} value={key}>
                    {value}
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="执业资格证书编号" {...formItemLayout}>
            {getFieldDecorator('requirementsCode', {
              initialValue: requirementsCode,
              rules: [{ required: true, message: '请输入执业资格证书编号' }],
            })(<Input placeholder="请输入执业资格证书编号" {...itemStyles} />)}
          </FormItem>
          <FormItem label="注册日期" {...formItemLayout}>
            {getFieldDecorator('regDate', {
              initialValue: regDate ? moment(+regDate) : undefined,
              rules: [{ required: true, message: '请选择注册日期' }],
            })(<DatePicker placeholder="请选择注册日期" format="YYYY-MM-DD" {...itemStyles} />)}
          </FormItem>
          <FormItem label="注册证书编号" {...formItemLayout}>
            {getFieldDecorator('regCode', {
              initialValue: regCode,
              rules: [{ required: true, message: '请输入注册证书编号' }],
            })(<Input placeholder="请输入注册证书编号" {...itemStyles} />)}
          </FormItem>
          <FormItem label="注册有效日期" {...formItemLayout}>
            {getFieldDecorator('period', {
              initialValue: startDate && endDate ? [moment(+startDate), moment(+endDate)] : [],
              rules: [{ required: true, message: '请选择注册有效日期' }],
            })(<RangePicker {...itemStyles} format="YYYY-MM-DD" />)}
          </FormItem>
          <FormItem label="执业资格证书附件" {...formItemLayout}>
            {getFieldDecorator('requireFilesList', {
              initialValue: requireFilesList,
              // rules: [{ required: true, message: '请上传执业资格证书附件' }],
            })(
              <Upload
                name="files"
                accept=".jpg,.png" // 接受的文件格式
                headers={{ 'JA-Token': getToken() }} // 上传的请求头部
                data={{ folder }} // 附带参数
                action={uploadAction} // 上传地址
                fileList={requireFilesList}
                onChange={this.handleUploadChange}
              >
                <Button
                  type="dashed"
                  style={{ width: '96px', height: '96px' }}
                  disabled={reqUploading}
                >
                  <LegacyIcon type="plus" style={{ fontSize: '32px' }} />
                  <div style={{ marginTop: '8px' }}>点击上传</div>
                </Button>
              </Upload>
            )}
          </FormItem>
          <FormItem label="注册证书附件" {...formItemLayout}>
            {getFieldDecorator('regFilesList', {
              initialValue: regFilesList,
              // rules: [{ required: true, message: '请上传注册证书附件' }],
            })(
              <Upload
                name="files"
                accept=".jpg,.png" // 接受的文件格式
                headers={{ 'JA-Token': getToken() }} // 上传的请求头部
                data={{ folder }} // 附带参数
                action={uploadAction} // 上传地址
                fileList={regFilesList}
                onChange={this.handleRegUploadChange}
              >
                <Button
                  type="dashed"
                  style={{ width: '96px', height: '96px' }}
                  disabled={regUploading}
                >
                  <LegacyIcon type="plus" style={{ fontSize: '32px' }} />
                  <div style={{ marginTop: '8px' }}>点击上传</div>
                </Button>
              </Upload>
            )}
          </FormItem>
        </Form>
      </Card>
    );
  };

  /* 渲染底部工具栏 */
  renderFooterToolbar(isDetail) {
    const { regUploading, reqUploading } = this.state;
    return (
      <FooterToolbar>
        {isDetail ? null : (
          <Button
            type="primary"
            size="large"
            loading={reqUploading || regUploading}
            onClick={this.handleSubmit}
          >
            提交
          </Button>
        )}
        <Button type="primary" size="large" onClick={this.goBack}>
          返回
        </Button>
      </FooterToolbar>
    );
  }

  render() {
    const {
      match: {
        params: { id },
      },
      route: { name },
    } = this.props;
    const isDetail = name === 'view';
    const title = id ? (isDetail ? '详情' : '编辑') : '新增';
    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '基础数据管理',
        name: '基础数据管理',
      },
      {
        title: '注册安全工程师管理',
        name: '注册安全工程师管理',
        href: '/base-info/registered-engineer-management/list',
      },
      {
        title,
        name: title,
      },
    ];
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderForm()}
        {this.renderModal()}
        {this.renderFooterToolbar(isDetail)}{' '}
      </PageHeaderLayout>
    );
  }
}
