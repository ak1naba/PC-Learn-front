<template>
    <div class="lesson-add">
        <h2 class="lesson-add__title">Добавить занятие</h2>
        <form @submit="addWork" class="lesson-add__form">
            <div class="lesson-add__form__block">
                <BaseInput v-model="this.work.title" type="text" class="input" name="title" placeholder="Название" :class="{'input-invalid':errors.title}" />

            </div>
            <div class="lesson-add__form__block">
                <BaseInput v-model="this.work.url_title" type="text" class="input" name="url_title" placeholder="Url-название" :class="{'input-invalid':errors.url_title}" />

            </div>
            <div class="lesson-add__form__block">
                <textarea id="summernote-editor" v-model="this.work.theory"></textarea>

            </div>
            <div class="lesson-add__form__block">
                <select v-model="this.work.type_lesson_id" as="select" name="type_lesson" class="input" :class="{'input-invalid':errors.type_lesson}">
                    <option value="1" class="input">Теория</option>
                    <option value="2" class="input">Практика</option>
                </select>

            </div>
            <div class="lesson-add__form__block line">
                <input type="checkbox" class="input" v-model="this.work.hard_binding" id="hard_binding">
                <label for="hard_binding">Жесткая привязка объектов</label>
            </div>
            <div class="lesson-add__form__block ">
                <input type="submit" class="btn btn-primary" value="Добавить">
            </div>
            <div class="alert" v-if="this.work.error!=null">
                {{this.work.error}}
            </div>
        </form>
    </div>
</template>

<script>
import 'summernote/dist/summernote-bs4.css';
import 'summernote/dist/summernote-bs4';

import axios from "axios";

export default {
    name: "addLesson",
    components:{
      BaseInput
    },
    data(){
        return{
            work:{
                title: null,
                url_title: null,
                theory: null,
                type_lesson_id: null,
                hard_binding: false,

                error:null,
            }
        }
    },
    props:{
        required:true,
        type:Object
    },
    computed: {
        schema() {
            return yup.object({
                title: yup.string().required().label('Название'),
                url_title: yup.string().required().label('Название url'),
                type_lesson: yup.string().required().label('Тип'),
            });
        },
    },
    methods:{
        addWork(){
             if(this.work.theory!="" && this.work.theory!=null){
                axios.post('/api/lessons/add', this.work)
                    .then(res=>{
                        console.log(res);
                        this.$router.push({name:"admin.lessons"});
                    }).catch(err=>{
                    console.log(err);
                })
             }else{
                 this.work.error="Заполните поле с информацией для задания"
             }

        },

    }
}
</script>

<style scoped>

</style>
