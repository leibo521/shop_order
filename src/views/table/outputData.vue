<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-row>
        <!-- <el-form-item label="收件人">
          <el-input v-model="listQuery.name" placeholder="收件人"></el-input>
        </el-form-item>
      -->
        <el-form-item label="电话">
          <el-input
            v-model="listQuery.number"
            placeholder="电话"
          ></el-input>
        </el-form-item>
     
        <!-- <el-form-item width="200px" label="入库时间">
            <el-date-picker
              v-model="value1"
               type="daterange"
              range-separator="至"
              format="yyyy-MM-dd "
               value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item> -->
        <el-form-item>
          <el-button type="primary" plain @click="fetchData()">查询</el-button>
          <!-- <el-button type="primary"  plain @click="handleAdd()"
              >新增</el-button> -->
        </el-form-item>

        <!-- <el-button style="float:right" type="primary" plain @click="handleAdd">新增</el-button> -->
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
      <el-table-column label="快递编号" align="center">
        <template slot-scope="scope">
          <span
            @click="handleDetail(scope.row.id)"
            style="color: #409eff; cursor: pointer"
            >{{ scope.row.orderCode }}</span
          >
        </template>
      </el-table-column>
      <el-table-column label="公司名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.company }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收件人" align="center">
        <template slot-scope="scope">
          {{ scope.row.clientName }}
        </template>
      </el-table-column>
      <el-table-column label="电话" align="center">
        <template slot-scope="scope">
          {{ scope.row.clientPhone }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="地址" align="center">
        <template slot-scope="scope">
          {{ scope.row.clientAddress }}
        </template>
      </el-table-column> -->
      <el-table-column label="数据状态" align="center">
        <template slot-scope="scope">
          <!-- {{ scope.row.orderStatus == 1 ? "已经出库" : "" }}
          {{ scope.row.orderStatus == 0 ? "入库中" : "" }} -->
           {{ scope.row.orderStatus | orderStatusFilter }}
        </template>
      </el-table-column>
      <el-table-column label="快件类型" align="center">
        <template slot-scope="scope">
          {{ scope.row.orderType == 1 ? "快递员数据" : "" }}
          {{ scope.row.orderType == 0 ? "普通数据" : "" }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="入库时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.orderCreateDate }}
        </template>
      </el-table-column>
      <el-table-column label="超限时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.orderExpireTime }}
        </template>
      </el-table-column> -->
      <el-table-column label="用户状态" align="center">
        <template slot-scope="scope">
          <span> {{ scope.row.clientStatus | statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否绑定微信" align="center">
        <template slot-scope="scope">
          <span> {{ scope.row.clientIsWechat | wxstatusFilter }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" width="280" align="center">
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
      </el-table-column> -->
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
import { getShopList, delData, addShopList, outputByAdmin } from "@/api/table";
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
        2:'异常件'
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
      value1:null,
      showStore: false,
      listLoading: false,
      total: 0,
      dialogDetail: false,

      ruleForm: {
        bId: "",
        clientAddress: "",
        clientName: "",
        clientPhone: "",
        company: "",
        orderCreateDate: "",
        orderExpireTime: "",
        orderNumber: "",
        orderStatus: 0,
        bName: "",
      },
      rules: {
        clientAddress: [
          { required: true, message: "请输入收件人地址", trigger: "blur" },
        ],
        clientName: [
          { required: true, message: "请输入收件人名字", trigger: "blur" },
        ],
        clientPhone: [
          { required: true, message: "请输入收件人电话", trigger: "blur" },
        ],
        company: [
          { required: true, message: "请输入快递公司", trigger: "blur" },
        ],
        orderNumber: [
          { required: true, message: "请输入快递单号", trigger: "blur" },
        ],
      },
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        orderStatus:1,
      },
      time: "",
      form: {},
      storeInfo: {},
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
     console.log(this.value1);
     if(this.value1!=null){
        this.listQuery.startTime=this.value1[0];
      this.listQuery.endTime=this.value1[1];
     }
      getShopList(this.listQuery).then((response) => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    handleAdd(row) {
      this.dialogDetail = true;
    },
    submitForm() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          addShopList().then((res) => {
            if (res.code == "200") {
              this.$message.success(res.message);
              this.dialogDetail = false;
              this.fetchData();
            } else {
              this.$message.error(res.message);
            }
          });
        }
      });
    },
    handleDel(id) {
      this.$confirm("确定删除该数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      })
        .then(() => {
          let data2 = {
            orderId: id,
          };
          console.log(data2);
          delData(data2).then((res) => {
            if (res.code == "200") {
              this.$message.success(res.message);
              this.fetchData();
            } else {
              this.$message.error(res.message);
            }
          });
          // this.$message({
          //   type: 'success',
          //   message: '删除成功!'
          // });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleOut(id) {
      this.$confirm("确定出库该数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      })
        .then(() => {
          outputByAdmin({ orderId: id }).then((response) => {
            if (response.code === 200) {
              this.$message.success(response.message);
              this.fetchData();
            } else {
              this.$message.error(response.message);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
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
.add-form .el-input {
  width: 50%;
}
</style>