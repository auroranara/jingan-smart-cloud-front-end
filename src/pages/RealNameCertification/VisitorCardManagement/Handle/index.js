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
@connect(({ user, visitorRegistration, loading }) => ({
  user,
  visitorRegistration,
  loading: loading.models.visitorRegistration,
}))
@Form.create()
export default class Edit extends PureComponent {
  state = {
    cardList: [], // 卡列表
    visible: false, // 是否显示弹框
  };

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
    if (id) this.getDetail(id);
    else if (isCompanyUser(+unitType)) {
      setFieldsValue({ companyId: { key: companyId, label: companyName } });
    }
  }

  getDetail = () => {};

  handleBack = () => {
    router.push(`${LIST_URL}`);
  };
  handleSubmit = e => {
    const {
      form: { validateFields },
      match: {
        params: { id },
      },
      user: {
        currentUser: { companyId: unitId },
      },
      dispatch,
    } = this.props;
    e.preventDefault();
    const { cardList } = this.state;
    console.log('cardList', cardList);

    validateFields((errors, values) => {
      if (errors) return;
      const vals = {
        companyId: unitId,
        ...values,
      };
      const tag = id ? '编辑' : '新增';
      const callback = (success, msg) => {
        if (success) {
          message.success(`${tag}成功`);
          router.push(LIST_URL);
        } else {
          message.error(msg || `${tag}人员失败`);
        }
      };

      // dispatch({
      //   type: `visitorRegistration/fetchTagCard${id ? 'Edit' : 'Add'}`,
      //   payload: id ? { id, ...vals } : vals,
      //   callback,
      // });
    });
  };

  // 新增卡
  handleCardAdd = () => {
    const { cardList } = this.state;
    const nextCardList = cardList.concat({ key: '' });
    this.setState({ cardList: nextCardList });
  };

  // 删除当前卡
  handleCardDel = key => {
    const { cardList } = this.state;
    this.setState({ cardList: cardList.filter((item, index) => index !== key) });
  };

  // 显示Modal
  handleCardModal = () => {
    this.setState({ visible: true });
    this.fetchCardList();
  };

  // 获取IC卡和SN卡列表
  fetchCardList = () => {};

  // 输入值改变
  handleInputChange =(item, value, i, key) =>{
    item[key] = value;
    this.setState(({ cardList }) => {
      let temp = [...cardList];
      temp.splice(i, 1, item);
      return { cardList: temp };
    });
  }

  // 确定卡号
  handleCardSelect = () => {};

  render() {
    const {
      match: {
        params: { id },
      },
      form: { getFieldDecorator },
      user: {
        currentUser: { unitType },
      },
      visitorRegistration: { registrationData },
    } = this.props;

    const { cardList, visible } = this.state;

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
        id: 'ic',
        render() {
          return <Input placeholder="请输入IC卡" />;
        },
        transform(value) {
          return value.trim();
        },
      },
      {
        id: 'sn',
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
        dataIndex: 'ic',
        key: 'ic',
      },
      {
        title: 'SN卡',
        dataIndex: 'sn',
        key: 'sn',
      },
    ];
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        <Card style={{ marginBottom: 15 }}>
          <Form>
            {!isComUser && (
              <Form.Item label="单位名称" {...formItemCol}>
                {getFieldDecorator('companyId', {
                  // initialValue: { key: detail.companyId, label: detail.companyName },
                  rules: [
                    {
                      required: true,
                      message: '请选择单位名称',
                      transform: value => value && value.label,
                    },
                  ],
                })(<CompanySelect {...itemStyles} placeholder="请选择" />)}
              </Form.Item>
            )}
            {cardList.map((item, index) => (
              <Col key={index} className={styles.colStyle}>
                <Form.Item label="卡名称" {...formItemCol}>
                  {getFieldDecorator(`name${index}`, {
                    initialValue: item.cardName,
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
                    initialValue: item.ic,
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
                      onChange={e => {
                        this.handleInputChange(item, e.target.value, index, 'cardNum');
                      }}
                      addonAfter={
                        <span
                          style={{ cursor: 'pointer', color: '#' }}
                          onClick={this.handleCardModal}
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
          title="选择单位"
          // loading={companyLoading}
          visible={visible}
          field={field}
          columns={columns}
          modal={registrationData}
          fetch={this.fetchCardList}
          onSelect={this.handleCardSelect}
          onClose={() => {
            this.setState({ visible: false });
          }}
        />
      </PageHeaderLayout>
    );
  }
}
