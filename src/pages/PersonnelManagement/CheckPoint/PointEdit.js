import React, { PureComponent } from 'react';
import { Button, Col, Form, Icon, Input, Row, Upload } from 'antd';

import styles from './CompanyList.less';
import SearchSelect from '@/jingan-components/SearchSelect';
import { getToken } from '@/utils/authority';
import { genOperateCallback, getFieldDecConfig, uploadConvertToOrigin, uploadConvertToResult, FOLDER, UPLOAD_ACTION } from './utils';
import { getFileList } from '@/pages/BaseInfo/utils';

const { Item: FormItem } = Form;

@Form.create()
export default class PointEdit extends PureComponent {
  state={ fileList: [] };

  getList = name => {
    const { dispatch } = this.props;
    dispatch({ type: 'checkPoint/fetchCheckList', index: 1, payload: { pageNum: 1, pageSize: 20, name } });
  };

  setList = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'checkPoint/saveCheckList', payload: { index: 1, list: [], pagination: { pageNum: 1 } } });
  };

  handleSubmit = e => {
    const {
      dispatch,
      match: { params: { companyId, id } },
      form: { validateFields },
    } = this.props;
    const { fileList } = this.state;

    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        const params = { ...values, photoList: uploadConvertToResult(fileList) };
        if (companyId)
          params.companyId = companyId;
        if (id)
          params.id = id;
        dispatch({
          type: `checkPoint/${id ? 'edit' : 'add'}CheckPoint`,
          index: 0,
          payload: params,
          callback: genOperateCallback(companyId, 0),
        });

      }
    });
  };

  handleUploadChange = info => {
    const { fileList, file } = info;
    let fList = fileList;
    if (file.status === 'done')
      fList = fList.filter(f => f.response && f.response.code === 200);
    this.setState({ fileList: getFileList(fList) });
  };

  render() {
    const {
      listLoading,
      checkPoint: { lists },
      form: { getFieldDecorator },
    } = this.props;
    const { fileList } = this.state;

    return (
      <Form layout="vertical" onSubmit={this.handleSubmit}>
        <Row gutter={{ lg: 48, md: 24 }}>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="卡口名称">
              {getFieldDecorator('name', getFieldDecConfig('请输入卡口名称'))(
                <Input placeholder="请输入卡口名称" min={1} max={20} />
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="卡口位置">
              {getFieldDecorator('location', getFieldDecConfig('请输入卡口位置'))(
                <Input placeholder="请输入卡口位置" min={1} max={20} />
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="卡口方向">
              {getFieldDecorator('direction', getFieldDecConfig('请输入卡口方向'))(
                <Input placeholder="请输入卡口名称" min={1} max={20} />
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="关联设备">
              {getFieldDecorator('equipmentList', {
                // rules: [{ required: true, whitespace: true, message: '请选择关联设备' }],
              })(
                <SearchSelect
                  mode="multiple"
                  className={styles.searchSelect}
                  loading={listLoading}
                  list={lists[1]}
                  fieldNames={{ key: 'id', value: 'name' }}
                  getList={this.getList}
                  setList={this.setList}
                  placeholder="请选择卡口点位"
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ lg: 48, md: 24 }}>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="卡口照片">
            <Upload
              name="files"
              data={{ FOLDER }}
              action={UPLOAD_ACTION}
              fileList={fileList}
              onChange={this.handleUploadChange}
              headers={{ 'JA-Token': getToken() }}
            >
              <Button type="dashed" style={{ width: '96px', height: '96px' }}>
                <Icon type="plus" style={{ fontSize: '32px' }} />
                <div style={{ marginTop: '8px' }}>点击上传</div>
              </Button>
            </Upload>
            </FormItem>
          </Col>
        </Row>
        <Form.Item wrapperCol={{ span: 24, offset: 11 }}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    )
  }
}
