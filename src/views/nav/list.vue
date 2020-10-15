<template>
  <div class="app-container">
    <el-input
      v-model.trim="listQuery.title"
      class="right-search"
      placeholder="搜索导航"
      autocomplete="on"
      @keyup.enter.native="onSearch"
    />
    <dl class="filter-item">
      <dt class="filter-dt">类别：</dt>
      <div class="dd-wrapper">
        <dd
          class="filter-dd"
          :class="{ 'is-active': item.name === listQuery.categoryName }"
          v-for="item in categoryArr"
          :key="item.name"
          @click="selectFilter(item.name)"
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
        label="标题"
      >
        <template slot-scope="{row}">
          <a :href="row.url" target="_blank">
            <span>{{ row.title }}</span>
          </a>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="类别"
        prop="category"
      >
      </el-table-column>

      <el-table-column
        align="center"
        label="描述"
        prop="summary"
      >
      </el-table-column>

      <el-table-column
        align="center"
        label="操作"
      >
        <template slot-scope="{row}">
          <router-link :to="'/techNav/edit/'+row._id">
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
            @click="deleteNav(row._id)"
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
import { getNavs, deleteNav, getCategorys } from '@/api/nav'
import { INavData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'NavList',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private total = 0
  private list: INavData[] = []
  private listLoading = true
  private listQuery = {
    page: 1,
    limit: 20,
    categoryName: '',
    title: ''
  }
  private categoryArr: object[] = []

  created() {
    this.getList()
    this.getCategorys()
  }

  // 获取导航类别
  private async getCategorys() {
    const { data } = await getCategorys()
    this.categoryArr = data.list
    this.categoryArr.push({
      name: '',
      label: '全部'
    })
  }

  private selectFilter(name: string) {
    if (name === this.listQuery.categoryName) {
      return
    }
    this.listQuery.categoryName = name
    this.getList()
  }
  // 获取导航列表
  private async getList() {
    this.listLoading = true
    try {
      const { data } = await getNavs(this.listQuery)
      this.list = data.items
      this.total = data.total
      this.listLoading = false
    } catch (error) {
      this.listLoading = false
    }
  }
  // 搜索导航
  private onSearch() {
    this.getList()
  }
  // 删除导航
  private async deleteNav(id: string) {
    await deleteNav(id)
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
