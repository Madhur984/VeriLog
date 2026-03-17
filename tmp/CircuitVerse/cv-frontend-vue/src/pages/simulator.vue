<template>
    <ContextMenu />
    <Extra />
    <Helper />
</template>

<script setup lang="ts">
import ContextMenu from '@/ContextMenu/ContextMenu.vue'
import Extra from '@/Extra.vue'
import { defineComponent, onMounted } from 'vue'
import { setup as setupSimulator } from '../simulator/src/setup'
import Helper from '#/components/helpers/Helper.vue'

defineComponent({
    components: {
        ContextMenu,
        Extra,
    },
})

onMounted(() => {
    setupSimulator()
})
</script>
