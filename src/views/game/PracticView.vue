<template>
    <div class="container">
       <div class="lesson-block">
            <preloader v-if="isLoading"></preloader>
           <h2 class="lesson-block__title">
               {{lesson.title}}
           </h2>
           <p class="lessons-panel__lessons__item__type" v-if="lesson.type_lesson_id==1">Теория</p>
           <p class="lessons-panel__lessons__item__type" v-if="lesson.type_lesson_id==2">Практика</p>
           <p class="lesson-block__text" v-html="lesson.theory"></p>
           <div class="practic-container">
               <div class="relative" >
                   <img :src="relative_element.part_img" alt="родительский элемент" class="relative-img">
                   <div class="switcher"
                        @click="changeRelativeState"
                        :style="{ left: relative_element.position_x + '%', top: relative_element.position_y + '%' }"></div>
                   <div class="place"
                        v-if="current_state==2"
                        v-for="material in daughter_elements"
                        :key="material.id"
                        :id="'relative-' + material.id"
                        @dragover.prevent @drop="dropHandler"

                        :style="{ left: material.position_x + '%', top: material.position_y + '%' }"
                        >
                   </div>
               </div>
               <div class="daughters">
                   <div class="daughter"
                        v-for="material in daughter_elements"
                        :key="material.id"
                        :draggable="current_state == 2"

                        @dragstart="dragStartHandler($event, material.id)"
                        @touchstart="dragStartHandler($event, material.id)"

                        @touchend="touchEndHandler($event)"

                        :id="'daughter-' + material.id">
                       <img :src="material.part_img" alt="дочерний элемент" class="daughter-img">
                   </div>
               </div>
           </div>
       </div>
        <div class="win" v-if="this.done">
            <button class="btn btn-primary" @click="doneLesson">Готово</button>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import '../../../sass/lessonUser.scss';
import '../../../sass/media/practicMedia.scss';
import preloader from "@/components/preloader.vue";



export default {
    name: "practic",
    components:{
        preloader
    },
    data(){
        return{
            // Передаваемый параметр
            url_title: this.$route.params.url_title,
            next_lesson: this.$route.query.next_lesson,
            // Информация
            lesson:{},
            relative_element:{},
            daughter_elements:[],
            current_lesson:null,
            // Состояния
            current_state: 1,
            indicate_action:true,
            max_state:0,
            current_index:null,
            filled_places:false,
            done:false,
            // Загрузка
            isLoading:true,

        }

    },
    methods: {
        dragStartHandler(event, index) {
            if (event.type === 'touchstart') {
                // Используем первое касание на элементе
                const touch = event.touches[0];
                event.dataTransfer = event.dataTransfer || new DataTransfer(); // явное создание объекта dataTransfer
                event.dataTransfer.setData('text/plain', index);
                event.dataTransfer.effectAllowed = 'move';
                this.current_index=index;
                // Отменяем действие по умолчанию только если началось перетаскивание
                event.preventDefault();
            } else {
                event.dataTransfer.setData('text/plain', index);
                event.dataTransfer.effectAllowed = 'move';
            }
        },

        dropHandler(event) {

            const index = event.dataTransfer.getData('text/plain');
            const item = document.getElementById(`daughter-${index}`);
            const parent = item.parentNode;
            parent.removeChild(item);

            let x, y, targetElement;
            if (event.type === "touchend") {
                const touch = event.changedTouches[0];
                x = touch.clientX;
                y = touch.clientY;
            } else {
                x = event.clientX;
                y = event.clientY;
            }
            targetElement = document.elementFromPoint(x, y);
            const targetDiv = targetElement.closest('[id^="relative-"]');

            if (targetDiv) {
                if (this.lesson.hard_binding === 1) {
                    let indexRel = targetDiv.id.split('-')[1];
                    let indexDaughter = item.id.split('-')[1];
                    if (indexRel === indexDaughter) {
                        targetDiv.appendChild(item);
                    } else {
                        parent.appendChild(item);
                    }
                } else {
                    if(targetDiv.childElementCount>0){
                        parent.appendChild(item);
                    }else{
                        targetDiv.appendChild(item);
                    }
                }
            } else {
                parent.appendChild(item);
            }
        },


        touchEndHandler(event) {
            // Получаем элемент, который нужно переместить

                const item = document.getElementById('daughter-' + this.current_index);

                // Получаем элемент, над которым находится перемещаемый элемент
                const target = document.elementFromPoint(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
                const targetDiv = target.closest('[id^="relative-"]');

                // Если нашли целевой элемент, перемещаем туда элемент
                if (targetDiv) {
                    if (this.lesson.hard_binding === 1) {
                        let indexRel = targetDiv.id.split('-')[1];
                        let indexDaughter = item.id.split('-')[1];
                        if (indexRel === indexDaughter) {
                            targetDiv.appendChild(item);
                        } else {
                            //parent.appendChild(item);
                        }
                    } else {
                        if(targetDiv.childElementCount>0){
                            //parent.appendChild(item);
                        }else{
                            targetDiv.appendChild(item);
                        }
                    }
                } else {
                    // Возвращаем элемент на прежнее место
                    item.style.left = this.startX + 'px';
                    item.style.top = this.startY + 'px';
                }


        },
        getLesson() {
            return axios.get('/api/lesson/' + this.url_title)
                .then(res => {
                        this.lesson = res.data.data;
                        this.current_lesson=this.lesson.id
                        this.lesson.materials.forEach(item => {
                            if (item.relative_element === 1) {
                                this.relative_element = item;
                                // заполняем данные по родителю
                                let counter = 0;
                                if (this.relative_element.part_img != "") {
                                    counter++;
                                }
                                if (this.relative_element.state && this.relative_element.state.length > 0) {
                                    counter += this.relative_element.state.length;
                                }
                                this.max_state = counter;
                                if(this.max_state==1){
                                    this.current_state=2;
                                }else if(this.max_state==2){
                                    this.current_state=1;
                                }else if(this.max_state==3){
                                    this.current_state=1;
                                }
                            }
                            // заполняем
                            if (item.relative_element === 0) {
                                this.daughter_elements.push(item);
                            }
                        this.isLoading=false;
                        });
                    }
                )
                .catch(err => {
                    console.log(err);
                })
        },
        changeRelativeState() {
            // Если у нас нет состояний
            if(this.max_state==1){
                // Ничего не делаем
            }
            // Если у нас всего 2 состояния
            if(this.max_state==2){
                // если 2 состояния
                if(this.indicate_action){
                    this.current_state++;
                    this.indicate_action = false;
                    this.relative_element.part_img = this.relative_element.state[0].part_img;
                }
            }
            // Если у нас всего 3 состояния
            if(this.max_state==3){
                if(this.indicate_action){
                    if(this.current_state==1){
                        this.current_state++;
                        this.indicate_action = false;
                        this.relative_element.part_img = this.relative_element.state[0].part_img;
                    }
                    if(this.filled_places==true){
                        this.current_state++;
                        this.indicate_action = false;
                        this.relative_element.part_img = this.relative_element.state[1].part_img;
                    }
                }
            }
        },
        getNextLesson() {
            return axios.post('/api/progress/find-next',{
                'lesson_id': this.current_lesson,
                'type_lesson_id':this.lesson.type_lesson_id,
            })
                .then(res => {
                  this.next_lesson=res.data;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        checkContent() {
            // Получите список всех блоков на странице
            const placeElements = document.querySelectorAll('.place');

            for (let i = 0; i < placeElements.length; i++) {
                const placeElement = placeElements[i];
                if (placeElement.children.length != 0) {
                    this.filled_places = true;
                    this.indicate_action = true;

                }else{
                    this.filled_places = false;
                    this.indicate_action = false;
                    break;
                }
            }
        },
        doneLesson(){
            return axios.post('/api/progress/done-lesson',{
                'lesson_id': this.lesson.id,
            })
                .then(res => {
                    console.log(res);
                })
                .catch(err => {
                    console.log(err);
                });

        },
        checkDone(){
            if(this.max_state==1 && this.filled_places){
                this.done=true;
            }
            // Если у нас всего 2 состояния
            if(this.max_state==2 && this.current_state==2 && this.filled_places){
                this.done=true;
            }
            // Если у нас всего 3 состояния
            if(this.max_state==3 && this.current_state==3 && this.filled_places){
                this.done=true;
            }
        }
    },
    mounted() {
        this.getLesson().then(() => {
            this.getNextLesson();
        });
        const handleMutations = () => {
            this.checkContent();
            this.checkDone();
        };

        this.checkContent();
        this.checkDone();

        const observer = new MutationObserver(handleMutations);
        observer.observe(document.body, { subtree: true, childList: true, characterData: true });

    }
}
</script>

<style scoped>

</style>
