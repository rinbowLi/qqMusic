<template>
    <div class="hotMv">
        <h3>热门MV</h3>
        <ul v-if="listItems">
            <li v-for="item in listItems"  :key="item.id">
                <HotMvItem :item-info="item"/>
            </li>
        </ul>
    </div>
</template>

<script>
    import HotMvItem from "@/views/home/childComponents/HotMvItem";
    import {mvApi} from "@/api/mv";

    export default {
        name: "HotMvList",
        components: {HotMvItem},
        data() {
            return {
                listItems: []
            }
        },
        created() {
            this.init()
        },
        methods: {
            init() {
                mvApi.getMvHot().then(ret => {
                    if (ret.code === 200) {
                        this.listItems = ret.data.list;
                    }
                })

            }
        }
    }
</script>

<style scoped lang="scss">
    .hotMv {
        h3 {
            padding-left: .15rem;
            font-size: var(--large);
            font-weight: 600;
            line-height: 2;
        }

        ul {
            li {
                margin-bottom: .3rem;
                background: var(--background-color);
            }
        }
    }
</style>
