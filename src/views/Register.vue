<template>
    <div class="register-wapper">
        <div class="box-wrapper">
            <div class="register-header-animation">
                <div class="register-img"></div>
                <div class="register-title">注册</div>
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
                <div class="eamil-animation">
                    <el-form-item label="" prop="email" class="form-item">
                        <el-input v-model="ruleForm.email" placeholder="请输入邮箱"></el-input>
                    </el-form-item>
                </div>

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

                    <el-form-item prop="login">
                        <el-button type="default" @click="login" class="form-button" v-if="flag">注册</el-button>
                        <el-button type="default" class="form-button form-button-post" v-else>请求中</el-button>
                    </el-form-item>
                </div>
            </el-form>

            <div class="to-login-animation">
                已经账号？
                <router-link to="/" class="to-login">点这里去登录吧！</router-link>
            </div>
        </div>
    </div>
</template>

<script scoped>
import cryp from "crypto-js";

export default {
    name: 'Register',
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
            ruleForm: {
                email: "",
                username: "",
                password: "",
                againPassword: ""
            },
            rules: {
                email: [
                    {
                        required: true,
                        type: "string",
                        message: "请输入邮箱",
                        trigger: "blur"
                    },
                    {
                        pattern: /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,  //邮箱正则
                        message: '请输入正确的邮箱'
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
        async login() {
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
                        url: 'http://47.112.249.51:8199/user/register',
                        params:{
                            email: that.ruleForm.email,
                            passport: that.ruleForm.username,
                            password: cryp.MD5(that.ruleForm.password).toString()
                        }
                    }).then(res => {
                        const { status, data:{ code, msg } } = res
                        if (status === 200 && code === 0) {
                            that.$router.push({ path: "/" }); // 成功则跳转到登录页面
                        } else {
                            this.$alert(`注册失败，${msg || '请联系负责人'}`, {
                                confirmButtonText: "确定",
                                callback: action => {
                                    that.$router.push({ path: "/register" });
                                }
                            });
                        }
                        that.flag = true
                    })
                    return true
                }
            })
        }
    },
    mounted() {
        let _this = this;
        document.onkeydown = function(e) {
            if (e.keyCode === 13) {
                _this.login();
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

.register-wapper {
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

        .register-header-animation{
            transform: translateY(100%);
            opacity: 0;
            animation: topShow .3s ease-out 0s forwards;

            .register-img{
                display: inline-block;
                width:36px;
                height:36px;
                margin-bottom:15px;
                background:url('../assets/register.png');
                background-repeat: no-repeat;
                background-size:cover;
            }

            .register-title{
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

                // 这里改默认字体颜色
                .el-input__inner{
                    &::placeholder{
                        
                    }
                }
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