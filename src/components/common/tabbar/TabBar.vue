<template>
  <div class="tab-bar">
    <div v-for="(item, index) in tabbarItenms" :key="index"   class="item">
      <tab-bar-item :link=item.link>
        <img :src="item.icon" alt="" slot="icon" />
        <img :src="item.icon_active" alt="" slot="icon-active" />
        <div slot="text">{{ item.text }}</div>
      </tab-bar-item>
    </div>
  </div>
</template>

<script>
import TabBarItem from './TabBarItem'

export default {
  name: 'TabBar',
  components: {
    TabBarItem,
  },
  props: {
    tabbarItenms: {
      type: Array
    }
  },
  data() {
    return {
      show: false
    }
  },
  methods: {
  }
}
</script>

<style lang="less">
@tabbar-height: 88px;

.tab-bar {
  width: 100vw;
  height: @tabbar-height;
  display: flex;
  align-content: center;
  border-top: 1px solid white;

  .item {
    height: inherit;
    flex: 1;
    position: relative;
    color: gray;
  }
}
</style>