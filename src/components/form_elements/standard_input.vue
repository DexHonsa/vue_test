<template>
  <div class='standard-input-item'>

    <div class="standard-input-title">{{field}}</div>
    <input
      type="type"
      name="name"
      class="standard-input"
    />

  </div>
</template>
<script>
export default {
  name: "",
  data: () => ({}),
  props: {
    type,
    name,
    field
  }
};
</script>
