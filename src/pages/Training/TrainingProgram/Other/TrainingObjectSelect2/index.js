import React, { Component, Fragment } from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Input, Tree } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
const { Search } = Input;
const { TreeNode } = Tree;

const GET_TRAINING_OBJECT_LIST = 'trainingProgram/getTrainingObjectList';

// 选择培训对象
@connect(({
  trainingProgram,
  loading,
}) => ({
  trainingProgram,
  loading: loading.effects[GET_TRAINING_OBJECT_LIST],
}), (dispatch) => ({
  getTrainingObjectList(payload, callback) { // 获取培训对象列表
    dispatch({
      type: GET_TRAINING_OBJECT_LIST,
      payload,
      callback,
    });
  },
  setTrainingObjectList(payload, callback) {
    dispatch({
      type: 'save',
      payload: {
        trainingObjectList: [],
        ...payload,
      },
      callback,
    });
  },
}))
export default class TrainingObjectSelect2 extends Component {
  state = {
    inputValue: undefined,
  }

  componentDidMount() {
    const { companyId } = this.props;
    if (companyId) {
      this.getTrainingObjectList();
    }
  }

  componentDidUpdate({ companyId: prevCompanyId }) {
    const { companyId, onChange, setTrainingObjectList } = this.props;
    if (prevCompanyId !== companyId) {
      if (companyId) {
        this.getTrainingObjectList();
      } else {
        setTrainingObjectList();
      }
      if (prevCompanyId){
        onChange && onChange([]);
      }
      this.setState({
        inputValue: undefined,
      });
    }
  }

  getTrainingObjectList = () => {
    const { companyId, companyName, getTrainingObjectList } = this.props;
    getTrainingObjectList({
      pageNum: 1,
      pageSize: 0,
      companyId,
      companyName,
    });
  }

  filterTrainingObjectList = (list, value) => {
    let result = [];
    if (list) {
      list.forEach((item) => {
        if (item.name.includes(value)) {
          result.push(item);
        } else if (item.children){
          const children = this.filterTrainingObjectList(item.children, value);
          if (children.length > 0) {
            result.push({
              ...item,
              children,
            });
          }
        }
      });
    }
    return result;
  }

  filterTrainingObjectList2 = (list, value) => {
    let result = [];
    if (list) {
      list.forEach((item) => {
        if (item.studentId && (value || []).includes(item.studentId)) {
          result.push(item);
        } else if (item.children) {
          const children = this.filterTrainingObjectList2(item.children, value);
          if (children.length > 0) {
            result.push({
              ...item,
              children,
              count: children.reduce((total, { studentId, count }) => studentId ? total + 1 : total + count, 0),
            });
          }
        }
      });
    }
    return result;
  }

  handleCheck = (checkedKeys) => {
    const {
      trainingProgram: {
        departmentIds=[],
      },
    } = this.props;
    const { onChange } = this.props;
    onChange && onChange(checkedKeys.filter(key => !departmentIds.includes(key)));
  }

  handleInputChange = ({ target: { value: inputValue } }) => {
    this.setState({
      inputValue,
    });
  }

  renderTreeNodes = (list) => {
    return list && list.map(item => {
      if (!item.studentId) {
        return item.allUserCount > 0 && (
          <TreeNode key={item.id} title={`${item.name} (${item.allUserCount})`} icon={<LegacyIcon type="flag" />} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.studentId} title={item.name} icon={<LegacyIcon type="user" />} dataRef={item} />;
    }).filter(v => v);
  }

  renderTreeNodes2 = (list) => {
    return list && list.map(item => {
      if (!item.studentId) {
        return item.allUserCount > 0 && (
          <TreeNode key={item.id} title={`${item.name} (${item.count}/${item.allUserCount})`} icon={<LegacyIcon type="flag" />} dataRef={item}>
            {this.renderTreeNodes2(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.studentId} title={item.name} icon={<LegacyIcon type="user" />} dataRef={item} />;
    }).filter(v => v);
  }

  render() {
    const {
      className,
      companyId,
      value,
      disabled,
      trainingProgram: {
        trainingObjectList=[],
      },
    } = this.props;
    const { inputValue='' } = this.state;

    return (
      <div className={className}>
        {companyId ? (
          <Fragment>
            {!disabled && (
              <Search
                className={styles.input}
                placeholder="请输入要搜索的部门或人员"
                value={inputValue}
                onChange={this.handleInputChange}
              />
            )}
            <Tree
              checkedKeys={value}
              onCheck={this.handleCheck}
              checkable={!disabled}
              showIcon
              selectable={false}
            >
              {!disabled ? (
                this.renderTreeNodes(this.filterTrainingObjectList(trainingObjectList, inputValue))
              ) : (
                this.renderTreeNodes2(this.filterTrainingObjectList2(trainingObjectList, value))
              )}
            </Tree>
          </Fragment>
          ) : '请先选择单位名称'
        }
      </div>
    );
  }
}
