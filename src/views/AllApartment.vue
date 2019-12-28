<template>
  <div>
    <a-table
      bordered
      :rowKey="record => record.id"
      :dataSource="dataSource"
      :loading="loading"
      :columns="columns"
      :pagination="pagination">
      <template slot="name" slot-scope="text, record">
        <editable-cell :text="text" @change="onCellChange(record.id, 'name', $event)"/>
      </template>
      <template slot="operation" slot-scope="text, record">
        <a-popconfirm
          v-if="dataSource.length"
          title="确定删除？"
          @confirm="() => onDelete(record.id)"
        >
          <a href="javascript:;">删除</a>
        </a-popconfirm>
      </template>
    </a-table>
    <a-button size="large" block @click="visible=true">添加</a-button>
    <a-modal title="添加公寓" v-model="visible" @ok="handleAdd" okText="添加" cancelText="取消">
      <a-input v-model="newApartmentName" placeholder="输入公寓名称"/>
    </a-modal>
  </div>
</template>

<script>
    import EditableCell from "../components/EditableCell";
    import {Del, Get, Patch, Post} from "../http";
    import {API} from "../api";

    export default {
        name: "AllApartment",
        components: {EditableCell},
        data() {
            return {
                newApartmentName: "",
                visible: false,
                loading: true,
                dataSource: [],
                columns: [
                    {
                        title: '公寓名',
                        dataIndex: 'name',
                        scopedSlots: {customRender: 'name'},
                    },
                    {
                        title: '操作',
                        dataIndex: 'operation',
                        scopedSlots: {customRender: 'operation'},
                    },
                ],
                pagination: {
                    hideOnSinglePage: true,
                    //是否可以快速跳转至某页
                    showQuickJumper: true,
                    //是否可以改变 pageSize
                    showSizeChanger: true,
                    //默认的每页条数
                    defaultPageSize: 10,
                    //分页下拉框数据
                    pageSizeOptions: ['10', '30', '50', '70', '100']
                },
            };
        },
        methods: {
            onCellChange(id, dataIndex, value) {
                const dataSource = [...this.dataSource];
                const target = dataSource.find(item => item.id === id);
                if (target) {
                    target[dataIndex] = value;
                    Patch(API.update_apartment)
                        .withSuccessCode(204)
                        .withJSONData({
                            id: id,
                            name: value
                        })
                        .do(response => {
                            this.$message.success('修改成功');
                        });
                    this.dataSource = dataSource;
                }
            },
            onDelete(id) {
                Del(API.del_apartment + id).withSuccessCode(204).do(respons => {
                    const dataSource = [...this.dataSource];
                    this.dataSource = dataSource.filter(item => item.id !== id);
                })
            },
            handleAdd() {
                if (this.newApartmentName.trim() !== "") {
                    Post(API.add_apartment)
                        .withSuccessCode(201)
                        .withURLSearchParams({apartmentName: this.newApartmentName.trim()})
                        .do(response => {
                            this.dataSource.push(response.data.data);
                        })
                        .doAfter(() => {
                            this.visible = false;
                        })
                }
            },
            initApartmentData() {
                this.loading = true;
                Get(API.apartment)
                    .do(response => {
                        this.dataSource = response.data.data;
                    }).doAfter(() => {
                    this.loading = false;
                })
            }
        },
        mounted() {
            this.initApartmentData();
        }
    }
</script>

<style scoped>

</style>
