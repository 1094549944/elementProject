<template>
  <el-row class="menu_page">
    <el-col>
      <el-menu mode="vertical"
               background-color="#324057"
               text-color="#fff"
               active-text-color="#409eff"
               class="el-menu-vertical-demo">
        <router-link :to="{name:'home'}">
          <el-menu-item index="0">
            <i class="fa fa-margin fa-server"></i>
            <span slot="title">首页</span>
          </el-menu-item>
        </router-link>
        <template v-for="item in items">
          <el-submenu v-if="item.children"
                      :index="item.path"
                      :key="item.path">
            <template slot="title">
              <i :class="'fa fa-margin '+item.icon"></i>
              <span slot="title">{{item.name}}</span>
            </template>
            <router-link v-for="(citem,cindex) in item.children"
                         :to="{name:citem.path}"
                         :key="cindex">
              <el-menu-item :index='citem.path'>
                <span slot="title">{{citem.name}}</span>
              </el-menu-item>
            </router-link>
          </el-submenu>
        </template>
      </el-menu>
    </el-col>
  </el-row>
</template>
<script>
export default {
  name: "leftmenu",
  data () {
    return {
      items: [
        {
          icon: "fa-money",
          name: "资金管理",
          path: "fund",
          children: [{ path: "foundList", name: "资金流水" }]
        },
        {
          icon: "fa-asterisk",
          name: "信息管理",
          path: "info",
          children: [{ path: "infoshow", name: "个人信息" }]
        }
      ]
    };
  }
};
</script>
<style scoped lang="stylus">
::-webkit-scrollbar
  display none

.menu_page
  position fixed
  top 71px
  left 0
  bottom 0
  background-color #324057
  z-index 99
  overflow-x hidden
  overflow-y scroll

.el-menu
  border none

.fa-margin
  margin-right 5px

.el-menu-vertical-demo:not(.el-menu--collapse)
  width 180px

.el-menu-vertical-demo
  width 35px

.el-submenu .el-menu-item
  min-width 180px

.hiddenDropdown, .hiddenDropname
  display none

a
  text-decoration none
</style>
