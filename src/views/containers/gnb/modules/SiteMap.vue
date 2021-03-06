<template>
    <div class="sitemap-container">
        <p-tooltip-button tooltip="Services"
                          :tooltip-options="{offset: '20px'}"
                          :active="visible"
                          @click="toggle"
        >
            <template #buttonContents>
                <p-i class="service-icon" name="ic_gnb_services"
                     width="2rem" height="2rem"
                     color="transparent inherit"
                />
            </template>
        </p-tooltip-button>

        <div v-if="visible" class="sitemap" :style="{left: margin}">
            <div class="contents">
                <div class="title">
                    <p-button class="back-btn" @click="hide">
                        <template>
                            <p-i name="ic_back" width="2rem" height="2rem" />
                        </template>
                    </p-button>
                    <span class="name">Services</span>
                </div>

                <ul @click="hide">
                    <li>
                        <router-link class="group" to="/dashboard">
                            <span class="icon">
                                <p-i name="ic_dashboard"
                                     color="transparent inherit"
                                />
                            </span>
                            <span class="name">Dashboard</span>
                        </router-link>
                    </li>

                    <li>
                        <router-link class="group" to="/inventory">
                            <span class="icon">
                                <p-i name="ic_inventory"
                                     color="transparent inherit"
                                />
                            </span>
                            <span class="name">Inventory</span>
                        </router-link>
                    </li>

                    <li>
                        <router-link class="service" to="/inventory/data-center">
                            Data Center
                        </router-link>
                    </li>

                    <li>
                        <router-link class="service" to="/inventory/server">
                            Server
                        </router-link>
                    </li>
                    <li>
                        <router-link class="service" to="/inventory/cloud-service">
                            Cloud Service
                        </router-link>
                    </li>
                    <li>
                        <router-link class="service last" to="/inventory/collector">
                            Collector
                        </router-link>
                    </li>

                    <li>
                        <router-link class="group" to="/identity">
                            <span class="icon">
                                <p-i name="ic_identity"
                                     color="transparent inherit"
                                />
                            </span>
                            <span class="name">Identity</span>
                        </router-link>
                    </li>

                    <li>
                        <router-link class="service" to="/identity/user">
                            User
                        </router-link>
                    </li>
                    <li>
                        <router-link class="service" to="/identity/project">
                            Project
                        </router-link>
                    </li>
                    <li>
                        <router-link class="service last" to="/identity/service-account">
                            Service Account
                        </router-link>
                    </li>
                    <li>
                        <router-link class="group" to="/secret">
                            <span class="icon">
                                <p-i name="ic_secret"
                                     color="transparent inherit"
                                />
                            </span>
                            <span class="name">Secret</span>
                        </router-link>
                    </li>

                    <!--                <li>-->
                    <!--                    <router-link class="service" to="/secret/credentials-group">-->
                    <!--                        Credentials Group-->
                    <!--                    </router-link>-->
                    <!--                </li>-->
                    <li>
                        <router-link class="service" to="/secret/credentials">
                            Credentials
                        </router-link>
                    </li>
                    <template v-if="$ls.user.state.isDomainOwner">
                        <li>
                            <router-link class="group" to="/plugin">
                                <span class="icon">
                                    <p-i name="ic_identity"
                                         color="transparent inherit"
                                    />
                                </span>
                                <span class="name">Plugin</span>
                            </router-link>
                        </li>

                        <li>
                            <router-link class="service" to="/plugin/supervisor/plugins">
                                Plugins
                            </router-link>
                        </li>
                    </template>
                </ul>
            </div>
            <div
                v-if="visible"
                class="backdrop"
                @click.stop="hide"
            />
        </div>
    </div>
</template>

<script>
import { reactive, toRefs, defineComponent } from '@vue/composition-api';
import PTooltipButton from '@/components/organisms/buttons/tooltip-button/TooltipButton.vue';
import PButton from '@/components/atoms/buttons/Button.vue';
import PI from '@/components/atoms/icons/PI.vue';

export default {
    name: 'SiteMap',
    components: {
        PButton,
        PI,
        PTooltipButton,
    },
    props: {
        margin: {
            type: String,
            default: '',
        },
    },
    setup(props) {
        const state = reactive({
            visible: false,
        });

        return {
            ...toRefs(state),
            show() { state.visible = true; },
            hide() { state.visible = false; },
            toggle() { state.visible = !state.visible; },
        };
    },
};
</script>

<style lang="postcss" scoped>
    $sitemap-width: 260px;
.sitemap-container {
    .service-icon {
        @apply text-primary4;
    }
    .activator {
        @apply text-primary4;
        display: inline-block;
        padding: 0;
        border-radius: 2px;
        min-width: 2rem;
        height: 2rem;
        &:hover, &.active {
            @apply bg-primary-dark;
        }
    }

    .sitemap {
        position: fixed;
        width: 100%;
        top: 0;
        height: 100vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        .contents {
            @apply bg-primary4 text-gray-900;
            box-shadow: 4px 0 8px rgba(theme('colors.gray.900'), 0.32);
            text-align: left;
            height: 100%;
            min-width: $sitemap-width;
            width: $sitemap-width;
        }
        .title {
            @apply text-gray;
            display: flex;
            align-items: center;
            font-size: 1rem;
            padding: 1rem 1.75rem;
            font-weight: bold;
            line-height: 1.5rem;
            .name {
                padding-left: 0.5rem;
            }
            .back-btn {
                padding: 0;
                vertical-align: unset;
                min-width: 2rem;
                height: 2rem;
                border-radius: 2px;
                border: 0;
                &:hover {
                    @apply bg-primary3;
                }
            }
        }
        li {
            display: block;
            cursor: pointer;
            &:hover {
                @apply bg-primary3;
                .icon {
                    @apply text-primary;
                }
            }
            a {
                display: block;
            }
        }

        .group {
            @apply border-t border-gray-100;
            padding: 1rem 1.75rem;
            font-size: 1rem;
            font-weight: bold;
            vertical-align: middle;
            .name {
                padding-left: 0.5rem;
            }
            .icon {
                display: inline-block;
                margin-left: 0.5rem;
                text-align: center;
                color: inherit;
                width: 1.5rem;
                max-height: 241.5rem;
            }
        }
        .service {
            padding: 0.5rem  0 0.5rem 4.5rem;
            &.last {
                margin-bottom: 1rem;
            }
        }
    }
    .backdrop {
        background-color: rgba(theme('colors.gray.900'), 0.32);
        width: 100%;
        height: 100%;
    }
}
</style>
