import React, { PureComponent, Fragment } from 'react';
import { Form, Button, Card } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import router from 'umi/router';
import { connect } from 'dva';

const FormItem = Form.Item;

const title = "标签详情"
const breadcrumblist = [
  { title: '首页', name: '首页', href: '/' },
  { title: '人员定位', name: '人员定位' },
  { title: '标签管理', name: '标签管理', href: '/personnel-position/tag-management/list' },
  { title, name: title },
]
const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 12 },
};

@Form.create()
@connect(({ personnelPosition }) => ({
  personnelPosition,
}))
export default class TagManagementDetail extends PureComponent {

  componentDidMount() {
    const {
      dispatch,
      location: { query: { id } },
    } = this.props
    dispatch({
      type: 'personnelPosition/fetchTagDetail',
      payload: {
        pageNum: 1,
        pageSize: 0,
        cardId: id,
      },
    })
  }

  render() {
    const {
      personnelPosition: {
        tag: {
          detail: {
            code,
            sysName,
            userName,
            phoneNumber,
            type,        // 分类 0 普通卡 1 临时卡
          } = {},
        },
      },
    } = this.props
    return (
      <PageHeaderLayout
        title={title}
        breadcrumblist={breadcrumblist}
      >
        <Card>
          <Form>
            <FormItem label="标签号" {...formItemLayout}>
              <span>{code}</span>
            </FormItem>
            <FormItem label="所属系统" {...formItemLayout}>
              <span>{code}</span>
            </FormItem>
            <FormItem label="标签分类" {...formItemLayout}>
              <span>{!!type ? '临时卡' : '普通卡'}</span>
            </FormItem>
            {+type === 0 && (
              <Fragment>
                <FormItem label="持卡人" {...formItemLayout}>
                  <span>{userName || '暂无数据'}</span>
                </FormItem>
                <FormItem label="联系方式" {...formItemLayout}>
                  <span>{phoneNumber || '暂无数据'}</span>
                </FormItem>
              </Fragment>
            )}
          </Form>
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <Button onClick={() => { router.push('/personnel-position/tag-management/list') }}>返回</Button>
          </div>
        </Card>
      </PageHeaderLayout>
    )
  }
}
