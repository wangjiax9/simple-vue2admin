<template>
  <el-autocomplete
    v-model="id"
    :fetch-suggestions="searchAsync"
    :placeholder="placeholder"
    @select="handleSelect"
  >
    <i class="el-icon-search el-input__icon" slot="suffix"></i>
    <template v-if="type === 'game'" slot-scope="{ item }">
      [{{ item.id }}]
      <span class="auto-text">{{ item.name_cn }}</span>
    </template>
    <template v-if="type === 'user'" slot-scope="{ item }">
      [{{ item.id }}]
      <span class="auto-text">{{ item.nickname }}</span>
    </template>
    <template v-if="type === 'post'" slot-scope="{ item }">
      [{{ item.id }}]
      <span class="auto-text">{{ item.title }}</span>
    </template>
    <template v-if="type === 'comment'" slot-scope="{ item }">
      [{{ item.id }}]
      <span class="auto-text">{{ item.user.nickname }}</span>
    </template>
  </el-autocomplete>
</template>
<script>
import { getGame } from '@/api/game'
import { getUserInfo } from '@/api/user'
import { getPost } from '@/api/post'
import { getComment } from '@/api/comment'
export default {
  props: {
    type: String, // game: 游戏， user： 用户， post： 帖子,  comment: 评论
    placeholder: String
  },
  data() {
    return {
      id: '',
      list: []
    }
  },
  methods: {
    searchAsync(queryString, cb) {
      if (!queryString) {
        cb([])
        return
      }
      this.searchData(queryString).then(response => {
        const d = response.data.data
        d.value = d.id + ''
        this.list.splice(0, 1, d)
        cb(this.list)
      }).catch(error => {
        cb([])
        console.log(error)
      })
    },
    handleSelect(item) {
      this.$emit('selectItem', item)
    },
    searchData(queryString) {
      return new Promise((resolve, reject) => {
        if (this.type === 'game') {
          getGame(queryString).then(response => {
            resolve(response)
          }).catch(error => {
            reject(error)
          })
        } else if (this.type === 'user') {
          getUserInfo(queryString).then(response => {
            resolve(response)
          }).catch(error => {
            reject(error)
          })
        } else if (this.type === 'post') {
          getPost(queryString).then(response => {
            resolve(response)
          }).catch(error => {
            reject(error)
          })
        } else if (this.type === 'comment') {
          getComment(queryString).then(response => {
            resolve(response)
          }).catch(error => {
            reject(error)
          })
        }
      })
    }
  }
}
</script>

