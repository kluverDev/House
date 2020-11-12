import React from "react";
import { server } from "../../lib/api";
import {
  DeleteListingData,
  DeleteListingVariables,
  ListingsData,
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
  const fetchListings = async () => {
    console.log("one");
    const { data } = await server.fetch<ListingsData>({ query: LISTINGS });
    console.log("two");
    console.log(data); // check the console to see the listings data from our GraphQL Request!
    console.log("three");
  };

  const deleteListing = async () => {
    const { data } = await server.fetch<
      DeleteListingData,
      DeleteListingVariables
    >({
      query: DELETE_LISTING,
      variables: {
        id: "5f9cc1a00d0aa2398f12b0e8",
      },
    });
    console.log(data, "deleted data")
  };
  console.log("body");

  return (
    <div>
      <h2>{title}</h2>
      <button onClick={fetchListings}>Query Listings!</button>
      <button onClick={deleteListing}>Delete Listing</button>
    </div>
  );
};
