<template>
    <div class="cropper-wrapper">
        <!-- element 上传图片按钮 -->
        <el-upload 
            class="upload-demo" 
            action="" 
            drag 
            :auto-upload="false" 
            :show-file-list="false" 
            :on-change='changeUpload'
        >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">点击上传</div>
        </el-upload>

        <!-- vueCropper 剪裁图片实现-->
        <el-dialog title="图片剪裁" class="setmsg-cropper-wrapper" :visible.sync="dialogVisible" append-to-body>
            <div class="cropper-content">
                <div class="cropper">
                    <vueCropper
                        ref="cropper"
                        :img="option.img"
                        :outputSize="option.size"
                        :outputType="option.outputType"
                        :info="true"
                        :full="option.full"
                        :canMove="option.canMove"
                        :canMoveBox="option.canMoveBox"
                        :original="option.original"
                        :autoCrop="option.autoCrop"
                        :fixed="option.fixed"
                        :fixedNumber="option.fixedNumber"
                        :centerBox="option.centerBox"
                        :infoTrue="option.infoTrue"
                        :fixedBox="option.fixedBox"
                    ></vueCropper>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="finish">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { VueCropper }  from 'vue-cropper'

export default {
    name: 'SetMsg',
    components: {
        VueCropper
    },
    data(){
        return {
            dialogVisible: false,
            // 裁剪组件的基础配置option
            option: {
                img: '', // 裁剪图片的地址
                info: true, // 裁剪框的大小信息
                outputSize: 1, // 裁剪生成图片的质量
                outputType: 'jpeg', // 裁剪生成图片的格式
                canScale: false, // 图片是否允许滚轮缩放
                autoCrop: true, // 是否默认生成截图框
                autoCropWidth: '100%', // 默认生成截图框宽度
                autoCropHeight: '100%', // 默认生成截图框高度
                fixedBox: false, // 固定截图框大小 不允许改变
                fixed: true, // 是否开启截图框宽高固定比例
                fixedNumber: [1, 1], // 截图框的宽高比例
                full: true, // 是否输出原图比例的截图
                canMoveBox: true, // 截图框能否拖动
                original: false, // 上传图片按照原始比例渲染
                centerBox: true, // 截图框是否被限制在图片里面
                infoTrue: false // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
            }
        }
    },
    methods:{
        // 把图片转化为base64
        getBase64(file) {
            return new Promise(function(resolve, reject) {
                let reader = new FileReader();
                let imgResult = "";
                reader.readAsDataURL(file);
                reader.onload = function() {
                imgResult = reader.result;
                };
                reader.onerror = function(error) {
                reject(error);
                };
                reader.onloadend = function() {
                resolve(imgResult);
                };
            });
        },
        changeUpload(file) {
            const that = this
            // 上传成功后将图片地址赋值给裁剪框显示图片
            this.$nextTick(() => {
                this.getBase64(file.raw).then(data => {
                    that.option.img = data
                    that.dialogVisible = true
                })
            })
        },
        finish(){
            const that = this
            this.$refs.cropper.getCropBlob((data) => {
                var formData = new FormData();
                formData.append('avatar', data, `${new Date().getTime()}.jpg`)
                this.axios({
                    method:'post',
                    url: 'http://47.112.249.51:8199/user/set-avatar',
                    data: formData,
                    headers:{
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(res => {
                    that.$emit('listenAvatarRes',res)
                    that.dialogVisible = false
                })
            })
        }
    }
}
</script>

<style lang='less'>
// 剪切图片弹出框
.setmsg-cropper-wrapper{
    .cropper{
        width:80%;
        height:300px;
        margin:0 auto;
    }
    @media screen and (max-width:1025px) {
        .el-dialog{
            width:80%;
        }
    }
}

// 上传图片框
.cropper-wrapper{
    width:100%;
    .upload-demo{
        width:100%;
        background:	#eee;
        .el-upload{
            width:100%;
            .el-upload-dragger{
                width:100%;
                background:	#eee;
                @media screen and (max-width:1025px) {
                    height:100px;
                }
                .el-icon-upload{
                    color:rgb(44, 33, 37);
                    @media screen and (max-width:1025px) {
                        margin-top:7px;
                    }
                }
            }
        }
    }
}
</style>