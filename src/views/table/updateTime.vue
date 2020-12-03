<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-row>
        <el-form-item label="出入库日期">
          <el-date-picker
            type="datetime"
            placeholder="选择日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="listQuery.currentDate"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="类型">
          <el-select clearable v-model="listQuery.type" placeholder="请选择">
            <el-option label="出库" value="1"> </el-option>
            <el-option label="入库" value="0"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="fetchData()">查询</el-button>
          <!-- <el-button type="primary"  plain @click="handleAdd()"
              >新增</el-button> -->
        </el-form-item>
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
      <!-- <el-table-column align="center" label="编号" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column> -->
      <el-table-column label="快递遍号" align="center">
        <template slot-scope="scope">
          <span
            @click="handleDetail(scope.row.id)"
            style="color: #409eff; cursor: pointer"
            >{{ scope.row.orderCode }}</span
          >
        </template>
      </el-table-column>
    
      <el-table-column label="姓名" align="center">
        <template slot-scope="scope">
          {{ scope.row.clientName }}
        </template>
      </el-table-column>
      <el-table-column label="电话" align="center">
        <template slot-scope="scope">
          {{ scope.row.clientPhone }}
        </template>
      </el-table-column>
 
      <el-table-column label="入库时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.orderCreateDate }}
        </template>
      </el-table-column>
      <el-table-column label="超限时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.orderExpireTime }}
        </template>
      </el-table-column>
          <el-table-column label="快件类型" align="center">
        <template slot-scope="scope">
          {{ scope.row.orderType | orderTypeFilter }}
        </template>
      </el-table-column>
      <el-table-column label="用户状态" align="center">
        <template slot-scope="scope">
          <span> {{ scope.row.orderStatus | statusFilter }}</span>
        </template>
      </el-table-column>
     
      <el-table-column label="操作" width="280" align="center">
        <template slot-scope="scope">
          <el-button
            @click="handleOut(scope.row.orderId)"
            class="mg-l"
            type="primary"
            size="mini"
            icon="el-icon-s-tools"
            :disabled="scope.row.orderStatus == 0 ? false : true"
          >
            出库
          </el-button>

          <el-button
            @click="handleDel(scope.row.orderId)"
            class="mg-l"
            type="danger"
            size="mini"
            icon="el-icon-delete"
            >删除</el-button
          >
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
import { getShopList } from "@/api/table";
import Pagination from "@/components/Pagination"; //
export default {
filters: {
    statusFilter(status) {
      const statusMap = {
        1: "信任用户",
        2: "常投诉用户",
      };
      return statusMap[status];
    },
    orderTypeFilter(status) {
      const statusMap = {
        1: "快递员数据",
        0: "普通数据",
      };
      return statusMap[status];
    },
    orderStatusFilter(status) {
      const statusMap = {
        1: "已经出库",
        0: "未出库",
        2:'已过期'
      };
      return statusMap[status];
    },
    wxstatusFilter(status) {
      const statusMap = {
        1: "是",
        0: "否",
      };
      return statusMap[status];
    },
  },
  components: { Pagination },
  data() {
    return {
      list: null,
      listLoading: false,
      total: 0,

      listQuery: {
        pageNum: 1,
        isExpire:true,
        pageSize: 10,
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getShopList(this.listQuery).then((response) => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
// .add-form{
//   height: 480px;
//   overflow-y: scroll;
//   overflow-x: hidden;
// }
.el-form-item__content span {
  color: #409eff;
}
</style>