import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, message } from 'antd';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { renderSections } from '@/pages/SafetyKnowledgeBase/MSDS/utils';
import { BREADCRUMBLIST, LIST_URL } from '../other/utils';
import { isCompanyUser } from '@/pages/RoleAuthorization/Role/utils';
import styles from '@/pages/CardsInfo/EmergencyCard/TableList.less';

@connect(({ user, visitorRegistration, loading }) => ({
  user,
  visitorRegistration,
  loading: loading.models.visitorRegistration,
}))
@Form.create()
export default class Edit extends PureComponent {
  state = {};

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

  getDetail = () => {};

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
    const { personId, carId } = this.state;
    validateFields((errors, values) => {
      if (errors) return;
      const { companyId, icNumber, snNumber, labelType, note } = values;
      const vals = {
        companyId: companyId.key || unitId,
        icNumber,
        snNumber,
        labelType,
        personId: personId ? personId : undefined,
        carId: carId ? carId : undefined,
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

      // dispatch({
      //   type: `visitorRegistration/fetchTagCard${id ? 'Edit' : 'Add'}`,
      //   payload: id ? { id, ...vals } : vals,
      //   callback,
      // });
    });
  };

  render() {
    const {
      loading,
      match: {
        params: { id },
      },
      form: { getFieldDecorator },
      user: {
        currentUser: { unitType },
      },
    } = this.props;

    const title = id ? '编辑' : '新增';

    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title, name: title });

    const handleSubmit = this.handleSubmit;
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
    ];

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        <Card style={{ marginBottom: 15 }}>
          {renderSections(formItems, getFieldDecorator, handleSubmit, LIST_URL, loading)}
        </Card>
      </PageHeaderLayout>
    );
  }
}
