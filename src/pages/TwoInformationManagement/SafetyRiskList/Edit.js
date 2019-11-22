import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Form, message, Button } from 'antd';

import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { renderSections } from '@/pages/SafetyKnowledgeBase/MSDS/utils';
import { BREADCRUMBLIST, EDIT_FORMITEMS, LIST_URL } from './utils';

@connect(({ twoInformManagement, user, loading }) => ({
  twoInformManagement,
  user,
  loading: loading.models.twoInformManagement,
}))
@Form.create()
export default class Edit extends PureComponent {
  state = {
    detailList: {},
  };

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
      match: {
        params: { id },
      },
      dispatch,
      form: { setFieldsValue },
    } = this.props;
    dispatch({
      type: 'twoInformManagement/fetchSafetyList',
      payload: {
        id,
        pageSize: 10,
        pageNum: 1,
      },
      callback: res => {
        const { list } = res;
        this.setState({ detailList: list[0] }, () => {
          setFieldsValue(this.state.detailList);
        });
      },
    });
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

  /* 渲染底部工具栏 */
  renderFooterToolbar() {
    return (
      <FooterToolbar>
        <Button onClick={e => router.push(LIST_URL)}>返回</Button>
      </FooterToolbar>
    );
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const title = this.isDetail() ? '详情' : '';
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
