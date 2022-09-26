<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.title" clearable size="small" placeholder="输入问题标题搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <date-range-picker v-model="query.createTime" class="date-item" />
        <rrOperation />
      </div>
      <crudOperation :permission="permission" />
    </div>
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible="crud.status.cu > 0" :title="crud.status.title" width="700px">
      <el-form ref="form" inline :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="问题标题" prop="msgTitle" verify>
          <el-input v-model="form.msgTitle" placeholder="请输入问题标题" style="width: 370px;"></el-input>
        </el-form-item>
        <el-form-item label="生效日期" prop="effectiveDate" verify>
          <el-date-picker v-model="form.effectiveDate" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间" style="width: 370px;"> </el-date-picker>
        </el-form-item>
        <el-form-item label="应用系统" prop="viewApp" verify>
          <el-checkbox-group v-model="checkList">
            <el-checkbox label="随e签门户"></el-checkbox>
            <el-checkbox label="存证系统"></el-checkbox>
            <el-checkbox label="能力开放平台"></el-checkbox>
          </el-checkbox-group>
          <el-input v-show="false" v-model="form.viewApp"></el-input>
        </el-form-item>
        <el-form-item label="公告内容" prop="msgContext" verify>
          <editor-bar v-model="form.msgContext" @watchValue="watchValue" ref="editorBarRef" :isClear="false"></editor-bar>
          <el-input v-show="false" v-model="form.msgContext" placeholder="请输入公告标题"></el-input>
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
      <el-table-column label="问题编码" prop="code" />
      <el-table-column label="问题标题" prop="msgTitle" />
      <el-table-column label="发布人账号" prop="publicAccount" />
      <el-table-column label="发布时间" prop="publicTime" />
      <el-table-column label="公告生效时间" prop="effectiveTime" />
      <el-table-column label="发布系统" prop="systemName" />
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
import crudProblem from '@/api/config/problem'
import Treeselect from '@riophae/vue-treeselect';import common from '@/assets/js/common.js';
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import CRUD, { presenter, header, form, crud } from '@/components/Crud/crud'
import rrOperation from '@/components/Crud/RR.operation'
import crudOperation from '@/components/Crud/CRUD.operation'
import udOperation from '@/components/Crud/UD.operation'
import DateRangePicker from '@/components/DateRangePicker'
import EditorBar from '@/components/wangEditor'
import pagination from '@/components/Crud/Pagination'

const defaultForm = { msgTitle: '', effectiveDate: '', viewApp: '', msgContext: '' }
export default {
  name: 'Dept',
  components: { Treeselect, crudOperation, rrOperation, udOperation, DateRangePicker, EditorBar, pagination },
  cruds() {
    return CRUD({
      title: '问题',
      url: common.base64DeCode('DBFC36846670C65B2E88AE9ED2BA6E2D288B4A01413D937772DDD690D123903E'),//'open/problem/page',
      crudMethod: { ...crudProblem },
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
      checkList: []
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
  methods: {
    getDeptDatas(tree, treeNode, resolve) {
      const params = { pid: tree.id }
      setTimeout(() => {
        crudProblem.getDepts(params).then(res => {
          resolve(res.content)
        })
      }, 100)
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      this.form.msgContext = ''
      this.checkList = []
    },
    [CRUD.HOOK.beforeToEdit](crud, form) {
      crudProblem.getProblembyId(form.id).then(res => {
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
        console.log(this.form)
        this.$refs.editorBarRef.editor.txt.html(this.form.msgContext)
      })
    },
    getSupDepts(id) {
      crudProblem.getDeptSuperior(id).then(res => {
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
      crudProblem.getDepts({ enabled: true }).then(res => {
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
        crudProblem.getDepts({ enabled: true, pid: parentNode.id }).then(res => {
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
          crudProblem
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
    watchValue(val) {
      this.form.msgContext = val
    }
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
