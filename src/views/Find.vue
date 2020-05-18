<template>
    <div class="find-wapper">
        <div class="box-wrapper">
            <div class="find-header-animation">
                <div class="find-img"></div>
                <div class="find-title">重置密码</div>
            </div>

            <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-width="80px"
                label-position="top"
                :status-icon="true"
                :hide-required-asterisk="true"
                class="demo-ruleForm form-wrapper"
            >

                <el-form-item label="" prop="username" class="form-item">
                    <el-input v-model="ruleForm.username" placeholder="请输入账号"></el-input>
                </el-form-item>

                <el-form-item label="" prop="password" class="form-item">
                    <el-input v-model="ruleForm.password" type="password" placeholder="请输入密码"></el-input>
                </el-form-item>

                <div class="form-bottom-animation">
                    <el-form-item label="" prop="againPassword" class="form-item">
                        <el-input v-model="ruleForm.againPassword" type="password" placeholder="请再次输入密码"></el-input>
                    </el-form-item>

                    <el-form-item label="" prop="code" class="form-item">
                        <el-input v-model="ruleForm.code" placeholder="请再次输入验证码"></el-input>
                        <el-button type="default" @click="getCode" class="code-button" v-if="time === '0'">获取</el-button>
                        <el-button type="default" disabled class="code-button" v-else>{{`还剩 ${time} 秒`}}</el-button>
                    </el-form-item>

                    <el-form-item prop="login">
                        <el-button type="default" @click="find" class="form-button" v-if="flag">提交</el-button>
                        <el-button type="default" disabled  class="form-button form-button-post" v-else>请求中</el-button>
                    </el-form-item>
                </div>
            </el-form>

            <div class="to-login-animation">
                返回登录？
                <router-link to="/" class="to-login">点这里返回！</router-link>
            </div>
        </div>
    </div>
</template>

<script scoped>
import cryp from "crypto-js";

export default {
    name: 'find',
    data() {
        // 两次密码是否一致的校验逻辑
        var checkPassword = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.ruleForm.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        }

        return {
            flag: true,
            time: '0',
            timer: null,
            ruleForm: {
                username: "",
                password: "",
                againPassword: "",
                code: ""
            },
            rules: {
                code: [
                    {
                        required: true,
                        type: "string",
                        message: "请输入验证码",
                        trigger: "blur"
                    }
                ],
                username: [
                    {
                        required: true,
                        type: "string",
                        message: "请输入用户名",
                        trigger: "blur"
                    },
                    { 
                        min: 6, 
                        max: 16,  
                        message: '用户名长度为 6 - 16 个字符'
                    }
                ],
                password: [
                    {
                        required: true,
                        message: "请输入密码",
                        trigger: "blur"
                    }
                ],
                againPassword: [
                    {
                        validator: checkPassword,
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    methods: {
        find() {
            // 验证输入是否通过
            const that = this
            this.flag = false
            this.$refs.ruleForm.validate( (res) => {
                if(!res){
                    // 不通过
                    this.$alert(`输入有错误`, {
                        confirmButtonText: "确定", 
                        callback: action => {
                            that.flag = true
                        }
                    });
                    return false
                }else{
                    // 通过
                    that.axios({
                        method: 'post',
                        url: 'http://47.112.249.51:8199/user/new-password',
                        params:{
                            passport: that.ruleForm.username,
                            password: cryp.MD5(that.ruleForm.password).toString(),
                            code: that.ruleForm.code
                        }
                    }).then(res => {
                        const { status, data:{ code, msg } } = res
                        if (status === 200 && code === 0) {
                            that.$router.push({ path: "/" }); // 成功则跳转到登录页面
                        } else {
                            this.$alert(`重置密码失败，${msg || '请联系负责人'}`, {
                                confirmButtonText: "确定",
                                callback: action => {
                                    that.$router.push({ path: "/find" });
                                }
                            });
                        }
                        that.flag = true
                    })
                    return true
                }
            })
        },
        getCode(){
            const that = this
            this.axios.get(`http://47.112.249.51:8199/user/send-mail?passport=${this.ruleForm.username}`)

            this.time = '60'
            this.timer = setInterval(function(){
                if(that.time === '0'){
                    clearInterval(that.timer)
                    return false
                }
                that.time = (parseInt(that.time)  - 1) + ''
            }, 1000)
        }
    },
    mounted() {
        let _this = this;
        document.onkeydown = function(e) {
            if (e.keyCode === 13) {
                _this.find();
            }
        };
    }
};
</script>

<style lang='less'>
*{
    margin:0;
    padding:0;
}

body,html {
    background: #282c34;
}

// 从下往上渐显
@keyframes topShow{
    form{
        transform: translateY(100%);
        opacity: 0;
    }

    to{
        transform: translateY(0%);
        opacity: 1;
    }
}

// 从上往下渐显
@keyframes bottomShow{
    form{
        transform: translateY(-100%);
        opacity: 0;
    }

    to{
        transform: translateY(0%);
        opacity: 1;
    }
}

.find-wapper {
    min-width:400px;
    width: 100%;
    height: calc(100vh);
    display: flex;
    justify-content: center;
    align-items: center;

    .box-wrapper {
        width: 30%;
        padding:20px;
        border-radius:10px;
        text-align:center;
        color:rgba(97, 218, 251, 0.5);
        @media screen and (max-width:1025px) {
            width: 80%;
        }

        .find-header-animation{
            transform: translateY(100%);
            opacity: 0;
            animation: topShow .3s ease-out 0s forwards;

            .find-img{
                display: inline-block;
                width:36px;
                height:36px;
                margin-bottom:15px;
                background:url('../assets/find.png');
                background-repeat: no-repeat;
                background-size:cover;
            }

            .find-title{
                font-size: 20px;
                font-weight: bolder;
                margin-bottom: 30px;
            }
        }

        .form-wrapper{
            padding: 0 40px;
            @media screen and (max-width:1025px) {
                padding: 0px;
            }

            .form-item{
                margin-bottom:30px;
            }  

            .eamil-animation{
                transform: translateY(100%);
                opacity: 0;
                animation: topShow .3s ease-out .1s forwards;
            }

            .form-bottom-animation{
                transform: translateY(-100%);
                opacity: 0;
                animation: bottomShow .3s ease-out 0s forwards;

                .form-button{
                    width:100%;
                    background:rgba(97, 218, 251, 0.5);
                    border:0px;
                    color:#fff;
                    &:hover{
                        color:rgba(97, 218, 251, 1);
                    }
                }

                .form-button-post{
                    color:#fff;
                    cursor:wait;
                }

                .code-button{
                    width:40%;
                    margin-top:5px;
                    float:left;
                    background:rgba(97, 218, 251, 0.5);
                    color:#fff;
                    &:hover{
                        color:rgba(97, 218, 251, 1);
                    }
                }
            }
        }

        .to-login-animation{
            transform: translateY(-100%);
            opacity: 0;
            animation: bottomShow .3s ease-out .1s forwards;
            @media screen and (max-width:1025px) {
                font-size:12px;   
            }

            .to-login{
                color:rgba(97, 218, 251, 0.5);
                font-size: 20px;
                &:hover{
                    cursor:pointer;
                    color:rgba(97, 218, 251, 1);
                }
                @media screen and (max-width:1025px) {
                    font-size:16px;
                }
            }
        }
    }
}
</style>