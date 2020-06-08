import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form } from '@ant-design/compatible';
import { Card, Button } from 'antd';

import '@ant-design/compatible/assets/index.css';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { hasAuthority } from '@/utils/customAuth';
import codes from '@/utils/codes';
import styles from './detail.less';
import { BREADCRUMBLIST, LIST_URL, ROUTER } from './utils';

// 权限
const {
  announcementManagement: {
    promise: { edit: editAuth },
  },
} = codes;

@connect(({ loading, twoInformManagement, user }) => ({
  twoInformManagement,
  companyLoading: loading.effects['company/fetchModelList'],
  user,
}))
@Form.create()
export default class Detail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      detailList: [],
      createTime: '',
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    id && this.getDetail();
  }

  getDetail = () => {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch({
      type: 'twoInformManagement/fetchSafetyPromiseList',
      payload: {
        id,
        pageSize: 10,
        pageNum: 1,
      },
      callback: ({ list }) => {
        const [{ allContent, createTime }] = list;
        const arrayData = allContent.split(',');
        this.setState({
          detailList: arrayData,
          createTime: createTime,
        });
      },
    });
  };

  // 渲染单位详情
  renderInfo() {
    const {
      match: {
        params: { id },
      },
      user: {
        currentUser: { permissionCodes },
      },
    } = this.props;

    const { detailList, createTime } = this.state;
    const editCode = hasAuthority(editAuth, permissionCodes);

    return (
      <Card title="安全承诺公告牌" bordered={false} className={styles.card}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.left}>企业状态:</div>
            <div className={styles.right}>
              <div className={styles.item}>
                生产装置
                <span className={styles.label}>{detailList[0]}</span>
                套，其中
              </div>
              <div className={styles.item}>
                运行
                <span className={styles.label}>{detailList[1]}</span>
                套，停产
                <span className={styles.label}>{detailList[2]}</span>
                套，检修
                <span className={styles.label}>{detailList[3]}</span>套
              </div>
              <div className={styles.item}>
                特殊、一级、二级动火作业各
                <span className={styles.label}>{detailList[4]}</span>、
                <span className={styles.label}>{detailList[5]}</span>、
                <span className={styles.label}>{detailList[6]}</span>处
              </div>
              <div className={styles.item}>
                进入受限空间作业
                <span className={styles.label}>{detailList[7]}</span>处
              </div>
              <div className={styles.item}>
                是否处于试生产{' '}
                <span className={styles.label}>{detailList[8] === '0' ? '否' : '是'}</span>
              </div>
              <div className={styles.item}>
                是否处于开停车状态{' '}
                <span className={styles.label}>{detailList[9] === '0' ? '否' : '是'}</span>
              </div>
              <div className={styles.item}>
                储罐、仓库等重大危险源是否处于安全状态{' '}
                <span className={styles.label}>{detailList[10] === '0' ? '否' : '是'}</span>
              </div>
            </div>
          </div>
          <div className={styles.bottom}>
            <div className={styles.left}>安全承诺：</div>
            <div className={styles.right}>
              <div className={styles.item}>
                今天我公司已进行安全风险研判，各项安全风险防控措施已落实到位，我承诺所有
              </div>
              <div className={styles.item}>
                生产装置处于安全运行状态，罐区、仓库等重大危险源安全风险得到有效管控。
              </div>
              <div className={styles.personLabel}>
                主要负责人：
                <span className={styles.label}>{detailList[11]}</span>
              </div>
              <div className={styles.personLabel}>{moment(+createTime).format('YYYY-MM-DD')}</div>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Button
            // style={{ marginLeft: '50%', transform: 'translateX(-50%)', marginTop: '24px' }}
            // size="large"
            // href={`#${LIST_URL}`}
            style={{ marginRight: 10 }}
            onClick={e => window.close()}
          >
            返回
          </Button>
          <Button
            // style={{ marginLeft: '50%', transform: 'translateX(-50%)', marginTop: '24px' }}
            type="primary"
            // size="large"
            disabled={!editCode}
            href={`#${ROUTER}/edit/${id}`}
          >
            编辑
          </Button>
        </div>
      </Card>
    );
  }

  render() {
    //面包屑
    const title = '详情';
    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title, name: title });

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderInfo()}
      </PageHeaderLayout>
    );
  }
}
