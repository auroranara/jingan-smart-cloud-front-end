import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';

import { Button, Card, Col, Form, Icon, Input, Upload, Select, InputNumber, message } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';

import CompanyModal from '../../../BaseInfo/Company/CompanyModal';
// import urls from 'utils/urls';
import { getToken } from 'utils/authority';

const { TextArea } = Input;
const { Item: FormItem } = Form;
const { Option } = Select;
const PAGE_SIZE = 10;

// 编辑页面标题
const editTitle = '编辑建筑';
// 添加页面标题
const addTitle = '新增建筑';

// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';

// 上传文件夹
const folder = 'buildingsInfo';

const UploadIcon = <Icon type="upload" />;

const itemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};

const itemLayout1 = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

function generateRules(cName, msg = '输入', ...rules) {
  return [{ required: true, message: `请${msg}${cName}` }, ...rules];
}

function getOptions(options = []) {
  return options.map(({ value, label }) => (
    <Option key={value} value={value}>
      {label}
    </Option>
  ));
}

@connect(({ buildingsInfo, loading, videoMonitor }) => ({
  buildingsInfo,
  videoMonitor,
  loading: loading.models.buildingsInfo,
}))
@Form.create()
export default class BuildingInfoEdit extends PureComponent {
  state = {
    uploading: false, // 文件上传状态
    fileList: [], // 图片上传列表
    drawList: [], // 文件上传列表
    visible: false, // 企业弹框
    companyId: undefined,
  };

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    // 如果存在Id，则为编辑，否则为新增
    if (id) {
      // 获取详情
      dispatch({
        type: 'buildingsInfo/fetchBuildingList',
        payload: {
          buildingId: id,
          pageSize: 10,
          pageNum: 1,
        },
        success: ({ photoWebUrl, darwingWebUrl }) => {
          const photoWebUrlList = photoWebUrl ? photoWebUrl : [];
          const darwingWebUrlList = darwingWebUrl ? darwingWebUrl : [];
          this.setState({
            fileList: photoWebUrlList.map(({ dbUrl, webUrl }, index) => ({
              uid: index,
              status: 'done',
              name: `照片${index + 1}`,
              url: webUrl,
              dbUrl,
            })),
            drawList: darwingWebUrlList.map(({ dbUrl, webUrl }, index) => ({
              uid: index,
              status: 'done',
              name: `附件${index + 1}`,
              url: webUrl,
              dbUrl,
            })),
          });
        },
      });
    } else {
      // 清空详情
      dispatch({
        type: 'buildingsInfo/clearDetail',
      });
    }
    // 获取建筑物类型字典
    dispatch({
      type: 'buildingsInfo/fetchDict',
      payload: {
        type: 'buildingType',
      },
    });
    // 获取火灾危险等级字典
    dispatch({
      type: 'buildingsInfo/fetchDict',
      payload: {
        type: 'fireDangerType',
      },
    });
    // 获取耐火等级字典
    dispatch({
      type: 'buildingsInfo/fetchDict',
      payload: {
        type: 'fireRating',
      },
    });
    // 获取建筑结构字典
    dispatch({
      type: 'buildingsInfo/fetchDict',
      payload: {
        type: 'floorNumber',
      },
    });
    const payload = { pageSize: PAGE_SIZE, pageNum: 1 };
    this.fetchCompany({ payload });
  }

  // 获取企业列表
  fetchCompany = ({ payload }) => {
    const { dispatch } = this.props;
    dispatch({ type: 'videoMonitor/fetchModelList', payload });
  };

  // 显示企业弹出框
  handleCompanyModal = e => {
    e.target.blur();
    const { dispatch } = this.props;
    this.setState({ visible: true });
    dispatch({
      type: 'videoMonitor/fetchModelList',
      payload: {
        pageSize: 10,
        pageNum: 1,
      },
    });
  };

  // 企业选择
  handleSelect = item => {
    const { setFieldsValue } = this.props.form;
    const { id, name } = item;
    this.companyId = id;
    setFieldsValue({ companyId: name });
    this.setState({
      companyId: id,
    });
    this.handleClose();
  };

  // 关闭企业弹出框
  handleClose = () => {
    this.setState({ visible: false });
  };

  // 渲染选择企业弹出框
  renderCompanyModal() {
    const {
      videoMonitor: { modal },
      loading,
    } = this.props;
    const { visible } = this.state;
    return (
      <CompanyModal
        loading={loading}
        visible={visible}
        modal={modal}
        fetch={this.fetchCompany}
        onSelect={this.handleSelect}
        onClose={this.handleClose}
      />
    );
  }

  // 提交
  handleClickValidate = () => {
    const {
      dispatch,
      match: {
        params: { id },
      },
      location: {
        query: { name: company_name, companyId: company_Id },
      },
      form: { validateFieldsAndScroll },
    } = this.props;

    const success = () => {
      message.success(id ? '编辑成功' : '新增成功');
      router.push(
        company_Id
          ? `/personnel-position/buildings-info/detail/${company_Id}?name=${company_name}`
          : '/personnel-position/buildings-info/list'
      );
    };

    const error = () => {
      message.error(id ? '编辑失败' : '新增失败');
    };

    validateFieldsAndScroll((errors, values) => {
      const { fileList, drawList } = this.state;

      if (!errors) {
        const {
          buildingType,
          buildingName,
          floorNumber,
          fireDangerType,
          buildingArea,
          fireRating,
          remark,
          floorLevel,
        } = values;

        const { companyId } = this.state;

        const payload = {
          companyId: company_Id || companyId,
          buildingType,
          buildingName,
          floorNumber,
          fireDangerType,
          buildingArea,
          fireRating,
          photoUrl: fileList.map(file => file.dbUrl).join(','),
          darwingUrl: drawList.map(file => file.dbUrl).join(','),
          floorLevel,
          remark,
        };
        // 如果新增
        if (!id) {
          dispatch({
            type: 'buildingsInfo/insertBuilding',
            payload,
            success,
            error,
          });
        } else {
          dispatch({
            type: 'buildingsInfo/editBuilding',
            payload: { id, ...payload },
            success,
            error,
          });
        }
      }
    });
  };

  // 处理上传照片
  handlePicChange = ({ fileList, file }) => {
    if (file.status === 'uploading') {
      this.setState({
        fileList,
        uploading: true,
      });
    } else if (file.status === 'done') {
      if (file.response.code === 200) {
        const {
          data: {
            list: [result],
          },
        } = file.response;
        if (result) {
          this.setState({
            fileList: fileList.map(item => {
              if (!item.url && item.response) {
                return {
                  ...item,
                  url: result.webUrl,
                  dbUrl: result.dbUrl,
                };
              }
              return item;
            }),
          });
        } else {
          // 没有返回值
          message.error('上传失败！');
          this.setState({
            fileList: fileList.filter(item => {
              return !item.response || item.response.data.list.length !== 0;
            }),
          });
        }
      } else {
        // code为500
        message.error('上传失败！');
        this.setState({
          fileList: fileList.filter(item => {
            return !item.response || item.response.code !== 200;
          }),
        });
      }
      this.setState({
        uploading: false,
      });
    } else if (file.status === 'removed') {
      // 删除
      this.setState({
        fileList: fileList.filter(item => {
          return item.status !== 'removed';
        }),
        uploading: false,
      });
    } else {
      // error
      message.error('上传失败！');
      this.setState({
        fileList: fileList.filter(item => {
          return item.status !== 'error';
        }),
        uploading: false,
      });
    }
  };

  // 处理图纸附件附件
  handleFileChange = ({ file, fileList }) => {
    if (file.status === 'uploading') {
      this.setState({
        drawList: fileList,
        uploading: true,
      });
    } else if (file.status === 'done') {
      if (file.response.code === 200) {
        const {
          data: {
            list: [result],
          },
        } = file.response;
        if (result) {
          this.setState({
            drawList: fileList.map(item => {
              if (!item.url && item.response) {
                return {
                  ...item,
                  url: result.webUrl,
                  dbUrl: result.dbUrl,
                };
              }
              return item;
            }),
          });
        } else {
          // 没有返回值
          message.error('上传失败！');
          this.setState({
            drawList: fileList.filter(item => {
              return !item.response || item.response.data.list.length !== 0;
            }),
          });
        }
      } else {
        // code为500
        message.error('上传失败！');
        this.setState({
          drawList: fileList.filter(item => {
            return !item.response || item.response.code !== 200;
          }),
        });
      }
      this.setState({
        uploading: false,
      });
    } else if (file.status === 'removed') {
      // 删除
      this.setState({
        drawList: fileList.filter(item => {
          return item.status !== 'removed';
        }),
        uploading: false,
      });
    } else {
      // error
      message.error('上传失败！');
      this.setState({
        drawList: fileList.filter(item => {
          return item.status !== 'error';
        }),
        uploading: false,
      });
    }
  };

  // 渲染表单
  renderFormItems(items) {
    const { getFieldDecorator } = this.props.form;
    return items.map(
      ({ name, cName, span = 12, formItemLayout = itemLayout, rules, component }) => (
        <Col span={span} key={name} style={{ height: '53px' }}>
          <FormItem label={cName} {...formItemLayout}>
            {getFieldDecorator(name, { rules })(component)}
          </FormItem>
        </Col>
      )
    );
  }

  // 渲染表单
  renderMoreItems(items) {
    const { getFieldDecorator } = this.props.form;
    return items.map(
      ({ name, cName, span = 12, formItemLayout = itemLayout, rules, component }) => (
        <Col span={span} key={name}>
          <FormItem label={cName} {...formItemLayout}>
            {getFieldDecorator(name, { rules })(component)}
          </FormItem>
        </Col>
      )
    );
  }

  render() {
    const {
      match: {
        params: { id },
      },
      location: {
        query: { name: company_name, companyId: company_Id },
      },
      form: { getFieldDecorator },
      buildingsInfo: {
        buildingData: { list },
        buildingType = [],
        fireDangerType = [],
        fireRating = [],
        floorNumber = [],
      },
    } = this.props;

    const { uploading, fileList, drawList } = this.state;

    const editDetail = list.find(d => d.id === id) || {};
    const {
      buildingType: editBuildingType,
      buildingName,
      floorNumber: editFloorNumber,
      fireDangerType: editFireDangerType,
      fireRating: editFireRating,
      buildingArea,
      floorLevel,
      remark,
    } = editDetail;

    const defaultItems = [
      {
        name: 'companyId',
        cName: '企业名称',
        rules: generateRules('企业名称'),
        component: (
          <div>
            {company_Id ? (
              <div>
                {getFieldDecorator('companyId', { initialValue: company_name })(
                  <Input disabled placeholder="请输入企业名称" />
                )}
              </div>
            ) : (
              <div>
                {getFieldDecorator('companyId', { initialValue: company_name })(
                  <Input
                    ref={input => {
                      this.CompanyIdInput = input;
                    }}
                    placeholder="请输入企业名称"
                    onClick={this.handleCompanyModal}
                  />
                )}
              </div>
            )}
          </div>
        ),
      },
      {
        name: 'buildingType',
        cName: '建筑物类型',
        rules: generateRules('建筑物类型'),
        component: (
          <div>
            {getFieldDecorator('buildingType', {
              initialValue: editBuildingType,
            })(<Select placeholder="请选择建筑物类型">{getOptions(buildingType)}</Select>)}
          </div>
        ),
      },
      {
        name: 'buildingName',
        cName: '建筑物名称',
        rules: generateRules('建筑物名称'),
        component: (
          <div>
            {getFieldDecorator('buildingName', { initialValue: buildingName })(
              <Input placeholder="请输入建筑物名称" />
            )}
          </div>
        ),
      },
      {
        name: 'floorNumber',
        cName: '建筑结构',
        rules: generateRules('建筑结构'),
        component: (
          <div>
            {getFieldDecorator('floorNumber', { initialValue: editFloorNumber })(
              <Select placeholder="请选择建筑结构">{getOptions(floorNumber)}</Select>
            )}
          </div>
        ),
      },
      {
        name: 'fireDangerType',
        cName: '火灾危险性分类',
        rules: generateRules('火灾危险性分类'),
        component: (
          <div>
            {getFieldDecorator('fireDangerType', { initialValue: editFireDangerType })(
              <Select placeholder="请选择火灾危险性分类">{getOptions(fireDangerType)}</Select>
            )}
          </div>
        ),
      },
      {
        name: 'buildingArea',
        cName: '建筑面积(㎡)',
        component: (
          <div>
            {getFieldDecorator('buildingArea', { initialValue: buildingArea })(
              <InputNumber style={{ width: '100%' }} placeholder="请输入建筑面积" />
            )}
          </div>
        ),
      },
      {
        name: 'fireRating',
        cName: '耐火等级',
        rules: generateRules('耐火等级'),
        component: (
          <div>
            {getFieldDecorator('fireRating', { initialValue: editFireRating })(
              <Select placeholder="请选择耐火等级">{getOptions(fireRating)}</Select>
            )}
          </div>
        ),
      },
    ];

    const moreItems = [
      {
        name: 'floorLevel',
        cName: '建筑层数',
        rules: generateRules('建筑层数'),
        component: (
          <div>
            {getFieldDecorator('floorLevel', { initialValue: floorLevel })(
              <Input placeholder="请输入建筑层数" />
            )}
          </div>
        ),
      },
      {
        name: 'photoUrl',
        cName: '现场照片',
        span: 24,
        formItemLayout: itemLayout1,
        component: (
          <Upload
            name="files"
            accept=".jpg,.png" // 接受的文件格式
            headers={{ 'JA-Token': getToken() }} // 上传的请求头部
            data={{ folder }} // 附带参数
            action={uploadAction} // 上传地址
            fileList={fileList}
            onChange={this.handlePicChange}
          >
            <Button type="primary">
              {UploadIcon}
              选择图片
            </Button>
          </Upload>
        ),
      },
      {
        name: 'darwingUrl',
        cName: '图纸附件',
        span: 24,
        formItemLayout: itemLayout1,
        component: (
          <Upload
            name="files"
            headers={{ 'JA-Token': getToken() }}
            data={{ folder }} // 附带的参数
            action={uploadAction} // 上传地址
            fileList={drawList}
            onChange={this.handleFileChange}
          >
            <Button type="primary">
              {UploadIcon}
              选择文件
            </Button>
          </Upload>
        ),
      },
      {
        name: 'remark',
        cName: '备注',
        span: 24,
        formItemLayout: itemLayout1,
        rules: generateRules('备注'),
        component: (
          <div>
            {getFieldDecorator('remark', { initialValue: remark })(
              <TextArea placeholder="请输入备注" rows={3} maxLength="5000" />
            )}
          </div>
        ),
      },
    ];
    const formItems = [...defaultItems];

    const moreForemItems = [...moreItems];

    const title = id ? editTitle : addTitle;

    //面包屑
    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '人员定位',
        name: '人员定位',
      },
      {
        title: company_Id ? '建筑物信息列表' : '建筑物信息',
        name: company_Id ? '建筑物信息列表' : '建筑物信息',
        href: company_Id
          ? `/personnel-position/buildings-info/detail/${company_Id}?name=${company_name}`
          : '/personnel-position/buildings-info/list',
      },
      {
        title: '新增建筑物',
        name: '新增建筑物',
      },
    ];

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        <Card>
          <Form>
            {this.renderFormItems(formItems)}
            {this.renderMoreItems(moreForemItems)}
            <Col span={24} style={{ marginTop: '40px' }}>
              <FormItem wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: 13, offset: 11 } }}>
                <Button type="primary" onClick={this.handleClickValidate}>
                  确定
                </Button>
                {company_Id ? (
                  <Button
                    loading={uploading}
                    href={`#/personnel-position/buildings-info/detail/${company_Id}?name=${company_name}`}
                    type="primary"
                    style={{ marginLeft: '10px' }}
                  >
                    返回
                  </Button>
                ) : (
                  <Button
                    loading={uploading}
                    href="#/personnel-position/buildings-info/list"
                    type="primary"
                    style={{ marginLeft: '10px' }}
                  >
                    返回
                  </Button>
                )}
              </FormItem>
            </Col>
          </Form>
        </Card>
        {this.renderCompanyModal()}
      </PageHeaderLayout>
    );
  }
}
