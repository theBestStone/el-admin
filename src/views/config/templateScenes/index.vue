<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-select v-model="query.area" placeholder="请选择" @change="crud.toQuery" style="float: left;margin-right: 10px;">
          <el-option
            v-for="item in selectOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input v-model="query.title" clearable size="small" placeholder="输入场景名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation />
      </div>
      <crudOperation :permission="permission" />
    </div>
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible="crud.status.cu > 0" :title="crud.status.title" width="600px">
      <el-form ref="form" inline :model="form" :rules="rules" size="small" label-width="120px">
        <el-form-item label="业务类型名称" prop="sceneTypeName" verify>
          <el-input v-model="form.sceneTypeName" placeholder="请输入业务类型名称" style="width: 330px;"></el-input>
        </el-form-item>
        <el-form-item label="展示状态" prop="showStatus" verify>
          <el-radio-group v-model="form.showStatus">
            <el-radio :label="1">展示</el-radio>
            <el-radio :label="0">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" row-key="id" @select="crud.selectChange" @select-all="crud.selectAllChange" @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column label="业务类型编号" prop="sceneTypeNo" />
      <el-table-column label="场景名称" prop="sceneName" />
      <el-table-column label="展示区域">
        <template slot-scope="scope">
          <span>{{ scope.row.area === 1? '商家': scope.row.area === 2? '门户' : '' }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="状态" prop="showStatus" />
      <el-table-column label="创建时间" prop="createTime" /> -->
      <!-- <el-table-column label="文件名称" prop="msgTitle" />
      <el-table-column label="发布人员" prop="publicName" />
      <el-table-column label="上传时间" prop="publicTime" />
      <el-table-column label="生效时间" prop="effectiveTime" />
      <el-table-column label="下载文件系统" prop="systemName" /> -->
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
import crudDow from '@/api/config/scenes'
import Treeselect from '@riophae/vue-treeselect';import common from '@/assets/js/common.js';
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import CRUD, { presenter, header, form, crud } from '@/components/Crud/crudNumber'
import rrOperation from '@/components/Crud/RR.operation'
import crudOperation from '@/components/Crud/CRUD.operation'
import udOperation from '@/components/Crud/UD.operation'
import DateRangePicker from '@/components/DateRangePicker'
import pagination from '@/components/Crud/Pagination'
import { setTimeout } from 'timers';
import { getToken } from '@/utils/auth'
import Cookies from 'js-cookie'
const defaultForm = { msgTitle: '', effectiveDate: '', viewApp: '', fileId: '',fileList: [] }

export default {
  name: 'Dept',
  components: { Treeselect, crudOperation, rrOperation, udOperation, DateRangePicker, pagination },
  cruds() {
    return CRUD({
      title: '场景业务类型',
      url: common.base64DeCode('D191DD96C3F2DBF849D9BEBE33F858F0FBF875C9DB50777B7A1B0B3964F3F94F'),//'scene/findSceneList',
      crudMethod: { ...crudDow },
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
      rules: {
        sceneTypeName: [{ required: true, message: '请输入业务类型名称', trigger: 'blur' }],
        showStatus: [{ required: true, message: '请选择展示状态', trigger: 'blur', type: 'number' }]
      },
      permission: {
        add: ['admin', 'dept:add'],
        edit: ['admin', 'dept:edit'],
        // del: ['admin', 'dept:del']
      },
      selectOptions: [
        {
          label: '商家',
          value: 1
        },{
          label: '门户',
          value: 2
        },
      ]
    }
  },
  watch: {
  },
  created(){
  },
  methods: {
    [CRUD.HOOK.beforeRefresh](crud, form) {
      console.log(crud, form)
    },

    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
    },
    [CRUD.HOOK.beforeToEdit](crud, form) {
    },
    // 提交前的验证
    [CRUD.HOOK.afterValidateCU]() {
      return true
    },
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
