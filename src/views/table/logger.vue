<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-row>
        <el-col :span="16">
          <el-date-picker
            v-model="dateValue"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
          >
          </el-date-picker>

          <el-select style="margin-left: 20px;" v-model="listQuery.type" placeholder="选择日志类型">
            <el-option label="添加" value="add"></el-option>
            <el-option label="删除" value="delete"></el-option>
            <el-option label="更新" value="update"></el-option>
            <el-option label="登录" value="login"></el-option>
          </el-select>


          <el-form-item>
            <el-button type="primary" plain @click="selectLogger()"
              >查询</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >

      <el-table-column align="center" label="日志ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.lId }}
        </template>
      </el-table-column>

      <el-table-column label="日志类型" align="center">
        <template slot-scope="scope">
          <span
            style="color: #409eff; cursor: pointer"
            >
            {{ scope.row.lType == 'add' ? '添加' : '' }}
            {{ scope.row.lType == 'delete' ? '删除' : '' }}
            {{ scope.row.lType == 'update' ? '更新' : '' }}
            {{ scope.row.lType == 'login' ? '登录' : '' }}
            </span>
        </template>
      </el-table-column>

      <!-- <el-table-column label="用户密码" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cPassword }}</span>
        </template>
      </el-table-column> -->

      <el-table-column label="操作时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.updateDate }}
        </template>
      </el-table-column>

      <el-table-column label="操作人" align="center">
        <template slot-scope="scope">
          {{ scope.row.lName }}
        </template>
      </el-table-column>

      <el-table-column label="详情" align="center">
        <template slot-scope="scope">
          {{ '[' + scope.row.lName + '] ' }}
            {{ scope.row.lType == 'add' ? '添加了编号为 [' + scope.row.lDetails + '] 的面单数据' : '' }}
            {{ scope.row.lType == 'delete' ? '删除了编号为 [' + scope.row.lDetails + '] 的面单数据' : '' }}
            {{ scope.row.lType == 'update' ? '更新了编号为 [' + scope.row.lDetails + '] 的面单数据' : '' }}
            {{ scope.row.lType == 'login' ? '在 [' + scope.row.updateDate + '] 登录了系统' : '' }}
        </template>
        
      </el-table-column>


    </el-table>


    <pagination
      v-show="total >= 1"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="fetchData"
    />
  </div>
</template>

<script>
import { getLogger } from "@/api/table";
import Pagination from "@/components/Pagination"; //
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  components: { Pagination },
  data() {
    return {
      dateValue: "",
      list: null,
      showStore: false,
      listLoading: false,
      updateUserDetails: false,
      total: 0,
      dialogDetail: false,
      ruleForm: {},
      listQuery: {
        pageNum: 1,
        pageSize: 10,
      },
      time: "",
      form: {},
      storeInfo: {},
      updateobj: {},
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
  
    fetchData() {
      this.listLoading = true;
      getLogger(this.listQuery).then((response) => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },

    // 查询
    selectLogger(){
    if(this.dateValue != null) {
      this.listQuery.startTime = this.dateValue[0]
      this.listQuery.endTime = this.dateValue[1]
    }else{
      this.listQuery.startTime = null
      this.listQuery.endTime = null
    }
    this.fetchData()
    }
  },
};
</script>
<style lang="scss" scoped>
.add-form {
  height: 480px;
  overflow-y: scroll;
  overflow-x: hidden;
  .el-row {
    padding-left: 18px;
  }
}
.el-form-item__content span {
  color: #409eff;
  float: left;
  // width: 70%;
}
.search-lf {
  .el-form-item {
    margin-right: 35px;
  }
}
</style>