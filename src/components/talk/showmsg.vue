<template>
    <div class="showmsg-wrapper">
        <el-scrollbar style="height:100%" ref="myScrollbar">
            <ul>
                <li v-for="(item, index) in showContent" :key="index" :class="item.isOwner ?'me' : 'other'">
                    <img :src="item.avatar" width = "50px" height = "50px"/>
                    <ul>
                        <li class="nameStyle">{{item.sendName}}</li>
                        <li class="dataStyle"><p>{{item.data}}</p></li>
                    </ul>
                </li>
            </ul>
        </el-scrollbar>
    </div>
</template>

<script>
export default {
    name: 'ShowMsg',
    props:["showContent"],
    methods:{
        scrollDown() {
            this.$refs['myScrollbar'].wrap.scrollTop = this.$refs['myScrollbar'].wrap.scrollHeight
        }
    },
    updated(){
        this.scrollDown()
    }
}

</script>

<style lang="less">
// 使滚动条组件不显示横向的滚动条
.el-scrollbar__wrap{
	overflow-x: hidden;
}

.showmsg-wrapper{
    .me{
        float:right;
        width:100%;
        img{
            float:right;
            border-radius:50%;
        }
        ul{
            padding-right:10px;
            overflow:hidden;
            text-align:right;
        }
        li.dataStyle{
            display:inline-block;
            min-width:80px;
            max-width:50%;
            padding:10px;
            box-sizing: border-box;
            background-color:#66b1ff;
            p{
            display:inline;
            }
        }
    }
    .other{
        float:right;
        width:100%;
        img{
            float:left;
            border-radius: 50%;
        }
        ul{
            padding-left:10px;
            overflow:hidden;
            text-align:left;
        }
        li.dataStyle{
            display:inline;
            display:inline-block;
            min-width:80px;
            max-width:50%;
            padding:10px;
            box-sizing: border-box;
            background-color:white;
            p{
            display:inline;
            }
        }

    }
    .el-scrollbar{
        background:#dce0e6;
    }
    ul{
        margin:5px;
    }
    li{
        list-style:none;      
    }
    li.nameStyle{
        font-weight:250;
    }
    li.dataStyle{
        border:solid .1px #e4e7ed;
        border-radius:5px;
        word-wrap:break-word;
    }
}

</style>