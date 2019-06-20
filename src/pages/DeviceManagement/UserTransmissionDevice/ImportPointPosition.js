import React, { PureComponent } from 'react';
import { Form, Card, Table, Upload, Button, Icon, Popover, Spin } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles from './ImportPointPosition.less';
import Result from '@/components/Result';
import { getToken } from '@/utils/authority';

@connect(({ pointPosition, loading }) => ({
  pointPosition,
  loading: loading.models.pointPosition,
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
    showResultCard: false,
    showErrorTable: false,
    showErrorLogo: false,
    uploadStatus: 200,
    msg: '',
  };

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { hostId },
      },
    } = this.props;
    dispatch({ type: 'pointPosition/fetchHostDetail', payload: hostId });
  }

  // 上传时多个阶段会调用
  handleChange = info => {
    const fileList = info.fileList.slice(-1);
    this.setState({ fileList });

    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
    }
    if (info.file.response) {
      if (info.file.response.code && info.file.response.code === 200) {
        if (info.file.response.data) {
          const { failed, success, updated, total } = info.file.response.data;
          this.setState({
            failed,
            success,
            updated,
            total,
            showResultCard: true,
            loading: false,
            dataSource: info.file.response.data.list,
            showErrorLogo: failed > 0,
            showErrorTable: failed > 0,
            uploadStatus: 200,
          });
        }
      } else {
        this.setState({
          failed: 0,
          success: 0,
          total: 0,
          updated: 0,
          loading: false,
          showResultCard: true,
          showErrorTable: false,
          showErrorLogo: true,
          uploadStatus: info.file.response.code,
          msg: info.file.response.msg,
        });
      }
    }
  };

  // 返回上个页面
  handleBack = () => {
    history.back();
  };

  render() {
    const {
      match: {
        params: { hostId, companyId },
      },
      pointPosition: {
        hostDetail: { deviceCode },
      },
    } = this.props;
    const {
      uploadStatus,
      msg,
      total,
      success,
      updated,
      failed,
      showResultCard,
      loading,
      fileList,
      showErrorLogo,
      dataSource,
      showErrorTable,
    } = this.state;
    // const { getFieldDecorator } = form;

    const FormItem = Form.Item;

    // 面包屑
    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '消防维保',
        name: '消防维保',
      },
      {
        title: '用户传输装置',
        name: '用户传输装置',
        href: '/device-management/user-transmission-device/list',
      },
      {
        title: '详情页',
        name: '详情页',
        href: `/device-management/user-transmission-device/${companyId}/detail`,
      },
      {
        title: '导入点位数据',
        name: '导入点位数据',
      },
    ];

    // 判断error数组中是否存在当前单元格key
    const errorStatus = (key, error) => {
      const index = error.findIndex(item => item.key === key);
      return index > -1;
    };

    // 表格错误提示的信息
    const content = (arr, key) => {
      const result = arr.find(item => item.key === key);
      return <div>{result.value}</div>;
    };

    // 表格首列错误提示信息
    const firstContent = arr => {
      let num = 0;
      return (
        <div>
          {arr.map(item => {
            num += 1;
            return (
              <p key={item.key}>
                （{num}）{item.value}
              </p>
            );
          })}
        </div>
      );
    };

    // 表格单元格单元格
    const tableCell = (val, rows, key) => {
      if (errorStatus(key, rows.error)) {
        return (
          <Popover content={content(rows.error, key)} title="错误提示" trigger="hover">
            <Icon style={{ color: 'red', marginRight: 10 }} type="exclamation-circle-o" />
            <span className={styles.error}>{val}</span>
          </Popover>
        );
      } else return <span>{val}</span>;
    };

    // 主机信息
    const description = id => {
      return (
        <div>
          <span>
            主机编号：
            {id}
          </span>
        </div>
      );
    };

    // 上传后的统计信息
    const message = (
      <div style={{ color: '#4d4848', fontSize: '17px' }}>
        {uploadStatus !== 200 && <span>{msg}</span>}
        {failed === 0 &&
          uploadStatus === 200 && (
            <span>
              本次导入数据共计
              {total}
              条。
            </span>
          )}
        {success > 0 && (
          <span>
            新建信息
            {success}
            条。
          </span>
        )}
        {updated > 0 && (
          <span>
            更新信息
            {updated}
            条。
          </span>
        )}
        {failed > 0 && (
          <span>
            错误信息共计
            <span style={{ color: 'red' }}>{failed}</span>
            条，请核对后再试。
          </span>
        )}
        {!showErrorLogo && <span>错误信息0条。</span>}
      </div>
    );

    const columns = [
      {
        title: '行序号',
        dataIndex: 'row',
        key: 'row',
        align: 'center',
        fixed: 'left',
        width: 100,
        render(val, rows) {
          return (
            <Popover content={firstContent(rows.error)} title="错误提示" trigger="hover">
              <Icon style={{ color: 'red', marginRight: 10 }} type="exclamation-circle-o" />
              <span className={styles.error}>{val}</span>
            </Popover>
          );
        },
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
      action: `/acloud_new/v2/pointData/pointData/${hostId}`,
      accept: '.xls,.xlsx',
      onChange: this.handleChange,
      headers: {
        'JA-Token': getToken(),
      },
    };

    return (
      <PageHeaderLayout content={description(deviceCode)} breadcrumbList={breadcrumbList}>
        <Card title="导入点位数据" className={styles.cardContainer}>
          <Form>
            <FormItem label="上传附件" labelCol={{ span: 2 }} wrapperCol={{ span: 18 }}>
              <Upload {...props} fileList={fileList}>
                <Button type="primary" loading={loading}>
                  <Icon type="upload" /> 选择文件
                </Button>
              </Upload>
            </FormItem>
          </Form>
        </Card>
        <Spin spinning={loading}>
          {showResultCard && (
            <Card className={styles.cardContainer}>
              <Result
                style={{ fontSize: '72px' }}
                type={showErrorLogo ? 'error' : 'success'}
                title={showErrorLogo ? '校验失败' : '校验成功'}
                description={message}
              />
              {showErrorTable && (
                <div>
                  <Table
                    rowKey="row"
                    pagination={false}
                    dataSource={dataSource}
                    columns={columns}
                    scroll={{ x: 1500 }}
                  />
                </div>
              )}
              <Button
                style={{ margin: '0 auto', display: 'block', marginTop: '20px' }}
                type="primary"
                onClick={this.handleBack}
              >
                确定
              </Button>
            </Card>
          )}
        </Spin>
      </PageHeaderLayout>
    );
  }
}
