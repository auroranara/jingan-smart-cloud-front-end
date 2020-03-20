import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Card, message, Tooltip, Icon } from 'antd';

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

@connect(({ user, realNameCertification, loading }) => ({
  user,
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
    }
  }

  getDetail = id => {
    const {
      dispatch,
      form: { setFieldsValue },
    } = this.props;
    dispatch({
      type: 'realNameCertification/fetchTagCardList',
      payload: {
        id,
        pageNum: 1,
        pageSize: 10,
      },
      callback: detail => {
        const {
          data: { list = [] },
        } = detail;
        const view = list.find(item => item);
        setFieldsValue(handleDetails(view));
      },
    });
  };

  handleSubmit = e => {
    const {
      form: { validateFields },
      match: {
        params: { id },
      },
      user: {
        currentUser: { companyId: unitId },
      },
      dispatch,
    } = this.props;

    e.preventDefault();
    validateFields((errors, values) => {
      if (errors) return;
      const { companyId, icNumber, snNumber, labelType, note } = values;
      const vals = {
        companyId: companyId.key || unitId,
        icNumber,
        snNumber,
        labelType,
        note,
      };
      const tag = id ? '编辑' : '新增';
      const callback = (success, msg) => {
        if (success) {
          message.success(`${tag}成功`);
          router.push(LIST_URL);
        } else {
          message.error(msg || `${tag}人员失败`);
        }
      };

      dispatch({
        type: `realNameCertification/fetchTagCard${id ? 'Edit' : 'Add'}`,
        payload: id ? { id, ...vals } : vals,
        callback,
      });
    });
  };

  isDetail = () => {
    const {
      match: { url },
    } = this.props;
    return url && url.includes('detail');
  };
  validateIc = (rule, value, callback) => {
    const chineseRe = new RegExp('[\\u4E00-\\u9FFF]+', 'g');
    if (value && value.length < 50 && !chineseRe.test(value)) {
      callback();
    } else callback('格式不正确');
  };

  validateSn = (rule, value, callback) => {
    const snRe = new RegExp(/[0-9a-fA-F]$/);
    const chineseRe = new RegExp('[\\u4E00-\\u9FFF]+', 'g');
    if (value && value.length === 12 && snRe.test(value) && !chineseRe.test(value)) {
      callback();
    } else callback('必须为12位数');
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
        // onSelectChange: e => this.onSelectChange(e),
      },
      {
        name: 'icNumber',
        label: (
          <span>
            IC卡号&nbsp;
            <Tooltip title="门禁">
              <Icon style={{ color: '#1890ff' }} type="question-circle" />
            </Tooltip>
          </span>
        ),
        placeholder: '请输入IC卡号',
        otherRule: this.validateIc,
      },
      {
        name: 'snNumber',
        placeholder: '请输入SN号',
        label: (
          <span>
            SN号&nbsp;
            <Tooltip title="人员定位使用">
              <Icon style={{ color: '#1890ff' }} type="question-circle" />
            </Tooltip>
          </span>
        ),
        otherRule: this.validateSn,
      },
      {
        name: 'labelType',
        label: '标签卡类型',
        type: 'select',
        options: cardType,
      },
      { name: 'note', label: '备注', required: false, type: 'text' },
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
