import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card, Form, message, Tooltip, Icon } from 'antd';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { renderSections } from '@/pages/SafetyKnowledgeBase/MSDS/utils';
import { handleDetails, BREADCRUMBLIST, LIST_URL, ROUTER, cardType } from '../Other/utils';
import { isCompanyUser } from '@/pages/RoleAuthorization/Role/utils';
import styles from '@/pages/CardsInfo/EmergencyCard/TableList.less';
import { hasAuthority } from '@/utils/customAuth';
import codes from '@/utils/codes';

// 权限
const {
  personnelManagement: {
    tagCardManagement: { edit: editCode },
  },
} = codes;

@connect(({ user, realNameCertification, department, loading }) => ({
  user,
  department,
  realNameCertification,
  loading: loading.models.realNameCertification,
}))
@Form.create()
export default class Edit extends PureComponent {
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
    }
  }

  getDetail = id => {
    const {
      dispatch,
      form: { setFieldsValue },
    } = this.props;
    dispatch({
      type: 'realNameCertification/fetchTagCardList',
      payload: { id },
      callback: detail => {
        const { companyId } = detail;
        const det = { ...detail };
        setFieldsValue(handleDetails(det));
        this.fetchDepartList({ companyId });
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
        treamName,
        treamLevel,
        treamHead,
        headPart,
        headPhone,
        treamDescription,
      };

      const success = () => {
        const msg = id ? '编辑成功' : '新增成功';
        message.success(msg, 1);
        router.push(LIST_URL);
      };

      const error = () => {
        const msg = id ? '编辑失败' : '新增失败';
        message.error(msg, 1);
      };

      dispatch({
        type: `realNameCertification/fetchTagCard${id ? 'Edit' : 'Add'}`,
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

  onSelectChange = id => {
    const {
      user: {
        currentUser: { companyId: unitId, unitType },
      },
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ headPart: undefined });
    this.fetchDepartList({ companyId: unitType === 4 ? unitId : id.key });
  };

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
    } = this.props;

    const editAuth = hasAuthority(editCode, permissionCodes);

    const isDet = this.isDetail();
    const title = isDet ? '详情' : id ? '编辑' : '新增';
    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title, name: title });
    const handleSubmit = !isDet && this.handleSubmit;
    const isComUser = isCompanyUser(+unitType);
    const formItems = [
      {
        name: 'companyId',
        label: '单位名称',
        type: 'companyselect',
        disabled: isComUser,
        wrapperClassName: isComUser ? styles.disappear : undefined,
        onSelectChange: e => this.onSelectChange(e),
      },
      {
        name: 'treamLevel',
        label: (
          <span>
            IC卡号&nbsp;
            <Tooltip title="门禁">
              <Icon style={{ color: '#1890ff' }} type="question-circle" />
            </Tooltip>
          </span>
        ),
        placeholder: '请输入IC卡号',
      },
      {
        name: 'treamLevel',
        placeholder: '请输入SN号',
        label: (
          <span>
            SN号&nbsp;
            <Tooltip title="人员定位使用">
              <Icon style={{ color: '#1890ff' }} type="question-circle" />
            </Tooltip>
          </span>
        ),
      },
      {
        name: 'headPart',
        label: '标签卡类型',
        type: 'select',
        options: cardType,
      },
      { name: 'treamDescription', label: '备注', required: false, type: 'text' },
    ];

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        <Card style={{ marginBottom: 15 }}>
          {renderSections(formItems, getFieldDecorator, handleSubmit, LIST_URL, loading)}
          {isDet ? (
            <Button
              type="primary"
              disabled={!editAuth}
              style={{ marginLeft: '45%' }}
              onClick={e => router.push(`${ROUTER}/edit/${id}`)}
            >
              编辑
            </Button>
          ) : null}
        </Card>
      </PageHeaderLayout>
    );
  }
}
