import React, { PureComponent } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import router from 'umi/router';
import Link from 'umi/link';
import Ellipsis from '@/components/Ellipsis';
import { Button, Card, Form, Input, List, Modal, Select, Spin } from 'antd';

import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles from './CompanyList.less';
import { getAddress, FORMITEM_LAYOUT, TAB_LIST } from './utils';
import codes from '@/utils/codes';
import { AuthButton, AuthLink } from '@/utils/customAuth';

const title = '单位列表';
const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '人员在岗在位管理', name: '人员在岗在位管理' },
  { title: '卡口信息', name: '卡口信息' },
  { title, name: title },
];

const documentElem = document.documentElement;

const NO_DATA = '暂无信息';
const PAGE_SIZE = 18;
const { Item: FormItem } = Form;
const { Option } = Select;

@Form.create()
@connect(({ checkPoint, loading }) => ({
  checkPoint,
  loading: loading.effects['checkPoint/fetchCompanyList'],
  unitsLoading: loading.effects['checkPoint/fetchUnits'],
}))
export default class CompanyList extends PureComponent {
  state={ modalVisible: false };

  componentDidMount() {
    this.childElem = document.querySelector('#root div');
    document.addEventListener('scroll', this.handleScroll, false);
    this.fetchInitCompanyList();
    this.lazyFetchUnits = _.debounce(this.fetchUnits, 300);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handleScroll);
  }

  value = '';
  hasMore = true;
  childElem = null;
  currentpageNum = 2;

  handleScroll = e => {
    const { loading } = this.props;
    const hasMore = this.hasMore;
    const childElem = this.childElem;
    // 滚动时子元素相对定高的父元素滚动，事件加在父元素上，且查看父元素scrollTop，当滚到底时，父元素scrollTop+父元素高度=子元素高度
    // 判断页面是否滚到底部

    // 这里的页面结构是，html和body和div.#root是一样高的，而div.#root下的唯一子元素是高度比较大的
    // 发现向上滚动时，整个html都在往上滚，所以要获取document.documentElement元素，才能正确获取到scollTop，body及div.#root获取到的scrollTop都为0
    const scrollToBottom = documentElem.scrollTop + documentElem.offsetHeight >= childElem.offsetHeight;
    // 当页面滚到底部且当前并不在请求数据且数据库还有数据时，才能再次请求
    if (scrollToBottom && !loading && hasMore) this.handleLoadMore();
  };

  fetchUnits = name => {
    const { dispatch } = this.props;
    const payload = { pageNum: 1, pageSize: PAGE_SIZE };
    if (name)
      payload.name = name;
    dispatch({ type: 'checkPoint/fetchUnits', payload });
  };

  handleSearch = vals => {
    this.value = vals && vals.title ? vals.title : '';
    this.hasMore = true;
    this.currentpageNum = 2;
    this.fetchInitCompanyList();
  };

  handleReset = () => {
    this.value = '';
    this.hasMore = true;
    this.currentpageNum = 2;
    this.fetchInitCompanyList();
  };

  fetchInitCompanyList = () => {
    const callback = total => {
      if (total <= PAGE_SIZE) this.hasMore = false;  // 如果第一页已经返回了所有结果，则hasMore置为false
    };

    this.fetchCompanyList(1, callback);
  };

  handleLoadMore = () => {
    const currentPageIndex = this.currentpageNum;
    const callback = total => {
      const currentLength = currentPageIndex * PAGE_SIZE;
      this.currentpageNum += 1;
      if (currentLength >= total) this.hasMore = false;
    };
    this.fetchCompanyList(currentPageIndex, callback);
  };

  fetchCompanyList = (pageIndex, callback) => {
    const { dispatch } = this.props;
    const name = this.value;
    const payload = {
      pageNum: pageIndex,
      pageSize: PAGE_SIZE,
    };
    if (name)
      payload.companyName = name;
    dispatch({
      type: 'checkPoint/fetchCompanyList',
      payload,
      callback,
    });
  };

  genActions = companyId => (label, index) => {
    return <AuthLink to={`/personnel-management/check-point/list/${companyId}/${index}`} target="_blank" code={codes.personnelManagement.checkPoint.list}>{label}</AuthLink>;
  };

  showModal = () => {
    this.setState({ modalVisible: true });
    this.fetchUnits();
  };

  hideModal = () => {
    this.setState({ modalVisible: false });
  };

  handleSubmit = () => {
    const { form: { validateFields } } =  this.props;
    validateFields((error, fields) => {
      if (error)
        return;

      const { company, point } = fields;
      router.push(`/personnel-management/check-point/add/${company}/${point}`);
    });
  }

  handleUnitValueChange = value => {
    this.lazyFetchUnits(value);
  };

  renderModal = () => {
    const {
      unitsLoading,
      form: { getFieldDecorator },
      checkPoint: { unitList },
    } = this.props;
    const { modalVisible } = this.state;

    return (
      <Modal
        destroyOnClose
        title="添加卡口信息"
        visible={modalVisible}
        onOk={this.handleSubmit}
        onCancel={this.hideModal}
      >
        <Form {...FORMITEM_LAYOUT}>
          <FormItem label="单位名称">
            {getFieldDecorator('company', {
              rules: [{ required: true, message: '请选择单位' }],
            })(
              <Select
                showSearch
                placeholder="请选择所属单位"
                notFoundContent={unitsLoading ? <Spin size="small" /> : '暂无数据'}
                onSearch={this.handleUnitValueChange}
                filterOption={false}
              >
                {unitList.map(item => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="卡口信息">
            {getFieldDecorator('point', { rules: [{ required: true, message: '请选择卡口信息' }] })(
              <Select>
                {TAB_LIST.map(({ key, tab }) => <Option key={key}>{tab}</Option>)}
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  };

  render() {
    const {
      loading,
      checkPoint: { companyList: list },
    } = this.props;

    const toolBarAction = (
      <AuthButton type="primary" onClick={this.showModal} style={{ marginTop: '8px' }} code={codes.personnelManagement.checkPoint.add}>
        新增卡口信息
      </AuthButton>
    );
    const fields = [
      {
        id: 'title',
        label: '单位名称：',
        span: { md: 8, sm: 12, xs: 24 },
        render: () => <Input placeholder="请输入单位名称" />,
        transform: v => v.trim(),
      },
    ];

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <p className={styles.total}>
            单位总数：
            {list.length}
          </p>
        }
      >
        <Card style={{ marginBottom: 15 }}>
          <ToolBar
            fields={fields}
            action={toolBarAction}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
            buttonStyle={{ textAlign: 'right' }}
            buttonSpan={{ xl: 16, sm: 12, xs: 24 }}
          />
        </Card>
        <List
          rowKey="id"
          loading={loading}
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={item => {
            const {
              companyId: id,
              companyName,
              safetyName,
              safetyPhone,
            } = item;

            const actions = ['点位', '设备', 'LED'].map(this.genActions(id));
            const address = `地址：${getAddress(item) || NO_DATA}`;
            return (
              <List.Item key={id}>
                <Card
                  className={styles.card}
                  title={
                    <Ellipsis lines={1} tooltip style={{ height: 24 }}>
                      {companyName}
                    </Ellipsis>
                  }
                  actions={actions}
                >
                  <p className={styles.p}>
                    {address.length > 20 ? <Ellipsis lines={1} tooltip style={{ height: '1.5em' }}>{address}</Ellipsis> : address}
                  </p>
                  <p className={styles.p}>
                    安全负责人：
                    {safetyName || NO_DATA}
                  </p>
                  <p className={styles.pLast}>
                    联系电话：
                    {safetyPhone || NO_DATA}
                  </p>
                </Card>
              </List.Item>
            );
          }}
        />
        {this.renderModal()}
      </PageHeaderLayout>
    );
  }
}
