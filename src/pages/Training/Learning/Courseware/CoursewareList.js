import React, { PureComponent } from 'react';
import connect from 'dva';
import { List, Card, Row, Button, Icon, Divider, Popconfirm, Form, Col, Input } from 'antd';
import router from 'umi/router';

const ListItem = List.Item;
const FormItem = Form.Item;

// 筛选栏grid配置
const colWrapper = {
  xl: 8,
  md: 12,
  sm: 24,
  xs: 24,
};

@Form.create()
export default class ArticleList extends PureComponent {
  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div>
        <Row gutter={8}>
          <Form>
            <Col {...colWrapper}>
              <FormItem>
                {getFieldDecorator('title')(<Input placeholder="请输入文章标题" />)}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem>
                {getFieldDecorator('author')(<Input placeholder="请输入文章作者" />)}
              </FormItem>
            </Col>
          </Form>
          <Col {...colWrapper}>
            <FormItem>
              <Button type="primary" onClick={this.handleAddArticle}>
                新增
              </Button>
            </FormItem>
          </Col>
        </Row>
      </div>
    );
  }
}
