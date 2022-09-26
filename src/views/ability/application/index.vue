<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.apiName" clearable size="small" placeholder="输入产品名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-select v-model="query.status" clearable size="small" placeholder="启用状态" class="filter-item">
          <el-option v-for="item in options3" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <el-select v-model="query.apiType" clearable size="small" placeholder="类别" class="filter-item" >
          <el-option v-for="item in options4" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <date-range-picker v-model="query.createTime" class="date-item" />
        <rrOperation />
      </div>
      <crudOperation :permission="permission" />
    </div>
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible="crud.status.cu > 0" :title="crud.status.title" width="1000px">
      <el-form ref="form" :model="form" :disabled="crud.status.view"  :rules="rules" size="small" label-width="80px">
        <el-form-item label="产品名称" prop="apiName" verify>
          
          <el-input v-model="form.apiName" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="产品简述" prop="apiDesc" verify>
          <el-input v-model="form.apiDesc" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="产品类别" prop="apiType" verify>
         <el-radio-group v-model="form.apiType" style="width: 370px">
            <el-radio label="0">标准版API</el-radio>
            <el-radio label="1">个性化API</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="传参方式" prop="requestMethod" verify>
          <el-select v-model="form.requestMethod" placeholder="请选择" style="width:370px">
            <el-option v-for="item in options" :key="item.value" :label="item.display_name" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请求方式" prop="paramMethod" verify>
          <el-select v-model="form.paramMethod" placeholder="请选择" style="width:370px">
            <el-option v-for="item in options1" :key="item.value" :label="item.display_name" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="正式地址" prop="apiUrl" verify>
          <el-input v-model="form.apiUrl" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="接口文档" prop="fileId" verify>
          <el-upload class="upload-demo" name="file" :limit="1" :on-change="handleChange" action="#" :on-exceed="on_exceed" :on-preview="handlePreview" :http-request="fileSuccess" :on-remove="handleRemove_accessory" @on-error="handleError_accessory" :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          <el-input v-show="false" v-model="form.fileId"></el-input>
        </el-form-item>
        <el-form-item label="配置字段" prop="ce" verify>
          <input type="hidden" name="ce" v-model="form.ce">
          <el-button size="mini" type="primary" v-if="$refs.fieldRef && $refs.fieldRef.dataArr && $refs.fieldRef.dataArr.length == 0" @click="addConfig">添加配置字段</el-button>
          <config-field ref="fieldRef" :tableData="params"></config-field>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button v-if="!crud.status.view" :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" lazy :load="getDeptDatas" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" :data="crud.data" row-key="id" @select="crud.selectChange" @select-all="crud.selectAllChange" @selection-change="crud.selectionChangeHandler">
      <el-table-column :selectable="checkboxT" type="selection" width="55" />
      <el-table-column label="产品名称" prop="apiName" />
      <el-table-column label="产品描述" prop="apiDesc" />
      <el-table-column label="产品编号" prop="apiNo" />
      <el-table-column label="产品类别" prop="apiType">
        <template slot-scope="scope">
           {{scope.row.apiType==0?'标准版API':'个性化API'}}
        </template>
      </el-table-column>
      <el-table-column label="启用时间" prop="enableTime" :formatter="$util.YYMM" />
      <el-table-column label="启用状态" align="center" prop="status">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" active-color="#409EFF" :active-value="0" :inactive-value="1" inactive-color="#F56C6C" @change="changeEnabled(scope.row, scope.row.status)" />
        </template>
      </el-table-column>
      <el-table-column v-if="checkPer(['admin', 'user:edit', 'user:del'])" label="操作" width="150" align="center" fixed="right">
        <template slot-scope="scope">
          <udOperation :data="scope.row" :permission="permission" :disabled-dle="scope.row.id === 1" msg="确定删除？" />
            <el-button style="float:left" v-permission="permission.view" :loading="crud.status.cu === 2" size="mini" type="primary" icon="el-icon-view" class="btn-left" @click="crud.toEdit(scope.row,true)" />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import pagination from '@/components/Crud/Pagination'
import crudApplication from '@/api/ability/application'
import Treeselect from '@riophae/vue-treeselect';import common from '@/assets/js/common.js';
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import CRUD, { presenter, header, form, crud } from '@/components/Crud/crud'
import rrOperation from '@/components/Crud/RR.operation'
import crudOperation from '@/components/Crud/CRUD.operation'
import udOperation from '@/components/Crud/UD.operation'
import DateRangePicker from '@/components/DateRangePicker'
import ConfigField from '@/components/ConfigField'
import { fileUpload, fileDetail } from '@/api/file'
import { getToken } from '@/utils/auth'
const defaultForm = { apiName: '', apiNo: '', apiDesc: '',apiType:'', apiUrl: '', fileId: '', requestMethod: '', paramMethod: '', params: '',ce:1 }
export default {
  name: 'Dept',
  components: { Treeselect, crudOperation, rrOperation, udOperation, DateRangePicker, ConfigField,pagination },
  cruds() {
    return CRUD({
      title: '产品',
      url: common.base64DeCode('57ADBB0A8B95B9B487103D8F299B7030E506494CE9D93612BB3D04D3D3EF9799'),//'api-openapi/openApi/openApiList',
      crudMethod: { ...crudApplication },
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
  watch: {
    params(val) {
      console.log(val)
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
        add: ['admin'],
        edit: ['admin'],
        view: ['admin'],
        del: [false]
      },
      fileList: [],
      params: [
        {
          code: this.guid(),
          hasChildren: 1,
          children: [
            {
              code: this.guid(),
              hasChildren: 1,
              children: [
                {
                  code: this.guid(),
                  hasChildren: 0
                }
              ]
            },
            {
              code: this.guid(),
              hasChildren: 1,
              children: [
                {
                  code: this.guid(),
                  hasChildren: 0
                }
              ]
            }
          ]
        },
        {
          code: this.guid(),
          hasChildren: 1,
          children: [
            {
              code: this.guid(),
              hasChildren: 0
            }
          ]
        }
      ],
      params: [
        {
          code: this.guid().trim(),
          hasChildren: 0
        }
      ],
      expandRowKeys: [],
      options: [
        { value: 'get', display_name: 'GET' },
        { value: 'post', display_name: 'POST' },
        { value: 'put', display_name: 'PUT' },
        { value: 'delete', display_name: 'DELETE' }
      ],
      options1: [
        { value: 'params', display_name: 'PARAMS' },
        { value: 'form', display_name: 'FORM' },
        { value: 'json', display_name: 'JSON' }
      ],
      options3: [
        { key: '0', display_name: '启用' },
        { key: '1', display_name: '禁用' }
      ],
      options4: [
        { key: '0', display_name: '标准版API' },
        { key: '1', display_name: '个性化API' }
      ],
      baseUrl: process.env.VUE_APP_BASE_API
    }
  },
  methods: {
    getDeptDatas(tree, treeNode, resolve) {
      setTimeout(() => {
        resolve(this.childrenNode)
      }, 100)
      // const params = { pid: tree.id }
      // setTimeout(() => {
      //   crudApplication.getDepts(params).then(res => {
      //     resolve(res.content)
      //   })
      // }, 100)
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      this.params = [
        {
          code: this.guid().trim(),
          hasChildren: 0
        }
      ]
      return true
    },
    [CRUD.HOOK.beforeToAdd](crud, form) {
      console.log(crud,form)
      this.fileList = [];
    },
    [CRUD.HOOK.beforeToEdit](crud, form) {
    
      crudApplication.openApiDetail({ id: form.id }).then(res => {
        this.params = res.data.params
        fileDetail({ id: res.data.fileId }).then(result => {
          
          this.fileList = [{ name: result.data.name, url: this.baseUrl+this.$common.base64DeCode('5A0B2E7581A5CABE1789C8824AAC068A5A89D427606A3CA02E064D28C36F70DF')+res.data.fileId+'?access_token='+getToken()  }]///api-file/file/preview/
        })
        return true
      })
    },
    [CRUD.HOOK.beforeSubmit](crud, form) {
      this.form.params = JSON.parse(JSON.stringify(this.$refs.fieldRef.dataArr))
      return true
    },
    getSupDepts(id) {
      crudApplication.getDeptSuperior(id).then(res => {
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
      crudApplication.getDepts({ enabled: true }).then(res => {
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
        crudApplication.getDepts({ enabled: true, pid: parentNode.id }).then(res => {
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
      console.log(this.params)
      return true
    },
    // 改变状态
    changeEnabled(data, val) {
      crudApplication
        .setEnable({ id: data.id, status: val })
        .then(res => {
          this.$message.success('切换成功！')
          this.crud.toQuery()
        })
        .catch(() => {
          data.status = !data.status
          this.$message.error('切换失败！')
        })
    },
    checkboxT(row, rowIndex) {
      return true
    },
    handleChange() {},
    handlePreview() {},
    fileSuccess(data) {
      let reader = new FileReader()
      reader.onload = e => {
        fileUpload({ base64: e.target.result.split(",")[1], fileName: data.file.name, channelNo: 'anysign', storeType: 1 }).then(res => {
          this.form.fileId = res.data.id
        })
      }
      reader.readAsDataURL(data.file)
    },
    handleRemove_accessory() {},
    handleError_accessory() {},
    on_exceed(){
      this.$message.info("接口文档只允许上传一份，删除后可重新上传！");
      return false;
    },
    guid() {
      return ' xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    },
    addConfig() {
      this.params = [
        {
          code: this.guid().trim(),
          hasChildren: 0
        }
      ]
    },
    // saveChildren(data) {
    //   this.childrenNode = [
    //     {
    //       code: this.guid(),
    //       hasChildren: 0
    //     }
    //   ]
    //   this.$set(data, 'children', this.childrenNode)
    //   data.hasChildren = 1
    // }
    saveChildren(data) {}
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
::v-deep .configKey .el-table__expand-icon {
  position: absolute;
  text-align: left;
}
// ::v-deep .configKey {
//   display: flex;
//   justify-content: space-between;
// }
.upload-demo {
  display: inline-block;
}
</style>
