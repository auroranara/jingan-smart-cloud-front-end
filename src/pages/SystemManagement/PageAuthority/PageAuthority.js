import React, { Component, createContext } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import {
  Button,
  Card,
  Table,
  Tree,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  notification,
} from 'antd';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles from './PageAuthority.less';
import { sortTree, renderRoleTreeNodes, addProps } from './utils';

const data = [];
for (let i = 0; i < 30; i++) {
  data.push({
    key: i.toString(),
    id: i.toString(),
    parentId: `parent-${i}`,
    code: `code-${i}`,
    ename: `Edrward ${i}`,
    zName: '查看',
    showZName: '查看',
    sort: 0,
    type: Math.random() > 0.5 ? 'menu' : 'page',
    method: Math.random() > 0.5 ? 'GET' : 'POST',
    url: 'url',
  });
}
const { Item: FormItem } = Form;
const EditableContext = createContext();

// 包裹EditableCell用的，其子元素在props.children中传入
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

// 每个row都是一个单独的form表单
const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends Component {
  // getInput = () => {
  //   if (this.props.inputType === 'number') {
  //     return <InputNumber />;
  //   }
  //   return <Input />;
  // };

  render() {
    const { editing, dataIndex, title, inputType, record, index, ...restProps } = this.props;
    return (
      <EditableContext.Consumer>
        {form => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [
                      {
                        required: true,
                        message: `Please Input ${title}!`,
                      },
                    ],
                    initialValue: record[dataIndex],
                  })(<Input />)}
                </FormItem>
              ) : (
                restProps.children
              )}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

@connect(({ pageAuth, loading }) => ({ pageAuth, loading: loading.models.pageAuth }))
export default class PageAuthority extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [], editingKey: '' };
    this.columns = [
      {
        title: '编号',
        dataIndex: 'id',
        width: 300,
        // align: 'center',
        // editable: true,
      },
      {
        title: '父节点编号',
        dataIndex: 'parentId',
        width: 300,
        // align: 'center',
        // editable: true,
      },
      {
        title: '编码',
        dataIndex: 'code',
        width: 450,
        // align: 'center',
        editable: true,
      },
      {
        title: '英文名称',
        dataIndex: 'ename',
        width: 200,
        align: 'center',
        editable: true,
      },
      {
        title: '中文名称(参考)',
        dataIndex: 'zname',
        width: 250,
        align: 'center',
        editable: true,
      },
      {
        title: '中文名称(显示)',
        dataIndex: 'showZname',
        width: 250,
        align: 'center',
        editable: true,
      },
      {
        title: '排序优先级',
        dataIndex: 'sort',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '节点类型',
        dataIndex: 'type',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '请求方式',
        dataIndex: 'method',
        width: 100,
        align: 'center',
        editable: true,
      },
      {
        title: '路径',
        dataIndex: 'url',
        // width: 350,
        // align: 'center',
        editable: true,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: 100,
        align: 'center',
        fixed: 'right',
        render: (text, record) => {
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        // href="javascript:;"
                        onClick={() => this.save(form, record.id)}
                        style={{ marginRight: 8 }}
                      >
                        保存
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm title="确定取消？" onConfirm={() => this.cancel(record.id)}>
                    <a>取消</a>
                  </Popconfirm>
                </span>
              ) : (
                <span>
                  <Link to={`/system-management/page-authority/add-or-edit/${record.id}`}>编辑</Link>
                  {/* <a onClick={() => this.edit(record.id)}>编辑</a>
                  <Popconfirm title="确定删除？" onConfirm={null}>
                    <a onClick={null} className={styles.delete}>
                      删除
                    </a>
                  </Popconfirm> */}
                </span>
              )}
            </div>
          );
        },
      },
    ];
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'pageAuth/fetchTree',
      callback: data => {
        addProps(data);
        sortTree(data);
      },
    });
    this.fetchList();
  }

  // componentWillUnmount() {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'pageAuth/saveTree',
  //     payload: [],
  //   });
  // }

  selectedKeys = [];
  checkedKeys = [];

  fetchList = (ids=[]) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pageAuth/fetchList',
      payload: { ids: ids.join(',') },
      callback: list => {
        this.setState({ data: list });
      },
    });
  }

  isEditing = record => {
    return record.id === this.state.editingKey;
  };

  edit(key) {
    this.setState({ editingKey: key });
  }

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ data: newData, editingKey: '' });
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: '' });
      }
    });
  }

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  onSelect = selectedKeys => {
    this.selectedKeys = selectedKeys;
  };

  onCheck = checkedKeys => {
    this.checkedKeys = checkedKeys;
  };

  onSearch = e => {
    // console.log(this.checkedKeys);
    this.fetchList(this.checkedKeys);
  };

  jumpTo = id => {
    router.push(`/system-management/page-authority/add-or-edit/${id}`);
  };

  render() {
    // console.log(this.props.pageAuth);
    const { pageAuth: { tree=[] } } = this.props;
    const { data } = this.state;

    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          // inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <PageHeaderLayout
        title="页面权限树"
        // breadcrumbList={breadcrumbList}
        // content={
        //   <div>
        //     layout
        //   </div>
        // }
        action={
          <Button type="primary" onClick={e => this.jumpTo()}>
            新增
          </Button>
        }
      >
        <Card>
          <div className={styles.btnContainer}>
            <Button onClick={this.onSearch} className={styles.searchBtn}>
              搜索
            </Button>
            <Button
              onClick={e => {
                const id = this.selectedKeys[0];
                if (!id) {
                  notification.warn({
                    message: '友情提醒',
                    description: '请先从权限树中选择一个项目',
                  });
                  return;
                }

                this.jumpTo(id);
              }}
            >
              编辑
            </Button>
          </div>
          <Tree
            checkable
            // defaultExpandAll
            onSelect={this.onSelect}
            onCheck={this.onCheck}
            className={styles.tree}
          >
            {renderRoleTreeNodes(tree)}
          </Tree>
          <h3>权限列表：</h3>
          <Table
            rowKey="id"
            components={components}
            bordered
            dataSource={data}
            columns={columns}
            pagination={false}
            scroll={{ x: 2600, y: 600 }}
            // rowClassName="editable-row"
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
