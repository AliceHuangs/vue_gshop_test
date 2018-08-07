<template>
  <div>
    <div class="shopcart">
      <div class="content">
        <!--4.8.2  @click="toggleShow"点击遮罩，可以切换列表的显示和隐藏-->
        <div class="content-left" @click="toggleShow">
          <div class="logo-wrapper">
            <!--3.15 ShopCart.vue显示数据3.15-->
            <div class="logo" :class="{highlight: cartFoodCount}">
              <i class="iconfont icon-shopping_cart" :class="{highlight: cartFoodCount}"></i>
            </div>
            <div class="num" v-show="cartFoodCount">{{cartFoodCount}}</div>
          </div>
          <div class="price" :class="{highlight: cartFoodPrice}">￥{{cartFoodPrice}}</div>
          <div class="desc">另需配送费￥{{info.deliveryPrice}}元</div>
        </div>
        <div class="content-right">
          <!--4.3 尽量让模板表达式写的简单一点，因此弄成计算属性或方法表简单一些。<div class="pay no-enough"> no-enough由 minPrice - cartFoodPrice计算结果来决定，因此需要使用计算属性4.4-->
          <div class="pay" :class="payClass">
            <!--4.1 payText函数名，用来显示对应文本的函数,定义在计算属性中去4.2 -->
            {{payText}}
          </div>
        </div>
      </div>

      <!--4.5  v-show="listShow"显示或隐藏  //4.9v-show="listShow"那么购物车是否关闭应该取决于加入购物车的商品的个数cartFoodCount以及显示或隐藏isShow -->
      <!--<div class="shopcart-list" v-show="isShow">-->
      <div class="shopcart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty">清空</span>
        </div>
        <div class="list-content" ref="list">
          <ul>
            <!--4.7 遍历要显示的列表-->
            <li class="food" v-for="(food, index) in cartFoods" :key="index">
              <span class="name">{{food.name}}</span>
              <div class="price"><span>￥{{food.price}}</span></div>
              <div class="cartcontrol-wrapper">
                <!--4.7.4 使用组件-->
                <CartControl :food="food"/>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!--4.8  @click="toggleShow"点击遮罩，可以切换列表的显示和隐藏  //4.9v-show="listShow"-->
    <div class="list-mask" v-show="listShow" @click="toggleShow"></div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'//5.1滑动
  import {mapState, mapGetters} from 'vuex'//3.1 mapState  //3.5  mapGetters

  import CartControl from '../CartControl/CartControl.vue'//4.7.2引入组件

  export default {
    data () {
      return {
        isShow: false  // 4.6 是否显示购物项列表
      }
    },

    computed: {
      ...mapState(['cartFoods', 'info']),//3.2 'cartFoods' ///3.9配送费多少钱起，是通过商家信息去获取的一你才'info'
      ...mapGetters(['cartFoodCount', 'cartFoodPrice']),//3.6 'cartFoodCount' //3.8'cartFoodPrice'//4.3'cartFoodPrice'
      /*4.2 计算属性 */
      payText() {
        const {cartFoodPrice} = this
        const {minPrice} = this.info
        if (cartFoodPrice === 0) {
          return `￥${minPrice}元起送`
        } else if (cartFoodPrice < minPrice) {
          return `还差￥${minPrice - cartFoodPrice}元起送`
        } else {
          return '去结算'
        }
      },
      /*4.4 确定 'enough' 或 'not-enough'  */
      payClass() {
        const {cartFoodPrice} = this
        const {minPrice} = this.info
        return cartFoodPrice-minPrice>=0 ? 'enough' : 'not-enough'
      },
/*4.9.1 */
      // 4.9.2购物车列表是否显示
      listShow () {
        // 如果没有数量, 直接隐藏
        if(this.cartFoodCount===0) {
          // 4.9.3将isShow设置为false
          this.isShow = false
          return false
        }
/*5.2 */
        if(this.isShow) {
          this.$nextTick(() => {
            /*
            实现单例对象
            1. 创建对象之前, 先要判断不存在
            2. 创建对象之后, 保存对象
             */
            if(!this.scroll) {
              console.log('------')
              this.scroll = new BScroll(this.$refs.list, {
                click: true
              })
            } else {
              //通知scroll刷新(重新进行计算)
              this.scroll.refresh()
            }

          })
        }
        // 如果数量大于0, 看isShow即可
        return this.isShow
      }
    },


    methods: {
      toggleShow () {//4.8.3
        // 4.10.1只有当有数量时才切换
        if(this.cartFoodCount) {
          this.isShow = !this.isShow
        }

      }
    },


    components: {
      CartControl//4.7.3注册组件
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixins.styl"
  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px
    .content
      display: flex
      background: #141d27
      font-size: 0
      color: rgba(255, 255, 255, 0.4)
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          vertical-align: top
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          border-radius: 50%
          background: #141d27
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background: #2b343c
            &.highlight
              background: $green
            .icon-shopping_cart
              line-height: 44px
              font-size: 24px
              color: #80858a
              &.highlight
                color: #fff
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight: 700
            color: #ffffff
            background: rgb(240, 20, 20)
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          padding-right: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-size: 16px
          font-weight: 700
          &.highlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          line-height: 24px
          font-size: 10px
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-size: 12px
          font-weight: 700
          &.not-enough
            background: #2b333b
          &.enough
            background: #00b43c
            color: #fff
    .shopcart-list
      position: absolute
      left: 0
      top: 0
      z-index: -1
      width: 100%
      transform translateY(-100%)
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)

      .list-content
        padding: 0 18px
        max-height: 217px
        overflow: hidden
        background: #fff
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          bottom-border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7, 17, 27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 6px

  .list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: 40
    backdrop-filter: blur(10px)
    opacity: 1
    background: rgba(7, 17, 27, 0.6)
    &.fade-enter-active, &.fade-leave-active
      transition: all 0.5s
    &.fade-enter, &.fade-leave-to
      opacity: 0
</style>
