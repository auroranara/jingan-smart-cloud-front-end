import React, { PureComponent } from 'react';
import router from 'umi/router';
import { Button, Col, Form, Input, Row, Select, Switch } from 'antd';

import SearchSelect from '@/jingan-components/SearchSelect';
import { getFieldDecConfig, genOperateCallback, initFormValues, POINT_INDEX, SCREEN_INDEX } from './utils';
import styles from './CompanyList.less';

const { Item: FormItem } = Form;
const { Option } = Select;

@Form.create()
export default class ScreenEdit extends PureComponent {
  componentDidMount() {
    const { match: { params: { id } } } = this.props;
    this.getCardTypes();
    id && this.fetchDetail();
  }

  fetchDetail() {
    const {
      dispatch,
      match: { params: { tabIndex, id } },
      form: { setFieldsValue },
    } = this.props;
    dispatch({
      type: 'checkPoint/fetchCheckPoint',
      index: tabIndex,
      payload: id,
      callback: detail => setFieldsValue(initFormValues(detail, SCREEN_INDEX)),
    });
  }

  getCardTypes(callback) {
    const { dispatch } = this.props;
    dispatch({ type: 'checkPoint/fetchCardTypes', callback });
  }

  getList = name => {
    const { dispatch } = this.props;
    dispatch({ type: 'checkPoint/fetchCheckList', index: POINT_INDEX, payload: { pageNum: 1, pageSize: 20, name } });
  };

  setList = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'checkPoint/saveCheckList', payload: { index: POINT_INDEX, list: [], pagination: { pageNum: 1 } } });
  };

  handleSubmit = e => {
    const {
      dispatch,
      match: { params: { companyId, id } },
      form: { validateFields },
    } = this.props;

    e.preventDefault();
    validateFields((err, values) => {
      // console.log(values);
      if (!err) {
        const { status } = values;
        const params = { ...values, companyId, status: +!status };
        // if (companyId)
        //   params.companyId = companyId;
        if (id)
          params.id = id;
        dispatch({
          type: `checkPoint/${id ? 'edit' : 'add'}CheckPoint`,
          index: SCREEN_INDEX,
          payload: params,
          callback: genOperateCallback(`/personnel-management/check-point/list/${companyId}/${SCREEN_INDEX}`),
        });

      }
    });
  };

  back = () => {
    const { match: { params: { companyId } } } = this.props;
    router.push(`/personnel-management/check-point/list/${companyId}/${SCREEN_INDEX}`);
  };

  render() {
    const {
      isDetail,
      listLoading,
      checkPoint: { lists, cardTypes },
      form: { getFieldDecorator },
    } = this.props;

    const btn = isDetail ? null :  <Button type="primary" htmlType="submit">提交</Button>;

    return (
      <Form layout="vertical" onSubmit={this.handleSubmit}>
        <Row gutter={{ lg: 48, md: 24 }}>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="显示屏名称">
              {getFieldDecorator('name', getFieldDecConfig('请输入显示屏名称'))(
                <Input placeholder="请输入显示屏名称" min={1} max={20} />
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="卡口点位">
              {getFieldDecorator('pointId', {
                // rules: [{ required: true, message: '请选择卡口点位' }],
              })(
                <SearchSelect
                  showArrow={false}
                  className={styles.searchSelect}
                  loading={listLoading}
                  list={lists[POINT_INDEX]}
                  fieldNames={{ key: 'id', value: 'name' }}
                  getList={this.getList}
                  setList={this.setList}
                  placeholder="请选择卡口点位"
                />
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="设备编号">
              {getFieldDecorator('code', getFieldDecConfig('请输入设备编号'))(
                <Input placeholder="请输入设备编号" min={1} max={20} />
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="IP地址">
              {getFieldDecorator('ipAddress', getFieldDecConfig('请输入IP地址'))(
                <Input placeholder="请输入IP地址" min={1} max={20} />
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="端口号">
              {getFieldDecorator('portNumber', getFieldDecConfig('请输入端口号'))(
                <Input placeholder="请输入端口号" min={1} max={20} />
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="控制卡型号">
              {getFieldDecorator('controllerCardType', {
                rules: [{ required: true, message: '请选择控制卡型号' }],
              })(
                <Select placeholder="控制卡型号">
                  {cardTypes.map(({ value, desc }) => <Option key={value}>{desc}</Option>)}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="模组类型">
              {getFieldDecorator('modelType', getFieldDecConfig('请输入模组类型'))(
                <Input placeholder="请输入模组类型" min={1} max={20} />
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="模组数">
              {getFieldDecorator('modelNumber', getFieldDecConfig('请输入模组数'))(
                <Input placeholder="请输入模组数" min={1} max={20} />
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="设备状态">
              {getFieldDecorator('status', {
                initialValue: true,
                rules: [{ required: true, message: '请选择设备状态' }],
                valuePropName: 'checked',
              })(
                <Switch
                  checkedChildren="启用"
                  unCheckedChildren="禁用"
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Form.Item wrapperCol={{ span: 24, offset: 11 }}>
          <Button onClick={this.back} className={styles.back}>返回</Button>
          {btn}
        </Form.Item>
      </Form>
    )
  }
}
