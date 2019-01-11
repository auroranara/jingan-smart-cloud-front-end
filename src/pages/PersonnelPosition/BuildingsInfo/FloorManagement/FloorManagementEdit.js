import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import { routerRedux } from 'dva/router';
import router from 'umi/router';
import { Form, Input, Button, Card, Col, Icon, InputNumber, Upload, message } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { getToken } from 'utils/authority';

import styles from '../BuildingsInfo.less';

const FormItem = Form.Item;

// 编辑页面标题
const editTitle = '编辑楼层';
// 添加页面标题
const addTitle = '新增楼层';

// 表单标签
const fieldLabels = {
  floorName: '楼层名称',
  floorNumber: '楼层编号',
  floorUrl: '楼层平面图',
};

// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';

// 上传文件夹
const folder = 'floorInfo';
const UploadIcon = <Icon type="upload" />;

@connect(({ buildingsInfo, user, loading }) => ({
  buildingsInfo,
  user,
  loading: loading.models.buildingsInfo,
}))
@Form.create()
export default class FloorManagementEdit extends PureComponent {
  state = {
    uploading: false,
    floorList: [], // 楼层平面图上传列表
  };

  // 挂载后
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    if (id) {
      // 根据id获取详情
      dispatch({
        type: 'buildingsInfo/fetchFloorList',
        payload: {
          floorId: id,
          pageSize: 10,
          pageNum: 1,
        },
        success: ({ floorWebUrl }) => {
          console.log(floorWebUrl);
          const floorWebUrlList = floorWebUrl ? floorWebUrl : [];
          this.setState({
            floorList: floorWebUrlList.map(({ dbUrl, webUrl }, index) => ({
              uid: index,
              status: 'done',
              name: `平面图${index + 1}`,
              url: webUrl,
              dbUrl,
            })),
          });
        },
      });
    } else {
      // 清空详情
      dispatch({
        type: 'buildingsInfo/clearFloorDetail',
      });
    }
  }

  /* 去除左右两边空白 */
  handleTrim = e => e.target.value.trim();

  // 点击提交按钮验证表单信息
  handleClickValidate = () => {
    const {
      dispatch,
      match: {
        params: { id },
      },
      location: {
        query: { id: buildingId, name, companyId },
      },
      form: { validateFieldsAndScroll },
    } = this.props;

    const success = () => {
      message.success(id ? '编辑成功' : '新增成功');
      router.push(
        `/personnel-position/buildings-info/floor/list/${buildingId}?companyId=${companyId}&&name=${name}`
      );
    };

    const error = () => {
      message.error(id ? '编辑失败' : '新增失败');
    };

    validateFieldsAndScroll((errors, values) => {
      const { floorList } = this.state;

      if (!errors) {
        const { floorName, floorNumber } = values;

        const payload = {
          buildingId,
          floorName,
          floorNumber,
          floorUrl: floorList.map(file => file.dbUrl).join(','),
        };
        // 如果新增
        if (!id) {
          dispatch({
            type: 'buildingsInfo/insertFloor',
            payload,
            success,
            error,
          });
        } else {
          dispatch({
            type: 'buildingsInfo/editFloor',
            payload: { id, ...payload },
            success,
            error,
          });
        }
      }
    });
  };

  // 处理平面图上传
  handleFileChange = ({ file, fileList }) => {
    if (file.status === 'uploading') {
      this.setState({
        floorList: fileList,
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
            floorList: fileList.map(item => {
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
            floorList: fileList.filter(item => {
              return !item.response || item.response.data.list.length !== 0;
            }),
          });
        }
      } else {
        // code为500
        message.error('上传失败！');
        this.setState({
          floorList: fileList.filter(item => {
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
        floorList: fileList.filter(item => {
          return item.status !== 'removed';
        }),
        uploading: false,
      });
    } else {
      // error
      message.error('上传失败！');
      this.setState({
        floorList: fileList.filter(item => {
          return item.status !== 'error';
        }),
        uploading: false,
      });
    }
  };
  // 渲染信息
  renderLawsInfo() {
    const {
      match: {
        params: { id },
      },
      form: { getFieldDecorator },
      location: {
        query: { id: buildingId, name, companyId },
      },
      buildingsInfo: {
        floorData: { list },
      },
    } = this.props;

    const { uploading, floorList } = this.state;
    const editDetail = list.find(d => d.id === id) || {};
    const { floorName, floorNumber } = editDetail;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    return (
      <Card className={styles.card} bordered={false}>
        <Form style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label={fieldLabels.floorName}>
            <Col span={24}>
              {getFieldDecorator('floorName', {
                initialValue: floorName,
                rules: [
                  {
                    required: true,
                    message: '请输入楼层名称',
                  },
                ],
              })(<Input placeholder="请输入楼层名称" />)}
            </Col>
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.floorNumber}>
            {getFieldDecorator('floorNumber', {
              initialValue: floorNumber,
              rules: [
                {
                  required: true,
                  message: '请选择楼层编号',
                },
              ],
            })(<InputNumber style={{ width: '100%' }} placeholder="请选择楼层编号" />)}
          </FormItem>
          <FormItem {...formItemLayout} label={fieldLabels.floorUrl}>
            {getFieldDecorator('floorUrl')(
              <Upload
                name="files"
                headers={{ 'JA-Token': getToken() }}
                data={{ folder }} // 附带的参数
                listType="picture "
                action={uploadAction} // 上传地址
                fileList={floorList}
                onChange={this.handleFileChange}
              >
                <Button type="primary">
                  {UploadIcon}
                  选择文件
                </Button>
              </Upload>
            )}
          </FormItem>
        </Form>

        <div style={{ textAlign: 'center' }}>
          <Button type="primary" loading={uploading} onClick={this.handleClickValidate}>
            提交
          </Button>
          <Button
            loading={uploading}
            href={`/personnel-position/buildings-info/floor/list/${buildingId}?companyId=${companyId}&&name=${name}`}
            style={{ marginLeft: '10px' }}
          >
            返回
          </Button>
        </div>
      </Card>
    );
  }

  // 渲染页面所有信息
  render() {
    const {
      match: {
        params: { id },
      },
      location: {
        query: { id: buildingId, name, companyId },
      },
    } = this.props;
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
        title: '楼层管理列表',
        name: '楼层管理列表',
        href: `/personnel-position/buildings-info/floor/list/${buildingId}?companyId=${companyId}&&name=${name}`,
      },
      {
        title: '新增楼层',
        name: '新增楼层',
      },
    ];
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderLawsInfo()}
      </PageHeaderLayout>
    );
  }
}
