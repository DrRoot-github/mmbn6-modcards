<template>
  <div>
    <v-card class="modcard-root">
      <v-row class="px-4 py-1">
        <v-col class="text-body-2 d-flex flex-column justify-center">
          {{ modCard.name }}
        </v-col>
        <v-spacer></v-spacer>
        <v-col class="font-weight-bold text-right text-body-2">
          {{ modCard.cost }}MB
        </v-col>
      </v-row>

      <div class="effects-wrapper d-flex flex-wrap px-4 pb-2">
        <div
          class="effect-text mr-2 text-caption"
          v-for="(v, i) of modCard.effects"
          :key="i"
        >
          ・{{ v.name }}
        </div>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
/**
 * modcard 1枚分
 */

/**
 *
 */
const prop = defineProps<{
  modCard: ModCard;
}>();
</script>

<style lang="scss" scoped></style>
