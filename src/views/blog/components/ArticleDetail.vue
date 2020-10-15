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
        :class-name="'sub-navbar '+postForm.status"
      >
        <el-button
          v-loading="loading"
          style="margin-left: 10px;"
          type="success"
          @click="submitForm"
        >
          Publish
        </el-button>
        <el-button
          v-loading="loading"
          type="warning"
          @click="draftForm"
        >
          Draft
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-form-item
          style="margin-bottom: 40px;"
          label="编写方式"
        >
          <el-radio-group v-model="writeType">
            <el-radio
              v-for="(item, index) in writeTypes"
              :key="index"
              :label="item.value"
            >
              {{ item.name }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
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
          label="简介:"
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
          prop="content"
          style="margin-bottom: 30px;"
        >
          <tinymce
            v-if="writeType === 'wangEdit'"
            ref="editor"
            v-model="postForm.content"
            :height="400"
          />
          <markdown-editor
            v-if="writeType === 'markdown'"
            v-model="postForm.content"
            height="400px"
            :options="{hideModeSwitch: true, previewStyle: 'tab'}"
          />
        </el-form-item>
        <el-form-item
          label="日期:"
          class="postInfo-container-item"
        >
          <el-date-picker
            v-model="postForm.date"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期和时间"
          />
        </el-form-item>
        <el-form-item
          label="标签:"
          class="postInfo-container-item"
        >
          <el-select
            v-model="postForm.tags"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择文章标签"
          >
            <el-option
              v-for="item in tagOptions"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="类别:"
          class="postInfo-container-item"
        >
          <el-select
            v-model="postForm.category"
            placeholder="请选择文章类别"
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
          style="margin-bottom: 40px;"
          label="是否精选"
        >
          <el-radio-group v-model="postForm.starStatus">
            <el-radio
              v-for="(item, index) in starArr"
              :key="index"
              :label="item.value"
            >
              {{ item.name }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          prop="imageURL"
          style="margin-bottom: 30px;"
        >
          <upload-image v-model="postForm.thumbnail" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { isValidURL } from '@/utils/validate'
import {
  getArticle,
  defaultArticleData,
  createArticle,
  updateArticle,
  getTags,
  getCategorys
} from '@/api/articles'
import { ITagView } from '@/store/modules/tags-view'
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
  private postForm = Object.assign({}, defaultArticleData)
  private loading = false
  private userListOptions = []
  private rules = {
    title: [{ validator: this.validateRequire }],
    content: [{ validator: this.validateRequire }]
  }
  private tempTagView?: any
  // 标签备选项
  private tagOptions = []
  // 类别项
  private categoryOptions = []
  // 编写方式
  private writeType = 'localEdit'
  private writeTypes = [
    {
      name: 'WangEdit编辑',
      value: 'wangEdit'
    },
    {
      name: 'Markdown编辑',
      value: 'markdown'
    },
    {
      name: '本地导入',
      value: 'localEdit'
    }
  ]
  private starArr = [
    {
      name: '普通',
      value: 0
    },
    {
      name: '精选',
      value: 1
    }
  ]
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultArticleData)
    }
    this.getTags()
    this.getCategorys()
    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of this.setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempTagView = Object.assign({}, this.$route)
  }
  // 获取文章详情
  private async fetchData(id: string) {
    try {
      const { data } = await getArticle(id, {
        /* Your params here */
      })
      this.postForm = data.article
    } catch (err) {
      console.error(err)
    }
  }
  // 获取导航分类列表
  private async getCategorys() {
    const { data } = await getCategorys()
    this.categoryOptions = data
  }
  // 获取标签列表
  private async getTags() {
    const { data } = await getTags()
    this.tagOptions = data
  }
  // 发布
  private submitForm() {
    (this.$refs.postForm as Form).validate(async valid => {
      if (valid) {
        this.loading = true
        this.postForm.status = 'published'
        try {
          if (!this.isEdit) {
            await createArticle(this.postForm)
          } else {
            let id = this.$route.params && this.$route.params.id
            await updateArticle(id, this.postForm)
          }
          this.loading = false
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.$router.push('/blog/list')
        } catch (error) {
          this.loading = false
        }
      }
    })
  }
  // 草稿
  private draftForm() {
    (this.$refs.postForm as Form).validate(async valid => {
      if (valid) {
        this.loading = true
        this.postForm.status = 'draft'
        try {
          if (!this.isEdit) {
            await createArticle(this.postForm)
          } else {
            let id = this.$route.params && this.$route.params.id
            await updateArticle(id, this.postForm)
          }
          this.loading = false
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.$router.push('/blog/list')
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
