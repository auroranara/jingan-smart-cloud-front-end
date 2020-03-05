import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
// import moment from 'moment';
import { Button, Card, Select, message } from 'antd';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { renderSections } from '@/pages/SafetyKnowledgeBase/MSDS/utils';
import { BREADCRUMBLIST, LIST_URL, handleDetails } from './utils';
import { isCompanyUser } from '@/pages/RoleAuthorization/Role/utils';
import styles from '@/pages/CardsInfo/EmergencyCard/TableList.less';
import Map from '../../RiskControl/FourColorImage/Map';
import { hasAuthority } from '@/utils/customAuth';
import style from './TableList.less';
import codes from '@/utils/codes';
// const { Option } = Select;

// 权限
const {
  cardsInfo: {
    commitmentCard: { edit: editCode },
  },
} = codes;
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
    this.state = { selectedUnitId: '', filterMapList: [], mapInfo: {}, mapList: [] };
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
      this.fetchMap({ companyId: companyId }, mapInfo => {
        this.setState({ mapInfo: mapInfo });
      });
      setFieldsValue({ companyId: { key: companyId, label: companyName } });
    }
  }

  onRef = ref => {
    this.childMap = ref;
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

  // 获取地图
  fetchMap = (params, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'map/fetchMapList',
      payload: { ...params },
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
        this.fetchMap({ companyId: detail.companyId }, mapInfo => {
          this.setState({ mapInfo: mapInfo });
        });
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
            message.success(id ? '编辑成功' : '新增成功');
            router.push(LIST_URL);
          } else message.error(id ? '编辑失败' : '新增失败');
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

  // 单位切换选择
  onSelectChange = e => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ section: undefined });
    this.fetchMap({ companyId: e.key }, mapInfo => {
      if (!mapInfo.mapId) return;
      this.setState({ mapInfo: mapInfo });
    });
    this.fetchRiskList({ companyId: e.key });
  };

  // 风险分区切换选择
  handleRiskChange = e => {
    // const {
    //   fourColorImage: {
    //     data: { list = [] },
    //   },
    // } = this.props;
    // const mapList = list.filter(item => item.id === e);
    // this.setState({ mapList }, () => {
    //   this.childMap.restModelColor(e, mapList);
    // });
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

    const { mapInfo, mapList } = this.state;

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
        onChange: e => this.handleRiskChange(e),
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
      // {
      //   name: 'map',
      //   label: '地图',
      //   type: 'component',
      //   component:
      //     list.length > 0 ? (
      //       <div className={style.mapLocation}>
      //         <Map pointList={list} onRef={this.onRef} mapInfo={mapInfo} init cardStyle />
      //       </div>
      //     ) : (
      //       '该单位暂无地图'
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
