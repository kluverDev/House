import React, { useState, useEffect } from "react";
import { server } from "../../lib/api";
import {
  DeleteListingData,
  DeleteListingVariables,
  ListingsData,
  Listing,
} from "./types";

const LISTINGS = `
  query Listings {
    listings {
      id
      title
      image
      address
      price
      numOfGuests
      numOfBeds
      numOfBaths
      rating
    }
  }
`;

const DELETE_LISTING = `
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
      id
    }
  }
`;

interface Props {
  title: String;
}

export const Listings = ({ title }: Props) => {
  console.log("IN LISTING FUNCTION");

  const [listings, setListings] = useState<Listing[] | null>(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    console.log("IN FETCH LISTING FUNC");
    const { data } = await server.fetch<ListingsData>({ query: LISTINGS });
    console.log("FETCH LISTING DONE");
    console.log("STATE UPDATED");
    setListings(data.listings);
    console.log(data, " fetched data"); // check the console to see the listings data from our GraphQL Request!
    //console.log("three");
  };

  const deleteListing = async (id: string) => {
    console.log("IN DELETE LISTING FUNC");
    const { data } = await server.fetch<
      DeleteListingData,
      DeleteListingVariables
    >({
      query: DELETE_LISTING,
      variables: {
        id,
      },
    });
    console.log(data, "deleted data");

    fetchListings();
  };

  const listingslist = (
    <ul>
      {listings?.map((listing) => {
        return (
          <li key={listing.id}>
            {listing.title}{" "}
            <button onClick={() => deleteListing(listing.id)}> Delete</button>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div>
      <h2>{title}</h2>
      {listingslist}
    </div>
  );
};
