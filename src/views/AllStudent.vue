<template>
  <a-table
    :columns="columns"
    :rowKey="user => user.id"
    :dataSource="data"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
  >
  </a-table>
</template>

<script>
    import {Get} from "../http";
    import {API} from "../api";

    const columns = [
        {
            title: '姓名',
            dataIndex: 'name'
        },
        {
            title: '学号',
            dataIndex: 'studentId'
        },
        {
            title: '性别',
            dataIndex: 'sex'
        },
        {
            title: '公寓',
            dataIndex: 'apartment.name'
        },
        {
            title: '寝室',
            dataIndex: 'roomNum'
        },
        {
            title: '电话',
            dataIndex: 'tel'
        },
        {
            title: '邮箱',
            dataIndex: 'email'
        },
    ];
    export default {
        name: "AllStudent",
        data() {
            return {
                data: [],
                pagination: {
                    //是否可以快速跳转至某页
                    showQuickJumper: true,
                    //是否可以改变 pageSize
                    showSizeChanger: true,
                    //默认的每页条数
                    defaultPageSize: 10,
                    //分页下拉框数据
                    pageSizeOptions: ['10', '30', '50', '70', '100']
                },
                loading: false,
                columns,
            };
        },
        methods: {
            handleTableChange(pagination, filters, sorter) {
                const pager = {...this.pagination};
                pager.current = pagination.current;
                this.pagination = pager;
                this.getData({
                    results: pagination.pageSize,
                    page: pagination.current,
                    sortField: sorter.field,
                    sortOrder: sorter.order,
                    ...filters,
                });
            },
            getData(params = {page: 1, results: 10}) {
                this.loading = true;
                Get(API.users + '/?page=' + (params.page - 1) + '&size=' + params.results)
                    .do(response => {
                        const pagination = {...this.pagination};
                        pagination.total = response.data.data.totalElements;
                        this.data = response.data.data.content.map(u => {
                            u.sex = u.sex ? "男" : "女";
                            return u;
                        });
                        this.pagination = pagination;
                    })
                    .doAfter(() => {
                        this.loading = false;
                    })
            }
        },
        created() {
            this.getData();
        }
    }
</script>

<style scoped>

</style>
