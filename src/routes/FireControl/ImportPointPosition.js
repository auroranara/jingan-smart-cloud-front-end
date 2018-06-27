import React, { PureComponent } from 'react';
import { Form, Card, Table, Upload, Button, Icon, Popover, Spin } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './ImportPointPosition.less';
import Result from '../../components/Result';

@connect(({ transmission, loading }) => ({
  transmission,
  loading: loading.models.transmission,
}))
@Form.create()
export default class ImportPointPosition extends PureComponent {
  state = {
    failed: 0,
    success: 0,
    total: 0,
    updated: 0,
    loading: false,
    dataSource: [],
    showResult: false,
  };
  handleChange = (info) => {
    if (info.file.status === 'uploading ') {
      this.setState({ loading: true })
    }
    if (info.file.response && info.file.response.code && info.file.response.code === 200) {
      this.setState({ showResult: true, loading: false })
      if (info.file.response.data) {
        this.setState({ failed: info.file.response.data.failed, success: info.file.response.data.success, total: info.file.response.data.total, updated: info.file.response.data.updated })
        if (info.file.response.data.list && info.file.response.data.list.length) {
          this.setState({ dataSource: info.file.response.data.list })
        }
      }
    }
  }
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
    const description = (id) => {
      return (
        <div>
          <span>主机编号：{id}</span>
        </div>
      )
    }
    const message = (
      <div style={{ color: '#4d4848', fontSize: '17px' }}>
        <span>本次导入共{this.state.total}个点位。</span>
        <span style={{ display: this.state.success > 0 ? 'inline' : 'none' }}>新建信息{this.state.success}条。</span>
        <span style={{ display: this.state.updated > 0 ? 'inline' : 'none' }}>更新信息{this.state.updated}条。</span>
        <span style={{ display: this.state.failed > 0 ? 'inline' : 'none' }}>信息错误<span style={{ color: 'red' }}>{this.state.failed}</span>条。</span>
      </div>)
    const columns = [
      {
        title: '行序号',
        dataIndex: 'row',
        key: 'row',
        align: 'center',
        fixed: 'left',
        width: 80,
      },
      {
        title: '消防设施系统类型',
        dataIndex: 'systemType',
        key: 'systemType',
        align: 'center',
        width: 300,
        render(val, rows) {
          return tableCell(val, rows, 'systemType');
        },
      },
      {
        title: '消防设施部件类型',
        dataIndex: 'unitType',
        key: 'unitType',
        align: 'center',
        width: 300,
        render(val, rows) {
          return tableCell(val, rows, 'unitType');
        },
      },
      {
        title: '回路号',
        dataIndex: 'loopNumber',
        key: 'loopNumber',
        align: 'center',
        width: 100,
        render(val, rows) {
          return tableCell(val, rows, 'loopNumber');
        },
      },
      {
        title: '部位号',
        dataIndex: 'partNumber',
        key: 'partNumber',
        align: 'center',
        width: 100,
        render(val, rows) {
          return tableCell(val, rows, 'partNumber');
        },
      },
      {
        title: '部件型号',
        dataIndex: 'componentModel',
        key: 'componentModel',
        align: 'center',
        width: 120,
        render(val, rows) {
          return tableCell(val, rows, 'componentModel');
        },
      },
      {
        title: '生产企业名称',
        dataIndex: 'createCompanyName',
        key: 'createCompanyName',
        align: 'center',
        width: 250,
        render(val, rows) {
          return tableCell(val, rows, 'createCompanyName');
        },
      },
      {
        title: '安装楼层',
        dataIndex: 'installFloor',
        key: 'installFloor',
        align: 'center',
        width: 100,
        render(val, rows) {
          return tableCell(val, rows, 'installFloor');
        },
      },
      {
        title: '安装位置',
        dataIndex: 'installAddress',
        key: 'installAddress',
        align: 'center',
        width: 180,
        render(val, rows) {
          return tableCell(val, rows, 'installAddress');
        },
      },
      {
        title: '备注（非必填）',
        dataIndex: 'remark',
        align: 'center',
        key: 'remark',
        width: 150,
        render(val, rows) {
          return tableCell(val, rows, 'remark');
        },
      },
    ];
    const props = {
      name: 'file',
      action: `http://118.126.110.115:3001/mock/28/acloud_new/v2/pointData/pointData/${hostId}`,
      headers: {
        authorization: 'authorization-text',
      },
      accept: '.xls,.xlsx',
      onChange: this.handleChange,
    };

    return (
      <PageHeaderLayout
        title="常熟市鑫博伟纺织有限公司"
        logo={<Icon type="apple" />}
        content={description(hostId)}
      >
        <Card title="导入点位数据" className={styles.cardContainer}>
          <Form>
            <FormItem label="上传附件" labelCol={{ span: 2 }} wrapperCol={{ span: 18 }}>
              <Upload {...props}>
                <Button type="primary">
                  <Icon type="upload" /> 选择文件
                </Button>
              </Upload>
            </FormItem>
          </Form>
        </Card>
        <Spin spinning={this.state.loading}>
          <Card className={styles.cardContainer} style={{ display: this.state.showResult ? 'block' : 'none' }}>
            <Result
              style={{ width: '100%', fontSize: '72px' }}
              type={this.state.failed > 0 ? "error" : "success"}
              title={this.state.failed > 0 ? "校验失败" : "校验成功"}
              description={message}
            />
            {/* <Result
              style={{ display: this.state.showError ? 'block' : 'none', width: '100%', fontSize: '72px' }}
              type="error"
              title="校验失败"
              description={<span className={styles.message}>本次导入共有信息错误<span className={styles.error}>{this.state.failed}</span>条</span>}
            /> */}
            <div style={{ display: this.state.failed > 0 ? 'block' : 'none' }}>
              {/* <span className={styles.tableTitle}>错误信息提示框：</span> */}
              <Table rowKey="row" pagination={false} dataSource={this.state.dataSource} columns={columns} scroll={{ x: 1500 }} />
            </div>
          </Card>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
