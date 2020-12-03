<template>
  <div class="app-container">

    <div class="bg_purple">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-row :gutter="30">
        <el-col :span='6'>
          <p class="title">今日统计</p>
        </el-col>
        <el-col :span="16" class="text_r">
          

          <el-form-item width="200px" label="网点">
            <!-- <el-input v-model="listQuery.company" placeholder="快递公司名称"></el-input> -->
            <el-select v-model="listQuery2.businessId" placeholder="请选择">
              <el-option
                v-for="item in options2"
                :key="item.bId"
                :label="item.bName"
                :value="item.bId"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" plain @click="fetchData">查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    
      <el-row class="total_box" :gutter="30">
        <el-col :span="6">
          <span class="text-box">今日入库
            <i>{{list2.inputData}}</i>
          </span>
         
        </el-col>
        <el-col :span="6">
          <span  class="text-box">今日出库
            <i>{{list2.output}}</i>
          </span>
         
        </el-col>
        <el-col :span="6">
            <span  class="text-box">当前库存
              <i>{{list2.stock}}</i>
            </span>
         
        </el-col>
         <el-col :span="6">
            <span  class="text-box">出库率
             <i>{{outlv}}</i> 
            </span>
         
        </el-col>
      </el-row>

      </div>


    <div class="bg_purple">

    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-row :gutter="30">
        <el-col :span='6'>
          <p class="title">综合统计</p>
        </el-col>
        <el-col :span="16" class="text_r">
          <el-form-item width="200px" label="入库时间">
            <el-date-picker
              v-model="value1"
              type="daterange"
              range-separator="至"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item width="200px" label="快递公司名称">
            <!-- <el-input v-model="listQuery.company" placeholder="快递公司名称"></el-input> -->
            <el-select v-model="listQuery.company" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.companyId"
                :label="item.companyName"
                :value="item.companyName"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" plain @click="fetchData">查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    
      <el-row class="total_box" :gutter="30">
        <el-col :span="8">
         <div class="text-box">
            <span >入库数据
             <i>{{list.inputData}}</i>
            </span>
         
         </div>
        </el-col>
        <el-col :span="8">
          <div class="text-box">
            <span>出库数据
              <i>{{list.output}}</i>
            </span>
          
          </div>
        </el-col>
        <el-col :span="8">
            <div class="text-box">
              <span>异常数据
                <i>{{list.exception}}</i>
              </span>
          
            </div>
        </el-col>
      </el-row>


    </div>
  </div>
</template>

<script>
import { getCompanys, getTotalData,getTodayData ,getBusiness} from "@/api/table";
import Pagination from "@/components/Pagination"; //
export default {
  components: { Pagination },
  data() {
    return {
      list: null,
      outlv:'0%',
      value1: null,
      listQuery: {
        startDate: "",
        endDate: "",
        company: "",
      },
       listQuery2: {
       businessId:'',
      },
      options: [],
        options2: [],
      list2:null
    };
  },
  created() {
    this.fetchData();
    this.getList();
  },
  methods: {
    getList(){
        getCompanys().then((response) => {
        this.options = response.data.list;
      });
       getBusiness().then(res=>{
        this.options2= res.data.list;
      })
    },
    fetchData() {
    
       if(this.value1!=null){
        this.listQuery.startDate=this.value1[0];
      this.listQuery.endDate=this.value1[1];
     }
      getTotalData(this.listQuery).then((res) => {
        this.list = res.data;
      });
      getTodayData(this.listQuery2).then(res=>{
        console.log(res)
        this.list2=res.data;
        if(res.data.inputData === 0) {
          this.outlv = '0%'
        }else{
          this.outlv = Math.round((res.data.output / res.data.inputData) * 100) + "%"
        }
      })
       
    },
  },
};
</script>
<style lang="scss" scoped>
.title{
  font-weight: bold;
}
 .bg_purple {
  background: #efefef;
  padding: 30px ;
  margin-bottom: 30px;;
  }
.total_box{
   
   margin: 30px 0;
  .el-col{
    height: 180px;
    text-align: center;
    padding: 0 10px;
    border-radius: 5px;
    .text-box{
      display: block;
       background: #fff;
      height: 100%;
     line-height: 180px;
      i{
        font-size: 16px;
        color: red;
        padding-left: 10px;
        font-weight: bold;
      }
      
    }
  }
  
}
.text_r{
    text-align: right;
  }
</style>