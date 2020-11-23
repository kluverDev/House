export interface Listing {
    id: string;
    title: string;
    image: string;
    address: string;
    price: number;
    numOfGuests: number;
    numOfBeds: number;
    numOfBaths: number;
    rating: number;
  }
//`ListingsData` represents the shape of the `data` field returned from our API

  export type ListingsData = {
    listings: Listing[];
  };
  export interface DeleteListingData {
    deleteListing: Listing;
  }
  export interface DeleteListingVariables {
    id: string;
  }
  //For the Apollo code generator to pick up the GraphQL documents
  // and make static types that reference them, it requires us 
  //to **name all our GraphQL requests**. If we attempt to run our 
  //static type generation command without naming our documents, Apollo 
  //Codegen will throw an error.