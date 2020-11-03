import React from "react";

interface Props {
  title: String;
}

export const Listings = ({ title }: Props) => {
  return <h2>{title}</h2>;
};
