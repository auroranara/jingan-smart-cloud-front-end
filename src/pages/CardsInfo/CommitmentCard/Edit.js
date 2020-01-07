import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
// import moment from 'moment';
import { Button, Card, Form, Select, message } from 'antd';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { renderSections } from '@/pages/SafetyKnowledgeBase/MSDS/utils';
import { BREADCRUMBLIST, LIST_URL, handleDetails } from './utils';
import { isCompanyUser } from '@/pages/RoleAuthorization/Role/utils';
import styles from '@/pages/CardsInfo/EmergencyCard/TableList.less';
const { Option } = Select;

@connect(({ user, cardsInfo, fourColorImage, loading }) => ({
  user,
  cardsInfo,
  fourColorImage,
  loading: loading.models.cardsInfo,
}))
@Form.create()
export default class Edit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { selectedUnitId: '', riskId: undefined, filterMapList: [] };
  }

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
      form: { setFieldsValue },
      user: {
        currentUser: { unitType, companyId, companyName },
      },
    } = this.props;
    if (id) {
      this.getDetail(id);
    } else if (isCompanyUser(+unitType)) {
      this.fetchRiskList({ companyId: companyId });
      setFieldsValue({ companyId: { key: companyId, label: companyName } });
    }
  }

  // 获取风险分区列表
  fetchRiskList = (params, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'fourColorImage/fetchList',
      payload: {
        ...params,
        pageNum: 1,
        pageSize: 24,
      },
      callback,
    });
  };

  getDetail = id => {
    const {
      dispatch,
      form: { setFieldsValue },
    } = this.props;
    dispatch({
      type: 'cardsInfo/getCommitCard',
      payload: id,
      callback: detail => {
        setFieldsValue(handleDetails(detail));
        this.fetchRiskList({ companyId: detail.companyId });
        this.setState({ riskId: detail.pointFixInfoList.map(item => item.areaId).join('') });
      },
    });
  };

  handleSubmit = e => {
    const {
      dispatch,
      form: { validateFields },
      match: {
        params: { id },
      },
    } = this.props;

    const { riskId } = this.state;

    e.preventDefault();
    if (!riskId) return message.warning('注：风险分区不能为空！');
    validateFields((errors, values) => {
      if (errors) return;

      const vals = {
        companyId: values.companyId.key,
        time: +values.time,
        pointFixInfoList: [{ areaId: riskId, imgType: 5 }],
        ...values,
      };
      dispatch({
        type: `cardsInfo/${id ? 'edit' : 'add'}CommitCard`,
        payload: id ? { id, ...vals } : vals,
        callback: (code, msg) => {
          if (code === 200) {
            message.success('操作成功');
            router.push(LIST_URL);
          } else message.error(msg);
        },
      });
    });
  };

  isDetail = () => {
    const {
      match: { url },
    } = this.props;
    return url && url.includes('view');
  };

  onSelectChange = e => {
    this.setState({ riskId: '', selectedUnitId: e.key }, () => {
      this.fetchRiskList({ companyId: e.key });
    });
  };

  handleRiskChange = e => {
    this.setState({ riskId: e });
  };

  render() {
    const {
      loading,
      match: {
        params: { id },
      },
      form: { getFieldDecorator },
      user: {
        currentUser: { unitType },
      },
      fourColorImage: {
        data: { list = [] },
      },
    } = this.props;
    const { riskId } = this.state;
    const isDet = this.isDetail();
    const title = isDet ? '详情' : id ? '编辑' : '新增';
    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title, name: title });
    const handleSubmit = isDet ? null : this.handleSubmit;
    const isComUser = isCompanyUser(+unitType);

    const formItems = [
      {
        name: 'companyId',
        label: '单位名称',
        type: 'companyselect',
        disabled: isComUser,
        wrapperClassName: isComUser ? styles.disappear : undefined,
        onSelectChange: e => this.onSelectChange(e),
      },
      { name: 'name', label: '承诺卡名称' },
      { name: 'content', label: '承诺卡内容', type: 'text' },
      { name: 'acceptor', label: '承诺人' },
      { name: 'time', label: '时间', type: 'datepicker' },
      {
        name: 'section',
        label: '风险分区',
        type: 'component',
        required: true,
        component: (
          <div>
            <Select onChange={this.handleRiskChange} placeholder="请选择风险分区" value={riskId}>
              {list.map(({ zoneName, id }) => {
                return (
                  <Option key={id} value={id}>
                    {zoneName}
                  </Option>
                );
              })}
            </Select>
            <span>如果没有做区域划分，请先到风险分区中划分区域</span>
          </div>
        ),
      },
    ];
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        <Card style={{ marginBottom: 15 }}>
          {renderSections(formItems, getFieldDecorator, handleSubmit, LIST_URL, loading)}
          {isDet ? (
            <Button
              type="primary"
              style={{ marginLeft: '45%' }}
              onClick={e => router.push(`/cards-info/commitment-card/edit/${id}`)}
            >
              编辑
            </Button>
          ) : null}
        </Card>
      </PageHeaderLayout>
    );
  }
}
