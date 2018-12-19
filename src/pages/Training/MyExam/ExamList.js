import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import Ellipsis from '@/components/Ellipsis';
import { Card, Input, List, message } from 'antd';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import InlineForm from '@/pages/BaseInfo/Company/InlineForm';
import styles from './ExamList.less';
import qualifiedIcon from './imgs/qualified.png';
import unqualifiedIcon from './imgs/unqualified.png';

// 标题
const title = '我的考试';
const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '教育培训', name: '教育培训' },
  { title, name: title },
];

const documentElem = document.documentElement;

const NO_DATA = '暂无信息';
const PAGE_SIZE = 18;
const TIME_FORMAT = 'YYYY-MM-DD HH:mm';

// const LIST = [...Array(10).keys()].map(i => ({
//   id: i,
//   paperId: i,
//   status: Math.floor(Math.random() * 3) + 1,
//   statusName: '即将开考',
//   name: `试卷${i}`,
//   examStartTime: 10,
//   examEndTime: 60,
//   examLimit: 90,
//   passStatus: 1,
//   percentOfPass: 50,
// }));

@connect(({ myExam, loading }) => ({ myExam, loading: loading.effects['myExam/fetchExamList'] }))
export default class ExamList extends PureComponent {
  componentDidMount() {
    // const { dispatch } = this.props;
    this.childElem = document.querySelector('#root div');
    document.addEventListener('scroll', this.handleScroll, false);
    this.fetchInitExamList();
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
    this.fetchInitExamList();
  };

  handleReset = () => {
    this.value = '';
    this.hasMore = true;
    this.currentpageNum = 2;
    this.fetchInitExamList();
  };

  fetchInitExamList = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'myExam/fetchExamList',
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
      type: 'myExam/fetchExamList',
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

  render() {
    // const list = LIST;
    const {
      loading,
      myExam,
      // myExam: { examList: list=[] },
    } = this.props;

    const list =  Array.isArray(myExam.examList) ? myExam.examList : [];

    const FIELDS = [
      {
        id: 'title',
        wrapperCol: { span: 20 },
        inputSpan: { lg: 8, md: 16, sm: 24 },
        render: (callback) => <Input placeholder="请输入试卷标题" onPressEnter={callback} />,
        transform: v => v.trim(),
      },
    ];

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={<p className={styles.total}>试卷总数：{list.length}</p>}
      >
        <Card style={{ marginBottom: 15 }}>
          <InlineForm
            fields={FIELDS}
            buttonSpan={{ xl: 6, md: 12, sm: 24 }}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
          />
        </Card>
        {/* <div className={styles.cardList}> */}
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={list}
            renderItem={item => {
              const {
                id,
                // now,
                // examId,
                // paperId,
                name,
                status, // 考试状态before("1", "即将开考"),begin("2","开始考试"),goOn("3","继续考试"),commit("4","已交卷"),end("5","考试已结束")
                statusName,
                // startTime,
                // endTime,
                examStartTime,
                examEndTime,
                examLimit,
                passStatus,
                percentOfPass,
              } = item;

            const parsedStatus = Number.parseInt(status, 10);
            let action;

            switch(parsedStatus) {
              case 1:
                action = <span onClick={e => message.warn('考试还未开始！')}>{statusName}</span>;
                break;
              case 2:
              case 3:
                action = <Link to={`/training/my-exam/examing/${id}`}>{statusName}</Link>;
                break;
              case 4:
                action = <span onClick={e => message.warn('考试期限内，已交卷，无法查看！')}>{statusName}</span>;
                break;
              case 5:
                action = <Link to={`/training/my-exam/result/${id}`}>{statusName}</Link>;
                break;
              default:
                action = statusName;
            }

              return (
                <List.Item key={id}>
                  <Card className={styles.card} title={<Ellipsis lines={1} tooltip style={{ height: 24 }}>{name}</Ellipsis>} actions={[action]}>
                    <p>
                      考试期限：
                      {examStartTime && examEndTime ? `${moment(examStartTime).format(TIME_FORMAT)} 到 ${moment(examEndTime).format(TIME_FORMAT)}` : NO_DATA}
                    </p>
                    <p>
                      考试时长：
                      {examLimit || examLimit === 0 ? `${examLimit}分钟` : NO_DATA}
                    </p>
                    <p>
                      合格率：
                      {percentOfPass || percentOfPass === 0 ? `${percentOfPass}%` : NO_DATA}
                    </p>
                    {passStatus !== undefined && passStatus !== null && (
                      <img
                        alt="qualifiedIcon"
                        className={styles.qualified}
                        src={Number.parseInt(passStatus, 10) === 1 ? qualifiedIcon : unqualifiedIcon}
                      />
                    )}
                  </Card>
                </List.Item>
              );
            }}
          />
        {/* </div> */}
      </PageHeaderLayout>
    );
  }
}
