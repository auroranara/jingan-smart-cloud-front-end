import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, List, Card, Button, Icon, Input, Modal, message, Spin } from 'antd';
import { Link, routerRedux } from 'dva/router';
import VisibilitySensor from 'react-visibility-sensor';

import Ellipsis from 'components/Ellipsis';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout.js';

import styles from './CompanyList.less';

const FormItem = Form.Item;
// const { Option } = Select;

// 默认页面显示数量
const pageSize = 18;
// 默认表单值
const defaultFormData = {
  name: undefined,
  practicalAddress: undefined,
  industryCategory: undefined,
};

/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

@connect(
  ({ company, loading }) => ({
    company,
    loading: loading.models.company,
  }),
  dispatch => ({
    // 获取初始数据列表
    fetch(action) {
      dispatch({
        type: 'company/fetch',
        ...action,
      });
    },
    // 追加数据列表
    appendFetch(action) {
      dispatch({
        type: 'company/appendFetch',
        ...action,
      });
    },
    // 获取行业类别
    fetchDict(action) {
      dispatch({
        type: 'company/fetchDict',
        ...action,
      });
    },
    // 删除企业
    remove(action) {
      dispatch({
        type: 'company/remove',
        ...action,
      });
    },
    // 查看,
    goToDetail(url) {
      dispatch(routerRedux.push(url));
    },
  })
)
@Form.create()
export default class CompanyList extends PureComponent {
  constructor(props) {
    super(props);
    this.formData = defaultFormData;
  }

  componentDidMount() {
    const { fetch } = this.props;
    // 获取企业列表
    fetch({
      payload: {
        pageSize,
        pageNum: 1,
      },
    });
  }

  /* 显示删除确认提示框 */
  handleShowDeleteConfirm = id => {
    const { remove } = this.props;
    Modal.confirm({
      title: '你确定要删除这个企业单位吗?',
      content: '如果你确定要删除这个企业单位，点击确定按钮',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        remove({
          payload: {
            id,
          },
          success: () => {
            message.success('删除成功！');
          },
          error: () => {
            message.error('删除失败，请联系管理人员！');
          },
        });
      },
    });
  };

  /* 查询按钮点击事件 */
  handleClickToQuery = () => {
    const {
      fetch,
      form: { getFieldsValue },
    } = this.props;
    const data = getFieldsValue();
    // 修改表单数据
    this.formData = data;
    // 重新请求数据
    fetch({
      payload: {
        pageSize,
        pageNum: 1,
        ...data,
      },
    });
  };

  /* 重置按钮点击事件 */
  handleClickToReset = () => {
    const {
      fetch,
      form: { resetFields },
    } = this.props;
    // 清除筛选条件
    resetFields();
    // 修改表单数据
    this.formData = defaultFormData;
    // 重新请求数据
    fetch({
      payload: {
        pageSize,
        pageNum: 1,
      },
    });
  };

  /* 滚动加载 */
  handleLoadMore = flag => {
    const {
      company: { isLast },
    } = this.props;
    if (!flag || isLast) {
      return;
    }
    const {
      appendFetch,
      company: { pageNum },
    } = this.props;
    // 请求数据
    appendFetch({
      payload: {
        pageSize,
        pageNum: pageNum + 1,
        ...this.formData,
      },
    });
  };

  /* 渲染form表单 */
  renderForm() {
    const {
      // company: { industryCategories },
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Card>
        <Form layout="inline">
          <FormItem>
            {getFieldDecorator('name', {
              initialValue: defaultFormData.name,
              getValueFromEvent: e => e.target.value.trim(),
            })(<Input placeholder="请输入单位名称" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('practicalAddress', {
              initialValue: defaultFormData.practicalAddress,
              getValueFromEvent: e => e.target.value.trim(),
            })(<Input placeholder="请输入单位地址" />)}
          </FormItem>
          {/* <FormItem>
            {getFieldDecorator('industryCategory', {
              initialValue: defaultFormData.industryCategory,
            })(
              <Select allowClear placeholder="行业类别" style={{ width: '164px' }} getPopupContainer={getRootChild}>
                {industryCategories.map(item => (
                  <Option value={item.id} key={item.id}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem> */}
          <FormItem>
            <Button type="primary" onClick={this.handleClickToQuery}>
              查询
            </Button>
          </FormItem>
          <FormItem>
            <Button onClick={this.handleClickToReset}>重置</Button>
          </FormItem>
          <FormItem style={{ float: 'right' }}>
            <Button type="primary" href="#/base-info/company/add">
              新增
            </Button>
          </FormItem>
        </Form>
      </Card>
    );
  }

  /* 渲染列表 */
  renderList() {
    const {
      company: { list },
      goToDetail,
    } = this.props;

    return (
      <div className={styles.cardList} style={{ marginTop: '24px' }}>
        <List
          rowKey="id"
          // loading={loading}
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={item => {
            const {
              id,
              name,
              practicalAddress,
              industryCategoryLabel,
              safetyName,
              safetyPhone,
              practicalProvinceLabel,
              practicalCityLabel,
              practicalDistrictLabel,
              practicalTownLabel,
            } = item;
            const practicalAddressLabel =
              (practicalProvinceLabel || '') +
              (practicalCityLabel || '') +
              (practicalDistrictLabel || '') +
              (practicalTownLabel || '') +
              (practicalAddress || '');
            return (
              <List.Item key={id}>
                <Card
                  title={name}
                  className={styles.card}
                  actions={[
                    <Link to={`/base-info/company/detail/${id}`}>查看</Link>,
                    <Link to={`/base-info/company/edit/${id}`}>编辑</Link>,
                  ]}
                  extra={
                    <Button
                      onClick={() => {
                        this.handleShowDeleteConfirm(id);
                      }}
                      shape="circle"
                      style={{ border: 'none', fontSize: '20px' }}
                    >
                      <Icon type="close" />
                    </Button>
                  }
                >
                  <div
                    onClick={() => {
                      goToDetail(`/base-info/company/detail/${id}`);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                      地址：{practicalAddressLabel || getEmptyData()}
                    </Ellipsis>
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                      行业类别：{industryCategoryLabel || getEmptyData()}
                    </Ellipsis>
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                      负责人：{safetyName || getEmptyData()}
                    </Ellipsis>
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                      联系电话：{safetyPhone || getEmptyData()}
                    </Ellipsis>
                  </div>
                </Card>
              </List.Item>
            );
          }}
        />
      </div>
    );
  }

  render() {
    const {
      company: { list, isLast },
      loading,
    } = this.props;

    return (
      <PageHeaderLayout title="企业单位">
        {this.renderForm()}
        {this.renderList()}
        {list.length !== 0 && <VisibilitySensor onChange={this.handleLoadMore} style={{}} />}
        {loading &&
          !isLast && (
            <div style={{ paddingTop: '50px', textAlign: 'center' }}>
              <Spin />
            </div>
          )}
      </PageHeaderLayout>
    );
  }
}
