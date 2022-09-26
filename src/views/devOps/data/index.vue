<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-select v-model="query.systemName" clearable size="small" placeholder="操作系统" class="filter-item" @change="systemNameChange">
          <el-option v-for="item in options1" :key="item.systemName" :label="item.systemName" :value="item.systemName" />
        </el-select>
        <el-select v-model="query.oprModule" clearable size="small" placeholder="操作模块" class="filter-item" @change="oprModuleChange">
          <el-option v-for="item in options2" :key="item.oprModule" :label="item.oprModule" :value="item.oprModule" />
        </el-select>
        <el-select v-model="query.oprType" clearable size="small" placeholder="操作类型" class="filter-item" @change="crud.toQuery">
          <el-option v-for="item in options3" :key="item.oprType" :label="item.oprType" :value="item.oprType" />
        </el-select>
        <el-input v-model="query.oprUserPhone" clearable size="small" placeholder="输入操作账号搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-select v-model="query.oprStatus" clearable size="small" placeholder="操作状态" class="filter-item" @change="crud.toQuery">
          <el-option v-for="item in options4" :key="item.value" :label="item.name" :value="item.value" />
        </el-select>
        <date-range-picker v-model="query.createTime" class="date-item" />
        <rrOperation />
      </div>
      <crudOperation :permission="permission" />
    </div>
    <el-dialog append-to-body :close-on-click-modal="false" :visible="jsonVisible" :before-close="appClose" :title="crud.status.title" width="1100px" destroy-on-close>
      <div class="jsontitle">入参</div>
      <json-viewer v-model="requestStr" boxed :expand-depth="1"></json-viewer>
      <div class="jsontitle">出参</div>
      <json-viewer v-model="responseStr" boxed :expand-depth="1"></json-viewer>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="jsonVisible = false">取消</el-button>
      </div>
    </el-dialog>
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
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" lazy :load="getDeptDatas" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" :data="crud.data" row-key="id" @select="crud.selectChange" @select-all="crud.selectAllChange" @selection-change="crud.selectionChangeHandler">
      <!-- <el-table-column :selectable="checkboxT" type="selection" width="55" /> -->
      <el-table-column label="日志ID" prop="id" />
      <el-table-column label="操作系统" prop="systemName" />
      <el-table-column label="操作人" prop="oprUserName" />
      <el-table-column label="操作模块" prop="oprModule" />
      <el-table-column label="操作类型" prop="oprType" />
      <el-table-column label="操作账号" prop="oprUserPhone" />
      <el-table-column label="操作状态" prop="oprStatus">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.oprStatus == 0" type="success">操作正常</el-tag>
          <el-tag v-else type="danger">操作异常</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" prop="createTime" :formatter="$util.YYMM" />
      <el-table-column v-if="checkPer(['admin', 'user:edit', 'user:del'])" label="操作" width="115" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="toView(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import crudData from '@/api/devOps/data'
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
  components: { Treeselect, crudOperation, rrOperation, udOperation, DateRangePicker, pagination },
  cruds() {
    return CRUD({
      title: '数据',
      url: common.base64DeCode('0DBBA2E6A789F9B0C6DDA546B704B9AB5284FA737552D613819A972608C6188F'),//'sys-data-log/findDataLogList',
      crudMethod: { ...crudData },
      optShow: {
        add: false,
        edit: false,
        del: false,
        reset: true,
        download: true
      },
      query: {
        // pageNum: '1',
        // pageSize: '10',
        systemName: '',
        oprModule: '',
        oprType: '',
        oprUserPhone: '',
        oprStatus: '',
        createTime: []
      }
    })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 设置数据字典
  // dicts: ['dept_status'],
  async created() {
    const { data: res } = await crudData.findSystem()
    this.options1 = res
  },
  watch: {
    'query.systemName'(val) {
      if (!val) {
        this.options2 = []
        this.options3 = []
      }
    },
    'query.oprModule'(val) {
      if (!val) {
        this.options3 = []
      }
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
      options1: [],
      options2: [],
      options3: [],
      options4: [
        { value: '0', name: '操作正常' },
        { value: '1', name: '操作异常' }
      ],
      jsonVisible: false,
      requestStr: '',
      responseStr: ''
    }
  },
  methods: {
    getDeptDatas(tree, treeNode, resolve) {
      const params = { pid: tree.id }
      setTimeout(() => {
        crudData.getDepts(params).then(res => {
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
      crudData.getDeptSuperior(id).then(res => {
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
      crudData.getDepts({ enabled: true }).then(res => {
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
        crudData.getDepts({ enabled: true, pid: parentNode.id }).then(res => {
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
          crudData
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
    toView(data) {
      crudData.dataLogFindById({ id: data.id + '' }).then(res => {
        this.requestStr = JSON.parse(res.data.requestArgs)
        this.responseStr = JSON.parse(res.data.responseArgs)
        this.jsonVisible = true
      })
    },
    appClose() {
      this.jsonVisible = false
    },
    systemNameChange(val) {
      this.query.oprModule = ''
      this.query.oprType = ''
      if (!val) return this.crud.toQuery()
      crudData.findModulelist({ systemId: this.options1.find(item => item.systemName == val).id + '' }).then(res => {
        this.options2 = res.data
        this.crud.toQuery()
      })
    },
    oprModuleChange(val) {
      this.query.oprType = ''
      if (!val) return this.crud.toQuery()
      let { systemId, oprModule } = this.options2.find(item => item.oprModule == val)
      crudData.findTypelist({ systemId: systemId + '', oprModule }).then(res => {
        this.options3 = res.data
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
.jsontitle {
  font-size: 16px;
  padding: 18px 18px 18px 0;
}
</style>
