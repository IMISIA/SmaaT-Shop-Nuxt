export const state = () => ({

    // Products In Home Page
    Products : [] ,

    // Management Products In Category Page
    Products_Ctg : [] ,
    Total: 0 ,
    Filters: {
        sizes: [] ,
        brands: [] ,
        colors: [] ,
        warranties: [] ,
        spec: [] ,
    } ,

    Single_Product : {} ,
    Variations_Select : 0 ,
    Validate_Price : true ,

    Requested: {
        spec: false ,
        comments: false ,
        qa: false
    }

})