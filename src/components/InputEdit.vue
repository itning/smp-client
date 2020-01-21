<template>
  <div>
    <a-input
      :addonBefore="name"
      v-model="nowValue"
      :read-only="readOnly"
      ref="input"
      @change="handleChange">
      <a-icon slot="addonAfter" :type="type" @click="handleEditAndCheck"/>
    </a-input>
    <a-modal title="修改" :width="750" :maskClosable="false" v-model="isModelShow" @ok="handleOk">
      <slot name="edit_model"></slot>
    </a-modal>
  </div>
</template>

<script>
  export default {
    props: [
      'valueKey',
      'value',
      "valueId",
      "name",
      "nullable",// 输入可以为空
      "mustInteger", // 输入必须是整数
      "inputRange", // 输入范围
      "regular", // 正则验证
      "useModel"
    ],
    name: "InputEdit",
    data() {
      return {
        type: "edit",
        readOnly: true,
        isModelShow: false,
        nowValue: ""
      };
    },
    watch: {
      value: function (n) {
        this.nowValue = n;
      }
    },
    methods: {
      handleOk() {
        this.isModelShow = !this.isModelShow;
        this.$emit("modelOk")
      },
      handleChange(v) {
        this.nowValue = v.target.value;
      },
      handleEditAndCheck() {
        if (this.type === "check") {
          if (!this.checkNewValue(this.nowValue)) {
            return;
          }
          this.type = "edit";
          this.readOnly = true;
          this.handleSubmit(this.valueId, this.valueKey, this.nowValue);
        } else {
          if (this.useModel) {
            this.isModelShow = true;
          } else {
            this.type = "check";
            this.readOnly = false;
            this.$refs.input.focus();
          }
        }
      },
      checkNewValue(newValue) {
        if (this.nullable !== true && newValue === "") {
          this.$message.error('请输入值');
          return false;
        }
        if (this.mustInteger === true && !(/^[\d]+$/.test(newValue))) {
          this.$message.error('请输入整数值');
          return false;
        }
        if (Object.prototype.toString.call(this.inputRange) === "[object Array]" && this.inputRange.length !== 0) {
          let result = true;
          for (let v of this.inputRange) {
            if (v === newValue) {
              result = false;
              break;
            }
          }
          if (result) {
            this.$message.error('请输入' + this.inputRange);
            return false;
          }
        }
        if (this.regular !== undefined && !this.regular.test(newValue)) {
          this.$message.error('请输入正确的值');
          return false;
        }
        return true;
      },
      handleSubmit(id, valueKey, value) {
        this.$emit("submit", id, valueKey, value);
      }
    },
    mounted() {
      this.nowValue = this.value;
    }
  }
</script>

<style scoped>

</style>
