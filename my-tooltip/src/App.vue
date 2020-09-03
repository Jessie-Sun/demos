<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <Tooltip max-width="200" content="Steven Paul Jobs was an American entrepreneur and business magnate. He was the chairman, chief executive officer, and a co-founder of Apple Inc.">
        <Button>Long Content</Button>
    </Tooltip>
    <div class="tooltip-wrap">
      <button id="tooltip">show Tooltip</button>
      <my-tooltip text="tooltip text289432475y" :target="target"></my-tooltip>
    </div>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import { Tooltip } from 'view-design';
import MyTooltip from "./components/MyTooltip.vue"

export default {
  name: 'App',
  components: {
    // HelloWorld,
    MyTooltip
  },
  mounted() {
    this.target = document.get
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.tooltip-wrap{
  position: relative;
  display: inline-block;
}
</style>
