<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-row>
        <el-col :span="24">
        <el-form-item width="200px" label="快递公司">
            <el-input v-model="listQuery.companyName" placeholder="快递公司"></el-input>
          </el-form-item>

          
            <el-button type="primary" plain @click="fetchData"
              >查询</el-button
            >
            <el-button type="primary" style="float:right" plain @click="dialogDetail = true"
              >新增</el-button
            >
          
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
      <el-table-column align="center" label="编号" >
        <template slot-scope="scope">
          {{ scope.row.companyId }}
        </template>
      </el-table-column>

      <el-table-column label="快递公司" align="center">
        <template slot-scope="scope">
          <span
            @click="handleDetail(scope.row.companyName)"
            style="color: #409eff; cursor: pointer"
            >{{ scope.row.companyName }}</span
          >
        </template>
      </el-table-column>


    



      <el-table-column label="操作"  align="center">
        <template slot-scope="scope">
         

          <el-button
            @click="handleDel(scope.row.companyId)"
            class="mg-l"
            type="danger"
            size="mini"
            icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="新增快递" :visible.sync="dialogDetail">
      <el-form
        :model="form"
        :rules="ruleForm"
        class="add-form"
        label-position="left"
      >
        <el-form-item label="快递公司名" prop="orderNumber">
          <el-input v-model="ruleForm.companyName"></el-input>
        </el-form-item>
      

        <el-form-item>
          <el-button type="primary" @click="handleAdd">确定</el-button>
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
import { addCompany , delCompany  , getCompanys } from "@/api/table";
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
      updateobj: {}
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getCompanys(this.listQuery).then((response) => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    handleAdd() {
      addCompany(this.ruleForm).then((response) => {
        if (response.code === 200) {
          this.$message.success(response.message);
          this.dialogDetail = false;
          this.fetchData();
          return;
        } else {
          this.$message.error(response.message);
        }
      });
    },
    resetForm() {
      this.ruleForm = {};
      this.dialogDetail = false;
    },
    handleDel(id) {
      this.$confirm("确定删除该快递?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      })
        .then(() => {
          let data2 = {
            companyId: id,
          };
          console.log(data2);
          delCompany(data2).then((res) => {
            if (res.code == "200") {
              this.$message.success(res.message);
              this.fetchData();
            } else {
              this.$message.error(res.message);
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
  
    
    // 提交修改
    submitUpdate(){
      updateBusiness(this.updateobj).then(response => {
        if(response.code === 200){
          this.$message.success(response.message)
          this.updateobj = {}
          this.updateUserDetails = false
          this.fetchData()
        }else{
          this.$message.error(response.message)
        }
      })
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