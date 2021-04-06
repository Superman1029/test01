<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Pane',
  props: {
    className: {
      type: String,
      default: ''
    }
  },
  data() {
    const classes = [this.$parent.split, this.className]
    return {
      classes: classes.join(' '),
      percent: 50
    }
  }
}
</script>

<style scoped>
.splitter-pane.vertical.splitter-paneL {
  position: absolute;
  left: 0px;
  height: 100%;
  padding-right: 0px;
  border-right: 1px solid #ebeef5;
}

.splitter-pane.vertical.splitter-paneR {
  position: absolute;
  right: 0px;
  height: 100%;
  padding-left: 0px;
  border-left: 1px solid #ebeef5;
}

.splitter-pane.horizontal.splitter-paneL {
  position: absolute;
  top: 0px;
  width: 100%;
  border-bottom: 1px solid #ebeef5;
}

.splitter-pane.horizontal.splitter-paneR {
  position: absolute;
  bottom: 0px;
  width: 100%;
  padding-top: 0px;
  border-top: 1px solid #ebeef5;
}
</style>
