<template>
  <view class="c-button" :class="buttonClass" :style="customStyle" @click="handleClick">
    <button class="button-reset" :loading="loading">
      <slot />
    </button>
  </view>
</template>

<script lang="ts" setup>
const emit = defineEmits(["click"]);

const props = defineProps({
  type: {
    type: String as PropType<"default" | "primary" | "success" | "warning" | "danger">,
    default: "default",
  },
  size: {
    type: String as PropType<"default" | "mini">,
    default: "default",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  customClass: {
    type: [String, Array] as PropType<string | string[]>,
    default: "",
  },
  customStyle: {
    type: Object as PropType<Object | String>,
    default: () => ({})
  },
});

const buttonClass = computed(() => {
  let result = [`c-button-${props.type}`, `c-button-${props.size}`];
  if (props.customClass) {
    if (typeof props.customClass === "string") {
      result.push(props.customClass);
    } else {
      result = result.concat(props.customClass);
    }
  }
  if (props.disabled) {
    result.push("c-button-disabled");
  }
  return result;
});

function handleClick() {
  if (props.disabled) {
    return;
  }
  emit("click");
}
</script>

<style lang="scss">
.button-reset {
  font-size: inherit;
  height: auto;
  line-height: inherit;
  color: inherit;
  background-color: transparent;
  padding: 0;
  margin: 0;
  /* #ifdef MP-DINGTALK */
  border-width: 0;
  /* #endif */

  /* #ifdef WEB */
  cursor: inherit;

  &::after {
    border: none;
  }

  /* #endif */
}

.c-button {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: 0 20px;
  line-height: 2;
  overflow: hidden;
  border-radius: 4px;
  border-width: 1px;
  border-color: $uni-border-color;
  background-color: #FFFFFF;

  & + & {
    margin-left: 6px;
  }

  &-default {
    font-size: 16px;
    height: 32px;
  }

  &-mini {
    font-size: 14px;
    height: 28px;
  }

  /* #ifdef WEB */
  &-disabled {
    cursor: not-allowed;
  }

  /* #endif */

  &-primary {
    color: #FFF;
    border-color: $uni-color-primary;
    background-color: $uni-color-primary;

    &.c-button-disabled {
      border-color: rgba($uni-color-primary, $uni-opacity-disabled);
      background-color: rgba($uni-color-primary, $uni-opacity-disabled);
    }
  }

  &-success {
    color: #FFF;
    border-color: $uni-color-success;
    background-color: $uni-color-success;

    &.c-button-disabled {
      border-color: rgba($uni-color-success, $uni-opacity-disabled);
      background-color: rgba($uni-color-success, $uni-opacity-disabled);
    }
  }

  &-warning {
    color: #FFF;
    border-color: $uni-color-warning;
    background-color: $uni-color-warning;

    &.c-button-disabled {
      border-color: rgba($uni-color-warning, $uni-opacity-disabled);
      background-color: rgba($uni-color-warning, $uni-opacity-disabled);
    }
  }

  &-danger {
    color: #FFF;
    border-color: $uni-color-error;
    background-color: $uni-color-error;

    &.c-button-disabled {
      border-color: rgba($uni-color-error, $uni-opacity-disabled);
      background-color: rgba($uni-color-error, $uni-opacity-disabled);
    }
  }
}
</style>
