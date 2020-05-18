<template>
    <div class="title-wrapper">
        <div class="text">简单聊天室</div>
    </div>
</template>

<script>
export default {
    name: 'Title'    
}
</script>

<style lang="less">
    .title-wrapper{
        position:relative;
        background:#8facbd;

        .text{
            position:absolute;
            left:50%;
            top:50%;
            transform: translate(-50%, -50%);
            font-size:30px;
            font-family: 'FangSong';
            color:#f6faff;
        }
    }
</style>