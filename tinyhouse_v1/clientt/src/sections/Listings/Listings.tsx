import React from "react";
/* import { useQuery, useMutation } from "../../lib/api"; */
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { Avatar, List, Button, Spin, Alert } from "antd";
import { Listings as ListingsData } from "./__generated__/Listings";
import {
  DeleteListing as DeleteListingData,
  DeleteListingVariables,
} from "./__generated__/DeleteListing";
import { ListingsSkeleton } from "./components";

import "./styles/Listings.css";

const LISTINGS = gql`
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

const DELETE_LISTING = gql`
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
      id
    }
  }
`;

interface Props {
  title: string;
}

export const Listings = ({ title }: Props) => {
  console.log("IN LISTING FUNCTION");
  const { data, loading, error, refetch } = useQuery<ListingsData>(LISTINGS);

  const [
    deleteListing,
    { loading: deleteListingLoading, error: deleteListingError },
  ] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING);
  // `variables` is just _one_ option that can be accepted by the `useQuery` and `useMutation` Hooks.
  const handleDeleteListing = async (id: string) => {
    await deleteListing({ variables: { id } });
    refetch();
  };

  const listings = data ? data.listings : null;
  if (loading) {
    return (
      <div className="listings">
        <ListingsSkeleton title={title} />
      </div>
    );
  }
  if (error) {
    return (
      <div className="listings">
        <ListingsSkeleton title={title} error />
      </div>
    );
  }

  const deleteListingErrorAlert = deleteListingError ? (
    <Alert
      type="error"
      message="Uh oh! Something went wrong :(. Please try again later."
      className="listings__alert"
    />
  ) : null;
  const listingslist = listings ? (
    <List
      itemLayout="horizontal"
      dataSource={listings}
      renderItem={(listing) => (
        <List.Item
          actions={[
            <Button
              type="primary"
              onClick={() => handleDeleteListing(listing.id)}
            >
              Delete
            </Button>,
          ]}
        >
          <List.Item.Meta
            title={listing.title}
            description={listing.address}
            avatar={<Avatar src={listing.image} shape="square" size={48} />}
          />
        </List.Item>
      )}
    />
  ) : null;
  console.log("before inside");
  return (
    <div className="listings">
      {deleteListingErrorAlert}

      <Spin spinning={deleteListingLoading}>
        <h2>{title}</h2>
        {listingslist}
      </Spin>
    </div>
  );
};
