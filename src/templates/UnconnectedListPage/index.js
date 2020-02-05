import React, { Component } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { Card } from 'antd';
import CustomForm from '@/jingan-components/CustomForm';
import InfiniteList from '@/jingan-components/InfiniteList';
import PropTypes from 'prop-types';
import styles from './index.less';

const PAYLOAD = {
  pageNum: 1,
  pageSize: 30,
};

export default class UnconnectedListPage extends Component {
  static propTypes = {
    pageHeaderProps: PropTypes.object,
    formProps: PropTypes.object,
    listProps: PropTypes.object,
  };

  static defaultProps = {
    pageHeaderProps: {},
    formProps: {},
    listProps: {},
  };

  prevValues = null;

  state = {
    reloading: false,
  };

  // 设置form的引用
  setFormReference = form => {
    this.form = form;
  };

  getList = (pageNum, callback) => {
    const {
      listProps: { getList },
    } = this.props;
    getList &&
      getList(
        {
          ...PAYLOAD,
          ...this.prevValues,
          pageNum,
        },
        callback
      );
    this.form &&
      (this.prevValues ? this.form.setFieldsValue(this.prevValues) : this.form.resetFields());
  };

  reload = callback => {
    const {
      listProps: {
        list: { pagination },
      },
    } = this.props;
    this.setState({
      reloading: true,
    });
    callback(
      {
        ...pagination,
        ...this.prevValues,
      },
      () => {
        this.setState({
          reloading: false,
        });
      }
    );
    this.form &&
      (this.prevValues ? this.form.setFieldsValue(this.prevValues) : this.form.resetFields());
  };

  // 查询按钮点击事件
  handleSearchButtonClick = values => {
    const {
      listProps: { getList },
    } = this.props;
    this.prevValues = values;
    this.setState({
      reloading: true,
    });
    getList &&
      getList(
        {
          ...PAYLOAD,
          ...values,
        },
        () => {
          this.setState({
            reloading: false,
          });
        }
      );
  };

  // 重置按钮点击事件
  handleResetButtonClick = values => {
    this.handleSearchButtonClick(values);
  };

  renderForm() {
    const {
      formProps,
      formProps: { fields },
    } = this.props;

    return (
      fields &&
      fields.length > 0 && (
        <Card className={styles.card}>
          <CustomForm
            {...formProps}
            onSearch={this.handleSearchButtonClick}
            onReset={this.handleResetButtonClick}
            ref={this.setFormReference}
          />
        </Card>
      )
    );
  }

  renderList() {
    const { listProps } = this.props;
    const { reloading } = this.state;

    return <InfiniteList {...listProps} getList={this.getList} reloading={reloading} />;
  }

  render() {
    const {
      pageHeaderProps,
      pageHeaderProps: { breadcrumbList, title: t },
      children,
    } = this.props;
    const title = t || ((breadcrumbList || []).slice(-1)[0] || {}).title;

    return (
      <PageHeaderLayout {...pageHeaderProps} title={title}>
        {this.renderForm()}
        {this.renderList()}
        {children}
      </PageHeaderLayout>
    );
  }
}
