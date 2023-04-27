<template>
  <div>
    <v-card class="modcard-root" :class="{ disabled: modCard.disabled }">
      <v-row no-gutters>
        <!-- handle -->
        <v-col v-if="$slots.handle" cols="1">
          <slot name="handle"></slot>
        </v-col>
        <!-- main -->
        <v-col>
          <v-row class="px-2 py-1">
            <v-col class="text-body-2 d-flex flex-column justify-center">
              <span class="text-caption">
                {{ modCard.id }}
              </span>
              {{ modCard.name }}
            </v-col>
            <v-col cols="4" class="font-weight-bold text-right text-body-2">
              {{ modCard.cost }}MB
            </v-col>
          </v-row>

          <div class="effects-wrapper d-flex flex-wrap px-2 pb-2">
            <div
              class="effect-text mr-2 text-caption"
              v-for="(v, i) of modCard.effects"
              :key="i"
            >
              ・{{ v.name }}
            </div>
          </div></v-col
        >
      </v-row>
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

<style lang="scss" scoped>
.disabled {
  background-color: gainsboro;
}
</style>
