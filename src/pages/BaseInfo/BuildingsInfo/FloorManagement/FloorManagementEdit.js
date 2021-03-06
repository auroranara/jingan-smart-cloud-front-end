import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import { routerRedux } from 'dva/router';
import router from 'umi/router';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button, Card, Col, Upload, message, Select } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { getToken } from 'utils/authority';

import styles from '../BuildingsInfo.less';

const FormItem = Form.Item;
const { Option } = Select;

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
const folder = 'floorinfo';
const UploadIcon = <LegacyIcon type="upload" />;

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
    floorIndexArray: [],
  };

  // 挂载后
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
      location: {
        query: { id: buildingId, buildingId: buildingIdNew },
      },
    } = this.props;
    // 获取楼层编号
    // dispatch({
    //   type: 'buildingsInfo/fetchFloorNumber',
    //   payload: {
    //     building_id: buildingId || buildingIdNew,
    //   },
    // });
    dispatch({
      type: 'buildingsInfo/fetchFloorList',
      payload: {
        building_id: buildingId || buildingIdNew,
        pageSize: 10,
        pageNum: 1,
      },
      success: ({ list }) => {
        this.setState({ floorIndexArray: list.map(item => item.floorNumber) });
      },
    });
    if (id) {
      // 根据id获取详情
      dispatch({
        type: 'buildingsInfo/fetchFloorList',
        payload: {
          floorId: id,
          pageSize: 10,
          pageNum: 1,
        },
        success: ({ list }) => {
          const { floorWebUrl } = list;
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
        query: { id: newbuildingId, name, companyId, buildingId },
      },
      form: { validateFieldsAndScroll },
    } = this.props;

    const success = () => {
      message.success(id ? '编辑成功' : '新增成功');
      setTimeout(() => {
        if (id) window.close();
        else
          router.push(
            `/base-info/buildings-info/floor/list/${newbuildingId ||
              buildingId}?companyId=${companyId}&&name=${name}`
          );
      }, 1000);
    };

    const error = () => {
      message.error(id ? '编辑失败，该建筑已有该楼层！' : '新增失败，该建筑已有该楼层！');
    };

    validateFieldsAndScroll((errors, values) => {
      const { floorList } = this.state;

      if (!errors) {
        const { floorName, floorNumber } = values;

        const payload = {
          buildingId: newbuildingId || buildingId,
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
            payload: {
              id,
              ...payload,
            },
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
  renderInfo() {
    const {
      match: {
        params: { id },
      },
      form: { getFieldDecorator },
      location: {
        query: { id: buildingId, name, companyId, buildingId: editBuilding },
      },
      buildingsInfo: {
        floorData: { list },
        // allFloorNumberLists,
        floorIndexList,
      },
    } = this.props;

    const { uploading, floorList, floorIndexArray } = this.state;

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
                  message: '请输入楼层编号',
                },
              ],
            })(
              <Select style={{ width: '100%' }} placeholder="请输入楼层编号">
                {floorIndexList.map(item => (
                  <Option
                    value={item.key}
                    key={item.key}
                    disabled={floorIndexArray.indexOf(item.key) >= 0 || floorNumber === item.key}
                  >
                    {item.value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={fieldLabels.floorUrl}>
            {getFieldDecorator('floorUrl')(
              <Upload
                name="files"
                headers={{ 'JA-Token': getToken() }}
                data={{ folder }} // 附带的参数
                // listType="picture "
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
          {id ? (
            <Button
              loading={uploading}
              style={{ marginLeft: 10 }}
              // href={`#/base-info/buildings-info/floor/list/${editBuilding}?companyId=${companyId}&&name=${name}`}
              onClick={e => window.close()}
            >
              返回
            </Button>
          ) : (
            <Button
              loading={uploading}
              style={{ marginLeft: 10 }}
              href={`#/base-info/buildings-info/floor/list/${buildingId}?companyId=${companyId}&&name=${name}`}
            >
              返回
            </Button>
          )}
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
        query: { id: buildingId, name, companyId, buildingId: editBuildingId },
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
        title: '基础数据管理',
        name: '基础数据管理',
      },
      {
        title: '楼层管理列表',
        name: '楼层管理列表',
        href: id
          ? `/base-info/buildings-info/floor/list/${editBuildingId}?companyId=${companyId}&&name=${name}`
          : `/base-info/buildings-info/floor/list/${buildingId}?companyId=${companyId}&&name=${name}`,
      },
      {
        title: id ? editTitle : addTitle,
        name: id ? editTitle : addTitle,
      },
    ];
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderInfo()}
      </PageHeaderLayout>
    );
  }
}
