import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Badge, Row, Col } from 'antd';
import { routerRedux } from 'dva/router';

import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import codesMap from '@/utils/codes';
import { AuthButton } from '@/utils/customAuth';

const { Description } = DescriptionList;

// 标题
const title = '查看违法行为库';

// 面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '执法检查',
    name: '执法检查',
  },
  {
    title: '违法行为库',
    name: '违法行为库',
    href: '/law-enforcement/illegal/list',
  },
  {
    title,
    name: title,
  },
];

// 依据
function LawCard(props) {
  const { lawTypeName, article } = props;
  return (
    <Row>
      <Col span={4}>
        <p>{lawTypeName ? lawTypeName : getEmptyData()}</p>
      </Col>
      <Col span={20}>
        <p>{article ? article : getEmptyData()}</p>
      </Col>
    </Row>
  );
}

/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

@connect(({ illegalDatabase, user, loading }) => ({
  illegalDatabase,
  user,
  loading: loading.models.illegalDatabase,
}))
@Form.create()
export default class IllegalDetabaseDetail extends PureComponent {
  /* 生命周期函数 */
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    // 获取详情
    dispatch({
      type: 'illegalDatabase/fetchIllegalList',
      payload: {
        id,
      },
    });
  }

  // 返回到编辑页面
  goToEdit = id => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/law-enforcement/illegal/edit/${id}`));
  };

  /* 渲染详情 */
  renderDetail = () => {
    const {
      match: {
        params: { id },
      },
      illegalDatabase: {
        data: { list },
      },
    } = this.props;

    const detail = list.find(d => d.id === id) || {};

    const {
      businessTypeName,
      typeCodeName,
      actContent,
      setLaw = [],
      punishLaw = [],
      discretionStandard,
      enable,
      checkObjectIds,
    } = detail;
    return (
      <Card title="违法行为详情" bordered={false}>
        <DescriptionList col={1} style={{ marginBottom: 16 }}>
          <Description term="业务分类">{businessTypeName || getEmptyData()}</Description>
          <Description term="所属类别">{typeCodeName || getEmptyData()}</Description>
          <Description term="违法行为">{actContent || getEmptyData()}</Description>
          <Description term="设定依据">
            {setLaw.map(item => {
              const { lawTypeName, article } = item;
              return <LawCard lawTypeName={lawTypeName} article={article} />;
            })}
          </Description>
          <Description term="处罚依据">
            {punishLaw.map(item => {
              const { lawTypeName, article } = item;
              return <LawCard lawTypeName={lawTypeName} article={article} />;
            })}
          </Description>
          <Description term="裁量基准">{discretionStandard || getEmptyData()}</Description>
          <Description term="是否启用">
            {+enable === 1 ? (
              <span>
                <Badge status="success" />
                启用
              </span>
            ) : (
              (
                <span>
                  <Badge status="error" />
                  禁用
                </span>
              ) || getEmptyData()
            )}
          </Description>
          <Description term="检查内容">{checkObjectIds || getEmptyData()}</Description>
        </DescriptionList>
        <div style={{ textAlign: 'center' }}>
          <AuthButton
            type="primary"
            size="large"
            code={codesMap.lawEnforcement.illegal.edit}
            onClick={() => {
              this.goToEdit(id);
            }}
          >
            编辑
          </AuthButton>
        </div>
      </Card>
    );
  };

  render() {
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderDetail()}
      </PageHeaderLayout>
    );
  }
}
