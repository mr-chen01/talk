<template>
  <div class="talk-wrapper">
	  <ShowMsg :showContent="showContent" class="talk-showmsg" />
	  <SendMsg :socket="socket" :username="username" class="talk-sengmsg"/>
  </div>
</template>

<script>
import SendMsg from '../components/talk/sendmsg'
import ShowMsg from '../components/talk/showmsg'

export default {
  name: "Talk",
  components:{
	SendMsg,
	ShowMsg
  },
  data() {
    return {
      path: "ws://47.112.249.51:8199/ws",
	  socket: "",
      myContent: "",
      showContent: [],
      username:""  //判断是否本人发出的依据
    };
  },
  mounted() {
    //页面创建时生命周期函数
    this.init();
    this.getUsername();
  },
  destroyed() {
    //页面销毁时生命周期函数
    this.close();
  },
  methods: {
    init() {
	  //实例化
	  const _this = this;
	  this.socket = new WebSocket(this.path);
	  this.socket.onmessage = function(result) {
		var msg = JSON.parse(result.data);

        if (msg.type === "send") {
			_this.axios({
				method: 'get',
				url: `http://47.112.249.51:8199/user/profile/${msg.name}`
			}).then(res => {
        const { status, data: { code, data:resData } } = res
				if(status === 200 && code === 0){
					_this.showContent.push({
						data: msg.data,
						isOwner: (msg.name === _this.username),
						sendName: resData.Nickname,
            avatar: `http://47.112.249.51:8199${resData.Avatar}`,
            sex: resData.Sex,
            signature: resData.Signature
					});
				}
			})
        }
      };
    },
    //拿到本人用户名，用于辨认消息是否本人发出，改变左右样式
    getUsername(){
        const that = this
         this.axios({
            method: 'get',
            url: 'http://47.112.249.51:8199/user/profile'
        }).then(res => {
            const { status, data: { code, data:resData } } = res
            if(status === 200 && code === 0){
                that.username = resData.Passport;
            }
        })
    },
    close() {
      this.socket.close();
    }
  }
};
</script>

<style lang="less" >
.talk-wrapper{
	width:100%;
  height:100%;
  
  @media screen and (max-width:1025px) {
		height:calc(100vh - 45px);
		width:100%;
		background:#fff;
	}

	.talk-showmsg{
		width:100%;
		height: 70%;
		border-bottom: 3px solid #999;
		box-sizing: border-box;
		background:#fff;
	}

	.talk-sengmsg{
		width:100%;
		height:30%;
		background:#fff;
	}
}
</style>