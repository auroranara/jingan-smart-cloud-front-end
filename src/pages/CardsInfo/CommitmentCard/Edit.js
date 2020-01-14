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
import { hasAuthority } from '@/utils/customAuth';
import codes from '@/utils/codes';
// const { Option } = Select;

// 权限
const {
  cardsInfo: {
    commitmentCard: { edit: editCode },
  },
} = codes;
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
    this.state = { selectedUnitId: '', filterMapList: [] };
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

    e.preventDefault();

    validateFields((errors, values) => {
      if (errors) return;
      const { companyId, acceptor, content, name } = values;
      const vals = {
        acceptor,
        content,
        name,
        companyId: companyId.key,
        time: +values.time,
        pointFixInfoList: [{ areaId: values.section, imgType: 5 }],
      };
      dispatch({
        type: `cardsInfo/${id ? 'edit' : 'add'}CommitCard`,
        payload: id ? { id, ...vals } : vals,
        callback: (code, msg) => {
          if (code === 200) {
            message.success('新增成功');
            router.push(LIST_URL);
          } else message.error('新增失败');
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
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ section: undefined });
    this.fetchRiskList({ companyId: e.key });
  };

  render() {
    const {
      loading,
      match: {
        params: { id },
      },
      form: { getFieldDecorator },
      user: {
        currentUser: { permissionCodes, unitType },
      },
      fourColorImage: {
        data: { list = [] },
      },
    } = this.props;

    const editAuth = hasAuthority(editCode, permissionCodes);

    const newRiskList = list.map(({ zoneName, id }) => ({ key: id, value: zoneName }));

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
        type: 'select',
        options: newRiskList,
      },
      {
        name: 'meg',
        label: '提示',
        type: 'component',
        component: (
          <div>
            如果没有做区域划分，请先到
            <a href="#/risk-control/four-color-image/list">风险分区</a>
            中划分区域
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
              disabled={!editAuth}
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
