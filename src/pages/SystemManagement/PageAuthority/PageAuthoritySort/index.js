import React, { PureComponent } from 'react';
import { Card, Button, Spin, Tree } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import styles from './index.less';

const { TreeNode } = Tree;

// 字段名映射
const fieldMapping = {
  key: 'id',
  children: 'childMenus',
  sort: 'sort',
  title: 'showZname',
};
// 返回地址
const backUrl = '/system-management/page-authority/index';
// 标题
const title = '页面权限排序';
// 面包屑
const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '系统管理', name: '系统管理' },
  { title: '页面权限配置', name: '页面权限配置', href: backUrl },
  { title, name: title },
];
// 排序树（根据sort字段进行升序排序，sort可能重复，也可能不存在）
const sortTree = (data) => {
  const list = [];
  const list2 = [];
  const { sort: _sort, children: _children } = fieldMapping;
  data.forEach((item) => {
    const { [_sort]: sort, [_children]: children } = item;
    const newItem = {
      ...item,
      [_children]: children && sortTree(children),
    };
    // 排除null的情况
    if (sort > 0 || sort === 0) {
      list[sort] = newItem;
    }
    else {
      list2.push(newItem);
    }
  });
  return list.filter(item => item).concat(list2);
}
/**
 * 操作目标节点
 * @param {array} list 源数据
 * @param {string} key 目标节点key值
 * @param {function} callback 找到目标节点以后执行的回调函数
 */
const operateTarget = (list, targetKey, callback) => {
  const { key: _key, children: _children } = fieldMapping;
  for (const [index, item] of list.entries()) {
    const { [_key]: key, [_children]: children } = item;
    if (key === targetKey) {
      return callback(item, index, list) || true;
    }
    if (children) {
      const result = operateTarget(children, targetKey, callback);
      if (result) {
        return result;
      }
    }
  }
}

/**
 * description: 页面权限排序
 */
@connect(({ pageAuth, loading }) => ({
  pageAuth,
  loading: loading.models.pageAuth,
}))
export default class PageAuthoritySort extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // 源数据
      data: [],
    };
  }

  /**
   * 挂载后
   */
  componentDidMount() {
    const { dispatch } = this.props;

    // 获取页面权限树
    dispatch({
      type: 'pageAuth/fetchTree',
      callback: data => {
        console.log(data);
        this.setState({ data: sortTree(data) });
      },
    });
  }

  /**
   * 返回上一个页面
   */
  goBack = () => {
    router.push(backUrl);
  };

  handleDrop = ({
    // 目标节点
    node: {
      props: {
        eventKey: dropKey,
        children,
        expanded,
        pos,
      },
    },
    // 源节点
    dragNode: {
      props: { eventKey: dragKey },
    },
    // 目标位置
    dropPosition,
    // 是否落在节点文本上
    dropToGap,
  }) => {
    const { children: _children } = fieldMapping;
    const data = this.state.data.concat();
    const realDropPosition = dropPosition - pos.split('-').pop();
    // 删除并获取源节点数据
    const dragObj = operateTarget(data, dragKey, (item, index, list) => list.splice(index, 1)[0]);

    if (!dropToGap) {
      operateTarget(data, dropKey, (item) => {
        item[_children] = item[_children] || [];
        item[_children].push(dragObj);
      });
    }
    else if (children && children.length > 0 && expanded && realDropPosition === 1) {
      operateTarget(data, dropKey, (item) => {
        item[_children] = item[_children] || [];
        item[_children].unshift(dragObj);
      });
    }
    else {
      operateTarget(data, dropKey, (item, index, list) => {
        if (realDropPosition === -1) {
          list.splice(index, 0, dragObj);
        }
        else {
          list.splice(index + 1, 0, dragObj);
        }
      });
    }
    this.setState({ data });
  }

  /**
   * 提交事件
   */
  handleSubmit = () => {
    this.goBack();
  }

  /**
   * 渲染树节点
   */
  renderTreeNodes(data) {
    const { key: _key, title: _title, children: _children } = fieldMapping;
    return data.map(item => {
      const { [_key]: key, [_title]: title, [_children]: children } = item;
      if (children) {
        return (
          <TreeNode title={title} key={key} dataRef={item} selectable={false}>
            {this.renderTreeNodes(children)}
          </TreeNode>
        );
      }
      return <TreeNode title={title} key={key} dataRef={item} selectable={false} />;
    });
  }

  /**
   * 渲染
   */
  render() {
    const {
      // pageAuth: {
      //   tree,
      // },
      loading,
    } = this.props;
    const { data } = this.state;

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        <Card>
          <Spin spinning={loading}>
            <Tree
              className={styles.tree}
              draggable
              onDrop={this.handleDrop}
            >
              {this.renderTreeNodes(data)}
            </Tree>
            <div style={{ textAlign: 'center', padding: 24 }}>
              <Button onClick={this.goBack} style={{ marginRight: 24 }}>返回</Button>
              <Button type="primary" onClick={this.handleSubmit}>确定</Button>
            </div>
          </Spin>
        </Card>
      </PageHeaderLayout>
    );
  }
}
