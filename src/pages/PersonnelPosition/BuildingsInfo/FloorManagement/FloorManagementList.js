import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Input, Table, Select, Divider, Col, Popconfirm, message } from 'antd';
import { routerRedux } from 'dva/router';

import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import codesMap from '@/utils/codes';
import { AuthA, AuthButton } from '@/utils/customAuth';

const FormItem = Form.Item;
const Option = Select.Option;

//面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '建筑物信息列表',
    name: '建筑物信息列表',
  },
  {
    title: '楼层管理列表',
    name: '楼层管理列表',
  },
];

// 默认表单值
const defaultFormData = {
  businessType: undefined,
  lawType: undefined,
  content: undefined,
};

// const PAGE_SIZE = 10;

@connect(({ buildingsInfo, user, loading }) => ({
  buildingsInfo,
  user,
  loading: loading.models.buildingsInfo,
}))
@Form.create()
export default class FloorManagementList extends PureComponent {
  constructor(props) {
    super(props);
    this.formData = defaultFormData;
  }

  // 挂载后
  componentDidMount() {
    const {
      dispatch,
      buildingsInfo: {
        floorData: {
          pagination: { pageSize },
        },
      },
    } = this.props;
    // 获取列表
    dispatch({
      type: 'buildingsInfo/fetchFloorList',
      payload: {
        pageSize,
        pageNum: 1,
      },
    });
  }

  // 跳转到详情页面
  goLawsDetail = id => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/law-enforcement/laws/detail/${id}`));
  };

  // 跳转到编辑页面
  goLawsEdit = id => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/law-enforcement/laws/edit/${id}`));
  };

  /* 查询按钮点击事件 */
  handleClickToQuery = () => {
    // const {
    //   dispatch,
    //   form: { getFieldsValue },
    //   lawDatabase: {
    //     data: {
    //       pagination: { pageSize },
    //     },
    //   },
    // } = this.props;
    // const data = getFieldsValue();
    // // 修改表单数据
    // this.formData = data;
    // // 重新请求数据
    // dispatch({
    //   type: 'lawDatabase/fetch',
    //   payload: {
    //     pageSize,
    //     pageNum: 1,
    //     ...data,
    //   },
    // });
  };

  /* 重置按钮点击事件 */
  handleClickToReset = () => {
    // const {
    //   dispatch,
    //   form: { resetFields },
    //   lawDatabase: {
    //     data: {
    //       pagination: { pageSize },
    //     },
    //   },
    // } = this.props;
    // // 清除筛选条件
    // resetFields();
    // this.formData = defaultFormData;
    // dispatch({
    //   type: 'lawDatabase/fetch',
    //   payload: {
    //     pageSize,
    //     pageNum: 1,
    //   },
    // });
  };

  /* 删除 */
  handleDelete = id => {
    // const {
    //   dispatch,
    //   lawDatabase: {
    //     data: {
    //       pagination: { pageSize },
    //     },
    //   },
    // } = this.props;
    // dispatch({
    //   type: 'lawDatabase/deleteLaws',
    //   payload: { id },
    //   callback: response => {
    //     if (response && response.code === 200) {
    //       dispatch({
    //         type: 'lawDatabase/fetch',
    //         payload: {
    //           pageSize,
    //           pageNum: 1,
    //         },
    //       });
    //       message.success('删除成功！');
    //     } else message.warning('该法律法规有违法行为关联关系，不予删除！');
    //   },
    // });
  };

  // 处理翻页
  handlePageChange = (pageNum, pageSize) => {
    // const {
    //   dispatch,
    //   form: { getFieldsValue },
    // } = this.props;
    // const data = getFieldsValue();
    // dispatch({
    //   type: 'lawDatabase/fetch',
    //   payload: {
    //     pageSize,
    //     pageNum,
    //     ...data,
    //   },
    // });
  };

  /* 渲染form表单 */
  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Card>
        <Form layout="inline">
          <Col>
            <FormItem>
              {getFieldDecorator('content', {
                initialValue: defaultFormData.content,
                getValueFromEvent: e => e.target.value.trim(),
              })(<Input placeholder="请输入楼层名称" />)}
            </FormItem>
            <FormItem>
              {getFieldDecorator('businessType', {})(
                <Select style={{ width: 200 }} placeholder="请选择楼层编号">
                  {[].map(item => (
                    <Option value={item.id} key={item.id}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
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
            <FormItem>
              <AuthButton
                type="primary"
                code={codesMap.lawEnforcement.laws.add}
                href="#/law-enforcement/laws/add"
              >
                新增
              </AuthButton>
            </FormItem>
          </Col>
        </Form>
      </Card>
    );
  }

  /* 渲染table */
  renderTable() {
    const {
      tableLoading,
      buildingsInfo: {
        floorData: {
          list,
          pagination: { total, pageSize, pageNum },
        },
      },
    } = this.props;

    /* 配置描述 */
    const COLUMNS = [
      {
        title: '楼层名称',
        dataIndex: 'floorName',
        key: 'floorName',
        align: 'center',
        width: '35%',
      },
      {
        title: '楼层编号',
        dataIndex: 'floorNumber',
        key: 'floorNumber',
        align: 'center',
        width: '15%',
      },
      {
        title: '平面图',
        dataIndex: 'pic',
        key: 'pic',
        align: 'center',
        width: '30%',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        align: 'center',
        render: (record, rows) => (
          <span>
            <AuthA
              code={codesMap.lawEnforcement.laws.detail}
              onClick={() => this.goLawsDetail(rows.id)}
            >
              查看
            </AuthA>
            <Divider type="vertical" />
            <AuthA
              code={codesMap.lawEnforcement.laws.edit}
              onClick={() => this.goLawsEdit(rows.id)}
            >
              编辑
            </AuthA>
            <Divider type="vertical" />
            <Popconfirm
              title="确认要删除该法律法规吗？"
              onConfirm={() => this.handleDelete(rows.id)}
            >
              <AuthA code={codesMap.lawEnforcement.laws.delete}>删除</AuthA>
            </Popconfirm>
          </span>
        ),
      },
    ];

    return (
      <Card style={{ marginTop: '20px' }}>
        {list && list.length ? (
          <Table
            loading={tableLoading}
            rowKey="id"
            columns={COLUMNS}
            dataSource={list}
            pagination={{
              current: pageNum,
              pageSize,
              total,
              showQuickJumper: true,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '15', '20'],
              onChange: this.handlePageChange,
              onShowSizeChange: (num, size) => {
                this.handlePageChange(1, size);
              },
            }}
            bordered
          />
        ) : (
          <div style={{ textAlign: 'center' }}>暂无数据</div>
        )}
      </Card>
    );
  }

  render() {
    const {
      buildingsInfo: {
        floorData: { list },
      },
    } = this.props;
    return (
      <PageHeaderLayout
        title="楼层管理"
        breadcrumbList={breadcrumbList}
        content={
          <div>
            列表记录：
            {list.length}{' '}
          </div>
        }
      >
        {this.renderForm()}
        {this.renderTable()}
      </PageHeaderLayout>
    );
  }
}
