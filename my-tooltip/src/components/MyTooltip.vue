<template>
    <div class="my-tooltip my-tooltip--default" :class="positionClass">
        <transition>
            <div class="tooltip-body">
                <template v-if="text">
                    {{text}}
                </template>
                <slot />
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name: "my-tooltip",
    props: {
        target: {
            
        },
        text: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            position: "right",
            align: "center"
        }
    },
    computed: {
        positionClass() {
            return "my-tooltip--" + this.position + "-" + this.align;
        }
    }
}

   //https://developer.mozilla.org/zh-CN/docs/Web/CSS/word-break
//    word-break: break-word;
   //IE https://caniuse.com/#feat=wordwrap
//    word-wrap: break-word;
</script>

<style lang="css" scoped>

.my-tooltip {
    border: 1px solid #ccc;
    border-radius: 2px;
    -webkit-box-shadow: 0 2px 4px 0 rgba(0,0,0,.2);
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.2);
    display: block;
    font-family: Univers,HelveticaNeue,"Helvetica Neue",Helvetica,Arial,sans-serif;
    font-size: 16px;
    font-style: normal;
    font-weight: 300;
    position: absolute;
    text-align: left;
    text-decoration: none;
    -webkit-transition: opacity .2s linear,visibility .2s linear;
    transition: opacity .2s linear,visibility .2s linear;
    z-index: 900;
}

.tooltip-body {
    visibility: visible;
    opacity: 1;
    margin: 0;
    transform: none;
    right: inherit;
    bottom: inherit;
    font-size: 14px;
    overflow-wrap: break-word;
    background: #ccc;
}

.my-tooltip--default.my-tooltip--right-center:before {
    border-right: 9px solid #ccc;
    content: '';
    height: 0;
    position: absolute;
    width: 0;
    right: 100%;
    border-bottom: 9px solid transparent;
    border-top: 9px solid transparent;
    margin-top: -9px;
    top: 50%;
}

.my-tooltip--right-center{
    left: 100%;
    margin-left: 8px;
    top: -50%;
}
</style>