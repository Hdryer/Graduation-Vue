<template>
    <div class="personal-info-container">
        <div class="personal-info-wrapper" :class="{ 'editable': isEditable }">
            <div class="personal-info-header">基本信息</div>
            <div class="personal-info-content">
                <div class="personal-info-item">
                    <div class="personal-info-label">用户昵称:</div>
                    <div class="personal-info-value">{{ userInfos.nickname }}</div>
                    <el-input
                            v-if="isEditable"
                            v-model.trim="userInfos.nickname"
                            placeholder="请输入用户昵称"
                            class="edit-input"
                    ></el-input>
                </div>
                <div class="personal-info-item">
                    <div class="personal-info-label">用户ID:</div>
                    <div class="personal-info-value">{{ userInfos.userId }}</div>
                    <p v-if="isEditable">{{userInfos.userId}}</p>
                </div>
                <div class="personal-info-item">
                    <div class="personal-info-label">手机/邮箱:</div>
                    <div class="personal-info-value">{{ userInfos.phone }}/{{userInfos.email}}</div>
                    <p v-if="isEditable">{{ userInfos.phone }}/{{userInfos.email}}</p>
                </div>
                <div class="personal-info-item">
                    <div class="personal-info-label">性别:</div>
                    <div class="personal-info-value">{{ userInfos.gender}}</div>
                    <el-radio-group v-if="isEditable" v-model="userInfos.gender"  class="edit-radio-group">
                        <el-radio  label= "男">男</el-radio>
                        <el-radio  label= "女">女</el-radio>
                    </el-radio-group>
                </div>
                <div class="personal-info-item">
                    <div class="personal-info-label">个人简介:</div>
                    <div class="personal-info-value">{{ userInfos.introduction }}</div>
                    <el-input
                            type="textarea"
                            v-if="isEditable"
                            v-model.trim="userInfos.introduction"
                            placeholder="请输入个人简介"
                            class="edit-input"
                    ></el-input>
                </div>
            </div>
            <div class="personal-info-footer" v-if="isEditable">
                <el-button type="primary" size="small" @click="handleSave">确认修改</el-button>
                <el-button size="small" @click="handleCancel">取消修改</el-button>
            </div>
            <div class="personal-info-footer" v-else>
                <el-button type="primary" size="small" @click="handleEdit">修改</el-button>
            </div>
        </div>
        <div class="personal-info-wrapper" :class="{ 'editable': isEditable }">
            <div class="personal-info-header">教育信息</div>
            <div class="personal-info-content">
                <div class="personal-info-item">
                    <div class="personal-info-label">学校:</div>
                    <div class="personal-info-value">{{ educationInfo.university }}</div>
                    <el-input
                            v-if="isEditable"
                            v-model.trim="educationInfo.university"
                            placeholder="请输入学校"
                            class="edit-input"
                    ></el-input>
                </div>
                <div class="personal-info-item">
                    <div class="personal-info-label">学历:</div>
                    <div class="personal-info-value">{{ educationInfo.education }}</div>
                    <el-select v-if="isEditable" v-model="educationInfo.education" class="edit-input">
                        <el-option label="高中" value="高中"></el-option>
                        <el-option label="本科" value="本科"></el-option>
                        <el-option label="硕士" value="硕士"></el-option>
                        <el-option label="博士" value="博士"></el-option>
                    </el-select>
                </div>
                <div class="personal-info-item">
                    <div class="personal-info-label">专业:</div>
                    <div class="personal-info-value">{{ educationInfo.major }}</div>
                    <el-input
                            v-if="isEditable"
                            v-model.trim="educationInfo.major"
                            placeholder="请输入专业"
                            class="edit-input"
                    ></el-input>
                </div>
            </div>
        </div>
        <div class="personal-info-wrapper" :class="{ 'editable': isEditable }">
            <div class="personal-info-header">工作信息</div>
            <div class="personal-info-content">
                <div class="personal-info-item">
                    <div class="personal-info-label">公司:</div>
                    <div class="personal-info-value">{{ workInfo.company }}</div>
                    <el-input
                            v-if="isEditable"
                            v-model.trim="workInfo.company"
                            placeholder="请输入公司名称"
                            class="edit-input"
                    ></el-input>
                </div>
                <div class="personal-info-item">
                    <div class="personal-info-label">所属行业:</div>
                    <div class="personal-info-value">{{ workInfo.industry }}</div>
                    <el-input
                            v-if="isEditable"
                            v-model.trim="workInfo.industry"
                            placeholder="请输入所属行业"
                            class="edit-input"
                    ></el-input>
                </div>
                <div class="personal-info-item">
                    <div class="personal-info-label">职位:</div>
                    <div class="personal-info-value">{{ workInfo.position }}</div>
                    <el-input
                            v-if="isEditable"
                            v-model.trim="workInfo.position"
                            placeholder="请输入职位"
                            class="edit-input"
                    ></el-input>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { defineComponent } from 'vue';
    import { ElInput, ElButton, ElRadioGroup, ElRadio, ElSelect, ElOption, ElDatePicker } from 'element-plus';
    import UserPage from "@/views/user/userPage/UserPage";
    import {user} from '@/api/axios'

    export default defineComponent({
        name: 'PersonalInfo',
        data() {
            return {
                isEditable: false,
                userInfos: {
                    nickname: '',
                    userId: '',
                    phone:"",
                    email:"",
                    gender: "",
                    introduction: '',
                },
                educationInfo: {
                    university:'',
                    education: '',
                    major: ''
                },
                workInfo: {
                    company: '',
                    industry:"",
                    position: ''
                }
            };
        },
        components: {UserPage, ElInput, ElButton, ElRadioGroup, ElRadio, ElSelect, ElOption, ElDatePicker },
        methods: {
            userUpdateData(){
                const {nickname, userId, phone, email, gender, introduction,} = this.userInfos
                const {university, education, major} = this.educationInfo
                const {company, industry, position} = this.workInfo

                const updateDTO = {
                    id:userId,
                    userName:nickname,
                    sex:gender,
                    description:introduction,
                    university: university,
                    education: education,
                    major: major,
                    company: company,
                    industry: industry,
                    position: position
                }
                return updateDTO;
            },
            handleEdit() {
                this.isEditable = !this.isEditable;
            },
            handleSave() {
                const userDTO = this.userUpdateData();
                user.updateUserInfo(userDTO).then(res=>{
                    if (res.data.code===200){
                        ElMessage({
                            message: '修改成功',
                            type: 'success',
                        })
                        this.isEditable = false;
                    }else {
                        ElMessage({
                            message: '修改失败',
                            type: 'error',
                        })
                    }
                }).catch(error=>{
                    console.log(error)
                })
            },
            handleCancel() {
                this.isEditable = false;
            }
        },
        beforeMount() {
            user.getUserInfo({id:this.$store.state.userInfoDTO.id}).then(res=>{
                console.log(res.data.data)
                const userEntity= res.data.data
                this.userInfos.nickname=userEntity.userName
                this.userInfos.userId=userEntity.id
                this.userInfos.phone=userEntity.phone
                this.userInfos.email=userEntity.email
                this.userInfos.gender=userEntity.sex
                this.userInfos.introduction=userEntity.description
                this.educationInfo.university = userEntity.university
                this.educationInfo.education = userEntity.education
                this.educationInfo.major = userEntity.major
                this.workInfo.company = userEntity.company
                this.workInfo.industry = userEntity.industry
                this.workInfo.position = userEntity.position
            }).catch(error=>{
                console.log(error)
            })
        }
    });
</script>

<style scoped>
    .personal-info-container {
        margin: 120px 15% 0 10%;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
    .personal-info-wrapper {
        padding: 20px;
        border-bottom: 1px solid #eee;
        transition: all 0.5s ease-in-out;
    }
    .personal-info-header {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
    }
    .personal-info-content {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .personal-info-item {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .personal-info-label {
        width: 80px;
        font-weight: bold;
    }
    .personal-info-value {
        flex: 1;
    }
    .editable .personal-info-value {
        display: none;
    }
    .edit-input {
        width: 60%;
    }
    .edit-radio-group {
        display: flex;
    }
    .personal-info-footer {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
    }
</style>
