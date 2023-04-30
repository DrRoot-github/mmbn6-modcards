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

* {
  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background-color: rgba(255, 255, 255, 0.466);
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background-color: rgb(228, 228, 228);
  }
}

.container {
  height: 100%;
}

.row {
  background-color: white;
}
</style>
