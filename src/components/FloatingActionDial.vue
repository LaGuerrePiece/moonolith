<template>
    <div class="fab">
        <span class="fab-action-button" @click="showToolbar = !showToolbar">
            <i class="material-icons fab-action-button-icon"> create </i>
        </span>
        <transition name="fade">
            <div class="toolbar" v-if="showToolbar">
                <ul class="items">
                    <li class="item">
                        <a
                            class="menu-item"
                            :class="{ active: toolUsed === Tool.PEN }"
                            @click="toggleState(Tool.PEN)"
                            data-tooltip="Draw"
                            aria-label="Pen"
                        >
                            <span class="material-icons menu-item-icon">
                                brush
                            </span>
                        </a>
                    </li>
                    <li>
                        <a
                            class="menu-item"
                            :class="{ active: toolUsed === Tool.ERASER }"
                            @click="toggleState(Tool.ERASER)"
                            data-tooltip="Erase"
                            aria-label="Eraser"
                        >
                            <i class="material-icons menu-item-icon">
                                backspace
                            </i>
                        </a>
                    </li>
                    <li>
                        <a
                            class="menu-item"
                            :class="{ active: toolUsed === Tool.TEXT }"
                            @click="toggleState(Tool.TEXT)"
                            data-tooltip="Text"
                            aria-label="Text"
                        >
                            <i class="material-icons menu-item-icon">
                                font_download
                            </i>
                        </a>
                    </li>
                    <li>
                        <a
                            class="menu-item"
                            :class="{ active: toolUsed === Tool.DELETE }"
                            @click="toggleState(Tool.DELETE)"
                            data-tooltip="Delete"
                            aria-label="Delete"
                        >
                            <i class="material-icons menu-item-icon">delete</i>
                        </a>
                    </li>
                </ul>
            </div>
        </transition>
    </div>
</template>

<script setup>

</script>

<style>

</style>