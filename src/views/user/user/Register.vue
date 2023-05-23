<template>
    <div class="register-form-container">
        <el-card class="register-form-card" shadow="hover">
            <el-form ref="registerForm" :model="formData" :rules="rules" label-width="90px" class="register-form">
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model.trim="formData.phone"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model.trim="formData.email">
                        <template #append>
                            <el-button :disabled="!isEmailValid || isEmailSending || isEmpty" type="primary" @click.prevent="sendEmailCode">{{ emailBtnText }}</el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model.trim="formData.password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input type="password" v-model.trim="formData.confirmPassword"></el-input>
                </el-form-item>
                <el-form-item label="验证码" prop="code">
                    <el-input v-model.trim="formData.code"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm">提交</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    import { ref, computed } from "vue";
    import { ElForm, ElFormItem, ElInput, ElButton, ElCard } from "element-plus";
    import Title from "@/components/Title";
    import {user} from '@/api/axios'

    export default {
        components: {
            Title,
            ElForm,
            ElFormItem,
            ElInput,
            ElButton,
            ElCard,
        },
        data() {
            return {
                formData: {
                    phone: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    code: "",
                },
                rules: {
                    phone: [
                        { required: true, message: "请输入手机号" },
                        { pattern: /^1[3456789]\d{9}$/, message: "手机号格式不正确" },
                    ],
                    email: [
                        { required: true, message: "请输入邮箱地址" },
                        { type: "email", message: "邮箱格式不正确" },
                    ],
                    password: [{ required: true, message: "请输入密码" }],
                    confirmPassword: [
                        { required: true, message: "请再次输入密码" },
                        {
                            validator: (rule, value, callback) => {
                                if (value !== this.formData.password) {
                                    callback(new Error("两次输入的密码不一致"));
                                } else {
                                    callback();
                                }
                            },
                            trigger: "blur",
                        },
                    ],
                    code: [{ required: true, message: "请输入验证码" }],
                },
                emailBtnText: "获取验证码",
                isEmailSending: false,
                emailCooldown: 60,
                emailTimerId: null,
            };
        },
        computed: {
            isEmailValid() {
                return this.rules.email.every((rule) =>   !rule.trigger || !rule.required || !rule.validator || rule.validator(this.rules.email[0], this.formData.email)  === true);
            },
            isEmpty(){
                return this.formData.email === ""
            }
        },
        methods: {
            userDtoData(){
                const {phone, email, password, confirmPassword, code }=this.formData
                const userDTO = {
                    phone:phone,
                    email:email,
                    emailCode:code,
                    password:password,
                    secondPassword:confirmPassword
                }
                return userDTO
            },

            sendEmailCode() {
                console.log("...",this.formData.email === "")
                    if (this.isEmailValid && !this.isEmailSending) {
                        // 发送验证码的代码
                        this.isEmailSending = true;
                        this.emailBtnText = "发送中";
                        this.emailTimerId = setInterval(() => {
                            this.emailCooldown--;
                            if (this.emailCooldown === 0) {
                                clearInterval(this.emailTimerId);
                                this.emailBtnText = "重新获取";
                                this.emailCooldown = 60;
                                this.isEmailSending = false;
                            } else {
                                this.emailBtnText = `${this.emailCooldown}s`;
                            }
                        }, 1000);
                        console.log(this.formData.email.trim());
                        user.getEmailCode({email:this.formData.email.trim()}).then(res=>{
                            console.log(res.data)
                        }).catch(error=>{
                            console.log(error)
                        })
                    }
            },
             submitForm() {
                this.$refs.registerForm.validate((valid) => {
                    if (valid) {
                        // 提交表单的代码
                            const userDTO = this.userDtoData()
                            user.register(userDTO).then(res=>{
                                if (res.data.code===200){
                                    ElMessage({
                                        message: '注册成功,请登录吧',
                                        type: 'success',
                                    })
                                    this.$router.push({name:"login"});
                                }
                            }).catch(error=>{
                                console.log(error)
                                if(error.data.code===1000){
                                    ElMessage.error(error.data.message)
                                }
                            })
                    } else {
                        return false;
                    }
                });
            },
        },
    };
</script>

<style>
    .register-form-container {
        margin-top: 150px;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .register-form-card {
        width: 400px;
        padding: 30px;
    }
</style>
