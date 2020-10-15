<!--
 * @Author: jinxiaodong
 * @Date: 2019-11-26 10:42:19
 * @LastEditors: jinxiaodong
 * @LastEditTime: 2019-11-26 17:30:27
 * @Description: 标签管理
 -->
<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="类别列表" name="tagList">
        <el-table
          v-loading="loading"
          :data="tags"
          border
          fit
          highlight-current-row
          style="width: 100%"
        >

          <el-table-column
            align="center"
            label="名称"
            prop="name"
          >
          </el-table-column>

          <el-table-column
            align="center"
            label="图标"
            prop="icon"
          >
          </el-table-column>

          <el-table-column
            align="center"
            label="操作"
          >
            <template slot-scope="{row}">
              <el-button
                type="primary"
                size="small"
                icon="el-icon-edit"
                @click="editTag(row)"
              >
                Edit
              </el-button>
              <el-button
                type="primary"
                size="small"
                icon="el-icon-delete"
                class="delete-btn"
                @click="deleteTag(row._id)"
              >
                delete
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="新增类别" name="addTag">
        <add-category @createTag="onCreateTag"></add-category>
      </el-tab-pane>
    </el-tabs>
    <!-- 编辑标签 -->
    <el-dialog append-to-body :visible.sync="dialogVisible" :before-close="handleClose">
      <div class="dialog-body">
        <add-category v-if="dialogVisible" ref="info" :isSubmit="false" :infoType="'edit'" :info="form" :id="id" @handleInfoResult="onHandleInfoResult"></add-category>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm">重 置</el-button>
        <el-button type="primary" @click="confirmEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import AddCategory from './components/addCategory.vue'
import { getCategorys, deleteCategory } from '@/api/nav'
import { ICategoryData } from '@/api/types'

@Component({
  name: 'categoryManage',
  components: {
    AddCategory
  }
})
export default class extends Vue {
  private activeName = 'tagList'
  private loading = false
  private tags = []
  private dialogVisible = false
  private form = {
    name: '',
    icon: ''
  }
  private id = ''

  created() {
    this.getList()
  }

   // 监听添加标签是否成功
  private onCreateTag(flag: boolean) {
    if (flag === true) {
      this.getList()
    }
  }

   // 刷新/获取标签
  private async getList() {
    try {
      this.loading = true
      const { data } = await getCategorys()
      this.tags = data.list
      this.loading = false
    } catch (e) {
      this.loading = false
      // eslint-disable-next-line no-console
      console.log(e)
    }
  }
  // 编辑标签
  private editTag(val: ICategoryData) {
    this.id = val._id
    this.form.name = val.name
    this.form.icon = val.icon
    this.dialogVisible = true
  }

  private onHandleInfoResult(flag: boolean) {
    this.dialogVisible = false
    if (flag === true) {
      this.getList()
    }
  }

  private deleteTag(id: string) {
    this.$confirm('此操作将永久删除标签, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      try {
        this.loading = true
        const res = await deleteCategory(id)
        this.loading = false
        await this.getList()
        this.$message.success(`删除成功`)
      } catch (e) {
        this.loading = false
        // eslint-disable-next-line no-console
        console.log(e)
      }
    }).catch(() => {
      this.$message.info('已取消删除')
    })
  }

  private handleClose() {
    this.dialogVisible = false
  }

  private confirmEdit() {
    (this.$refs.info as AddCategory).submitForm('form')
  }

  private resetForm() {
    (this.$refs.info as AddCategory).resetForm('form')
  }
}
</script>