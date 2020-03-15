import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Card, Form, Icon, Upload } from 'antd';

import { getToken } from '@/utils/authority';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { renderSections } from '@/pages/SafetyKnowledgeBase/MSDS/utils';
import { BREADCRUMBLIST, LIST_URL, SIGN_TYPES } from './utils';
import { genOperateCallback, uploadConvertToOrigin, uploadConvertToResult } from '@/pages/PersonnelManagement/CheckPoint/utils';
import { getFileList } from '@/pages/BaseInfo/utils';

const FOLDER = 'riskFlags';
const UPLOAD_ACTION = '/acloud_new/v2/uploadFile';

@Form.create()
@connect(({ loading, user, riskFlags }) => ({
  loading: loading.models.riskFlags,
  user,
  riskFlags,
}))
export default class Edit extends PureComponent {
  state = { photoList: [] };

  componentDidMount() {
    const {
      match: { params: { id } },
    } = this.props;
    id && this.fetchDetail();
  }

  fetchDetail = () => {
    const {
      dispatch,
      form: { setFieldsValue },
      match: { params: { id } },
    } = this.props;
    dispatch({
      type: 'riskFlags/fetch',
      payload: id,
      callback: detail => {
        const { photoList } = detail;
        setFieldsValue(detail);
        this.setState({ photoList: uploadConvertToOrigin(photoList) });
      },
    });
  };

  handleSubmit = e => {
    const {
      dispatch,
      form: { validateFields },
      match: { params: { id } },
    } = this.props;
    const { photoList } = this.state;

    e.preventDefault();
    validateFields((errors, values) => {
      if (!errors) {
        const params = { ...values, photoList: uploadConvertToResult(photoList) };
        if (id)
          params.signId = id;
        dispatch({
          type: `riskFlags/${id ? 'edit' : 'add'}`,
          payload: params,
          callback: genOperateCallback(LIST_URL),
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
      match: { params: { id } },
      form: { getFieldDecorator },
    } = this.props;
    const { photoList } = this.state;

    const title = id ? '编辑' : '新增';
    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title, name: title });

    const uploadBtn = (
      <Upload
        name="files"
        data={{ folder: FOLDER }}
        action={UPLOAD_ACTION}
        fileList={photoList}
        onChange={this.handleUploadChange}
        headers={{ 'JA-Token': getToken() }}
      >
        <Button type="dashed" style={{ width: '96px', height: '96px' }}>
          <Icon type="plus" style={{ fontSize: '32px' }} />
          <div style={{ marginTop: '8px' }}>点击上传</div>
        </Button>
      </Upload>
    );

    const formItems = [
      { name: 'signName', label: '标志名称' },
      { name: 'signType', label: '标志类型', options: SIGN_TYPES },
      { name: 'signUrl', label: '标志图片', type: 'component', component: uploadBtn },
    ];

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        <Card style={{ marginBottom: 15 }}>
          {renderSections(formItems, getFieldDecorator, this.handleSubmit, LIST_URL)}
        </Card>
      </PageHeaderLayout>
    );
  }
}
