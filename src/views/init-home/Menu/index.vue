<template>
  <div class="menu-style">
    <div class="menu-img">
      <img :src="getImage('/init-home/menu.png')" />
    </div>
    <div class="menu-info">
      <b>系统初始化{{ count }}个菜单</b>
      <div>初始化后的菜单可在“菜单管理”页面进行维护管理</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getImage } from '@jetlinks-web/utils';
import { getModulesBaseMenu, USER_CENTER_MENU_DATA } from '../data/baseMenu';
import { updateMenus } from '@/api/initHome';

/**
 * 获取菜单数据
 */
const menuDates = reactive({
  count: 0,
  current: [],
});

/**
 * 计算菜单数量
 */
const menuCount = (menus: any[]) => {
  return menus.reduce((pre, next) => {
    let _count = 1;
    if (next.children) {
      _count = menuCount(next.children);
    }
    return pre + _count;
  }, 0);
};
/**
 * 添加options show用于控制菜单是否显示函数
 */
const dealMenu = (data: any) => {
  data.forEach((item: any) => {
    item.options = Object.assign(
      {
        show: true,
      },
      item?.options || {},
    );
    if (item.children) {
      dealMenu(item.children);
    }
  });
};
/**
 * 初始化菜单
 */
const initMenu = async () => {
  return new Promise(async resolve => {
    //  用户中心
    await dealMenu(menuDates.current);
    // console.log([...menuDates.current!, USER_CENTER_MENU_DATA]);
    const res = await updateMenus([...menuDates.current!, USER_CENTER_MENU_DATA]);
    if (res.success) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
};
const { count } = toRefs(menuDates);

onMounted(() => {
  const menus = getModulesBaseMenu();
  menuDates.count = menuCount(menus);
  menuDates.current = menus;
});
defineExpose({
  updateMenu: initMenu,
});
</script>
<style lang="less" scoped>
.menu-style {
  display: flex;
  align-items: center;
  .menu-img {
    margin-right: 16px;
  }
}
</style>
