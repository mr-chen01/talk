<template>
    <div class="index-wrapper">
        <div class="left-wrapper">
            <Title class="left-title"/>
            <List class="left-list"/>
            <Admin class="left-admin"/>
        </div>
        <div class="right-wrapper">
            <router-view />
        </div>

        <van-tabs 
            v-model="active" 
            animated 
            class="tabs-wrapper" 
            background="#8facbd" 
            color="#d0505d"
            title-active-color="#f6faff"
            title-inactive-color="#ddeaf6"
        >
            <van-tab title="聊天">
                <Talk />
            </van-tab>
            <van-tab title="当前在线">
                <List />
            </van-tab>
            <van-tab title="修改信息">
                <SetMsg />
            </van-tab>
        </van-tabs>

    </div>
</template>

<script>
import Vue from 'vue';
import { Tab, Tabs } from 'vant';
import 'vant/lib/tabs/style';
import 'vant/lib/tab/style';
import Title from './Title'
import List from './List'
import Admin from './Admin'
import SetMsg from './SetMsg'
import Talk from './Talk'

Vue.use(Tab);
Vue.use(Tabs);

export default {
    name: 'Index',
    components:{
        Title,
        List,
        Admin,
        Talk,
        SetMsg
    },
    data(){
        return{
            active: 0
        }
    },
    mounted(){
        this.axios({
            method: 'get',
            url: 'http://47.112.249.51:8199/user/is-login'
        }).then(res => {
            const { status, data:{ code, data:login } } = res
            if(status === 200 && code === 0){
                if(login === false){
                    this.$router.push({ path: `/` });
                }
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

    .index-wrapper{
        width:80%;
        height:calc(100vh - 20px);
        margin:0 auto;
        box-sizing: border-box;

        .left-wrapper{
            float:left;
            width:28%;
            height:100%;
            margin-right:2%;

            .left-title{
                width:100%;
                height:calc(10vh);
            }

            .left-list{
                width:100%;
                height:calc(59vh);
                margin-bottom:calc(1vh);
                background:#fff;
            }

            .left-admin{
                width:100%;
                height:calc(30vh - 20px);
                background:	#fff;
            }
        }

        .right-wrapper{
            float:right;
            width:70%;
            height:100%;
        }

        .tabs-wrapper{
            display: none;
        }

       @media screen and (max-width:1025px) {
            width:100%;
            height:calc(100vh - 1px);

            .left-wrapper{
                display:none;
            }

            .right-wrapper{
                display:none;
            }

            .tabs-wrapper{
                display: block;
                height:100%;

                .van-hairline--top-bottom{
                    position:absolute;
                    bottom:0;
                    width:100%;
                }
            }
        }
    }
</style>