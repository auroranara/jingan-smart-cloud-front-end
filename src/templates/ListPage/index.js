import React, { Component } from 'react';
import { Card, message, Button, Popconfirm } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import CustomForm from '@/jingan-components/CustomForm';
import InfiniteList from '@/jingan-components/InfiniteList';
import Link from 'umi/link';
import { connect } from 'dva';
import router from 'umi/router';
import { kebabCase } from 'lodash';
import locales from '@/locales/zh-CN';
import styles from './index.less';

const PAYLOAD = {
  pageNum: 1,
  pageSize: 30,
};
const preventDefault = e => e.preventDefault();
const GET_METHOD_NAME = (targetName, result, after = 2) => {
  return result[targetName]
    ? GET_METHOD_NAME(`${targetName.replace(/\d*$/, '')}${after}`, result, after + 1)
    : targetName;
};

@connect(
  (
    state,
    {
      route: { name, code },
      location: { pathname },
      match: {
        params: { unitId: unitId1 },
      },
      otherOperation,
      mapper,
      breadcrumbList: b,
    }
  ) => {
    const { namespace: n, list: l, getList: gl } = mapper || {};
    let breadcrumbList;
    const namespace = n || code.replace(/.*\.(.*)\..*/, '$1');
    const {
      user: {
        currentUser: { unitType, unitId: unitId2, permissionCodes },
      },
      [namespace]: { [l || 'list']: list },
      loading: {
        effects: { [`${namespace}/${gl || 'getList'}`]: loading },
      },
    } = state;
    const isUnit = +unitType === 4;
    const unitId = isUnit ? unitId2 : unitId1;
    if (b) {
      breadcrumbList =
        typeof b === 'function' ? b({ isUnit, unitId, title: locales[`menu.${code}`] }) : b;
    } else {
      breadcrumbList = code
        .split('.')
        .slice(0, -1)
        .reduce(
          (result, item) => {
            const key = `${result.key}.${item}`;
            const title = locales[key];
            result.key = key;
            result.breadcrumbList.push({
              title,
              name: title,
            });
            return result;
          },
          {
            breadcrumbList: [{ title: '首页', name: '首页', href: '/' }],
            key: 'menu',
          }
        ).breadcrumbList;
    }
    return {
      unitId,
      list,
      loading,
      breadcrumbList,
      hasAddAuthority: permissionCodes.includes(code.replace(name, 'add')),
      hasEditAuthority: permissionCodes.includes(code.replace(name, 'edit')),
      hasDetailAuthority: permissionCodes.includes(code.replace(name, 'detail')),
      hasDeleteAuthority: permissionCodes.includes(code.replace(name, 'delete')),
      hasExportAuthority: permissionCodes.includes(code.replace(name, 'export')),
      editUrl: pathname.replace(new RegExp(`${name}.*`), 'edit'),
      detailUrl: pathname.replace(new RegExp(`${name}.*`), 'detail'),
      ...(otherOperation &&
        otherOperation.reduce((result, { code: codeName }) => {
          return {
            ...result,
            [`has${codeName[0].toUpperCase()}${codeName.slice(
              1
            )}Authority`]: permissionCodes.includes(code.replace(name, codeName)),
            [`${codeName}Url`]: pathname.replace(new RegExp(`${name}.*`), kebabCase(codeName)),
          };
        }, {})),
    };
  },
  (dispatch, { route: { name, code }, location: { pathname }, error = true, mapper }) => {
    const { namespace: n, getList: gl, remove: r, exportList: el, reloadList: rl } = mapper || {};
    const namespace = n || code.replace(/.*\.(.*)\..*/, '$1');
    return {
      getList(payload, callback) {
        dispatch({
          type: `${namespace}/${gl || 'getList'}`,
          payload,
          callback: (success, data) => {
            if (!success && error) {
              message.error('获取列表数据失败，请稍后重试或联系管理人员！');
            }
            callback && callback(success, data);
          },
        });
      },
      remove(payload, callback) {
        dispatch({
          type: `${namespace}/${r || 'remove'}`,
          payload,
          callback: (success, data) => {
            if (success) {
              message.success('删除成功');
            } else if (error) {
              message.error('删除失败，请稍后重试或联系管理人员！');
            }
            callback && callback(success, data);
          },
        });
      },
      exportList(payload, callback) {
        dispatch({
          type: `${namespace}/${el || 'exportList'}`,
          payload,
          callback: (success, data) => {
            if (!success && error) {
              message.error('导出失败，请稍后重试或联系管理人员！');
            }
            callback && callback(success, data);
          },
        });
      },
      reloadList(payload, callback) {
        dispatch({
          type: `${namespace}/${rl || 'reloadList'}`,
          payload,
          callback: (success, data) => {
            if (!success && error) {
              message.error('重新获取列表数据失败，请稍后重试或联系管理人员！');
            }
            callback && callback(success, data);
          },
        });
      },
      goToAdd() {
        router.push(pathname.replace(new RegExp(`${name}.*`), 'add'));
      },
    };
  },
  null,
  {
    withRef: true,
  }
)
export default class ListPage extends Component {
  state = {
    reloading: false,
  };

  prevValues = null;

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.list !== this.props.list ||
      nextProps.loading !== this.props.loading ||
      nextProps.children !== this.props.children ||
      nextState !== this.state
    );
  }

  // 设置form的引用
  setFormReference = form => {
    this.form = form;
  };

  getList = (pageNum, callback) => {
    const { getList, transform, withUnitId, unitId } = this.props;
    const payload = withUnitId ? { unitId, ...this.prevValues } : this.prevValues;
    getList(
      {
        ...(transform && (this.prevValues || withUnitId) ? transform(payload) : payload),
        ...PAYLOAD,
        pageNum,
      },
      callback
    );
    this.form &&
      (this.prevValues ? this.form.setFieldsValue(this.prevValues) : this.form.resetFields());
  };

  // 查询按钮点击事件
  handleSearchButtonClick = values => {
    const { getList, transform, withUnitId, unitId } = this.props;
    const payload = withUnitId ? { unitId, ...values } : values;
    this.prevValues = values;
    this.setState({
      reloading: true,
    });
    getList(
      {
        ...(transform ? transform(payload) : payload),
        ...PAYLOAD,
      },
      () => {
        this.setState({
          reloading: false,
        });
      }
    );
  };

  // 重置按钮点击事件
  handleResetButtonClick = values => {
    this.handleSearchButtonClick(values);
  };

  // 导出按钮点击事件
  handleExportButtonClick = () => {
    const { exportList, transform, withUnitId, unitId } = this.props;
    const payload = withUnitId ? { unitId, ...this.prevValues } : this.prevValues;
    this.setState({
      reloading: true,
    });
    exportList(
      {
        ...(transform && (this.prevValues || withUnitId) ? transform(payload) : payload),
      },
      () => {
        this.setState({
          reloading: false,
        });
      }
    );
    this.form &&
      (this.prevValues ? this.form.setFieldsValue(this.prevValues) : this.form.resetFields());
  };

  // 删除按钮点击事件
  handleDeleteButtonClick = id => {
    const { remove } = this.props;
    this.setState({
      reloading: true,
    });
    remove({ id }, success => {
      if (success) {
        const {
          list: {
            pagination: { pageNum },
          },
          reloadList,
          transform,
          withUnitId,
          unitId,
        } = this.props;
        const payload = withUnitId ? { unitId, ...this.prevValues } : this.prevValues;
        reloadList(
          {
            ...(transform && (this.prevValues || withUnitId) ? transform(payload) : payload),
            ...PAYLOAD,
            pageNum,
          },
          () => {
            this.setState({
              reloading: false,
            });
          }
        );
      } else {
        this.setState({
          reloading: false,
        });
      }
    });
    this.form &&
      (this.prevValues ? this.form.setFieldsValue(this.prevValues) : this.form.resetFields());
  };

  renderAddButton = ({ name = '新增', onClick } = {}) => {
    const { hasAddAuthority, goToAdd } = this.props;
    return (
      <Button
        type="primary"
        onClick={onClick ? e => onClick(goToAdd, e) : goToAdd}
        disabled={!hasAddAuthority}
      >
        {typeof name === 'function' ? name() : name}
      </Button>
    );
  };

  renderExportButton = ({ name = '导出', onClick } = {}) => {
    const { hasExportAuthority, list: { list } = {} } = this.props;
    return (
      <Button
        type="primary"
        onClick={
          onClick ? e => onClick(this.handleExportButtonClick, e) : this.handleExportButtonClick
        }
        disabled={!hasExportAuthority || !list || !list.length}
      >
        {typeof name === 'function' ? name() : name}
      </Button>
    );
  };

  renderForm() {
    const { fields, action, unitId } = this.props;
    const Fields = typeof fields === 'function' ? fields({ unitId }) : fields;
    const Action =
      typeof action === 'function'
        ? action({
            renderAddButton: this.renderAddButton,
            renderExportButton: this.renderExportButton,
          })
        : action;

    return (
      Fields &&
      Fields.length > 0 && (
        <Card className={styles.card}>
          <CustomForm
            fields={Fields}
            action={Action}
            onSearch={this.handleSearchButtonClick}
            onReset={this.handleResetButtonClick}
            ref={this.setFormReference}
          />
        </Card>
      )
    );
  }

  renderDetailButton = data => {
    const { hasDetailAuthority, detailUrl } = this.props;
    const id = (data && data.id) || data;
    return (
      <Link
        to={`${detailUrl}/${id}`}
        disabled={!hasDetailAuthority}
        target="_blank"
        onClick={hasDetailAuthority ? undefined : preventDefault}
      >
        查看
      </Link>
    );
  };

  renderEditButton = data => {
    const { hasEditAuthority, editUrl } = this.props;
    const id = (data && data.id) || data;
    return (
      <Link
        to={`${editUrl}/${id}`}
        disabled={!hasEditAuthority}
        target="_blank"
        onClick={hasEditAuthority ? undefined : preventDefault}
      >
        编辑
      </Link>
    );
  };

  renderDeleteButton = data => {
    const { hasDeleteAuthority } = this.props;
    const id = (data && data.id) || data;
    return hasDeleteAuthority ? (
      <Popconfirm title="您确定要删除吗？" onConfirm={() => this.handleDeleteButtonClick(id)}>
        <Link to="/" onClick={preventDefault}>
          删除
        </Link>
      </Popconfirm>
    ) : (
      <Link to="/" disabled onClick={preventDefault}>
        删除
      </Link>
    );
  };

  renderList() {
    const { list, loading, unitId, renderItem, otherOperation } = this.props;
    const { reloading } = this.state;
    const payload = {
      list,
      unitId,
      ...(otherOperation || []).reduce(
        (result, { code, name, onClick, disabled }) => {
          const upperCode = `${code[0].toUpperCase()}${code.slice(1)}`;
          const hasAuthority = this.props[`has${upperCode}Authority`];
          const methodName = GET_METHOD_NAME(`render${upperCode}Button`, result);
          return {
            ...result,
            [methodName]: data => {
              const enabled =
                hasAuthority && !(typeof disabled === 'function' ? disabled(data) : disabled);
              const id = (data && data.id) || data;
              return (
                <Link
                  to={onClick ? '/' : `${code}Url/${id}`}
                  disabled={!enabled}
                  target="_blank"
                  onClick={enabled ? onClick || undefined : preventDefault}
                >
                  {typeof name === 'function' ? name(id) : name}
                </Link>
              );
            },
          };
        },
        {
          renderDetailButton: this.renderDetailButton,
          renderEditButton: this.renderEditButton,
          renderDeleteButton: this.renderDeleteButton,
        }
      ),
    };

    return (
      <InfiniteList
        list={list}
        loading={loading}
        renderItem={item => renderItem && renderItem(item, payload)}
        getList={this.getList}
        reloading={reloading}
      />
    );
  }

  render() {
    const { breadcrumbList, content, children, list } = this.props;

    return (
      <PageHeaderLayout
        title={breadcrumbList[breadcrumbList.length - 1].title}
        breadcrumbList={breadcrumbList}
        content={typeof content === 'function' ? content({ list }) : content}
      >
        {this.renderForm()}
        {this.renderList()}
        {children}
      </PageHeaderLayout>
    );
  }
}
