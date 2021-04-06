<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      vnodes.push(<svg-icon style='margin-right: 5px;width: 14px;height: 14px;' icon-class={icon}/>)
    }

    if (title) {
      vnodes.push(<span slot='title' style='margin-right: 15px;'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>
