<template>
  <div class="createPost-container">
    <el-form
      ref="postForm"
      :model="postForm"
      :rules="rules"
      class="form-container"
    >
      <sticky
        :z-index="10"
        class-name="sub-navbar"
      >
        <el-button
          v-loading="loading"
          style="margin-left: 10px;"
          type="success"
          @click="submitForm"
        >
          Publish
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-form-item
          style="margin-bottom: 40px;"
          prop="title"
        >
          <material-input
            v-model="postForm.title"
            :maxlength="100"
            name="name"
            required
          >
            标题
          </material-input>
        </el-form-item>
        <el-form-item
          style="margin-bottom: 40px;"
          label="描述:"
        >
          <el-input
            v-model="postForm.summary"
            :rows="1"
            type="textarea"
            class="article-textarea"
            autosize
          />
        </el-form-item>
        <el-form-item
          style="margin-bottom: 40px;"
          prop="url"
        >
          <material-input
            v-model="postForm.url"
            :maxlength="100"
            name="name"
            required
          >
            链接
          </material-input>
        </el-form-item>
        <el-form-item
          label="类别:"
          class="postInfo-container-item"
        >
          <el-select
            v-model="postForm.category"
            placeholder="请选择导航类别"
          >
            <el-option
              v-for="item in categoryOptions"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          prop="imageURL"
          style="margin-bottom: 30px;"
        >
          <upload-image v-model="postForm.logo" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { isValidURL } from '@/utils/validate'
import { getNav, defaultNavData, createNav, updateNav, getCategorys } from '@/api/nav'
import { TagsViewModule, ITagView } from '@/store/modules/tags-view'
import MaterialInput from '@/components/MaterialInput/index.vue'
import Sticky from '@/components/Sticky/index.vue'
import Tinymce from '@/components/Tinymce/index.vue'
import MarkdownEditor from '@/components/MarkdownEditor/index.vue'
import UploadImage from '@/components/UploadImage/index.vue'
import { Form } from 'element-ui'

@Component({
  name: 'ArticleDetail',
  components: {
    MaterialInput,
    Sticky,
    Tinymce,
    UploadImage,
    MarkdownEditor
  }
})
export default class extends Vue {
  @Prop({ default: false }) private isEdit!: boolean

  private validateRequire = (rule: any, value: string, callback: Function) => {
    if (value === '') {
      if (rule.field === 'imageURL') {
        this.$message({
          message: 'Upload cover image is required',
          type: 'error'
        })
      } else {
        this.$message({
          message: rule.field + ' is required',
          type: 'error'
        })
      }
      callback(new Error(rule.field + ' is required'))
    } else {
      callback()
    }
  }
  private validateSourceUrl = (rule: any, value: string, callback: any) => {
    if (value) {
      if (isValidURL(value)) {
        callback()
      } else {
        this.$message({
          message: 'Invalid URL',
          type: 'error'
        })
        callback(new Error('Invalid URL'))
      }
    } else {
      callback()
    }
  }
  private postForm = Object.assign({}, defaultNavData)
  private loading = false
  private rules = {
    title: [{ validator: this.validateRequire }],
    url: [{ validator: this.validateSourceUrl }]
  }
  private tempTagView?: ITagView
  // 类别项
  private categoryOptions = []

  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultNavData)
    }
    this.getCategorys()
    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of this.setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempTagView = Object.assign({}, this.$route)
  }
  // 获取导航详情
  private async fetchData(id: string) {
    try {
      const { data } = await getNav(id, { /* Your params here */ })
      console.log(data.nav)
      this.postForm = data.nav
    } catch (err) {
      console.error(err)
    }
  }
  // 获取导航分类列表
  private async getCategorys() {
    const { data } = await getCategorys()
    this.categoryOptions = data.list
  }
  // 发布
  private submitForm() {
    (this.$refs.postForm as Form).validate(async valid => {
      if (valid) {
        this.loading = true
        try {
          if (!this.isEdit) {
            await createNav(this.postForm)
          } else {
            let id = this.$route.params && this.$route.params.id
            await updateNav(id, this.postForm)
          }
          this.loading = false
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.$router.push('/techNav/list')
        } catch (error) {
          this.loading = false
        }
      }
    })
  }
}
</script>

<style lang="scss">
.article-textarea {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>

<style lang="scss" scoped>
.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }

  ::v-deep .el-select {
    width: 220px;
  }
}
</style>
