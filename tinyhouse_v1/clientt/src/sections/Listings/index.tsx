import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { Layout, List, Typography } from "antd";
import { ListingCard } from "../../lib/components";
import { LISTINGS } from "../../lib/graphql/queries";
import {
  Listings as ListingsData,
  ListingsVariables,
} from "../../lib/graphql/queries/Listings/__generated__/Listings";
import { ListingsFilter } from "../../lib/graphql/globalTypes";
import { RouteComponentProps , Link} from "react-router-dom";

interface MatchParams {
  location: string;
}
const { Title , Paragraph,Text} = Typography;

const { Content } = Layout;
const PAGE_LIMIT = 8;

export const Listings = ({ match }: RouteComponentProps<MatchParams>) => {
  const { data } = useQuery<ListingsData, ListingsVariables>(LISTINGS, {
    variables: {
      location: match.params.location,
      filter: ListingsFilter.PRICE_LOW_TO_HIGH,
      limit: PAGE_LIMIT,
      page: 1,
    },
  });

  const listings = data ? data.listings : null;
  const listingsRegion = listings ? listings.region : null;

  const listingsRegionElement = listingsRegion ? (
    <Title level={3} className="listings__title">
      Results for "{listingsRegion}"
    </Title>
  ) : null;

  const listingsSectionElement = listings ? (
    <List
      grid={{
        gutter: 8,
        xs: 1,
        sm: 2,
        lg: 4,
      }}
      dataSource={listings.result}
      renderItem={(listing) => (
        <List.Item>
          <ListingCard listing={listing} />
        </List.Item>
      )}
    />
  )  : (
    <div>
      <Paragraph>
        It appears that no listings have yet been created for{" "}
        <Text mark>"{listingsRegion}"</Text>
      </Paragraph>
      <Paragraph>
        Be the first person to create a <Link to="/host">listing in this area</Link>!
      </Paragraph>
    </div>
  );

  return (
    <Content className="listings">
      {listingsRegionElement}

      {listingsSectionElement}
    </Content>
  );
};
