<script>
export default {
  name: "Name", // vue component name
  data() {
    return {
    }
  }
}
</script>

<template>
	<div class="name">
	</div>
</template>

<template{{#pug}} lang="pug"{{/pug}}>
  {{#pug}}
  .name
  {{else}}
  <div class="name">
  </div>
  {{/pug}}
</template>

<style {{#less}}lang="less"{{/less}}>
p{
	margin: 0;
}
.name {
	
}
</style>