<template>
  <div class="login-container">
    <div class="registration-page">
      <div class="registration-container">
        <div class="registration-card">
          <form>
            <h1 class="text-center mb-4">Cadastro</h1>

            <div class="form-group mb-3">
              <label for="name">Nome Completo</label>
              <input
                type="text"
                id="name"
                v-model="name"
                class="form-control"
                required
              />
            </div>

            <div class="form-group mb-3">
              <label for="email">E-mail</label>
              <input
                type="email"
                id="email"
                v-model="email"
                class="form-control"
                required
              />
            </div>

            <div class="form-group mb-3">
              <label for="password">Senha</label>
              <div class="input-group">
                <input
                  :type="passwordFieldType"
                  id="password"
                  v-model="password"
                  class="form-control"
                  required
                />
                <button
                  class="btn btn-outline-secondary"
                  type="button"
                  @click="togglePasswordVisibility"
                >
                  <i :class="passwordVisibilityIcon"></i>
                </button>
              </div>
            </div>

            <div class="form-group mb-3">
              <label for="phone">Telefone</label>
              <input
                type="text"
                id="phone"
                v-model="phone"
                class="form-control"
                v-mask="['(##) ####-####', '(##) #####-####']"
              />
            </div>

            <div class="form-group mb-3">
              <label for="document">CPF ou CNPJ</label>
              <input
                type="text"
                id="document"
                v-model="document"
                class="form-control"
                v-mask="documentMask"
                required
              />
            </div>

            <button type="submit" class="btn btn-primary btn-block mt-4" @click="submitForm" :disabled="isLoading">
              {{ isLoading ? 'Cadastrando...' : 'Cadastrar' }}
            </button>
          </form>
        </div>
      </div>
      <div class="col-6">
        <img
          src="https://cdn.prod.website-files.com/67ebdcb55fb853aeb815e297/6807d1d69d08fad7a55568c1_Webclip.png"
          alt="Logo"
          class="img-fluid"
        />
      </div>
    </div>
  </div>
</template>
<script>
import {
  axios
} from "@/utils/imports.js";
export default {
  data() {
    return {
        name: null,
        email: null,
        password: null,
        phone: null,
        document: null,
        isLoading: false,
        isPasswordVisible: false
    };
  },
  computed: {
    documentMask() {
        if (this.document == null) return '###.###.###-##';
        const cleaned = this.document.replace(/\D/g, '');
        return cleaned.length > 11 ? '##.###.###/####-##' : '###.###.###-##';
    },
    passwordFieldType() {
      return this.isPasswordVisible ? 'text' : 'password';
    },
    passwordVisibilityIcon() {
      return this.isPasswordVisible ? 'fa fa-eye-slash' : 'fa fa-eye';
    }
  },
  methods: {
    async submitForm() {
      this.isLoading = true;
      
      if (
        this.name === "" ||
        this.email === "" ||
        this.name === null ||
        this.email === null || 
        this.password === "" ||
        this.document === "" ||
        this.password === null ||
        this.document === null
      ) {
        Swal.fire({
          icon: "error",
          title: "Cuidado",
          text: "Preencha todos os campos.",
        });
        return;
      }

      const payload = {
        Nome: this.name,
        Email: this.email,
        Password: this.password,
        Telefone: this.phone,
        Documento: this.document
      };

      const response = await axios.post(
        "http://localhost:8000/api/usuario/cadastrar-usuario",
        payload
      );
      if(response.data === "O email informado já existe no nosso banco de cadastros.")
        {
            Swal.fire({
            icon: "warning",
            title: "Ops..",
            text: "E-mail já cadastrado",
            });
        } else if (response.data === "O documento informado já existe no nosso banco de cadastros.") {
            Swal.fire({
            icon: "warning",
            title: "Ops..",
            text: "Documento já cadastrado",
            });
        } else if (response.data === "Usuário cadastrado com sucesso.") {
            Swal.fire({
            icon: "success",
            title: "Sucesso",
            text: "Usuário cadastrado com sucesso!",
            });
            this.name = null;
            this.email = null;
            this.password = null;
            this.phone = null;
            this.document = null;
            this.$router.push("/");
        }
      this.isLoading = false;
    },
    togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible;
    }
  }
};
</script>

<style scoped>
.registration-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}
.registration-container {
  width: 100%;
  max-width: 800px;
}
.registration-card {
  padding: 2rem;
  background-color: #2c3e50;
  color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.btn-primary {
  background-color: #f3c200;
  border-color: #f3c200;
  color: #2c3e50;
}
.image-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
