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
          <TreeNode disabled={!+item.questionsNum} title={<span>{`${item.name} (${item.questionsNum})`}<span className={styles.treeNodeExtra}>{item.selQuestionNum}</span></span>} key={item.id} dataRef={item} selectable={false}>
            {this.renderTree(item.children)}
          </TreeNode>
        );
      }
      // 当没有children时，才可以选择数量，并且当可选择数量为0，或values为undefined即该类型没有选中时无法选择数量
      return <TreeNode disabled={!+item.questionsNum} title={<span>{`${item.name} (${item.questionsNum})`}<span className={styles.treeNodeExtra}>{item.selQuestionNum}</span></span>} key={item.id} dataRef={item} selectable={false} />;
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
                <Row gutter={24} className={styles.row}>
                  {[
                    { tree: singleTree, key: 'singleValues', label: '单选题' },
                    { tree: multipleTree, key: 'multipleValues', label: '多选题' },
                    { tree: judgeTree, key: 'judgeValues', label: '判断题' },
                  ].map(({ tree, key, label }) => (
                    <Col md={8} sm={24} className={styles.col} key={key}>
                      <div className={styles.area}>
                        <div className={styles.areaTop}>
                          <span>{label}</span>
                          <span style={{ float: 'right' }}>题目总数：{this.getTotal(tree)}</span>
                        </div>
                        <div className={styles.areaCenter}>
                          <span className={styles.areaCenterLeft}>知识点分类</span>
                          <span className={styles.areaCenterRight}>抽题</span>
                        </div>
                        <div className={styles.areaBottom}>
                          <div className={styles.areaBottomLeft}>
                              <Tree showLine>{this.renderTree(tree)}</Tree>
                          </div>
                          <div className={styles.areaBottomRight}></div>
                        </div>
                      </div>
                    </Col>
                  ))}
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
