<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.entCode" clearable size="small" placeholder="输入企业编码搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="query.entName" clearable size="small" placeholder="输入企业名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <date-range-picker v-model="query.createTime" class="date-item" />
        <rrOperation />
      </div>
      <crudOperation :permission="permission" />
    </div>
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible="crud.status.cu > 0" :title="crud.status.title" width="500px">
      <el-form ref="form" inline :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="企业名称" prop="entName" verify>
          <el-input v-model="form.entName" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="上级企业" prop="parentId" clearable :required="!user.roles.includes('admin')">
          <el-select v-model="form.parentId" placeholder="请选择" style="width: 370px;">
            <el-option v-for="item in options" :key="item.id" :label="item.entName" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业邮箱" prop="entEmail" verify email>
          <el-input v-model="form.entEmail" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="企业电话" prop="entMobile" verify phone>
          <el-input v-model="form.entMobile" style="width: 370px;" />
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
      <el-table-column label="企业名称" prop="entName" />
      <el-table-column label="企业编码" prop="entCode" />
      <el-table-column label="上级企业" prop="parentName" />
      <el-table-column label="企业电话" prop="entMobile" />
      <el-table-column label="企业邮箱" prop="entEmail" />
      <el-table-column prop="createTime" :formatter="$util.YYMM" label="创建日期" />
      <el-table-column v-if="checkPer(['admin', 'enter:add', 'dept:del'])" label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <!-- :disabled-dle="scope.row.id === 1"    禁用某个id -->
          <udOperation :data="scope.row" :disabled-dle="scope.row.parentId == 0" :disabled-edit="scope.row.parentId == 0" :permission="permission" msg="确定删除？" />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import crudEnter from '@/api/system/enter'
import Treeselect from '@riophae/vue-treeselect';import common from '@/assets/js/common.js';
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import CRUD, { presenter, header, form, crud } from '@/components/Crud/crud'
import rrOperation from '@/components/Crud/RR.operation'
import crudOperation from '@/components/Crud/CRUD.operation'
import udOperation from '@/components/Crud/UD.operation'
import DateRangePicker from '@/components/DateRangePicker'
import pagination from '@/components/Crud/Pagination'
import { mapState } from 'vuex'

const defaultForm = { parentId: null, entName: '', entCode: '', entEmail: '', entMobile: '', state: '0' }
export default {
  name: 'Dept',
  components: { Treeselect, crudOperation, rrOperation, udOperation, DateRangePicker, pagination },
  cruds() {
    return CRUD({
      title: '企业',
      url: common.base64DeCode('C017E5452CB684C8451A70A0B4F7D0E3A57327E53DB2085CC4FF438676A67166'),//'sys-ent/findEntList',
      crudMethod: { ...crudEnter },
      optShow: {
        add: true,
        edit: true,
        del: true,
        reset: true,
        download: false
      }
    })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 设置数据字典
  // dicts: ['dept_status'],
  computed: {
    ...mapState(['user'])
  },
  data() {
    return {
      depts: [],
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        deptSort: [{ required: true, message: '请输入序号', trigger: 'blur', type: 'number' }]
      },
      permission: {
        add: ['admin', 'enter:add'],
        edit: ['admin', 'dept:edit'],
        del: ['admin', 'dept:del']
      },
      enabledTypeOptions: [
        { key: 'true', display_name: '正常' },
        { key: 'false', display_name: '禁用' }
      ],
      options: []
    }
  },
  watch: {
    'form.parentId'(val) {
      this.form.parentId = Boolean(this.form.parentId) ? this.form.parentId : ''
    }
  },
  methods: {
    getDeptDatas(tree, treeNode, resolve) {
      const params = { pid: tree.id }
      setTimeout(() => {
        crudEnter.getDepts(params).then(res => {
          resolve(res.content)
        })
      }, 100)
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      crudEnter.getDicts().then(res => {
        this.options = res.data
        this.form.parentId = Number(form.parentId) || ''
      })
    },
    [CRUD.HOOK.afterAddError]() {
      this.form.parentId = Number(this.form.parentId)
    },
    [CRUD.HOOK.beforeToEdit]() {
      this.form.parentId = Number(this.form.parentId)
    },
    getSupDepts(id) {
      crudEnter.getDeptSuperior(id).then(res => {
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
      crudEnter.getDepts({ enabled: true }).then(res => {
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
        crudEnter.getDepts({ enabled: true, pid: parentNode.id }).then(res => {
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
      // if (this.form.pid !== null && this.form.pid === this.form.id) {
      //   this.$message({
      //     message: '上级部门不能为空',
      //     type: 'warning'
      //   })
      //   return false
      // }
      if (this.form.isTop === '1') {
        this.form.pid = null
      }
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
          crudEnter
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
      return row.parentId !== 0
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
