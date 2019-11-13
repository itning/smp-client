<template>
  <div>
    <div class="search_box">
      <a-input-search placeholder="键入学号或姓名进行模糊搜索" @search="onSearch" enterButton/>
      <div style="margin-top: 6px">
        <a-switch @change="additionalQuery=!additionalQuery"
                  style="margin-right: 12px;position: relative;bottom: 2px;"/>
        <a-select :disabled="!additionalQuery" v-model="additionalQueryObj.leaveType" style="margin-right: 12px">
          <a-select-option value="">所有类型</a-select-option>
          <a-select-option value="ALL_LEAVE">课假+寝室假</a-select-option>
          <a-select-option value="CLASS_LEAVE">课假</a-select-option>
          <a-select-option value="ROOM_LEAVE">寝室假</a-select-option>
        </a-select>
        <a-select :disabled="!additionalQuery" v-model="additionalQueryObj.effective" style="margin-right: 12px">
          <a-select-option value="">全部范围</a-select-option>
          <a-select-option value="1">假期中</a-select-option>
          <a-select-option value="0">已过期</a-select-option>
        </a-select>
        <a-range-picker :disabled="!additionalQuery" @change="onChange" :placeholder="['假条开始日期起始','假条开始日期结束']"/>
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
      <div slot="expandedRowRender" slot-scope="record">
        <comment v-model="record.leaveReasonList" :leave-id="record.id" :can-reply="false"/>
      </div>
    </a-table>
  </div>
</template>

<script>
    import moment from 'moment';
    import 'moment/locale/zh-cn';
    import {Get} from "../http";
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
        }
    ];
    export default {
        name: "Leave",
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
                additionalQuery: false,
                additionalQueryObj: {leaveType: "", effective: "", startTime: '', endTime: ''},
                nowApi: API.leaves,
                nowApiQuery: undefined,
                columns,
            }
        },
        methods: {
            onChange(date, dateString) {
                this.additionalQueryObj.startTime = dateString[0];
                this.additionalQueryObj.endTime = dateString[1];
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
                            return u;
                        });
                        this.pagination = pagination;
                    })
                    .doAfter(() => {
                        this.loading = false;
                    })
            },
            onSearch(value) {
                if (!this.additionalQuery && (value === undefined || value === "")) {
                    this.nowApi = API.leaves;
                    this.nowApiQuery = undefined;
                    this.getData();
                    return;
                }
                this.nowApi = API.search.leaves;
                if (this.additionalQuery) {
                    this.nowApiQuery = "?key=" + (value === undefined ? "" : value);
                    if (this.additionalQueryObj.startTime !== "" && this.additionalQueryObj.endTime !== "") {
                        this.nowApiQuery += "&startTime=" + this.additionalQueryObj.startTime + "&endTime=" + this.additionalQueryObj.endTime;
                    }
                    if (this.additionalQueryObj.leaveType !== "") {
                        this.nowApiQuery += "&leaveType=" + this.additionalQueryObj.leaveType;
                    }
                    if (this.additionalQueryObj.effective !== "") {
                        this.nowApiQuery += "&effective=" + this.additionalQueryObj.effective;
                    }
                    console.log("搜索：" + this.nowApiQuery);
                } else {
                    console.log("搜索：" + value);
                    this.nowApiQuery = "?key=" + value;
                }
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
