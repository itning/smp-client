<template>
  <div>
    <InputEdit class="input_edit" name="姓名" :nullable="false" value-key="name" :value="value.name" :valueId="value.id"
               @submit="handleSubmit"/>
    <InputEdit class="input_edit" name="学号" :must-integer="true" value-key="studentId" :value="value.studentId"
               :valueId="value.id"
               @submit="handleSubmit"/>
    <InputEdit class="input_edit" name="电话" :must-integer="true" value-key="tel" :value="value.tel" :valueId="value.id"
               :regular="/^[1]([3-9])[0-9]{9}$/" @submit="handleSubmit"/>
    <InputEdit class="input_edit" name="邮箱" value-key="email"
               :regular="/^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/"
               :value="value.email" :valueId="value.id" @submit="handleSubmit"/>
    <InputEdit class="input_edit" name="民族" value-key="ethnic" :input-range="ethnicRangeData" :nullable="false"
               :value="value.ethnic"
               :valueId="value.id"
               @submit="handleSubmit"/>
    <InputEdit class="input_edit" name="床号" value-key="bedNum" :nullable="false" :value="value.bedNum"
               :valueId="value.id"
               @submit="handleSubmit"/>
    <InputEdit class="input_edit" name="寝室号" value-key="roomNum" :nullable="false" :value="value.roomNum"
               :valueId="value.id"
               @submit="handleSubmit"/>
    <InputEdit class="input_edit" name="公寓信息" :useModel="true" value-key="apartment.id" :nullable="false"
               :value="apartmentName"
               :valueId="value.id"
               @modelOk="handleModelOk">
      <template v-slot:edit_model>
        <a-select :defaultValue="apartmentId" style="width: 120px" @change="handleApartmentChange">
          <a-select-option v-for="apartment in apartmentData" :key="apartment.id" :value="apartment.id">
            {{apartment.name}}
          </a-select-option>
        </a-select>
      </template>
    </InputEdit>
    <InputEdit class="input_edit" name="身份证号" value-key="idCard" :nullable="false" :value="value.idCard"
               :valueId="value.id"
               @submit="handleSubmit"/>
    <InputEdit class="input_edit" name="政治面貌" :input-range="politicalRangeData" value-key="politicalStatus"
               :nullable="false"
               :value="value.politicalStatus" :valueId="value.id"
               @submit="handleSubmit"/>
    <InputEdit class="input_edit" name="家庭地址" value-key="address" :nullable="false" :value="value.address"
               :valueId="value.id"
               @submit="handleSubmit"/>
  </div>
</template>

<script>
  import InputEdit from "./InputEdit";
  import {Get, Patch} from "../http";
  import {API} from "../api";

  export default {
    components: {InputEdit},
    props: ['value'],
    name: "StudentInfoModel",
    data() {
      return {
        apartmentData: [],
        editData: {},
        ethnicRangeData: ["汉", "蒙古", "回", "藏", "维吾尔", "苗", "彝", "壮", "布依", "朝鲜", "满", "侗", "瑶", "白", "土家",
          "哈尼", "哈萨克", "傣", "黎", "傈僳", "佤", "畲", "高山", "拉祜", "水", "东乡", "纳西", "景颇", "柯尔克孜",
          "土", "达斡尔", "仫佬", "羌", "布朗", "撒拉", "毛南", "仡佬", "锡伯", "阿昌", "普米", "塔吉克", "怒", "乌孜别克",
          "俄罗斯", "鄂温克", "德昂", "保安", "裕固", "京", "塔塔尔", "独龙", "鄂伦春", "赫哲", "门巴", "珞巴", "基诺"],
        politicalRangeData: ["中共党员", "中共预备党员", "共青团员", "民革党员", "民盟盟员", "民建会员", "民进会员", "农工党党员", "致公党党员", "九三学社社员", "台盟盟员", "无党派人士"
          , "群众"]
      };
    },
    computed: {
      apartmentName: function () {
        if (this.value.apartment !== undefined) {
          return this.value.apartment.name;
        } else {
          return "";
        }
      },
      apartmentId: function () {
        if (this.value.apartment !== undefined) {
          return this.value.apartment.id;
        } else {
          return "";
        }
      }
    },
    methods: {
      handleApartmentChange(id) {
        console.log("当前选择公寓ID：" + id);
        this.editData.apartmentId = id;
      },
      handleModelOk() {
        console.log(`更新用户：${this.value.id} 公寓ID：${this.editData.apartmentId}`);
        Patch(API.update_user)
          .withSuccessCode(204)
          .withJSONData(
            {
              id: this.value.id,
              apartment: {id: this.editData.apartmentId}
            }
          ).do(response => {
          this.$message.success('修改成功');
        });
        this.value.apartment.name = (this.apartmentData.filter(a => a.id === this.editData.apartmentId))[0].name
      },
      handleSubmit(id, valueKey, value) {
        if (this.value[valueKey] === value) {
          return;
        }
        const oldValue = this.value[valueKey];
        if (valueKey === "sex") {
          value = value === '男'
        }
        console.log(`更新ID：${id} K: ${valueKey} V： ${value}`);
        let data = {};
        data["id"] = id;
        data[valueKey] = value;
        this.value[valueKey] = value;
        Patch(API.update_user)
          .withSuccessCode(204)
          .withJSONData(data)
          .do(response => {
            this.$message.success('修改成功');
          })
          .watchError(errorResponse => {
            console.log(this.value[valueKey]);
            this.value[valueKey] = oldValue;
          });
      },
      initApartmentData() {
        Get(API.apartment).do(response => {
          console.log("初始化公寓数据成功" + JSON.stringify(response.data.data));
          this.apartmentData = response.data.data;
        })
      }
    },
    mounted() {
      this.initApartmentData();
      this.editData.apartmentId = this.value.apartment.id;
    }
  }
</script>

<style scoped>
  .input_edit {
    margin-bottom: 12px;
  }
</style>
