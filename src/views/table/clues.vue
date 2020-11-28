<template>
  <div class="app-container">
    

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center">
        <template slot-scope="scope">
         <span @click="handleDetail(scope.row.id)" style="color:#409EFF">{{ scope.row.name }}</span> 
        </template>
      </el-table-column>
      <el-table-column label="联系方式" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.createtime }}
        </template>
      </el-table-column>
      <el-table-column label="贷款额度" align="center">
        <template slot-scope="scope">
          {{ scope.row.loan_limit }}
        </template>
      </el-table-column>
      <el-table-column label="城市" align="center">
        <template slot-scope="scope">
          {{ scope.row.city }}
        </template>
      </el-table-column>
     

   
    </el-table>
    
   
    <pagination
      v-show="total >= 1"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="fetchData"
    />
     <el-dialog
      title="客户详情"
      :visible.sync="dialogDetail"
    >
      <el-form
        :model="form"
        class="add-form"
        label-width="120px"
        label-position="right"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="姓名">
              <span >{{form.name}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号">
            
               <span>{{form.phone}}</span>
            </el-form-item>
          </el-col>
           <el-col :span="8">
                <el-form-item label="身份证号">
             <span>{{form.idcard}}</span>
            </el-form-item>
            </el-col>
        </el-row>
        <el-row>
              <el-col :span="8">
        <el-form-item label="来自区域">
           <span>{{form.province}}</span>
             <span>{{form.city}}</span>
            </el-form-item>
            </el-col>
           <el-col :span="8">
       <el-form-item label="企业年限">
             <span>{{form.company_year}}</span>
            </el-form-item>
            </el-col>
          <el-col :span="8">
        <el-form-item label="芝麻分">
           <span>{{form.sesame}}</span>
            
            </el-form-item>
            </el-col>
           
        </el-row>
       
        <el-row>
          <el-col :span="8">
             <el-form-item label="寿险">
            <span>{{form.life_insurance}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
             <el-form-item label="房产">
             <span>{{form.house_property}}</span>
            </el-form-item>
          </el-col>
           <el-col :span="8">
             <el-form-item label="车产">
              <span>{{form.vehicle_property}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row  >
          <el-col :span="8">
              <el-form-item label="贷款额度">
              <span>{{form.loan_limit}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
             <el-form-item label="收入信息">
              <span>{{form.income}}</span>
            </el-form-item>
          </el-col>
            <el-col :span="8">
             <el-form-item label="工资发放方式">
             <span>{{form.salary_type}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        
        
         <el-row> 
          
          <el-col :span="8">
             <el-form-item label="社保公积金">
           <span>{{form.socialwelfare}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
             <el-form-item label="微粒贷">
             <span>{{form.tiny_loan}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        
       
         <el-row>
              <el-col :span="8">
             <el-form-item label="学历">
               <span>{{form.education}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
             <el-form-item label="贷款目的">
            <span>{{form.loan_purpose}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
             <el-form-item label="贷款时间">
             <span>{{form.loan_time}}</span>
            </el-form-item>
          </el-col>
        </el-row>
         
          <el-row>
          <el-col :span="8">
             <el-form-item label="职业">
             <span>{{form.job}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
             <el-form-item label="工作年限">
              <span>{{form.job_year}}</span>
            </el-form-item>
          </el-col>
            <el-col :span="8">
             <el-form-item label="年收入">
              <span>{{form.company_income }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        
      
          <el-row>
            <el-col :span="8">
                   <el-form-item label="信用情况">
             <span>{{form.credit}}</span>
            </el-form-item>
            </el-col>
            <el-col :span='8'>
                <el-form-item label="企业地址">
                  <span>{{form.caddress}}</span>
                </el-form-item>
            </el-col>
             <el-col :span='8'>
                <el-form-item label="企业名称">
                  <span>{{form.cname}}</span>
                </el-form-item>
            </el-col>
          </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogDetail = false">确定</el-button>
      
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { clueList,getClueInfo} from "@/api/table";
import Pagination from "@/components/Pagination"; //
export default {
 
  components: { Pagination },
  data() {
    
    return {
     
      list: null,
      listLoading: false,
      total: 0,
     dialogDetail:false,
      listQuery: {
        page: 1,
        pageSize: 10
      },
      storeId: "", //门店id
      form:{},

    };
  },
  created() {
   
   
     this.storeId = this.$route.query.id;
     console.log(this.storeId)
      this.fetchData();
  },
  methods: {
    
    fetchData() {
      this.listLoading = true;
      clueList(this.storeId,this.listQuery).then(response => {
        this.list = response.data.list;
        this.total = response.data.totals;
        this.listLoading = false;
      });
    },
    
    handleDetail(id){
      this.dialogDetail=true
      getClueInfo(id).then(res=>{
        if(res.code==0){
          this.form=res.data
        }
      })
    }
  }
};
</script>
<style lang="scss" scoped>
// .add-form{
//   height: 480px;
//   overflow-y: scroll;
//   overflow-x: hidden;
// }
.el-form-item__content span{
  color: #409EFF;
}
</style>