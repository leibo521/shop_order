<template>
  <div class="login-container">
    <el-form
      v-if="loginType"
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">登陆</h3>
      </div>

      <el-form-item prop="userPhone">
        <i style="color:#fff" class="el-icon-phone"></i>
        <el-input
          ref="userPhone"
          v-model="loginForm.userPhone"
          placeholder="userPhone"
          name="userPhone"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="userPassword">
               <i style="color:#fff" class="el-icon-edit-outline"></i>

        <el-input
          v-model="loginForm.userPassword"
          type="password"
          placeholder="userPassword"
          name="userPassword"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="margin-bottom: 30px; float: right"
        @click.native.prevent="handleLogin"
        >登陆</el-button
      >
      <el-button
       
        type="primary"
        style="margin-bottom: 30px"
        @click.native.prevent="handlRegister"
        >注册</el-button
      >
    </el-form>
    <el-form
      v-else
      ref="registerForm"
      :model="registerForm"
      :rules="rules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">注册</h3>
      </div>
      <el-form-item label="用户名" prop="cName">
        <el-input v-model="registerForm.cName"></el-input>
      </el-form-item>
      <el-form-item label="用户手机" prop="cPhone">
        <el-input v-model="registerForm.cPhone"></el-input>
      </el-form-item>
      <el-form-item label="用户密码" prop="cPassword">
        <el-input type="password" v-model="registerForm.cPassword"></el-input>
      </el-form-item>
      <el-form-item label="网点地址" v-show="registerForm.registerType=='business'" prop="cAddress">
        <el-input v-model="registerForm.cAddress"></el-input>
      </el-form-item>
      <el-form-item label="注册类型">
        <el-radio-group v-model="registerForm.registerType">
          <el-radio value="business" label="business">网点</el-radio>
          <el-radio value="user" label="user">用户</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-button
        :loading="loading"
        type="primary"
        style="margin-bottom: 30px; float: right"
        @click.native.prevent="handlRegister2"
        >注册</el-button
      >
      <el-button
        
        type="primary"
        style="margin-bottom: 30px"
        @click.native.prevent="handleLogin2"
        >登陆</el-button
      >
    </el-form>
  </div>
</template>

<script>
import { validuserPhone } from "@/utils/validate";
import { login, register } from "@/api/user";
export default {
  name: "Login",
  data() {
    const validateuserPhone = (rule, value, callback) => {
      if (!validuserPhone(value)) {
        callback(new Error("Please enter the correct user name"));
      } else {
        callback();
      }
    };
    const validateuserPassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("The userPassword can not be less than 6 digits"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        userPhone: "admin",
        userPassword: "159263",
        userType: '',
      },
      loginRules: {
        userPhone: [
          { required: true, trigger: "blur", message: "请输入用户名" },
        ],
        userPassword: [
          { required: true, trigger: "blur", message: "请输入密码" },
        ],
      },
      rules: {
        cName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        cPhone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        cPassword: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 3, max: 16, message: "长度在 3 到 16 个字符", trigger: "blur" },
        ],
        cAddress: [
          { required: true, message: "商家地址不能为空", trigger: "blur" },
          { min: 3, max: 50, message: "长度在 5 到 50 个字符", trigger: "blur" },
        ],
      },
      loading: false,
      loginType: true,
      registerForm: {
        cPassword: "",
        cPhone: "",
        registerType: "business",
        cAddress: "",
        cName: "",
      },
      userPasswordType: "userPassword",
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  methods: {
    showuserPassword() {
      if (this.userPasswordType === "userPassword") {
        this.userPasswordType = "";
      } else {
        this.userPasswordType = "userPassword";
      }
      this.$nextTick(() => {
        this.$refs.userPassword.focus();
      });
    },
    handlRegister() {
      this.loginType = false;
      this.$refs.registerForm.resetFields();
      this.$refs.loginForm.resetFields();
    },
    handleLogin2() {
      this.loginType = true;
      this.$refs.registerForm.resetFields();
      this.$refs.loginForm.resetFields();
    },
    handlRegister2() {
      this.loginForm.userType=this.registerForm.registerType;
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          register(this.registerForm)
            .then((res) => {
              if (res.code == "200") {
                this.$message.success("注册成功");
                this.loading = false;
              } else {
                this.$message.error(res.message);
                this.loading = false;
              }
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleLogin() {
      this.loginType = true;
      if( this.loginForm.userPhone=='admin'){
         this.loginForm.userType='admin'
      }
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          sessionStorage.setItem("username", this.loginForm.userPhone);
          login(this.loginForm)
            .then((res) => {
              if (res.code == 200) {
                sessionStorage.setItem("token", res.data.access_token);
                this.$router.push({ path: "/institutions" });
                this.loading = false;
              }
            })
            .catch(() => {
              this.loading = false;
            });
          // this.$store.dispatch('user/login', this.loginForm).then(() => {
          //   this.$router.push({ path: this.redirect || '/' })
          //   this.loading = false
          // }).catch(() => {
          //   this.loading = false
          // })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}
.el-form-item {
  padding-left: 10px;
}
.el-form-item__label {
  color: #fff;
}
/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-userPassword {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
