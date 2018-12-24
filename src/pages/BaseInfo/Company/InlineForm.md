# props属性解析
* fields={[{
  label: undefined,
  id: 'name',
  inputSpan: {
    lg: 8,
    md: 12,
    sm: 24,
  },
  options: {
    rules: [{
      required: true,
      whitespace: true,
      message: `请输入${fieldList.name}`,
    }],
  },
  render() {
    return (
      <Input placeholder={fieldList.name} />
    );
  },
  transform(value) {
    return value.trim();
  },
}]} 用于渲染的控件数组
* searchText 查询按钮的文本
* searchType 查询按钮的type属性
* onSearch 查询事件
* hideSearch 是否隐藏查询按钮
* resetText 重置按钮的文本
* resetType 重置按钮的type属性
* onReset 重置事件
* hideReset 是否隐藏重置按钮
* action 被加载在按钮旁边的元素，如额外的新增按钮等，且所有按钮在同一个容器中
* buttonSpan={{
  xl: 8,
  md: 12,
  sm: 24,
}} 按钮的容器所占的比例
* gutter={ md: 16 } 容器之间的间距
