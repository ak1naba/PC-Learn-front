<template>
    <ControlPanelView>
      <div class="users-panel">
        <h3 class="users-panel__title">
          Пользователи
        </h3>
        <div class="users">
          <div class="filter">
            <div class="filter-params">
              <BaseInput class="long" type="text" v-model="searchText" @input="search()" placeholder="Введите имя или почту пользователя" />
              <select v-model="selectedType" @change="search()" class="type input">
                <option value="">Все</option>
                <option value="1">Администратор</option>
                <option value="2">Ученик</option>
              </select>
            </div>
            <BaseButton @click.prevent="resetFilter" variant="primary">Сбросить</BaseButton>
          </div>
          <div v-if="this.searchText!='' || this.selectedType!=''" class="users-item" v-for="(user, index) in filteredUsers" :key="index">
            <div class="users-item__avatar">
              <img :src="user.avatar" alt="">
            </div>
            <div class="users-item__name">
              {{user.name}}
            </div>
            <div class="users-item__email">
              {{user.email}}
            </div>
            <div class="users-item__role">
              <p v-if="user.role==1">Администратор</p>
              <p v-if="user.role==2">Ученик</p>
            </div>
          </div>

          <div v-if="this.searchText=='' && this.selectedType==''" >
            <div class="users-item" v-for="(user, index) in displayedUsers" :key="index">
              <div class="users-item__avatar">
                <img :src="user.avatar" alt="">
              </div>
              <div class="users-item__name">
                {{user.name}}
              </div>
              <div class="users-item__email">
                {{user.email}}
              </div>
              <div class="users-item__role">
                <p v-if="user.role==1">Администратор</p>
                <p v-if="user.role==2">Ученик</p>
              </div>
              <div class="users-item__dates">
                {{new Date(user.created_at).toLocaleDateString('ru-RU') }}
              </div>
            </div>
            <div class="pagination">
              <button v-if="currentPage > 1" @click="currentPage--">Предыдущая</button>
              <span>{{currentPage}} / {{pageCount}}</span>
              <button v-if="currentPage < pageCount" @click="currentPage++">Следующая</button>
            </div>
          </div>
        </div>

      </div>
    </ControlPanelView>

</template>

<script>
import ControlPanelView from '@/views/admin/ControlPanelView.vue'
import { authRequest } from '@/api/api.js'
import BaseInput from '@/components/form/InputComponent.vue'
import BaseButton from '@/components/form/BaseButton.vue'

export default {
    name: 'UsersPanelView',
  components: { BaseButton, BaseInput, ControlPanelView },
    data() {
        return {
            users: [],
            currentPage: 1,
            perPage: 15,
            searchText:'',
            selectedType:'',
        };
    },
    computed: {
        displayedUsers() {
            const start = (this.currentPage - 1) * this.perPage;
            const end = start + this.perPage;
            return this.users.slice(start, end);
        },
        pageCount() {
            return Math.ceil(this.users.length / this.perPage);
        },
        filteredUsers() {
            return this.users.filter((user) => {
                const searchTerms = this.searchText.toLowerCase().trim().split(" ");
                return searchTerms.every((term) => {
                    return (
                        user.name.toLowerCase().includes(term) ||
                        user.email.toLowerCase().includes(term)
                    );
                }) && (this.selectedType === "" || user.role === parseInt(this.selectedType));
            });
        },
    },
    methods: {
        getUsers() {
          authRequest({
            method: 'get',
            url: '/api/users',
            data: this.form
          })
                .then(res => {
                    this.users = res.data;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        resetFilter(){
            this.selectedType='';
            this.searchText='';
        },
        search() {
        },
    },
    mounted() {
        this.getUsers();
    },
}
</script>

<style scoped lang="scss">
.pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.pagination button {
    background: #ccc;
    border: none;
    padding: 10px;
    margin: 0 5px;
    cursor: pointer;
}

.pagination span {
    display: inline-block;
    padding: 10px;
}

.users-panel{
  display: flex;
  flex-direction: column;
  gap: 15px;

  &__title{
    font-size: 1.4em;
  }

  .users{
    display: flex;
    flex-direction: column;
    gap: 10px;

    .filter{
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;

      &__params{
        display: flex;
        flex-direction: row;
        gap: 10px;
        align-items: center;

        .long{
          width: 100%;
        }
      }
    }

    &-item{
      display: flex;
      align-items: center;
      gap: 15px;

      &__avatar{
        padding-right: 48px;
        padding-bottom: 48px;
        overflow: hidden;
        position: relative;
        overflow: hidden;
        border-radius: 50%;
        img{
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }
}

</style>
