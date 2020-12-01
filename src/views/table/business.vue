<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-row>
        <el-col :span="24">

          <el-form-item width="200px" label="手机号">
            <el-input v-model="listQuery.bPhone" placeholder="手机号"></el-input>
          </el-form-item>

          <el-form-item width="200px" label="网点名">
            <el-input v-model="listQuery.bName" placeholder="网店名"></el-input>
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
      <el-table-column align="center" label="网点编号" width="95">
        <template slot-scope="scope">
          {{ scope.row.bId }}
        </template>
      </el-table-column>

      <el-table-column label="网点姓名" align="center">
        <template slot-scope="scope">
          <span
            @click="handleDetail(scope.row.bName)"
            style="color: #409eff; cursor: pointer"
            >{{ scope.row.bName }}</span
          >
        </template>
      </el-table-column>


      <el-table-column label="网点电话" align="center">
        <template slot-scope="scope">
          {{ scope.row.bPhone }}
        </template>
      </el-table-column>

      <el-table-column label="网点地址" align="center">
        <template slot-scope="scope">
          {{ scope.row.bAddress }}
        </template>
      </el-table-column>



      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            @click="update(scope.row.bId)"
            class="mg-l"
            type="primary"
            size="mini"
            icon="el-icon-s-tools"
            >修改</el-button
          >

          <el-button
            @click="handleDel(scope.row.bId)"
            class="mg-l"
            type="danger"
            size="mini"
            icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="新增网点" :visible.sync="dialogDetail">
      <el-form
        :model="form"
        :rules="ruleForm"
        class="add-form"
        label-position="left"
      >
        <el-form-item label="网点名字" prop="orderNumber">
          <el-input v-model="ruleForm.bName"></el-input>
        </el-form-item>
        <el-form-item label="网点密码" prop="clientAddress">
          <el-input v-model="ruleForm.bPassword"></el-input>
        </el-form-item>
        <el-form-item label="网点电话" prop="clientName">
          <el-input v-model="ruleForm.bPhone"></el-input>
        </el-form-item>
        <el-form-item label="网点地址" prop="clientPhone">
          <el-input v-model="ruleForm.bAddress"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleAdd">确定</el-button>
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="修改网点信息" :visible.sync="updateUserDetails">
      <el-form
        :model="form"
        :rules="updateobj"
        class="add-form"
        label-position="left"
      >
        <el-form-item label="网点名" prop="orderNumber">
          <el-input v-model="updateobj.bName"></el-input>
        </el-form-item>
        <el-form-item label="网点密码" prop="clientAddress">
          <el-input v-model="updateobj.bPassword"></el-input>
        </el-form-item>
        <el-form-item label="网点电话" prop="clientName">
          <el-input v-model="updateobj.bPhone"></el-input>
        </el-form-item>
        <el-form-item label="网点地址" prop="clientPhone">
          <el-input v-model="updateobj.bAddress"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitUpdate">确定</el-button>
          <el-button @click="updateUserDetails = false; updateobj = {}">取消</el-button>
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
import { addBusiness , delBusiness , updateBusiness , getBusiness } from "@/api/table";
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
      getBusiness(this.listQuery).then((response) => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    handleAdd() {
      addBusiness(this.ruleForm).then((response) => {
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
      this.$confirm("确定删除该用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      })
        .then(() => {
          let data2 = {
            bId: id,
          };
          console.log(data2);
          delBusiness(data2).then((res) => {
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
    // 点击修改按钮
    update(bId){
      this.updateUserDetails = true
      // getBusiness(this.listQuery).then(res=>{
      //   this.list=res.data.list;
      // })
      getBusiness({"bId":bId}).then(response => {
        response.data.list[0].bPassword = ''
        this.updateobj = response.data.list[0]
        this.updateobj.bId = bId
      })
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