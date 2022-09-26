<!--分页-->
<template>
  <el-pagination
    :page-size="Number(page.pageSize)"
    :total="Number(page.total)"
    :current-page="Number(page.pageNum)"
    style="margin-top: 8px;"
    layout="total, prev, pager, next, sizes"
    @size-change="crud.sizeChangeHandler($event)"
    @current-change="crud.pageChangeHandler"
  />
</template>
<script>
import { pagination } from '@/components/Crud/crud'
export default {
  mixins: [pagination()],
  created() {
    console.log(this.page);
  }
}
</script>
