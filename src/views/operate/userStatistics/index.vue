<template>
  <div class="app-container">
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
    <panel-group @handleSetLineChartData="handleSetLineChartData" active="1" :totalData="totalData" />
    <user v-show="activeType == 'newVisitis'" @callbackNum="callbackNum"></user>
    <cert v-show="activeType == 'messages'" @callbackNum="callbackNum"> </cert>
    <enter v-show="activeType == 'purchases'" @callbackNum="callbackNum"> </enter>
    <cont v-show="activeType == 'shoppings'" @callbackNum="callbackNum"> </cont>
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
import PanelGroup from '@/views/components/PanelGroup.vue'
import User from '../user'
import Cert from '../cert'
import Enter from '../enter'
import Cont from '../cont'

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
  components: { Treeselect, rrOperation, udOperation, DateRangePicker, PanelGroup, crudOperation, User, Cert, Enter, Cont },
  cruds() {
    return CRUD({
      title: '运营',
      url: '',
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
      activeType: 'newVisitis',
      totalData: {
        userTotal: 0,
        certTotal: 0,
        enterTotal: 0,
        contTotal: 0
      }
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
    [CRUD.HOOK.afterToCU](crud, form) {},
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
      this.activeType = type
      console.log(type)
    },
    callbackNum({ type, num }) {
      if (type == 'newVisitis') {
        this.totalData.userTotal = num
      } else if (type == 'messages') {
        this.totalData.certTotal = num
      } else if (type == 'purchases') {
        this.totalData.enterTotal = num
      } else if (type == 'shoppings') {
        this.totalData.contTotal = num
      }
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
