<template>
  <div class="pagina-mapa-container">
    <div class="dropdown-container">
      <button @click="isDropdownOpen = !isDropdownOpen" class="dropdown-toggle">
        <span class="icone-usuario"></span>
      </button>

      <div v-if="isDropdownOpen" class="dropdown-menu">
        <a @click="logout" class="dropdown-item">Sair</a>
        <a @click="excluirConta" class="dropdown-item">Excluir Conta</a>
      </div>
    </div>
    <aside class="painel-lateral">
      <CButton @click="modalAdicionar = true" class="btn-outline-success"
        >Adicionar Contato</CButton
      >
      <div class="painel-filtros">
        <h3>Filtros</h3>
        <input type="text" placeholder="Nome/CPF" v-model="searchTerm" />
        <CButton class="btn-outline-info" @click="handleSearch">Pesquisar</CButton>
      </div>
        
      <div class="painel-lista-itens">
        <h3>Contatos</h3>
        <div
          v-for="contact in contacts"
          :key="contact.id"
          class="item-flex"
          @click="selectContactItem(contact)"
        >
          <div class="item-icone">
            <span class="icone-letra">{{ contact.nome.charAt(0) }}</span>
          </div>
          <div class="item-conteudo">
            <h4>{{ contact.nome }}</h4>
            <p>{{ contact.logradouro }}, {{ contact.cidade }}</p>
          </div>
          <div class="item-acoes">
            <button @click="editContact(contact)" class="btn-icone">✏️</button>
            <button @click="deleteContact(contact.id)" class="btn-icone">🗑️</button>
          </div>
        </div>
      </div>
    </aside>

    <main class="secao-mapa">
      <nav class="mapa-nav">
        <button class="ativo">Map</button>
      </nav>
      <div id="mapa-container">
        <div style="width: 100%; height: 100%">
          <l-map :zoom="zoom" :center="mapCenter" style="height: 100%">
            <l-tile-layer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            ></l-tile-layer>

            <l-marker v-if="markerPosition" :lat-lng="markerPosition"></l-marker>
          </l-map>
        </div>
      </div>
    </main>
    <CModal :visible="modalAdicionar" @close="modalAdicionar = false">
      <CModalHeader>
        <CModalTitle>Adicionar Novo Contato</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div class="registration-page">
          <div class="registration-container">
            <div class="registration-card">
              <form>
                <div class="form-group mb-3">
                  <label for="name">Nome:</label>
                  <input
                    type="text"
                    id="name"
                    class="form-control"
                    v-model="nome"
                    required
                  />
                </div>

                <div class="form-group mb-3">
                  <label for="name">CPF:</label>
                  <input
                    type="text"
                    id="cpf"
                    class="form-control"
                    v-model="cpf"
                    v-mask="documentMask"
                    required
                  />
                </div>

                <div class="form-group mb-3">
                  <label for="cep">CEP:</label>
                  <input
                    type="text"
                    id="cep"
                    class="form-control"
                    v-model="cep"
                    @input="formatCEP"
                    @blur="buscarCep"
                    required
                  />
                </div>

                <div class="form-group mb-3">
                  <label for="street">Rua:</label>
                  <input
                    type="text"
                    class="form-control"
                    id="street"
                    v-model="logradouro"
                    required
                  />
                </div>

                <div class="form-group mb-3">
                  <label for="number">Número:</label>
                  <input
                    type="text"
                    class="form-control"
                    id="number"
                    v-model="numero"
                    required
                  />
                </div>

                <div class="form-group mb-3">
                  <label for="neighborhood">Bairro:</label>
                  <input
                    type="text"
                    class="form-control"
                    id="neighborhood"
                    v-model="bairro"
                    required
                  />
                </div>

                <div class="form-group mb-3">
                  <label for="city">Cidade:</label>
                  <input
                    type="text"
                    class="form-control"
                    id="city"
                    v-model="cidade"
                    required
                  />
                </div>

                <div class="form-group mb-3">
                  <label for="state">Estado:</label>
                  <input
                    type="text"
                    class="form-control"
                    id="state"
                    v-model="estado"
                    required
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="modalAdicionar = false">Fechar</CButton>
        <CButton color="success" :disabled="loader" @click="saveNewContact"
          >Salvar Contato</CButton
        >
      </CModalFooter>
    </CModal>
  </div>
</template>
<script>
import {
  LMap,
  Swal,
  LTileLayer,
  LMarker,
  axios,
  ref,
  onMounted,
  CModal,
  CButton
} from "@/utils/imports.js";

const iconUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png";
const shadowUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png";

L.Marker.prototype.options.icon = L.icon({
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

export default {
  setup() {
    const contacts = ref([]);
    const searchTerm = ref("");
    const fetchContacts = async () => {
      try {
        const payload = {
          IdUsuario: localStorage.getItem("user-id"),
          searchTerm: searchTerm.value,
        };
        const response = await axios.post(
          "http://localhost:8000/api/usuario/buscar-contatos",
          payload
        );
        if (response.data && response.data.data) {
          contacts.value = response.data.data;
        } else if (Array.isArray(response.data)) {
          contacts.value = response.data;
        } else {
          contacts.value = [];
        }
      } catch (error) {
        console.error("Erro ao buscar contatos:", error);
      }
    };
    const handleSearch = () => {
      fetchContacts();
    };
    onMounted(() => {
      fetchContacts();
    });

    return {
      contacts,
      searchTerm,
      handleSearch,
    };
  },
  components: {
    LMap,
    LTileLayer,
    LMarker,
  },
  props: ["selectedContact"],
  data() {
    return {
      zoom: 12,
      mapCenter: [-22.2208, -49.9486],
      markerPosition: [-22.2208, -49.9486],
      modalAdicionar: false,
      nome: null,
      cep: null,
      logradouro: null,
      numero: null,
      bairro: null,
      cidade: null,
      estado: null,
      cpf: null,
      busca: null,
      isDropdownOpen: false,
    };
  },
  computed: {
    documentMask() {
      if (this.cpf == null) return "###.###.###-##";
      const cleaned = this.cpf.replace(/\D/g, "");
      return cleaned.length > 11 ? "##.###.###/####-##" : "###.###.###-##";
    },
    formatCEP(){
        let value = this.cep.replace(/\D/g, '');

        if (value.length > 5) {
            value = value.substring(0, 5) + '-' + value.substring(5, 8);
        }

        if (value.length > 9) {
            value = value.substring(0, 9);
        }
        
        this.cep = value;
    }
  },
  methods: {
    async buscarCep(){
        const cepLimpo = this.cep.replace('-', '');

        if (cepLimpo.length !== 8) {
            alert('Por favor, insira um CEP válido com 8 dígitos.');
            return;
        }
        const response = await axios.get(`http://localhost:8000/api/functions/viacep/${cepLimpo}`);
        
        const dadosEndereco = response.data;
        
        this.logradouro = dadosEndereco.logradouro;
        this.bairro = dadosEndereco.bairro;
        this.cidade = dadosEndereco.localidade;
        this.estado = dadosEndereco.uf;
    },
    async logout(){
        localStorage.setItem("isAuthenticated", "false");
        this.$router.push('/');
    },
    async excluirConta(){
        const userId = localStorage.getItem("user-id");
        const response = await axios.get(
          "http://localhost:8000/api/usuario/deletar-usuario/" + userId
        );
        if (response.data === "Usuário deletado com sucesso.") {
          Swal.fire({
            icon: "success",
            title: "Sucesso",
            text: "Conta deletada com sucesso!",
          });
          localStorage.setItem("isAuthenticated", "false");
          this.$router.push("/");
        }
    },
    async buscarContatos() {
      const payload = {
        Search: this.busca,
        Page: 1,
        PageSize: 50,
        IdUsuario: localStorage.getItem("user-id"),
      };

      const response = await axios.post(
        "http://localhost:8000/api/usuario/buscar-contatos",
        payload
      );
      this.contacts.value = response.data;
    },
    async saveNewContact() {
      const payload = {
        cpf: this.cpf,
        nome: this.nome,
        cep: this.cep,
        logradouro: this.logradouro,
        numero: this.numero,
        bairro: this.bairro,
        cidade: this.cidade,
        uf: this.estado,
        id_usuario: localStorage.getItem("user-id"),
      };
        if (!payload.nome || !payload.cep || !payload.logradouro || !payload.numero || !payload.bairro || !payload.cidade || !payload.uf) {
            Swal.fire({
            icon: "warning",
            title: "Cuidado...",
            text: "Por favor, preencha todos os campos obrigatórios.",
          });
            return;
        }

      const response = await axios.post(
        "http://localhost:8000/api/usuario/salvar-contato",
        payload
      );
      this.modalAdicionar = false;
      this.buscarContatos();
    },
    async deleteContact(id) {
      const response = await axios.get(
        "http://localhost:8000/api/usuario/deletar-contato/" + id
      );
      if (
        response.data === "Não foi possível alterar a senha, tente novamente mais tarde."
      ) {
        Swal.fire({
          icon: "success",
          title: "Sucesso",
          text: "Contato deletado com sucesso!",
        });
      }
      this.buscarContatos();
    },
    editContact(contact) {
      this.nome = contact.nome;
      this.cep = contact.cep;
      this.cpf = contact.cpf;
      this.logradouro = contact.logradouro;
      this.numero = contact.numero;
      this.bairro = contact.bairro;
      this.cidade = contact.cidade;
      this.estado = contact.uf;
      this.modalAdicionar = true;
    },
    selectContactItem(newContact) {
      if (newContact && newContact.latitude && newContact.longitude) {
        const newPosition = [newContact.latitude, newContact.longitude];
        this.markerPosition = newPosition;
        this.mapCenter = newPosition;
      } else {
        this.markerPosition = null;
      }
    },
  },
  watch: {},
};
</script>
<style scoped>
.pagina-mapa-container {
  display: flex;
  height: 87vh;
  font-family: Arial, sans-serif;
}

.painel-lateral {
  width: 400px;
  background-color: #f9f9f9;
  padding: 20px;
  border-right: 1px solid #ddd;
  overflow-y: auto;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}
.icone-usuario::before {
  content: '👤'; /* Ícone de boneco Unicode */
  font-size: 20px;
}

.dropdown-container {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 100; 
}

.dropdown-toggle {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dropdown-menu {
  position: absolute;
  top: 50px; 
  left: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 150px;
  display: flex;
  flex-direction: column;
  padding: 5px 0;
}

.dropdown-item {
  padding: 10px 15px;
  text-decoration: none;
  color: #333;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.item-flex {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  gap: 10px;
}

.item-icone {
  width: 40px;
  height: 40px;
  background-color: #ddd;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}

.icone-letra {
  color: #555;
  font-size: 18px;
}

.item-conteudo {
  flex-grow: 1;
}

.item-conteudo h4 {
  margin: 0;
  font-size: 16px;
  font-weight: normal;
}

.item-conteudo p {
  margin: 0;
  font-size: 12px;
  color: #888;
}

.item-detalhes {
  color: #888;
  font-size: 12px;
}

.painel-filtros h3,
.painel-lista-itens h3 {
  color: #333;
  margin-bottom: 10px;
  margin-top: 30px;
}

.painel-filtros select,
.painel-filtros input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.painel-filtros button {
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
}

.item {
  padding: 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
}
.registration-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
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

.item:hover {
  background-color: #e9e9e9;
}
.item h4::before {
  content: " ";
  display: inline-block;
  width: 20px;
  height: 20px;
  background-color: #008000;
  border-radius: 50%;
  margin-right: 10px;
}

.secao-mapa {
  flex-grow: 1;
  position: relative;
}
.mapa-nav {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.mapa-nav button {
  padding: 8px 12px;
  border: none;
  background: none;
  cursor: pointer;
}

.mapa-nav button.ativo {
  background-color: #007bff;
  color: white;
  border-radius: 4px;
}

#mapa-container {
  width: 100%;
  height: 100%;
  background-color: #e6e6e6;
}
</style>
