<template>
  <div class="app-container">
    <div v-if="isTree">
      <el-tree
        :data="data"
        show-checkbox
        node-key="id"
        :default-expanded-keys="[1,2,3]"
        :default-checked-keys="checked_keys"
        @check-change="handleCheckChange"
      >
      </el-tree>
    </div>
  </div>
</template>

<script>
import { getAuthoritys, addAuthoritys, delAuthoritys } from "@/api/table";
import Pagination from "@/components/Pagination"; //
export default {
  data() {
    return {
      data: [
        {
          id: 1,
          label: "管理员权限",
          children: [
            {
              id: 11,
              label: "商家管理",
              name: "business",
              parent: "admin",
            },
            {
              id: 12,
              label: "快递公司管理",
              name: "companys",
              parent: "admin",
            },
            {
              id: 13,
              label: "用户管理",
              name: "costumers",
              parent: "admin",
            },
            {
              id: 14,
              label: "操作日志查询",
              name: "loggers",
              parent: "admin",
            },
            {
              id: 15,
              label: "出入库日志查询",
              name: "ioLoggers",
              parent: "admin",
            },
          ],
        },
        {
          id: 2,
          label: "商家权限",
          children: [
            {
              id: 21,
              label: "出入库操作",
              name: "ios",
              parent: "business",
            },
            {
              id: 22,
              label: "出入库日志查看",
              name: "ioLoggers",
              parent: "business",
            },
            {
              id: 23,
              label: "商家更新个人信息",
              name: "update",
              parent: "business",
            },
          ],
        },
        {
          id: 3,
          label: "用户权限",
          children: [
            {
              id: 31,
              label: "我要取件提醒",
              name: "getMyOrder",
              parent: "user",
            },
            {
              id: 32,
              label: "用户更新个人信息",
              name: "update",
              parent: "user",
            },
            {
                id: 33,
                label: "签收快递",
                name: "outputByUser",
                parent: "user"
            }
          ],
        },
      ],
      checked_keys: [],
      roles: {
        admin: {
          business: 11,
          companys: 12,
          costumers: 13,
          loggers: 14,
          ioLoggers: 15,
        },
        business: {
          ios: 21,
          ioLoggers: 22,
          update: 23,
        },
        user: {
          getMyOrder: 31,
          update: 32,
          outputByUser: 33
        },
      },
      isTree: false,
    };
  },
  created() {
    getAuthoritys().then((resp) => {
      for (let i = 0; i < resp.data.length; i++) {
        if (resp.code == 200) {
          let authoritys = resp.data[i].authoritys;
          if (resp.data[i].roleName == "admin") {
            // 遍历权限列表
            for (let y = 0; y < authoritys.length; y++) {
              this.checked_keys.push(this.roles.admin[authoritys[y]]);
            }
          } else if (resp.data[i].roleName == "business") {
            // 遍历权限列表
            for (let y = 0; y < authoritys.length; y++) {
              this.checked_keys.push(this.roles.business[authoritys[y]]);
            }
          } else if (resp.data[i].roleName == "user") {
            // 遍历权限列表
            for (let y = 0; y < authoritys.length; y++) {
              this.checked_keys.push(this.roles.user[authoritys[y]]);
            }
          }
        } else {
          this.$message.error(resp.message);
        }
      }
      this.isTree = true;
    });
  },
  methods: {
    handleCheckChange(data, checked, indeterminate) {
      if (data.id > 10) {
        let flag = 1;
        if (data.parent != "admin") {
          flag = data.parent == "business" ? 2 : 3;
        }
        let query = {
          roleId: flag,
          authority: data.name,
        };
        if (checked) {
          // 添加权限
          addAuthoritys(query).then((resp) => {
            if (resp.code == 200) {
              this.$message.success(resp.message);
            } else {
              this.$message.error(resp.message);
            }
          });
        } else {
          // 删除权限
          delAuthoritys(query).then((resp) => {
            if (resp.code == 200) {
              this.$message.success(resp.message);
            } else {
              this.$message.error(resp.message);
            }
          });
        }
      }
    },
  },
};
</script>


<style lang="scss" scoped>
.app-container {
  padding: 20px;
}
</style>