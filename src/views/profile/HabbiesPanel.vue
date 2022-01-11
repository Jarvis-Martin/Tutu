<template>
  <div class="hobbies-panel">
    <div class="label" v-for="(item, index) in HobbyLabels" :key="index" >
      <habby-label>
        <div>
          {{ item }}
        </div>
      </habby-label>
    </div>
  </div>
</template>

<script>
import HabbyLabel from './HobbyLabel'

export default {
  name: "HobbiesPanel",
  props: {
    HobbyLabels: Array
  },
  components: {
    HabbyLabel,
  }
}
</script>

<style lang="less">
.hobbies-panel {
  width: 710px;
  position: absolute;
  top: 576px;
  left: 20px;
  justify-content: space-around;
  display: flex;
  flex-wrap: wrap;
  border-top: 1px solid rgba(16, 16, 16, 0.6);
  border-bottom: 1px solid white;
  padding-top: 16px;
  padding-bottom: 8px;
  background-color: rgba(255,255,255, 0.4);

  * {
    flex: 0 0 22%;
    border-radius: 8px;
    margin-bottom: 8px;
  }
}
</style>