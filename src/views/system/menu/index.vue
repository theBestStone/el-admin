<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.menuName" clearable size="small" placeholder="模糊搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <date-range-picker v-model="query.createTime" class="date-item" />
        <rrOperation />
      </div>
      <crudOperation :permission="permission" />
    </div>
    <!--表单渲染-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible="crud.status.cu > 0" :title="crud.status.title" width="580px">
      <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="菜单类型" prop="menuType" verify>
          <el-radio-group v-model="form.menuType" size="mini" style="width: 178px">
            <el-radio-button label="1">菜单</el-radio-button>
            <el-radio-button label="2">按钮</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="form.menuType.toString() !== '2'" label="菜单图标" prop="icon" verify>
          <el-popover placement="bottom-start" width="450" trigger="click" @show="$refs['iconSelect'].reset()">
            <IconSelect ref="iconSelect" @selected="selected" />
            <el-input slot="reference" v-model="form.icon" style="width: 450px;" placeholder="点击选择图标" readonly>
              <svg-icon v-if="form.icon" slot="prefix" :icon-class="form.icon" class="el-input__icon" style="height: 32px;width: 16px;" />
              <i v-else slot="prefix" class="el-icon-search el-input__icon" />
            </el-input>
          </el-popover>
        </el-form-item>
        <el-form-item v-show="form.menuType.toString() !== '2'" label="菜单可见" prop="state" verify>
          <el-radio-group v-model="form.state" size="mini">
            <el-radio-button label="0">是</el-radio-button>
            <el-radio-button label="1">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.menuType.toString() !== '2'" label="菜单标题" prop="menuName" verify>
          <el-input v-model="form.menuName" :style="form.menuType.toString() === '0' ? 'width: 450px' : 'width: 178px'" placeholder="菜单标题" />
        </el-form-item>
        <el-form-item v-if="form.menuType.toString() === '2'" label="按钮名称" prop="menuName" verify>
          <el-input v-model="form.menuName" placeholder="按钮名称" style="width: 178px;" />
        </el-form-item>
        <el-form-item v-show="form.menuType.toString() !== '0'" label="权限标识" prop="permission">
          <el-input v-model="form.permission" :disabled="form.permission.toString() === 'true'" placeholder="权限标识" style="width: 178px;" />
        </el-form-item>
        <el-form-item v-if="form.menuType.toString() !== '2'" label="路由地址" prop="menuUrl">
          <el-input v-model="form.menuUrl" placeholder="路由地址" style="width: 178px;" />
        </el-form-item>
        <!-- <el-form-item label="菜单排序" prop="menuSort">
          <el-input-number v-model.number="form.menuSort" :min="0" :max="999" controls-position="right" style="width: 178px;" />
        </el-form-item> -->
        <!-- <el-form-item v-show="form.permission.toString() !== 'true' && form.menuType.toString() === '1'" label="组件名称" prop="componentName">
          <el-input v-model="form.componentName" style="width: 178px;" placeholder="匹配组件内Name字段" />
        </el-form-item> -->
        <el-form-item v-show="form.permission.toString() !== 'true' && form.menuType.toString() === '1'" label="组件路径" prop="component">
          <el-input v-model="form.moduleUrl" style="width: 178px;" placeholder="组件路径" />
        </el-form-item>
        <el-form-item label="上级类目" prop="parentId" verify>
          <treeselect v-model="form.parentId" :options="menus" :load-options="loadMenus" style="width: 450px;" placeholder="选择上级类目" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" lazy :load="getMenus" :data="crud.data" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" row-key="id" @select="crud.selectChange" @select-all="crud.selectAllChange" @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column :show-overflow-tooltip="true" label="菜单标题" width="125px" prop="menuName" />
      <el-table-column prop="icon" label="图标" align="center" width="60px">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon ? scope.row.icon : ''" />
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="permission" label="权限标识" />
      <el-table-column :show-overflow-tooltip="true" prop="menuUrl" label="页面地址" />
      <el-table-column :show-overflow-tooltip="true" prop="moduleUrl" label="组件路径" />
      <el-table-column prop="hidden" label="可见" width="75px">
        <template slot-scope="scope">
          <span v-if="scope.row.state">否</span>
          <span v-else>是</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" :formatter="$util.YYMM" label="创建日期" width="135px" />
      <el-table-column v-if="checkPer(['admin', 'menu:edit', 'menu:del'])" label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <udOperation :data="scope.row" :permission="permission" msg="确定删除？" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import crudMenu from '@/api/system/menu'
import IconSelect from '@/components/IconSelect'
import Treeselect from '@riophae/vue-treeselect';import common from '@/assets/js/common.js';
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import CRUD, { presenter, header, form, crud } from '@/components/Crud/crud'
import rrOperation from '@/components/Crud/RR.operation'
import crudOperation from '@/components/Crud/CRUD.operation'
import udOperation from '@/components/Crud/UD.operation'
import DateRangePicker from '@/components/DateRangePicker'

// crud交由presenter持有
const defaultForm = { menuName: '', menuType: '1', menuUrl: '', parentId: '0', permission: '', state: '0', icon: '', moduleUrl: '' }
export default {
  name: 'Menu',
  components: { Treeselect, IconSelect, crudOperation, rrOperation, udOperation, DateRangePicker },
  cruds() {
    return CRUD({
      title: '菜单',
      url: common.base64DeCode('7DDF4129AB22E9BA25CA9DC1799B889DEB2DEE867D04E01DCE6F00ACBE617F4B'),//'sys-menu/findMenuList',
      crudMethod: { ...crudMenu },
      optShow: {
        add: true,
        edit: true,
        del: true,
        reset: true,
        download: false
      }
    })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      menus: [],
      permission: {
        add: ['admin', 'menu:add'],
        edit: ['admin', 'menu:edit'],
        del: ['admin', 'menu:del']
      },
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        path: [{ required: true, message: '请输入地址', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      this.menus = []
      if (form.id != null) {
        if (form.pid === null) {
          form.pid = 0
        }
        this.getSupDepts(form.id)
      } else {
        this.menus.push({ id: '0', label: '顶级类目', children: null })
      }
    },
    [CRUD.HOOK.beforeSubmit](crud, form) {
      this.form.parentId = this.form.parentId + ''
    },
    getMenus(tree, treeNode, resolve) {
      const params = { parentId: tree.id + '' }
      setTimeout(() => {
        crudMenu.getMenusTree(params).then(res => {
          // let menulist = res.data.map(item => {
          //   return {
          //     id: item.parentId,
          //     label: item.menuName,
          //     children: item.children,
          //     hasChildren: item.hasChildren
          //   }
          // })
          // console.log(menulist)
          resolve(res.data)
        })
      }, 100)
    },
    getSupDepts(id) {
      crudMenu.getMenuSuperior().then(res => {
        this.toRecurse(res.data)
        // const children = res.data.map(function(obj) {
        //   if (!obj.leaf && !obj.children) {
        //     obj.children = null
        //   }
        //   return { id: obj.id + '', label: obj.menuName, children: obj.children }
        // })
        this.menus = [{ id: '0', label: '顶级类目', children: res.data }]
        console.log(this.menus)
      })
    },
    toRecurse(data) {
      for (let index = 0; index < data.length; index++) {
        const element = data[index]
        if (element.childList && element.childList.length) {
          element.label = element.menuName
          element.children = element.childList ? element.childList : null
          element.hasChildren = element.hasChildren
          this.toRecurse(element.childList)
        } else {
          element.label = element.menuName
          element.children = element.childList ? element.childList : null
          element.hasChildren = element.hasChildren
        }
      }
    },
    loadMenus({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        crudMenu.getMenusTree({ parentId: parentNode.id + '' }).then(res => {
          parentNode.children = res.data.map(function(obj) {
            if (!obj.hasChildren) {
              obj.children = null
            }
            return { id: obj.id + '', label: obj.menuName, children: obj.children ? obj.children : null }
          })
          setTimeout(() => {
            callback()
          }, 100)
        })
      }
    },
    // 选中图标
    selected(name) {
      this.form.icon = name
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
::v-deep .vue-treeselect__control,
::v-deep .vue-treeselect__placeholder,
::v-deep .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}
</style>
