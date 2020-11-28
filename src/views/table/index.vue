<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-row>
        <el-col :span="16">
          <el-form-item width="200px" label="收件人">
            <el-input
              v-model="listQuery.name"
              placeholder="收件人"
            ></el-input>
          </el-form-item>
        <el-form-item width="200px" label="单号">
            <el-input
              v-model="listQuery.companyname"
              placeholder="单号"
            ></el-input>
          </el-form-item>
          <el-form-item width="200px" label="电话">
            <el-input
              v-model="listQuery.companyname"
              placeholder="电话"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click="fetchData()"
              >查询</el-button>
               <el-button type="primary"  plain @click="handleAdd()"
              >新增</el-button>
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
          {{ scope.row.orderStatus }}
        </template>
      </el-table-column>
      <el-table-column label="是否绑定微信" align="center">
        <template slot-scope="scope">
          {{ scope.row.createtime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <a href="javascript:;" @click="handleOut(scope.row.id)"> 出库</a>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="新增入库" :visible.sync="dialogDetail">
      <el-form :model="form" :rules="ruleForm" class="add-form" label-position="left">
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

        <el-form-item label="入库时间" required>
          <el-col :span="11">
            <el-form-item prop="orderCreateDate">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="ruleForm.orderCreateDate"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="orderExpireTime">
              <el-time-picker
                placeholder="选择时间"
                v-model="ruleForm.orderExpireTime"
                style="width: 100%"
              ></el-time-picker>
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
import { getShopList } from "@/api/table";
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
      list: null,
      showStore: false,
      listLoading: false,
      total: 0,
      dialogDetail: false,
       ruleForm: {
          clientAddress: '',
          clientName: '',
          clientPhone: '',
          company: '',
          orderCreateDate: '',
          orderExpireTime: '',
          orderNumber: '',
         
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
    handleAdd() {
   this.dialogDetail = true;
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
</style>