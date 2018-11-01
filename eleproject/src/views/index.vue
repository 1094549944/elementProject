<template>
  <div class="index">
    <HeadNav></HeadNav>
  </div>
</template>

<script>
import HeadNav from "../components/HeadNav"
export default {
  name: 'index',
  components: {
    HeadNav
  }
}
</script>

<style scoped lang="stylus">
.index
  width 100%
  height 100%
  overflow hidden

.rightContainer
  position relative
  top 0
  left 180px
  width calc(100% - 180px)
  height calc(100% - 71px)
  overflow auto
</style>
