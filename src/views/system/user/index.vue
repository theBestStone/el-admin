<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--侧边部门数据-->
      <!-- <el-col :xs="9" :sm="6" :md="5" :lg="4" :xl="4">
        <div class="head-container">
          <el-input v-model="deptName" clearable size="small" placeholder="输入部门名称搜索" prefix-icon="el-icon-search" class="filter-item" @input="getDeptDatas" />
        </div>
        <el-tree :data="deptDatas" :load="getDeptDatas" :props="defaultProps" :expand-on-click-node="false" lazy @node-click="handleNodeClick" />
      </el-col> -->
      <!--用户数据-->
      <el-col>
        <!--工具栏-->
        <div class="head-container">
          <div v-if="crud.props.searchToggle">
            <!-- 搜索 -->
            <el-input v-model="query.sysUserCode" clearable size="small" placeholder="输入用户编号搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
            <el-input v-model="query.sysUserName" clearable size="small" placeholder="输入用户姓名搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
            <!-- <date-range-picker v-model="query.createTime" class="date-item" /> -->
            <el-select v-model="query.state" clearable size="small" placeholder="状态" class="filter-item" style="width: 90px" @change="crud.toQuery">
              <el-option v-for="item in enabledTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
            </el-select>
            <el-select v-model="query.sysEntId" clearable size="small" placeholder="所属企业" class="filter-item" style="width: 200px" @change="crud.toQuery">
              <el-option v-for="item in options" :key="item.id" :label="item.entName" :value="item.id"> </el-option>
            </el-select>
            <el-select v-model="query.sysOrgId" clearable size="small" placeholder="所属部门" class="filter-item" style="width: 200px" @change="crud.toQuery">
              <el-option v-for="item in options3" :key="item.id" :label="item.orgName" :value="item.id"> </el-option>
            </el-select>
            <rrOperation />
          </div>
          <crudOperation show="" :permission="permission" />
        </div>
        <!--表单渲染-->
        <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible="crud.status.cu > 0" :title="crud.status.title" width="500px">
          <el-form ref="form" inline :model="form" :rules="rules" size="small" label-width="80px">
            <el-form-item label="用户名" prop="sysUserName" verify>
              <el-input v-model="form.sysUserName" style="width: 370px;" />
            </el-form-item>
            <el-form-item label="手机号" prop="sysAccount" verify phone>
              <el-input v-model="form.sysAccount" style="width: 370px;" />
            </el-form-item>
            <el-form-item label="企业邮箱" prop="sysEntEmail" verify email>
              <el-input v-model="form.sysEntEmail" style="width: 370px;" />
            </el-form-item>
            <el-form-item label="角色" prop="roles" verify>
              <el-select v-model="form.roles" multiple placeholder="请选择" style="width: 370px;">
                <el-option v-for="item in options2" :key="item.id" :label="item.roleName" :value="item.id"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属企业" prop="sysEntId" verify>
              <el-select v-model="form.sysEntId" placeholder="请选择" style="width: 370px;" @change="sysEntIdChange(form.sysEntId, true)">
                <el-option v-for="item in options" :key="item.id" :label="item.entName" :value="item.id"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属部门" prop="sysOrgId" verify>
              <el-select v-model="form.sysOrgId" placeholder="请选择" style="width: 370px;">
                <el-option v-for="item in options3" :key="item.id" :label="item.orgName" :value="item.id"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用户状态" prop="state" verify>
              <el-select v-model="form.state" clearable size="small" placeholder="状态" class="filter-item" style="width: 370px;" @change="crud.toQuery">
                <el-option v-for="item in enabledTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
              </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" v-model="form.remark" style="width: 370px;" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="text" @click="crud.cancelCU">取消</el-button>
            <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
          </div>
        </el-dialog>
        <!--表格渲染-->
        <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
          <el-table-column :selectable="checkboxT" type="selection" width="55" />
          <el-table-column :show-overflow-tooltip="true" prop="sysUserCode" label="用户编号" />
          <el-table-column :show-overflow-tooltip="true" prop="sysUserName" label="用户姓名" />
          <el-table-column :show-overflow-tooltip="true" prop="sysAccount" label="手机号" />
          <el-table-column :show-overflow-tooltip="true" prop="sysEntEmail" label="企业邮箱" />
          <el-table-column :show-overflow-tooltip="true" prop="sysEntName" label="所属企业" />
          <el-table-column prop="roleNames" label="角色">
            <template slot-scope="scope">
              <el-tag v-for="item in scope.row.roleNames" :key="item">{{ item }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="state" label="状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.state == 0" type="success">开启</el-tag>
              <el-tag v-else type="danger">关闭</el-tag>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="remark" label="备注" />
          <el-table-column v-if="checkPer(['admin', 'dept:edit', 'dept:del'])" label="操作" width="130px" align="center" fixed="right">
            <template slot-scope="scope">
              <!-- :disabled-dle="scope.row.id === 1"    禁用某个id -->
              <udOperation :data="scope.row" :permission="permission" msg="确定删除？" />
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <pagination />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import crudEnter from '@/api/system/enter'
import crudRole from '@/api/system/role'
import crudDept from '@/api/system/dept'
import crudUser from '@/api/system/user'
import { isvalidPhone } from '@/utils/validate'
import { getDepts, getDeptSuperior } from '@/api/system/dept'
import { getAll, getLevel } from '@/api/system/role'
import { getAllJob } from '@/api/system/job'
import CRUD, { presenter, header, form, crud } from '@/components/Crud/crud'
import rrOperation from '@/components/Crud/RR.operation'
import crudOperation from '@/components/Crud/CRUD.operation'
import udOperation from '@/components/Crud/UD.operation'
import pagination from '@/components/Crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'
import Treeselect from '@riophae/vue-treeselect';import common from '@/assets/js/common.js';
import { mapGetters } from 'vuex'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
let userRoles = []
let userJobs = []
const defaultForm = { remark: '', roles: [], state: '', sysAccount: '', sysEntEmail: '', sysEntId: '', sysEntName: '', sysOrgId: '', sysOrgName: '', sysUserName: '' }
export default {
  name: 'User',
  components: { Treeselect, crudOperation, rrOperation, udOperation, pagination, DateRangePicker },
  cruds() {
    return CRUD({
      title: '用户',
      url: common.base64DeCode('857A1D1CC5929AB6E0D0121D9C065842DD0AAC9A6DD444A9848C5617EB1E8BFA'),//'sys-user/findAllUser',
      crudMethod: { ...crudUser },
      query: {
        sysUserCode: '',
        sysUserName: '',
        sysOrgId: '',
        sysEntId: '',
        state: ''
      }
    })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 数据字典
  // dicts: ['user_status'],
  watch: {
    'query.sysEntId'(val) {
      this.sysEntIdChange(val)
    }
  },
  data() {
    // 自定义验证
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入电话号码'))
      } else if (!isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    return {
      height: document.documentElement.clientHeight - 180 + 'px;',
      deptName: '',
      depts: [],
      deptDatas: [],
      jobs: [],
      level: 3,
      // roles: [],
      jobDatas: [],
      roleDatas: [], // 多选时使用
      defaultProps: { children: 'children', label: 'name', isLeaf: 'leaf' },
      permission: {
        add: ['admin', 'user:add'], //admin以及拥有user:add的角色可使用
        edit: ['admin', 'user:edit'],
        del: ['admin', 'user:del']
      },
      enabledTypeOptions: [
        { key: '0', display_name: '开启' },
        { key: '1', display_name: '关闭' }
      ],
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        phone: [{ required: true, trigger: 'blur', validator: validPhone }]
      },
      options: [],
      options2: [],
      options3: []
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  created() {
    console.log(this.checkPer(['admin', 'user:edit', 'user:del']))
    this.crud.msg.add = '新增成功，默认密码：123456'
  },
  mounted: function() {
    const that = this
    crudEnter.getDicts().then(res => {
      this.options = res.data
      this.options.forEach(item => {
        item.id = item.id + ''
      })
    })
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + 'px;'
    }
  },
  methods: {
    changeRole(value) {
      userRoles = []
      value.forEach(function(data, index) {
        const role = { id: data }
        userRoles.push(role)
      })
    },
    changeJob(value) {
      userJobs = []
      value.forEach(function(data, index) {
        const job = { id: data }
        userJobs.push(job)
      })
    },
    deleteTag(value) {
      userRoles.forEach(function(data, index) {
        if (data.id === value) {
          userRoles.splice(index, value)
        }
      })
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      crudRole.findRoleList({ pageNum: '1', pageSize: '999999' }).then(res => {
        this.options2 = res.data.list
      })
      // crudDept.findOrgList({ pageNum: '1', pageSize: '999999' }).then(res => {
      //   this.options3 = res.data.list
      // })
    },
    [CRUD.HOOK.beforeSubmit]() {
      this.form.sysEntName = this.options.find(item => item.id == this.form.sysEntId).entName || ''
      this.form.sysOrgName = this.options3.find(item => item.id == this.form.sysOrgId).orgName || ''
      this.form.sysEntId = this.form.sysEntId + ''
      this.form.sysOrgId = this.form.sysOrgId + ''
      this.form.roles = this.form.roles.map(item => String(item))
    },
    [CRUD.HOOK.afterAddError]() {
      this.form.sysEntName = ''
      this.form.sysOrgName = ''
      // this.form.sysEntId = Number(this.form.sysEntId)
      // this.form.sysOrgId = Number(this.form.sysOrgId)
      this.form.roles = this.form.roles.map(item => Number(item))
    },
    [CRUD.HOOK.beforeToEdit]() {
      // this.form.sysEntId = Number(this.form.sysEntId)
      // this.form.sysOrgId = Number(this.form.sysOrgId)
      this.sysEntIdChange(this.form.sysEntId, true)
      this.form.roles = this.form.roles.map(item => Number(item))
    },
    // 获取左侧部门数据
    getDeptDatas(node, resolve) {
      const sort = 'id,desc'
      const params = { sort: sort }
      if (typeof node !== 'object') {
        if (node) {
          params['name'] = node
        }
      } else if (node.level !== 0) {
        params['pid'] = node.data.id
      }
      setTimeout(() => {
        getDepts(params).then(res => {
          if (resolve) {
            resolve(res.content)
          } else {
            this.deptDatas = res.content
          }
        })
      }, 100)
    },
    getDepts() {
      getDepts({ enabled: true }).then(res => {
        this.depts = res.content.map(function(obj) {
          if (obj.hasChildren) {
            obj.children = null
          }
          return obj
        })
      })
    },
    getSupDepts(deptId) {
      getDeptSuperior(deptId).then(res => {
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
    // 获取弹窗内部门数据
    loadDepts({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        getDepts({ enabled: true, pid: parentNode.id }).then(res => {
          parentNode.children = res.content.map(function(obj) {
            if (obj.hasChildren) {
              obj.children = null
            }
            return obj
          })
          setTimeout(() => {
            callback()
          }, 200)
        })
      }
    },
    // 切换部门
    handleNodeClick(data) {
      if (data.pid === 0) {
        this.query.deptId = null
      } else {
        this.query.deptId = data.id
      }
      this.crud.toQuery()
    },
    // 改变状态
    changeEnabled(data, val) {
      this.$confirm('此操作将 "' + this.dict.label.user_status[val] + '" ' + data.username + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          crudUser
            .edit(data)
            .then(res => {
              this.crud.notify(this.dict.label.user_status[val] + '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
            })
            .catch(() => {
              data.enabled = !data.enabled
            })
        })
        .catch(() => {
          data.enabled = !data.enabled
        })
    },
    // 获取弹窗内角色数据
    getRoles() {
      getAll()
        .then(res => {
          this.roles = res
        })
        .catch(() => {})
    },
    // 获取弹窗内岗位数据
    getJobs() {
      getAllJob()
        .then(res => {
          this.jobs = res.content
        })
        .catch(() => {})
    },
    // 获取权限级别
    getRoleLevel() {
      getLevel()
        .then(res => {
          this.level = res.level
        })
        .catch(() => {})
    },
    checkboxT(row, rowIndex) {
      return true
    },
    sysEntIdChange(val, lock) {
      crudDept.findOrgByEntId({ entId: val + '' }).then(res => {
        if (lock) {
          this.options3 = res.data
          this.options3.forEach(element => {
            element.id = element.id + ''
          })
          console.log(this.options3)
          return
        }
        this.form.sysOrgId = ''
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
