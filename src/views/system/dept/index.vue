<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.orgCode" clearable size="small" placeholder="输入部门编码搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="query.orgName" clearable size="small" placeholder="输入部门名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-select v-model="query.state" clearable size="small" placeholder="状态" class="filter-item" style="width: 90px" @change="crud.toQuery">
          <el-option v-for="item in enabledTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <rrOperation />
      </div>
      <crudOperation :permission="permission" />
    </div>
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible="crud.status.cu > 0" :title="crud.status.title" width="500px">
      <el-form ref="form" inline :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="所属企业" prop="parentId" verify>
          <el-select v-model="form.parentId" placeholder="请选择" style="width: 370px;">
            <el-option v-for="item in options" :key="item.id" :label="item.entName" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门名称" prop="orgName" verify>
          <el-input v-model="form.orgName" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="状态" prop="state" verify>
          <el-select v-model="form.state" clearable size="small" placeholder="状态" class="filter-item" style="width: 370px;" @change="crud.toQuery">
            <el-option v-for="item in enabledTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门描述" prop="depict">
          <el-input type="textarea" v-model="form.depict" style="width: 370px;" />
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
      <el-table-column :selectable="checkboxT" type="selection" width="55" />
      <el-table-column label="部门编码" prop="orgCode" />
      <el-table-column label="企业名称" prop="entName" />
      <el-table-column label="部门名称" prop="orgName" />
      <el-table-column label="部门描述" prop="depict" />
      <el-table-column label="状态" prop="state">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state == 0" type="success">开启</el-tag>
          <el-tag v-else type="danger">关闭</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" :formatter="$util.YYMM" label="创建日期" />
      <el-table-column v-if="checkPer(['admin', 'dept:add'])" label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <udOperation :data="scope.row" :permission="permission" msg="确定删除？" />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import crudDept from '@/api/system/dept'
import enterDept from '@/api/system/enter'
import Treeselect from '@riophae/vue-treeselect';import common from '@/assets/js/common.js';
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import CRUD, { presenter, header, form, crud } from '@/components/Crud/crud'
import rrOperation from '@/components/Crud/RR.operation'
import crudOperation from '@/components/Crud/CRUD.operation'
import udOperation from '@/components/Crud/UD.operation'
import DateRangePicker from '@/components/DateRangePicker'
import pagination from '@/components/Crud/Pagination'

const defaultForm = { depict: '', orgCode: '', orgName: '', parentId: '', entName: '', state: '0' }
export default {
  name: 'Dept',
  components: { Treeselect, crudOperation, rrOperation, udOperation, DateRangePicker, pagination },
  cruds() {
    return CRUD({
      title: '部门',
      url: common.base64DeCode('54D6C7DCBDAFE1E1FD6B5135A6FF71D0ED0B9B4FA8E087BB15019A481BA6C511'),//'sys-org/findOrgList',
      crudMethod: { ...crudDept },
      optShow: {
        add: true,
        edit: true,
        del: true,
        reset: true,
        download: false
      },
      query: { orgCode: '', orgName: '', permission: '', state: '0' }
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
      enabledTypeOptions: [
        { key: '0', display_name: '开启' },
        { key: '1', display_name: '关闭' }
      ],
      options: []
    }
  },
  methods: {
    getDeptDatas(tree, treeNode, resolve) {
      const params = { pid: tree.id }
      setTimeout(() => {
        crudDept.getDepts(params).then(res => {
          resolve(res.content)
        })
      }, 100)
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      enterDept.findEntList({ pageNum: '1', pageSize: '999999' }).then(res => {
        this.options = res.data.list || []
      })
      // if (form.pid !== null) {
      //   form.isTop = '0'
      // } else if (form.id !== null) {
      //   form.isTop = '1'
      // }
      // form.enabled = `${form.enabled}`
      // if (form.id != null) {
      //   this.getSupDepts(form.id)
      // } else {
      //   this.getDepts()
      // }
    },
    getSupDepts(id) {
      crudDept.getDeptSuperior(id).then(res => {
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
      crudDept.getDepts({ enabled: true }).then(res => {
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
        crudDept.getDepts({ enabled: true, pid: parentNode.id }).then(res => {
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
      this.form.entName = this.options.find(item => item.id == this.form.parentId).entName
      console.log(this.form.parentId)
      this.form.parentId = this.form.parentId + ''

      // if (this.form.pid !== null && this.form.pid === this.form.id) {
      //   this.$message({
      //     message: '上级部门不能为空',
      //     type: 'warning'
      //   })
      //   return false
      // }
      // if (this.form.isTop === '1') {
      //   this.form.pid = null
      // }
      return true
    },
    [CRUD.HOOK.afterAddError]() {
      this.form.parentId = Number(this.form.parentId)
    },
    [CRUD.HOOK.beforeToEdit]() {
      this.form.parentId = Number(this.form.parentId)
    },

    // 改变状态
    changeEnabled(data, val) {
      this.$confirm('此操作将 "' + this.dict.label.dept_status[val] + '" ' + data.name + '部门, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          crudDept
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
