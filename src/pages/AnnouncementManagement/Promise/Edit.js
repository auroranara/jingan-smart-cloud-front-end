import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, message, Input, Button, DatePicker } from 'antd';
import moment from 'moment';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { renderSections } from '@/pages/SafetyKnowledgeBase/MSDS/utils';
import CompanyModal from '@/pages/BaseInfo/Company/CompanyModal';
import { BREADCRUMBLIST, EDIT_FORMITEMS, LIST_URL } from './utils';
import { genGoBack } from '@/utils/utils';

@connect(({ loading, twoInformManagement, company, user }) => ({
  company,
  twoInformManagement,
  companyLoading: loading.effects['company/fetchModelList'],
  user,
}))
@Form.create()
export default class Edit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedCompany: {},
      detailList: {},
    };
    this.goBack = genGoBack(props, LIST_URL);
  }

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    id && this.getDetail();
  }

  fetchCompany = ({ payload }) => {
    const { dispatch } = this.props;
    dispatch({ type: 'company/fetchModelList', payload });
  };

  handleSelectCompany = selectedCompany => {
    const {
      form: { setFieldsValue },
    } = this.props;
    this.setState({ selectedCompany, companyModalVisible: false });
    setTimeout(() => setFieldsValue({ companyId: selectedCompany.id }), 0.3);
  };

  handleViewCompanyModal = () => {
    this.setState({ companyModalVisible: true });
    this.fetchCompany({
      payload: {
        pageSize: 10,
        pageNum: 1,
      },
    });
  };

  getDetail = () => {
    const {
      dispatch,
      match: {
        params: { id },
      },
      form: { setFieldsValue },
    } = this.props;
    dispatch({
      type: 'twoInformManagement/fetchSafetyPromiseList',
      payload: {
        id,
        pageSize: 10,
        pageNum: 1,
      },
      callback: ({ list }) => {
        const [{ companyId, companyName, allContent, createTime }] = list;
        const arrayData = allContent.split(',');
        const filterList = {
          companyId,
          total: arrayData[0],
          run: arrayData[1],
          stop: arrayData[2],
          checking: arrayData[3],
          levelTwo: arrayData[4],
          levelOne: arrayData[5],
          specialWork: arrayData[6],
          high: arrayData[7],
          limitedSpace: arrayData[8],
          ground: arrayData[9],
          short: arrayData[10],
          breaker: arrayData[11],
          wall: arrayData[12],
          electricity: arrayData[13],
          other: arrayData[14],
          pilot: +arrayData[15],
          driving: +arrayData[16],
          safe: +arrayData[17],
          submitter: arrayData[18],

        };
        this.setState(
          {
            detailList: filterList,
            createTime,
            selectedCompany: { id: companyId, name: companyName },
          },
          () => {
            setFieldsValue(this.state.detailList);
          }
        );
      },
    });
  };

  // goBack = () => {
  //   router.push(LIST_URL);
  // };

  handleSubmit = e => {
    const {
      dispatch,
      form: { validateFieldsAndScroll },
      match: {
        params: { id },
      },
      user: {
        currentUser: { unitType, companyId: hasUnitID },
      },
    } = this.props;
    const { selectedCompany } = this.state;

    e.preventDefault();

    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        const {
          companyId,
          total,
          run,
          stop,
          checking,
          specialWork,
          levelOne,
          levelTwo,
          high,
          limitedSpace,
          ground,
          short,
          breaker,
          wall,
          electricity,
          other,
          pilot,
          driving,
          safe,
          submitter,
        } = values;
        const payload = {
          id,
          companyId: unitType === 4 ? hasUnitID : selectedCompany.id || companyId,
          allContent:
            total +
            ',' +
            run +
            ',' +
            stop +
            ',' +
            checking +
            ',' +
            levelTwo +
            ',' +
            levelOne +
            ',' +
            specialWork +
            ',' +
            high +
            ',' +
            limitedSpace +
            ',' +
            ground +
            ',' +
            short +
            ',' +
            breaker +
            ',' +
            wall +
            ',' +
            electricity +
            ',' +
            other +
            ',' +
            pilot +
            ',' +
            driving +
            ',' +
            safe +
            ',' +
            submitter,
        };

        const success = () => {
          const msg = id ? '编辑成功' : '新增成功';
          message.success(msg, 1, () => setTimeout(this.goBack, 1000));
        };

        const error = () => {
          message.error(id ? '编辑失败' : '新增失败');
        };

        if (id) {
          dispatch({
            type: 'twoInformManagement/fetchSafetyPromiseEdit',
            payload,
            success,
            error,
          });
        } else {
          dispatch({
            type: 'twoInformManagement/fetchSafetyPromiseAdd',
            payload,
            success,
            error,
          });
        }
      }
    });
  };

  render() {
    const {
      companyLoading,
      match: {
        params: { id },
      },
      form: { getFieldDecorator },
      company: { companyModal },
      user: {
        currentUser: { unitType, companyId },
      },
    } = this.props;

    const { selectedCompany, companyModalVisible, createTime } = this.state;

    const COMPANYFORM = [
      {
        name: 'companyId',
        label: '单位名称',
        type: 'component',
        component: getFieldDecorator('companyId', {
          initialValue: companyId,
          rules: [{ required: true, message: '单位名称不能为空' }],
        })(
          <Fragment>
            <Input
              style={{ width: 'calc(100% - 98px)', marginRight: '10px' }}
              disabled
              value={selectedCompany.name}
              placeholder="请选择单位名称"
            />
            <Button type="primary" onClick={this.handleViewCompanyModal}>
              选择单位
            </Button>
          </Fragment>
        ),
      },
    ];

    const dataColumns = [
      {
        name: 'submitTime',
        label: '日期',
        type: 'component',
        component: getFieldDecorator('submitTime', {
          initialValue: !id ? moment() : createTime ? moment(+createTime) : undefined,
        })(<DatePicker disabled format={'YYYY-MM-DD'} />),
      },
    ];

    const title = id ? '编辑' : '新增';
    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title, name: title });
    const handleSubmit = this.handleSubmit;

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        <Card style={{ marginBottom: 15 }}>
          {renderSections(
            unitType === 4
              ? [...EDIT_FORMITEMS, ...dataColumns]
              : [...COMPANYFORM, ...EDIT_FORMITEMS, ...dataColumns],
            getFieldDecorator,
            handleSubmit,
            LIST_URL,
            undefined,
            undefined,
            !id,
          )}
        </Card>
        <CompanyModal
          title="选择单位"
          loading={companyLoading}
          visible={companyModalVisible}
          modal={companyModal}
          fetch={this.fetchCompany}
          onSelect={this.handleSelectCompany}
          onClose={() => {
            this.setState({ companyModalVisible: false });
          }}
        />
      </PageHeaderLayout>
    );
  }
}
