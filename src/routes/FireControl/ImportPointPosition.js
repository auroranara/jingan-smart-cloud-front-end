import React, { PureComponent } from 'react';
import { Form, Card, Table, Upload, Button, Icon, Popover } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './ImportPointPosition.less';

@connect(({ transmission, loading }) => ({
  transmission,
  loading: loading.models.transmission,
}))
@Form.create()
export default class ImportPointPosition extends PureComponent {
  render() {
    const {
      match: {
        params: { hostId },
      },
    } = this.props;
    // const { getFieldDecorator } = form;
    const FormItem = Form.Item;
    const errorStatus = (key, error) => {
      const index = error.findIndex(item => item.key === key);
      return index > -1;
    };
    const content = (arr, key) => {
      const result = arr.find(item => item.key === key);
      return <div>{result.value}</div>;
      // return (<div>{arr.map(item => { return (<p key={item.key}>{item.value}</p>) })}</div>)
    };
    const tableCell = (val, rows, key) => {
      if (errorStatus(key, rows.error)) {
        return (
          <Popover content={content(rows.error, key)} title="错误提示" trigger="hover">
            <Icon style={{ color: 'red', marginRight: 10 }} type="exclamation-circle-o" />
            <span className={errorStatus(key, rows.error) ? styles.error : ''}>{val}</span>
          </Popover>
        );
      } else return <span>{val}</span>;
    };
    const description = (
      <div>
        <span>主机编号：</span>
      </div>
    );
    const dataSource = [
      {
        unitType: '【42】点型光电感烟火灾探测器',
        componentModel: 'TY-GD-G3',
        createCompanyName: '无锡海湾电子有限公司',
        systemType: '【1】火灾报警系统 ',
        partNumber: 4,
        remark: 6,
        row: 5,
        installFloor: '15d',
        error: [
          {
            key: 'partNumber',
            value: '楼层格式错误',
          },
        ],
        installAddress: '7号楼15层东',
        loopNumber: '172',
      },
      {
        unitType: '',
        componentModel: 'TY-GD-G3',
        createCompanyName: '无锡海湾电子有限公司',
        systemType: '【1】火灾报警系统 ',
        partNumber: '1X',
        remark: 3,
        row: 2,
        installFloor: 14,
        error: [
          {
            key: 'unitType',
            value: '数据不能为空；部件类型错误',
          },
          {
            key: 'loopNumber',
            value: '回路号格式错误',
          },
          {
            key: 'partNumber',
            value: '部件号格式错误',
          },
        ],
        installAddress: '7号楼14层东',
        loopNumber: '162X',
      },
    ];
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
        render(val, rows) {
          return tableCell(val, rows, 'systemType');
        },
      },
      {
        title: '消防设施部件类型',
        dataIndex: 'unitType',
        key: 'unitType',
        render(val, rows) {
          return tableCell(val, rows, 'unitType');
        },
      },
      {
        title: '回路号',
        dataIndex: 'loopNumber',
        key: 'loopNumber',
        render(val, rows) {
          return tableCell(val, rows, 'loopNumber');
        },
      },
      {
        title: '部位号',
        dataIndex: 'partNumber',
        key: 'partNumber',
        render(val, rows) {
          return tableCell(val, rows, 'partNumber');
        },
      },
      {
        title: '部件型号',
        dataIndex: 'componentModel',
        key: 'componentModel',
        render(val, rows) {
          return tableCell(val, rows, 'componentModel');
        },
      },
      {
        title: '生产企业名称',
        dataIndex: 'createCompanyName',
        key: 'createCompanyName',
        render(val, rows) {
          return tableCell(val, rows, 'createCompanyName');
        },
      },
      {
        title: '安装楼层',
        dataIndex: 'installFloor',
        key: 'installFloor',
        render(val, rows) {
          return tableCell(val, rows, 'installFloor');
        },
      },
      {
        title: '安装位置',
        dataIndex: 'installAddress',
        key: 'installAddress',
        render(val, rows) {
          return tableCell(val, rows, 'installAddress');
        },
      },
      {
        title: '备注（非必填）',
        dataIndex: 'remark',
        key: 'remark',
        render(val, rows) {
          return tableCell(val, rows, 'remark');
        },
      },
    ];
    const props = {
      name: 'file',
      action: `//acloud_new/v2/pointData/pointData/${hostId}.json`,
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
      <PageHeaderLayout
        title="常熟市鑫博伟纺织有限公司"
        logo={<Icon type="apple" />}
        content={description}
      >
        <Card className={styles.cardContainer}>
          <Form>
            <FormItem label="主机编号" labelCol={{ span: 3 }} wrapperCol={{ span: 18 }}>
              <span>{hostId}</span>
            </FormItem>
            <FormItem label="上传附件" labelCol={{ span: 3 }} wrapperCol={{ span: 18 }}>
              <Upload {...props}>
                <Button>
                  <Icon type="upload" /> 选择文件
                </Button>
              </Upload>
            </FormItem>
          </Form>
          <span className={styles.tableTitle}>错误信息提示框：</span>
          <Table pagination={false} bordered dataSource={dataSource} columns={columns} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
