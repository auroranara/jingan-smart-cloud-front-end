import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card, Form, message, Select, Upload } from 'antd';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { renderSections } from '@/pages/SafetyKnowledgeBase/MSDS/utils';
import { BREADCRUMBLIST, LIST_URL } from './utils';
import { handleDetails } from '../CommitmentCard/utils';
import { getFileList } from '@/pages/BaseInfo/utils';
import { getToken } from '@/utils/authority';
import { isCompanyUser } from '@/pages/RoleAuthorization/Role/utils';
import styles from '@/pages/CardsInfo/EmergencyCard/TableList.less';
const { Option } = Select;

const FOLDER = 'knowCard';
const uploadAction = '/acloud_new/v2/uploadFile';
@connect(({ user, cardsInfo, fourColorImage, loading }) => ({
  user,
  cardsInfo,
  fourColorImage,
  loading: loading.models.cardsInfo,
}))
@Form.create()
export default class Edit extends PureComponent {
  state = { selectedUnitId: '', riskId: undefined, photoList: [] };

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
      this.fetchRiskList({ companyId: companyId });
      setFieldsValue({ companyId: { key: companyId, label: companyName } });
    }
  }

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

  getDetail = id => {
    const {
      dispatch,
      form: { setFieldsValue },
    } = this.props;
    dispatch({
      type: 'cardsInfo/getKnowCard',
      payload: id,
      callback: detail => {
        const { contentDetails } = detail;
        const det = { ...detail };
        const list = Array.isArray(contentDetails)
          ? contentDetails.map(({ id, fileName, webUrl, dbUrl }) => ({
              uid: id,
              name: fileName,
              url: webUrl,
              dbUrl,
            }))
          : [];
        det.contentDetails = list.length ? { fileList: list } : null;
        setFieldsValue(handleDetails(det));
        this.fetchRiskList({ companyId: detail.companyId });
        this.setState({
          photoList: list,
          riskId: detail.pointFixInfoList.map(item => item.areaId).join(''),
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
    const { photoList, riskId } = this.state;

    e.preventDefault();
    validateFields((errors, values) => {
      if (!photoList.length) {
        message.error('请上传图片');
        return;
      }
      if (!riskId) return message.warning('注：风险分区不能为空！');

      if (errors) return;

      const { companyId, time } = values;
      const vals = {
        ...values,
        companyId: companyId.key,
        contentDetails: photoList.map(({ uid, name, url, dbUrl }) => ({
          id: uid,
          fileName: name,
          webUrl: url,
          dbUrl,
        })),
        time: +time.startOf('day'),
        pointFixInfoList: [{ areaId: riskId, imgType: 5 }],
      };
      dispatch({
        type: `cardsInfo/${id ? 'edit' : 'add'}KnowCard`,
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

  handleUploadPhoto = info => {
    const {
      form: { setFieldsValue },
    } = this.props;
    // 限制一个文件，但有可能新文件上传失败，所以在新文件上传完成后判断，成功则只保留新的，失败，则保留原来的
    const { fileList: fList, file } = info;
    let fileList = [...fList];

    if (file.status === 'done') {
      if (file.response && file.response.code === 200) fileList = [file];
      else fileList = fileList.slice(0, 1);
    }

    if (file.status === undefined)
      // file.status === undefined 为文件被beforeUpload拦截下拉的情况
      fileList.pop();

    fileList = getFileList(fileList);
    this.setState({ photoList: fileList });
    setFieldsValue({ contentDetails: fileList.length ? { fileList } : null });
  };

  handleBeforeUpload = file => {
    const { type } = file;
    const isImage = ['image/jpeg', 'image/png'].includes(type);
    if (!isImage) message.error('请上传图片格式(jpg, png)的附件！');
    return isImage;
  };

  onSelectChange = e => {
    this.setState({ riskId: '', selectedUnitId: e.key }, () => {
      this.fetchRiskList({ companyId: e.key });
    });
  };

  handleRiskChange = e => {
    this.setState({ riskId: e });
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
    const { photoList, riskId } = this.state;

    const isDet = this.isDetail();
    const title = isDet ? '详情' : id ? '编辑' : '新增';
    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title, name: title });
    const handleSubmit = isDet ? null : this.handleSubmit;
    const isComUser = isCompanyUser(+unitType);

    const uploadBtn = (
      <Upload
        name="files"
        data={{ folder: FOLDER }}
        action={uploadAction}
        fileList={photoList}
        beforeUpload={this.handleBeforeUpload}
        onChange={this.handleUploadPhoto}
        headers={{ 'JA-Token': getToken() }}
      >
        <Button type="primary">上传附件</Button>
      </Upload>
    );

    const formItems = [
      {
        name: 'companyId',
        label: '单位名称',
        type: 'companyselect',
        disabled: isComUser,
        wrapperClassName: isComUser ? styles.disappear : undefined,
        onSelectChange: e => this.onSelectChange(e),
      },
      { name: 'name', label: '应知卡名称' },
      { name: 'contentDetails', label: '附件', type: 'compt', component: uploadBtn },
      { name: 'publisher', label: '发布人员' },
      { name: 'time', label: '时间', type: 'datepicker' },
      {
        name: 'section',
        label: '风险分区',
        type: 'component',
        required: true,
        component: (
          <div>
            <Select onChange={this.handleRiskChange} value={riskId}>
              {list.map(({ zoneName, id }) => {
                return (
                  <Option key={id} value={id}>
                    {zoneName}
                  </Option>
                );
              })}
            </Select>
            <span>如果没有做区域划分，请先到风险分区中划分区域</span>
          </div>
        ),
      },
    ];

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        <Card style={{ marginBottom: 15 }}>
          {renderSections(formItems, getFieldDecorator, handleSubmit, LIST_URL, loading)}
          {isDet ? (
            <Button
              type="primary"
              style={{ marginLeft: '45%' }}
              onClick={e => router.push(`/cards-info/know-card/edit/${id}`)}
            >
              编辑
            </Button>
          ) : null}
        </Card>
      </PageHeaderLayout>
    );
  }
}
