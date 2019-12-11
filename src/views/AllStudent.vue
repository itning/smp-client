<template>
  <div>
    <div class="search_box">
      <a-input-search placeholder="键入学号或姓名进行模糊搜索" @search="onSearch" enterButton/>
    </div>
    <a-table
      :columns="columns"
      :rowKey="user => user.id"
      :dataSource="data"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <template slot="action" slot-scope="text">
        <a @click="detail(text)">查看详情</a>
      </template>
    </a-table>
    <a-modal title="查看详情" :width="750" :maskClosable="false" v-model="isModalVisible"
             @cancel="handleModalCancel">
      <template slot="footer">
        <a-popconfirm
          title="确定删除该学生？"
          @confirm="handleDelStudent"
          okText="确定"
          cancelText="取消"
        >
          <a-button type="danger" :loading="isDelLoading">
            删除该学生
          </a-button>
        </a-popconfirm>
        <a-popconfirm
          title="确定重置该学生密码？"
          @confirm="handleResetPwd"
          okText="确定"
          cancelText="取消"
        >
          <a-button type="danger">
            重置该学生密码
          </a-button>
        </a-popconfirm>
      </template>
      <student-info-model v-model="showDetailObj"/>
    </a-modal>
  </div>
</template>

<script>
  import {Del, Get, Post} from "../http";
  import {API} from "../api";
  import StudentInfoModel from "../components/StudentInfoModel";
  import moment from 'moment';
  import 'moment/locale/zh-cn';

  moment.locale('zh-cn');

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      sorter: true
    },
    {
      title: '学号',
      dataIndex: 'studentId',
      sorter: true
    },
    {
      title: '性别',
      dataIndex: 'sex',
      sorter: true
    },
    {
      title: '年龄',
      dataIndex: 'age',
      sorter: true
    },
    {
      title: '出生日期',
      dataIndex: 'birthday',
      sorter: true
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
      dataIndex: 'tel',
      sorter: true
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      sorter: true
    },
    {
      title: '操作',
      key: 'operation',
      width: 155,
      scopedSlots: {customRender: 'action'}
    },
  ];
  export default {
    name: "AllStudent",
    components: {StudentInfoModel},
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
        pageInfo: {},
        loading: false,
        isModalVisible: false,
        showDetailObj: {},
        nowApi: API.users,
        isDelLoading: false,
        columns,
      };
    },
    methods: {
      handleResetPwd() {
        Post(API.reset_password)
          .withURLSearchParams({studentId: this.showDetailObj.studentId})
          .withSuccessCode(204)
          .do(response => {
            this.$message.success('成功重置');
          })
      },
      handleDelStudent() {
        console.log("删除ID:" + this.showDetailObj.id);
        this.isDelLoading = true;
        Del(API.del_user + this.showDetailObj.id)
          .withSuccessCode(204)
          .do(Response => {
            this.$message.success('成功删除');
            this.isModalVisible = false;
            this.handleModalCancel();
          })
          .doAfter(() => {
            this.isDelLoading = false;
          })
      },
      handleModalCancel() {
        this.showDetailObj = {};
        this.getData(this.pageInfo);
      },
      detail(obj) {
        this.showDetailObj = obj;
        this.isModalVisible = true;
      },
      onSearch(value) {
        if (value === undefined || value === "") {
          this.nowApi = API.users;
          this.getData();
          return;
        }
        console.log("搜索：" + value);
        this.nowApi = API.search.users + value;
        this.getData();
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
        this.pageInfo = params;
        let api;
        if (params.sortField !== undefined && params.sortOrder !== undefined) {
          api = this.nowApi + '?page=' + (params.page - 1) + '&size=' + params.results + "&sort=" + params.sortField
            + "," + (params.sortOrder === "ascend" ? 'asc' : 'desc')
        } else {
          api = this.nowApi + '?page=' + (params.page - 1) + '&size=' + params.results;
        }
        Get(api)
          .do(response => {
            const pagination = {...this.pagination};
            pagination.total = response.data.data.totalElements;
            this.data = response.data.data.content.map(u => {
              u.sex = u.sex ? "男" : "女";
              u.birthday = moment(u.birthday).format("YYYY年MM月DD日");
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
  .search_box {
    padding: 0 10px 0 10px;
    background-color: rgb(255, 255, 255);
  }
</style>
