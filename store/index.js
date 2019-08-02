export const state = () => ({

    Url : 'http://luxbuystore.ir' ,

    Auth : false ,

    Login_Modal : false ,
    Register_Modal : false ,

    SiteSetting : {} ,

    User : {} ,

    Provinces : [] ,
    Cities : [] ,

    // All Categories
    Categories : [] ,

    // All Brands
    Brands : [] ,

    // Manage Shopping Cart
    Shopping_Cart : [] ,

    // Manage Compare List
    Compare_List : [] ,

})

export const mutations = {

    // Payloads : Prop , Val , Module , Obj_Assign
    Set_state( state , payload ) {
        if(payload.Module) {
            payload.Obj_Assign
            ? state[payload.Module][payload.Prop] = { ...state[payload.Module][payload.Prop] , ...payload.Val }
            : state[payload.Module][payload.Prop] = payload.Val
        } else {
            payload.Obj_Assign
            ? state[payload.Prop] = { ...state[payload.Prop] , ...payload.Val }
            : state[payload.Prop] = payload.Val
        }
    }

  }