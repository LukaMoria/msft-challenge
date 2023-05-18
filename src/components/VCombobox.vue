<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';

export interface ItemOptions {
  label: string;
  value: string;
}

type OptionsProp = Array<ItemOptions>;

interface Props {
  options: OptionsProp;
  disabled?: false;
  value: ItemOptions['value'] | '';
  labelName: 'label';
}

interface EvenyEmits {
  (e: 'change', value: ItemOptions): void;
}

const emit = defineEmits<EvenyEmits>();
const props = defineProps<Props>();


const isOpen = ref(false);
const search = ref('');
const highlightedIdx = ref(-1);

const combobox = ref(null);
const input = ref(null)
const menu = ref(null);

const hide = () => {
  isOpen.value = false;
};

const open = () => {
  isOpen.value = true;
  focusCombobox();
};

const onInput = (e: Event) => {
  search.value = (e.target as HTMLInputElement).value;
  highlightedIdx.value = -1;
};

const focusCombobox = () => {
  if (combobox.value) {
    (combobox.value as HTMLElement).focus();
  }
};

const filteredOptions = computed(() => {
  return search.value
    ? props.options.filter((op) =>
        op.label.toLocaleLowerCase().includes(search.value.toLocaleLowerCase())
      )
    : props.options;
});

const selectedOption = computed(() => {
  const obj = props.options.find(
    ({ value }: ItemOptions) => value === props.value
  );
  return obj?.label || '';
});

const currentInputValue = computed(() => {
  return isOpen.value ? search.value : selectedOption.value;
});

const onOptionSelected = (option: ItemOptions) => {
  search.value = option.label;
  emit('change', option);
  hide();
};

const onClickOutside = (e: Event) => {
  if (!(e?.target as HTMLElement).closest('.combobox')) {
    hide();
    search.value = currentInputValue.value
  }
};

onMounted(() => {
  document.addEventListener('click', onClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside);
});

const highlightItem = (idx: number) => {
  highlightedIdx.value = idx;
  scrollIntoView();
};

const highlightNextItem = () => {
  if (highlightedIdx.value < filteredOptions.value.length - 1) {
    highlightedIdx.value++;
  } else {
    highlightedIdx.value = 0;
  }
  scrollIntoView();
};

const highlightPrevItem = () => {
  if (highlightedIdx.value > 0) {
    highlightedIdx.value--;
  } else {
    highlightedIdx.value = filteredOptions.value.length - 1;
  }
  scrollIntoView();
};

const selectItem = () => {
  if (isOpen.value && highlightedIdx.value > -1) {
    emit('change', filteredOptions.value[highlightedIdx.value]);
    search.value = filteredOptions.value[highlightedIdx.value].label;
    hide();
    highlightedIdx.value = -1;

    if (input.value) {
      (input.value as HTMLElement).blur()
    }
  }
};

const scrollIntoView = () => {
  nextTick(() => {
    if (!menu.value) return;

    const highlightedItem = (menu.value as HTMLElement).querySelector(
      '.combobox-menu__option_highlighted'
    );
    if (highlightedItem) {
      highlightedItem.scrollIntoView({ block: 'nearest' });
    }
  });
};
</script>

<template>
  <div
    class="combobox"
    :class="{
      combobox_filed: value && !isOpen,
    }"
  >
    <div
      aria-haspopup="listbox"
      aria-expanded="false"
      aria-owns="listbox"
      @click="open"
      @touchstart="open"
    >
      <input
        id="listbox4"
        ref="input"
        aria-activedescendant=""
        aria-autocomplete="list"
        class="combobox-input"
        :class="{
          'combobox-input__open': isOpen,
        }"
        placeholder="Choose a Fruit:"
        type="text"
        :value="currentInputValue"
        @input="onInput"
        @focus="open"
        @keydown.enter="selectItem"
        @keydown.down="highlightNextItem"
        @keydown.up="highlightPrevItem"
      >
    </div>
    <ul
      v-show="isOpen"
      id="listbox"
      ref="menu"
      class="combobox-menu"
      role="listbox"
    >
      <li
        v-for="(option, idx) in filteredOptions"
        :key="idx"
        class="combobox-menu__option"
        :class="{
          'combobox-menu__option_current': option.value === value,
          'combobox-menu__option_highlighted': idx === highlightedIdx,
        }"
        @click="() => onOptionSelected(option)"
        @touchstart="() => onOptionSelected(option)"
        @mouseover="highlightItem(idx)"
      >
        {{ option[props.labelName] }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
.combobox {
  display: block;
  margin-bottom: 1.5em;
  max-width: 400px;
  width: 260px;
  position: relative;
  border-radius: 4px;
}

.combobox_filed {
  box-shadow: #f0f0f0 0px 1px 1px, #f0f0f0 0px 0px 1px 1px;
}

.combobox::after {
  border-bottom: 2px solid rgba(0, 0, 0, 0.5);
  border-right: 2px solid rgba(0, 0, 0, 0.5);
  content: "";
  display: block;
  height: 10px;
  pointer-events: none;
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translate(0, -65%) rotate(45deg);
  width: 10px;
}

.combobox-input {
  color: black;
  font-weight: 500;
  border-radius: 4px;
  border: none;
  background-color: #f9f9f9;
  display: block;
  font-size: 1rem;
  min-height: calc(1.4rem + 26px);
  padding: 12px 16px 14px;
  text-align: left;
  width: 100%;
}

.combobox-input:focus {
  outline: none;
}

.combobox-input__open {
  background-color: #ffffff;
  border-radius: 4px 4px 0 0;
  border: 2px solid #007fff;
  border-bottom: none;
}

.combobox-menu {
  border-radius: 0 0 4px 4px;
  max-height: 240px;
  overflow-y: scroll;
  left: 0;
  position: absolute;
  top: 100%;
  width: 100%;
  z-index: 100;
  border: 2px solid #007fff;
  border-top: none;
}

.combobox-menu__option {
  padding: 10px 12px 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

.combobox-menu__option_highlighted,
.combobox-menu__option_current {
  background-color: #f3f3f3;
}
</style>
