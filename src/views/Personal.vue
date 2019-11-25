<template>
  <div>
    <Waterfall
      :list="data"
      :gutter="10"
      :width="240"
      :phoneCol="2"
      backgroundColor="rgb(73, 74, 95)"
      ref="waterfall"
    >
      <template slot="item" slot-scope="props">
        <div class="card">
          {{props}}
          <img :src="props.data.src" alt="" @load="$refs.waterfall.refresh()">
        </div>
      </template>
    </Waterfall>
  </div>
</template>

<script>
    import Waterfall from "vue-waterfall-plugin";

    export default {
        name: "Personal",
        components: {Waterfall},
        data() {
            return {
                data: [
                    {
                        src: "a"
                    }
                ]
            }
        }
    }
</script>

<style scoped>

</style>
