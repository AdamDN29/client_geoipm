export const routes = {
    HOMEPAGE: () => {
      return `/`;
    },
    IPM_MAPS: () => {
        return `/peta_ipm`;
    },
    GWR_MAPS: () => {
      return `/peta_gwr`;
    },
    TABLE_DATA: () => {
        return `/tabel_data`;
    },
    ABOUT: () => {
        return `/tentang`;
    },
   
    ADMIN: () => {
      return `/admin`;
    },
    LOGIN: () => {
      return `/login`;
    },
     // LIST_PROVINSI: (idProvinsi) => {
    //   return `?id=${idProvinsi}`
    // },
    // ADD_BUDAYA: () => {
    //   return `/admin/addBudaya`;
    // },
    // EDIT_BUDAYA: (id) => {
    //   return `/admin?editBudaya=true&id=${id}`
    // }
  }