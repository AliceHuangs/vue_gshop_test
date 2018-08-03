import {
  RECEIVE_SHOPS,
  RECEIVE_CATEGORYS,
  RECEIVE_ADDRESS,
  RECEIVE_USER,
  RESET_USER
} from './mutation-types'
import {
  RECEIVE_GOODS, RECEIVE_INFO,
  RECEIVE_RATINGS
} from "../../../../vue-dev-/180315_gshop-client/src/store/mutation-types";

export default {

  [RECEIVE_ADDRESS] (state, {address}) {
    state.address = address
  },

  [RECEIVE_CATEGORYS] (state, {categorys}) {
    state.categorys = categorys
  },

  [RECEIVE_SHOPS] (state, {shops}) {
    state.shops = shops
  },

  [RECEIVE_USER] (state, {user}) {
    state.user = user
  },
  [RESET_USER] (state) {
    state.user = {}
  },
  [RECEIVE_GOODS] (state, {goods}) {
    state.goods = goods
  },
  [RECEIVE_RATINGS] (state, {ratings}) {
    state.ratings = ratings
  },
  [RECEIVE_INFO] (state, {info}) {
    state.info = info
  },

}