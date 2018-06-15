import React, { PureComponent, Fragment } from 'react';
import { Table, Button, Input, message, Popconfirm, Divider } from 'antd';
<<<<<<< HEAD
import isEqual from 'lodash.isequal';
import styles from './style.less';

export default class TableForm extends PureComponent {
  index = 0;

  cacheOriginData = {};

=======
import styles from './style.less';

export default class TableForm extends PureComponent {
>>>>>>> init
  constructor(props) {
    super(props);

    this.state = {
      data: props.value,
      loading: false,
<<<<<<< HEAD
      /* eslint-disable-next-line react/no-unused-state */
      value: props.value,
    };
  }

  static getDerivedStateFromProps(nextProps, preState) {
    if (isEqual(nextProps.value, preState.value)) {
      return null;
    }
    return {
      data: nextProps.value,
      value: nextProps.value,
    };
  }

  getRowByKey(key, newData) {
    const { data } = this.state;
    return (newData || data).filter(item => item.key === key)[0];
  }

  toggleEditable = (e, key) => {
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
=======
      editData: [],
    };
  }

  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      return {
        data: nextProps.value,
      };
    }
    return null;
  }
  getRowByKey(key, newData) {
    return (newData || this.state.data).filter(item => item.key === key)[0];
  }
  index = 0;
  cacheOriginData = {};
  toggleEditable = (e, key) => {
    e.preventDefault();
    const newData = this.state.data.map(item => ({ ...item }));
>>>>>>> init
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  };
<<<<<<< HEAD

  newMember = () => {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    newData.push({
      key: `NEW_TEMP_ID_${this.index}`,
      workId: '',
      name: '',
      department: '',
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  };

  remove(key) {
    const { data } = this.state;
    const { onChange } = this.props;
    const newData = data.filter(item => item.key !== key);
    this.setState({ data: newData });
    onChange(newData);
  }

=======
  remove(key) {
    const { editData } = this.state;
    const editItem = editData.find(item => item.key === key);
    if (editItem && editItem.key) {
      // 如果存在缓存
      if (this.cacheOriginData[key]) {
        const data = [...this.state.data];
        data.push(this.cacheOriginData[key]);
        this.setState(
          {
            data,
          },
          () => {
            delete this.cacheOriginData[key];
          }
        );
      }
      // 从 editData 中删除
      this.setState({
        editData: editData.filter(item => item.key !== key),
      });
      return;
    }
    const newData = this.state.data.filter(item => item.key !== key);
    this.setState({ data: newData });
    this.props.onChange(newData);
  }
  newMember = () => {
    this.index += 1;
    this.setState({
      editData: [
        {
          key: `NEW_TEMP_ID_${this.index}`,
          workId: '',
          name: '',
          department: '',
          editable: true,
          isNew: true,
        },
      ],
    });
  };
>>>>>>> init
  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }
<<<<<<< HEAD

  handleFieldChange(e, fieldName, key) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
=======
  handleFieldChange(e, fieldName, key) {
    const newData = this.state.data.map(item => ({ ...item }));
>>>>>>> init
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e.target.value;
      this.setState({ data: newData });
    }
  }
<<<<<<< HEAD

=======
>>>>>>> init
  saveRow(e, key) {
    e.persist();
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};
      if (!target.workId || !target.name || !target.department) {
        message.error('请填写完整成员信息。');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
<<<<<<< HEAD
      const { data } = this.state;
      const { onChange } = this.props;
      delete target.isNew;
      this.toggleEditable(e, key);
      onChange(data);
=======
      delete target.isNew;
      this.toggleEditable(e, key);
      this.props.onChange(this.state.data);
>>>>>>> init
      this.setState({
        loading: false,
      });
    }, 500);
  }
<<<<<<< HEAD

  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
=======
  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const newData = this.state.data.map(item => ({ ...item }));
>>>>>>> init
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      target.editable = false;
      delete this.cacheOriginData[key];
    }
    this.setState({ data: newData });
    this.clickedCancel = false;
  }
<<<<<<< HEAD

=======
>>>>>>> init
  render() {
    const columns = [
      {
        title: '成员姓名',
        dataIndex: 'name',
        key: 'name',
        width: '20%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, 'name', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="成员姓名"
              />
            );
          }
          return text;
        },
      },
      {
        title: '工号',
        dataIndex: 'workId',
        key: 'workId',
        width: '20%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'workId', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="工号"
              />
            );
          }
          return text;
        },
      },
      {
        title: '所属部门',
        dataIndex: 'department',
        key: 'department',
        width: '40%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'department', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="所属部门"
              />
            );
          }
          return text;
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
<<<<<<< HEAD
          const { loading } = this.state;
          if (!!record.editable && loading) {
=======
          if (!!record.editable && this.state.loading) {
>>>>>>> init
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.saveRow(e, record.key)}>添加</a>
                  <Divider type="vertical" />
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                    <a>删除</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.key)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.key)}>取消</a>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];
<<<<<<< HEAD

    const { loading, data } = this.state;

    return (
      <Fragment>
        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
=======
    const dataSource = this.state.data.concat(this.state.editData);
    return (
      <Fragment>
        <Table
          loading={this.state.loading}
          columns={columns}
          dataSource={dataSource}
>>>>>>> init
          pagination={false}
          rowClassName={record => {
            return record.editable ? styles.editable : '';
          }}
        />
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newMember}
          icon="plus"
        >
          新增成员
        </Button>
      </Fragment>
    );
  }
}
