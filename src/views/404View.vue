<template>
    <div class="container">
        <div class="unfounded">
            <h2 class="unfounded-title">
                404
            </h2>
            <div class="unfounded-text">
                <h3 class="unfounded-text__title">Страница не найдена</h3>
                <div class="unfounded-text__description">
                    Вы можете вернуться на
                    <router-link class="form-user__inputs__link" :to="{name: 'main'}" >
                      Главную
                    </router-link>
                    и оттуда попытаться найти нужную вам страницу
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "404"
}
</script>

<style scoped>

</style>
