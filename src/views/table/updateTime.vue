<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-row>
        <el-form-item label="编号">
          <el-input v-model="listQuery.orderCode" placeholder="编号"></el-input>
        </el-form-item>

        <el-form-item label="电话">
          <el-input v-model="listQuery.number" placeholder="电话"></el-input>
        </el-form-item>

        <el-form-item label="类型">
          <el-select v-model="listQuery.orderStatus">
            <el-option value="" label="全部"></el-option>
            <el-option value="1" label="已经出库"></el-option>
            <el-option value="0" label="入库中"></el-option>
            <el-option value="2" label="异常件"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="快递公司">
          <el-select v-model="listQuery.company">
            <el-option value="" label="全部"></el-option>
            <el-option
              :key="index"
              v-for="(item, index) in companys"
              :value="item"
              :label="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="网点">
          <el-select v-model="listQuery.bId">
            <el-option value="" label="全部"></el-option>
            <el-option
              :key="index"
              v-for="(item, index) in businesss"
              :value="item.bId"
              :label="item.bName"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item width="200px" label="入库时间">
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
        </el-form-item>
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
      <el-table-column label="快递遍号" align="center">
        <template slot-scope="scope">
          <span
            @click="handleDetail(scope.row.orderNumber)"
            style="color: #409eff; cursor: pointer"
            >{{ scope.row.orderCode }}</span
          >
        </template>
      </el-table-column>

      <el-table-column label="网点" align="center">
        <template slot-scope="scope">
          {{ scope.row.bName }}
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
            :disabled="(scope.row.orderStatus != 1 && scope.row.orderStatus != 21) ? false : true"
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

    <el-dialog
      @close="detailsClose"
      title="数据详情(点击可放大)"
      :visible.sync="dialogDetailImg"
    >
      <div class="coverImages">
        <div class="wrap">
          <div style="padding: 7px 50px; text-align: center; color: black">
            入库照片
          </div>
          <el-image
            :src="images.orderInputPhoto"
            fit="contain"
            style="width: 200px; height: 200px"
            :preview-src-list="srcList"
          >
            <div
              slot="error"
              style="text-align: center; padding: 50px"
              class="image-slot"
            >
              图片暂无
            </div>
          </el-image>
        </div>

        <div class="wrap">
          <div style="padding: 7px 50px; text-align: center; color: black">
            出库照片
          </div>
          <el-image
            :src="images.orderOutputPhoto"
            fit="contain"
            style="width: 200px; height: 200px"
            :preview-src-list="srcList"
          >
            <div
              slot="error"
              style="text-align: center; padding: 50px"
              class="image-slot"
            >
              图片暂无
            </div>
          </el-image>
        </div>

        <div class="wrap">
          <div style="padding: 7px 50px; text-align: center; color: black">
            异常照片
          </div>
          <el-image
            :src="images.orderExceptionPhoto"
            fit="contain"
            style="width: 200px; height: 200px"
            :preview-src-list="srcList"
          >
            <div
              slot="error"
              style="text-align: center; padding: 50px"
              class="image-slot"
            >
              图片暂无
            </div>
          </el-image>
        </div>
      </div>

      <div>
        <el-button type="primary" @click="dialogDetailImg = false"
          >确定</el-button
        >
      </div>
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
import {
  getCompanys,
  getShopList,
  delData,
  addShopList,
  outputByAdmin,
  getBusiness,
} from "@/api/table";
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
        2: "已过期",
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
      dialogDetailImg: false,
      list: null,
      listLoading: false,
      total: 0,

      listQuery: {
        pageNum: 1,
        isExpire: true,
        pageSize: 10,
      },
      images: {
        orderInputPhoto: "",
        orderOutputPhoto: "",
        orderExceptionPhoto: "",
      },
      srcList: [],
      companys: [],
      businesss: [], // 网点列表
    };
  },
  created() {
    this.fetchData();
    getCompanys().then((resp) => {
      if (resp.code == 200) {
        let datas = resp.data.list;
        for (let i = 0; i < datas.length; i++) {
          this.companys.push(datas[i].companyName);
        }
      }
    });
    getBusiness({ pageSize: 30 }).then((resp) => {
      if (resp.code == 200) {
        let datas = resp.data.list;
        for (let i = 0; i < datas.length; i++) {
          this.businesss.push(datas[i]);
        }
      }
    });
  },
  methods: {
    detailsClose() {
      this.images = {};
      this.srcList = [];
    },
    handleDetail(id) {
      this.listQuery.orderNumber = id;
      this.dialogDetailImg = true;
      getShopList(this.listQuery).then((res) => {
        let json = JSON.parse(res.data.list[0].orderDetails);
        if (json.orderInputPhoto != "") {
          this.images.orderInputPhoto = json.orderInputPhoto;
          this.srcList.push(json.orderInputPhoto);
        }
        if (json.orderOutputPhoto != "") {
          this.images.orderOutputPhoto = json.orderOutputPhoto;
          this.srcList.push(json.orderOutputPhoto);
        }
        if (json.orderExceptionPhoto != "") {
          this.orderExceptionPhoto = json.orderExceptionPhoto;
          this.srcList.push(json.orderExceptionPhoto);
        }
        this.listQuery.orderNumber = "";
      });
    },
    fetchData() {
      this.listLoading = true;
      getShopList(this.listQuery).then((response) => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.listLoading = false;
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
// .add-form{
//   height: 480px;
//   overflow-y: scroll;
//   overflow-x: hidden;
// }
.el-form-item__content span {
  color: #409eff;
}
.coverImages {
  padding: 20px;
}
.coverImages > .wrap {
  padding: 10px;
  display: inline-block;
}
.image-slot {
  text-align: center;
}
</style>