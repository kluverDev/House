import React, { useState, useEffect } from "react";
import { server, useQuery } from "../../lib/api";
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
  console.log("IN LISTING FUNCTION");
  const { data, loading, error, refetch } = useQuery<ListingsData>(LISTINGS);

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
    refetch();

    console.log(data, "deleted data");
  };
  const listings = data ? data.listings : null;
  if (loading) {
    return <h2>Loading.....</h2>;
  }
  if (error) {
    return <h2>Uh oh! Something went wrong - please try again later :(</h2>;
  }

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
