<script setup lang="ts">
import type { NavStep } from "~/consts"

const props = defineProps<{
  step?: NavStep
  active?: boolean
}>()

const distanceTravelled = ref(0)
</script>
<template>
  <div
    v-if="step"
    class="flex flex-col gap-4 p-4 text-xl rounded-xl"
    :class="
      active
        ? 'bg-[var(--blue-color)] text-white'
        : 'bg-white text-[var(--black-color)]'
    "
  >
    <strong
      >{{ step.direction }}
      <span v-if="step.distance"
        >{{ step.distance - distanceTravelled }} ft</span
      ></strong
    >
    <div>
      <Icon
        class="text-5xl text-[var(--blue-color)]"
        :class="active ? 'bg-white rounded-full' : ''"
        :name="step.icon"
      />
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
