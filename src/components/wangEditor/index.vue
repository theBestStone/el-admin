<template>
  <div class="editor">
    <div ref="toolbar" class="toolbar"></div>
    <div ref="editor" class="text"></div>
    <el-dialog title="预览" top="1vh" width="90%" append-to-body :close-on-click-modal="false" :visible.sync="visible">
      <div style="padding:20px" v-html="templateValue"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import E from 'wangeditor'
export default {
  name: 'editoritem',
  data() {
    return {
      // uploadPath,
      editor: null,
      info_: null,
      isok: false,
      visible: false,
      templateValue: ''
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    isClear: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    isClear(val) {
      // 触发清除文本域内容
      if (val) {
        this.editor.txt.clear()
        this.info_ = null
      }
    },
    value(val) {
      this.$emit('watchValue', val)
    }
    // value() {
    //   if (!this.isok) {
    //     this.editor.txt.html(this.value)
    //     this.isok = true
    //   }
    //   // if (value !== this.editor.txt.html()) {
    //   //   this.editor.txt.html(this.value)
    //   // }
    // }
    //value为编辑框输入的内容，这里我监听了一下值，当父组件调用得时候，如果给value赋值了，子组件将会显示父组件赋给的值
  },
  mounted() {
    this.seteditor()
    this.editor.txt.html(this.value)
  },
  methods: {
    seteditor() {
      // http://192.168.2.125:8080/admin/storage/create
      this.editor = new E(this.$refs.toolbar, this.$refs.editor)
      this.editor.config.uploadImgShowBase64 = true // base 64 存储图片
      // this.editor.config.uploadImgServer = this.$url.document.upload // 配置服务器端地址
      this.editor.config.uploadImgHeaders = {} // 自定义 header
      this.editor.config.uploadFileName = 'file' // 后端接受上传文件的参数名
      this.editor.config.uploadImgMaxSize = 2 * 1024 * 1024 // 将图片大小限制为 2M
      this.editor.config.uploadImgMaxLength = 6 // 限制一次最多上传 3 张图片
      this.editor.config.uploadImgTimeout = 3 * 60 * 1000 // 设置超时时间
      this.editor.config.pasteFilterStyle = false
      // 配置菜单
      // this.editor.config.menus = [
      //   'head', // 标题
      //   'bold', // 粗体
      //   'fontSize', // 字号
      //   'fontName', // 字体
      //   'italic', // 斜体
      //   'underline', // 下划线
      //   'strikeThrough', // 删除线
      //   'foreColor', // 文字颜色
      //   'backColor', // 背景颜色
      //   'link', // 插入链接
      //   'list', // 列表
      //   'justify', // 对齐方式
      //   'quote', // 引用
      //   'emoticon', // 表情
      //   'image', // 插入图片
      //   'table', // 表格
      //   'video', // 插入视频
      //   'code', // 插入代码
      //   'undo', // 撤销
      //   'redo', // 重复
      //   'fullscreen', // 全屏
      //   'html' // 源码
      // ]
      this.$nextTick(() => {
        let htmlbtn = document.createElement('div')
        htmlbtn.className = 'w-e-menu htmlcode'
        htmlbtn.style.zIndex = 10001
        htmlbtn.innerHTML = 'html'
        document.querySelector('.w-e-toolbar').appendChild(htmlbtn)
        htmlbtn.onclick = this.codeClick
      })
      this.editor.config.uploadImgHooks = {
        // fail: (xhr, editor, result) => {
        //   // 插入图片失败回调
        // },
        // success: (xhr, editor, result) => {
        //   // 图片上传成功回调
        // },
        // timeout: (xhr, editor) => {
        //   // 网络超时的回调
        // },
        // error: (xhr, editor) => {
        //   // 图片上传错误的回调
        // },
        // customInsert: (insertImg, result, editor) => {
        //   console.log(editor);
        //   // 图片上传成功，插入图片的回调
        //   //result为上传图片成功的时候返回的数据，这里我打印了一下发现后台返回的是data：[{url:"路径的形式"},...]
        //   // console.log(result.data[0].url)
        //   //insertImg()为插入图片的函数
        //   //循环插入图片
        //   // for (let i = 0; i < 1; i++) {
        //   console.log(result)
        //   let url = this.$url.document.download + '?documentCode=' + result.data.documentCode
        //   insertImg(url)
        //   // }
        // }
      }
      this.editor.config.onchange = html => {
        this.info_ = html // 绑定当前逐渐地值
        this.$emit('change', this.info_) // 将内容同步到父组件中
      }
      // 创建富文本编辑器
      this.editor.create()
    },
    //切换源码
    codeClick() {
      if (document.querySelector('.htmlcode').getAttribute('class') === 'w-e-menu htmlcode') {
        document.querySelector('.htmlcode').className = 'w-e-menu htmlcode w-e-active'
        document.querySelector('.htmlcode').style.color = '#1e88e5'
        document.querySelector('.w-e-text').innerText = document.querySelector('.w-e-text').innerHTML
      } else {
        document.querySelector('.htmlcode').className = 'w-e-menu htmlcode'
        document.querySelector('.htmlcode').style.color = '#999'
        document.querySelector('.w-e-text').innerHTML = document.querySelector('.w-e-text').innerText
      }
    },
    preview(data, options) {
      let { size, launchAt, quoteEndAt, productType, priceQuoteURL, contactAccount, passcode } = data
      size = size ? size : '${size}'
      launchAt = launchAt ? launchAt : '${launchAt}'
      quoteEndAt = quoteEndAt ? quoteEndAt : '${quoteEndAt}'
      productType = productType ? options.find(item => item.code === productType).name : '${productType}'
      priceQuoteURL = priceQuoteURL ? priceQuoteURL : '${priceQuoteURL}'
      contactAccount = contactAccount ? contactAccount : '${contactAccount}'
      passcode = passcode ? passcode : '${passcode}'
      this.visible = true
      this.templateValue = data.emailMessage
      // this.templateValue = eval('`' + data.emailMessage + '`') //这个方法不兼容ie,用下边的方法
      console.log({ size, launchAt, quoteEndAt, productType, priceQuoteURL, contactAccount, passcode })
      this.interpolate({ size, launchAt, quoteEndAt, productType, priceQuoteURL, contactAccount, passcode })
    },
    interpolate(params, text) {
      console.log(text)
      const names = Object.keys(params)
      const vals = Object.values(params)
      this.templateValue = this.templateValue.replace(/\${/g, '')
      this.templateValue = this.templateValue.replace(/}/g, '')
      for (let index = 0; index < names.length; index++) {
        const element = names[index]
        this.templateValue = this.templateValue.replace(element, vals[index])
      }
    }
  }
}
</script>

<style scoped lang="css">
.editor {
  width: 100%;
  margin: 0 auto;
  position: relative;
}
.toolbar {
  border: 1px solid #ccc;
}
.text {
  border: 1px solid #ccc;
  min-height: 200px;
  height: 200px;
}
/*
  *  以下样式由于全局reset文件被覆盖，所以需要重新定义
  */
::v-deep h5,
.h5 {
  font-size: 14px;
}

::v-deep h4,
.h4 {
  font-size: 16px;
  font-weight: bold;
}

::v-deep h3,
.h3 {
  font-size: 18px;
  font-weight: bold;
}

::v-deep h2,
.h2 {
  font-size: 20px;
  font-weight: bold;
}

::v-deep h1,
.h1 {
  font-size: 22px;
  font-weight: bold;
}
::v-deep i {
  font-style: italic;
}
::v-deep .w-e-toolbar .w-e-menu i {
  font-style: normal;
}
::v-deep ol {
  list-style-type: decimal;
}
::v-deep b {
  font-weight: 700;
}
</style>
