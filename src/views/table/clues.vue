<template>
  <div class="app-container">
    
<el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-row>
       
          <el-form-item  label="出入库日期">
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
            <el-option
              label="出库"
              value="1">
            </el-option>
             <el-option
              label="入库"
              value="0">
            </el-option>
          </el-select>
        </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click="fetchData()"
              >查询</el-button>
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
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="快递单号" align="center">
        <template slot-scope="scope">
         <span  style="color:#409EFF">{{ scope.row.number }}</span> 
        </template>
      </el-table-column>
      <el-table-column label="编号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ioId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出入库类型" align="center">
        <template slot-scope="scope">
          {{ scope.row.ioType |statusFilter  }}
        </template>
      </el-table-column>
   
      <el-table-column label="时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.ioTime }}
        </template>
      </el-table-column>
        <el-table-column label="网点地址" align="center">
        <template slot-scope="scope">
          {{ scope.row.ioAddress }}
        </template>
      </el-table-column>
         <el-table-column label="操作人" align="center">
        <template slot-scope="scope">
          {{ scope.row.ioName }}
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
import { getIoLogger} from "@/api/table";
import Pagination from "@/components/Pagination"; //
export default {
   filters: {
    statusFilter(status) {
      const statusMap = {
        1: "出库",
        0: "入库",
       
      };
      return statusMap[status];
    }
    },
  components: { Pagination },
  data() {
    
    return {
     
      list: null,
      listLoading: false,
      total: 0,
   
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
    

    };
  },
  created() {
   
   
   
      this.fetchData();
  },
  methods: {
    
    fetchData() {
      this.listLoading = true;
      getIoLogger(this.listQuery).then(response => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    
 
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