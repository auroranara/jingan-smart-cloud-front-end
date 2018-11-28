import React, { PureComponent } from 'react';
import { Card, Row, Col, Divider } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Resource from '@/components/Resource';
import moment from 'moment';

import style from './Courseware.less';

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '教育培训', name: '教育培训' },
  { title: '学习管理', name: '学习管理', href: '/training/learning/courseware/list' },
  { title: '课件学习', name: '课件学习' },
];

function getTime(t) {
  return moment(t).format('YYYY-MM-DD HH:mm:ss ');
}

/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

@connect(({ learning }) => ({
  learning,
}))
export default class LearningLayout extends PureComponent {
  state = {
    styles: {
      width: '100%',
      height: 500,
    },
    fileSrc: null, // 预览课件地址
    coverSrc: null, // 预览课件封面地址
    fileType: null, // 课件类型
  };

  // 挂载后
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;

    // 获取详情
    dispatch({
      type: 'learning/fetch',
      payload: {
        id,
      },
      success: ({ list }) => {
        const { webFileUrl, webVideoCover, fileUrl } = list[0];
        this.setState({
          fileSrc: webFileUrl[0],
          coverSrc: webVideoCover && webVideoCover.length > 0 ? webVideoCover[0] : null,
          fileType: fileUrl.split('.').pop(),
        });
      },
    });
    dispatch({
      type: 'learning/featchReadRecord',
      payload: {
        trainingId: id,
      },
    });
  }

  handleContent = () => {
    this.setState({
      visible: true,
    });
  };

  render() {
    const {
      match: {
        params: { id },
      },
      learning: {
        data: { list },
      },
    } = this.props;
    const { fileSrc, fileType, coverSrc, styles } = this.state;
    const detail = list.find(d => d.id === id) || {};

    const { name, createTime, totalPerson, totalRead, content, type } = detail;

    return (
      <PageHeaderLayout title="课件学习" breadcrumbList={breadcrumbList}>
        <Row gutter={16} className={style.learningCourseWare}>
          <Col>
            <Card>
              <div className={style.detailTitle}>
                <span>{name}</span>
              </div>
              <div className={style.detailSecond}>
                <span>发布时间 : {getTime(createTime)}</span>
                <Divider type="vertical" />
                <span>
                  阅读人数：
                  {totalPerson}
                </span>
                <Divider type="vertical" />
                <span>
                  阅读次数：
                  {totalRead}
                </span>
              </div>
              <div className={style.detailMain}>
                <div className={style.resource}>
                  {+type === 3 ? (
                    <Resource src={fileSrc} styles={styles} extension={fileType} />
                  ) : (
                      <Resource
                        src={fileSrc}
                        styles={styles}
                        poster={coverSrc}
                        extension={fileType}
                        fluid={false}
                      />
                    )}
                </div>
                <div>
                  <h3 className={style.contentDetail}>
                    详细内容：
                    <p>{content || getEmptyData()}</p>
                  </h3>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
