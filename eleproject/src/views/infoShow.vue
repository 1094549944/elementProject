<template>
  <div class="infoshow">
    <div class="user">
      <img :src="user.avatar"
           class='avatar'
           alt="">
      <div class="userinfo">
        <div class="user-item user-name">
          <i class="fa fa-user"></i>
          <span>{{user.name}}</span>
        </div>
        <div class="user-item">
          <i class="fa fa-cog"></i>
          <span>{{user.identity == 'manager' ? '管理员' : '普通员工'}}</span>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'infoshow',
  computed: {
    user () {
      return this.$store.getters.user
    }
  }
}
</script>

<style scoped lang="stylus">
.user
  display flex
  align-items center
  text-align left

  img
    width 120px
    height 120px
    border-radius 100%
    padding 20px

  .userinfo
    .user-name
      font-size 20px
      font-weight 700
</style>
