<template>
  <div id="app">
    <router-view/>
    <play/>
  </div>
</template>
<script>
import Play from './views/player/Play'
export default {
  name:"App",
  components:{
    Play
  },
  
}
</script>

<style lang="scss">
.bottomGrow{
        margin-bottom: .6rem;
    }
</style>
