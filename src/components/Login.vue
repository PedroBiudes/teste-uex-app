<template>
  <CContainer class="login-container">
    <CRow>
      <CCol>
        <CCardGroup>
          <CCard class="p-4 card-login login-card-color">
            <CCardBody>
              <CForm>
                <h1>Login</h1>
                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <i class="fa fa-user"></i>
                  </CInputGroupText>
                  <CFormInput
                    placeholder="E-mail"
                    type="email"
                    autocomplete="username email"
                    v-model="email"
                  />
                </CInputGroup>
                <CInputGroup class="mb-4">
                  <CInputGroupText>
                    <i class="fa fa-eye"></i>
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Senha"
                    type="password"
                    @keyup.enter="login"
                    autocomplete="current-password"
                    v-model="password"
                  />
                </CInputGroup>
                <CRow>
                  <CCol class="text-left">
                    <CButton
                      color="primary"
                      class="px-4 login-btn-color"
                      :disabled="loader"
                      v-if="loader"
                    >
                      Carregando...
                    </CButton>
                    <CButton
                      color="primary"
                      class="px-4 login-btn-color"
                      v-else
                      @click="login"
                    >
                      Login
                    </CButton>
                  </CCol>
                  <CCol class="text-right">
                    <CButton
                      color="primary"
                      class="px-4 login-btn-color"
                      @click="this.$router.push('/criar-cadastro')"
                    >
                      Cadastrar
                    </CButton>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol class="text-left">
                    <CButton
                      color="link"
                      class="px-0 login-txt-color"
                      @click="visible = true"
                    >
                      Esqueceu a senha?
                    </CButton>
                  </CCol>
                  <CCol class="text-right"> </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
          <CCard
            text-color="white"
            class="text-center py-5 d-sm-down-none card-login"
            body-wrapper
          >
            <CRow class="text-center">
              <CCol md="12" class="login-img">
                <img
                  src="https://cdn.prod.website-files.com/67ebdcb55fb853aeb815e297/6807d1d69d08fad7a55568c1_Webclip.png"
                  alt="logo"
                />
              </CCol>
            </CRow>
          </CCard>
        </CCardGroup>
      </CCol>
    </CRow>
    <CModal :visible="visible" @close="visible = false">
      <CModalHeader>
        <CModalTitle>Alterar senha</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CFormInput placeholder="E-mail" autocomplete="username email" v-model="emailRecuperacao" />
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="visible = false">Fechar</CButton>
        <CButton color="success" :disabled="loader" @click="changePassword">Enviar e-mail</CButton>
      </CModalFooter>
    </CModal>
  </CContainer>
</template>

<script>
import {
  axios,
  Swal,
  CModal,
  useRouter,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CCardBody,
  CCard,
  CCardGroup,
  CRow,
  CCol,
  CForm,
  CButton,
  CContainer,
} from "@/utils/imports.js";

export default {
  data() {
    return {
      email: null,
      loader: false,
      Desativado: null,
      loader: false,
      visible: false,
      loaderConfirm: false,
      showRecuperarSenhaModal: false,
      emailRecuperacao: null,
      loaderReenvio: false,
      password: null,
      modalValidacao: false,
      codeMFA: null,
      EmailEnviado: null,
    };
  },
  name: "LoginComponent",
  methods: {
    async login() {
      const router = useRouter();
      if (
        this.email === "" ||
        this.password === "" ||
        this.email === null ||
        this.password === null
      ) {
        Swal.fire({
          icon: "error",
          title: "Cuidado",
          text: "Preencha todos os campos.",
        });
        return;
      }

      const payload = {
        Email: this.email,
        Password: this.password,
      };

      const response = await axios.post(
        "http://localhost:8000/api/usuario/login",
        payload
      );
      if (response.data === "Usuario ou senha nao correspondem.") {
        Swal.fire({
          icon: "warning",
          title: "Ops..",
          text: "E-mail ou senha incorretos.",
        });
      } else if (
        response.data === "O email informado não existe no nosso banco de cadastros."
      ) {
        Swal.fire({
          icon: "warning",
          title: "Ops..",
          text: "E-mail não cadastrado",
        });
      } else if (response.data.Token) {
        const token = response.data.Token;
        const id = response.data.Usuario.id;
        localStorage.setItem("user-token", token);
        localStorage.setItem("user-id", id);

        localStorage.setItem("isAuthenticated", "true");

        this.$router.push("/listagem-cadastros");
      }
    },
    async changePassword() {
      this.loader = true;
      if (
        this.emailRecuperacao === "" ||
        this.emailRecuperacao === null
      ) {
        Swal.fire({
          icon: "error",
          title: "Cuidado",
          text: "Preencha o e-mail para recuperação de senha.",
        });
        return;
      }

      const payload = {
        Email: this.emailRecuperacao
      };

      const response = await axios.post(
        "http://localhost:8000/api/usuario/recuperar-senha",
        payload
      );
      if (response.data === "Não foi possível alterar a senha, tente novamente mais tarde.") {
        Swal.fire({
          icon: "warning",
          title: "Ops..",
          text: "Erro ao alterar senha, tente novamente mais tarde.",
        });
      } else if (
        response.data === "O email informado não existe no nosso banco de cadastros."
      ) {
        Swal.fire({
          icon: "warning",
          title: "Ops..",
          text: "E-mail não cadastrado",
        });
      } else if (response.data.Usuario) {
        Swal.fire({
          icon: "success",
          title: "Sucesso",
          text: "E-mail de recuperação enviado com sucesso! Verifique sua caixa de entrada.",
        });
        this.visible = false;
        this.emailRecuperacao = null;
        this.loader = false;
      }
    },
  },
};
</script>
<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
}
.login-card-color {
  background-color: rgba(28, 22, 79);
}
.card-login {
  color: #a58932;
  min-width: 500px;
}
.login-txt-color {
  color: #a58932 !important;
}
.login-btn-color {
  color: #fff;
  background-color: #a58932;
  border-color: #a58932;
}
.confirmacao-btn-color {
  color: #fff;
  background-color: #1c164f;
  border-color: #1c164f;
  margin-left: 10px;
}
.reenvio-btn-color {
  color: #fff;
  background-color: #a8a8a8;
  border-color: #a8a8a8;
}
.login-img img {
  max-width: 100%;
  height: 220px;
}
.card-login:last-child .card-body {
  display: flex;
}
.card-login h2 {
  margin: 0 auto;
  align-self: center;
}
</style>
