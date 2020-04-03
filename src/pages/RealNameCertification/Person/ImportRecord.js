import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Button, BackTop, Table } from 'antd';
import moment from 'moment';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import ImagePreview from '@/jingan-components/ImagePreview';
import router from 'umi/router';

const title = '批量导入照片记录';
const defaultPageSize = 10;

@connect(({ realNameCertification, user, loading }) => ({
  realNameCertification,
  user,
  loading: loading.effects['realNameCertification/fetchPersonList'],
}))
@Form.create()
export default class PersonnelList extends PureComponent {
  state = {
    images: [],
    currentImage: 0,
    imgVisible: false,
    imgLoading: false,
    imgFileList: [], // 导入的数据列表
    currentPage: 1,
  };

  componentDidMount() {
    this.fetchList();
  }

  // 记录列表
  fetchList = (pageNum = 1, pageSize = defaultPageSize) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'realNameCertification/fetchRecordList',
      payload: { pageNum, pageSize },
    });
  };

  hanldleImgModal = () => {
    this.setState({ imgVisible: true });
  };

  handleImgClose = () => {
    this.setState({ imgVisible: false, imgFileList: [] });
  };

  handleTableData = (list = [], indexBase) => {
    return list.map((item, index) => {
      return {
        ...item,
        index: indexBase + index + 1,
      };
    });
  };

  hanldleBack = () => {
    const {
      match: {
        params: { id },
      },
      location: {
        query: { companyName },
      },
    } = this.props;
    router.push(
      `/real-name-certification/personnel-management/person-list/${id}?companyName=${companyName}`
    );
  };

  // 渲染列表
  renderList = () => {
    const {
      loading,
      realNameCertification: {
        record: {
          list = [],
          pagination: { pageNum = 1, pageSize = defaultPageSize, total = 0 },
        },
      },
    } = this.props;

    const { currentPage } = this.state;
    const indexBase = (currentPage - 1) * defaultPageSize;

    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
      },
      {
        title: '照片',
        dataIndex: 'photoList',
        align: 'center',
        render: val =>
          Array.isArray(val) ? (
            <div>
              {val !== null &&
                val.map((item, i) => (
                  <img
                    onClick={() => {
                      this.setState({ images: val.map(item => item.webUrl), currentImage: i });
                    }}
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'contain',
                      cursor: 'pointer',
                      margin: '5px',
                    }}
                    key={i}
                    src={item.webUrl}
                    alt="照片"
                  />
                ))}
            </div>
          ) : (
            ''
          ),
      },
      {
        title: '上传结果',
        dataIndex: 'status',
        align: 'center',
        render: val => (+val === 1 ? '成功' : '失败'),
      },
      {
        title: '原因',
        dataIndex: 'reason',
        align: 'center',
      },
      {
        title: '时间',
        dataIndex: 'createTime',
        align: 'center',
        render: val => moment(+val).format('YYYY-MM-DD HH:mm:ss'),
      },
    ];
    return list && list.length ? (
      <Card style={{ marginTop: '24px' }}>
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={this.handleTableData(list, indexBase)}
          bordered
          // rowSelection={rowSelection}
          pagination={{
            current: pageNum,
            pageSize,
            total,
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: t => `共 ${t} 条记录`,
            pageSizeOptions: ['5', '10', '15', '20'],
            onChange: this.fetchList,
            onShowSizeChange: (num, size) => {
              this.fetchList(1, size);
            },
          }}
        />
      </Card>
    ) : (
      <div style={{ marginTop: '16px', textAlign: 'center' }}>暂无数据</div>
    );
  };

  render() {
    const {
      match: {
        params: { id },
      },
      location: {
        query: { companyName },
      },
    } = this.props;
    const { images, currentImage } = this.state;

    //面包屑
    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '实名制认证系统',
        name: '实名制认证系统',
      },
      {
        title: '人员管理',
        name: '人员管理',
        href: `/real-name-certification/personnel-management/person-list/${id}?companyName=${companyName}`,
      },
      {
        title,
        name: title,
      },
    ];
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div style={{ float: 'right' }}>
            <Button type="primary" onClick={this.hanldleBack}>
              返回
            </Button>
          </div>
        }
      >
        <BackTop />
        {this.renderList()}
        <ImagePreview images={images} currentImage={currentImage} />
      </PageHeaderLayout>
    );
  }
}
