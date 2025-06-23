<link rel="stylesheet" href="../../../../sass/lesson.scss">
<template>
    <div class="lesson-block">
        <div class="btn-group">
            <button @click="showModalWindow" class="btn btn-danger">Удалить</button>
            <button @click.prevent="$event=>getLessonEdit(lesson.url_title)" class="btn btn-primary">Редактировать</button>
        </div>
        <dialog close class="modal-window">
            <h3>Вы действительно хотите удалить задание?</h3>
            <div class="btn-group">
                <button @click="deleteLesson" class="btn btn-danger">Удалить</button>
                <button @click="showModalWindow"  class="btn btn-primary ">Отмена</button>
            </div>
        </dialog>
        <h2 class="lesson-block__title">
            {{lesson.title}}
            <span class="lesson-block__title__sub">
                {{lesson.url_title}}
            </span>
        </h2>
        <p class="lessons-panel__lessons__item__type" v-if="lesson.type_lesson_id==1">Теория</p>
        <p class="lessons-panel__lessons__item__type" v-if="lesson.type_lesson_id==2">Практика</p>
        <p class="lesson-block__text" v-html="lesson.theory"></p>
        <div class="media-block">
            <h3 class="media-block__title">
                Добавление медиаматериалов
            </h3>
            <div class="media-block__theory" v-if="lesson.type_lesson_id==1">
                <Form method="post" @submit="addMedia" :validation-schema="schemaForm" class="media-block__form" enctype="multipart/form-data" v-slot="{errors}">
                    <div class="form-block">
                        <Field id="file" name="material" type="file" class="input"  :class="{'input-invalid':errors.material}"></Field>
                        <ErrorMessage name="material" class="alert" /></div>
                    <div class="form-block">
                        <button type="submit" class="btn btn-primary">Добавить</button>
                    </div>
                </Form>
                <div class="lesson-panel__img__container">
                    <div v-for="material in lesson.materials" :key="material.id" class="material-container" @mouseover="addHoverClassImg($event)" @mouseout="addHoverClassImg($event)">
                        <img  class="img-material" :src="material.part_img" />
                        <button  class=" btn btn-danger btn-delete" @click="deleteMaterial(material.id)">Удалить</button>
                    </div>
                </div>
            </div>
            <div class="media-block__practic" v-if="lesson.type_lesson_id==2">
                <div v-if="lesson.materials.length === 0">
                    <Form  method="post" @submit="addMediaRelative" :validation-schema="schemaFormRelative" class="media-block__form" enctype="multipart/form-data" v-slot="{errors}">
                        <h4>Выбор родительского элемента</h4>
                        <div class="form-block">
                            <Field id="fileRelative" name="materialRelative" type="file" class="input"  :class="{'input-invalid':errors.materialRelative}"></Field>
                            <ErrorMessage name="materialRelative" class="alert" /></div>
                        <div class="form-block">
                            <button type="submit" class="btn btn-primary">Добавить</button>
                        </div>
                    </Form>
                </div>
                <div v-else-if="!lesson.materials.some(material => material.relative_element === 1)">
                    <Form  method="post" @submit="addMediaRelative" :validation-schema="schemaFormRelative" class="media-block__form" enctype="multipart/form-data" v-slot="{errors}">
                        <h4>Выбор родительского элемента</h4>
                        <div class="form-block">
                            <Field id="fileRelative" name="materialRelative" type="file" class="input"  :class="{'input-invalid':errors.materialRelative}"></Field>
                            <ErrorMessage name="materialRelative" class="alert" /></div>
                        <div class="form-block">
                            <button type="submit" class="btn btn-primary">Добавить</button>
                        </div>
                    </Form>
                </div>
                <div v-if="lesson.materials.some(material => material.relative_element) && relative_element.state.length<2">
                    <Form  method="post" @submit="addMediaStateRelative" :validation-schema="schemaFormStateRelative" class="media-block__form" enctype="multipart/form-data" v-slot="{errors}">
                        <h4>Выбор состояния родителя</h4>
                        <div class="form-block">
                            <Field id="materialStateRelative" name="materialStateRelative" type="file" class="input"  :class="{'input-invalid':errors.materialStateRelative}"></Field>
                            <ErrorMessage name="materialStateRelative" class="alert" /></div>
                        <div class="form-block">
                            <button type="submit" class="btn btn-primary">Добавить</button>
                        </div>
                    </Form>
                </div>
                <div>
                    <Form method="post" @submit="addMediaDaughter"  :validation-schema="schemaFormDaughter" class="media-block__form" enctype="multipart/form-data" v-slot="{errors}">
                        <h4>Выбор дочернего элемента</h4>
                        <div class="form-block">
                            <Field id="fileDaughter" name="materialDaughter" type="file" class="input" ></Field>
                            <ErrorMessage name="materialDaughter" class="alert" /></div>
                        <div class="form-block">
                            <button type="submit" class="btn btn-primary">Добавить</button>
                        </div>
                    </Form>
                </div>
                <div class="practic">
                    <div class="relative-container"
                         v-for="material in relative_elements" :key="material.id"
                         @contextmenu="addHoverClassImg($event)"
                         @dragover.prevent
                         @dragenter="dragEnter"
                         @dragleave="dragLeave"
                         @drop="dropElement">
                        <div class="practic-relative__img">
                            <img  :src="material.part_img" class="img-material">
                            <button class="btn btn-danger btn-delete" @click="deleteMaterial(material.id)">Удалить</button>
                        </div>
                    </div>
                    <div class="practic-daughter" >
                        <div :data-id="material.id" @dragstart="dragStart(material.id)" v-for="material in daughter_elements" :key="material.id" class="practic-daughter__img" draggable="true"  @contextmenu="addHoverClassImg($event)" >
                            <img :src="material.part_img" class="img-material">
                            <div class="btn btn-danger btn-delete lower-delete ">
                                <svg class=" "  @click="deleteMaterial(material.id)" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13 1L1 13M1 1L13 13" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                        </div>

                        <div :data-id="relative_element.id" @dragstart="dragStart(relative_element.id)" draggable="true" class="switcher" v-if="relative_element.id && relative_element.state.length != 0">
                        </div>

                    </div>
                </div>
                <div class="states">
                    <div v-for="state in relative_element.state" :key="state.id">
                        <img :src="state.part_img" class="img-material">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import '../../../../sass/lesson.scss';

import axios from "axios";
import {ErrorMessage, Field, Form} from "vee-validate";
import * as yup from 'yup';

import ru from 'yup-locale-ru';
yup.setLocale(ru);


export default {
    name: "lesson",
    data(){
        return{
            // url - который является индикатором
            url_title:this.$route.params.url_title,
            // крутой массив, который содержит всю инфу по уроку
            lesson:{},
            // родительский элемент
            relative_element:{},
            // родительские элементы
            relative_elements:[],
            // дочерние элементы
            daughter_elements:[],
            // таскаемый элемент
            draggedElement: null,
        }
    },
    // импорт компонентов
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    props:{
        required:true,
        type:Object
    },
    computed: {
        schemaForm() {
            return yup.object({
                material: yup
                    .mixed()
                    .test('fileType', 'Неподдерживаемый тип файла', (value) => {
                        if (!value) {
                            return true; // Не требуется проверять, если значение отсутствует
                        }
                        const supportedFormats = ['image/png', 'image/jpeg','image/webp','image/jpg'];
                        return supportedFormats.includes(value.type);
                    })
                    .required()
                    .label('Медиаметериал'),
            });
        },
        // Валидация формы родителя
        schemaFormRelative() {
            return yup.object({
                materialRelative: yup
                    .mixed()
                    .test('fileType', 'Неподдерживаемый тип файла', (value) => {
                        if (!value) {
                            return true; // Не требуется проверять, если значение отсутствует
                        }
                        const supportedFormats = ['image/png', 'image/jpeg','image/webp'];
                        return supportedFormats.includes(value.type);
                    })
                    .required()
                    .label('Медиаметериал'),
            });
        },
        // Валидация формы состояний
        schemaFormStateRelative() {
            return yup.object({
                materialStateRelative: yup
                    .mixed()
                    .test('fileType', 'Неподдерживаемый тип файла', (value) => {
                        if (!value) {
                            return true; // Не требуется проверять, если значение отсутствует
                        }
                        const supportedFormats = ['image/png', 'image/jpeg','image/webp'];
                        return supportedFormats.includes(value.type);
                    })
                    .required()
                    .label('Медиаметериал'),
            });
        },
        // Валидация формы дочерних элементов
        schemaFormDaughter() {
            return yup.object({
                materialDaughter: yup
                    .mixed()
                    .test('fileType', 'Неподдерживаемый тип файла', (value) => {
                        if (!value) {
                            return true; // Не требуется проверять, если значение отсутствует
                        }
                        const supportedFormats = ['image/png', 'image/webp'];
                        return supportedFormats.includes(value.type);
                    })
                    .required()
                    .label('Медиаметериал'),
            });
        },
    },
    methods:{
        // Получеам данные от сервера по уроку и парсим их
        getLesson(){
            axios.get('/api/lesson/'+this.url_title)
                .then(res=>{
                    this.lesson=res.data.data;
                    this.lesson.materials.forEach(item=> {
                        if(item.relative_element===1){
                            this.relative_elements.push(item);
                            this.relative_element=item;
                        }
                        if(item.relative_element===0){
                            this.daughter_elements.push(item);
                        }

                    });
                    }
                )
                .catch(err=>{
                    console.log(err);
                })
        },
        // Показать модальное коно удаления
        showModalWindow(){
            let modal = document.querySelector(".modal-window");
            modal.classList.toggle("modal-window__active");
        },
        deleteLesson(){
            axios.delete('/api/lessons/'+this.lesson.id)
                .then(res=>{
                    console.log(res);
                })
                .catch(err=>{
                    console.log(err);
                });
            this.$router.push({name:"admin.lessons"});
        },
        getLessonEdit(url_title){
            this.$router.push({name:'admin.lessons.edit',params:{url_title:url_title}})
        },

        addMedia(){
            var formData = new FormData();
            var imagefile = document.querySelector('#file');
            formData.append("image", imagefile.files[0]);

            axios.post('/api/lesson/'+this.lesson.id+'/materials/add', formData).
            then(res=>{
                console.log(res);

            }).catch(err=>{
                console.log(err)
            })
            location.reload();

        },
        addMediaRelative(){
            var formData = new FormData();
            var imagefile = document.querySelector('#fileRelative');
            formData.append("image", imagefile.files[0]);

            axios.post('/api/lesson/'+this.lesson.id+'/materials/add/relative', formData).
            then(res=>{
                console.log(res);
            }).catch(err=>{
                console.log(err)
            })
            location.reload();
        },
        addMediaStateRelative(){
            var formData = new FormData();
            var imagefile = document.querySelector('#materialStateRelative');
            formData.append("image", imagefile.files[0]);

            axios.post('/api/states/add/'+this.relative_element.id, formData).
            then(res=>{
                console.log(res);
            }).catch(err=>{
                console.log(err)
            })
            //location.reload();
        },
        addMediaDaughter(){
            var formData = new FormData();
            var imagefile = document.querySelector('#fileDaughter');
            formData.append("image", imagefile.files[0]);

            axios.post('/api/lesson/'+this.lesson.id+'/materials/add/daughter', formData).
            then(res=>{
                console.log(res);
            }).catch(err=>{
                console.log(err)
            })
            location.reload();

        },
        deleteMaterial(materialId) {
            console.log(materialId);
            console.log('/api/materials/' + materialId);
            axios.delete('/api/materials/' + materialId)
                .then(response => {
                    this.getLesson();
                })
                .catch(error => {
                    console.log(error);
                });
        },
        addHoverClassImg(event) {
            event.preventDefault();
            const materialContainer = event.currentTarget;
            materialContainer.querySelector('.img-material').classList.toggle('low-brightness');
            materialContainer.querySelector('.btn-delete').classList.toggle('active-btn');
        },


        dragStart(id) {
            this.draggedElement = id;
        },
        dragEnter(event) {
            event.target.classList.add("over");
        },
        dragLeave(event) {
            event.target.classList.remove("over");
        },
        dropElement(event) {
            event.preventDefault();
            event.target.classList.remove('over');

            const draggedElement = this.draggedElement;
            const droppedElement = document.querySelector(`[data-id="${draggedElement}"]`);

            const parentElement = event.currentTarget;
            const parentRect = parentElement.getBoundingClientRect();

            if (droppedElement) {
                const droppedRect = droppedElement.getBoundingClientRect();

                console.log(droppedRect.height+" "+droppedRect.width)

                const top = ((event.clientY - parentRect.top - droppedRect.height / 2) / parentRect.height) * 100;
                const left = ((event.clientX - parentRect.left - droppedRect.width / 2) / parentRect.width) * 100;

                droppedElement.style.position = 'absolute';
                droppedElement.style.zIndex = '10';
                droppedElement.style.top = `${top}%`;
                droppedElement.style.left = `${left}%`;

                parentElement.appendChild(droppedElement);

                axios.patch('/api/materials/'+this.draggedElement+'/update',{
                    'position_x': left,
                    'position_y': top,
                })
                    .then(response=>{
                        console.log(response);
                    })
            }
        },

    },
    mounted() {
        this.getLesson();
    }
}
</script>

<style scoped>

</style>
