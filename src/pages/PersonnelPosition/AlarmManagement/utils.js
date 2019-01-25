function cloneList(list, getNewItem) {
  return list.map(function(item) {
    const children = item.children;
    const newItem = getNewItem(item);
    if (children)
      newItem.children = cloneList(children);
    return newItem;
  });
}

export function handleSectionTree(list) {
  return cloneList(list, ({ id, name }) => {
    return { title: name, value: id, key: id };
  });
}
