import React, { PureComponent } from 'react';
import router from 'umi/router';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Col, Input, Row, Upload } from 'antd';

import styles from './CompanyList.less';
import SearchSelect from '@/jingan-components/SearchSelect';
import { getToken } from '@/utils/authority';
import { genOperateCallback, getFieldDecConfig, initFormValues, uploadConvertToOrigin, uploadConvertToResult, EQUIPMENT_INDEX, FOLDER, UPLOAD_ACTION, POINT_INDEX } from './utils';
import { getFileList } from '@/pages/BaseInfo/utils';

const { Item: FormItem } = Form;

@Form.create()
export default class PointEdit extends PureComponent {
  state={ fileList: [] };

  componentDidMount() {
    const { match: { params: { id } } } = this.props;
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
      callback: detail => {
        const { photoList } = detail;
        setFieldsValue(initFormValues(detail, POINT_INDEX));
        this.setState({ fileList: uploadConvertToOrigin(photoList) });
      },
    });
  }

  getList = name => {
    const { dispatch, match: { params: { companyId } } } = this.props;
    dispatch({
      index: EQUIPMENT_INDEX,
      type: 'checkPoint/fetchCheckList',
      payload: { pageNum: 1, pageSize: 20, status: 0, companyId, name },
    });
  };

  setList = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'checkPoint/saveCheckList', payload: { index: EQUIPMENT_INDEX, list: [], pagination: { pageNum: 1 } } });
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
        const { bayonetEquipmentList } = values;
        const params = { ...values, photoList: uploadConvertToResult(fileList) };
        let list = [];
        if (bayonetEquipmentList)
          list = bayonetEquipmentList.map(({ key, label }) => ({ id: key, name: label }));
        params.bayonetEquipmentList = list;
        if (companyId)
          params.companyId = companyId;
        if (id)
          params.id = id;
        dispatch({
          type: `checkPoint/${id ? 'edit' : 'add'}CheckPoint`,
          index: POINT_INDEX,
          payload: params,
          callback: genOperateCallback(`/personnel-management/check-point/list/${companyId}/${POINT_INDEX}`),
        });

      }
    });
  };

  back = () => {
    const { match: { params: { companyId } } } = this.props;
    router.push(`/personnel-management/check-point/list/${companyId}/${POINT_INDEX}`);
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
      isDetail,
      listLoading,
      checkPoint: { lists },
      form: { getFieldDecorator },
    } = this.props;
    const { fileList } = this.state;

    const btn = isDetail ? null :  <Button type="primary" htmlType="submit">提交</Button>;

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
                <Input placeholder="请输入卡口方向" min={1} max={20} />
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="关联设备">
              {getFieldDecorator('bayonetEquipmentList', {
                // rules: [{ required: true, whitespace: true, message: '请选择关联设备' }],
              })(
                <SearchSelect
                  mode="multiple"
                  labelInValue
                  className={styles.searchSelect}
                  loading={listLoading}
                  list={lists[EQUIPMENT_INDEX]}
                  fieldNames={{ key: 'id', value: 'name' }}
                  getList={this.getList}
                  setList={this.setList}
                  placeholder="请选择关联设备"
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
              data={{ folder: FOLDER }}
              action={UPLOAD_ACTION}
              fileList={fileList}
              onChange={this.handleUploadChange}
              headers={{ 'JA-Token': getToken() }}
            >
              <Button type="dashed" style={{ width: '96px', height: '96px' }}>
                <LegacyIcon type="plus" style={{ fontSize: '32px' }} />
                <div style={{ marginTop: '8px' }}>点击上传</div>
              </Button>
            </Upload>
            </FormItem>
          </Col>
        </Row>
        <Form.Item wrapperCol={{ span: 24, offset: 10 }}>
          <Button onClick={this.back} className={styles.back}>返回</Button>
          {btn}
        </Form.Item>
      </Form>
    );
  }
}
