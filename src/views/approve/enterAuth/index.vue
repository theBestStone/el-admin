<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.orgName" clearable size="small" placeholder="输入企业名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="query.userName" clearable size="small" placeholder="输入授权人姓名搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-select v-model="query.state" clearable size="small" placeholder="审核状态" class="filter-item" @change="crud.toQuery">
          <el-option v-for="item in options1" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <el-input v-model="query.account" clearable size="small" placeholder="输入授权人手机号搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />

        <el-select v-model="query.authStatus" clearable size="small" placeholder="授权人角色" class="filter-item" @change="crud.toQuery">
          <el-option v-for="item in options3" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <date-range-picker v-model="query.createTime" class="date-item" />
        <rrOperation />
      </div>
      <crudOperation :permission="permission" />
    </div>
    <el-dialog append-to-body :close-on-click-modal="false" :visible="appInfoVisible" :before-close="appClose" title="审批详情" width="700px" destroy-on-close>
      <el-table ref="table" :data="tableData" row-key="id">
        <el-table-column label="审核人" prop="auditPerson" />
        <el-table-column label="审核时间" prop="updateTime" />
        <el-table-column label="审核理由" prop="auditAdvice" />
        <el-table-column label="审核状态" prop="auditState">
          <template slot-scope="scope">
            {{ scope.row.auditState == 1 ? '待审核' : scope.row.auditState == 2 ? '已驳回' : scope.row.auditState == 10 ? '审核通过' : '' }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :visible="appVisible" :before-close="appClose" :title="crud.status.title" width="1200px" destroy-on-close>
      <el-divider content-position="left"><span style="font-size: 20px;color:#ccc;">基本信息</span></el-divider>
      <div class="appWrapper">
        <div class="appleft">
          <el-form ref="form" :model="formData" :rules="rules" size="small" label-width="130px">
            <el-form-item label="授权人姓名:" prop="idNumber">
              {{ appInfo.idNumber }}
            </el-form-item>
            <el-form-item label="授权角色:" prop="entName">
              {{ appInfo.adminType == 1 ? '企业授权代理人' : appInfo.adminType == 2 ? '企业法定代理人' : '' }}
            </el-form-item>
            <el-form-item label="授权人身份证:" prop="idNumber">
              {{ appInfo.idNumber }}
            </el-form-item>
            <el-form-item label="授权人手机号:" prop="account">
              {{ appInfo.account }}
            </el-form-item>
            <el-form-item label="代表企业名称:" prop="orgName">
              {{ appInfo.orgName }}
            </el-form-item>
            <el-form-item label="法人姓名:" prop="legalPerson">
              {{ appInfo.legalPerson }}
            </el-form-item>
            <el-form-item label="备注:" prop="auditOpinion">
              {{ appInfo.auditOpinion }}
            </el-form-item>
            <el-form-item label="审批原因:" prop="auditAdvice">
              <el-input type="textarea" :rows="2" placeholder="请输入审核原因" @input="change($event)" v-model="formData.auditAdvice" :disabled="appInfo.state != 1"> </el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="text" @click="appVisible = false">取消</el-button>
            <el-button :loading="crud.status.cu === 2" type="primary" @click="addSysAudit('10')" v-if="appInfo.state == 1">审核通过</el-button>
            <el-button :loading="crud.status.cu === 2" type="danger" @click="addSysAudit('2')" v-if="appInfo.state == 1">审核驳回</el-button>
          </div>
        </div>
        <div class="appright">
          <el-divider direction="vertical"></el-divider>
          <div>
            <el-image alt="企业认证申请表" :src="`${baseUrl}/api-file/file/preview/${appInfo.authFileId}?access_token=${this.getToken}`" :preview-src-list="[`${baseUrl}/api-file/file/preview/${appInfo.authFileId}?access_token=${this.getToken}`]"></el-image>
            <p>企业认证申请表</p>
          </div>
          <div>
            <el-image alt="营业执照图片" :src="`${baseUrl}/api-file/file/preview/${appInfo.businessLicenseId}?access_token=${this.getToken}`" :preview-src-list="[`${baseUrl}/api-file/file/preview/${appInfo.businessLicenseId}?access_token=${this.getToken}`]"></el-image>
            <p>营业执照图片</p>
          </div>
        </div>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" lazy :load="getDeptDatas" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" :data="crud.data" row-key="id" @select="crud.selectChange" @select-all="crud.selectAllChange" @selection-change="crud.selectionChangeHandler">
      <el-table-column label="企业名称" prop="orgName" />
      <el-table-column label="授权人姓名" prop="userName" />
      <el-table-column label="授权人角色" prop="adminType">
        <template slot-scope="scope">
          {{ scope.row.adminType == 1 ? '企业授权代理人' : scope.row.adminType == 2 ? '企业法定代理人' : '' }}
        </template>
      </el-table-column>
      <el-table-column label="授权人手机号" prop="account" />
      <el-table-column label="创建时间" prop="createTime" :formatter="$util.YYMM" />
      <el-table-column label="审核时间" prop="updateTime" />
      <el-table-column label="审核状态" prop="state">
        <template slot-scope="scope">
          {{ scope.row.state == 1 ? '待审核' : scope.row.state == 2 ? '已驳回' : scope.row.state == 10 ? '审核通过' : '' }}
        </template>
      </el-table-column>
      <el-table-column label="审批详情">
        <template slot-scope="scope">
          <el-button type="success" size="mini" plain @click="toView(scope.row)">审批详情</el-button>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPer(['admin', 'auth:app', 'auth:view'])" label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" v-if="scope.row.state == 1" @click="toApprove(scope.row,2)">审核</el-button>
          <el-button type="primary" size="mini" v-else @click="toApprove(scope.row,-1)">查看</el-button>
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
import { mapState } from 'vuex'
import { getToken } from '@/utils/auth'
const defaultForm = { id: null, name: null, isTop: '1', subCount: 0, pid: null, deptSort: 999, enabled: 'true' }
export default {
  name: 'Dept',
  components: { Treeselect, crudOperation, rrOperation, udOperation, DateRangePicker, pagination },
  cruds() {
    return CRUD({
      title: '审核',
      url: common.base64DeCode('4AA10430E6DB331733E96AD10B5311F623199DB598CD93952585338092796E8D'),//'operate/findSysAuditAll',
      crudMethod: { ...crudCusEnt },
      optShow: {
        add: false,
        edit: false,
        del: false,
        reset: true
      }
    })
  },
  computed: {
    ...mapState(['user'])
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
        { key: '1', display_name: '待审核' },
        { key: '2', display_name: '已驳回' },
        { key: '10', display_name: '审核通过' }
      ],
      options2: [
        { key: '0', display_name: '跟进中' },
        { key: '1', display_name: '已加入黑名单' }
      ],
      options3: [
        { key: '1', display_name: '企业授权代理人' },
        { key: '2', display_name: '企业法定代理人' }
      ],
      appVisible: false,
      textarea: '',
      appInfo: {},
      formData: {},
      baseUrl: process.env.VUE_APP_BASE_API,
      appInfoVisible: false,
      tableData: [],
      getToken:getToken()
    }
  },
  methods: {
    getDeptDatas(tree, treeNode, resolve) {
      const params = { pid: tree.id }
      setTimeout(() => {
        crudCusEnt.getDepts(params).then(res => {
          resolve(res.content)
        })
      }, 100)
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {},
    getSupDepts(id) {
      crudCusEnt.getDeptSuperior(id).then(res => {
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
      crudCusEnt.getDepts({ enabled: true }).then(res => {
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
        crudCusEnt.getDepts({ enabled: true, pid: parentNode.id }).then(res => {
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
          crudCusEnt
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
    toApprove(data,type) {
      console.log(this.crud)
      if(type==-1){
        this.crud.title = "查看"
        console.log(this.$crud)
      }else{
        this.$crud.title = "审核"
      }
      console.log(data)
      this.appInfo = data
      this.formData.eid = data.eid
      this.formData.auditAdvice = data.state == 1 ? '' : data.auditOpinion
      this.appVisible = true
    },
    addSysAudit(auditState) {
      if (auditState == 2 && !this.formData.auditAdvice) return this.$message.error('请填写审核意见！')
 
      crudCusEnt.addSysAudit({ auditState, ...this.formData, auditPerson: this.user.user.sysUserName }).then(res => {
        if (res && res.code == 200) {
          this.appVisible = false
          this.formData = {}
          this.crud.toQuery()
          return this.$message.success(res.message)
        }
        this.$message.error('审批失败！')
      })
    },
    appClose() {
      this.formData = {}
      this.appVisible = false
      this.appInfoVisible = false
      this.tableData = []
    },
    toView(data) {
      console.log(data)
      crudCusEnt.findSysAudit({ eid: data.eid }).then(res => {
        this.appInfoVisible = true
        this.tableData = res.data
      })
    },
    change(e) {
      this.$forceUpdate()
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
.appWrapper {
  display: flex;
}
.appWrapper .appleft,
.appWrapper .appright {
  width: 50%;
}
.appWrapper ::v-deep .dialog-footer {
  text-align: center;
  padding-right: 140px;
  box-sizing: border-box;
}
.appright {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  box-sizing: border-box;
}
.appright > div:not(.el-divider) {
  width: 45%;
  text-align: center;
}
.appright div img {
  width: 100%;
}
.appright .el-divider {
  height: 100%;
}
</style>
