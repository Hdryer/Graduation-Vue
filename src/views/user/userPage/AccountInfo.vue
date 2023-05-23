<template>
    <el-card class="box-card">
        <template #header>
            <div class="card-header">
                <span>重置密码</span>
            </div>
        </template>
        <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-position="left" label-width="80px">
            <el-form-item label="新密码" prop="newPassword">
                <el-input type="password"  v-model="passwordForm.newPassword" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
                <el-input type="password" v-model="passwordForm.confirmPassword" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button type="primary" @click="changePassword">确认修改</el-button>
            <el-button @click="cancelDialog">取消</el-button>
        </div>
    </el-card>
</template>

<script>
    import { ref } from "vue";
    import {user} from '@/api/axios'

    export default {
        name: "ChangePasswordDialog",
        props: ["dialogVisible"],
        emits: ["update:dialogVisible"],
        data() {
            return {
                passwordForm: {
                    newPassword: "",
                    confirmPassword: "",
                },
                passwordRules: {
                    newPassword: [
                        { required: true, message: "请输入新密码", trigger: "blur" },
                        { min: 2, max: 20, message: "密码长度在2到20个字符之间", trigger: "blur" },
                    ],
                    confirmPassword: [
                        { required: true, message: "请再次输入密码", trigger: "blur" },
                        { validator: this.checkPasswordConfirmation, trigger: "blur" },
                    ],
                },
            };
        },
        methods: {
            changePassword() {
                this.$refs["passwordFormRef"].validate(valid => {
                    if (valid) {
                        //做修改密码的逻辑
                        user.updatePwd({id:this.$store.state.userInfoDTO.id,newPassword:this.passwordForm.newPassword,confirmPassword:this.passwordForm.confirmPassword}).then(res=>{
                            console.log(this.passwordForm.newPassword)
                            if(res.data.code===200){
                                console.log("修改密码为：" + this.passwordForm.newPassword);
                                this.cancelDialog();
                                ElMessage({
                                    message: '修改成功,重新登录吧',
                                    type: 'success',

                                })
                                this.$router.push({name:"login"})
                            }else {
                                ElMessage({
                                    message: '修改失败',
                                    type: 'error',
                                })
                            }
                        }).catch(error=>{
                            console.log(error)
                        })

                    }
                });
            },
            checkPasswordConfirmation(rule, value, callback) {
                if (value !== this.passwordForm.newPassword) {
                    callback(new Error("两次输入密码不一致"));
                } else {
                    callback();
                }
            },
            cancelDialog() {
                this.$refs["passwordFormRef"].resetFields();
                this.$emit("update:dialogVisible", false);
            },
        },
    };
</script>

<style>
    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .box-card {
        margin: 120px 15% 0 10%;
        width: 700px;
        height: 300px;
    }
</style>