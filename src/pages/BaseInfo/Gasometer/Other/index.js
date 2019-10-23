import React, { Component, Fragment } from 'react';
import { Button, Spin, message } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import CustomForm from '@/jingan-components/CustomForm';
import CompanySelect from '@/jingan-components/CompanySelect';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import router from 'umi/router';
import { connect } from 'dva';
import debounce from 'lodash-decorators/debounce';
import bind from 'lodash-decorators/bind';
import {
  TITLE,
  LIST_PATH,
  EDIT_CODE,
  EDIT_PATH,
} from '../List';
import styles from './index.less';

const GET_DETAIL = 'gasometer/getDetail';
const ADD = 'gasometer/add';
const EDIT = 'gasometer/edit';
const SPAN = { span: 24 };
const LABEL_COL = { span: 4 };

@connect(({
  user,
  gasometer: {
    detail,
  },
  loading,
}) => ({
  user,
  detail,
  loading: loading.effects[GET_DETAIL],
  adding: loading.effects[ADD],
  editing: loading.effects[EDIT],
}), (dispatch) => ({
  getDetail(payload, callback) {
    dispatch({
      type: GET_DETAIL,
      payload,
      callback,
    });
  },
  setDetail() {
    dispatch({
      type: 'save',
      payload: {
        detail: {},
      },
    });
  },
  add(payload, callback) {
    dispatch({
      type: ADD,
      payload,
      callback,
    });
  },
  edit(payload, callback) {
    dispatch({
      type: EDIT,
      payload,
      callback,
    });
  },
}))
export default class GasometerOther extends Component {
  componentDidMount() {
    const { getDetail, setDetail, match: { params: { id } } } = this.props;
    setDetail();
    if (id) {
      getDetail({
        id,
      }, this.refresh);
    }
  }

  getType = () => {
    console.log(this.props);
    return 'add';
  }

  getTitle = (type) => {
    return ({
      add: '新增气柜',
      edit: '编辑气柜',
      detail: '气柜详情',
    })[type];
  }

  getBreadcrumbList = (title) => {
    return [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '一企一档',
        name: '一企一档',
      },
      {
        title: TITLE,
        name: TITLE,
        href: LIST_PATH,
      },
      {
        title: title,
        name: title,
      },
    ];
  }

  setFormReference = form => {
    this.form = form;
  }

  @bind()
  @debounce(300)
  refresh = () => {
    this.forceUpdate();
  }

  // 返回按钮点击事件
  handleBackButtonClick = () => {
    router.goBack();
  }

  // 提交按钮点击事件
  handleSubmitButtonClick = () => {
    const {
      add,
      edit,
      user: {
        currentUser: {
          unitType,
          unitId,
        },
      },
      detail: {
        id,
      }={},
    } = this.props;
    const { validateFieldsAndScroll } = this.form;
    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        const { company, ...rest } = values;
        const payload = {
          id,
          companyId: +unitType !== 4 ? company.key : unitId,
          ...rest,
        };
        (id ? edit : add)(payload, (isSuccess) => {
          if (isSuccess) {
            message.success(`${id ? '编辑' : '新增'}成功！`);
            router.push(LIST_PATH);
          } else {
            message.error(`${id ? '编辑' : '新增'}失败，请稍后重试！`);
          }
        });
      }
    });
  }

  // 编辑按钮点击事件
  handleEditButtonClick = () => {
    const { match: { params: { id } } } = this.props;
    router.push(`${EDIT_PATH}${EDIT_PATH.endsWith('/') ? id : `/${id}`}`);
    window.scrollTo(0, 0);
  }

  render() {
    const {
      user: {
        currentUser: {
          permissionCodes,
          unitType,
          unitId,
        },
      },
      detail: {
        companyId,
        companyName,
      }={},
      loading,
      adding,
      editing,
    } = this.props;
    const isNotCompany = unitType !== 4;
    const hasEditAuthority = permissionCodes.includes(EDIT_CODE);
    const type = this.getType();
    const title = this.getTitle(type);
    const breadcrumbList = this.getBreadcrumbList(title);
    const isNotDetail = type !== 'detail';
    const isEdit = type === 'edit';
    const fields = [
      {
        key: '1',
        fields: [
          ...(isNotCompany ? [{
            id: 'company',
            label: '单位名称',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => isNotDetail ? <CompanySelect disabled={isEdit} className={styles.item} /> : <span>{companyName}</span>,
            options: {
              initialValue: companyId && { key: companyId, label: companyName },
              rules: isNotDetail ? [
                {
                  required: true,
                  message: '单位名称不能为空',
                  transform: value => value && value.label,
                },
              ] : undefined,
            },
          }] : []),
        ],
      },
    ];


    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        <Spin spinning={loading || false}>
          <CustomForm
            mode="multiple"
            fields={fields}
            searchable={false}
            resetable={false}
            refresh={this.refresh}
            action={(
              <Fragment>
                <Button onClick={this.handleBackButtonClick}>返回</Button>
                {isNotDetail ? (
                  <Button type="primary" onClick={this.handleSubmitButtonClick} loading={adding || editing || false}>提交</Button>
                ) : (
                  <Button type="primary" onClick={this.handleEditButtonClick} disabled={!hasEditAuthority}>编辑</Button>
                )}
              </Fragment>
            )}
            ref={this.setFormReference}
          />
        </Spin>
      </PageHeaderLayout>
    );
  }
}
