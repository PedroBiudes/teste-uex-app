// Vue
export { ref, reactive, onMounted, nextTick } from "vue";

// Vue Leaflet
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
export { LMap, LTileLayer, LMarker, L };

// Axios
export { default as axios } from "axios";

// CoreUI
export {
  CModal,
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
} from "@coreui/vue";

import Swal from "sweetalert2";
import { useRouter } from "vue-router";
export { Swal, useRouter };