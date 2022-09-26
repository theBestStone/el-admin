<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.entName" clearable size="small" placeholder="输入企业名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-select v-model="query.grade" clearable size="small" placeholder="客户等级" class="filter-item" @change="crud.toQuery">
          <el-option v-for="item in options1" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <el-select v-model="query.authStatus" clearable size="small" placeholder="认证状态" class="filter-item" @change="crud.toQuery">
          <el-option v-for="item in options2" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <el-input v-model="query.followPeople" clearable size="small" placeholder="输入跟进人搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <date-range-picker v-model="query.createTime" class="date-item" />
        <rrOperation />
      </div>
      <crudOperation :permission="permission" />
    </div>
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible="crud.status.cu > 0" :title="crud.status.title" width="500px">
      <el-form ref="form" inline :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="企业名称" prop="entName" verify>
          <el-input v-model="form.entName" style="width: 370px;" disabled />
        </el-form-item>
        <el-form-item label="认证状态" prop="authStatus" verify>
          <el-select v-model="form.authStatus" clearable size="small" placeholder="请选择" class="filter-item" @change="crud.toQuery" style="width: 370px;" disabled>
            <el-option v-for="item in options2" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="客户等级" prop="grade" verify>
          <el-select v-model="form.grade" clearable size="small" placeholder="请选择" class="filter-item" @change="crud.toQuery" style="width: 370px;">
            <el-option v-for="item in options1" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="跟进人" prop="followPeople" verify>
          <el-input v-model="form.followPeople" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="跟进状态" prop="followStatus" verify>
          <el-select v-model="form.followStatus" clearable size="small" placeholder="请选择" class="filter-item" @change="crud.toQuery" style="width: 370px;">
            <el-option v-for="item in options3" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="beforeClose" :visible="certVisible" title="查看证书" width="500px">
      <div style="text-align:center;font-size:20px;font-weight:700;">CA证书中心</div>
      <el-divider></el-divider>
      <div class="certWrapper">
        <p><span>颁发者</span>{{cretInfo.issuer}}</p>
        <p><span>序列号</span>{{cretInfo.serialNumber}}</p>
        <p><span>有效期</span>{{cretInfo.beginDate}} 至 {{cretInfo.endDate}}</p>
        <p><span>颁发给</span>{{cretInfo.serialNumber}}</p>
        <p><span>颁发机构</span>iTrusChina</p>
        <p><span>证书说明</span>数字证书由证书发行，具有安全唯一性</p>
        <p style="font-weight:200;">个人身份信息将用于申请数字证书</p>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" lazy :load="getDeptDatas" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" :data="crud.data" row-key="id" @select="crud.selectChange" @select-all="crud.selectAllChange" @selection-change="crud.selectionChangeHandler">
      <el-table-column :selectable="checkboxT" type="selection" width="55" />
      <el-table-column label="企业名称" prop="entName" />
      <el-table-column label="客户等级" prop="grade">
        <template slot-scope="scope">
          {{ scope.row.grade == 0 ? '普通用户' : '重要用户' }}
        </template>
      </el-table-column>
      <el-table-column label="认证状态" prop="authStatus">
        <template slot-scope="scope">
          {{ scope.row.authStatus == 0 ? '企业未认证' : '企业已认证' }}
        </template>
      </el-table-column>
      <el-table-column label="跟进人" prop="followPeople" />
      <el-table-column label="跟进状态及黑名单" prop="followStatus">
        <template slot-scope="scope">
          {{ scope.row.followStatus == 0 ? '跟进中' : '已加入黑名单' }}
        </template>
      </el-table-column>
      <el-table-column label="数字证书" prop="eid">
        <template slot-scope="scope">
          <el-button type="success" size="mini" plain @click="toViewCert(scope.row.eid)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" :formatter="$util.YYMM" />
      <el-table-column v-if="checkPer(['admin'])" label="操作" width="130px" align="center" fixed="right">
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
import crudCusEnt from '@/api/customer/enterprise'
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
      title: '部门',
      url: common.base64DeCode('A23448E63FA3FCC2F8F37C241E1FA10248FC068277F886C38CBE1E8F666DAF29'),//'sysCustomer/findSysCustomerList',
      crudMethod: { ...crudCusEnt },
      optShow: {
        add: false,
        edit: true,
        del: true,
        reset: true
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
        { key: '0', display_name: '普通用户' },
        { key: '1', display_name: '重要用户' }
      ],
      options2: [
        { key: '0', display_name: '未认证' },
        { key: '1', display_name: '已认证' }
      ],
      options3: [
        { key: '0', display_name: '跟进中' },
        { key: '1', display_name: '加入黑名单' }
      ],
      certVisible: false,
      cretInfo: {}
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
    [CRUD.HOOK.afterToCU](crud, form) {},
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
    },
    toViewCert(id) {
      crudCusEnt.findOrgCert({ id, type: 2 }).then(res => {
        this.certVisible = true
        this.cretInfo = res.data || {}
      })
    },
    beforeClose() {
       this.certVisible = false
       this.cretInfo = {}
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
.certWrapper {
  padding: 0 6px;
}
.certWrapper p {
  margin: 10px 0;
}
.certWrapper p span {
  font-weight: 700;
  margin-right: 6px;
}
</style>
