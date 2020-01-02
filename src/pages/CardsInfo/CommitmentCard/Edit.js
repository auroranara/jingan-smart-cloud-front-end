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
import Map from '../../RiskControl/FourColorImage/Map';
const { Option } = Select;

@connect(({ user, cardsInfo, map, fourColorImage, loading }) => ({
  user,
  cardsInfo,
  map,
  fourColorImage,
  loading: loading.models.cardsInfo,
}))
@Form.create()
export default class Edit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { selectedUnitId: '', riskId: '', filterMapList: [] };
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
    const payload = {
      pageNum: 1,
      pageSize: 24,
    };
    if (unitType === 4) {
      this.fetchRiskList({ ...payload, companyId: companyId });
      this.fetchMap({ companyId: companyId }, mapInfo => {
        this.childMap.initMap({ ...mapInfo });
      });
    }
    if (id) this.getDetail(id);
    else if (isCompanyUser(+unitType))
      setFieldsValue({ companyId: { key: companyId, label: companyName } });
  }

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
    validateFields((errors, values) => {
      if (errors) return;

      const vals = {
        ...values,
        companyId: values.companyId.key,
        time: +values.time,
        pointFixInfoList: [{ areaId: riskId }],
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
    this.setState({ selectedUnitId: e.key }, () => {
      this.fetchMap({ companyId: e.key }, mapInfo => {
        this.childMap.initMap({ ...mapInfo });
      });
      this.fetchRiskList({ companyId: e.key });
    });
  };

  handleRiskChange = e => {
    this.setState({ riskId: e });
    this.childMap.selectedModelColor(
      e,
      setTimeout(() => {
        this.childMap.restModelColor(e);
      }, 2000)
    );
  };

  onRef = ref => {
    this.childMap = ref;
  };

  // 获取地图
  fetchMap = (params, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'map/fetchMapList',
      payload: { ...params },
      callback,
    });
  };

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
          <Fragment>
            <Select onChange={this.handleRiskChange}>
              {list.map(({ zoneName, id }) => {
                return (
                  <Option key={id} value={id}>
                    {zoneName}
                  </Option>
                );
              })}
            </Select>
            <span>提示：如果没有做区域划分，请先到风险分区中划分区域</span>
          </Fragment>
        ),
      },
      // {
      //   name: 'map',
      //   label: '地图',
      //   type: 'component',
      //   component:
      //     list.length > 0 ? (
      //       <div className={styles.mapLoaction}>
      //         <Map onRef={this.onRef} height={'42vh'} width={'92vh'} pointList={list} />
      //       </div>
      //     ) : (
      //       <span>该单位暂无地图</span>
      //     ),
      // },
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
