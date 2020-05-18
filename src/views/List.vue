<template>
    <div class="list-wrapper">
        <el-scrollbar style="height:100%">
			<ul>
				<li v-for="(item,index) in list" :key="index">
					<el-popover
						placement="bottom"
						title=""
						width="200"
						trigger="click"
						:visible-arrow="false"
					>
						<div class="msg-wrapper">
							<div class="img-wrapper">
								<img :src="`http://47.112.249.51:8199${item.Avatar}`">
							</div>
							<div class="sex-nickname-wrapper">
								<div class="sexsecrecy-wrapper" v-if="item.Sex === 2"></div>
								<div class="male-wrapper" v-else-if="item.Sex === 1"></div>
								<div class="female-wrapper" v-else></div>
								<div class="nickname-wrapper">{{item.Nickname || '昵称'}}</div>
							</div>
							<div class="signature-wrapper">{{item.Signature || '这人很懒，什么也没有写'}}</div>
						</div>

						<div slot="reference" class="item-wrapper">
							<img :src="`http://47.112.249.51:8199${item.Avatar}`" alt="头像">
							<div class="nickname-wrapper">{{item.Nickname}}</div>
							<div class="createtime-wrapper">{{item.CreatTime.split(" ")[0]}}</div>
						</div>
					</el-popover>
				</li>
			</ul>	
		</el-scrollbar>
    </div>
</template>

<script>
export default {
    name: "List",
    data() {
        return {
            path: "ws://47.112.249.51:8199/ws",
            socket: "",
			list: [],
			lock: true,
			index: 0
        };
    },
    mounted() {
        //页面创建时生命周期函数
        this.init();
    },
    destroyed() {
        //页面销毁时生命周期函数
        this.close();
    },
    methods: {
        init() {
            //实例化
            var _this = this;
            this.socket = new WebSocket(this.path);
            this.socket.onmessage = function(result) {
				var msg = JSON.parse(result.data);
				if(msg.type === 'list'){
					if(_this.lock){
						_this.lock = false;
						_this.getList(msg.data);
					}
				}
            };
        },
        getList(arr) {
			const _this = this;
            arr.forEach( (item) => {
                _this.axios
                    .get(`http://47.112.249.51:8199/user/profile/${item}`)
                    .then(res => {
						if(_this.index === 0){
							_this.list = []
						}
						const {
							status,
							data: { code, data: resData }
						} = res;
						if (status === 200 && code === 0) {
							_this.list.push(resData);

							_this.index += 1
							if(_this.index === arr.length){
								_this.index = 0
								_this.lock = true
							}
                        }	
                    });
            });
        },
        close() {
            this.socket.close();
        }
    }
};
</script>

<style lang="less">
.list-wrapper{
	@media screen and (max-width:1025px) {
		height:calc(100vh - 45px);
		width:100%;
		background:#fff;
	}
	ul {
		li {
			position: relative;
			width:100%;
			height:70px;
			padding:10px 0;
			border-bottom:1px solid #ccc;
			list-style: none;

			.item-wrapper{
				cursor:pointer;

				img{
					width:70px;
					height:70px;
					margin-left:10px;
					border-radius:50%;
				}

				.nickname-wrapper{
					position: absolute;
					top:30px;
					left:90px;
					font-size:30px;
					font-weight: 700;
				}

				.createtime-wrapper{
					position:absolute;
					bottom:10px;
					right:10px;
				}
			}
		}
	}
}

.el-popover{
	background:#4c4e5b;

	.popper__arrow{
		&::after{
			top: 1px;
			margin-left: -6px;
			border-top-width: 0;
			border-bottom-color: #4c4e5b;
		}
	}
	.msg-wrapper{
		text-align: center;
		color:#dae1eb;
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
			font-size:16px;
		}
	}
}

.el-scrollbar__wrap{
	overflow-x: hidden;
}
</style>