import 'rc-drawer/assets/index.css';
import React from 'react';
import DrawerMenu from 'rc-drawer';
import SiderMenu from './SliderMenu';

/**
 * Recursively flatten the data
 * [{path:string},{path:string}] => {path,path2}
 * @param  menus
 */
const getFlatMenuKeys = menuData => {
  let keys = [];
  menuData.forEach(item => {
    if (item.children) {
      keys = keys.concat(getFlatMenuKeys(item.children));
    }
    keys.push(item.path);
  });
  return keys;
};

<<<<<<< HEAD
const SiderMenuWrapper = props => {
  const { isMobile, menuData, collapsed } = props;
  return isMobile ? (
    <DrawerMenu
      getContainer={null}
      level={null}
      handleChild={null}
      open={!collapsed}
      onMaskClick={() => {
        props.onCollapse(true);
      }}
    >
      <SiderMenu
        {...props}
        flatMenuKeys={getFlatMenuKeys(menuData)}
        collapsed={isMobile ? false : collapsed}
      />
    </DrawerMenu>
  ) : (
    <SiderMenu {...props} flatMenuKeys={getFlatMenuKeys(menuData)} />
  );
};
=======
const SiderMenuWrapper = props =>
  props.isMobile ? (
    <DrawerMenu
      parent={null}
      level={null}
      handleChild={null}
      open={!props.collapsed}
      onMaskClick={() => {
        props.onCollapse(true);
      }}
      width="256px"
    >
      <SiderMenu
        {...props}
        flatMenuKeys={getFlatMenuKeys(props.menuData)}
        collapsed={props.isMobile ? false : props.collapsed}
      />
    </DrawerMenu>
  ) : (
    <SiderMenu {...props} flatMenuKeys={getFlatMenuKeys(props.menuData)} />
  );
>>>>>>> init

export default SiderMenuWrapper;
