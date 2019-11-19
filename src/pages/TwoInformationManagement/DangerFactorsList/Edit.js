import React, { PureComponent } from 'react';
// import { connect } from 'dva';
import router from 'umi/router';
import { Card, Form, message, Icon, Popover, Button } from 'antd';

import styles1 from '@/pages/BaseInfo/Company/Company.less';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { renderSections } from '@/pages/SafetyKnowledgeBase/MSDS/utils';
import { BREADCRUMBLIST, EDIT_FORMITEMS, LIST, LIST_URL } from './utils';

@Form.create()
export default class Edit extends PureComponent {
  componentDidMount() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    id && this.getDetail();
  }

  getDetail = () => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setTimeout(() => setFieldsValue(LIST[0]), 0.3);
  };

  handleSubmit = () => {
    const {
      form: { validateFields },
    } = this.props;

    validateFields((errors, values) => {
      if (!errors) {
        message.success('操作成功');
        router.push(LIST_URL);
      }
    });
  };

  isDetail = () => {
    const {
      match: { url },
    } = this.props;
    return url && url.includes('view');
  };

  renderErrorInfo() {
    const {
      form: { getFieldsError },
    } = this.props;
    const errors = getFieldsError();
    const errorCount = Object.keys(errors).filter(key => errors[key]).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = fieldKey => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = Object.keys(errors).map(key => {
      if (!errors[key]) {
        return null;
      }
      return (
        <li key={key} className={styles1.errorListItem} onClick={() => scrollToField(key)}>
          <Icon type="cross-circle-o" className={styles1.errorIcon} />
          <div className={styles1.errorMessage}>{errors[key][0]}</div>
          <div className={styles1.errorField}>{this.fieldLabels[key]}</div>
        </li>
      );
    });
    return (
      <span className={styles1.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles1.errorPopover}
          trigger="click"
          getPopupContainer={trigger => trigger.parentNode}
        >
          <Icon type="exclamation-circle" />
          {errorCount}
        </Popover>
      </span>
    );
  }

  /* 渲染底部工具栏 */
  renderFooterToolbar() {
    const { loading } = this.props;
    return (
      <FooterToolbar>
        {this.renderErrorInfo()}
        <Button onClick={e => router.push(LIST_URL)}>返回</Button>
        {!this.isDetail() && (
          <Button
            type="primary"
            size="large"
            onClick={this.handleClickValidate}
            loading={loading}
          />
        )}
      </FooterToolbar>
    );
  }

  render() {
    const {
      match: {
        params: { id },
      },
      form: { getFieldDecorator },
    } = this.props;

    const title = this.isDetail() ? '详情' : id ? '编辑' : '新增';
    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title, name: title });

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        <Card style={{ marginBottom: 15 }}>
          {renderSections(EDIT_FORMITEMS, getFieldDecorator)}
        </Card>
        {this.renderFooterToolbar()}
      </PageHeaderLayout>
    );
  }
}
