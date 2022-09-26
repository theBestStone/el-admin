<script>
export default {
  props: {
    tableData: {
      type: Array,
      default: () => {}
    }
  },
  watch: {
    tableData: {
      immediate: true,
      handler(val) {
        this.dataArr = val
      }
    }
  },
  data() {
    return {
      dataArr: [],
      options: [
        { value: 'Number', display_name: '数字' },
        { value: 'String', display_name: '字符串' },
        { value: 'File', display_name: '文件' },
        { value: 'JSON', display_name: 'JSON' }
      ],
      options1: [
        { value: 0, display_name: '非必填' },
        { value: 1, display_name: '必填' }
      ],
      isSave: false
    }
  },
  render() {
    return this.inputWrapper(this.dataArr)
  },
  created() {
    this.dataArr = this.tableData
  },
  methods: {
    inputWrapper(data) {
      return (
        <ol type="number">
          {data.map(item => {
            return (
              <li
                class="parent"
                {...{
                  props: {
                    key: item.code.trim()
                  }
                }}
              >
                {this.myInputRow(item)} {item.children && this.inputWrapper(item.children)}
              </li>
            )
          })}
        </ol>
      )
    },
    myInputRow(item) {
      return (
        <div>
          <div class="configKey">
            <el-input value={item.filedName} onInput={val => this.input(item, 'filedName', val)} placeholder="请输入字段名称" style="width:20%"></el-input>
            <el-input value={item.filed} onInput={val => this.input(item, 'filed', val)} placeholder="请输入字段" style="width:20%"></el-input>
            <el-select value={item.fieldType} onChange={val => this.inputChange(item, 'fieldType', val)} placeholder="请选择枚举类型" style="width:20%">
              {this.options.map(el => (
                <el-option key={el.value} label={el.display_name} value={el.value}>
                  {' '}
                </el-option>
              ))}
            </el-select>
            <el-select value={item.fieldIsRequired} onChange={val => this.inputChange(item, 'fieldIsRequired', val)} placeholder="请选择">
              {this.options1.map(el => (
                <el-option key={el.value} label={el.display_name} value={el.value}>
                  {' '}
                </el-option>
              ))}
            </el-select>
            <div style="width: 120px;">
              <el-button type="primary" icon="el-icon-plus" circle onClick={this.handlePushItem.bind(this, item)}></el-button>
              <el-button type="danger" icon="el-icon-minus" circle onClick={this.delItem.bind(this, item)}></el-button>
              <el-tooltip content="添加子集" placement="top" effect="light">
                <el-button type="primary" icon="el-icon-connection" circle onClick={this.saveChildren.bind(this, item)}></el-button>
              </el-tooltip>
            </div>
          </div>
        </div>
      )
    },
    input(item, type, val) {
      this.$set(item, type, val)
    },
    inputChange(item, type, val) {
      this.$set(item, type, val)
    },
    childrenGenerator(parentCode) {
      return [
        {
          code: this.guid().trim(),
          // hasChild: 0,
          parentCode: parentCode.trim()
        }
      ]
    },
    toRecursion(dataArr, parentCode, status, delItemCode) {
      for (const item of dataArr) {
        item.code = item.code.trim()
        if (item.code == parentCode) {
          if (status !== 'del') {
            item.children.push({
              code: this.guid().trim(),
              parentCode: parentCode
              // hasChild: 0
            })
            this.isSave = true
          } else {
            item.children = item.children.filter(item => item.code !== delItemCode)
          }
        }
        if (item.children && item.children.length) {
          this.toRecursion(item.children, parentCode, status, delItemCode)
        }
      }
    },
    delItem(data) {
      if (!data.parentCode) {
        this.dataArr = this.dataArr.filter(item => item.code !== data.code)
        return
      }
      this.toRecursion(this.dataArr, data.parentCode, 'del', data.code)
    },
    handlePushItem(data) {
      this.isSave = false
      this.toRecursion(this.dataArr, data.parentCode)
      if (!this.isSave) {
        this.dataArr.push({
          code: this.guid().trim(),
          parentCode: data.parentCode
          // hasChild: 0
        })
      }
      // console.log(tempObj)
      // if (tempObj) {
      //   tempObj.children.push({
      //     code: this.guid().trim(),
      //     parentCode: data.parentCode
      //     // hasChild: 0
      //   })
      // } else {
      //   this.dataArr.push({
      //     code: this.guid().trim(),
      //     parentCode: data.parentCode
      //     // hasChild: 0
      //   })
      // }
    },
    saveChildren(data) {
      this.$set(data, 'children', this.childrenGenerator(data.code.trim()))
    },
    guid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    }
  }
}
</script>
<style scoped>
.configKey {
  display: flex;
  justify-content: space-between;
  padding-left: 60px;
}
ol {
  list-style-type: none;
  counter-reset: item;
  margin: 0;
  padding: 0;
}

li {
  position: relative;
  display: table;
  counter-increment: item;
  margin-bottom: 0.6em;
}

li:before {
  width: 100px;
  content: counters(item, '.') '. ';
  /* display: table-cell; */
  padding-right: 0.6em;
}

li li {
  margin: 0;
}

li li:before {
  width: 100px;
  content: counters(item, '.') ' ';
}
/* li.parent {
  display: flex;
} */
/* li.parent:before {
  content: '';
} */
ol[type='number'] {
  width: 100%;
  /* margin-top: 50px; */
}
li.parent:before {
  width: 16%;
  position: absolute;
  left: -76px;
  text-align: right;
  padding-right: 14px;
  /* left: -1px; */
}
v-deep .el-scrollbar li {
  width: 100%;
}
</style>
