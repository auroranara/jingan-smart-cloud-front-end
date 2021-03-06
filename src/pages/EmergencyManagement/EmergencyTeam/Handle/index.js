import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
// import router from 'umi/router';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Card, message, Tooltip, Input, Divider, Upload, Select } from 'antd';
import { debounce } from 'lodash';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { renderSections } from '@/pages/SafetyKnowledgeBase/MSDS/utils';
import { handleDetails, BREADCRUMBLIST, LIST_URL, ROUTER, teamType } from '../Other/utils';
import { getFileList } from '@/pages/BaseInfo/utils';
import { getToken } from '@/utils/authority';
import { isCompanyUser } from '@/pages/RoleAuthorization/Role/utils';
import styles from '@/pages/CardsInfo/EmergencyCard/TableList.less';
// import { hasAuthority } from '@/utils/customAuth';
// import codes from '@/utils/codes';
import style from './index.less';
import { genGoBack } from '@/utils/utils';

// 权限
// const {
//   emergencyManagement: {
//     emergencyTeam: { edit: editCode },
//   },
// } = codes;

const FOLDER = 'emergencyInfo';
const uploadAction = '/acloud_new/v2/uploadFile';

const { Option } = Select;

function getDepartList(list) {
  if (!Array.isArray(list)) return [];
  return list.map(({ id, name, children }) => ({
    title: name,
    value: id,
    children: getDepartList(children),
  }));
}

@connect(({ user, emergencyTeam, department, riskPointManage, loading }) => ({
  user,
  department,
  emergencyTeam,
  riskPointManage,
  loading: loading.models.emergencyTeam,
}))
@Form.create()
export default class Edit extends PureComponent {
  constructor(props) {
    super(props);
    this.goBack = genGoBack(props, LIST_URL);
    this.debouncedHandleUserSearch = debounce(this.handleUserSearch, 300);
  }

  state = {
    areaCode: '', // 区号
    fixedPhone: '', // 固定电话
    photoList: [], // 上传照片
    fileLoading: false,
  };

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
      form: { setFieldsValue },
      user: {
        currentUser: { unitType, companyId, companyName },
      },
    } = this.props;
    if (id) this.getDetail(id);
    else if (isCompanyUser(+unitType)) {
      setFieldsValue({ companyId: { key: companyId, label: companyName } });
      this.fetchDepartList({ companyId });
      this.getUserList();
    }
  }

  // 获取部门
  fetchDepartList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'department/fetchDepartmentList',
      payload: params,
    });
  };

  getDetail = id => {
    const {
      dispatch,
      form: { setFieldsValue },
    } = this.props;
    dispatch({
      type: 'emergencyTeam/fetchEmergTeamView',
      payload: { id },
      callback: detail => {
        const { companyId, otherFileList, areaCode, telNumber } = detail;
        const det = { ...detail };
        const list = Array.isArray(otherFileList)
          ? otherFileList.map(({ id, fileName, webUrl, dbUrl }) => ({
              uid: id,
              name: fileName,
              url: webUrl,
              dbUrl,
            }))
          : [];
        det.photo = list.length ? { fileList: list } : null;
        setFieldsValue(handleDetails(det));
        this.fetchDepartList({ companyId });
        this.getUserList(null, companyId);
        this.setState({
          photoList: list,
          areaCode,
          fixedPhone: telNumber,
        });
      },
    });
  };

  handleSubmit = e => {
    const {
      dispatch,
      form: { validateFields },
      match: {
        params: { id },
      },
    } = this.props;
    const { photoList, areaCode, fixedPhone } = this.state;

    e.preventDefault();
    validateFields((errors, values) => {
      if (errors) return;
      const {
        companyId,
        treamName,
        treamLevel,
        treamHead,
        headPart,
        headPhone,
        treamDescription,
      } = values;
      const vals = {
        companyId: companyId.key,
        areaCode,
        telNumber: fixedPhone,
        treamName,
        treamLevel,
        treamHead: treamHead.value || treamHead.key,
        headPart,
        headPhone,
        treamDescription,
        otherFileList: photoList.map(({ uid, name, url, dbUrl }) => ({
          id: uid,
          fileName: name,
          webUrl: url,
          dbUrl,
        })),
      };

      const success = () => {
        const msg = id ? '编辑成功' : '新增成功';
        message.success(msg, 1);
        // router.push(LIST_URL);
        setTimeout(this.goBack, 1000);
      };

      const error = () => {
        const msg = id ? '编辑失败' : '新增失败';
        message.error(msg, 1);
      };

      dispatch({
        type: `emergencyTeam/fetchEmergTeam${id ? 'Edit' : 'Add'}`,
        payload: id ? { id, ...vals } : vals,
        success,
        error,
      });
    });
  };

  isDetail = () => {
    const {
      match: { url },
    } = this.props;
    return url && url.includes('detail');
  };

  handleUploadPhoto = info => {
    const {
      form: { setFieldsValue },
    } = this.props;
    const { fileList: fList, file } = info;
    let fileList = [...fList];
    if (file.status === 'uploading') {
      this.setState({ fileLoading: true });
    }
    if (file.status === 'done') {
      this.setState({ fileLoading: false });
    }
    if (file.status === undefined)
      // file.status === undefined 为文件被beforeUpload拦截下拉的情况
      fileList.pop();
    fileList = getFileList(fileList);
    this.setState({ photoList: fileList });
    setFieldsValue({ photo: fileList.length ? { fileList } : null });
  };

  handleBeforeUpload = file => {
    const { type } = file;
    const isImage = ['image/jpeg', 'image/png'].includes(type);
    if (!isImage) message.error('请上传图片格式(jpg, png)的附件！');
    return isImage;
  };

  /*获取区号*/
  handleAreaCodeChange = event => {
    this.setState({ areaCode: event.target.value });
  };

  /**获取固定电话 */
  handleFixedPhoneChange = event => {
    this.setState({ fixedPhone: event.target.value });
  };

  onSelectChange = id => {
    const {
      user: {
        currentUser: { companyId: unitId, unitType },
      },
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ treamHead: undefined, headPart: undefined, headPhone: undefined });
    this.fetchDepartList({ companyId: unitType === 4 ? unitId : id.key });
    this.getUserList(null, id.key);
  };

  getUserList(userName, comId) {
    const {
      dispatch,
      user: { currentUser: { unitType, companyId } },
    } = this.props;
    let cId = comId;
    if (isCompanyUser(unitType)) cId = companyId; // 企业用户就用currentUser里的companyId，不是企业用户就用给定的companyId
    const payload = { companyId: cId, pageNum: 1, pageSize: 50 };
    if (userName) payload.name = userName;

    cId && dispatch({
      type: 'riskPointManage/fetchUserList',
      payload,
    });
  }

  handleUserSearch = value => {
    const { form: { getFieldValue } } = this.props;
    const v = getFieldValue('companyId');
    this.getUserList(value, v ? v.key : null);
  };

  handleSelect = (labeledValue, option) => {
    const {
      form: { setFieldsValue },
      riskPointManage: { userList },
    } = this.props;
    const { value } = labeledValue;
    const target = userList.find(({ studentId }) => studentId === value);

    target && setFieldsValue({ headPart: target.departmentId, headPhone: target.phoneNumber });
  }

  render() {
    const {
      loading,
      match: {
        params: { id },
      },
      form: { getFieldDecorator },
      user: {
        currentUser: { permissionCodes, unitType },
      },
      department: {
        data: { list: departmentList = [] },
      },
      riskPointManage: { userList },
    } = this.props;

    // const departList = departmentList.map(({ id, name }) => ({ key: id, value: name }));
    const departList = getDepartList(departmentList);

    const { photoList, areaCode, fixedPhone, fileLoading } = this.state;
    // const editAuth = hasAuthority(editCode, permissionCodes);

    const isDet = this.isDetail();
    const title = isDet ? '详情' : id ? '编辑' : '新增';
    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title, name: title });
    const handleSubmit = !isDet && this.handleSubmit;
    const isComUser = isCompanyUser(+unitType);

    const uploadBtn = (
      <Upload
        name="files"
        data={{ folder: FOLDER }}
        action={uploadAction}
        fileList={photoList}
        beforeUpload={this.handleBeforeUpload}
        onChange={this.handleUploadPhoto}
        headers={{ 'JA-Token': getToken() }}
      >
        <Button type="primary">点击上传</Button>
      </Upload>
    );

    const formItems = [
      {
        name: 'companyId',
        label: '单位名称',
        type: 'companyselect',
        disabled: isComUser,
        wrapperClassName: isComUser ? styles.disappear : undefined,
        onSelectChange: e => this.onSelectChange(e),
      },
      { name: 'treamName', label: '队伍名称' },
      {
        name: 'treamLevel',
        label: '队伍级别',
        type: 'select',
        options: teamType,
      },
      {
        name: 'treamHead',
        label: '队伍负责人',
        type: 'compt',
        component: (
          <Select
            showSearch
            labelInValue
            placeholder="请选择负责人"
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSearch={this.debouncedHandleUserSearch}
            onSelect={this.handleSelect}
            notFoundContent={null}
          >
            {userList.map(({ studentId: id, name }) => <Option key={id}>{name}</Option>)}
          </Select>
        ),
      },
      {
        name: 'headPart',
        label: '负责人部门',
        type: 'treeSelect',
        treeData: departList,
      },
      { name: 'headPhone', label: '负责人手机', phoneRule: true },
      {
        name: 'contactTel',
        label: '固定电话',
        required: false,
        type: 'compt',
        component: (
          <div className={style.mutil}>
            <Input
              value={areaCode}
              placeholder="区号"
              className={style.itemF}
              onChange={this.handleAreaCodeChange}
            />
            <span className={style.itemS}>
              <Divider />
            </span>
            <Input
              value={fixedPhone}
              placeholder="电话号码"
              className={style.itemT}
              onChange={this.handleFixedPhoneChange}
            />
          </div>
        ),
      },
      { name: 'treamDescription', label: '队伍描述', required: false, type: 'text' },
      {
        name: 'photo',
        label: '相关附件',
        required: false,
        type: 'compt',
        component: uploadBtn,
      },
    ];

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        <Card style={{ marginBottom: 15 }}>
          {renderSections(
            formItems,
            getFieldDecorator,
            handleSubmit,
            LIST_URL,
            fileLoading,
            loading,
            !id,
          )}
          {isDet ? (
            <div style={{ textAlign: 'center' }}>
              <Button style={{ marginRight: 10 }} onClick={e => window.close()}>
                返回
              </Button>
              {/* <Button
                type="primary"
                disabled={!editAuth}
                // style={{ marginLeft: '45%' }}
                onClick={e => router.push(`${ROUTER}/edit/${id}`)}
              >
                编辑
              </Button> */}
            </div>
          ) : null}
        </Card>
      </PageHeaderLayout>
    );
  }
}
