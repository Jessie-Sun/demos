<template>
    <div v-if="show" :class="classList" :style="styleList">
        <transition appear mode="out-in" name="lazy-fade">
            <div :class="classBody">
                <div class="mds-v2-tooltip__text">
                    <template v-if="text">
                        {{ text }}
                    </template>
                    <template v-else>
                        <slot />
                    </template>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
function createElement(vNode, option, container) {
    const ref = "ref-" + Math.random();
    const v = new Vue({
        render: h => {
            if (typeof (option) === "function") {
                option = option.call(this, h);
            }
            option.ref = ref;
            return h(vNode, option);
        }
    }).$mount(container);
    return v.$refs[ref];
}

import {
    getDefaultPositions, getBestPosition, getRect, getElement
} from "./position.js";

const LazyTooltip = {
    name: "LazyTooltip",
    props: {

        target: {
            type: [String, Object],
            default: ""
        },

        bindTarget: {
            type: Boolean,
            default: false
        },

        positions: {
            type: [String, Array],
            default: () => {
                return getDefaultPositions();
            }
        },

        text: {
            type: String,
            default: ""
        },

        size: {
            type: String,
            default: "medium",
            validator(value) {
                return ["small", "medium", "large"].indexOf(value) > -1;
            }
        },

        width: {
            type: String,
            default: "m",
            validator(value) {
                return ["s", "m", "l", "xl"].indexOf(value) > -1;
            }
        },

        styling: {
            type: String,
            default: "default",
            validator(value) {
                return ["default", "prompt", "warn", "error"].indexOf(value) > -1;
            }
        },

        attachToBody: {
            type: Boolean,
            default: true
        },

        container: {
            type: [String, Object, Document, Window],
            default: ""
        }

    },

    data() {
        return {
            show: true,
            disabled: false,
            classId: "",
            //calculation info
            position: "top",
            align: "center",
            top: 0,
            left: 0
        };
    },

    computed: {
        classList() {
            return [
                "lazy-tooltip"
            ];
        },

        styleList() {
            return {
                top: `${this.top}px`,
                left: `${this.left}px`
            };
        },

        classBody() {
            const list = [
                "lazy-tooltip-body",
                "mds-v2-tooltip",
                `mds-v2-tooltip--${this.styling}`,
                `mds-v2-tooltip--${this.size}`,
                `mds-v2-tooltip--width-${this.width}`,
                `mds-v2-tooltip--${this.position}-${this.align}`,
                this.classId
            ];
            if (this.styling === "warn") {
                list.splice(2, 0, "mds-v2-tooltip--default");
            }
            return list;
        }

    },

    created() {
        this.classId ="lazy-tooltip-"+ Math.random();
        if (this.bindTarget) {
            this.show = false;
        }
    },

    mounted() {
        if (this.attachToBody || !this.$el.parentNode) {
            document.body.appendChild(this.$el);
        }
        this.bindEvents();
        this.update();
    },

    beforeDestroy() {
        this.unbindEvents();
        if (this.$el.parentNode) {
            this.$el.parentNode.removeChild(this.$el);
        }
        this.$emit("close");
    },

    methods: {
        bindEvents() {
            this.bindTargetEvent();
            //after mounted
            this.$watch("show", this.showHandler);
        },

        unbindEvents() {
            this.unbindTargetEvent();
        },

        showHandler() {
            if (this.show) {
                this.$nextTick(() => {
                    this.update();
                });
            } else {
                this.$emit("close");
            }
        },

        //=============================================================================

        bindTargetEvent() {
            if (!this.bindTarget) {
                return;
            }
            const $target = getElement(this.target);
            if ($target) {
                this.$target = $target;
                this.$target.addEventListener("mouseenter", this.openHandler);
                this.$target.addEventListener("focus", this.openHandler);
                this.$target.addEventListener("mouseleave", this.closeHandler);
                this.$target.addEventListener("blur", this.closeHandler);
            }
        },

        unbindTargetEvent() {
            if (this.$target) {
                this.$target.removeEventListener("mouseenter", this.openHandler);
                this.$target.removeEventListener("focus", this.openHandler);
                this.$target.removeEventListener("mouseleave", this.closeHandler);
                this.$target.removeEventListener("blur", this.closeHandler);
                this.$target = null;
            }
        },

        openHandler() {
            if (this.show) {
                return;
            }
            if (this.disabled) {
                return;
            }
            this.show = true;
        },

        closeHandler() {
            if (!this.show) {
                return;
            }
            if (this.disabled) {
                return;
            }
            if (this.$target) {
                this.show = false;
            } else {
                this.$destroy();
            }
        },

        //=============================================================================

        update() {
            this.$nextTick(() => {
                this.updateSync();
            });
            return this;
        },

        updateSync() {
            if (!this.show) {
                return this;
            }
            const containerRect = getRect(this.container || window);

            const targetRect = getRect(this.target);

            //fix for arrow size
            const arrowSize = 10;
            targetRect.left -= arrowSize;
            targetRect.top -= arrowSize;
            targetRect.width += arrowSize * 2;
            targetRect.height += arrowSize * 2;

            const rect = getRect(`.${this.classId}`);

            //console.log(containerRect, targetRect, rect);
            
            this.positionInfo = getBestPosition(
                containerRect,
                targetRect,
                rect,
                this.positions
            );

            //no change
            if (this.position === this.positionInfo.position
            && this.align === this.positionInfo.align
            && this.top === this.positionInfo.top
            && this.left === this.positionInfo.left) {
                return this;
            }

            //console.log(this.positionInfo);

            this.position = this.positionInfo.position;
            this.align = this.positionInfo.align;
            this.top = this.positionInfo.top;
            this.left = this.positionInfo.left;

            this.$emit("update");
            return this;
        }
    }
};

LazyTooltip.getDefaultPositions = getDefaultPositions;
LazyTooltip.create = (option, container) => {
    return createElement(LazyTooltip, option, container);
};

export default LazyTooltip;
</script>

<style lang="scss" scoped>
$warn-color: #f5c400;
$pre: "mds-v2-tooltip--";
$positions: bottom right top left;

.lazy-tooltip {
    &.mds-v2-tooltip__wrapper {
        position: absolute;
        display: block;
        pointer-events: none;
        z-index: 2000;

        .lazy-tooltip-body {
            visibility: visible;
            opacity: 1;
            margin: 0;
            transform: none;
            right: inherit;
            bottom: inherit;
            font-size: 14px;
            //https://developer.mozilla.org/zh-CN/docs/Web/CSS/word-break
            word-break: break-word;
            overflow-wrap: break-word;
            //IE https://caniuse.com/#feat=wordwrap
            word-wrap: break-word;
        }
    }

    .#{$pre}warn {
        background-color: $warn-color;
        border-color: $warn-color;
        color: #1e1e1e;
        font-size: 14px;

        @each $p in $positions {
            @if $p == right or $p == left {
                &.#{$pre}#{$p}-top::after,
                &.#{$pre}#{$p}-center::after,
                &.#{$pre}#{$p}-bottom::after,
                &.#{$pre}#{$p}-top::before,
                &.#{$pre}#{$p}-center::before,
                &.#{$pre}#{$p}-bottom::before {
                    border-#{$p}-color: $warn-color;
                }
            }

            @else {
                &.#{$pre}#{$p}-left::after,
                &.#{$pre}#{$p}-center::after,
                &.#{$pre}#{$p}-right::after,
                &.#{$pre}#{$p}-left::before,
                &.#{$pre}#{$p}-center::before,
                &.#{$pre}#{$p}-right::before {
                    border-#{$p}-color: $warn-color;
                }
            }
        }
    }

    .lazy-fade-enter-active,
    .lazy-fade-leave-active {
        transition: opacity 0.3s;
    }

    .lazy-fade-enter,
    .lazy-fade-leave-to {
        opacity: 0;
    }
}
</style>
