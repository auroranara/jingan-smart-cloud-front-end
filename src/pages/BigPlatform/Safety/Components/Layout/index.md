# props属性详解
* className={styles.xxx} 布局容器的类名
* style={{ height: '100%' }} 布局容器的样式
* title="晶安智慧云平台" 默认为global.PROJECT_CONFIG.projectName
* autoSpace={false} 标题是否添加空格,默认为true
* extra={companyName} 头部左边的内容，如企业名称或选择框等
* timeStyle 时间容器样式
* extraStyle 额外容器样式

# 使用示例
<Layout
  extra="晶安科技有限公司"
>
  {}
</Layout>
