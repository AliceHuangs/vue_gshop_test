<template>
  <div class="loginContainer">
    <div class="loginInner">
      <div class="login_header">
        <h2 class="login_logo">硅谷外卖</h2>
        <div class="login_header_title">
          <a href="javascript:;" :class="{on:loginWay}" @click="loginWay=true" >短信登录</a>
          <a href="javascript:;" :class="{on:!loginWay}" @click="loginWay=false">密码登录</a>
        </div>
      </div>
      <div class="login_content">
        <form>
          <div :class="{on:loginWay}">
            <section class="login_message">
              <input type="tel" maxlength="11" placeholder="手机号" v-model="phone">
              <button  :disabled="computeTime>0"  class="get_verification"
                       :class="{right_phone: isRightPhone}" @click.prevent="sendCode">
                {{computeTime>0 ? `已发送(${computeTime}s)`: '获取验证码'}}
              </button>
            </section>
            <section class="login_verification">
              <input type="tel" maxlength="8" placeholder="验证码" v-model="code">
            </section>
            <section class="login_hint">
              温馨提示：未注册硅谷外卖帐号的手机号，登录时将自动注册，且代表已同意
              <a href="javascript:;">《用户服务协议》</a>
            </section>
          </div>
          <div :class="{on:!loginWay}">
            <section>
              <section class="login_message">
                <input type="tel" maxlength="11" placeholder="手机/邮箱/用户名" v-model="name">
              </section>
              <section class="login_verification">
                <input :type="isShowPwd?'text':'password'" maxlength="8" placeholder="密码" v-model="pwd">
                <div class="switch_button" @click="isShowPwd = !isShowPwd" :class="isShowPwd? 'on':'off' ">
                  <div class="switch_circle" :class="{right:isShowPwd}"></div>
                  <span class="switch_text">{{isShowPwd? 'abc':''}}</span>
                </div>
              </section>
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="验证码" v-model="captcha">
                <img class="get_verification" src="http://localhost:4000/captcha"
                     alt="captcha"  @click="updateCaptcha" ref="captcha">
              </section>
            </section>
          </div>
          <button class="login_submit" @click="login">登录</button>
        </form>
        <a href="javascript:;" class="about_us">关于我们</a>
      </div>
      <span href="javascript:" class="go_back" @click="$router.back()">
        <i class="iconfont icon-jiantou2"></i>
      </span>
    </div>
  </div>
</template>

<script>

  import {Toast,MessageBox} from 'mint-ui';

  import {reqSendCode, reqSmsLogin, reqPwdLogin} from '../../api';

  export default {
    data () {
     return {
       loginWay:true ,//短信登录，密码登录
       phone: '', // 手机号
       pwd: '', // 密码
       code:'',//短信验证码
       name:'',//用户名
       captcha:'',//图形验证码
       isShowPwd:false ,//是否显示密码
       computeTime:'',

      }

    },
    computed:{
      isRightPhone () {
        return /^1\d{10}$/.test(this.phone);
      }
    },
    methods:{

      showAlert (msg) {
        MessageBox.alert(msg,'提示');
      },

      //登录
     async login () {

        const {phone,code,name,captcha,pwd} = this;
        let result

        //1.前台表单验证（对输入的数据进行合法性的检查）
        if(this.loginWay){

          if(!this.isRightPhone){
            // MessageBox.alert('输入正确手机号','提示');
            this.showAlert ('输入正确手机号');
            return;
          }else if(!/^\d{6}$/.test(code)){
            // MessageBox.alert('输入正确验证码','提示');
            this.showAlert ('输入正确验证码');
            return;
          }

          //2.1发登录请求（短信登录）
          result = await reqSmsLogin(phone, code);

        }else {//密码登录
          if(!name){
            // MessageBox.alert('输入用户名','提示');
            this.showAlert ('输入用户名');
            return;
          }else if(!pwd){
            // MessageBox.alert('输入密码','提示');
            this.showAlert ('输入密码');
            return;
          }else if(!captcha){
            // MessageBox.alert('输入验证码','提示');
            this.showAlert ('输入验证码');
            return;
          }

          //2.2发登录请求（密码登录）
          result = await reqPwdLogin({name,pwd,captcha});


        }


        //2.发登录请求（2.1和2.2）

        //3.根据结果做不同响应
       if(result.code === 0){//成功响应

         const user = result.data;

         //将user保存到state中
         this.$store.dispatch('saveUser',user);

         //跳转路由到/profile
        this.$router.replace('/profile');


       }else{//失败响应
         this.showAlert(result.msg);
         //停止计时
         this.computeTime  = 0;
         //更新图形验证码(更新图形验证码必须要是密码登录)
         this.loginWay && this.updateCaptcha()



       }



      },


      //发送验证码
     async sendCode () {
        if(this.isRightPhone){
          //1.倒计时
          //指定总时间
          this.computeTime = 60;
          //启动循环定时器，每隔1s显示数字减少1
          const intervalId = setInterval(() => {
            this.computeTime--;
            //当计时时间为0时清除定时器
            if(this.computeTime<=0){
              this.computeTime = 0;
              clearInterval(intervalId);
            }

          },1000);
          //2.向后台发送ajax请求 ，发送获取验证码的请求
          const result = await reqSendCode(this.phone)
          if(result.code === 0){
            //显示一个自动消失的文本提示
            Toast('短信内容已发送');
          }else{

            // 停止计时
            this.computeTime = 0//前面判断的条件必须是小于等于
            //显示警告框
            MessageBox.alert(result.msg,'提示')
          }


        }
      },

      //获取更新和显示新的额图形验证码
      updateCaptcha () {
        //这个是一般的请求
        // event.target.src = 'http://localhost:4000/captcha';//若指定的新的src与原来旧的src一样，那么不会重新发送请求的，
        this.$refs.captcha.src = 'http://localhost:4000/captcha?time='+ Date.now();//参数本身对于后台来说不需要的，只是有了这个变化值，浏览器就会自动发送请求

      },

    }

  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixins.styl"
  .loginContainer
    width 100%
    height 100%
    background #fff
    .loginInner
      padding-top 60px
      width 80%
      margin 0 auto
      .login_header
        .login_logo
          font-size 40px
          font-weight bold
          color #02a774
          text-align center
        .login_header_title
          padding-top 40px
          text-align center
          >a
            color #333
            font-size 14px
            padding-bottom 4px
            &:first-child
              margin-right 40px
            &.on
              color #02a774
              font-weight 700
              border-bottom 2px solid #02a774
      .login_content
        >form
          >div
            display none
            &.on
              display block
            input
              width 100%
              height 100%
              padding-left 10px
              box-sizing border-box
              border 1px solid #ddd
              border-radius 4px
              outline 0
              font 400 14px Arial
              &:focus
                border 1px solid #02a774
            .login_message
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .get_verification
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                border 0
                color #ccc
                font-size 14px
                background transparent
                &.right_phone
                  color black
            .login_verification
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .switch_button
                font-size 12px
                border 1px solid #ddd
                border-radius 8px
                transition background-color .3s,border-color .3s
                padding 0 6px
                width 30px
                height 16px
                line-height 16px
                color #fff
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                &.off
                  background #fff
                  .switch_text
                    float right
                    color #ddd
                &.on
                  background #02a774
                >.switch_circle
                  //transform translateX(27px)
                  position absolute
                  top -1px
                  left -1px
                  width 16px
                  height 16px
                  border 1px solid #ddd
                  border-radius 50%
                  background #fff
                  box-shadow 0 2px 4px 0 rgba(0,0,0,.1)
                  transition transform .3s
                  &.right
                    transform translateX(27px)
            .login_hint
              margin-top 12px
              color #999
              font-size 14px
              line-height 20px
              >a
                color #02a774
          .login_submit
            display block
            width 100%
            height 42px
            margin-top 30px
            border-radius 4px
            background #4cd96f
            color #fff
            text-align center
            font-size 16px
            line-height 42px
            border 0
        .about_us
          display block
          font-size 12px
          margin-top 20px
          text-align center
          color #999
      .go_back
        position absolute
        top 5px
        left 5px
        width 30px
        height 30px
        >.iconfont
          font-size 20px
          color #999
</style>

