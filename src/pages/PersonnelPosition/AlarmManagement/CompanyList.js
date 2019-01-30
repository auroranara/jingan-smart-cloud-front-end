import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import Ellipsis from '@/components/Ellipsis';
import { Card, Input, List, message } from 'antd';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import InlineForm from '@/pages/BaseInfo/Company/InlineForm';
import { AuthDiv } from '@/utils/customAuth';
import styles from './CompanyList.less';
import codes from '@/utils/codes';

// 标题
const title = '报警管理';
const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '人员定位', name: '人员定位' },
  { title, name: title },
];

const documentElem = document.documentElement;

const NO_DATA = '暂无信息';
const PAGE_SIZE = 18;

@connect(({ personPositionAlarm, loading }) => ({ personPositionAlarm, loading: loading.effects['personPositionAlarm/fetchCompanyList'] }))
export default class CompanyList extends PureComponent {
  componentDidMount() {
    this.childElem = document.querySelector('#root div');
    document.addEventListener('scroll', this.handleScroll, false);
    this.fetchInitCompanyList();
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
    // console.log(childElem);
    // console.log(documentElem.scrollTop + documentElem.offsetHeight, childElem.offsetHeight);
    // 当页面滚到底部且当前并不在请求数据且数据库还有数据时，才能再次请求
    if (scrollToBottom && !loading && hasMore)
      this.handleLazyload();
  };

  handleSearch = (vals = {}) => {
    this.value = vals.title || '';
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
    const { dispatch } = this.props;

    dispatch({
      type: 'personPositionAlarm/fetchCompanyList',
      payload: {
        pageNum: 1,
        pageSize: PAGE_SIZE,
        name: this.value,
      },
      // 如果第一页已经返回了所有结果，则hasMore置为false
      callback: total => {
        if (total <= PAGE_SIZE)
          this.hasMore = false;
      },
    });
  }

  handleLazyload = () => {
    this.props.dispatch({
      type: 'personPositionAlarm/fetchCompanyList',
      payload: {
        pageNum: this.currentpageNum,
        pageSize: PAGE_SIZE,
        name: this.value,
      },
      callback: total => {
        const currentLength = this.currentpageNum * PAGE_SIZE;
        this.currentpageNum += 1;
        if (currentLength >= total)
          this.hasMore = false;
      },
    });
  };

  handleClick = id => {
    router.push(`/personnel-position/alarm-management/list/${id}`);
  };

  render() {
    const {
      loading,
      personPositionAlarm,
    } = this.props;

    const list =  Array.isArray(personPositionAlarm.companyList) ? personPositionAlarm.companyList : [];

    const FIELDS = [
      {
        id: 'title',
        wrapperCol: { span: 20 },
        inputSpan: { lg: 8, md: 16, sm: 24 },
        render: (callback) => <Input placeholder="请输入企业名称" onPressEnter={callback} />,
        transform: v => v.trim(),
      },
    ];

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={<p className={styles.total}>单位总数：{list.length}</p>}
      >
        <Card style={{ marginBottom: 15 }}>
          <InlineForm
            fields={FIELDS}
            buttonSpan={{ xl: 6, md: 12, sm: 24 }}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
          />
        </Card>
        <List
          rowKey="id"
          loading={loading}
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={item => {
            const {
              id,
              company_id,
              name,
              principalName,
              principalPhone,
              practicalAddress,
            } = item;

            return (
              <List.Item key={id}>
                <AuthDiv code={codes.personnelPosition.alarmManagement.alarmList}>
                  <Card
                    className={styles.card}
                    title={<Ellipsis lines={1} tooltip style={{ height: 24 }}>{name}</Ellipsis>}
                    onClick={e => this.handleClick(company_id)}
                  >
                    <p>
                      主要负责人：
                      {principalName || NO_DATA}
                    </p>
                    <p>
                      联系电话：
                      {principalPhone || NO_DATA}
                    </p>
                    {practicalAddress
                      ? <Ellipsis lines={1} tooltip style={{ height: 24 }}>地址：{practicalAddress}</Ellipsis>
                      : <div>地址：{NO_DATA}</div>
                    }
                  </Card>
                </AuthDiv>
              </List.Item>
            );
          }}
        />
      </PageHeaderLayout>
    );
  }
}
