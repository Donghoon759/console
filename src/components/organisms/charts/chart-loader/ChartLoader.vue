<template>
    <div class="p-loader">
        <transition name="fade-in">
            <slot name="loader" :loading="loading">
                <p-lottie v-if="loading" name="spinner" class="spinner"
                          auto
                          :size="1.5"
                />
            </slot>
        </transition>
        <transition name="fade-in">
            <div v-if="!loading" class="w-full h-full">
                <slot name="default" />
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import PLottie from '@/components/molecules/lottie/PLottie.vue';

export default defineComponent({
    name: 'PChartLoader',
    components: { PLottie },
    props: {
        loading: {
            type: Boolean,
            default: true,
        },
    },
    setup() {
        return {};
    },
});
</script>

<style lang="postcss" scoped>
    .p-loader {
        position: relative;
        width: 100%;
        height: 100%;
    }
    .spinner {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        &.fade-in-enter-active {
            transition: opacity 0.15s;
        }
        &.fade-in-enter {
            opacity: 0;
        }
        &.fade-in-enter-to {
            opacity: 1;
        }
    }
    .fade-in-leave-active {
        transition: opacity 0.15s;
    }
    .fade-in-leave-to {
        opacity: 0;
    }
    .fade-in-enter-to {
        opacity: 1;
    }
</style>
