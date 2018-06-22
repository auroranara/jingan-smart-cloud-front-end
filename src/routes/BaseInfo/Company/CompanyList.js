import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  List,
  Card,
  Button,
  Icon,
  Input,
  Select,
  Modal,
  message,
  BackTop,
  Spin,
  Affix,
} from 'antd';
import { Link } from 'dva/router';
import VisibilitySensor from 'react-visibility-sensor';

import Ellipsis from 'components/Ellipsis';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout.js';

import styles from './CompanyList.less';

const FormItem = Form.Item;
const { Option } = Select;

// 默认页面显示数量
const pageSize = 18;
// 默认表单值
const defaultFormData = {
  name: undefined,
  practicalAddress: undefined,
  industryCategory: undefined,
};

@connect(
  ({ company, loading }) => ({
    company,
    loading: loading.models.company,
  }),
  dispatch => ({
    fetch(action) {
      dispatch({
        type: 'company/fetch',
        ...action,
      });
    },
    appendFetch(action) {
      dispatch({
        type: 'company/appendFetch',
        ...action,
      });
    },
    fetchCategories(action) {
      dispatch({
        type: 'company/fetchCategories',
        ...action,
      });
    },
    remove(action) {
      dispatch({
        type: 'company/remove',
        ...action,
      });
    },
    updateFormData(action) {
      dispatch({
        type: 'company/updateFormData',
        ...action,
      });
    },
  })
)
@Form.create()
export default class CompanyList extends PureComponent {
  state = {
    pageNum: 1,
  };

  componentDidMount() {
    // 获取企业列表
    this.props.fetch({
      payload: {
        pageSize,
      },
    });
    // 获取类别列表
    this.props.fetchCategories({});
  }

  /* 显示删除确认提示框 */
  handleShowDeleteConfirm = id => {
    Modal.confirm({
      title: '你确定要删除这个企业单位吗?',
      content: '如果你确定要删除这个企业单位，点击确定按钮',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        this.props.remove({
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
      updateFormData,
      form: { getFieldsValue },
    } = this.props;
    const data = getFieldsValue();
    // 修改store中的数据
    updateFormData({
      payload: data,
    });
    // 重新请求数据
    fetch({
      payload: {
        pageSize,
        ...data,
      },
    });
  };

  /* 重置按钮点击事件 */
  handleClickToReset = () => {
    const {
      fetch,
      updateFormData,
      form: { resetFields },
    } = this.props;
    // 清除筛选条件
    resetFields();
    // 清除store中的数据
    updateFormData({
      payload: defaultFormData,
    });
    // 重新请求数据
    fetch({
      payload: {
        pageSize,
      },
    });
  };

  /* 滚动加载 */
  handleLoadMore = flag => {
    if (!flag || this.props.company.isLast) {
      return;
    }
    const {
      appendFetch,
      company: { formData },
    } = this.props;
    const { pageNum } = this.state;
    // 请求数据
    appendFetch({
      payload: {
        pageSize,
        pageNum,
        ...formData,
      },
    });
  };

  /* 渲染form表单 */
  renderForm() {
    const {
      company: { categories },
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Affix offsetTop={10} target={() => document.getElementById('root')}>
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
            <FormItem>
              {getFieldDecorator('industryCategory', {
                initialValue: defaultFormData.industryCategory,
              })(
                <Select allowClear placeholder="行业类别" style={{ width: '164px' }}>
                  {categories.map(item => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
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
      </Affix>
    );
  }

  /* 渲染列表 */
  renderList() {
    const {
      company: { list },
    } = this.props;

    return (
      <div className={styles.cardList} style={{ marginTop: '24px' }}>
        <List
          rowKey="id"
          // loading={loading}
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={item => (
            <List.Item key={item.id}>
              <Card
                title={item.name}
                className={styles.card}
                actions={[
                  <Link to={`/base-info/company/detail/${item.id}`}>查看</Link>,
                  <Link to={`/base-info/company/edit/${item.id}`}>编辑</Link>,
                ]}
                extra={
                  <Button
                    onClick={() => {
                      this.handleShowDeleteConfirm(item.id);
                    }}
                    shape="circle"
                    style={{ border: 'none', fontSize: '20px' }}
                  >
                    <Icon type="close" />
                  </Button>
                }
              >
                <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                  {`地址：${item.practicalAddress}`}
                </Ellipsis>
                <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                  {`行业类别：${item.industryCategoryName}`}
                </Ellipsis>
                <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                  {`负责人：${item.name}`}
                </Ellipsis>
                <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                  {`联系电话：${item.name}`}
                </Ellipsis>
              </Card>
            </List.Item>
          )}
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
        <BackTop />
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
