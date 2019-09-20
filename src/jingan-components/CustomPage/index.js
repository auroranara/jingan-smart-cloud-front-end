import React, { Component, Fragment } from 'react';
import { Card, Button, Spin, message } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import CustomForm from '@/jingan-components/CustomForm';
import router from 'umi/router';
import styles from './index.less';

const BUTTON_WRAPPER_SPAN = {
  sm: 24,
  xs: 24,
};

export default class CustomPage extends Component {
  state = {
    submitting: false,
  }

  componentDidMount() {
    const { getDetail, setDetail, match: { params: { type, id } } } = this.props;
    if (type !== 'add') {
      if (id) {
        getDetail && getDetail();
      } else {
        router.replace('/500');
      }
    } else {
      setDetail && setDetail();
    }
  }

  componentWillUnmount() {
    const { setDetail } = this.props;
    setDetail && setDetail();
  }

  setFormReference = form => {
    this.form = form;
  }

  refresh = () => {
    this.forceUpdate();
  }

  // 返回按钮点击事件
  handleBackButtonClick = () => {
    router.goBack();
  }

  // 提交按钮点击事件
  handleSubmitButtonClick = () => {
    const { add, edit, match: { params: { id } }, detail, listPath } = this.props;
    const { validateFieldsAndScroll } = this.form;
    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        this.setState({ submitting: true });
        const callback = (isSuccess) => {
          if (isSuccess) {
            message.success(`${id ? '编辑' : '新增'}成功！`, () => {
              router.push(listPath);
            });
          } else {
            message.error(`${id ? '编辑' : '新增'}失败，请稍后重试！`, () => {
              this.setState({
                submitting: false,
              });
            });
          }
        };
        (id ? edit : add)({ ...detail, ...values}, callback);
      }
    });
  }

  // 编辑按钮点击事件
  handleEditButtonClick = () => {
    const { editPath, match: { params: { id } } } = this.props;
    router.replace(`${editPath}${editPath.endsWith('/') ? id : `/${id}`}`);
  }

  render() {
    const {
      match: {
        params,
      },
      detail,
      getBreadcrumbList,
      getTitle,
      getFields,
      enableEdit,
      loading,
      listPath,
    } = this.props;
    const { submitting } = this.state;
    const { type } = params;
    const title = getTitle(type);
    const breadcrumbList = getBreadcrumbList(title, listPath);
    const values = this.form && this.form.getFieldsValue();
    const fields = getFields(type, detail, values);
    const editable = enableEdit(detail, values);

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        <Spin spinning={loading || submitting}>
          <Card bordered={false}>
            <CustomForm
              buttonWrapperSpan={BUTTON_WRAPPER_SPAN}
              buttonWrapperClassName={styles.buttonWrapper}
              fields={fields}
              searchable={false}
              resetable={false}
              ref={this.setFormReference}
              refresh={this.refresh}
              action={
                <Fragment>
                  <Button onClick={this.handleBackButtonClick}>返回</Button>
                  {type !== 'detail' ? (
                    <Button type="primary" onClick={this.handleSubmitButtonClick}>提交</Button>
                  ) : (
                    editable && <Button type="primary" onClick={this.handleEditButtonClick}>编辑</Button>
                  )}
                </Fragment>
              }
            />
          </Card>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
