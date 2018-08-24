import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva'
import PageHeaderLayout from '../../layouts/PageHeaderLayout.js';

const title = "关联单位"
const accountListUrl = '/role-authorization/account-management/list'
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
  },
  {
    title: '权限管理',
    name: '首页',
  },
  {
    title: '账号管理',
    name: '账号管理',
    href: accountListUrl,
  },
  {
    title: '关联单位',
    name: '关联单位',
  },
]

export default class AssociatedUnit extends PureComponent {

  render() {
    const content = (
      <Fragment>
        <p>一个账号关联多家单位</p>
      </Fragment>
    )
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={content}
      >

      </PageHeaderLayout>
    )
  }
}
