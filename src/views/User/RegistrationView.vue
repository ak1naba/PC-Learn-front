<template>
    <div class="container">
        <div class="form-user">
            <Form @submit="signUp" :validation-schema="schema" class="form-user__inputs" v-slot="{errors}">
                <h2 class="form-user__inputs__title">Регистрация</h2>

                    <Field name="name" type="text" class="input" placeholder="Имя" v-model="name"  :class="{'input-invalid':errors.name}"/>
                    <ErrorMessage name="name" class="alert"/>

                    <Field name="email" type="email" class="input" placeholder="Почта" v-model="email" :class="{'input-invalid':errors.email}" />
                    <ErrorMessage name="email" class="alert"/>


                    <Field name="password" type="password" class="input" placeholder="Пароль" v-model="password" :class="{'input-invalid':errors.password}" />
                    <ErrorMessage name="password" class="alert"/>


                    <Field name="password_confirmation" type="password" class="input" placeholder="Подтвердите пароль" v-model="password_confirmation" :class="{'input-invalid':errors.password_confirmation}"/>
                    <ErrorMessage name="password_confirmation" class="alert"/>




                    <input type="submit" class="btn" value="Зарегистрироваться">
                <div>
                   Зарегистрировавшись, вы принимаете условия Политики конфиденциальности
                </div>
                <div>
                    Есть аккаунт? <a href="../user/login" class="form-user__inputs__link">Войти</a>
                </div>
            </Form>

        </div>
    </div>
</template>




<script >
import '../../../sass/form.scss';
import '../../../sass/authReg.scss'
import '../../../sass/media/authRegMedia.scss'

import axios from "axios";

import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

import ru from 'yup-locale-ru';
yup.setLocale(ru);

export default {
    name: "RegComp",
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
        schema() {
            return yup.object({
                name: yup.string().required().min(2).label('Имя'),
                email: yup.string().required().email().label('Почта'),
                password: yup.string().required().min(8).label('Пароль'),
                password_confirmation: yup.string().required().min(8).oneOf([yup.ref('password')], 'Passwords do not match').label('Подтвердждение пароля'),
            });
        },
    },
    data(){
        return{
            name: null,
            email: null,
            password: null,
            password_confirmation: null,

            message:null,
            errors:{}
        }
    },
    methods:{
        signUp(){
            axios.get('/sanctum/csrf-cookie')
                .then(res => {
                    axios.post('/register', {
                        name: this.name,
                        email: this.email,
                        password: this.password,
                        password_confirmation: this.password_confirmation,
                    }).then(response => {
                        localStorage.setItem('x_xsrf_token', response.config.headers['X-XSRF-TOKEN']);
                        this.$router.push({name: "get.index"});
                        console.log(response);

                        axios.post('/api/userIdOut').
                        then(res=>{
                            console.log(res);
                        }).catch(error=>{
                            console.log(error);
                        });

                        axios.post('/api/registerUserProgress')
                            .then(res => {
                                console.log(res);
                            })
                            .catch(err => {
                                console.log(err);
                            });

                        location.reload();

                    }).catch(error => {
                        this.message="Проверьте данные!";
                    });
                });
        },
    }
}

</script>
