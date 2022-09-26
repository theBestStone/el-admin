<template>
  <div class="app-container">
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible="crud.status.cu > 0" :title="crud.status.title" width="500px">
      <el-form ref="form" inline :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="form.orgName" style="width: 370px;" />
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
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.userName" clearable size="small" placeholder="输入用户名搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="query.mobilePhone" clearable size="small" placeholder="输入用户账号搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="query.orgName" clearable size="small" placeholder="输入企业名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-select v-model="query.certTimeliness" clearable size="small" placeholder="证书类型" class="filter-item" @change="crud.toQuery">
          <el-option v-for="item in options1" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <date-range-picker v-model="query.createTime" class="date-item" />
        <rrOperation />
      </div>
      <crudOperation :permission="permission" />
    </div>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" lazy :load="getDeptDatas" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" :data="crud.data" row-key="id" @select="crud.selectChange" @select-all="crud.selectAllChange" @selection-change="crud.selectionChangeHandler">
      <el-table-column label="证书序列号" prop="certId" />
      <el-table-column label="持有人姓名" prop="userName" />
      <el-table-column label="持有人手机号" prop="mobilePhone" />
      <el-table-column label="所属企业" prop="orgName" />
      <el-table-column label="类型" prop="certTimeliness">
        <template slot-scope="scope">
          {{ scope.row.certTimeliness == 1 ? '个人' : '企业' }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" :formatter="$util.YYMM" />
      <el-table-column label="状态" prop="state">
        <template slot-scope="scope">
          {{ scope.row.state == 0 ? '正常' : scope.row.state == 1 ? '已过期' : scope.row.state == 2 ? '已吊销' : '禁用' }}
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import crudUserStatistics from '@/api/operate/userStatistics'
import Treeselect from '@riophae/vue-treeselect';import common from '@/assets/js/common.js';
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import CRUD, { presenter, header, form, crud } from '@/components/Crud/crud'
import rrOperation from '@/components/Crud/RR.operation'
import crudOperation from '@/components/Crud/CRUD.operation'
import udOperation from '@/components/Crud/UD.operation'
import DateRangePicker from '@/components/DateRangePicker'
import pagination from '@/components/Crud/Pagination'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}
const defaultForm = { id: null, name: null, isTop: '1', subCount: 0, pid: null, deptSort: 999, enabled: 'true' }
export default {
  name: 'Dept',
  components: { Treeselect, rrOperation, udOperation, DateRangePicker, crudOperation, pagination },
  cruds() {
    return CRUD({
      title: '证书',
      url: common.base64DeCode('7C28889A7A72534A907658B1FC15A69BC05A0C8D4A0FC2F1661184D102C69686'),//'operate/findAllSysCert',
      crudMethod: { ...crudUserStatistics },
      optShow: {
        add: false,
        edit: false,
        del: false,
        reset: true,
        download: true
      }
    })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 设置数据字典
  // dicts: ['dept_status'],
  watch: {
    'crud.page.total'(val) {
      this.$emit('callbackNum', { type: 'messages', num: val })
    }
  },
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
        { key: '1', display_name: '个人' },
        { key: '2', display_name: '企业' }
      ],
      options2: [
        { key: 'true', display_name: '已认证' },
        { key: 'false', display_name: '未认证' }
      ]
    }
  },
  methods: {
    getDeptDatas(tree, treeNode, resolve) {
      const params = { pid: tree.id }
      setTimeout(() => {
        crudUserStatistics.getDepts(params).then(res => {
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
      crudUserStatistics.getDeptSuperior(id).then(res => {
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
      crudUserStatistics.getDepts({ enabled: true }).then(res => {
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
        crudUserStatistics.getDepts({ enabled: true, pid: parentNode.id }).then(res => {
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
          crudUserStatistics
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
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
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
