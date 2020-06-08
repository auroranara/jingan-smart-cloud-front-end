import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Button, Input, DatePicker, Table } from 'antd';
import { routerRedux } from 'dva/router';
import router from 'umi/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';

import Lightbox from 'react-images';
import styles from './MaintenanceRecord.less';
import codesMap from '@/utils/codes';
import { AuthA } from '@/utils/customAuth';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

// 标题
const title = '维保记录';

//面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '数据分析',
    name: '数据分析',
  },
  {
    title,
    name: '维保记录',
  },
];

/* 配置描述 */
const defaultColumns = fuc => {
  return [
    {
      title: '维保时间',
      dataIndex: 'checkDate',
      key: 'checkDate',
      align: 'center',
      width: 200,
      render: time => {
        return moment(time).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: '维保人员',
      dataIndex: 'checkUsers',
      key: 'checkUserIds',
      align: 'center',
      width: 220,
      render: val => {
        return val && val.length > 0
          ? val.map((v, i) => {
              return <div key={i}> {v.userName}</div>;
            })
          : '';
      },
    },
    {
      title: '联系电话',
      dataIndex: 'checkUsers',
      key: 'phoneNumber',
      align: 'center',
      width: 240,
      render: val => {
        return val && val.length > 0
          ? val.map((v, i) => {
              return <div key={i}>{v.phoneNumber}</div>;
            })
          : '';
      },
    },
    {
      title: '服务单位',
      dataIndex: 'bcheckCompanyName',
      key: 'bcheckCompanyId',
      align: 'center',
      width: 300,
    },
    {
      title: '综合评分',
      dataIndex: 'score',
      key: 'score',
      align: 'center',
      width: 120,
    },
    {
      title: '附件',
      dataIndex: 'files',
      key: 'fileIds',
      align: 'center',
      width: 150,
      render: (val, record) => {
        console.log('fuc', fuc);

        const { files } = record;
        return (
          <Fragment>
            {files && files.length ? (
              <AuthA
                code={codesMap.dataAnalysis.MaintenanceRecord.view}
                onClick={() => {
                  fuc(files);
                }}
              >
                查看附件
              </AuthA>
            ) : (
              <span style={{ color: '#aaa' }}>查看附件</span>
            )}
          </Fragment>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      fixed: 'right',
      align: 'center',
      width: 100,
      render: (val, record) => (
        <AuthA
          code={codesMap.dataAnalysis.MaintenanceRecord.view}
          onClick={() => goRecordDetail(record.id)}
        >
          查看
        </AuthA>
      ),
    },
  ];
};

const goRecordDetail = id => {
  router.push(`/data-analysis/maintenance-record/detail/${id}`);
};

// 默认表单值
const defaultFormData = {
  maintenanceName: undefined,
  serviceUnitName: undefined,
};

@connect(({ maintenanceRecord, user, loading }) => ({
  maintenanceRecord,
  user,
  loading: loading.models.maintenanceRecord,
}))
@Form.create()
export default class MaintenanceRecordList extends PureComponent {
  constructor(props) {
    super(props);
    this.formData = defaultFormData;
  }

  state = {
    visible: false,
    imgUrl: [], // 附件图片列表
    currentImage: 0, // 展示附件大图下标
    columns: [
      {
        title: '维保时间',
        dataIndex: 'checkDate',
        key: 'checkDate',
        align: 'center',
        width: 200,
        render: time => {
          return moment(time).format('YYYY-MM-DD HH:mm:ss');
        },
      },
      {
        title: '维保人员',
        dataIndex: 'checkUsers',
        key: 'checkUserIds',
        align: 'center',
        width: 220,
        render: val => {
          return val && val.length > 0
            ? val.map((v, i) => {
                return <div key={i}> {v.userName}</div>;
              })
            : '';
        },
      },
      {
        title: '联系电话',
        dataIndex: 'checkUsers',
        key: 'phoneNumber',
        align: 'center',
        width: 240,
        render: val => {
          return val && val.length > 0
            ? val.map((v, i) => {
                return <div key={i}>{v.phoneNumber}</div>;
              })
            : '';
        },
      },
      {
        title: '服务单位',
        dataIndex: 'bcheckCompanyName',
        key: 'bcheckCompanyId',
        align: 'center',
        width: 300,
      },
      {
        title: '综合评分',
        dataIndex: 'score',
        key: 'score',
        align: 'center',
        width: 120,
      },
      {
        title: '附件',
        dataIndex: 'files',
        key: 'fileIds',
        align: 'center',
        width: 150,
        render: (val, record) => {
          const { files } = record;
          return (
            <Fragment>
              {files && files.length ? (
                <AuthA
                  code={codesMap.dataAnalysis.MaintenanceRecord.view}
                  onClick={() => {
                    this.handleShowModal(files);
                  }}
                >
                  查看附件
                </AuthA>
              ) : (
                <span style={{ color: '#aaa' }}>查看附件</span>
              )}
            </Fragment>
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'right',
        align: 'center',
        width: 100,
        render: (val, record) => (
          <AuthA
            code={codesMap.dataAnalysis.MaintenanceRecord.view}
            onClick={() => goRecordDetail(record.id)}
          >
            查看
          </AuthA>
        ),
      },
    ],

    // defaultColumns(this.handleShowModal),
  };

  // 挂载后
  componentDidMount() {
    const {
      dispatch,
      maintenanceRecord: {
        data: {
          pagination: { pageSize },
        },
      },
      user: {
        currentUser: { companyBasicInfo: { isBranch } = {} },
      },
    } = this.props;
    const { columns } = this.state;
    if (!isBranch) {
      const newColumns = [
        {
          title: '维保单位',
          dataIndex: 'checkCompanyName',
          key: 'checkCompanyId',
          align: 'center',
          width: 300,
        },
      ];
      this.setState({ columns: [...newColumns, ...columns] });
    }
    // 获取记录列表
    dispatch({
      type: 'maintenanceRecord/fetch',
      payload: {
        pageSize,
        pageNum: 1,
      },
    });
  }

  // 跳转到记录详情页面
  // goRecordDetail = id => {
  //   const { dispatch } = this.props;
  //   dispatch(routerRedux.push(`/data-analysis/maintenance-record/detail/${id}`));
  // };

  // 异常页面
  goToException = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/exception/500'));
  };

  // 查看附件
  handleShowModal = files => {
    const newFiles = files.map(({ webUrl }) => {
      return {
        src: webUrl,
      };
    });
    this.setState({
      visible: true,
      imgUrl: newFiles,
      currentImage: 0,
    });
  };

  // 关闭查看附件弹窗
  handleModalClose = () => {
    this.setState({
      visible: false,
    });
  };

  // 附件图片的点击翻入上一页
  gotoPrevious = () => {
    let { currentImage } = this.state;
    if (currentImage <= 0) return;
    this.setState({ currentImage: --currentImage });
  };

  // 附件图片的点击翻入下一页
  gotoNext = () => {
    let { currentImage, imgUrl } = this.state;
    if (currentImage >= imgUrl.length - 1) return;
    this.setState({ currentImage: ++currentImage });
  };

  // 附件图片点击下方缩略图
  handleClickThumbnail = i => {
    const { currentImage } = this.state;
    if (currentImage === i) return;
    this.setState({ currentImage: i });
  };

  /* 查询按钮点击事件 */
  handleClickToQuery = () => {
    const {
      form: { getFieldsValue },
      maintenanceRecord: {
        data: {
          pagination: { pageSize },
        },
      },
    } = this.props;

    const data = getFieldsValue();
    const { checkDate, ...restValues } = data;
    const startTime = checkDate && checkDate.length > 0 ? checkDate[0] : undefined;
    const endTime = checkDate && checkDate.length > 0 ? checkDate[1] : undefined;

    // 修改表单数据
    this.formData = data;
    // 重新请求数据
    this.props.dispatch({
      type: 'maintenanceRecord/fetch',
      payload: {
        ...restValues,
        startTime: startTime && startTime.format('YYYY/M/D HH:mm:ss'),
        endTime: endTime && endTime.format('YYYY/M/D HH:mm:ss'),
        pageSize,
        pageNum: 1,
      },
    });
  };

  /* 处理翻页 */
  handlePageChange = (pageNum, pageSize) => {
    const {
      dispatch,
      form: { getFieldsValue },
    } = this.props;
    const { checkDate, ...query } = getFieldsValue();
    if (checkDate && checkDate.length) {
      const [start, end] = checkDate;
      query.startTime = start.format('YYYY-MM-DD HH:mm:ss');
      query.endTime = end.format('YYYY-MM-DD HH:mm:ss');
    }
    dispatch({
      type: 'maintenanceRecord/fetch',
      payload: {
        pageSize,
        pageNum,
        ...query,
      },
    });
  };

  /* 重置按钮点击事件 */
  handleClickToReset = () => {
    const {
      dispatch,
      form: { resetFields },
      maintenanceRecord: {
        data: {
          pagination: { pageSize },
        },
      },
    } = this.props;
    // 清除筛选条件
    resetFields();
    this.formData = defaultFormData;
    dispatch({
      type: 'maintenanceRecord/fetch',
      payload: {
        pageSize,
        pageNum: 1,
      },
    });
  };

  /* 渲染form表单 */
  renderForm() {
    const {
      form: { getFieldDecorator },
      user: {
        currentUser: { companyBasicInfo: { isBranch } = {} },
      },
    } = this.props;

    return (
      <Card>
        <Form layout="inline">
          {!isBranch && (
            <FormItem>
              {getFieldDecorator('checkCompanyName', {
                initialValue: defaultFormData.checkCompanyName,
                getValueFromEvent: e => e.target.value.trim(),
              })(<Input placeholder="请输入维保单位名称" />)}
            </FormItem>
          )}
          <FormItem>
            {getFieldDecorator('bcheckCompanyName', {
              initialValue: defaultFormData.bcheckCompanyName,
              getValueFromEvent: e => e.target.value.trim(),
            })(<Input placeholder="请输入服务单位名称" />)}
          </FormItem>
          <FormItem className={styles.formItem}>
            {getFieldDecorator('checkDate')(
              <RangePicker
                format="YYYY-MM-DD HH:mm:ss"
                placeholder={['开始时间', '结束时间']}
                showTime={{
                  defaultValue: [moment('0:0:0', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                }}
              />
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" onClick={this.handleClickToQuery}>
              查询
            </Button>
          </FormItem>
          <FormItem>
            <Button onClick={this.handleClickToReset}>重置</Button>
          </FormItem>
        </Form>
      </Card>
    );
  }

  /* 渲染table */
  renderTable() {
    const {
      tableLoading,
      maintenanceRecord: {
        data: {
          list,
          pagination: { total, pageSize, pageNum },
        },
      },
    } = this.props;

    const { visible, imgUrl, currentImage, columns } = this.state;

    return (
      <Card style={{ marginTop: '20px' }}>
        {list && list.length ? (
          <Table
            loading={tableLoading}
            rowKey="id"
            columns={columns}
            dataSource={list}
            pagination={{
              current: pageNum,
              pageSize,
              total,
              showQuickJumper: true,
              showSizeChanger: true,
              // pageSizeOptions: ['5', '10', '15', '20'],
              onChange: this.handlePageChange,
              onShowSizeChange: (num, size) => {
                this.handlePageChange(1, size);
              },
            }}
            scroll={{ x: 1400 }}
            bordered
          />
        ) : (
          <div style={{ textAlign: 'center' }}>暂无数据</div>
        )}
        <Lightbox
          images={imgUrl}
          isOpen={visible}
          currentImage={currentImage}
          onClickPrev={this.gotoPrevious}
          onClickNext={this.gotoNext}
          onClose={this.handleModalClose}
          showThumbnails
          onClickThumbnail={this.handleClickThumbnail}
          imageCountSeparator="/"
        />
      </Card>
    );
  }

  render() {
    const {
      maintenanceRecord: {
        data: {
          pagination: { total },
        },
      },
    } = this.props;

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            列表记录：
            {total}{' '}
          </div>
        }
      >
        {this.renderForm()}
        {this.renderTable()}
      </PageHeaderLayout>
    );
  }
}
