import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, message, Input, Button, Col, Tooltip } from 'antd';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { BREADCRUMBLIST, LIST_URL } from '../other/utils';
import CompanyModal from '@/pages/BaseInfo/Company/CompanyModal';
import { isCompanyUser } from '@/pages/RoleAuthorization/Role/utils';
import CompanySelect from '@/jingan-components/CompanySelect';
import styles from './index.less';
@connect(({ user, realNameCertification, visitorRegistration, loading }) => ({
  user,
  visitorRegistration,
  realNameCertification,
  loading: loading.models.visitorRegistration,
  cardLoading: loading.effects['realNameCertification/fetchTagCardList'],
}))
@Form.create()
export default class Edit extends PureComponent {
  state = {
    cardList: [], // 卡列表
    visible: false, // 是否显示弹框
    curCompanyId: '',
    curIndex: '',
    curList: {},
  };

  componentDidMount() {
    const {
      form: { setFieldsValue },
      user: {
        currentUser: { unitType, companyId, companyName },
      },
    } = this.props;
    if (isCompanyUser(+unitType)) {
      this.setState({ curCompanyId: companyId });
      setFieldsValue({ companyId: { key: companyId, label: companyName } });
    }
  }

  handleBack = () => {
    router.push(`${LIST_URL}`);
  };

  handleSubmit = e => {
    const {
      form: { validateFields },
      user: {
        currentUser: { unitType, companyId: unitId },
      },
      dispatch,
    } = this.props;
    e.preventDefault();
    const { cardList } = this.state;
    validateFields((errors, values) => {
      if (errors) return;
      const { companyId } = values;
      const vals = {
        companyId: unitType !== 4 ? companyId.key : unitId,
        labelCardList: cardList,
      };

      const callback = (success, msg) => {
        if (success) {
          message.success(`新增成功`);
          router.push(LIST_URL);
        } else {
          message.error(msg);
        }
      };

      dispatch({
        type: `visitorRegistration/fetchCardAdd`,
        payload: vals,
        callback,
      });
    });
  };

  // 获取companyId
  handleCompanyChange = company => {
    this.setState({ curCompanyId: company.key, cardList: [] });
  };

  // 新增卡
  handleCardAdd = () => {
    const { cardList } = this.state;
    const nextCardList = cardList.concat({ id: '' });
    this.setState({ cardList: nextCardList });
  };

  // 删除当前卡
  handleCardDel = key => {
    const { cardList } = this.state;
    this.setState({ cardList: cardList.filter((item, index) => index !== key) });
  };

  // 显示Modal
  handleCardModal = (curList, index) => {
    this.setState({ visible: true, curIndex: index, curList: curList });
    this.fetchCardList({});
  };

  // 获取IC卡和SN卡列表
  fetchCardList = ({ payload }) => {
    const { curCompanyId } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'realNameCertification/fetchTagCardList',
      payload: {
        ...payload,
        pageNum: 1,
        pageSize: 0,
        personCar: 3,
        status: 1,
        companyId: curCompanyId,
      },
    });
  };

  // 输入值改变
  handleInputChange = (item, value, i, key) => {
    item[key] = value;
    this.setState(({ cardList }) => {
      let temp = [...cardList];
      temp.splice(i, 1, item);
      return { cardList: temp };
    });
  };

  // 确定卡号
  handleCardSelect = value => {
    const {
      form: { setFieldsValue },
    } = this.props;
    const { curIndex, curList } = this.state;
    setFieldsValue({
      [`cardNum${curIndex}`]: value.icNumber + '/' + value.snNumber,
    });

    curList['icNumber'] = value.icNumber;
    curList['snNumber'] = value.snNumber;
    curList['id'] = value.id;
    this.setState(({ cardList }) => {
      let temp = [...cardList];
      temp.splice(curIndex, 1, curList);
      return { cardList: temp };
    });
    this.handleCardClose();
  };

  // 关闭Modal
  handleCardClose = () => {
    this.setState({ visible: false });
  };

  render() {
    const {
      cardLoading,
      match: {
        params: { id },
      },
      form: { getFieldDecorator },
      user: {
        currentUser: { unitType, companyId },
      },
      realNameCertification: {
        tagCardData: { list = [], pagination },
      },
    } = this.props;

    const { cardList, visible, curCompanyId } = this.state;

    const filterId = cardList.map(item => item.id).filter(item => item !== '');
    const filterData = {
      list: list.filter(item => filterId && !filterId.includes(item.id)),
      pagination,
    };

    const isCompanyId = curCompanyId || companyId;
    const title = id ? '编辑' : '新增';
    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title, name: title });
    const isComUser = isCompanyUser(+unitType);

    const formItemCol = {
      labelCol: {
        span: 7,
      },
      wrapperCol: {
        span: 14,
      },
    };

    const buttonItemLayout = {
      wrapperCol: {
        span: 14,
        offset: 7,
      },
    };

    const itemStyles = { style: { width: '75%', marginRight: '10px' } };

    const field = [
      {
        id: 'icNumber',
        render() {
          return <Input placeholder="请输入IC卡" />;
        },
        transform(value) {
          return value.trim();
        },
      },
      {
        id: 'snNumber',
        render() {
          return <Input placeholder="请输入SN卡" />;
        },
        transform(value) {
          return value.trim();
        },
      },
    ];
    const columns = [
      {
        title: 'IC卡',
        dataIndex: 'icNumber',
        key: 'icNumber',
      },
      {
        title: 'SN卡',
        dataIndex: 'snNumber',
        key: 'snNumber',
      },
    ];
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        <Card style={{ marginBottom: 15 }}>
          <Form>
            {!isComUser && (
              <Form.Item label="单位名称" {...formItemCol}>
                {getFieldDecorator('companyId', {
                  rules: [
                    {
                      required: true,
                      message: '请选择单位名称',
                      transform: value => value && value.label,
                    },
                  ],
                })(
                  <CompanySelect
                    {...itemStyles}
                    placeholder="请选择"
                    onChange={this.handleCompanyChange}
                  />
                )}
              </Form.Item>
            )}
            {cardList.map((item, index) => (
              <Col key={index} className={styles.colStyle}>
                <Form.Item label="卡名称" {...formItemCol}>
                  {getFieldDecorator(`name${index}`, {
                    rules: [
                      {
                        required: true,
                        message: '请输入卡名称',
                      },
                    ],
                  })(
                    <Input
                      {...itemStyles}
                      onChange={e => {
                        this.handleInputChange(item, e.target.value, index, 'cardName');
                      }}
                      placeholder="请输入"
                    />
                  )}
                  <Tooltip title="删除">
                    <LegacyIcon type="minus-circle" onClick={() => this.handleCardDel(index)} />
                  </Tooltip>
                </Form.Item>
                <Form.Item label="选择卡" {...formItemCol}>
                  {getFieldDecorator(`cardNum${index}`, {
                    rules: [
                      {
                        required: true,
                        message: '请输入卡名称',
                      },
                    ],
                  })(
                    <Input
                      {...itemStyles}
                      placeholder="请选择"
                      disabled
                      addonAfter={
                        <span
                          style={{ cursor: 'pointer', color: '#' }}
                          onClick={() =>
                            !isCompanyId
                              ? message.warning('请先选择单位！')
                              : this.handleCardModal(item, index)
                          }
                        >
                          选择
                        </span>
                      }
                    />
                  )}
                </Form.Item>
              </Col>
            ))}
            <Form.Item {...buttonItemLayout}>
              <Button type="dashed" onClick={this.handleCardAdd} style={{ width: '75%' }}>
                <LegacyIcon type="plus" /> 添加新卡
              </Button>
            </Form.Item>

            <Form.Item {...buttonItemLayout}>
              <Button type="primary" onClick={this.handleSubmit}>
                提交
              </Button>
              <Button style={{ marginLeft: 10 }} onClick={this.handleBack}>
                返回
              </Button>
            </Form.Item>
          </Form>
        </Card>
        <CompanyModal
          title="选择卡号"
          loading={cardLoading}
          visible={visible}
          field={field}
          columns={columns}
          modal={filterData}
          fetch={this.fetchCardList}
          onSelect={this.handleCardSelect}
          onClose={this.handleCardClose}
          pagination={false}
        />
      </PageHeaderLayout>
    );
  }
}
