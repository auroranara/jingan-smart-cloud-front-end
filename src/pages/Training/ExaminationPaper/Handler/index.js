import React, { PureComponent } from 'react';
import { Form, Spin, Card, Input, Button, Checkbox, Row, Col, Radio, Tree, message } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import urls from '@/utils/urls';
import titles from '@/utils/titles';
import codes from '@/utils/codes';
import { hasAuthority } from '@/utils/customAuth';

import styles from './index.less';

const { Item: FormItem } = Form;
const { Group: RadioGroup } = Radio;
const { TreeNode } = Tree;

const { home: homeUrl, examinationPaper: { list: listUrl, preview: previewUrl, detail: detailUrl } } = urls;
const { home: homeTitle, examinationPaper: { list: listTitle, menu: menuTitle, add: addTitle, edit: editTitle } } = titles;
const backUrl = `${listUrl}?back`;
// 获取code
const { training: { examinationPaper: { list: listCode } } } = codes;
// session
const companySessionName = 'examination_paper_list_company_';

@connect(({ examinationPaper, user, loading }) => ({
  examinationPaper,
  user,
  loading: loading.models.examinationPaper,
}))
@Form.create()
export default class App extends PureComponent {
  state = {
    // 抽题规则验证状态
    validateStatus: 'success',
    // 抽题规则验证信息
    help: undefined,
    // 单选框value
    radioValue: '1',
    // 单选值
    singleValues: {},
    // 多选值
    multipleValues: {},
    // 判断题值
    judgeValues: {},
    // 是否提交中
    submitting: false,
  }

  componentDidMount() {
    const { dispatch, match: { params: { id } }, user: { currentUser: { id: userId, unitType } } } = this.props;

    // 如果为编辑状态
    if (id) {
      // 获取详情
      dispatch({
        type: 'examinationPaper/fetchDetail',
        payload: { id },
        callback: ({ companyId, ruleType }) => {
          this.getRuleTree(dispatch, id, companyId || undefined);
          // 初始化state
          this.setState({
            // 单选框value
            radioValue: ruleType,
          });
        },
      });
    }
    else {
      // 清除详情
      dispatch({
        type: 'examinationPaper/save',
        payload: { key: 'detail', value: {} },
      });
      // 从session中获取companyId
      const { id: companyId } = JSON.parse(sessionStorage.getItem(`${companySessionName}${userId}`)) || {};
      // 如果为非企业，则companyId不存在时返回列表页面
      if ((unitType === 2 || unitType === 3) && !companyId) {
        this.goToList();
      }
      else {
        this.companyId = companyId;
      }
      // 获取规则树
      this.getRuleTree(dispatch, id, companyId);
    }
  }

  /**
   * 返回列表页面
   */
  goToList = () => {
    const { match: { params: { id } } } = this.props;
    router.push(id ? `${detailUrl}${id}` : backUrl);
  }

  /**
   * 获取规则树
   */
  getRuleTree(dispatch, paperId, companyId) {
    [{ questionType: 1, key: 'singleValues' }, { questionType: 2, key: 'multipleValues' }, { questionType: 3, key: 'judgeValues' }].forEach(({ questionType, key }) => {
      dispatch({
        type: 'examinationPaper/fetchRuleTree',
        payload: { paperId, questionType, companyId },
        callback: (list) => {
          // 如果为编辑则初始化state
          if (paperId) {
            const values = this.getValuesByTree(list);
            values && this.setState({ [key]: values });
          }
        },
      });
    });
  }

  /**
   * 获取题目总数
   */
  getTotal(values) {
    let total = 0;
    for (const value of Object.values(values || {})) {
      total += value || 0;
    }
    return total;
  }

  /**
   * 获取父节点总数
   */
  getSubTotal({ id, children }, values) {
    let total = 0;
    if (values) {
      if (children) {
        children.forEach(item => {
          total += this.getSubTotal(item, values);
        });
      }
      else {
        total = values[id] || 0;
      }
    }
    return total;
  }

  /**
   * 根据树获取values
   */
  getValuesByTree = (list) => {
    let values = undefined;
    list.forEach(({ id, selQuestionNum, children }) => {
      if (children && children.length > 0) {
        const childrenValues = this.getValuesByTree(children);
        if (childrenValues) {
          values = { ...values, ...childrenValues };
        }
      }
      // 如果没有children，则根据selQuestionNum是否大于0来初始化对象
      else {
        if (selQuestionNum) {
          if (!values) {
            values = {};
          }
          values[id] = selQuestionNum;
        }
      }
    });
    return values;
  }

  /**
   * 修改单选框
   */
  handleChangeRadio = (e) => {
    this.setState({ radioValue: e.target.value });
  }

  /**
   * 修改多选框
   */
  handleChangeCheckBox = (key, e) => {
    this.setState({ [key]: e.target.checked ? {} : undefined });
  }

  /**
   * 修改输入框
   */
  handleChangeInput = (key, item, e) => {
    const { id, questionsNum } = item;
    const value = e.target.value;
    // 格式化value，保留数字，并与最大值做比较
    let number = /\d+/.exec(value);
    number = number ? Math.min(+number[0], questionsNum) : undefined;
    this.setState(({ [key]: values }) => {
      return {
        [key]: { ...values, [id]: number },
      };
    });
  }

  /**
   * 提交
   */
  handleSubmit = () => {
    const { dispatch, form: { validateFieldsAndScroll }, match: { params: { id } }, examinationPaper: { detail: { companyId=this.companyId } } } = this.props;
    const { singleValues, multipleValues, judgeValues, radioValue: ruleType } = this.state;
    const singleKnowledgeRuleInfoList = singleValues && Object.entries(singleValues).filter(([ knowledgeId, selQuestionNum ]) => selQuestionNum).map(([ knowledgeId, selQuestionNum ]) => ({ knowledgeId, selQuestionNum }));
    const multiKnowledgeRuleInfoList = multipleValues && Object.entries(multipleValues).filter(([ knowledgeId, selQuestionNum ]) => selQuestionNum).map(([ knowledgeId, selQuestionNum ]) => ({ knowledgeId, selQuestionNum }));
    const judgeKnowledgeRuleInfoList = judgeValues && Object.entries(judgeValues).filter(([ knowledgeId, selQuestionNum ]) => selQuestionNum).map(([ knowledgeId, selQuestionNum ]) => ({ knowledgeId, selQuestionNum }));
    const isRuleSelected = (singleKnowledgeRuleInfoList && singleKnowledgeRuleInfoList.length > 0) ||
    (multiKnowledgeRuleInfoList && multiKnowledgeRuleInfoList.length > 0) ||
    (judgeKnowledgeRuleInfoList && judgeKnowledgeRuleInfoList.length > 0);
    validateFieldsAndScroll((error, { name }) => {
      if (!error && isRuleSelected) {
        const payload = {
          id,
          companyId,
          name,
          ruleType,
          singleKnowledgeRuleInfoList,
          multiKnowledgeRuleInfoList,
          judgeKnowledgeRuleInfoList,
        };
        this.setState({
          submitting: true,
        });
        // 编辑
        if (id) {
          dispatch({
            type: 'examinationPaper/updatePaper',
            payload,
            callback: (data) => {
              if (data) {
                message.success('编辑成功！', 1, () => {
                  router.push(`${previewUrl}${data.id}`);
                });
              }
              else {
                message.error('编辑失败！', 1, () => {
                  this.setState({
                    submitting: false,
                  });
                });
              }
            },
          });
        }
        else {
          dispatch({
            type: 'examinationPaper/insertPaper',
            payload,
            callback: (data) => {
              if (data) {
                message.success('新增成功！', 1, () => {
                  router.push(`${previewUrl}${data.id}`);
                });
              }
              else {
                message.error('新增失败！', 1, () => {
                  this.setState({
                    submitting: false,
                  });
                });
              }
            },
          });
        }
      }
    });
    !isRuleSelected && this.setState({ validateStatus: 'error', help: '请选择知识点' });
  }

  /**
   * 渲染树
   */
  renderTree = (data, values, key) => {
    return data.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <TreeNode disabled={!+item.questionsNum} title={<span>{`${item.name} (${item.questionsNum})`}<span className={styles.treeNodeExtra}>{this.getSubTotal(item, values)}</span></span>} key={item.id} dataRef={item} selectable={false}>
            {this.renderTree(item.children, values, key)}
          </TreeNode>
        );
      }
      // 当没有children时，才可以选择数量，并且当可选择数量为0，或values为undefined即该类型没有选中时无法选择数量
      return <TreeNode disabled={!+item.questionsNum} title={<span>{`${item.name} (${item.questionsNum})`}<span className={styles.treeNodeExtra}>{+item.questionsNum ? <Input value={values && values[item.id]} disabled={!values/*  || !item.questionsNum */} onChange={(e) => {this.handleChangeInput(key, item, e)}} size="small" maxLength="3" className={styles.treeNodeExtraInput} /> : item.questionsNum}</span></span>} key={item.id} dataRef={item} selectable={false} />;
    });
  }

  render() {
    const { loading, examinationPaper: { singleTree, multipleTree, judgeTree, detail: { name } }, user: { currentUser: { permissionCodes } }, form: { getFieldDecorator }, match: { params: { id } } } = this.props;
    const { validateStatus, help, radioValue, singleValues, multipleValues, judgeValues, submitting } = this.state;
    const hasListAuthority = hasAuthority(listCode, permissionCodes);
    const title = id ? editTitle : addTitle;

    /* 面包屑 */
    const breadcrumbList = [
      { title: homeTitle, name: homeTitle, href: homeUrl },
      { title: menuTitle, name: menuTitle },
      { title: listTitle, name: listTitle, href: backUrl },
      { title, name: title },
    ];

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        <Spin spinning={!!loading || submitting}>
          <Card bordered={false}>
            <Form>
              <Row>
                <Col xl={12} md={16} sm={24}>
                  <FormItem label="试卷名称" className={styles.formItem}>
                    {getFieldDecorator('name', {
                      initialValue: name,
                      rules: [{ required: true, message: '请填写试卷名称不少于6个字符', whitespace: true }],
                    })(
                      <Input placeholder="请填写试卷名称不少于6个字符" maxLength="255" />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <FormItem
                label="抽题规则"
                className={styles.formItem}
                required
                validateStatus={validateStatus}
                help={help}
              >
                <RadioGroup value={radioValue} onChange={this.handleChangeRadio} style={{ marginBottom: 12 }}>
                  <Radio value="1">知识点抽题</Radio>
                </RadioGroup>
                <Row gutter={24} style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {[
                    { tree: singleTree, values: singleValues, key: 'singleValues', label: '单选题' },
                    { tree: multipleTree, values: multipleValues, key: 'multipleValues', label: '多选题' },
                    { tree: judgeTree, values: judgeValues, key: 'judgeValues', label: '判断题' },
                  ].map(({ tree, values, key, label }) => (
                    <Col md={8} sm={24} className={styles.col} key={key}>
                      <div className={styles.area}>
                        <div className={styles.areaTop}>
                          <Checkbox checked={!!values} onChange={(e) => {this.handleChangeCheckBox(key, e);}}>{label}</Checkbox>
                          <span style={{ float: 'right' }}>题目总数：{this.getTotal(values)}</span>
                        </div>
                        <div className={styles.areaCenter}>
                          <span className={styles.areaCenterLeft}>知识点分类</span>
                          <span className={styles.areaCenterRight}>抽题</span>
                        </div>
                        <div className={styles.areaBottom}>
                          <div className={styles.areaBottomLeft}>
                            <Tree showLine>{this.renderTree(tree, values, key)}</Tree>
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
                取消
              </Button>
              <Button type="primary" onClick={this.handleSubmit}>
                保存并预览
              </Button>
            </div>
          </Card>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
