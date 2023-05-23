<template>
  <div class="login-container" >
    <Title/>
<!--    <h1 class="title">基于产学研的数据协同智慧课程教学系统</h1>-->
    <el-form :model="form" label-position="left" class="login-form">
      <el-form-item label="账号">
        <el-input v-model="form.account" placeholder="手机号/邮箱" prefix-icon="el-icon-user" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="form.password" placeholder="密码" prefix-icon="el-icon-lock" clearable></el-input>
      </el-form-item>
      <el-button type="primary" class="login-button" @click="submit">登录</el-button>
<!--        <span @click="toregister"><h5 class="register"></h5></span>-->
      <br/>
      <router-link to="/register">没有账号？点击注册</router-link>
      <router-view/>
    </el-form>

  </div>
</template>

<script>
import {user} from '@/api/axios'
import Title from "@/components/Title";

export default {
  name:"login",
  components: {Title},
  data(){
      return{
        form:{
            account:'',
            password:''
          },
        }
      },
    methods:{
      async submit(){
        try {
          console.log(this.form)
          const {account,password} = this.form
          const res = await user.login({account:account.trim(),password: password})
          if (res.data.code===200){
            //登录成功，则把token存入进本地
             this.$store.commit('setToken',res.data.data.token)
             this.$store.commit('setUserDTO',res.data.data.userInfoDTO)
            if (res.data.data.userInfoDTO.type==3 || res.data.data.userInfoDTO.type==2){
              this.$router.push({name:"admin_main"})
            }else {
              this.$router.push({name:"main"});
            }
              ElMessage({
                message: '登录成功',
                type: 'success',
              })
          }
        }catch(error){
          if(error.data.code===1000){
            ElMessage.error(error.data.message)
          }
        }
      },
    }
  };
</script>

<style scoped>
  .login-container {
    position: relative;
    height: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .register{
    margin: 5px;

  }
  .register:hover{
    text-decoration: underline;
    color: red;
  }

  .background {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.5;
  }

  .title {
    font-size: 36px;
    font-weight: bold;
    margin-bottom: 100px;
    text-align: center;
  }

  .login-form {
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    padding: 20px 40px;
    border-radius: 4px;
  }

  .login-form .el-form-item {
    margin-bottom: 20px;
  }

  .login-form .el-input {
    width: 300px;
    height: 50px;
  }

  .login-form .el-form-item__label {
    color: #666;
    font-size: 16px;
  }

  .login-button {
    width: 60%;
    height: 50px;
    font-size: 18px;
  }
</style>
