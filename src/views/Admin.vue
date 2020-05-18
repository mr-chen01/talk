<template>
    <div class="admin-wrapper">
        <div class="img-wrapper">
            <img :src="`http://47.112.249.51:8199${avatar}`">
        </div>
        <div class="sex-nickname-wrapper">
            <div class="sexsecrecy-wrapper" v-if="sex === 2"></div>
            <div class="male-wrapper" v-else-if="sex === 1"></div>
            <div class="female-wrapper" v-else></div>
            <div class="nickname-wrapper">{{nickname || '昵称'}}</div>
        </div>
        <div class="signature-wrapper">{{signature || '这人很懒，什么也没有写'}}</div>
        <router-link to="/index/setmsg" class="set-wrapper"></router-link>
        <div class="exit-wrapper" @click="exit"></div>
    </div>
</template>

<script>
export default {
    name: 'Admin',
    data(){
        return {
            avatar:'',
            nickname: '',
            signature: '',
            sex: ''
        }
    },
    methods:{
        exit(){
            const that = this
            this.axios({
                method: 'get',
                url: 'http://47.112.249.51:8199/user/logout'
            }).then(res => {
                const { status, data: { code } } = res
                if(status === 200 && code === 0){
                    this.$confirm('是否要退出？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        that.$router.push({ path: "/" });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消'
                        });          
                    });
                }
            })
        }
    },
    mounted(){
        this.axios({
            method: 'get',
            url: 'http://47.112.249.51:8199/user/profile'
        }).then(res => {
            const { status, data: { code, data:resData } } = res
            if(status === 200 && code === 0){
                this.avatar = resData.Avatar
                this.nickname = resData.Nickname
                this.sex = resData.Sex
                this.signature = resData.Signature
            }
        })
    }
}
</script>

<style lang="less">
*{
    margin:0;
    padding:0;
}
    .admin-wrapper{
        position:relative;
        padding:20px;
        box-sizing: border-box;
        text-align: center;

        .img-wrapper{
            display: inline-block;
            width:30%;
            margin-bottom:5px;

            img{
                width:100%;
                height:100%;
                border-radius:50%;
            }
        }

        .sex-nickname-wrapper{
            position:relative;
            width:100%;
            height:16px;
            margin-bottom:10px;
            line-height:16px;
            text-align:center;

            .sexsecrecy-wrapper,.male-wrapper,.female-wrapper{
                display: inline-block;
                width:16px;
                height:16px;
            }

            .sexsecrecy-wrapper{
                background:url('../assets/sexsecrecy.png');
                background-repeat: no-repeat;
                background-size: cover;
            }

            .male-wrapper{
                background:url('../assets/male.png');
                background-repeat: no-repeat;
                background-size: cover;
            }

            .female-wrapper{
                background:url('../assets/female.png');
                background-repeat: no-repeat;
                background-size: cover;
            }

            .nickname-wrapper{
                display: inline-block;
                height:16px;
                margin-left:10px;
            }
        }

        .signature-wrapper{
            width:100%;
            text-align: center;
            font-size:20px;

        }

        .set-wrapper{
            position:absolute;
            bottom:10px;
            left:10px;
            width:20px;
            height:20px;
            background:url('../assets/set.png');
            background-repeat: no-repeat;
            background-size: cover;
        }

        .exit-wrapper{
            position:absolute;
            top:10px;
            left:10px;
            width:20px;
            height:20px;
            background:url('../assets/exit.png');
            background-repeat: no-repeat;
            background-size: cover;
            cursor:pointer;
        }
    }
</style>