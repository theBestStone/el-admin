<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.applyEname" clearable size="small" placeholder="输入企业名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="query.apiName" clearable size="small" placeholder="输入产品名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation />
      </div>
      <crudOperation :permission="permission" />
    </div>
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible="crud.status.cu > 0" :title="crud.status.title" width="500px">
      <el-form ref="form" inline :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="form.name" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="部门排序" prop="deptSort">
          <el-input-number v-model.number="form.deptSort" :min="0" :max="999" controls-position="right" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="顶级部门">
          <el-radio-group v-model="form.isTop" style="width: 140px">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.isTop === '0'" style="margin-bottom: 0;" label="上级部门" prop="pid">
          <treeselect v-model="form.pid" :load-options="loadDepts" :options="depts" style="width: 370px;" placeholder="选择上级类目" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog append-to-body :close-on-click-modal="false" :visible="appVisible" :before-close="appClose" :title="crud.status.title" width="400px" destroy-on-close>
      <el-input type="textarea" :rows="2" placeholder="请输入审核原因" v-model="appInfo.remark" :disabled="appInfo.status != 0"> </el-input>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="appVisible = false">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="auditOpenApi('1')" v-if="appInfo.status == 0">审核通过</el-button>
        <el-button :loading="crud.status.cu === 2" type="danger" @click="auditOpenApi('2')" v-if="appInfo.status == 0">审核驳回</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" lazy :load="getDeptDatas" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" :data="crud.data" row-key="id" @select="crud.selectChange" @select-all="crud.selectAllChange" @selection-change="crud.selectionChangeHandler">
      <!-- <el-table-column :selectable="checkboxT" type="selection" width="55" /> -->
      <el-table-column label="企业名称" prop="applyEname" />
      <el-table-column label="申请人账户" prop="account" />
      <el-table-column label="产品名称" prop="apiName" />
      <el-table-column label="产品编码" prop="apiNo" />
      <el-table-column label="申请状态" prop="status">
        <template slot-scope="scope">
          {{ scope.row.status == 0 ? '待审批' : scope.row.status == 1 ? '审批通过' : scope.row.status == 2 ? '审批驳回' : '' }}
        </template>
      </el-table-column>
      <el-table-column label="申请状态原因" prop="remark" />
      <el-table-column label="申请时间" prop="applyTime"  :formatter="$util.YYMM" />
      <el-table-column v-if="checkPer(['admin', 'user:edit', 'user:del'])" label="操作" width="115" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == 0" size="mini" type="primary" @click="toApprove(scope.row)">审批</el-button>
          <el-button v-else type="text">-</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import crudApplicationApp from '@/api/ability/applicationApp'
import Treeselect from '@riophae/vue-treeselect';import common from '@/assets/js/common.js';
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import CRUD, { presenter, header, form, crud } from '@/components/Crud/crud'
import rrOperation from '@/components/Crud/RR.operation'
import crudOperation from '@/components/Crud/CRUD.operation'
import udOperation from '@/components/Crud/UD.operation'
import DateRangePicker from '@/components/DateRangePicker'
import pagination from '@/components/Crud/Pagination'
const defaultForm = { id: null, name: null, isTop: '1', subCount: 0, pid: null, deptSort: 999, enabled: 'true' }
export default {
  name: 'Dept',
  components: { Treeselect, crudOperation, rrOperation, udOperation, DateRangePicker,pagination },
  cruds() {
    return CRUD({
      title: '应用审批',
      url: common.base64DeCode('57ADBB0A8B95B9B487103D8F299B70309E32AEDEE5A667724686BD16C0F53ED8603CA1E03FE5BBD7C496A551C3204446'),//'api-openapi/openApi/openApiAuditList',
      crudMethod: { ...crudApplicationApp },
      optShow: {
        add: false,
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
      appInfo: {
        remark: '',
        status: ''
      },
      appVisible: false
    }
  },
  methods: {
    getDeptDatas(tree, treeNode, resolve) {
      const params = { pid: tree.id }
      setTimeout(() => {
        crudApplicationApp.getDepts(params).then(res => {
          resolve(res.content)
        })
      }, 100)
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      if (form.pid !== null) {
        form.isTop = '0'
      } else if (form.id !== null) {
        form.isTop = '1'
      }
      form.enabled = `${form.enabled}`
      if (form.id != null) {
        this.getSupDepts(form.id)
      } else {
        this.getDepts()
      }
    },
    getSupDepts(id) {
      crudApplicationApp.getDeptSuperior(id).then(res => {
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
      crudApplicationApp.getDepts({ enabled: true }).then(res => {
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
        crudApplicationApp.getDepts({ enabled: true, pid: parentNode.id }).then(res => {
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
      if (this.form.pid !== null && this.form.pid === this.form.id) {
        this.$message({
          message: '上级部门不能为空',
          type: 'warning'
        })
        return false
      }
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
          crudApplicationApp
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
      return true
    },
    toApprove(data) {
      this.appInfo.remark = data.remark
      this.appInfo.id = data.id
      this.appVisible = true
    },
    appClose() {
      this.appInfo = {
        remark: '',
        status: ''
      }
      this.appVisible = false
    },
    auditOpenApi(status) {
      if (status == 2 && !this.appInfo.remark) return this.$message.error('请填写审核原因！')
      crudApplicationApp.auditOpenApi({ ...this.appInfo, status }).then(res => {
        this.appVisible = false
        this.crud.toQuery()
      })
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
