<template>
  <v-container>
    <v-row>
      <!-- use for -->
      <v-col md="4" cols="6">
        <v-card class="card mb-2" color="grey-lighten-4">
          <div class="card__title">つかうやつ</div>
          <div class="card__list">
            <draggable
              v-model="useCards"
              :group="{
                name: 'mods',
              }"
              item-key="id"
              class="draggable"
            >
              <template #item="{ element, index }">
                <div class="item-wrapper">
                  <!-- 削除ボタン -->
                  <v-btn
                    class="button delete"
                    icon="mdi-close"
                    v-bind="buttonProps"
                    color="blue"
                    @click="onDeleteItem(index)"
                  >
                  </v-btn>
                  <!-- 無効化ボタン -->
                  <v-btn
                    class="button toggle"
                    v-bind="buttonProps"
                    :icon="element.disabled ? 'mdi-eye-plus' : 'mdi-eye-minus'"
                    color="white"
                    @click="onToggleItem(index)"
                  ></v-btn>
                  <!-- カード本体 -->

                  <mod-card class="mod-card my-1" :mod-card="element">
                    <template #handle>
                      <div class="handle">
                        <v-icon size="18px">mdi-arrow-all</v-icon>
                      </div>
                    </template>
                  </mod-card>
                </div>
              </template>
            </draggable>
          </div>
        </v-card>
      </v-col>
      <!-- master table -->
      <v-col md="4" cols="6">
        <v-card class="card" color="grey-lighten-4">
          <div class="card__title">全カード</div>
          <!-- 検索フォーム -->
          <div class="card__form">
            <!-- 容量 -->
            <v-row>
              <v-col>
                <div class="d-flex flex-wrap justify-space-between">
                  <v-text-field
                    type="number"
                    single-line
                    density="compact"
                    variant="solo"
                    hide-details
                    v-model.number="maxCost"
                    clearable
                    style="max-width: 230px; margin-right: 12px"
                  >
                    <template #prepend>
                      <div class="label-form">最大容量</div>
                    </template>
                    <template #append> MB </template>
                  </v-text-field>
                  <v-checkbox
                    v-model="autoUpdate"
                    density="compact"
                    hide-details
                    class="mr-auto"
                  >
                    <template #label>
                      <div class="label-form">自動計算</div>
                    </template>
                  </v-checkbox>
                </div>
              </v-col>
            </v-row>
            <!-- freeword -->
            <v-row class="my-2" no-gutters>
              <v-col>
                <v-text-field
                  clearable
                  hide-details
                  density="compact"
                  variant="solo"
                  v-model="keyword"
                >
                  <template #prepend>
                    <div class="label-form">自由文検索</div>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
          </div>
          <div class="card__list">
            <draggable
              v-model="searchedList"
              :group="{
                name: 'mods',
                pull: 'clone',
                put: false,
              }"
              :clone="(x:any)=>({...x})"
              handle=".handle"
              :move="onMove"
              item-key="id"
              class="draggable"
            >
              <template #item="{ element }">
                <mod-card class="my-1" :mod-card="element">
                  <template #handle>
                    <div class="handle">
                      <v-icon size="18px">mdi-arrow-all</v-icon>
                    </div>
                  </template>
                </mod-card>
              </template>
            </draggable>
          </div>
        </v-card>
      </v-col>
      <!-- 最終効果 -->
      <v-col>
        <v-card class="card bg-grey-lighten-5 px-4 py-1">
          <div class="py-1">
            総容量 {{ totalCost }}MB
            <span v-if="totalCost > 80" class="ml-2 text-body-2"
              >{{ totalCost - 80 }}MB 超過</span
            >
          </div>
          <v-divider></v-divider>
          <div class="py-1">
            <p class="mt-2">効果</p>
            <div class="text-caption d-flex flex-column">
              <div
                class="mr-2"
                v-for="(v, i) of effects.labels"
                :key="`e-${i}`"
              >
                ・{{ v }}
              </div>
            </div>
          </div>
          <v-divider></v-divider>
          <div class="py-1">
            <p class="mt-2">
              合計値<span class="mini">HP(%)のみ当てにならないので注意</span>
            </p>
            <div class="text-caption d-flex flex-column">
              <div
                class="mr-2"
                v-for="(v, i) of effects.totals"
                :key="`t-${i}`"
              >
                ・{{ v }}
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <!-- 漢のURLハードコーディング -->
    <div class="mt-4">
      何かおかしいって時は<a href="https://drroot.page/wp/?p=327">ここの記事</a
      >にコメントしてくだせ
    </div>
  </v-container>
</template>

<script setup lang="ts">
import draggable from "vuedraggable";

// https://www.therockmanexezone.com/wiki/Card_e-Reader_in_Mega_Man_Battle_Network_6
// memo
// カスタムHPバグは本来レベルがあるけど改造カードのは無い？どれも1.5/s削れた
// カスタムダメージバグは個別に受けるダメージが決まってるけど後に選んだので上書き
import allCards from "./modCards.json";
import ModCard from "./ModCard.vue";
import { mergeModEffect } from "./mergeModEffect";
import { ref, computed, watchEffect } from "vue";

// https://github.com/SortableJS/vue.draggable.next
const useCards = ref<ModCard[]>([]);

// 最小はナイトメアの5MB,最大は80
const _maxCost = ref<number>(80);
const maxCost = computed<number>({
  get: () => _maxCost.value,
  set(v) {
    if (v == null) _maxCost.value = 80;
    else if (v < 5) _maxCost.value = 5;
    else if (v > 80) _maxCost.value = 80;
    else _maxCost.value = v;
  },
});

// つかうやつ中で有効なもの
const useAvailableCards = computed(() => {
  return useCards.value.filter((x) => !x.disabled);
});

// 総容量
const totalCost = computed(() => {
  return useAvailableCards.value.reduce((prev, curr) => {
    return prev + curr.cost;
  }, 0);
});

// trueなら残り容量を自動計算
const autoUpdate = ref(true);
watchEffect(() => {
  if (autoUpdate.value) {
    maxCost.value = 80 - totalCost.value;
  }
});

const _keyword = ref("");
const keyword = computed<string>({
  get() {
    return _keyword.value;
  },
  set(v: string) {
    if (v) _keyword.value = v;
    else _keyword.value = "";
  },
});

// 検索を反映したmasterリスト
const searchedList = computed(() => {
  const underCost = allCards.filter((card) => {
    return maxCost.value >= card.cost;
  });

  if (keyword.value !== "") {
    return underCost.filter((card) => {
      const name = card.name.includes(keyword.value);
      if (name) return true;
      return card.effects.find((effect) => effect.name.includes(keyword.value));
    });
  } else return underCost;
});

// 効果一覧
const effects = computed(() => {
  const [labels, totals] = mergeModEffect(useAvailableCards.value);
  return {
    labels,
    totals,
  };
});

function onDeleteItem(index: number) {
  useCards.value.splice(index, 1);
}
function onToggleItem(index: number) {
  useCards.value[index].disabled = !useCards.value[index].disabled;
}

// よべばくるやつ
const buttonProps = {
  width: "16px",
  height: "16px",
  size: "x-small",
  flat: true,
};

interface DragEvent {
  dragged: HTMLElement;
  related: HTMLElement;
  to: HTMLElement;
  from: HTMLElement;
  draggedContext: {
    // dragged element index
    index: number;

    // dragged element underlying view model element
    element: ModCard;
    // potential index of the dragged element if the drop operation is accepted
    futureIndex: number;
  };
  relatedContext: {
    // target element index
    index: number;

    // target element view model element
    element: ModCard;

    // target list
    list: Array<ModCard>;

    // target VueComponent
    component: any;
  };
}
function onMove(evt: DragEvent) {
  // moveに渡したメソッドがfalseを返すと入れ替え操作がキャンセルされる

  // master内の入れ替えはいらない
  if (evt.dragged == evt.related) return false;

  // 既に登録されたアイテムの追加はさせない
  if (
    evt.relatedContext.list.find((x) => x.id === evt.draggedContext.element.id)
  )
    return false;
}
</script>

<style lang="scss" scoped>
.card {
  height: 80vh;
  display: flex;
  flex-direction: column;

  &__title {
    padding: 16px 24px 8px;
    font-size: 1.2rem;
  }

  &__form {
    padding: 0 16px;
    font-size: 0.8rem;
  }
  &__list {
    flex-grow: 1;
    padding: 8px;
    overflow: auto;
  }
}
.draggable {
  height: 100%;
}

.handle {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #0000000a;
  border-right: 1px solid #00000021;

  &:hover {
    cursor: pointer;
  }
}

.item-wrapper {
  position: relative;
}
.button {
  z-index: 1;
  position: absolute;
}
.delete {
  right: 0;
}
.toggle {
  right: 24px;
}
.mod-card {
  padding-top: 8px;
  padding-right: 4px;
}

.label-form {
  font-size: 0.8rem;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
}

.mini {
  font-size: 9px;
}
</style>
