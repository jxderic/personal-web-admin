<!--
 * @Author: jinxiaodong
 * @Date: 2019-11-26 10:42:19
 * @LastEditors: jinxiaodong
 * @LastEditTime: 2019-11-26 20:20:19
 * @Description: 新增标签
 -->
<template>
  <div>
    <el-form
      :model="form"
      @submit.native.prevent
      status-icon
      label-width="80px"
      ref="form"
      v-loading="loading"
      :rules="rules"
    >
      <el-form-item label="名称" prop="name">
        <el-input size="medium" clearable v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <el-input size="medium" clearable v-model="form.icon"></el-input>
      </el-form-item>
      <el-form-item v-if="isSubmit">
        <el-button @click="resetForm('form')">重 置</el-button>
        <el-button type="primary" @click="submitForm('form')">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { createCategory, updateCategory } from '@/api/nav'
import { ICategoryData } from '@/api/types'

@Component({
  name: 'AddCategory'
})
export default class extends Vue {
  @Prop({ default: true }) private isSubmit!: boolean
  @Prop({ default: 'add' }) private infoType!: string
  @Prop({ default: () => {} }) private info!: ICategoryData
  @Prop({ default: '' }) private id!: string

  private loading = false
  private form = {
    name: '',
    icon: '',
    label: ''
  }
  private rules = {
    name: [
      { required: true, message: '标签名不能为空', trigger: 'blur' }
    ]
  }
  // 编辑获取信息
  created() {
    if (this.infoType === 'edit') {
      this.setInfo()
    }
  }

  public submitForm(formName: string) {
    (this.$refs[formName] as Form).validate(async (valid) => {
      if (valid) {
        if (this.infoType === 'add') {
          // 新增标签
          try {
            this.loading = true
            this.form.label = this.form.name
            const res = await createCategory(this.form)
            this.loading = false
            this.$message.success(`添加成功`)
            this.$emit('createTag', true)
            this.resetForm(formName)
          } catch (e) {
            this.loading = false
            // eslint-disable-next-line no-console
            console.log(e)
          }
        } else {
          // 更新标签
          if (this.form.name === this.info.name) {
            this.$emit('handleInfoResult', false)
            return
          }
          try {
            this.loading = true
            this.form.label = this.form.name
            const res = await updateCategory(this.id, this.form)
            this.loading = false
            this.$message.success(`更新成功`)
            this.$emit('handleInfoResult', true)
          } catch (e) {
            this.loading = false
            // eslint-disable-next-line no-console
            console.log(e)
          }
        }
      } else {
        this.$message.error('请填写正确的信息')
      }
    })
  }

  public resetForm(formName: string) {
    if (this.infoType === 'edit') {
      this.setInfo()
    } else {
      (this.$refs[formName] as Form).resetFields()
    }
  }

  private setInfo() {
    this.form = this.info
  }
}
</script>