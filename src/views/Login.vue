<template>
    <div class="login-wapper">
        <div class="box-wrapper">
            <div class="header-animation">
                <div class="login-img"></div>
                <div class="login-title">登录</div>
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
                    <el-form-item prop="login">
                        <el-button type="default" @click="login" class="form-button" v-if="flag">登录</el-button>
                        <el-button type="default" class="form-button form-button-post" v-else>请求中</el-button>
                    </el-form-item>
                </div>
            </el-form>

            <div class="to-register-animation">
                还没有账号？
                <router-link to="/register" class="to-register">点这里注册！</router-link>
            </div>
            <div class="to-register-animation">
                忘记密码？
                <router-link to="/find" class="to-register">点这里重设密码吧！</router-link>
            </div>
        </div>
    </div>
</template>

<script scoped>
import cryp from "crypto-js";

export default {
    name: 'Login',
    data() {
        return {
            flag: true,
            ruleForm: {
                username: "",
                password: ""
            },
            rules: {
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
                        url: 'http://47.112.249.51:8199/user/login',
                        params:{
                            passport: that.ruleForm.username,
                            password: cryp.MD5(that.ruleForm.password).toString()
                        }
                    }).then(res => {
                        const { status, data:{ code, msg } } = res
                        if (status === 200 && code === 0) {
                            that.$router.push({ path: `/index` }); // 成功则跳转到聊天室
                        } else {
                            this.$alert(`登录失败，${msg || '请联系负责人'}`, {
                                confirmButtonText: "确定",
                                callback: action => {
                                    that.ruleForm.username = ''
                                    that.ruleForm.password = ''
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
        transform: translateY(100%)
    }

    to{
        transform: translateY(0%);
    }
}

// 从上往下渐显
@keyframes bottomShow{
    form{
        transform: translateY(-100%)
    }

    to{
        transform: translateY(0%);
    }
}

.login-wapper {
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

        .header-animation{
            transform: translateY(-100%);
            animation: bottomShow .8s ease-out 0s forwards;

            .login-img{
                display: inline-block;
                width:36px;
                height:36px;
                margin-bottom:15px;
                background:url('../assets/login.png');
                background-repeat: no-repeat;
                background-size:cover;
            }

            .login-title{
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

            .form-bottom-animation{
                transform: translateY(100%);
                animation: topShow .8s ease-out 0s forwards;

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

        .to-register-animation{
            transform: translateY(100%);
            animation: topShow .8s ease-out 0s forwards;
            @media screen and (max-width:1025px) {
                font-size:12px;   
            }

            .to-register{
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