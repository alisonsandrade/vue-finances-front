<template>
  <v-container fill-height>
    <v-layout
      justify-center
      align-center
    >
      <v-flex
        xs12
        sm6
        md4
        lg3
      >
        <v-card class="elevation-12">
          <v-toolbar
            color="primary"
            dark
          >
            <v-toolbar-title>{{ texts.toolbar }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-progress-circular
              v-show="isLoading"
              indeterminate
              color="white"
              width="2"
            >
            </v-progress-circular>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <!-- <v-text-field
                v-if="!isLogin"
                prepend-icon="subject"
                name="firstName"
                label="Nome"
                :error-messages="firstNameErrors"
                :success="!$v.user.firstName.$invalid"
                v-model.trim="$v.user.firstName.$model"
              ></v-text-field>
              <v-text-field
                v-if="!isLogin"
                prepend-icon="subject"
                name="lastName"
                label="Sobrenome"
                :error-messages="lastNameErrors"
                :success="!$v.user.lastName.$invalid"
                v-model.trim="$v.user.lastName.$model"
              ></v-text-field>
              <v-text-field
                v-if="!isLogin"
                prepend-icon="person"
                name="username"
                label="Usuário"
                :error-messages="userNameErrors"
                :success="!$v.user.username.$invalid"
                v-model.trim="$v.user.username.$model"
              ></v-text-field>
              <v-text-field
                v-if="!isLogin"
                prepend-icon="perm_contact_calendar"
                name="cpf"
                label="CPF"
                type="text"
                v-model="user.cpf"
              ></v-text-field> -->
              <v-text-field
                prepend-icon="email"
                name="email"
                label="E-mail"
                type="email"
                :error-messages="emailErrors"
                :success="!$v.user.email.$invalid"
                v-model.trim="$v.user.email.$model"
              ></v-text-field>
              <v-text-field
                prepend-icon="lock"
                name="password"
                label="Senha"
                type="password"
                :error-messages="passwordErrors"
                :success="!$v.user.password.$invalid"
                v-model.trim="$v.user.password.$model"
              ></v-text-field>
              <v-text-field
                v-if="!isLogin"
                prepend-icon="lock"
                name="confirmPassword"
                label="Confirmação da Senha"
                type="password"
                :error-messages="confirmPasswordErrors"
                :success="!$v.user.confirmPassword.$invalid"
                v-model.trim="$v.user.confirmPassword.$model"
              ></v-text-field>
              <!-- <v-text-field
                v-if="!isLogin"
                prepend-icon="event"
                name="birthday"
                label="Nascimento"
                type="date"
                v-model="user.birthday"
              ></v-text-field>
              <v-text-field
                v-if="!isLogin"
                prepend-icon="phone"
                name="celular"
                label="Celular"
                type="text"
                v-model="user.celular"
              ></v-text-field> -->
            </v-form>
            <v-btn
              block
              depressed
              color="secondary"
              @click="isLogin = !isLogin"
            >{{ texts.button }}</v-btn>
          </v-card-text>
          <v-card-actions>
            <!-- o v-spacer faz com que o elemento abaixo dele seja jogado para o final da tela -->
            <!-- <v-spacer></v-spacer> -->
            <v-btn
              :disabled="$v.$invalid"
              color="primary"
              block
              large
              @click="submit"
            >{{ texts.toolbar }}</v-btn>
          </v-card-actions>

          <v-snackbar
            v-model="showSnackbar"
            top
            right
            :color="colorSnackbar"
          >
            {{ error }}
            <template v-slot:action="{ attrs }">
              <v-btn
                color="white"
                text
                v-bind="attrs"
                @click="showSnackbar = false"
              >
                Fechar
              </v-btn>
            </template>
          </v-snackbar>

        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { required, email, minLength } from 'vuelidate/lib/validators'
import authService from '@/modules/services/auth-services.js'
import { formatError } from '@/utils'
import env from '@/.env'

export default {
  name: 'Login',
  data: () => ({
    error: undefined,
    isLoading: false,
    isLogin: true,
    showSnackbar: false,
    colorSnackbar: undefined,
    user: {
      // username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  }),
  validations () {
    const validations = {
      user: {
        email: { required, email },
        password: { required, minLength: minLength(6) }
      }
    }
    if (this.isLogin) { return validations }

    // Se estiver cadastrando adicionando a validação ao nome do usuário
    return {
      user: {
        ...validations.user, // Com o sprade é possível pegar todas as validações e incluir novamente nesse função
        // firstName: { required, minLength: minLength(3) },
        // lastName: { required, minLength: minLength(3) },
        // username: { required, minLength: minLength(5) },
        confirmPassword: { required, minLength: minLength(6) }
      }
    }
  },
  computed: {
    texts () {
      return this.isLogin
        ? { toolbar: 'Entrar', button: 'Criar conta' }
        : { toolbar: 'Criar conta', button: 'Já tenho uma conta' }
    },
    // firstNameErrors () {
    //   const errors = []
    //   const firstName = this.$v.user.firstName
    //   if (!firstName.$dirty) { return errors }
    //   !firstName.required && errors.push('Nome é obrigatório')
    //   !firstName.minLength && errors.push(`Insira ao menos ${firstName.$params.minLength.min} caractéres`)
    //   return errors
    // },
    // lastNameErrors () {
    //   const errors = []
    //   const lastName = this.$v.user.lastName
    //   if (!lastName.$dirty) { return errors }
    //   !lastName.required && errors.push('Nome é obrigatório')
    //   !lastName.minLength && errors.push(`Insira ao menos ${lastName.$params.minLength.min} caractéres`)
    //   return errors
    // },
    // userNameErrors () {
    //   const errors = []
    //   const username = this.$v.user.username
    //   if (!username.$dirty) { return errors }
    //   !username.required && errors.push('Usuário é obrigatório')
    //   !username.minLength && errors.push(`Insira ao menos ${username.$params.minLength.min} caractéres`)
    //   return errors
    // },
    emailErrors () {
      const errors = []
      const email = this.$v.user.email
      if (!email.$dirty) { return errors }
      !email.required && errors.push('E-mail é obrigatório')
      !email.email && errors.push('Digite um e-mail válido')
      return errors
    },
    passwordErrors () {
      const errors = []
      const password = this.$v.user.password
      if (!password.$dirty) { return errors }
      !password.required && errors.push('A senha é obrigatória')
      !password.minLength && errors.push(`Insira ao menos ${password.$params.minLength.min} caractéres`)
      return errors
    },
    confirmPasswordErrors () {
      const errors = []
      const confirmPassword = this.$v.user.confirmPassword
      if (!confirmPassword.$dirty) { return errors }
      !confirmPassword.required && errors.push('A confirmação da senha é obrigatória')
      !confirmPassword.minLength && errors.push(`Insira ao menos ${confirmPassword.$params.minLength.min} caractéres`)
      return errors
    }
  },
  methods: {
    async submit () {
      this.isLoading = true
      try {
        // this.isLogin
        //   ? await authService.login(this.user.email, this.user.password)
        //   : await authService.signup(this.user)
        if (this.isLogin) {
          const token = await authService.login(this.user.email, this.user.password)
          this.$store.dispatch('refreshToken', token)
          this.$router.push(this.$route.query.redirect || '/dashboard')
        } else {
          await authService.signup(this.user)
        }
      } catch (error) {
        this.error = formatError(error.response.data)
        this.colorSnackbar = 'info'
        this.showSnackbar = true
      } finally {
        this.isLoading = false
      }
    }
  },
  async created () {
    try {
      // Set o token armazenado no localStorage para o state, a fim de verificar se é válido
      this.$store.dispatch('refreshToken', localStorage.getItem(env.AUTH_TOKEN))
      const userLogged = await authService.getUserAuthenticated()
      if (userLogged) this.$router.push(this.$route.query.redirect || '/dashboard')
    } catch (error) {
      this.error = formatError(error.response.data)
      this.colorSnackbar = 'info'
      this.showSnackbar = true
    }
  }
}
</script>
