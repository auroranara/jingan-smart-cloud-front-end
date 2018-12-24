import React, { PureComponent, Fragment } from 'react';
import { List, Spin, Card, Input, Button, Icon, Modal, message } from 'antd';
import { connect } from 'dva';
import InfiniteScroll from 'react-infinite-scroller';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Ellipsis from '@/components/Ellipsis';
import InlineForm from '@/pages/BaseInfo/Company/InlineForm';
import CompanyModal from '@/pages/BaseInfo/Company/CompanyModal';
import urls from '@/utils/urls';
import titles from '@/utils/titles';
import codes from '@/utils/codes';
import { hasAuthority } from '@/utils/customAuth';
import router from 'umi/router';
import Link from 'umi/link';
import unusedIcon from '@/assets/unused.png';
import usedIcon from '@/assets/used.png';

import styles from './index.less';

const {
  home: homeUrl,
  examinationPaper: { list: listUrl, detail: detailUrl, add: addUrl, preview: previewUrl },
} = urls;
const {
  home: homeTitle,
  examinationPaper: { list: title, menu: menuTitle },
} = titles;

/* 面包屑 */
const breadcrumbList = [
  { title: homeTitle, name: homeTitle, href: homeUrl },
  { title: menuTitle, name: menuTitle },
  { title, name: title },
];
// 获取code
const {
  training: {
    examinationPaper: { detail: detailCode, add: addCode, delete: deleteCode },
  },
} = codes;
// controlSessionName
const controlSessionName = 'examination_paper_list_control_';
// scrollSessionName
const scrollSessionName = 'examination_paper_list_scrollTop_';
// paginationSessionName
const paginationSessionName = 'examination_paper_list_pagination_';
// session
const companySessionName = 'examination_paper_list_company_';
// form字段
const fields = [
  {
    id: 'name',
    render: () => <Input placeholder="请输入试卷标题" />,
    transform: v => v.trim(),
  },
];
// 获取无数据
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};
// 获取初始化数据
const getInitialValues = () => ({
  name: undefined,
});
// 默认pagination
const defaultPagination = { pageNum: 1, pageSize: 18 };

/**
 * 1.状态保留问题
 * 2.权限问题
 * 3.刷新问题（当前页面刷新，详情页面刷新）
 */

@connect(({ examinationPaper, user, loading }) => ({
  examinationPaper,
  user,
  loading: loading.models.examinationPaper,
}))
export default class App extends PureComponent {
  state = {
    values: null,
    company: undefined,
    visible: false,
  };

  componentDidMount() {
    const {
      dispatch,
      location: { query },
      user: {
        currentUser: { id },
      },
    } = this.props;

    let payload, callback;
    // 如果是从详情页面返回到当前页面
    if ('back' in query) {
      // 移除query参数
      router.push(listUrl);
      // 从sessionStorage中获取之前的控件数据
      const values = JSON.parse(sessionStorage.getItem(`${controlSessionName}${id}`));
      // 从sessionStorage中获取之前的企业选择数据
      const company = JSON.parse(sessionStorage.getItem(`${companySessionName}${id}`));
      // 注意：必须确保company为truthy时先渲染出控件再重置values
      // 如果company存在的话，就将数据重置到输入框中
      company ? this.setState({ company }, () => {
        // 如果控件数据存在的话，就将数据重置到控件中
        values && this.setState({ values });
      }) : (values && this.setState({ values }));
      // 从sessionStorage中获取之前的scrollTop
      const scrollTop = sessionStorage.getItem(`${scrollSessionName}${id}`);
      // 如果scrollTop存在的话，就将滚动条移动到对应位置
      callback = () => scrollTop && window.scrollTo(0, scrollTop);
      // 从sessionStorage中获取之前的分页信息
      const { pageNum: realPageNum, pageSize: realPageSize } =
        JSON.parse(sessionStorage.getItem(`${paginationSessionName}${id}`)) || defaultPagination;
      // 创建请求参数
      payload = {
        ...values,
        pageNum: 1,
        pageSize: realPageSize * realPageNum,
        realPageNum,
        realPageSize,
        companyId: company ? company.id : undefined,
      };
    } else {
      // 清除session
      sessionStorage.removeItem(`${controlSessionName}${id}`);
      sessionStorage.removeItem(`${companySessionName}${id}`);
      sessionStorage.removeItem(`${scrollSessionName}${id}`);
      sessionStorage.removeItem(`${paginationSessionName}${id}`);
      // 默认没有companyId
      payload = { ...defaultPagination, ...getInitialValues() };
    }
    // 获取初始化列表
    dispatch({
      type: 'examinationPaper/fetchList',
      payload,
      callback,
    });

    // 添加scroll监听事件
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    // 移除scroll监听事件
    window.removeEventListener('scroll', this.handleScroll);
    this.handleScroll.cancel();
  }

  /**
   * 获取企业列表
   */
  fetchCompanyList = action => {
    const { dispatch } = this.props;
    dispatch({ type: 'examinationPaper/fetchCompanyList', ...action });
  };

  /**
   * 滚动
   */
  @Bind()
  @Debounce(200)
  handleScroll() {
    const {
      user: {
        currentUser: { id },
      },
    } = this.props;
    // 将当前的scrollTop保存在sessionStorage中
    sessionStorage.setItem(`${scrollSessionName}${id}`, document.documentElement.scrollTop);
  }

  /**
   * 查询
   */
  handleSearch = values => {
    const {
      dispatch,
      user: {
        currentUser: { id },
      },
    } = this.props;
    const { company } = this.state;
    // 保存控件数据
    sessionStorage.setItem(`${controlSessionName}${id}`, JSON.stringify(values));
    // 保存分页信息
    sessionStorage.setItem(`${paginationSessionName}${id}`, JSON.stringify(defaultPagination));
    // 获取第一页列表
    dispatch({
      type: 'examinationPaper/fetchList',
      payload: {
        ...defaultPagination,
        ...values,
        companyId: company && company.id,
      },
    });
  };

  /**
   * 重置
   */
  handleReset = values => {
    this.handleSearch(values);
  };

  /**
   * 加载列表
   */
  handleLoadMore = () => {
    const {
      dispatch,
      examinationPaper: {
        list: {
          pagination: { pageSize, pageNum },
        },
      },
      user: {
        currentUser: { id },
      },
    } = this.props;
    const { company } = this.state;
    // 创建分页信息
    const pagination = { pageNum: pageNum + 1, pageSize };
    // 从session中获取上次查询的表单数据
    const values =
      JSON.parse(sessionStorage.getItem(`${controlSessionName}${id}`)) || getInitialValues();
    // 重置表单
    this.setState({ values });
    // 获取列表
    dispatch({
      type: 'examinationPaper/appendList',
      payload: {
        ...pagination,
        ...values,
        companyId: company && company.id,
      },
    });
    // 保存分页信息
    sessionStorage.setItem(`${paginationSessionName}${id}`, JSON.stringify(pagination));
  };

  /**
   * 删除
   */
  handleDelete = id => {
    Modal.confirm({
      title: '删除确认',
      content: '你确定要删除这张试卷吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'examinationPaper/delete',
          payload: { id },
          callback: flag => {
            if (flag) {
              message.success('删除成功！');
            } else {
              message.error('删除失败！');
            }
          },
        });
      },
    });
  };

  /**
   * 选择企业
   */
  handleSelectCompany = company => {
    const {
      dispatch,
      user: {
        currentUser: { id },
      },
    } = this.props;
    this.setState({ company, visible: false });
    // 从session中获取上次查询的表单数据
    const values =
      JSON.parse(sessionStorage.getItem(`${controlSessionName}${id}`)) || getInitialValues();
    // 获取该企业的第一页试卷列表
    dispatch({
      type: 'examinationPaper/fetchList',
      payload: {
        ...defaultPagination,
        ...values,
        companyId: company.id,
      },
    });
    // 将company保存到的session中
    sessionStorage.setItem(`${companySessionName}${id}`, JSON.stringify(company));
  };

  /**
   * 选择单位按钮点击显示模态框
   */
  handleShowModal = () => {
    this.setState({ visible: true });
    this.fetchCompanyList({ payload: { pageSize: 10, pageNum: 1 } });
  };

  /**
   * 关闭模态框
   */
  handleClose = () => {
    this.setState({ visible: false });
  };

  /**
   * 弹出框
   */
  renderModal() {
    const {
      examinationPaper: { companyList },
    } = this.props;
    const { visible, loading } = this.state;
    return (
      <CompanyModal
        title="选择单位"
        loading={loading}
        visible={visible}
        modal={companyList}
        fetch={this.fetchCompanyList}
        onSelect={this.handleSelectCompany}
        onClose={this.handleClose}
      />
    );
  }

  /**
   * 企业选择框
   */
  renderSelect() {
    const {
      user: {
        currentUser: { unitType },
      },
    } = this.props;
    const { company } = this.state;
    const notCompany = unitType === 2 || unitType === 3;
    // 当账户为政府或运营时可以选择企业
    return notCompany && (
      <div style={{ marginBottom: 8 }}>
        <Input
          placeholder="请选择单位"
          style={{ marginRight: 16, width: 256 }}
          value={company && company.name}
          readOnly
          disabled
        />
        <Button type="primary" onClick={this.handleShowModal}>选择单位</Button>
      </div>
    );
  }

  /**
   * 控件
   */
  renderForm() {
    const {
      user: {
        currentUser: { permissionCodes, unitType },
      },
    } = this.props;
    const { values, company } = this.state;
    // 是否有新增权限
    const hasAddAuthority = hasAuthority(addCode, permissionCodes);
    // 当账号非企业时，只有state中的company存在时，才能新增
    const notCompany = unitType === 2 || unitType === 3;
    // 是否隐藏表单
    const hideForm = notCompany && !company;

    return hideForm ? null : (
      <Card>
        <InlineForm
          fields={fields}
          values={values}
          action={<Button type="primary" disabled={!hasAddAuthority || hideForm} onClick={() => {router.push(addUrl);}}>新增</Button>}
          onSearch={this.handleSearch}
          onReset={this.handleReset}
        />
      </Card>
    );
  }

  /**
   * 列表
   */
  renderList() {
    const { examinationPaper: { list: { list } }, user: { currentUser: { permissionCodes, unitType } } } = this.props;
    const { company } = this.state;
    // 是否有查看详情权限
    const hasDetailAuthority = hasAuthority(detailCode, permissionCodes);
    // 是否有删除权限
    const hasDeleteAuthority = hasAuthority(deleteCode, permissionCodes);
    // 是否为非企业
    const notCompany = unitType === 2 || unitType === 3;
    // 是否隐藏列表
    const hideList = notCompany && !company;

    return (
      <List
        locale={hideList ? { emptyText: '请先选择单位' } : undefined}
        className={styles.cardList}
        rowKey="id"
        grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
        dataSource={hideList ? [] : list}
        renderItem={({ id, name, ruleTypeName, createTimeStr, useNum, status }) => {
          const isUsed = !!+status;
          return (
            <List.Item key={id}>
              <Card
                title={
                  <Ellipsis
                    tooltip
                    lines={1}
                    style={{ minHeight: 24 }} /* className={styles['card-title-ellipsis']} */
                  >
                    {name}
                  </Ellipsis>
                }
                className={styles.card}
                actions={[
                  hasDetailAuthority ? <Link to={previewUrl + id}>预览试卷</Link> : <span onClick={() => { message.warning('您没有权限访问对应页面'); }}>预览试卷</span>,
                  hasDetailAuthority ? <Link to={detailUrl + id}>试卷规则</Link> : <span onClick={() => { message.warning('您没有权限访问对应页面'); }}>试卷规则</span>,
                ]}
                extra={
                  hasDeleteAuthority && !isUsed ? (
                    <Button
                      onClick={() => {
                        this.handleDelete(id);
                      }}
                      shape="circle"
                      style={{ border: 'none', fontSize: '20px' }}
                    >
                      <Icon type="close" />
                    </Button>
                  ) : null
                }
              >
                <div
                  style={{
                    background: `url(${isUsed ? usedIcon : unusedIcon}) no-repeat right center`,
                  }}
                >
                  <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                    抽题规则：
                    {ruleTypeName || getEmptyData()}
                  </Ellipsis>
                  <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                    出题时间：
                    {/* {createTimeStr ? moment(+createTimeStr).format('YYYY-MM-DD') : getEmptyData()} */}
                    {createTimeStr || getEmptyData()}
                  </Ellipsis>
                  <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                    被使用次数：
                    <span
                      style={{
                        fontSize: 18,
                        lineHeight: '1',
                        color: isUsed ? '#1890FF' : undefined,
                      }}
                    >
                      {useNum || 0}
                    </span>
                  </Ellipsis>
                </div>
              </Card>
            </List.Item>
          );
        }}
      />
    );
  }

  render() {
    const { examinationPaper: { list: { pagination: { total, pageSize, pageNum } } }, loading, user: { currentUser: { unitType } } } = this.props;
    const { company } = this.state;
    // 是否为非企业
    const notCompany = unitType === 2 || unitType === 3;
    // 是否隐藏列表
    const hideList = notCompany && !company;

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={<Fragment>{this.renderSelect()}{!hideList && <div>试卷总数：{hideList ? 0 : total}</div>}</Fragment>}
      >
        {/* 控件 */ this.renderForm()}
        <InfiniteScroll
          initialLoad={false}
          loadMore={() => {
            // 防止多次加载
            !loading && this.handleLoadMore();
          }}
          hasMore={hideList ? false : (pageNum * pageSize < total)}
          loader={
            <div className="loader" key={0}>
              {loading && (
                <div style={{ paddingTop: '50px', textAlign: 'center' }}>
                  <Spin />
                </div>
              )}
            </div>
          }
        >
          {/* 列表 */ this.renderList()}
        </InfiniteScroll>
        {this.renderModal()}
      </PageHeaderLayout>
    );
  }
}
