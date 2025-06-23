<template>
    <div class="lesson-add">
        <h2 class="lesson-add__title">Добавить занятие</h2>
        <Form @submit="editWork" :validation-schema="schema"  v-slot="{errors}" class="lesson-add__form">
            <div class="lesson-add__form__block">
                <Field v-model="this.lesson.title" type="text" class="input" name="title" placeholder="Название" :class="{'input-invalid':errors.title}" />
                <ErrorMessage name="title"  class="alert" />
            </div>
            <div class="lesson-add__form__block">
                <Field v-model="this.lesson.url_title" type="text" class="input" name="url_title" placeholder="Url-название" :class="{'input-invalid':errors.url_title}" />
                <ErrorMessage name="url_title"  class="alert" />
            </div>
            <div class="lesson-add__form__block">
                <editor
                    api-key="no-api-key" class="input"
                    v-model="this.lesson.theory"
                    :init="{
                     selector:'textarea',
                     height: 500,
                     menubar: false,
                     plugins: [
                       'a11ychecker','advlist','advcode','advtable','autolink','checklist','export',
                       'lists','link','image','charmap','preview','anchor','searchreplace','visualblocks',
                       'powerpaste','fullscreen','formatpainter','insertdatetime','media','table','help','wordcount',
                     ],
                     toolbar:
                       'undo redo | casechange blocks | bold italic backcolor | \
                       alignleft aligncenter alignright alignjustify | \
                       bullist numlst checklist outdent indent | removeformat | a11ycheck code table help'
                   }"
                />

            </div>
            <div class="lesson-add__form__block">
                <Field v-model="this.lesson.type_lesson_id" as="select" name="type_lesson" class="input" :class="{'input-invalid':errors.type_lesson}">
                    <option value="1" class="input">Теория</option>
                    <option value="2" class="input">Практика</option>
                </Field>
                <ErrorMessage name="type_lesson" class="alert" />
            </div>
            <div class="lesson-add__form__block line">
                <input type="checkbox" class="input" v-model="this.lesson.hard_binding" id="hard_binding">
                <label for="hard_binding">Жесткая привязка объектов</label>
            </div>
            <div class="lesson-add__form__block">
                <input type="submit" class="btn btn-primary" value="Изменить">
            </div>
            <div class="alert" v-if="this.lesson.error!=null">
                {{this.error}}
            </div>
        </Form>
    </div>
</template>

<script>
import '../../../../sass/form.scss';
import '../../../../sass/addLesson.scss';

import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

import Editor from '@tinymce/tinymce-vue';

import axios from "axios";

export default {
    name: "editLesson",
    components:{
        Form, Field, ErrorMessage, Editor
    },
    data(){
        return{
            lesson:{},
            url_title:this.$route.params.url_title,
            error:null,
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
        editWork(){
             if(this.lesson.theory!="" && this.lesson.theory!=null){
                axios.patch('/api/lessons/'+this.lesson.id, {
                    'title':this.lesson.title,
                    'url_title':this.lesson.url_title,
                    'theory':this.lesson.theory,
                    'type_lesson_id':this.lesson.type_lesson_id,
                    'hard_binding':this.lesson.hard_binding,
                })
                    .then(res=>{
                        console.log(res);
                        this.$router.push({name:"admin.lessons"});
                    }).catch(err=>{
                        console.log(err);
                    })
             }else{
                 this.error="Заполните поле с информацией для задания"
             }

        },
        getLesson(){
            axios.get('/api/lesson/'+this.url_title)
                .then(res=>{
                    this.lesson=res.data.data;
                    this.lesson.hard_binding=Boolean(res.data.data.hard_binding);

                    }
                )
                .catch(err=>{
                    console.log(err);
                })
        },
    },
    mounted() {
        this.getLesson();
    }

}
</script>

<style scoped>

</style>
