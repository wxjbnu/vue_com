<script>
export default {
  name: "{{componentNamePascal}}", // vue component name
  data() {
    return {
    }
  }
}
</script>

<template>
	<div class="{{componentName}}">
	</div>
</template>

<template{{#pug}} lang="pug"{{/pug}}>
  {{#pug}}
  .{{componentName}}
  {{else}}
  <div class="{{componentName}}">
  </div>
  {{/pug}}
</template>

<style {{#less}}lang="less"{{/less}}>
p{
	margin: 0;
}
.{{componentName}} {
	
}
</style>