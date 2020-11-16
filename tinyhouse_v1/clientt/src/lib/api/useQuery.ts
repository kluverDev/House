import { useState, useEffect } from "react";
import { server } from "./server";

interface State<TData> {
  data: TData | null;
}

export const useQuery = <TData = any>(query: string) => {
  const [state, setState] = useState<State<TData>>({ data: null });
  console.log("in usequery")

  useEffect(() => {
      console.log("usequerry useeffect")
    const fetchApi = async () => {
      const { data } = await server.fetch<TData>({ query });
      console.log('before fetch api set state')

      setState({ data });
      console.log('after fetch api set state')
    };
    fetchApi();
  }, [query]);
  console.log("before eturn state")
  return state;
};
