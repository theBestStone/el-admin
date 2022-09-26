<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- <div v-if="crud.props.searchToggle"> -->
        <!-- 搜索 -->
        <!-- <el-input v-model="query.title" clearable size="small" placeholder="输入文件名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <date-range-picker v-model="query.createTime" class="date-item" />
        <rrOperation />
      </div> -->
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
            <el-radio :label="1">显示</el-radio>
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
      <el-table-column label="业务类型名称" prop="sceneTypeName" />
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.showStatus === 1? '显示': '隐藏'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" />
      <el-table-column v-if="checkPer(['admin', 'dept:edit', 'dept:del'])" label="操作" width="60px" align="center" fixed="right">
        <template slot-scope="scope">
          <udOperation ref="udTemplate" :isDel="false" :data="scope.row" :permission="permission" :disabled-dle="scope.row.id === 1" msg="确定删除？" />
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
const defaultForm = { sceneTypeNo: '', sceneTypeName: '', showStatus: 1 }

export default {
  name: 'Dept',
  components: { Treeselect, crudOperation, rrOperation, udOperation, DateRangePicker, pagination },
  cruds() {
    return CRUD({
      title: '场景业务类型',
      url: common.base64DeCode('07EC2C3D39A8CF1E8D163E4329B8FA2B3B1F12EB4A672F48693B848C0DC5745E'),//'sceneType/findSceneTypeList',
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
      depts: [],
      action:"",
      uploadData:{
            channelNo:"anysign",
            storeType:1
        },
      rules: {
        sceneTypeName: [{ required: true, message: '请输入业务类型名称', trigger: 'blur' }],
        showStatus: [{ required: true, message: '请输入序号', trigger: 'blur', type: 'number' }]
      },
      permission: {
        add: ['admin', 'dept:add'],
        edit: ['admin', 'dept:edit'],
        del: ['admin', 'dept:del']
      },
      radio: '',
      fileList: [],
      checkList: [],
      baseUrl: process.env.VUE_APP_BASE_API,
      getToken:getToken()
    }
  },
  watch: {
  },
  mounted(){
  },
  methods: {
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
    },
    [CRUD.HOOK.beforeToEdit](crud, form) {
      // console.log(crud, form);
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
