import React, { PureComponent } from 'react';
import { Form, Input, Card, Table, Upload, Button, Icon } from 'antd';
import { connect } from 'dva';

// import PageHeaderLayout from '../../layouts/PageHeaderLayout';

@connect(({ transmission, loading }) => ({
  transmission,
  loading: loading.models.transmission,
}))
@Form.create()
export default class ImportPointPosition extends PureComponent {
  render() {
    const {
      form,
      match: {
        params: { hostId },
      },
    } = this.props;
    const { getFieldDecorator } = form;
    const FormItem = Form.Item;
    const dataSource = [];
    /* {
          unitType: "【42】点型光电感烟火灾探测器",
          componentModel: "TY-GD-G3",
          createCompanyName: "无锡海湾电子有限公司",
          systemType: "【1】火灾报警系统 ",
          partNumber: 4,
          remark: 6,
          row: 5,
          installFloor: "15d",
          error: [
            {
              key: "partNumber",
              value: "楼层格式错误",
            },
          ],
          installAddress: "7号楼15层东",
          loopNumber: "172",
        } */
    const columns = [
      {
        title: '行序号',
        dataIndex: 'row',
        key: 'row',
      },
      {
        title: '消防设施系统类型',
        dataIndex: 'systemType',
        key: 'systemType',
      },
      {
        title: '消防设施部件类型',
        dataIndex: 'unitType',
        key: 'unitType',
      },
      {
        title: '回路号',
        dataIndex: 'loopNumber',
        key: 'loopNumber',
      },
      {
        title: '部位号',
        dataIndex: 'partNumber',
        key: 'partNumber',
      },
      {
        title: '部件型号',
        dataIndex: 'componentModel',
        key: 'componentModel',
      },
      {
        title: '生产企业名称',
        dataIndex: 'createCompanyName',
        key: 'createCompanyName',
      },
      {
        title: '安装楼层',
        dataIndex: 'installFloor',
        key: 'installFloor',
      },
      {
        title: '安装位置',
        dataIndex: 'installAddress',
        key: 'installAddress',
      },
      {
        title: '备注（非必填）',
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: '错误提示',
        dataIndex: 'error.value',
        key: 'error.value',
      },
    ];
    const props = {
      name: 'file',
      action: `http://192.168.10.55/acloud_new/v2/pointData/pointData/${hostId}.json`,
      headers: {
        authorization: 'authorization-text',
      },
      /*       onChange(info) {
              if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
              }
              if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
              } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
              }
            }, */
    };

    return (
      // /* {/* <PageHeaderLayout
      //   title="常熟市鑫博伟纺织有限公司"
      //   logo={<Icon type="apple" />}
      // >
      // </PageHeaderLayout> */} */
      <Card>
        <Form>
          <FormItem label="主机编号" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
            {getFieldDecorator('hostId', { initialValue: hostId })(<Input disabled />)}
          </FormItem>
          <FormItem label="上传附件" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
            <Upload {...props}>
              <Button>
                <Icon type="upload" /> 选择文件
              </Button>
            </Upload>
          </FormItem>
        </Form>
        <Table bordered dataSource={dataSource} columns={columns} />
      </Card>
    );
  }
}
