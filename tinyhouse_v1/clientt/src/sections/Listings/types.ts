interface Listing {
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