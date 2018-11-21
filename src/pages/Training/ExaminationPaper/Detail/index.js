import React, { PureComponent } from 'react';
import { Spin, Card, Button, Tree, Form, Row, Col } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import urls from '@/utils/urls';
import titles from '@/utils/titles';
import codes from '@/utils/codes';
import { hasAuthority } from '@/utils/customAuth';

import styles from './index.less';
const { Item: FormItem } = Form;
const { TreeNode } = Tree;

const { home: homeUrl, examinationPaper: { list: listUrl, edit: editUrl } } = urls;
const { home: homeTitle, examinationPaper: { list: listTitle, menu: menuTitle, detail: title } } = titles;
const backUrl = `${listUrl}?back`;

/* 面包屑 */
const breadcrumbList = [
  { title: homeTitle, name: homeTitle, href: homeUrl },
  { title: menuTitle, name: menuTitle },
  { title: listTitle, name: listTitle, href: backUrl },
  { title, name: title },
];
// 获取code
const { training: { examinationPaper: { edit: editCode, list: listCode } } } = codes;

@connect(({ examinationPaper, user, loading }) => ({
  examinationPaper,
  user,
  loading: loading.models.examinationPaper,
}))
export default class App extends PureComponent {
  componentDidMount() {
    const { dispatch, match: { params: { id } } } = this.props;

    // 获取详情
    dispatch({
      type: 'examinationPaper/fetchDetail',
      payload: { id },
      callback: ({ companyId }) => {
        this.getRuleTree(dispatch, id, companyId || undefined);
      },
    });
  }

  /**
   * 返回列表页面
   */
  goToList = () => {
    router.push(backUrl);
  }

  /**
   * 前往编辑页面
   */
  goToEdit = () => {
    const { match: { params: { id } } } = this.props;
    router.push(`${editUrl}${id}`);
  }

  /**
   * 获取规则树
   */
  getRuleTree(dispatch, paperId, companyId) {
    [1,2,3].forEach(questionType => {
      dispatch({
        type: 'examinationPaper/fetchRuleTree',
        payload: { paperId, questionType, companyId },
      });
    });
  }

  /**
   * 获取题目总数
   */
  getTotal(values) {
    let total = 0;
    for (const { selQuestionNum } of values) {
      total += selQuestionNum || 0;
    }
    return total;
  }

  /**
   * 渲染树
   */
  renderTree = (data) => {
    return data.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <TreeNode title={<span>{`${item.name} (${item.questionsNum})`}<span className={styles.treeNodeExtra}>{item.selQuestionNum}</span></span>} key={item.id} dataRef={item} selectable={false}>
            {this.renderTree(item.children)}
          </TreeNode>
        );
      }
      // 当没有children时，才可以选择数量，并且当可选择数量为0，或values为undefined即该类型没有选中时无法选择数量
      return <TreeNode title={<span>{`${item.name} (${item.questionsNum})`}<span className={styles.treeNodeExtra}>{item.selQuestionNum}</span></span>} key={item.id} dataRef={item} selectable={false} />;
    });
  }

  render() {
    const { loading, user: { currentUser: { permissionCodes } }, examinationPaper: { singleTree, multipleTree, judgeTree, detail: { name, ruleTypeName, status } } } = this.props;
    const hasListAuthority = hasAuthority(listCode, permissionCodes);
    const hasEditAuthority = hasAuthority(editCode, permissionCodes);

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        <Spin spinning={!!loading}>
          <Card bordered={false}>
            <Form>
              <FormItem label="试卷名称" className={styles.formItem} required>{name}</FormItem>
              <FormItem
                label="抽题规则"
                className={styles.formItem}
                required
              >
                <div style={{ marginBottom: 12 }}>{ruleTypeName}</div>
                <Row gutter={24} style={{ display: 'flex', flexWrap: 'wrap' }}>
                  <Col md={8} sm={24} style={{ paddingBottom: 24, display: 'flex' }}>
                    <div style={{ border: '1px solid #d9d9d9', flex: '1', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ padding: '0 8px', flex: 'none' }}>
                        <span>单选题</span>
                        <span style={{ float: 'right' }}>题目总数：{this.getTotal(singleTree)}</span>
                      </div>
                      <div style={{ display: 'flex', flex: '1', position: 'relative', transform: 'translate(0, 0)' }}>
                        <div style={{ flex: '1', borderRight: '1px solid #d9d9d9' }}>
                          <div style={{ textAlign: 'center', backgroundColor: '#F2F2F2' }}>知识点分类</div>
                          <div>
                            <Tree showLine>{this.renderTree(singleTree)}</Tree>
                          </div>
                        </div>
                        <div style={{ flex: 'none', textAlign: 'center' }}>
                          <div style={{ backgroundColor: '#F2F2F2', width: 56 }}>抽题</div>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col md={8} sm={24} style={{ paddingBottom: 24, display: 'flex' }}>
                    <div style={{ border: '1px solid #d9d9d9', flex: '1', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ padding: '0 8px', flex: 'none' }}>
                        <span>多选题</span>
                        <span style={{ float: 'right' }}>题目总数：{this.getTotal(multipleTree)}</span>
                      </div>
                      <div style={{ display: 'flex', flex: '1', position: 'relative', transform: 'translate(0, 0)' }}>
                        <div style={{ flex: '1', borderRight: '1px solid #d9d9d9' }}>
                          <div style={{ textAlign: 'center', backgroundColor: '#F2F2F2' }}>知识点分类</div>
                          <div>
                            <Tree showLine>{this.renderTree(multipleTree)}</Tree>
                          </div>
                        </div>
                        <div style={{ flex: 'none', textAlign: 'center' }}>
                          <div style={{ backgroundColor: '#F2F2F2', width: 56 }}>抽题</div>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col md={8} sm={24} style={{ paddingBottom: 24, display: 'flex' }}>
                    <div style={{ border: '1px solid #d9d9d9', flex: '1', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ padding: '0 8px', flex: 'none' }}>
                        <span>判断题</span>
                        <span style={{ float: 'right' }}>题目总数：{this.getTotal(judgeTree)}</span>
                      </div>
                      <div style={{ display: 'flex', flex: '1', position: 'relative', transform: 'translate(0, 0)' }}>
                        <div style={{ flex: '1', borderRight: '1px solid #d9d9d9' }}>
                          <div style={{ textAlign: 'center', backgroundColor: '#F2F2F2' }}>知识点分类</div>
                          <div>
                            <Tree showLine>{this.renderTree(judgeTree)}</Tree>
                          </div>
                        </div>
                        <div style={{ flex: 'none', textAlign: 'center' }}>
                          <div style={{ backgroundColor: '#F2F2F2', width: 56 }}>抽题</div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </FormItem>
            </Form>
            <div style={{ textAlign: 'center' }}>
              <Button onClick={this.goToList} style={{ marginRight: '24px' }} disabled={!hasListAuthority}>
                返回
              </Button>
              <Button type="primary" onClick={this.goToEdit} disabled={!hasEditAuthority || !!+status}>
                编辑规则
              </Button>
            </div>
          </Card>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
