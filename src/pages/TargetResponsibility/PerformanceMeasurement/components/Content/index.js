import React, { Fragment, useState, useRef } from 'react';
import { Button, Modal, Divider, Popconfirm } from 'antd';
import Form from '@/jingan-components/Form';
import { Table, Link } from '@/jingan-components/View';
import styles from './index.less';

const Content = ({ value, onChange, mode }) => {
  const [modal, setModal] = useState({
    visible: false,
    initialValues: undefined,
    index: undefined,
    mode: 'add',
  });
  const form = useRef(null);
  const columns = [
    {
      dataIndex: 'content',
      title: '考核内容',
    },
    {
      dataIndex: 'standard',
      title: '评定标准',
    },
    {
      dataIndex: 'instructions',
      title: '考核说明',
    },
    {
      dataIndex: 'remark',
      title: '备注',
    },
    ...(mode !== 'detail'
      ? [
          {
            dataIndex: '操作',
            title: '操作',
            fixed: 'right',
            width: 105,
            render: (_, data, index) => (
              <Fragment>
                <Link
                  to="/"
                  onClick={() => {
                    setModal(modal => ({
                      ...modal,
                      visible: true,
                      initialValues: {
                        ...data,
                      },
                      index,
                      mode: 'edit',
                    }));
                  }}
                >
                  编辑
                </Link>
                <Divider type="vertical" />
                <Popconfirm
                  title="您确定要删除吗?"
                  onConfirm={() => {
                    onChange && onChange(value.filter((_, i) => i !== index));
                  }}
                >
                  <Link to="/">删除</Link>
                </Popconfirm>
              </Fragment>
            ),
          },
        ]
      : []),
  ];
  const fields = [
    {
      fields: [
        {
          name: 'content',
          label: '考核内容',
          component: 'TextArea',
          enableDefaultRules: true,
        },
        {
          name: 'standard',
          label: '评定标准',
          component: 'TextArea',
          enableDefaultRules: true,
        },
        {
          name: 'instructions',
          label: '考核说明',
          component: 'TextArea',
        },
        {
          name: 'remark',
          label: '备注',
          component: 'TextArea',
        },
      ],
      bordered: false,
    },
  ];
  return (
    <div>
      {mode !== 'detail' && (
        <div className={styles.buttonWrapper}>
          <Button
            type="primary"
            onClick={() =>
              setModal(modal => ({
                ...modal,
                visible: true,
                initialValues: {},
                mode: 'add',
              }))
            }
          >
            新增
          </Button>
        </div>
      )}
      <Table
        showCard={false}
        showAddButton={false}
        list={{ list: value && value.map((item, index) => ({ id: index, ...item })) }}
        columns={columns}
        showPagination={false}
        bordered
      />
      <Modal
        title={modal.mode === 'edit' ? '编辑考核内容' : '新增考核内容'}
        visible={modal.visible}
        onCancel={() => {
          setModal(modal => ({
            ...modal,
            visible: false,
          }));
        }}
        onOk={() => {
          setModal(modal => ({
            ...modal,
            visible: false,
          }));
          const values = form.current.getFieldsValue();
          onChange &&
            onChange(
              modal.mode === 'edit'
                ? value.map((item, index) => (index === modal.index ? values : item))
                : (value || []).concat(values)
            );
        }}
        zIndex={1009}
        width="60%"
        bodyStyle={{ padding: 0 }}
      >
        <Form
          ref={form}
          initialValues={modal.initialValues}
          mode={modal.mode}
          fields={fields}
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
};

export default Content;
