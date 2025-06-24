<template>
  <BaseLayout>
    <div class="container">
      <div class="lesson-block">
        <preloader v-if="isLoading"></preloader>
        <div v-if="!isLoading" class="content-place">
          <div class="lesson-header">
            <h2 class="lesson-block__title">
              {{lesson.title}}
            </h2>
            <a class="back-link" @click="backToMenu">Назад</a>
          </div>
          <p class="lessons-panel__lessons__item__type" v-if="lesson.type_lesson_id==1">Теория</p>
          <p class="lessons-panel__lessons__item__type" v-if="lesson.type_lesson_id==2">Практика</p>
          <p class="lesson-block__text" v-html="lesson.theory"></p>
          <div class="practic-container">
            <div class="relative" >
              <img :src="relative_element.part_img" alt="родительский элемент" class="relative-img">
              <img class="switcher"
                  src="@/assets/icons/switch.png"
                   @click="changeRelativeState"
                   :style="{ left: relative_element.position_x + '%', top: relative_element.position_y + '%' }">
              <div class="place"
                   :class="this.current_state == 2 ? 'active-place' : 'disable-place'"
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
                   @touchmove="touchMoveHandler($event)"
                   @touchend="touchEndHandler($event)"

                   :id="'daughter-' + material.id">
                <img :src="material.part_img" alt="дочерний элемент" class="daughter-img">
              </div>
            </div>
          </div>


          <div class="win" v-if="this.done">
            <BaseButton variant="primary" @click.prevent="getLessonRouter">Далее</BaseButton>
          </div>
        </div>
      </div>
    </div>
  </BaseLayout>

</template>

<script>
import preloader from "@/components/preloader/preloader.vue";
import { authRequest } from '@/api/api.js'
import BaseLayout from '@/layouts/BaseLayout.vue'
import BaseButton from '@/components/form/BaseButton.vue'

export default {
  name: "practic",
  components:{
    BaseButton,
    BaseLayout,
    preloader
  },
  data(){
    return{
      // Передаваемый параметр
      title: this.$route.params.url_title,
      next_lesson: {},
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
      check_request:true,
      finish: false,
    }

  },
  methods: {
    // Начало драга
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
    // Сброс
    dropHandler(event) {
      const index = event.dataTransfer.getData('text/plain');
      const item = document.getElementById(`daughter-${index}`);
      const parent = item.parentNode;
      parent.removeChild(item);
      // Определение блока по местоположения мыши
      let x, y, targetElement;
      x = event.clientX;
      y = event.clientY;
      targetElement = document.elementFromPoint(x, y);
      const targetDiv = targetElement.closest('[id^="relative-"]');

      if (targetDiv) {
        // Проверка на жесткую привязку объектов
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
    // Повтороение позиции за тачем
    touchMoveHandler(event) {
      event.preventDefault();
      const item = document.getElementById('daughter-' + this.current_index);
      const touch = event.touches[0];
      // Получаем координаты мува
      const newX = touch.clientX;
      const newY = touch.clientY;
      // Изменяем положение элемента в реальном времени, следуя за пальцем пользователя
      item.style.position='absolute';
      item.style.zIndex='5';
      item.style.left = newX + 'px';
      item.style.top = newY + 'px';

    },
    // Окночание тачскрина
    touchEndHandler(event) {
      // Получаем элемент, который нужно переместить
      const item = document.getElementById('daughter-' + this.current_index);
      item.style.position = 'static';
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
      authRequest({
        method: 'get',
        url: `/api/lesson/${this.title}`,
      })
        .then(res => {
            if(res.data=="Урок не найден"){
              this.$router.push({
                name: '404',
              });
            }
            this.lesson = res.data;
            this.current_lesson=this.lesson.id
            this.lesson.materials.forEach(item => {
              if (item.relative_element == 1) {
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
              if (item.relative_element == 0) {
                this.daughter_elements.push(item);
              }
              this.isLoading=false;
              this.getNextLesson();
              this.setPlaceSizes();
              this.done=false;
            });
          }
        )
        .catch(err => {
          console.log(err)
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
          if(this.current_state!=2){
            this.current_state++;
          }
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
      authRequest({
        method: 'post',
        url: `/api/progress/find-next`,
        data: {
          lesson_id: this.lesson.id,
          type_lesson_id: this.lesson.type_lesson_id,
        }
      })
        .then((res) => {
          this.next_progress = res.lesson
        })
        .catch((err) => {
          if (err.response.status === 404) {
            this.finish = true
          }
        })
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

          break;
        }
      }
    },
    doneLesson(){
      if(this.check_request){
        this.check_request=false;
        authRequest({
          method: 'post',
          url: `api/progress/done-lesson`,
          data:{
            'lesson_id': this.lesson.id,
          }
        })
          .then(res => {
            console.log(res)
          })
          .catch(err => {
            console.log(err)
          });
      }


    },
    checkDone(){
      if(this.max_state==1 && this.filled_places){
        this.doneLesson();
        this.done=true;
      }
      // Если у нас всего 2 состояния
      if(this.max_state==2 && this.current_state==2 && this.filled_places){
        this.doneLesson();
        this.done=true;
      }
      // Если у нас всего 3 состояния
      if(this.max_state==3 && this.current_state==3 && this.filled_places){
        this.doneLesson();
        this.done=true;
      }
    },
    setImageWidth(){
      const imageElements = document.querySelectorAll('.daughter-img');
      if (window.innerWidth < 1024) {
        imageElements.forEach((imageElement) => {
          // Получаем начальную ширину изображения
          const initialWidth = imageElement.offsetWidth;
          // Вычисляем целевую ширину в 75% от начальной ширины
          const targetWidth = Math.round(initialWidth * 0.70);
          // Устанавливаем ширину изображения
          imageElement.style.width = `${targetWidth}px`;
        });
      }
      if (window.innerWidth < 426) {
        imageElements.forEach((imageElement) => {
          // Получаем начальную ширину изображения
          const initialWidth = imageElement.offsetWidth;
          // Вычисляем целевую ширину в 60% от начальной ширины
          const targetWidth = Math.round(initialWidth * 0.6);
          // Устанавливаем ширину изображения
          imageElement.style.width = `${targetWidth}px`;
        });
      }
    },
    setPlaceSizes() {
      let daughterElements=document.querySelectorAll('.daughter-img');
      daughterElements.forEach((element) => {
        const blockId = element.parentNode.id;
        let indexDaughter= blockId.split('-')[1];
        let placeRelative=document.querySelector(`#relative-${indexDaughter}`);
        placeRelative.style.width=`${element.width}px`;
        placeRelative.style.height=`${element.height}px`;
      });
    },
    getLessonRouter() {
      if (this.finish){
        this.$router.push({
          name: 'game.list',
          params: { type: 'practic' }
        });
        return
      }

      this.$router.push({
        name: 'game.practic',
        params: {
          url_title: this.next_progress.title,
        },
      })
    },
    backToMenu(){
      this.$router.push({
        name: 'game.list',
        params: {
          type: 'practic',
        }})
    }

  },
  mounted() {
    this.getLesson()

    const handleMutations = () => {
      this.checkContent();
      this.checkDone();
    };
    this.checkContent();
    this.checkDone();

    setInterval(() => {
      this.checkContent();
      this.checkDone();
    }, 50);

    setTimeout(() => {
      this.setImageWidth();
      this.setPlaceSizes();
    }, 1500);
  },
}
</script>

<style scoped>

</style>


<style scoped lang="scss">
@import "@/assets/style/colors.scss";

.lesson-block{
  padding: 20px 0px;
  display: flex;
  flex-direction: column;
  gap: 15px;

  .lesson-header{
    display: flex;
    align-items: center;
    justify-content: space-between;

    .lesson-block__title{
      font-size: 1.4em;
    }
    .back-link{
      color: $text-allow;
    }
  }


  .image-block{
    display: flex;
    flex-direction: column;
    gap: 10px;
    img{
      width: 100%;
    }
  }
  .content-place{
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
}

.practic-container{
  display: flex;
  align-items: flex-start;
  gap: 25px;
}
.relative{
  position: relative;

  .switcher{
    position: absolute;
    width: 36px;
    height: 36px;
    z-index: 2;
  }
  .place{
    position: absolute;
    width: 5%;
    height: 5%;
    z-index: 5;
    animation: smoothHighlight 2s ease-in-out infinite;
  }


}
@keyframes smoothHighlight {
  0% {
    border: 2px solid #3f6bd7; /* начальное значение границы блока */
    box-shadow: 0 0 5px rgb(65, 108, 215); /* начальное значение тени блока */
  }
  50% {
    border: 2px solid #98b2f3; /* значение границы блока в середине анимации */
    box-shadow: 0 0 10px rgb(153, 179, 243); /* значение тени блока в середине анимации */
  }
  100% {
    border: 2px solid #3f6bd7; /* конечное значение границы блока */
    box-shadow: 0 0 5px rgb(65, 108, 215); /* конечное значение тени блока */
  }
}

.daughters{
  padding: 15px 0px;
  display: flex;
  flex-direction: column;
  gap: 15px;

  .daughter{
    width: 100%;

  }
}

.disable-place{
  z-index: -10 !important;
}
.active-place{
  z-index: 5 !important;
}



</style>
