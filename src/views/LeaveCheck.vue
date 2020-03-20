<template>
  <div>
    <div class="search_box">
      <a-input-search placeholder="键入学号或姓名进行模糊搜索" @search="onSearch" enterButton/>
    </div>
    <a-table
      :columns="columns"
      :rowKey="leave => leave.id"
      :dataSource="data"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <template slot="operation" slot-scope="text, record">
        <a-popconfirm
          v-if="!record.status"
          title="确定通过？"
          @confirm="() => statusChange(record.id,true)"
        >
          <a href="javascript:;">通过</a>
        </a-popconfirm>
        <a-popconfirm
          style="margin-left: 12px"
          v-if="!record.status"
          title="确定拒绝？"
          @confirm="() => statusChange(record.id,false)"
        >
          <a href="javascript:;">拒绝</a>
        </a-popconfirm>
      </template>
      <div slot="expandedRowRender" slot-scope="record">
        <comment v-model="record.leaveReasonList" :leave-id="record.id"/>
      </div>
    </a-table>
  </div>
</template>

<script>
    import moment from 'moment';
    import 'moment/locale/zh-cn';
    import {Get, Post} from "@itning/axios-helper";
    import {API} from "../api";
    import Comment from "../components/Comment";

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
        },
        {
            title: '操作',
            dataIndex: 'operation',
            scopedSlots: {customRender: 'operation'},
            width: "10%"
        }
    ];
    export default {
        name: "LeaveCheck",
        components: {Comment},
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
                nowApi: API.leaves_check,
                nowApiQuery: undefined,
                columns
            }
        },
        methods: {
            statusChange(id, status) {
                Post(API.leave_status)
                    .withSuccessCode(204)
                    .withURLSearchParams({leaveId: id, status: status})
                    .do(response => {
                        this.$message.success('审批成功');
                        this.getData();
                    })
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
                let api;
                if (this.nowApiQuery !== undefined) {
                    api = this.nowApi + this.nowApiQuery + '&page=' + (params.page - 1) + '&size=' + params.results;
                } else {
                    api = this.nowApi + '?page=' + (params.page - 1) + '&size=' + params.results;
                }
                Get(api)
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
                            u['showAddComment'] = false;
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
                    this.nowApi = API.leaves_check;
                    this.nowApiQuery = undefined;
                    this.getData();
                    return;
                }
                console.log("搜索：" + value);
                this.nowApi = API.search.leaves_check;
                this.nowApiQuery = "?key=" + value;
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
