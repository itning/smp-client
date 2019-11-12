<template>
    <div>
      <div class="search_box">
        <a-input-search placeholder="键入学号或姓名进行模糊搜索" @search="onSearch" enterButton/>
      </div>
    </div>
</template>

<script>
    export default {
        name: "Leave",
        methods:{
            onSearch(value){
                console.log(value)
            }
        }
    }
</script>

<style scoped>
  .search_box {
    padding: 0 10px 0 10px;
    background-color: rgb(255, 255, 255);
  }
</style>
