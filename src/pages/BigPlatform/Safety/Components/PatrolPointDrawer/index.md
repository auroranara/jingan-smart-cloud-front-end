# props属性详情
* drawerProps={{ visible: true }} drawer组件可以设置的属性对象
* data={{  }} 数据源，需要风险卡列表和隐患列表两个字段

# 使用示例
renderPatrolPointDrawer() {
  const { patrolPointDrawerVisible, patrolPointDrawerData } = this.state;
  return (
    <PatrolPointDrawer
      drawerProps={{
        visible: patrolPointDrawerVisible,
        onClose: () => { this.setState({ riskPointDrawerVisible: false }) },
      }}
      data={patrolPointDrawerData}
    />
  );
}
