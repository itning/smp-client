<template>
  <div>
    <div class="search_box">
      <a-input-search placeholder="键入学号或姓名进行模糊搜索" @search="onSearch" enterButton/>
      <div style="margin-top: 6px">
        <a-switch @change="additionalQuery=!additionalQuery" disabled
                  style="margin-right: 12px;position: relative;bottom: 2px;"/>
        <a-select :disabled="!additionalQuery" defaultValue="2" style="margin-right: 12px">
          <a-select-option value="2">课假+寝室假</a-select-option>
          <a-select-option value="0">课假</a-select-option>
          <a-select-option value="1">寝室假</a-select-option>
        </a-select>
        <a-select :disabled="!additionalQuery" defaultValue="2" style="margin-right: 12px">
          <a-select-option value="2">全部范围</a-select-option>
          <a-select-option value="0">假期中</a-select-option>
          <a-select-option value="1">已过期</a-select-option>
        </a-select>
        <a-range-picker :disabled="!additionalQuery" @change="onChange"/>
      </div>
    </div>
    <a-table
      :columns="columns"
      :rowKey="user => user.id"
      :dataSource="data"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
    </a-table>
  </div>
</template>

<script>
    import moment from 'moment';
    import 'moment/locale/zh-cn';
    import {Get} from "../http";
    import {API} from "../api";

    moment.locale('zh-cn');

    const columns = [
        {
            title: '姓名',
            dataIndex: 'studentUser.name'
        },
        {
            title: '学号',
            dataIndex: 'studentUser.studentId'
        },
        {
            title: '类型',
            dataIndex: 'leaveType'
        },
        {
            title: '开始日期',
            dataIndex: 'startTime'
        },
        {
            title: '结束日期',
            dataIndex: 'endTime'
        },
        {
            title: '公寓',
            dataIndex: 'studentUser.apartment.name'
        },
        {
            title: '寝室',
            dataIndex: 'studentUser.roomNum'
        },
        {
            title: '电话',
            dataIndex: 'studentUser.tel'
        },
        {
            title: '原因',
            dataIndex: 'reason',
            width: "25%"
        }
    ];
    export default {
        name: "Leave",
        data() {
            return {
                loading: true,
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
                additionalQuery: false,
                nowApi: API.leaves,
                columns,
            }
        },
        methods: {
            onChange() {

            },
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
                Get(this.nowApi + '?page=' + (params.page - 1) + '&size=' + params.results)
                    .do(response => {
                        const pagination = {...this.pagination};
                        pagination.total = response.data.data.totalElements;
                        this.data = response.data.data.content.map(u => {
                            switch (u.leaveType) {
                                case "CLASS_LEAVE":
                                    u.leaveType = "课假";
                                    break;
                                case "ROOM_LEAVE":
                                    u.leaveType = "寝室假";
                                    break;
                                case "ALL_LEAVE":
                                    u.leaveType = "全假";
                                    break;
                            }
                            u.startTime = moment(u.startTime).format("YYYY年MM月DD日");
                            u.endTime = moment(u.endTime).format("YYYY年MM月DD日");
                            return u;
                        });
                        this.pagination = pagination;
                    })
                    .doAfter(() => {
                        this.loading = false;
                    })
            },
            onSearch(value) {
                if (value === undefined || value === "") {
                    this.nowApi = API.leaves;
                    this.getData();
                    return;
                }
                console.log("搜索：" + value);
                this.nowApi = API.search.leaves + value;
                this.getData();
            }
        },
        created() {
            this.getData();
        }
    }
</script>

<style scoped>
  .search_box {
    padding: 0 10px 0 10px;
    background-color: rgb(255, 255, 255);
  }
</style>
