import React, { useState, useRef, useMemo, memo } from 'react';
import { Button, Modal, Popconfirm } from 'antd';
import Form from '@/jingan-components/Form';
import { Table, EmptyText, TextAreaEllipsis } from '@/jingan-components/View';
import styles from './index.less';

const LENGTH = 10;
const COLUMNS = [
  {
    dataIndex: 'examContent',
    title: '考核内容',
    render: value => <TextAreaEllipsis value={value} />,
  },
  {
    dataIndex: 'estimateNorm',
    title: '评定标准',
    render: value => <TextAreaEllipsis value={value} />,
  },
  {
    dataIndex: 'examExplain',
    title: '考核说明',
    render: value => <TextAreaEllipsis value={value} />,
  },
  {
    dataIndex: 'note',
    title: '备注',
    render: value => <TextAreaEllipsis value={value} />,
  },
];
const FIELDS = [
  {
    name: 'examContent',
    label: '考核内容',
    component: 'TextArea',
    props: {
      maxLength: 250,
    },
    enableDefaultRules: true,
  },
  {
    name: 'estimateNorm',
    label: '评定标准',
    component: 'TextArea',
    props: {
      maxLength: 250,
    },
    enableDefaultRules: true,
  },
  {
    name: 'examExplain',
    label: '考核说明',
    component: 'TextArea',
    props: {
      maxLength: Infinity,
      allowClear: true,
    },
  },
  {
    name: 'note',
    label: '备注',
    component: 'TextArea',
    props: {
      maxLength: 50,
      allowClear: true,
    },
  },
];
const Content = ({ value, onChange, mode, empty }) => {
  const form = useRef(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modal, setModal] = useState({
    visible: false,
  });
  const { visible } = modal;
  const list = useMemo(
    () => {
      return value
        ? value.map((item, index) => ({
            ...item,
            index,
          }))
        : [];
    },
    [value]
  );
  if (mode !== 'detail') {
    return (
      <div>
        <div className={styles.buttonContainer}>
          <div className={styles.buttonWrapper}>
            <Button
              type="primary"
              onClick={() => {
                setModal({
                  visible: true,
                });
              }}
            >
              新增
            </Button>
          </div>
          <div className={styles.buttonWrapper}>
            <Popconfirm
              title="您确定要删除吗?"
              onConfirm={() => {
                onChange &&
                  onChange(value.filter((item, index) => !selectedRowKeys.includes(index)));
                setSelectedRowKeys([]);
              }}
              disabled={!selectedRowKeys.length}
            >
              <Button type="primary" disabled={!selectedRowKeys.length}>
                删除
              </Button>
            </Popconfirm>
          </div>
        </div>
        <Table
          columns={COLUMNS}
          rowKey="index"
          list={{ list }}
          size="small"
          scroll={
            list.length > LENGTH && {
              y: 39 * LENGTH,
              scrollToFirstRowOnChange: true,
            }
          }
          rowSelection={{
            fixed: true,
            selectedRowKeys,
            onChange(selectedRowKeys) {
              setSelectedRowKeys(selectedRowKeys);
            },
          }}
          showCard={false}
          showPagination={false}
        />
        <Modal
          title="新增考核内容"
          visible={visible}
          onCancel={() => {
            setModal({
              visible: false,
            });
          }}
          onOk={() => {
            form.current.submit();
          }}
          bodyStyle={{ paddingBottom: 0 }}
          zIndex={1009}
          width="60%"
          destroyOnClose
        >
          <Form
            ref={form}
            mode="add"
            fields={FIELDS}
            onSubmit={values => {
              onChange && onChange((value || []).concat(values));
              setModal({
                visible: false,
              });
            }}
            showCard={false}
            showOperation={false}
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 12,
            }}
          />
        </Modal>
      </div>
    );
  } else {
    return list.length ? (
      <Table
        columns={COLUMNS}
        rowKey="index"
        list={{ list }}
        size="small"
        scroll={
          list.length > LENGTH && {
            y: 39 * LENGTH,
            scrollToFirstRowOnChange: true,
          }
        }
        showCard={false}
        showPagination={false}
      />
    ) : empty === undefined ? (
      <EmptyText />
    ) : (
      empty
    );
  }
};

Content.getRules = ({ label }) => {
  return [
    {
      type: 'array',
      min: 1,
      required: true,
      message: `${label || ''}不能为空`,
    },
  ];
};

export default memo(Content, (props, nextProps) => {
  return props.value === nextProps.value && props.mode === nextProps.mode;
});
