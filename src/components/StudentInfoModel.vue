<template>
  <div>
    <InputEdit class="input_edit" name="姓名" :nullable="false" value-key="name" :value="value.name" :valueId="value.id"
               @submit="handleSubmit"/>
    <InputEdit class="input_edit" name="学号" :must-integer="true" value-key="studentId" :value="value.studentId"
               :valueId="value.id"
               @submit="handleSubmit"/>
    <InputEdit class="input_edit" name="性别" :nullable="false" value-key="sex" :inputRange="['男','女']" :value="value.sex"
               :valueId="value.id"
               @submit="handleSubmit"/>
    <InputEdit class="input_edit" name="电话" :must-integer="true" value-key="tel" :value="value.tel" :valueId="value.id"
               @submit="handleSubmit"/>
    <InputEdit class="input_edit" name="邮箱" value-key="email"
               :regular="/^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/"
               :value="value.email" :valueId="value.id" @submit="handleSubmit"/>
    <InputEdit class="input_edit" name="年龄" value-key="age" :nullable="false" :value="value.age" :must-integer="true"
               :valueId="value.id"
               @submit="handleSubmit"/>
    <InputEdit class="input_edit" name="民族" value-key="ethnic" :nullable="false" :value="value.ethnic"
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
          <a-select-option v-for="apartment in apartmentData" :value="apartment.id">{{apartment.name}}</a-select-option>
        </a-select>
      </template>
    </InputEdit>
    <InputEdit class="input_edit" name="身份证号" value-key="idCard" :nullable="false" :must-integer="true"
               :value="value.idCard"
               :valueId="value.id"
               @submit="handleSubmit"/>
    <InputEdit class="input_edit" name="政治面貌" value-key="politicalStatus" :nullable="false"
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
                editData: {}
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
            handleApartmentChange(v) {
                console.log(v);
                this.editData.apartmentId = v;
            },
            handleModelOk() {
                console.log(1);
                Patch(API.update_user)
                    .withSuccessCode(204)
                    .withJSONData(
                        {
                            id: this.value.id,
                            apartment: {id: this.editData.apartmentId}
                        }
                    ).do(response => {
                });
                this.value.apartment.name = (this.apartmentData.filter(a => a.id === this.editData.apartmentId))[0].name
            },
            handleSubmit(id, valueKey, value) {
                if (this.value[valueKey] === value) {
                    return;
                }
                if (valueKey === "sex") {
                    value = value === '男'
                }
                console.log(id, valueKey, value);
                let data = {};
                data["id"] = id;
                data[valueKey] = value;
                Patch(API.update_user)
                    .withSuccessCode(204)
                    .withJSONData(data)
                    .do(response => {
                        console.log(response)
                    });
            },
            initApartmentData() {
                Get(API.apartment).do(response => {
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
