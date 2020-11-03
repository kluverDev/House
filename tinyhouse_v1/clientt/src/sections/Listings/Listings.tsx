import React from "react";
import { server } from "../../lib/api";


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

interface Props {
  title: String;
}
export const Listings = ({ title }: Props) => {
    const fetchListings = async () => {
        console.log("one")
      const { data } = await server.fetch({ query: LISTINGS });
      console.log("two")
      console.log(data); // check the console to see the listings data from our GraphQL Request!
      console.log("three")
  
    };
    console.log("body")
  
    return (
      <div>
        <h2>{title}</h2>
        <button onClick={fetchListings}>Query Listings!</button>
      </div>
    );
  };
