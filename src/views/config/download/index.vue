<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.title" clearable size="small" placeholder="输入文件名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <date-range-picker v-model="query.createTime" class="date-item" />
        <rrOperation />
      </div>
      <crudOperation :permission="permission" />
    </div>
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible="crud.status.cu > 0" :title="crud.status.title" width="600px">
      <el-form ref="form" inline :model="form" :rules="rules" size="small" label-width="120px">
        <el-form-item label="下载文件名称" prop="msgTitle" verify>
          <el-input v-model="form.msgTitle" placeholder="请输入下载文件名称" style="width: 330px;"></el-input>
        </el-form-item>
        <el-form-item label="文件生效日期" prop="effectiveDate" verify>
          <el-date-picker v-model="form.effectiveDate" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间" style="width: 330px;"> </el-date-picker>
        </el-form-item>
        <el-form-item label="应用系统" prop="viewApp" verify>
          <el-checkbox-group v-model="checkList">
            <el-checkbox label="随e签门户"></el-checkbox>
            <el-checkbox label="存证系统"></el-checkbox>
            <el-checkbox label="能力开放平台"></el-checkbox>
          </el-checkbox-group>
          <el-input v-show="false" v-model="form.viewApp"></el-input>
        </el-form-item>
        <el-form-item label="附件" prop="fileId" verify>
          <!-- :http-request="fileSuccess"  -->
          <el-upload class="upload-demo" name="file" :on-change="handleChange" :data="uploadData" :on-success="successAuth" :action="action" :on-preview="handlePreview" accept=".doc,.pdf,.zip,.jpg,.jpeg,.png" :on-remove="handleRemove_accessory" @on-error="handleError_accessory" :file-list="form.fileList"  >
            <el-button size="small" type="primary">点击上传</el-button>
            <p style="color:#ccc;">支持doc、pdf、zip、jpg、jpeg、png格式</p>
          </el-upload>
          <el-input v-show="false" v-model="form.fileId"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" lazy :load="getDeptDatas" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" :data="crud.data" row-key="id" @select="crud.selectChange" @select-all="crud.selectAllChange" @selection-change="crud.selectionChangeHandler">
      <el-table-column :selectable="checkboxT" type="selection" width="55" />
      <el-table-column label="文件编码" prop="code" />
      <el-table-column label="文件名称" prop="msgTitle" />
      <el-table-column label="发布人员" prop="publicName" />
      <el-table-column label="上传时间" prop="publicTime" />
      <el-table-column label="生效时间" prop="effectiveTime" />
      <el-table-column label="下载文件系统" prop="systemName" />
      <el-table-column v-if="checkPer(['admin', 'dept:edit', 'dept:del'])" label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <udOperation :data="scope.row" :permission="permission" :disabled-dle="scope.row.id === 1" msg="确定删除？" />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import { fileUpload, fileDetail,fileUploads } from '@/api/file'
import crudDow from '@/api/config/download'
import Treeselect from '@riophae/vue-treeselect';import common from '@/assets/js/common.js';
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import CRUD, { presenter, header, form, crud } from '@/components/Crud/crud'
import rrOperation from '@/components/Crud/RR.operation'
import crudOperation from '@/components/Crud/CRUD.operation'
import udOperation from '@/components/Crud/UD.operation'
import DateRangePicker from '@/components/DateRangePicker'
import pagination from '@/components/Crud/Pagination'
import { setTimeout } from 'timers';
import { getToken } from '@/utils/auth'
import Cookies from 'js-cookie'
const defaultForm = { msgTitle: '', effectiveDate: '', viewApp: '', fileId: '',fileList: [] }

export default {
  name: 'Dept',
  components: { Treeselect, crudOperation, rrOperation, udOperation, DateRangePicker, pagination },
  cruds() {
    return CRUD({
      title: '下载',
      url: common.base64DeCode('083E20E08067E3A5C2A99AADD79C57E8'),//'open/file/page',
      crudMethod: { ...crudDow },
      optShow: {
        add: true,
        edit: false,
        del: false,
        reset: true,
        download: false
      }
    })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 设置数据字典
  // dicts: ['dept_status'],
  data() {
    return {
      depts: [],
      action:"",
      uploadData:{
            channelNo:"anysign",
            storeType:1
        },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        deptSort: [{ required: true, message: '请输入序号', trigger: 'blur', type: 'number' }]
      },
      permission: {
        add: ['admin', 'dept:add'],
        edit: ['admin', 'dept:edit'],
        del: ['admin', 'dept:del']
      },
      options1: [
        { key: 'true', display_name: '普通用户' },
        { key: 'false', display_name: '重要用户' }
      ],
      options2: [
        { key: 'true', display_name: '已认证' },
        { key: 'false', display_name: '未认证' }
      ],
      radio: '',
      fileList: [],
      checkList: [],
      baseUrl: process.env.VUE_APP_BASE_API,
      getToken:getToken()
    }
  },
  watch: {
    checkList(val) {
      this.form.viewApp = val.join()
      this.form.viewApp = this.form.viewApp.replace('随e签门户', '1')
      this.form.viewApp = this.form.viewApp.replace('存证系统', '2')
      this.form.viewApp = this.form.viewApp.replace('能力开放平台', '3')
    }
  },
  created(){
    this.action = fileUploads();
  },
  methods: {
    handleChange() {},
    handlePreview() {},
    successAuth(res,fileList){
           
          if(res.code==200){
            this.form.fileId = res.data.id;
            this.form.fileList  =[fileList];
          }else if(res.code==401){
            this.$message.error("上传失败")
            this.$store.dispatch('LogOut').then(() => {
              // 用户登录界面提示
              Cookies.set('point', 401)
              location.reload()
            })
          }else{
             
              this.$message.error("上传失败")
          }
      },
    fileSuccess(data) {
      console.log(data)
      let reader = new FileReader()
      reader.onload = e => {
        fileUpload({ base64: e.target.result.split(",")[1], fileName: data.file.name, channelNo: 'anysign', storeType: 1 }).then(res => {
          this.form.fileId = res.data.id
        })
      }
      reader.readAsDataURL(data.file)
    },
    handleRemove_accessory() {
      this.form.fileId = ''
    },
    handleError_accessory(res) {
       
    },
    getDeptDatas(tree, treeNode, resolve) {
      const params = { pid: tree.id }
      setTimeout(() => {
        crudDow.getDepts(params).then(res => {
          resolve(res.content)
        })
      }, 100)
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      this.checkList = []
    },
    [CRUD.HOOK.beforeToEdit](crud, form) {
      crudDow.getFilebyId(form.id).then(res => {
        Object.assign(this.form, res.data)
        this.checkList = this.form.viewApp.split(',').map(item => {
          if (item == 1) {
            return '随e签门户'
          } else if (item == 2) {
            return '存证系统'
          } else if (item == 3) {
            return '能力开放平台'
          }
        })
        fileDetail({ id: res.data.fileId }).then(result => {// /api-file/file/preview/
          this.fileList = [{ name: result.data.name, url: `${this.baseUrl+common.base64DeCode('FE4416B05E8EB6A1E1E0E13CB08B54F38E3A6741F13B130FE30149976BE2B2F0F0296C957510D931AE8B50D4D6AC97CC')}${res.data.fileId}?access_token=${this.getToken}` }]
        })
      })
    },
    getSupDepts(id) {
      crudDow.getDeptSuperior(id).then(res => {
        const date = res.content
        this.buildDepts(date)
        this.depts = date
      })
    },
    buildDepts(depts) {
      depts.forEach(data => {
        if (data.children) {
          this.buildDepts(data.children)
        }
        if (data.hasChildren && !data.children) {
          data.children = null
        }
      })
    },
    getDepts() {
      crudDow.getDepts({ enabled: true }).then(res => {
        this.depts = res.content.map(function(obj) {
          if (obj.hasChildren) {
            obj.children = null
          }
          return obj
        })
      })
    },
    // 获取弹窗内部门数据
    loadDepts({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        crudDow.getDepts({ enabled: true, pid: parentNode.id }).then(res => {
          parentNode.children = res.content.map(function(obj) {
            if (obj.hasChildren) {
              obj.children = null
            }
            return obj
          })
          setTimeout(() => {
            callback()
          }, 100)
        })
      }
    },
    // 提交前的验证
    [CRUD.HOOK.afterValidateCU]() {
      return true
    },
    // 改变状态
    changeEnabled(data, val) {
      this.$confirm('此操作将 "' + this.dict.label.dept_status[val] + '" ' + data.name + '部门, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          crudDow
            .edit(data)
            .then(res => {
              this.crud.notify(this.dict.label.dept_status[val] + '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
            })
            .catch(err => {
              data.enabled = !data.enabled
              console.log(err.response.data.message)
            })
        })
        .catch(() => {
          data.enabled = !data.enabled
        })
    },
    checkboxT(row, rowIndex) {
      return row.id !== 1
    },
    removeFileChange() {}
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .vue-treeselect__control,
::v-deep .vue-treeselect__placeholder,
::v-deep .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
