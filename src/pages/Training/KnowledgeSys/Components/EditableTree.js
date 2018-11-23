import React, { PureComponent } from 'react';
import { Row, Col, Spin, Tree, Icon, Button, Form, Input, Popconfirm, message } from 'antd';
import styles from './EditableTree.less';
import { AuthA } from '@/utils/customAuth';
import buttonCodes from '@/utils/codes';

const { TreeNode } = Tree;
const FormItem = Form.Item;
@Form.create()
class EditableTree extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: [],
      overId: '',
      action: {},
      treeList: [],
      addRoot: false,
    };
  }

  componentDidMount() {
    const { treeData } = this.props;
    this.props.onRef(this);
    this.setState({ treeList: treeData });
  }

  componentWillUnmount() {}

  getSnapshotBeforeUpdate(prevProps, prevState) {
    return JSON.stringify(this.props.treeData) !== JSON.stringify(prevProps.treeData);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { treeData } = this.props;
    if (snapshot) {
      this.setState({ treeList: treeData });
    }
  }

  handleExpand = (expandedKeys, expanded) => {
    this.setState({ expandedKeys });
  };

  handleAdd = item => {
    const {
      treeList,
      expandedKeys,
      addRoot,
      action: { type },
    } = this.state;

    if (item)
      this.setState({ action: { type: 'add', item }, expandedKeys: [...expandedKeys, item.id] });
    else {
      // 在根节点下添加
      if (addRoot || type) return;

      this.setState({
        treeList: [{ edit: true, name: '', id: 'RANDOMID' }, ...treeList],
        addRoot: true,
        action: { type: 'add' },
      });
    }
  };

  handleEdit = item => {
    this.setState({ action: { type: 'edit', item } });
  };

  handleDelete = id => {
    const { handleDelete } = this.props;
    handleDelete(id);
  };

  renderNodeTitle = (title, item) => {
    const { overId, action } = this.state;
    const { id, edit } = item;
    if (edit) {
      return this.renderInputBar(item);
    }
    return (
      <span
        className={styles.nodeTitle}
        onMouseOver={() => {
          if (overId !== id) this.setState({ overId: id });
        }}
        onMouseLeave={() => {
          this.setState({ overId: '' });
        }}
      >
        {title}
        {!action.type ? (
          <span style={{ opacity: overId === id ? 1 : 0 }}>
            <AuthA
              code={buttonCodes.training.points.add}
              className={styles.nodeBtn}
              onClick={() => this.handleAdd(item)}
            >
              <Icon type="plus" theme="outlined" />
            </AuthA>
            <AuthA
              code={buttonCodes.training.points.edit}
              className={styles.nodeBtn}
              onClick={() => this.handleEdit(item)}
            >
              <Icon type="edit" theme="outlined" />
            </AuthA>
            {/* <a className={styles.nodeBtn} onClick={() => this.handleAdd(item)}>
              <Icon type="plus" theme="outlined" />
            </a>
            <a className={styles.nodeBtn} onClick={() => this.handleEdit(item)}>
              <Icon type="edit" theme="outlined" />
            </a> */}
            <Popconfirm
              title="本操作将删除此节点及其下所有子节点"
              placement="top"
              okText="确定"
              cancelText="取消"
              onConfirm={() => {
                this.handleDelete(item.id);
              }}
            >
              <AuthA code={buttonCodes.training.points.delete} className={styles.nodeBtn}>
                <Icon type="delete" theme="outlined" />
              </AuthA>
              {/* <a className={styles.nodeBtn}>
                <Icon type="delete" theme="outlined" />
              </a> */}
            </Popconfirm>
          </span>
        ) : null}
      </span>
    );
  };

  handleAddEdit = () => {
    const {
      action: { type, item },
      treeList,
      addRoot,
    } = this.state;
    const {
      form: { getFieldsValue },
      handleAdd,
      handleEidt,
    } = this.props;
    const data = getFieldsValue();
    if (!data.name.trim()) {
      message.error('输入的字段不能为空或都是空格');
      return;
    }
    if (data.name.trim().length > 50) {
      message.error('输入的字符长度不能超过50');
      return;
    }
    if (type === 'edit') {
      if (item.name !== data.name) handleEidt({ ...item, name: data.name });
    }
    if (type === 'add') {
      if (addRoot) {
        const sort = treeList.length > 0 ? treeList[treeList.length - 1].sort : -1;
        handleAdd({ ...data, sort: sort + 1 });
      } else {
        const { children } = item;
        const sort = children.length > 0 ? children[children.length - 1].sort : -1;
        handleAdd({
          ...data,
          sort: sort + 1,
          parentId: item.id,
        });
      }
    }
    this.handleCancel();
  };

  handleCancel = () => {
    const { treeList, addRoot } = this.state;
    if (!addRoot) this.setState({ action: {} });
    else {
      treeList.shift();
      this.setState({ treeList, addRoot: false, action: {} });
    }
  };

  renderInputBar = item => {
    const { name } = item;
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <span className={styles.nodeInputWrapper}>
        <Form
          layout="vertical"
          className="clearfix"
          style={{ width: '450px', display: 'inline-block' }}
        >
          <Row gutter={20}>
            <Col span={18}>
              <FormItem>{getFieldDecorator('name', { initialValue: name })(<Input />)}</FormItem>
            </Col>
            <Col span={6} style={{ height: '24px' }}>
              <Button
                type="primary"
                size={'small'}
                onClick={() => {
                  this.handleAddEdit();
                }}
              >
                确定
              </Button>
              <Button
                size={'small'}
                onClick={() => {
                  this.handleCancel();
                }}
              >
                取消
              </Button>
            </Col>
          </Row>
        </Form>
      </span>
    );
  };

  renderTreeNodes = (data, searchValue) => {
    const { action } = this.state;
    return data.map(item => {
      // 编辑
      if (action.type === 'edit' && action.item && action.item.id === item.id) {
        item = { ...item, edit: true };
      }
      // 在某节点下添加
      if (action.type === 'add' && action.item && action.item.id === item.id) {
        const addItem = { edit: true, name: '', id: 'RANDOMID' };
        item = item.children
          ? { ...item, children: [addItem, ...item.children] }
          : { ...item, children: [addItem] };
      }
      const index = item.name.indexOf(searchValue);
      const beforeStr = item.name.slice(0, index);
      const afterStr = item.name.slice(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: '#f50' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.name}</span>
        );

      if (item.children && item.children.length > 0) {
        return (
          <TreeNode
            icon={<Icon type="folder" />}
            title={this.renderNodeTitle(title, item)}
            key={item.id}
            dataRef={item}
            isLeaf={item.isLeaf}
          >
            {this.renderTreeNodes(item.children, searchValue)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          icon={<Icon type="folder" />}
          title={this.renderNodeTitle(title, item)}
          key={item.id}
          dataRef={item}
          isLeaf={item.isLeaf}
        />
      );
    });
  };

  handleDrag = info => {
    const { handleDrag } = this.props;
    const { treeList } = this.state;
    const dropKey = info.node.props.eventKey;
    const dropNode = info.node.props.dataRef;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    const isExpanded = info.node.props.expanded;
    const childrens = (info.node.props.children || []).length > 0;
    let dragInfo = {};
    switch (dropPosition) {
      case 0:
        dragInfo = {
          knowledgeId: dragKey,
          parentId: dropNode.id,
          parentIds: [dropNode.parentId, dropNode.id].join('@'),
        };
        break;
      case -1:
        const loop = (data, key, callback) => {
          if (key === '0') return callback({ children: data });
          data.forEach(item => {
            if (item.id === key) {
              return callback(item);
            }
            if (item.children) {
              return loop(item.children, key, callback);
            }
          });
        };
        let parent;
        loop(treeList, dropNode.parentId, item => {
          parent = item;
        });
        const sortId = info.dropPosition >= 0 ? parent.children[info.dropPosition].id : undefined;
        dragInfo = {
          knowledgeId: dragKey,
          sortId: sortId,
          parentId: dropNode.parentId,
          parentIds: dropNode.parentIds,
        };
        break;
      case 1:
        if (childrens && isExpanded) {
          dragInfo = {
            knowledgeId: dragKey,
            parentId: dropNode.id,
            parentIds: [dropNode.parentId, dropNode.id].join('@'),
          };
        } else {
          dragInfo = {
            knowledgeId: dragKey,
            sortId: dropKey,
            parentId: dropNode.parentId,
            parentIds: dropNode.parentIds,
          };
        }
        break;
      default:
        dragInfo = {
          knowledgeId: dragKey,
          sortId: dropKey,
          parentId: dropNode.parentId,
          parentIds: dropNode.parentIds,
        };
        break;
    }
    handleDrag(dragInfo);
  };

  render() {
    const {
      treeList,
      expandedKeys,
      action: { type },
    } = this.state;
    const { loading = false, companyId } = this.props;
    return (
      <div className={styles.treeMain}>
        <Spin spinning={loading}>
          {treeList.length ? (
            <Tree
              showLine
              showIcon
              draggable={!type}
              expandedKeys={expandedKeys}
              onExpand={this.handleExpand}
              onDrop={this.handleDrag}
            >
              {this.renderTreeNodes(treeList, '')}
            </Tree>
          ) : (
            <div style={{ textAlign: 'center' }}>{companyId ? '暂无数据' : '请先选择单位'}</div>
          )}
        </Spin>
      </div>
    );
  }
}

export default EditableTree;
