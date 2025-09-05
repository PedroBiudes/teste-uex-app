<template>
  <CContainer class="login-container">
    <CRow>
      <CCol>
        <CCardGroup>
          <CCard class="p-4 card-login login-card-color">
            <CCardBody>
              <CForm>
                <h3>Recuperar senha</h3>
                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon name="cilUser" />
                  </CInputGroupText>
                  <CFormInput 
                    placeholder="E-mail"
                    autocomplete="username email"
                    v-model="email"
                  />
                </CInputGroup>
                <CInputGroup class="mb-4">
                  <CInputGroupText>
                    <CIcon name="cilLockLocked" />
                  </CInputGroupText>
                  <CFormInput 
                    placeholder="Senha"
                    type="password"
                    autocomplete="current-password"
                    v-model="password"
                  />
                </CInputGroup>
                <CRow>
                  <CCol class="text-left">
                    <CButton color="primary" class="px-4 login-btn-color" :disabled="loader" v-if="loader">
                      Carregando...
                    </CButton>
                    <CButton color="primary" class="px-4 login-btn-color" v-else @click="login">
                      Login
                    </CButton>
                  </CCol>
                  <CCol class="text-right">
                    <CButton color="primary" class="px-4 login-btn-color" @click="navigate('/cadastro-user')">
                      Cadastrar
                    </CButton>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol class="text-left">
                    <CButton color="link" class="px-0 login-txt-color" @click="navigate('/recuperar-senha')">
                      Esqueceu a senha?
                    </CButton>
                  </CCol>
                  <CCol class="text-right">
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
          <CCard text-color="white" class="text-center py-5 d-sm-down-none card-login" body-wrapper>
            <CRow class="text-center">
              <CCol md="12" class="login-img">
                <img src="https://cdn.prod.website-files.com/67ebdcb55fb853aeb815e297/6807d1d69d08fad7a55568c1_Webclip.png" alt="logo" />
              </CCol>
            </CRow>
          </CCard>
        </CCardGroup>
      </CCol>
    </CRow>
  </CContainer>
</template>

<script>
import {
  axios,
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
    data(){
        return{
            email: null,
            Desativado: null,
            loader: false,
            loaderConfirm: false,
            loaderReenvio: false,
            password: null,
            modalValidacao: false,
            codeMFA: null,
            EmailEnviado: null,
        }
    },
    name: 'LoginComponent',
    methods: {
        async login() {
            const router = useRouter();
            if (this.email === "" || this.password === "" || this.email === null || this.password === null) {
                Swal.fire({
                icon: 'error',
                title: 'Cuidado',
                text: 'Preencha todos os campos.',    
                });
                return;
            }

            const payload = {
                Email: this.email,
                Password: this.password
            };

            const response = await axios.post('http://localhost:8000/api/usuario/login', payload);
            console.log(response);

            if (response.data === 'Usuario ou senha nao correspondem.') {
                Swal.fire({
                icon: 'warning',
                title: 'Ops..',
                text: 'E-mail ou senha incorretos.',    
                });
            } else if(response.data === 'O email informado não existe no nosso banco de cadastros.') {
                Swal.fire({
                icon: 'warning',
                title: 'Ops..',
                text: 'E-mail não cadastrado',    
                });
            } else if(response.data.Token) {
                const token = response.data.token; 
                localStorage.setItem('user-token', token);
                
                localStorage.setItem('isAuthenticated', 'true');
                
                this.$router.push('/listagem-cadastros');
            }
        },
    }
}
</script>
<style scoped>
    .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 70vh;
    }
    .login-card-color{
        background-color: rgba(28, 22, 79);
    }
    .card-login{
        color: #A58932;
        min-width: 500px;
    }
    .login-txt-color{
        color: #A58932 !important;
    }
    .login-btn-color{
        color: #fff;
        background-color: #A58932;
        border-color: #A58932;
    }
    .confirmacao-btn-color{
        color: #fff;
        background-color: #1C164F;
        border-color: #1C164F;
        margin-left: 10px;
    }
    .reenvio-btn-color{
        color: #fff;
        background-color: #A8A8A8;
        border-color: #A8A8A8;
    }
    .login-img img{
        max-width: 100%;
        height: 220px;
    }
    .card-login:last-child .card-body{
        display: flex;
    }
    .card-login h2{
        margin: 0 auto;
        align-self: center;
    }  
</style>