<template>
  <div class="app-container">
    <el-input
      v-model.trim="listQuery.title"
      class="right-search"
      placeholder="搜索博客"
      autocomplete="on"
      @keyup.enter.native="onSearch"
    />
    <dl class="filter-item">
      <dt class="filter-dt">状态：</dt>
      <div class="dd-wrapper">
        <dd
          class="filter-dd"
          :class="{ 'is-active': item.name === listQuery.statusName }"
          v-for="item in status"
          :key="item.name"
          @click="selectStatusFilter(item.name)"
        >
          {{ item.label }}
        </dd>
      </div>
    </dl>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        width="80"
        align="center"
        type="index"
        label="序号"
      />

      <el-table-column
        width="180px"
        align="center"
        label="日期"
        prop="date"
      >
        <template slot-scope="{row}">
          <span>{{ row.date && $moment(row.date).format('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="标签"
      >
        <template slot-scope="{row}">
          <el-tag v-for="(item, index) in row.tags" type="info" :key="index">
            {{ item }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        class-name="status-col"
        label="状态"
        width="110"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.status | articleStatusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="标题"
      >
        <template slot-scope="{row}">
          <router-link
            :to="'/blog/edit/'+row._id"
            class="link-type"
          >
            <span>{{ row.title }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="操作"
      >
        <template slot-scope="{row}">
          <router-link :to="'/blog/edit/'+row._id">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
            >
              Edit
            </el-button>
          </router-link>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-delete"
            class="delete-btn"
            @click="deleteBlog(row._id)"
          >
            delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getArticles, deleteArticle, getTags } from '@/api/articles'
import { IArticleData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'ArticleList',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private total = 0
  private list: IArticleData[] = []
  private listLoading = true
  private listQuery = {
    page: 1,
    limit: 20,
    title: '',
    statusName: ''
  }
  private status = [
    { label: '全部', name: '' },
    { label: '已发布', name: 'published' },
    { label: '草稿', name: 'draft' }
  ]

  created() {
    this.getList()
  }
  // 获取博客列表
  private async getList() {
    this.listLoading = true
    try {
      const { data } = await getArticles(this.listQuery)
      this.list = data.items
      this.total = data.total
      this.listLoading = false
    } catch (error) {
      this.listLoading = false
    }
  }

  private selectStatusFilter(name: string) {
    if (name === this.listQuery.statusName) {
      return
    }
    this.listQuery.statusName = name
    this.getList()
  }
  // 搜索博客
  private onSearch() {
    this.getList()
  }
  // 删除博客
  private async deleteBlog(id: string) {
    await deleteArticle(id)
    this.$message({
      message: '删除成功',
      type: 'success'
    })
    this.getList()
  }
}
</script>
<style lang="scss" scoped>
.edit-input {
  padding-right: 100px;
}

.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}

.right-search {
  width: 300px;
  float: right;
  margin-bottom: 20px;
}

.delete-btn {
  margin-left: 10px;
}

::v-deep .el-tag.el-tag--info {
  margin-right: 10px;
}
</style>
