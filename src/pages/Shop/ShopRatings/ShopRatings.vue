<template>
  <div class="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <!--1.4显示获取数据的内容{{info.score}}，{{info.serviceScore}}，{{info.foodScore}}，{{info.deliveryTime}}-->
          <h1 class="score">{{info.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家90%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <!--1.5使用Star组件-->
            <Star :score="info.serviceScore" :size="36"/>
            <span class="score">{{info.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <!--1.5使用Star组件-->
            <Star :score="info.foodScore" :size="36"/>
            <span class="score">{{info.foodScore}}</span></div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{info.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>

<!--1.8分隔块组件-->
      <Split/>
        <!-- 2.1 子组件RatingFilter组件  //2.9去ShopRatings中引入RatingFilter.vue组件，传入2个属性:selectRateType="selectRateType"，
        :onlyContent="onlyContent"，。  2.8在子组件中绑定事件监听@setSelectRateType="setSelectRateType"， @switchOnlyContent="switchOnlyContent" 。//2.9去子组件RatingFilter.vue中绑定触发事件的点击事件-->
      <RatingFilter :selectRateType="selectRateType"
                    :onlyContent="onlyContent"
                    @setSelectRateType="setSelectRateType"
                    @switchOnlyContent="switchOnlyContent"/>

      <div class="rating-wrapper">
        <ul>
          <!--2.11这里不遍历ratings而是遍历过滤之后的列表filterRatings，定义在计算属性中（filterRatings结果根据ratings和2个状态的值来确定）-->
          <li class="rating-item" v-for="(rating, index) in filterRatings" :key="index">
            <div class="avatar">
              <img width="28" height="28" :src="rating.avatar">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <div><Star :size="24" :score="rating.score"/></div>
                <span class="delivery">{{rating.deliveryTime}}</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend">
                <!--1.9 -->
                <span class="iconfont" :class="rating.rateType===0 ? 'icon-thumb_up' : 'icon-thumb_down'"></span>
                <span class="item" v-for="(item, index) in rating.recommend" :key="index">{{item}}</span>
              </div>
              <!--1.10 -->
              <div class="time">{{rating.rateTime | date-format}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>

  import BScroll from 'better-scroll' //1.11引入BScroll，1.11滑动
  import {mapState} from 'vuex'//1.2需要去读取2个评分写到计算属性里面去computed

  import Star from '../../../components/Star/Star.vue'//1.6引入Star组件
  import RatingFilter from '../../../components/RatingFilter/RatingFilter.vue'//2.8去ShopRatings中引入RatingFilter.vue组件
  export default {

    data () {
      return {
        selectRateType: 2, //2.1 初始化状态数据（评论类型rateType） 0代表满意, 1代表不满意, 2代表全部
        onlyContent: false, //2.2 初始化状态数据（勾选状态 ） 是否只显示有text内容 //2.3然后去RatingFilter组件中接收这两个状态数据
      }
    },
    mounted () {
      //1.1获取ratings数据this.$store.dispatch('getRatings')
      this.$store.dispatch('getRatings', () => {//1.11用来设置滑动效果//这里的回调函数需要由actions中对应的action--async getRatings ({commit, state}, cb) {}传入回调函数cb
        this.$nextTick(() => {
          new BScroll('.ratings', {//'.ratings'选择器
            click: true
          })
        })
      })
    },

    computed: {
      ...mapState(['ratings', 'info']),//1.3
//2.12
      // 过滤后的评价列表
      filterRatings () {
        // 取出相关数据
        const {ratings, selectRateType, onlyContent} = this

        // 返回过滤后的数组
        return ratings.filter(rating => {
          const {rateType, text} = rating
          /*
          条件1
          selectRateType: 0/1/2
          rateType: 0/1
          selectRateType===2 || selectRateType===rateType
           */
          /*
          条件2
          onlyContent: true/false
          text: 有值/没值
          !onlyContent || text.length>0
           */

          return (selectRateType===2 || selectRateType===rateType) && (!onlyContent || text.length>0)
        })

      }
    },

    methods: {
      //2.7绑定事件监听的回调函数
      // 设置selectRateType的新值
      setSelectRateType (selectRateType) {
        this.selectRateType = selectRateType
      },

      switchOnlyContent () {
        this.onlyContent = !this.onlyContent
      }
    },

    components: {
      Star,//1.7
      RatingFilter
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../../../../vue-dev-/180315_gshop-client/src/common/stylus/mixins.styl"

  .ratings
    position: absolute
    top: 225px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden
    background: #fff
    .overview
      display: flex
      padding: 18px 0
      .overview-left
        flex: 0 0 137px
        padding: 6px 0
        width: 137px
        border-right: 1px solid rgba(7, 17, 27, 0.1)
        text-align: center
        @media only screen and (max-width: 320px)
          flex: 0 0 120px
          width: 120px
        .score
          margin-bottom: 6px
          line-height: 28px
          font-size: 24px
          color: rgb(255, 153, 0)
        .title
          margin-bottom: 8px
          line-height: 12px
          font-size: 12px
          color: rgb(7, 17, 27)
        .rank
          line-height: 10px
          font-size: 10px
          color: rgb(147, 153, 159)
      .overview-right
        flex: 1
        padding: 6px 0 6px 24px
        @media only screen and (max-width: 320px)
          padding-left: 6px
        .score-wrapper
          margin-bottom: 8px
          font-size: 0
          .title
            display: inline-block
            line-height: 18px
            vertical-align: top
            font-size: 12px
            color: rgb(7, 17, 27)
          .star
            display: inline-block
            margin: 0 12px
            vertical-align: top
          .score
            display: inline-block
            line-height: 18px
            vertical-align: top
            font-size: 12px
            color: rgb(255, 153, 0)
        .delivery-wrapper
          font-size: 0
          .title
            line-height: 18px
            font-size: 12px
            color: rgb(7, 17, 27)
          .delivery
            margin-left: 12px
            font-size: 12px
            color: rgb(147, 153, 159)
    .rating-wrapper
      padding: 0 18px
      .rating-item
        display: flex
        padding: 18px 0
        bottom-border-1px(rgba(7, 17, 27, 0.1))
        .avatar
          flex: 0 0 28px
          width: 28px
          margin-right: 12px
          img
            border-radius: 50%
        .content
          position: relative
          flex: 1
          .name
            margin-bottom: 4px
            line-height: 12px
            font-size: 10px
            color: rgb(7, 17, 27)
          .star-wrapper
            margin-bottom: 6px
            font-size: 0
            .star
              display: inline-block
              margin-right: 6px
              vertical-align: top
            .delivery
              display: inline-block
              vertical-align: top
              line-height: 12px
              font-size: 10px
              color: rgb(147, 153, 159)
          .text
            margin-bottom: 8px
            line-height: 18px
            color: rgb(7, 17, 27)
            font-size: 12px
          .recommend
            line-height: 16px
            font-size: 0
            .icon-thumb_up, .icon-thumb_down, .item
              display: inline-block
              margin: 0 8px 4px 0
              font-size: 9px
            .icon-thumb_up
              color: $yellow
            .icon-thumb_down
              color: rgb(147, 153, 159)

            .item
              padding: 0 6px
              border: 1px solid rgba(7, 17, 27, 0.1)
              border-radius: 1px
              color: rgb(147, 153, 159)
              background: #fff
          .time
            position: absolute
            top: 0
            right: 0
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)
</style>

