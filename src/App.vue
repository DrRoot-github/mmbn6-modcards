<template>
  <v-app id="root">
    <v-main>
      <v-container class="container">
        <v-row align="center" class="row">
          <v-col>
            <v-row>
              <v-col>
                <p>EXE6 改造カードシミュレーター</p>
                <p>中央の全カードリストから検索して左にD&Dで移動できる</p>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <ModCardLists></ModCardLists>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import ModCardLists from "./components/ModCardLists.vue";
</script>

<style lang="scss" scoped>
#root {
  background-color: #d8d8d8;
}

.container {
  max-height: 99vh;
}

.row {
  background-color: white;
}
</style>
