<script>
import { defineComponent, ref } from 'vue'
export default defineComponent({
    setup() {
        const title = ref('Hello World')
        return { title }
    }
})
</script>

<template>
    <h1>{{ title }}</h1>
</template>