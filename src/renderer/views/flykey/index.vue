<!--  -->
<template>
  <div class=''>
    <p v-for="(item,index) in data" :key="index">
      {{item.type}}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  components: {},
  data () {
    return {

    }
  },
  computed: {},
  watch: {},
  methods: {

  },
  mounted () {

  }
}
</script>
<style lang='scss' scoped>

</style>