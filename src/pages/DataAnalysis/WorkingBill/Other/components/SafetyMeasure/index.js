import React, { Component, Fragment } from 'react';
import { Button, Table, Input, Popconfirm } from 'antd';
import Link from 'umi/link';
import styles from './index.less';

export default class SafetyMeasure extends Component {
  preventDefault(e) {
    e.preventDefault();
  }

  handleAddButtonClick = () => {
    const { value = [], list = [], onChange } = this.props;
    onChange &&
      onChange(
        [...Array(Math.max(value.length, list.length))].map((_, i) => value[i] || {}).concat({})
      );
  };

  handleDeleteConfirm = index => {
    const { value, onChange } = this.props;
    onChange && onChange(value.filter((_, i) => i !== index));
  };

  handleInputChange = (index, fieldName, e) => {
    const { value = [], list = [], onChange } = this.props;
    onChange &&
      onChange(
        [...Array(Math.max(value.length, list.length))].map(
          (_, i) =>
            i === index
              ? {
                  ...value[i],
                  [fieldName]: e.target.value,
                }
              : value[i] || {}
        )
      );
  };

  renderAddButton() {
    return (
      <Button className={styles.addButton} type="primary" onClick={this.handleAddButtonClick}>
        新增
      </Button>
    );
  }

  render() {
    const { value = [], list = [], mode } = this.props;
    const isNotDetail = mode !== 'detail';
    const columns = [
      {
        dataIndex: 'id',
        title: '序号',
        width: 61,
        align: 'center',
      },
      {
        dataIndex: 'safetyMeasure',
        title: '安全措施',
        align: 'center',
        render: v => <div className={styles.wrapper}>{v}</div>,
      },
      {
        dataIndex: 'confirmer',
        title: '确认人',
        align: 'center',
      },
      ...(isNotDetail
        ? [
            {
              dataIndex: 'operation',
              title: '操作',
              width: 61,
              align: 'center',
            },
          ]
        : []),
    ];
    const dataSource = [...Array(Math.max(value.length, list.length))].map((_, index) => {
      const v = value[index] || {};
      const l = list[index];
      return {
        id: index + 1,
        safetyMeasure: l ? (
          l[0].split('?').map((item, i) => (
            <Fragment key={item}>
              {i !== 0 &&
                (isNotDetail ? (
                  <Input
                    className={styles.numberInput}
                    value={v[l[i]]}
                    onChange={e => this.handleInputChange(index, l[i], e)}
                  />
                ) : (
                  v[l[i]]
                ))}
              {item}
            </Fragment>
          ))
        ) : isNotDetail ? (
          <Input
            value={v.safetyMeasure}
            onChange={e => this.handleInputChange(index, 'safetyMeasure', e)}
          />
        ) : (
          v.safetyMeasure
        ),
        confirmer: isNotDetail ? (
          <Input
            className={styles.confirmerInput}
            value={v.confirmer}
            onChange={e => this.handleInputChange(index, 'confirmer', e)}
          />
        ) : (
          v.confirmer
        ),
        operation:
          isNotDetail &&
          (index >= list.length ? (
            <Popconfirm
              placement="topRight"
              title="您确定要删除吗？"
              onConfirm={() => this.handleDeleteConfirm(index)}
            >
              <Link to="" className={styles.operation} onClick={this.preventDefault}>
                删除
              </Link>
            </Popconfirm>
          ) : (
            <Link to="" className={styles.operation} disabled onClick={this.preventDefault}>
              删除
            </Link>
          )),
      };
    });

    return (
      <div className={styles.container}>
        {isNotDetail && this.renderAddButton()}
        <Table dataSource={dataSource} columns={columns} rowKey="id" bordered pagination={false} />
      </div>
    );
  }
}
