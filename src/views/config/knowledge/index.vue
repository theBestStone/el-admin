<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.documentName" clearable size="small" placeholder="请输入文件名称" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <date-range-picker v-model="query.createTime" class="date-item" />
        <rrOperation />
      </div>
      <crudOperation :permission="permission" />
    </div>
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible="crud.status.cu > 0" :title="crud.status.title" width="90%">
      <el-form ref="form"  :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="文件类型" prop="documentType" verify>
          <el-radio-group v-model="form.documentType">
              <el-radio label="1">行业报告</el-radio>
              <el-radio label="2">法律智库</el-radio>
              <el-radio label="3">政策解读</el-radio>
          </el-radio-group>
          <!-- <el-input v-show="false" v-model="form.viewApp"></el-input> -->
        </el-form-item>
        <el-form-item label="文件名称" prop="documentName" verify>
          <el-input v-model="form.documentName" placeholder="请输入文件名称" style="width: 370px;"></el-input>
        </el-form-item>

        <el-form-item label="上传封面" prop="coverImg">
                
                <el-upload :file-list="fileList"  action="#" :on-change="handleChangeUpload" :limit="1" list-type="picture-card" :auto-upload="false">
                  <i class="el-icon-plus"></i>
                </el-upload>
        </el-form-item>
        <el-form-item label="正文编辑" prop="documentContext" verify>
          <editor-bar v-model="form.documentContext" @watchValue="watchValue" ref="editorBarRef" :isClear="false"></editor-bar>
          <el-input v-show="false" v-model="form.documentContext" placeholder="请输入正文编辑"></el-input>
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
      <el-table-column label="文档编号" prop="documentCode" />
      <el-table-column label="文件名称" prop="documentName" />
      <el-table-column label="文件分类" prop="documentType">
        <template slot-scope="scope">
            <span v-if="scope.row.documentType==1">行业报告</span>
            <span v-else-if="scope.row.documentType==2">法律智库</span>
            <span v-else>政策解读</span>
        </template>
      </el-table-column>
      <el-table-column label="发布人账号" prop="publishAccount" />
      <el-table-column label="发布时间" prop="createDate" />
      <el-table-column label="状态" prop="documentStatus">
        <template slot-scope="scope">
            <el-tag v-if="scope.row.documentStatus==1">已发布</el-tag>
            <el-tag v-else>下架</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPer(['admin', 'dept:edit'])" label="操作" width="230px" align="center" fixed="right">
        <template slot-scope="scope">
           <el-button 
           style="float:left;margin-right:5px;"
            size="mini" 
            type="primary" 
            class="btn-left" @click="release(scope.row)">
            {{scope.row.documentStatus == '1'?'下架':'发布'}}
          </el-button>
          <knOperation :data="scope.row" :permission="permission" :disabled-dle="scope.row.id === 1" msg="确定删除？" />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import crudNnowledge from '@/api/config/knowledge'
 
import Treeselect from '@riophae/vue-treeselect';import common from '@/assets/js/common.js';
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import CRUD, { presenter, header, form, crud } from '@/components/Crud/crud'
import rrOperation from '@/components/Crud/RR.operation'
import crudOperation from '@/components/Crud/CRUD.operation'
import knOperation from '@/components/Crud/UD.operation'
import DateRangePicker from '@/components/DateRangePicker'
import EditorBar from '@/components/wangEditor'
import pagination from '@/components/Crud/Pagination'

const defaultForm = { documentName: '', documentType: '', documentContext: '' ,coverImg:''}
export default {
  name: 'Dept',
  components: { Treeselect, crudOperation, rrOperation, knOperation, DateRangePicker, EditorBar, pagination },
  cruds() {
    return CRUD({
      title: '文件',
      url: common.base64DeCode('D4E73858DE9061C37A32E91FD373F4F1002C9236D07A4A7A9FD559FBD657043B'),//'sysKnowledgeCenter/findFileList',
      crudMethod: { ...crudNnowledge },
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
      fileList:[],
      upTag:false,
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        deptSort: [{ required: true, message: '请输入序号', trigger: 'blur', type: 'number' }]
      },
      permission: {
        add: ['admin', 'dept:add'],
        edit: ['admin', 'dept:edit'],
        del: ['admin']
      },
      options1: [
        { key: 'true', display_name: '普通用户' },
        { key: 'false', display_name: '重要用户' }
      ],
      options2: [
        { key: 'true', display_name: '已认证' },
        { key: 'false', display_name: '未认证' }
      ],
      checkList: []
    }
  },
  watch: {
  },
  methods: {
    getDeptDatas(tree, treeNode, resolve) {
      const params = { pid: tree.id }
      setTimeout(() => {
        crudNnowledge.getDepts(params).then(res => {
          resolve(res.content)
        })
      }, 100)
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.beforeToCU](crud, form) {
      // this.form.documentContext = ''
      // this.checkList = []
      this.upTag = false;
    },
    [CRUD.HOOK.beforeSubmit](crud, form) {
      
      // if(!this.upTag ){
      //   delete form.coverImg
      // }
    },
    [CRUD.HOOK.afterToEdit](crud, form) {
      // this.form.documentContext = ''
      // this.checkList = []
      this.$nextTick(()=>{
         console.log(form,"form")
  
        this.fileList = [
          {name: '封面', url: crudNnowledge.getCoverImg(form.documentId)}
        
        ]
        this.$set(this,'form',form)
        // this.form = form;
        // console.log(this.$refs.editorBarRef.editor)
        this.$refs.editorBarRef.editor.txt.html(this.form.documentContext)
      })
    },
    
    [CRUD.HOOK.beforeToEdit](crud, form) {
     
      
      // crudNnowledge.getNoticebyId(form.id).then(res => {
      //   Object.assign(this.form, res.data)
      //   this.checkList = this.form.viewApp.split(',').map(item => {
      //     if (item == 1) {
      //       return '随e签门户'
      //     } else if (item == 2) {
      //       return '存证系统'
      //     } else if (item == 3) {
      //       return '能力开放平台'
      //     }
      //   })
      //   console.log(this.form)
      //   this.$refs.editorBarRef.editor.txt.html(this.form.documentContext)
      // })
    },
    release(data){
      
      let status;
      let title = '已发布'
      if (data.documentStatus == '1') {
        status = '2'
        title = '已下架'
      } else {
        status = '1'
      }
      const params = { documentId: data.documentId, documentStatus:status}
      crudNnowledge.getRelease(params).then(res => {
        this.$message.success(title)
        this.crud.refresh()
        
      })
    },
    getSupDepts(id) {
      crudNnowledge.getDeptSuperior(id).then(res => {
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
      crudNnowledge.getDepts({ enabled: true }).then(res => {
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
        crudNnowledge.getDepts({ enabled: true, pid: parentNode.id }).then(res => {
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
      return true
    },
    // 改变状态
  
    checkboxT(row, rowIndex) {
      return row.id !== 1
    },
    watchValue(val) {
      this.form.documentContext = val
    },
    // 上传封面
    handleChangeUpload(file, fileList) {
        this.getBase64(file.raw).then(res => {
            
            var arr = res.split(";base64,");
            this.upTag = true;
            this.form.coverImg = arr[1];
        });
    },
    getBase64(file) {
        return new Promise(function(resolve, reject) {
            let reader = new FileReader();
            let imgResult = "";
            reader.readAsDataURL(file);
            reader.onload = function() {
                imgResult = reader.result;
            };
            reader.onerror = function(error) {
                reject(error);
            };
            reader.onloadend = function() {
                resolve(imgResult);
            };
        });
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
