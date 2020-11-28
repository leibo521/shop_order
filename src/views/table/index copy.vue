<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-row>
        <el-form-item label="收件人">
          <el-input v-model="listQuery.name" placeholder="收件人"></el-input>
        </el-form-item>
        <el-form-item label="单号">
          <el-input
            v-model="listQuery.companyname"
            placeholder="单号"
          ></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input
            v-model="listQuery.companyname"
            placeholder="电话"
          ></el-input>
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
      <el-table-column align="center" label="编号" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="快递单号" align="center">
        <template slot-scope="scope">
          <span
            @click="handleDetail(scope.row.id)"
            style="color: #409eff; cursor: pointer"
            >{{ scope.row.orderNumber }}</span
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
      <el-table-column label="地址" align="center">
        <template slot-scope="scope">
          {{ scope.row.clientAddress }}
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
      <el-table-column label="用户状态" align="center">
        <template slot-scope="scope">
          <span> {{ scope.row.orderStatus | statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否绑定微信" align="center">
        <template slot-scope="scope">
          <span> {{ scope.row.clientIsWechat | wxstatusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280" align="center">
        <template slot-scope="scope">
          <el-button
            @click="handleAdd(scope.row)"
            class="mg-l"
            type="primary"
            size="mini"
            icon="el-icon-s-tools"
            >入库</el-button
          >
          <el-button
            @click="handleOut(scope.row.orderId)"
            class="mg-l"
            type="primary"
            size="mini"
            icon="el-icon-s-tools"
            >出库</el-button
          >

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
    <el-dialog title="新增入库" :visible.sync="dialogDetail">
      <el-form
        :model="form"
        ref="ruleForm"
        :rules="rules"
        class="add-form"
        label-width="80px"
        label-position="right"
      >
        <el-form-item label="快递单号" prop="orderNumber">
          <el-input v-model="ruleForm.orderNumber"></el-input>
        </el-form-item>
        <el-form-item label="快递地址" prop="clientAddress">
          <el-input v-model="ruleForm.clientAddress"></el-input>
        </el-form-item>
        <el-form-item label="收件人" prop="clientName">
          <el-input v-model="ruleForm.clientName"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="clientPhone">
          <el-input v-model="ruleForm.clientPhone"></el-input>
        </el-form-item>
        <el-form-item label="公司名称" prop="company">
          <el-input v-model="ruleForm.company"></el-input>
        </el-form-item>

        <el-form-item label="入库时间">
          <el-col :span="11">
            <el-form-item prop="orderCreateDate">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                v-model="ruleForm.orderCreateDate"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >确定</el-button
          >
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

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
import { getShopList, delData, addShopList } from "@/api/table";
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

      getShopList(this.listQuery).then((response) => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    handleAdd(row) {
      this.dialogDetail = true;
      this.ruleForm.bId = row.bId;
      this.ruleForm.bName = row.bName;
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
       })
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
.el-input {
  width: 50%;
}
</style>